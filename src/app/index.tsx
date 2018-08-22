// routes shared by client- and server-sides

import * as React from 'react';
import { Route, Switch } from 'react-router';
import { serialize } from 'serializr';
import * as i18next from 'i18next';
import { AboutPage } from 'app/pages';
import { TodoApp } from 'app/containers/TodoApp';
import { STORE_TODO } from 'app/constants';
import * as locales from 'app/locales';
import { LocalizedContainer } from 'app/containers/LocalizedContainer';
export { Root } from 'app/containers/Root';
export { createStores } from 'app/stores';

// initialize i18next
i18next.init({
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
  <Route path="/:language">
    <LocalizedContainer>
      <Switch>
        <Route path="/about" component={AboutPage} />
        <Route component={TodoApp} />
      </Switch>
    </LocalizedContainer>
  </Route>;
