import '@blueprintjs/core/lib/css/blueprint.css';
import * as React from 'react';
import { Alignment, Navbar, NavbarGroup, NavbarHeading, NavbarDivider } from '@blueprintjs/core';
import { LinkButton } from 'app/components';

export class Root extends React.Component<any, any> {
  render() {
    return (
      <div>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Todo Boilerplate</NavbarHeading>
            <NavbarDivider />
            <LinkButton to="/" className="pt-minimal" icon="home" text="Home" />
            <LinkButton to="/about" className="pt-minimal" icon="person" text="About" />
          </NavbarGroup>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}
