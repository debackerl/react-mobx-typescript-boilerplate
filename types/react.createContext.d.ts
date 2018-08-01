import * as React from "react";

// createContext from react
// https://medium.com/@mtiller/react-16-3-context-api-intypescript-45c9eeb7a384
declare module "react" {
  type Provider<T> = React.ComponentType<{
    value: T;
    children?: React.ReactNode;
  }>;

  type Consumer<T> = React.ComponentType<{
    children: (value: T) => React.ReactNode;
    unstable_observedBits?: number;
  }>;

  interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
  }

  function createContext<T>(defaultValue: T, calculateChangedBits?: (prev: T, next: T) => number): Context<T>;
}