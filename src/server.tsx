import * as React from 'react';
import * as express from "express";
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { Request, Response } from 'express';
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'
import { STORE_APP } from 'app/constants';
import { TodoModel } from 'app/models';
import { createStores, AppStore } from 'app/stores';
import { routes } from 'app';

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
  const rootStore = createStores(null, defaultTodos);
  const appStore = rootStore[STORE_APP] as AppStore;

  const context: any = {};

  // in a StaticRouter, all <Link to="..."> will be translated as <a href="...">
  // https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/StaticRouter.md
  const component =
    <Provider {...rootStore}>
      <StaticRouter location={req.url} basename="/" context={context}>
        {routes}
      </StaticRouter>
    </Provider>;

  const content = renderToString(component);

  if (context.url) {
    res.writeHead(302, { Location: context.url });
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
  </body>
</html>`);
  }

  res.end()
};

const server = express();
 
server.get("/", handler);

server.listen(3000);
