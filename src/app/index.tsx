// routes shared by client- and server-sides

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { serialize } from 'serializr';
import * as i18next from 'i18next';
import { AboutPage } from 'app/pages';
import TodoApp from 'app/containers/TodoApp';
import { STORE_TODO } from 'app/constants';
import * as locales from 'app/locales';
import LocalizedContainer from 'app/containers/LocalizedContainer';
import * as config from 'app/config';

export { default as Root } from 'app/containers/Root';
export { createStores } from 'app/stores';
export * from 'app/config';

// initialize i18next
i18next.init({
  fallbackLng: config.languages[0].language,
  resources: locales,
  debug: process.env.NODE_ENV !== 'production',
  react: {
    wait: process.env.NODE_ENV !== 'production'
  }
});

export function extractState(stores: any /* TODO: type this */): any {
  return {
    [STORE_TODO]: serialize(stores[STORE_TODO])
  };
}

export const routes = 
  <Switch>
    <Route path="/:language">
      <LocalizedContainer>
        <Switch>
          <Route path="/:language/about" component={AboutPage} />
          <Route path="/:language" component={TodoApp} />
        </Switch>
      </LocalizedContainer>
    </Route>
    <Redirect path="/" exact={true} to={config.baseUrl + '/' + config.languages[0].language} />
  </Switch>;
