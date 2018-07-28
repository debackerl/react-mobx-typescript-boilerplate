// Script first executed in browser, containing initialization code

import * as React from 'react';
import { Route, Switch } from 'react-router';
import { AboutPage } from 'app/pages';
import { TodoApp } from 'app/containers/TodoApp';

export const routes = 
  <Switch>
    <Route path="/about" component={AboutPage} />
    <Route component={TodoApp} />
  </Switch>;
