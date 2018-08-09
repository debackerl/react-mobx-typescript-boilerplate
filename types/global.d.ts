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

// add ability to access random properties on window object
interface Window {
  [key: string]: any
}
