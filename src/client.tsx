// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { createStores } from 'app/stores';
import { routes } from 'app';

// enable MobX strict mode
useStrict(true);

// prepare MobX stores
const initialState: any = window['__INITIAL_STATE__'];
const history = createBrowserHistory();
const stores = createStores(history, initialState);

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
