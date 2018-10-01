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
import { LOCATION_ABOUT, LOCATION_HOME } from 'app/constants/locations';
import { withSize } from 'react-sizeme';
import TopScroller from 'app/components/TopScroller';

export { default as Root } from 'app/containers/Root';
export { createStores } from 'app/stores';
export * from 'app/config';

withSize.noPlaceholders = true;

export function createI18n(): Promise<i18next.i18n> {
  return new Promise<i18next.i18n>((resolve, reject) => {
    const debug = process.env.NODE_ENV !== 'production';
    let missed = false;

    const i18n = i18next.createInstance({
      fallbackLng: config.languages[0].language,
      resources: locales,
      debug: debug,
      react: {
        wait: debug
      }
    }, (err) => {
      if(err) {
        reject(err);
      } else if(i18n) {
        resolve(i18n);
      } else {
        missed = true;
      }
    });

    if(missed) resolve(i18n);
  });
}

export function extractState(stores: any /* TODO: type this */): any {
  return {
    [STORE_TODO]: serialize(stores[STORE_TODO])
  };
}

export const routes = 
  <TopScroller>
    <Switch>
      <Route path="/:language">
        <LocalizedContainer>
          <Switch>
            <Route path={LOCATION_ABOUT.path} component={AboutPage} />
            <Route path={LOCATION_HOME.path} component={TodoApp} />
          </Switch>
        </LocalizedContainer>
      </Route>
      <Redirect path="/" exact={true} to={config.baseUrl + '/' + config.languages[0].language} />
    </Switch>
  </TopScroller>;
