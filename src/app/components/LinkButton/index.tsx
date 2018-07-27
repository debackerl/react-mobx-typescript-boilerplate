import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'
import { IButtonProps, Button } from '@blueprintjs/core';

export interface ILinkButtonProps extends IButtonProps {
  to: string;
}

export const LinkButton = withRouter((props: ILinkButtonProps & RouteComponentProps<any>) => {
  const { onClick, to, history } = props;
  return (
    <Button
      {...props}
      onClick={(event: React.MouseEvent<HTMLElement>) => {
        if(onClick) onClick(event);
        history.push(to);
      }}
    />
  );
});

export default LinkButton;
