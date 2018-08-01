import * as React from 'react';
import * as express from "express";
import { useStrict, toJS } from 'mobx';
import { Provider } from 'mobx-react';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import bootstrap from 'react-async-bootstrapper';
import * as serializeJS from 'serialize-javascript';
import { STORE_APP } from 'app/constants';
import { TodoModel } from 'app/models';
import { createStores } from 'app/stores';
import { routes } from 'app';

// https://github.com/ctrlplusb/react-universally
// https://github.com/ctrlplusb/react-async-bootstrapper
// https://github.com/ctrlplusb/react-jobs
// https://github.com/ctrlplusb/react-async-component

// enable MobX strict mode
useStrict(true);

function quoteattr(s: string, preserveCR: boolean = false) {
  const cr = preserveCR ? '&#13;' : '\n';
  return ('' + s) /* Forces the conversion to string. */
      .replace(/&/g, '&amp;') /* This MUST be the 1st replacement. */
      .replace(/'/g, '&apos;') /* The 4 other predefined entities, required. */
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      /*
      You may add other replacements here for HTML only 
      (but it's not necessary).
      Or for XML, only if the named entities are defined in its DTD.
      */ 
      .replace(/\r\n/g, cr) /* Must be before the next replacement. */
      .replace(/[\r\n]/g, cr);
      ;
}

const handler = (req: Request, res: Response) => {
  // default fixtures for TodoStore
  const defaultTodos = [
    new TodoModel('Use Mobx'),
    new TodoModel('Use React', true)
  ];

  // prepare MobX stores
  const stores = createStores(null, defaultTodos);
  const appStore = stores[STORE_APP];

  const reactRouterContext: any = {};

  // in a StaticRouter, all <Link to="..."> will be translated as <a href="...">
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md
  const component =
    <Provider {...stores}>
      <StaticRouter location={req.url} basename="/" context={reactRouterContext}>
        {routes}
      </StaticRouter>
    </Provider>;

  bootstrap(component)
  .then(() => {
    const state = toJS(stores, true);
    const content = renderToString(component);
  
    if (reactRouterContext.url) {
      res.writeHead(302, { Location: reactRouterContext.url });
    } else {
      res.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${quoteattr(appStore.title)}</title>
    <meta name="description" content="${quoteattr(appStore.title)}">
  </head>
  <body>
    <div id="root">${content}</div>
    <script>window.__INITIAL_STATE__ = ${serializeJS(state)}</script>
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
 
server.get("/", handler);

server.listen(3000);
