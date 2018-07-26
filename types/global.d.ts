/** Global definitions for developement **/

// for style loader
declare module '*.css' {
  const styles: any;
  export = styles;
}

// for markdown loader
declare module '*.md' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}

declare module '*.mdx' {
  const MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}
