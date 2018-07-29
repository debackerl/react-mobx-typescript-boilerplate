// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { autorun, useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Root } from 'app/containers/Root';
import { TodoModel } from 'app/models';
import { createStores } from 'app/stores';
import { routes } from 'app';

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

// update header of DOM from store updates
autorun(() => {
  document.title = rootStore.app.title;
  document.querySelector("meta[name='description']").setAttribute("content", rootStore.app.description);
});

// render react DOM
ReactDOM.render(
  // Provider put a reference to each 'store' in the React context,
  // any component can use it by using @inject
  <Provider {...rootStore}>
    <Root>
      <Router history={history}>
        {routes}
      </Router>
    </Root>
  </Provider>,
  document.getElementById('root')
);
