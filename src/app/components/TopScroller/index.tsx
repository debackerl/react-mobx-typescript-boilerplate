import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

interface ScrollToTopProps extends RouteComponentProps<any> {

}

class ScrollToTop extends React.PureComponent<ScrollToTopProps> {
  componentDidUpdate(prevProps: ScrollToTopProps) {
    if(window && this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
