import * as React from 'react'
import * as PropTypes from 'prop-types';
import { createLocation, LocationDescriptor } from "history";
import { IButtonProps, Button } from '@blueprintjs/core';
import * as style from './style.css';

export interface ILinkButtonProps extends IButtonProps {
  target?: string;
  replace?: boolean;
  to: LocationDescriptor;
}

export class LinkButton extends React.PureComponent<ILinkButtonProps> {
  static contextTypes: React.ValidationMap<any> = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented &&
      event.button === 0 &&
      !this.props.target &&
      !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    ) {
      event.preventDefault();

      const { history } = this.context.router;

      if (this.props.replace) {
        history.replace(this.props.to);
      } else {
        history.push(this.props.to);
      }
    }
  }

  render() {
    const { onClick, target, replace, to, ...subprops } = this.props;

    const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;
    const href = history.createHref(location);

    return (
      <a href={href} className={style.normal}>
        <Button {...subprops} onClick={this.handleClick} />
      </a>
    );
  }
}

export default LinkButton;
