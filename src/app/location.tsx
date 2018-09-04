import * as React from 'react';
import { baseUrl } from './config';
import { makeRoute } from './urls';
import { Link } from 'react-router-dom';

// typed version of https://www.npmjs.com/package/react-app-location

export interface ILocation {
  readonly path: string;
}

export class Location<T> implements ILocation {
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  toUrl(parameters: Partial<T>, optionals: Partial<T>): string {
    return makeRoute(baseUrl, this.path, parameters, optionals);
  }

  toLink(parameters: Partial<T>, optionals: Partial<T>): React.ReactElement<any> {
    return <Link to={this.toUrl(parameters, optionals)} />;
  }
}
