import '@blueprintjs/core/lib/css/blueprint.css';
import * as React from 'react';
import { Alignment, Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Popover, Position, Menu, MenuItem } from '@blueprintjs/core';
import { LinkButton } from 'app/components';

// https://medium.com/@ryandrewjohnson/adding-multi-language-support-to-your-react-redux-app-cf6e64250050
// https://blog.alexdevero.com/react-context-multilingual-website-pt1/
// https://www.npmjs.com/package/react-intl
// https://www.npmjs.com/package/@lingui/react
// https://www.npmjs.com/package/react-intl-universal

export class Layout extends React.Component<any, any> {
  changeLanguage(event: React.MouseEvent<HTMLElement>) {
    console.log(event);
  }

  render() {
    const languageMenu = <Menu>
      <MenuItem onClick={this.changeLanguage} text="Français" active={true} />
      <MenuItem onClick={this.changeLanguage} text="Nederlands" />
    </Menu>;

    return (
      <div>
        <Navbar>
          <NavbarGroup>
            <NavbarHeading>Todo Boilerplate</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <LinkButton to="/" className="bp3-minimal" icon="home" text="Home" />
            <LinkButton to="/about" className="bp3-minimal" icon="person" text="About" />
            <NavbarDivider />
            <Popover content={languageMenu} position={Position.BOTTOM}>
              <Button className="bp3-minimal" icon="translate" text="fr" />
            </Popover>
          </NavbarGroup>
        </Navbar>
        {this.props.children}
      </div>
    );
  }
}
