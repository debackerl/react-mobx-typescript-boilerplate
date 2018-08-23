import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router";
import { baseUrl } from 'app/config';
import { makeRoute } from 'app/urls';

export interface LinkerProp {
  pathTo(route: string, parameters?: any): string;
}

const link = <P extends LinkerProp & RouteComponentProps<any>>(Component: React.ComponentType<P>) => withRouter(
  class Linker extends React.PureComponent<Exclude<P, LinkerProp>> {
    pathTo(route: string, parameters?: any): string {
      return makeRoute(baseUrl, route, parameters, this.props.match.params);
    }

    render() {
      return (
        <Component pathTo={this.pathTo.bind(this)} {...this.props} />
      );
    }
  }
);

export default link;
