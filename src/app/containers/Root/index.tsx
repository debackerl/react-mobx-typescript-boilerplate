import * as React from 'react';

// Root container to inject Dev Tools in browser
export class Root extends React.PureComponent<{}> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production' && window) {
      const DevTools = require('mobx-react-devtools').default;
      return <DevTools />;
    }
    return null;
  }

  componentDidMount() {
    console.log('Running in the browser');
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
