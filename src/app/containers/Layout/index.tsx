import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import * as Ant from 'antd';
import { link, LinkerProp } from 'app/components';
import { baseUrl, languages } from 'app/config';
import { MenuProps as NavBarMenuProps } from 'app/containers/NavBar';
import { NavBar } from 'app/containers';
import { makeRoute } from 'app/urls';
import { LOCATION_HOME, LOCATION_ABOUT } from 'app/constants/locations';
import { InjectedTranslateProps, InjectedI18nProps, translate } from 'react-i18next';
import * as style from './style.css';

// https://medium.com/@ryandrewjohnson/adding-multi-language-support-to-your-react-redux-app-cf6e64250050
// https://blog.alexdevero.com/react-context-multilingual-website-pt1/
// https://www.npmjs.com/package/react-intl
// https://www.npmjs.com/package/@lingui/react
// https://www.npmjs.com/package/react-intl-universal

const LooseMenu: any = Ant.Menu; // missing types for triggerSubMenuAction and forceSubMenuRender

interface LayoutProps extends LinkerProp, RouteComponentProps<any>, InjectedTranslateProps, InjectedI18nProps {
  
}

class Layout extends React.PureComponent<LayoutProps> {
  makeLocalizedRoute(language: string): string {
    const match = this.props.match;
    return makeRoute(baseUrl, match.path, Object.assign({}, match.params, {language}));
  }

  static links: {[key: string]: string} = {
    [LOCATION_HOME.path]: 'home',
    [LOCATION_ABOUT.path]: 'about'
  };

  render() {
    const { t, urlTo } = this.props;
    const currentLanguage = this.props.match.params.language;
    const route = this.props.match.path;

    const menu = ({ mobileVersion, onLinkClick }: NavBarMenuProps) => <LooseMenu
        triggerSubMenuAction="click"
        forceSubMenuRender={true}
        mode={mobileVersion ? 'vertical': 'horizontal'}
        theme="light"
        selectedKeys={[route, currentLanguage]}>
      <Ant.Menu.Item key={LOCATION_HOME.path}><Link onClick={onLinkClick} to={urlTo(LOCATION_HOME)}>Home</Link></Ant.Menu.Item>
      <Ant.Menu.Item key={LOCATION_ABOUT.path}><Link onClick={onLinkClick} to={urlTo(LOCATION_ABOUT)}>About</Link></Ant.Menu.Item>
      <Ant.Menu.SubMenu title={<Ant.Icon type="flag"/>}>
        {languages.map(lng => <Ant.Menu.Item key={lng.language}>
          <Link onClick={onLinkClick} to={this.makeLocalizedRoute(lng.language)}>{lng.label}</Link>
        </Ant.Menu.Item>)}
      </Ant.Menu.SubMenu>
    </LooseMenu>;

    return (
      <Ant.Layout className={style.layout}>
        <Ant.Layout.Header className={style.header}>
          <NavBar title={t('title')} menuFactory={menu} />
        </Ant.Layout.Header>
        
        <Ant.Layout.Content className={style.content}>
          {this.props.children}
        </Ant.Layout.Content>
        
        <Ant.Layout.Footer className={style.footer}>
          Footer
        </Ant.Layout.Footer>
      </Ant.Layout>
    );
  }
}

export default link(translate('main')(Layout));
