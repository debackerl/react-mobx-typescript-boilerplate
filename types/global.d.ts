/** Global definitions for developement **/

// for markdown loader
declare module '*.md' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

// for yaml loader
declare module '*.yml' {
  const document: any;
  export default document;
}

declare module '*.yaml' {
  const document: any;
  export default document;
}

// add ability to access random properties on window object
interface Window {
  [key: string]: any
}

// custom declarations
declare module 'bcp47' {
  export function parse(value: string): any;
}

declare module 'react-sizeme' {
  export interface SizeMeProps {
    size: {
      width: number | null;
      height: number | null;
    };
  }
  
  export interface SizeMeOptions {
    monitorWidth?: boolean;
    monitorHeight?: boolean;
    monitorPosition?: boolean;
    refreshRate?: number;
    refreshMode?: 'throttle' | 'debounce';
    noPlaceholder?: boolean;
    children(props: SizeMeProps): JSX.Element;
    render(props: SizeMeProps): JSX.Element;
  }
  
  export class SizeMe extends React.Component<SizeMeOptions> { }

  export interface WithSize {
    (options?: SizeMeOptions): <P extends SizeMeProps>(component: React.ComponentType<P>) => React.ComponentType<Omit<P, keyof SizeMeProps>>;

    noPlaceholders: boolean;
  }

  export const withSize: WithSize;
}

declare module 'app/locales' {
  const locales: any;
  export default locales;
}