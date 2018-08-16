import * as React from 'react';
import * as express from "express";
import { readFileSync } from 'fs';
import * as cheerio from 'cheerio';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createMemoryHistory } from 'history';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import { Helmet } from 'react-helmet';
import bootstrap from 'react-async-bootstrapper';
import * as serializeJS from 'serialize-javascript';
import { Root, routes, createStores, extractState } from 'app';

// https://github.com/ctrlplusb/react-universally
// https://github.com/ctrlplusb/react-async-bootstrapper
// https://github.com/ctrlplusb/react-jobs
// https://github.com/ctrlplusb/react-async-component

const config = {
  indexHtmlPath: './dist/index.html',
  httpPort: process.env.PORT ? Number.parseInt(process.env.PORT) : 3000
};

const indexHtml = readFileSync(config.indexHtmlPath).toString('utf-8');
const index$ = cheerio.load(indexHtml);
const htmlHeadContent = index$.html('head > *');
const htmlBodyContent = index$.html('body > :not(#root)');

// enable MobX strict mode
useStrict(true);

/*const history = createMemoryHistory();
history.push('/');
const stores = createStores(history);
stores[STORE_TODO].addTodo(new TodoModel('Use React', true));
stores[STORE_TODO].addTodo(new TodoModel('Use Mobx'));
console.log(util.inspect(stores[STORE_TODO].todos[0]));
//const state = JSON.stringify(stores[STORE_TODO]) as string;
const state = serialize(stores[STORE_TODO]);
console.log(state);
const hydrated = deserialize(TodoStore, state) as TodoStore;
autorun(() => console.log(hydrated.todos.length));
console.log(util.inspect(hydrated.todos[0]));
hydrated.clearCompleted();*/

const handler = (req: Request, res: Response) => {
  // prepare MobX stores
  const history = createMemoryHistory();
  history.push(req.path);
  const stores = createStores(history);

  const reactRouterContext: any = {};

  // in a StaticRouter, all <Link to="..."> will be translated as <a href="...">
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md
  const component =
    <Provider {...stores}>
      <Root>
        <StaticRouter location={req.url} basename="/" context={reactRouterContext}>
          {routes}
        </StaticRouter>
      </Root>
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

const server = express();
server.disable('x-powered-by');

server.use('/dist', express.static('dist'));
server.get('*', handler);

server.listen(config.httpPort);
