declare module 'react-async-component' {
  interface AsyncComponentProviderProps {
    asyncContext: object;
    rehydrateState?: object;
  }

  interface State {
    resolved: any,
    errors: object
  }

  class AsyncContext {
    getNextId() : number;
    resolved(id: any) : void;
    failed(id: any, error: any) : void;
    getState() : State;
  }

  type ServerMode = 'resolve' | 'defer' | 'boundary';

  interface Config {
    resolve: () => Promise<React.ComponentType<any>>,
    LoadingComponent: React.ComponentType<any>,
    ErrorComponent: React.ComponentType<any>,
    name: string,
    autoResolveES2015Default: boolean,
    env: string,
    serverMode: ServerMode
  }

  export class AsyncComponentProvider extends React.Component<AsyncComponentProviderProps> {}

  export function createAsyncContext() : AsyncContext;

  export function asyncComponent(config: Config) : React.ComponentType<any>;
}
