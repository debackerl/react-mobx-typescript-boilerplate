// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { TodoModel } from 'app/models';
import { createStores } from 'app/stores';
import { Router, Route, Switch } from 'react-router';
import { Root } from 'app/containers/Root';
import AboutApp from 'app/containers/AboutPage.mdx';
import { TodoApp } from 'app/containers/TodoApp';

// enable MobX strict mode
useStrict(true);

// default fixtures for TodoStore
const defaultTodos = [
  new TodoModel('Use Mobx'),
  new TodoModel('Use React', true)
];

// prepare MobX stores
const history = createBrowserHistory();
const rootStore = createStores(history, defaultTodos);

// render react DOM
ReactDOM.render(
  // Provider put a reference to each 'store' in the React context,
  // any component can use it by using @inject
  <Provider {...rootStore}>
    <Root>
      <Router history={history}>
        <Switch>
          <Route path="/" component={TodoApp} />
          <Route path="/about" component={AboutApp} />
        </Switch>
      </Router>
    </Root>
  </Provider>,
  document.getElementById('root')
);
