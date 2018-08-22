import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Alignment, Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Popover, Position, Menu, MenuItem } from '@blueprintjs/core';
import { LinkButton } from 'app/components';
import { baseUrl, languages } from 'app/config';
import { makeRoute } from 'app/urls';
import '@blueprintjs/core/lib/css/blueprint.css';

// https://medium.com/@ryandrewjohnson/adding-multi-language-support-to-your-react-redux-app-cf6e64250050
// https://blog.alexdevero.com/react-context-multilingual-website-pt1/
// https://www.npmjs.com/package/react-intl
// https://www.npmjs.com/package/@lingui/react
// https://www.npmjs.com/package/react-intl-universal

interface LayoutProps extends RouteComponentProps<any> {
  
}

class _Layout extends React.Component<LayoutProps, any> {
  makeLocalizedRoute(language: string): string {
    const match = this.props.match;
    return makeRoute(baseUrl, match.path, Object.assign({}, match.params, {language}));
  }

  render() {
    const currentLanguage = this.props.match.params.language;

    const languageMenu = <Menu>
      {languages.map(x => <Link key={x.language} to={this.makeLocalizedRoute(x.language)}><MenuItem text={x.label} active={x.language === currentLanguage} /></Link>)}
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

export const Layout = withRouter(_Layout);
export default Layout;
