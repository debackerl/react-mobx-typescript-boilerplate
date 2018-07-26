import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

import * as React from 'react';
//import * as style from './style.css';
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { Alignment, Navbar, NavbarGroup, NavbarHeading, NavbarDivider, Button } from '@blueprintjs/core';
//import { Header } from 'app/components/Header';
//import { TodoList } from 'app/components/TodoList';
//import { Footer } from 'app/components/Footer';
import { TodoStore, RouterStore } from 'app/stores';
import {
  STORE_TODO,
  STORE_ROUTER,
  TODO_FILTER_LOCATION_HASH,
  TodoFilter
} from 'app/constants';

export interface TodoAppProps extends RouteComponentProps<any> {
  /** MobX Stores will be injected via @inject() **/
  [STORE_ROUTER]: RouterStore;
  [STORE_TODO]: TodoStore;
}

export interface TodoAppState {
  filter: TodoFilter;
}

@inject(STORE_TODO, STORE_ROUTER)
@observer
export class TodoApp extends React.Component<TodoAppProps, TodoAppState> {
  constructor(props: TodoAppProps, context: any) {
    super(props, context);
    this.state = { filter: TodoFilter.ALL };
  }

  componentWillMount() {
    this.checkLocationChange();
  }

  componentWillReceiveProps(nextProps: TodoAppProps, nextContext: any) {
    this.checkLocationChange();
  }

  checkLocationChange() {
    const router = this.props[STORE_ROUTER] as RouterStore;
    const filter = Object.keys(TODO_FILTER_LOCATION_HASH)
      .map((key) => Number(key) as TodoFilter)
      .find(
        (filter) => TODO_FILTER_LOCATION_HASH[filter] === router.location.hash
      );
    this.setState({ filter });
  }

  /*private handleFilter = (filter: TodoFilter) => {
    const router = this.props[STORE_ROUTER] as RouterStore;
    const currentHash = router.location.hash;
    const nextHash = TODO_FILTER_LOCATION_HASH[filter];
    if (currentHash !== nextHash) {
      router.replace(nextHash);
    }
  };*/

  getFilteredTodo(filter: TodoFilter) {
    const todoStore = this.props[STORE_TODO] as TodoStore;
    switch (filter) {
      case TodoFilter.ACTIVE:
        return todoStore.activeTodos;
      case TodoFilter.COMPLETED:
        return todoStore.completedTodos;
      default:
        return todoStore.todos;
    }
  }

  render() {
    //const todoStore = this.props[STORE_TODO] as TodoStore;
    //const { children } = this.props;
    //const { filter } = this.state;
    //const filteredTodos = this.getFilteredTodo(filter);

    /*const footer = todoStore.todos.length && (
      <Footer
        filter={filter}
        activeCount={todoStore.activeTodos.length}
        completedCount={todoStore.completedTodos.length}
        onClearCompleted={todoStore.clearCompleted}
        onChangeFilter={this.handleFilter}
      />
    );

    return (
      <div className={style.normal}>
        <Header addTodo={todoStore.addTodo} />
        <TodoList
          todos={filteredTodos}
          completeAll={todoStore.completeAll}
          deleteTodo={todoStore.deleteTodo}
          editTodo={todoStore.editTodo}
        />
        {footer}
        {children}
      </div>
    );*/

    // https://github.com/sussol/sussol-react-table/blob/master/src/SussolReactTable.js

    /*const cellRenderer = (rowIndex: number, columnIndex: number) => {
      return <EditableCell
        value={(rowIndex * 10).toFixed(2)}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        interactive={true}
        />
    };

    <Table numRows={5}>
      <Column cellRenderer={cellRenderer} />
    </Table>*/

    return (
      <div>
        <Navbar>
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Blueprint</NavbarHeading>
            <NavbarDivider />
            <Button className="pt-minimal" icon="home" text="Home" />
            <Button className="pt-minimal" icon="document" text="Files" />
          </NavbarGroup>
        </Navbar>
        <div
          className="ag-theme-balham"
          style={{
            height: '500px',
            width: '600px'
          }}
        >
        </div>
      </div>
    );
  }
}
