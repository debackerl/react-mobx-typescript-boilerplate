// routes shared by client- and server-sides

import * as React from 'react';
import { Route, Switch } from 'react-router';
import { serialize } from 'serializr';
import { AboutPage } from 'app/pages';
import { TodoApp } from 'app/containers/TodoApp';
import { STORE_TODO } from 'app/constants';

export { Root } from 'app/containers/Root';
export { createStores } from 'app/stores';

export function extractState(stores: any /* TODO: type this */): any {
  throw new Error();
  return {
    [STORE_TODO]: serialize(stores[STORE_TODO])
  };
}

export const routes = 
  <Switch>
    <Route path="/about" component={AboutPage} />
    <Route component={TodoApp} />
  </Switch>;
