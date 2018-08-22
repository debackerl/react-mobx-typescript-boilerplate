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

declare module 'app/locales' {
  const locales: any;
  export default locales;
}