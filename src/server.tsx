import * as React from 'react';
import * as express from 'express';
import * as http from 'http';
import { readFileSync } from 'fs';
import * as cheerio from 'cheerio';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createMemoryHistory } from 'history';
import { Request, Response, NextFunction } from 'express';
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet';
import bootstrap from 'react-async-bootstrapper';
import { I18nextProvider } from 'react-i18next';
import * as serializeJS from 'serialize-javascript';
import * as Negotiator from 'negotiator';
import * as bcp47 from 'bcp47';
import { Root, routes, createI18n, createStores, extractState, baseUrl } from 'app';
import { Server } from 'http';

// https://github.com/ctrlplusb/react-universally
// https://github.com/ctrlplusb/react-async-bootstrapper
// https://github.com/ctrlplusb/react-jobs
// https://github.com/ctrlplusb/react-async-component

// enable MobX strict mode
useStrict(true);

const config = {
  indexHtmlPath: './dist/index.html',
  httpPort: process.env.PORT ? Number.parseInt(process.env.PORT) : 3000
};

process.on('unhandledRejection', (reason, promise) => console.error(`Unhandled promise rejection: `, reason));

const indexHtml = readFileSync(config.indexHtmlPath).toString('utf-8');
const index$ = cheerio.load(indexHtml);
const htmlHeadContent = index$.html('head > *');
const htmlBodyContent = index$.html('body > :not(#root)');

function localeDetector(allowed: Array<string>): (req: Request) => string {
  const allowedMap = new Set<string>(allowed);

  return (req: Request) => {
    const negotiator = new Negotiator(req);
    const languages = negotiator.languages();
    let locale = allowed[0];
    for(const lang of languages) {
      const parsed = bcp47.parse(lang);
      if(parsed) {
        const code = parsed.langtag.language.language;
        if(code && allowedMap.has(code)) {
          locale = code;
          break;
        }
      }
    }
    return locale;
  };
}

const shutdownMiddleware = (server: Server, timeout: number) => {
  let shuttingDown = false;

  const shutdown = () => {
    if(shuttingDown) return;
    shuttingDown = true;

    console.log('Shutting down...');

    setTimeout(() => {
      console.log('Forcing server shutdown.');
      process.exit(1);
    }, timeout);

    server.close(() => {
      console.log('All connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown); // sent by CTRL-C
  process.on('SIGTERM', shutdown); // sent by "docker stop" command

  return (req: Request, res: Response, next: NextFunction) => {
    if(!shuttingDown) return next();
    res.set('Connection', 'close');
    res.status(503).send('Server is shutting down.');
  };
};

const handler = async (req: Request, res: Response) => {
  console.log('Render', req.url);

  // prepare MobX stores
  const history = createMemoryHistory();
  history.push(req.path);
  const stores = createStores(history);

  const i18n = await createI18n();

  const reactRouterContext: any = {};

  // in a StaticRouter, all <Link to="..."> will be translated as <a href="...">
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md
  const component =
    <Provider {...stores}>
      <I18nextProvider i18n={i18n}>
        <Root>
          <StaticRouter location={req.url} basename={baseUrl} context={reactRouterContext}>
            {routes}
          </StaticRouter>
        </Root>
      </I18nextProvider>
    </Provider>;

  bootstrap(component)
  .then(() => {
    const state = extractState(stores);
    const content = renderToString(component);
    const helmet = Helmet.renderStatic();

    if (reactRouterContext.url) {
      // send redirect to browser
      res.writeHead(302, { Location: reactRouterContext.url });
    } else {
      // send page to browser
      res.write(`<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${htmlHeadContent}
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <script>window.__INITIAL_STATE__ = ${serializeJS(state)}</script>
    <div id="root">${content}</div>
    ${htmlBodyContent}
  </body>
</html>`);
    }
    res.end();
  })
  .catch((err: Error) => {
    console.log(err);

    res.writeHead(500);
    res.write('Server error');
    res.end();
  });
};

// create HTTP server

const httpApp = express();
const httpServer = http.createServer(httpApp);

httpApp.disable('x-powered-by');

// handle graceful shutdown

httpApp.use(shutdownMiddleware(httpServer, 30000));

// serve static files

httpApp.use('/dist', express.static('dist'));

// redirect unspecified language

const detectLocale = localeDetector(['en', 'fr']);

httpApp.get('/', (req: Request, res: Response) => {
  const lng = detectLocale(req);
  res.redirect(301, '/' + lng);
});

// serve React pages

httpApp.get('*', handler);

// start server

httpServer.listen(config.httpPort);
