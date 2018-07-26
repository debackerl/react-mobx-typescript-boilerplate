import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { IButtonProps, Button } from '@blueprintjs/core';

export interface ILinkButtonProps extends IButtonProps {
  to: string;
}

class _LinkButton extends React.Component<ILinkButtonProps & RouteComponentProps<any>> {
  render() { 
    const { onClick, to, history } = this.props;
    return (
      <Button
        {...this.props}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          if(onClick) onClick(event);
          history.push(to);
        }}
      />
    );
  }
}

export const LinkButton = withRouter(_LinkButton);

export default LinkButton;
