import * as React from 'react';
import { translate as _translate } from 'react-i18next';

type IReactComponent<P = any> =
    React.ComponentClass<P>
    | React.StatelessComponent<P>

// There is a typing issue with react-i18next's translate function preventing use as decorator.
// In TypeScript, a decorator's function must return same type as input possibly extented.
// The original translate() function is removing i18n and t props from the output's type.

export function translate(...namespaces: string[]): <T extends IReactComponent>(component: T) => T {
  return _translate(namespaces) as (<T extends IReactComponent>(component: T) => T);
}

export default translate;
