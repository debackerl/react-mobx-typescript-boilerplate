import * as React from 'react';
import { throttle } from 'lodash';
import Popover from 'antd/lib/popover';
import Icon from 'antd/lib/icon';
import * as style from './style.css';
import { Row } from 'antd';

export interface MenuProps {
  onLinkClick?: () => void;
  mobileVersion?: boolean;
}

interface NavBarProps {
  mobileBreakPoint?: number;
  applyViewportChange?: number;
  activeLinkKey?: String;
  title: string;
  menuFactory: React.ComponentType<MenuProps>;
}

interface NavBarState {
  viewportWidth: number;
  menuVisible: boolean;
}

class NavBar extends React.Component<NavBarProps, NavBarState> {
  public static defaultProps: Partial<NavBarProps> = {
    mobileBreakPoint: 575,
    applyViewportChange: 250,
    activeLinkKey: null
  };

  state: NavBarState = {
    viewportWidth: 0,
    menuVisible: false,
  };

  componentDidMount() {
    this.saveViewportDimensions();
    window.addEventListener('resize', this.saveViewportDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.saveViewportDimensions);
  }

  handleMenuVisibility = (menuVisible: boolean) => {
    this.setState({ menuVisible });
  };

  saveViewportDimensions = throttle(() => {
    this.setState({
      viewportWidth: window.innerWidth,
    })
  }, this.props.applyViewportChange);

  render() {
    const MenuMarkup = this.props.menuFactory;

    if (this.state.viewportWidth > this.props.mobileBreakPoint) {
      // desktop
      return (
        <Row type="flex" justify="space-between" align="middle">
          <div>
            {this.props.title}
          </div>
          <MenuMarkup />
        </Row>
      );
    } else {
      // mobile
      return (
        <Row type="flex" justify="space-between" align="middle">
          <div>
            {this.props.title}
          </div>
          <Popover
            content={<MenuMarkup
              onLinkClick={() => this.handleMenuVisibility(false)}
              mobileVersion
              // className='to-override-mobile-menu-class'
              />
            }
            trigger="click"
            placement="bottom"
            visible={this.state.menuVisible}
            onVisibleChange={this.handleMenuVisibility}
          >
            <Icon
              className={style.iconHamburger}
              type="menu"
            />
          </Popover>
        </Row>
      );
    }
  }
}

export default NavBar;
