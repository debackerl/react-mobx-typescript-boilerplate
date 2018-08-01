// react-async-bootstrapper
declare module 'react-async-bootstrapper' {
  interface Options {
    componentWillUnmount: boolean
  }

  // 'context' can be accessed as the 'context' property of any component in the React tree.
  export default function asyncBootstrapper(app: React.ReactElement<any>, options? : Options, context? : any) : Promise<void>;
}
