// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { Root, routes, createStores } from 'app';

// enable MobX strict mode
useStrict(true);

// prepare MobX stores
const initialState: any = window['__INITIAL_STATE__'];
const history = createBrowserHistory();
const stores = createStores(history, initialState);

// render react DOM
ReactDOM.render(
  // Provider put a reference to each 'store' in the React context,
  // any component can use it by using @inject
  <Provider {...stores}>
    <Root>
      <Router history={history}>
        {routes}
      </Router>
    </Root>
  </Provider>,
  document.getElementById('root')
);
