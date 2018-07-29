This directory contains implementation of the app to be executed in the browser,
or on the server using SSR.

Mobx stores are only accessed by containers, not components. Containers may request initial
data from their componentDidMount() function. In turn, the store may request data asynchronously
to a web API.

If containers are asynchronously loading data from their componentDidMount() function,
the result won't be visible to server's renderToString(), because the latter returns
immediatly. Consequently, containers requiring data to be loaded, must provide a function
to load it, componentWillPreRender().

The stores live as long as the SPA is loaded in the browser. Switching from one page to another
won't reset those. A store is similar to a local database.

'props' is passed by parent component, 'state' is private to the component. 'state' can only be updated
through setState(), which may update the state asynchronously. It can also accept a function called when
state is ready to be upated, with old state as parameter.

# Resources

Calling asynchronous functions from mobx actions:

https://mobx.js.org/best/actions.html

SSR with mobx:

https://github.com/Xerios/mobx-isomorphic-starter
https://hackernoon.com/asynchronous-server-side-rendering-with-react-3860c05f8a5e
https://medium.com/@foxhound87/state-management-hydration-with-mobx-we-must-react-ep-05-1922a72453c6
stylesheet: https://github.com/ipatate/react-mobx-ssr/blob/master/src/server/render.js
https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/guides/server-rendering.md

Async component loading:

https://github.com/mhaagens/react-mobx-react-router4-boilerplate

i18n:

https://github.com/alexvcasillas/react-mobx-router

https://github.com/mobxjs/mobx-state-tree
