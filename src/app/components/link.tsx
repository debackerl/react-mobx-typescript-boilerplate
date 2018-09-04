import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router";
import { baseUrl } from 'app/config';
import { ILocation } from 'app/location';
import { makeRoute } from 'app/urls';

export interface LinkerProp {
  urlTo(location: ILocation, parameters?: any): string;
}

const link = <P extends LinkerProp & RouteComponentProps<any>>(Component: React.ComponentType<P>) => withRouter(
  class Linker extends React.PureComponent<Exclude<P, LinkerProp>> {
    urlTo = (location: ILocation, parameters?: any) => (
      makeRoute(baseUrl, location.path, parameters, this.props.match.params)
    );

    render() {
      return (
        <Component urlTo={this.urlTo} {...this.props} />
      );
    }
  }
);

export default link;
