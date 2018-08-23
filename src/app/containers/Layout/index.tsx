import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { Alignment, Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button, Popover, Position, Menu, MenuItem } from '@blueprintjs/core';
import { link, LinkerProp, LinkButton } from 'app/components';
import { baseUrl, languages } from 'app/config';
import { makeRoute } from 'app/urls';
import { InjectedTranslateProps, InjectedI18nProps, translate } from 'react-i18next';
import '@blueprintjs/core/lib/css/blueprint.css';

// https://medium.com/@ryandrewjohnson/adding-multi-language-support-to-your-react-redux-app-cf6e64250050
// https://blog.alexdevero.com/react-context-multilingual-website-pt1/
// https://www.npmjs.com/package/react-intl
// https://www.npmjs.com/package/@lingui/react
// https://www.npmjs.com/package/react-intl-universal

interface LayoutProps extends LinkerProp, RouteComponentProps<any>, InjectedTranslateProps, InjectedI18nProps {
  
}

class Layout extends React.PureComponent<LayoutProps> {
  makeLocalizedRoute(language: string): string {
    const match = this.props.match;
    return makeRoute(baseUrl, match.path, Object.assign({}, match.params, {language}));
  }

  render() {
    const { t, pathTo } = this.props;
    const currentLanguage = this.props.match.params.language;

    const languageMenu = <Menu>
      {languages.map(x => <Link key={x.language} to={this.makeLocalizedRoute(x.language)}><MenuItem text={x.label} active={x.language === currentLanguage} /></Link>)}
    </Menu>;

    return (
      <div>
        <Navbar>
          <NavbarGroup>
            <NavbarHeading>{t('title')}</NavbarHeading>
          </NavbarGroup>
          <NavbarGroup align={Alignment.RIGHT}>
            <LinkButton to={pathTo('/:language')} className="bp3-minimal" icon="home" text="Home" />
            <LinkButton to={pathTo('/:language/about')} className="bp3-minimal" icon="person" text="About" />
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

export default link(translate('main')(Layout));
