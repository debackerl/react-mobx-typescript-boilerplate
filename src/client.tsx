// Script first executed in browser, containing initialization code

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import { I18nextProvider } from 'react-i18next';
import { Root, routes, createI18n, createStores } from 'app';

function isModernBrowser() {
  return window.Promise && window.fetch && window.Symbol;
}

function loadScript(src: string, done: (error?: Error) => void) {
  let js = document.createElement('script');
  js.src = src;
  js.onload = function() {
    done();
  };
  js.onerror = function() {
    done(new Error('Failed to load script ' + src));
  };
  document.head.appendChild(js);
}

async function main() {
  console.log('Edition:', process.env.NODE_ENV);

  // enable MobX strict mode
  useStrict(true);

  // prepare MobX stores
  const initialState: any = window['__INITIAL_STATE__'];
  const history = createBrowserHistory();
  const stores = createStores(history, initialState);

  const i18n = await createI18n();

  // render react DOM
  ReactDOM.render(
    // Provider put a reference to each 'store' in the React context,
    // any component can use it by using @inject
    <Provider {...stores}>
      <I18nextProvider i18n={i18n}>
        <Root>
          <Router history={history}>
            {routes}
          </Router>
        </Root>
      </I18nextProvider>
    </Provider>,
    document.getElementById('root')
  );
}

if(isModernBrowser()) {
  main();
} else {
  console.log('Loading polyfills...');
  //loadScript(baseUrl + '/dist/polyfills.js', function(error) {
  loadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=es6', function(error) {
    if(error) {
      console.log('Could not load polyfills: ', error);
    } else {
      console.log('Polyfills loaded.');
      main();
    }
  });
}
