// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { autorun, useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { STORE_APP } from 'app/constants';
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
const stores = createStores(history, defaultTodos);
const appStore = stores[STORE_APP];

// update header of DOM from store updates
autorun(() => {
  document.title = appStore.title;
  document.querySelector("meta[name='description']").setAttribute("content", appStore.description);
});

// Root container to inject Dev Tools in browser
class Root extends React.Component<any, any> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools />;
    }
    return null;
  }

  render() {
    return (
      <div className="container">
        {this.props.children}
        {this.renderDevTool()}
      </div>
    );
  }
}

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
