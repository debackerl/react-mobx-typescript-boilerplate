import * as React from 'react';
import { RouteComponentProps, withRouter } from "react-router";
import { Location } from 'app/location';

export interface LinkerProp {
  urlTo<T>(location: Location<T>, parameters?: any): string;
}

const link = <P extends LinkerProp & RouteComponentProps<any>>(Component: React.ComponentType<P>) => withRouter(
  class Linker extends React.PureComponent<Exclude<P, LinkerProp>> {
    urlTo = <T extends {}>(location: Location<T>, parameters?: Partial<T>) => (
      location.toUrl(parameters, this.props.match.params)
    );

    render() {
      return (
        <Component urlTo={this.urlTo} {...this.props} />
      );
    }
  }
);

export default link;
