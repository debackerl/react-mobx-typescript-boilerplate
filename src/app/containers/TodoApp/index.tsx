import 'antd/dist/antd.less';

import * as React from 'react';
import { Helmet } from "react-helmet";
import { inject, observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import { translate, InjectedTranslateProps, InjectedI18nProps } from 'react-i18next';
import { Header, TodoList, Footer } from 'app/components';
import { TodoModel } from 'app/models';
import Layout from 'app/containers/Layout';
import { AppStore, TodoStore, RouterStore } from 'app/stores';
import {
  STORE_APP,
  STORE_TODO,
  STORE_ROUTER,
  TODO_FILTER_LOCATION_HASH,
  TodoFilter
} from 'app/constants';
import * as style from './style.css';

console.log('Test CSS support: ' + style.normal);

interface TodoAppProps extends RouteComponentProps<any>, InjectedTranslateProps, InjectedI18nProps {
  /** MobX Stores will be injected via @inject() **/
  [STORE_APP]: AppStore;
  [STORE_ROUTER]: RouterStore;
  [STORE_TODO]: TodoStore;
}

interface TodoAppState { }

@inject(STORE_APP, STORE_TODO, STORE_ROUTER)
@observer
class TodoApp extends React.Component<TodoAppProps, TodoAppState> {
  constructor(props: TodoAppProps, context: any) {
    super(props, context);
  }

  bootstrap() {
    const store = this.props[STORE_TODO] as TodoStore;
    store.addTodo(new TodoModel('Use React', true));
    store.addTodo(new TodoModel('Use Mobx'));
  }

  getFilter(): TodoFilter {
    const router = this.props[STORE_ROUTER] as RouterStore;
    return Object.keys(TODO_FILTER_LOCATION_HASH)
      .map((key) => Number(key) as TodoFilter)
      .find(
        (filter) => TODO_FILTER_LOCATION_HASH[filter] === router.location.hash
      );
  }

  private handleFilter = (filter: TodoFilter) => {
    const router = this.props[STORE_ROUTER] as RouterStore;
    const currentHash = router.location.hash;
    const nextHash = TODO_FILTER_LOCATION_HASH[filter];
    if (currentHash !== nextHash) {
      router.replace(nextHash);
    }
  };

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
    const todoStore = this.props[STORE_TODO] as TodoStore;
    const { t, children } = this.props;
    const filter = this.getFilter();
    const filteredTodos = this.getFilteredTodo(filter);

    const footer = todoStore.todos.length && (
      <Footer
        filter={filter}
        activeCount={todoStore.activeTodos.length}
        completedCount={todoStore.completedTodos.length}
        onClearCompleted={todoStore.clearCompleted}
        onChangeFilter={this.handleFilter}
      />
    );

    return (
      <Layout>
        <Helmet>
          <title>{t('title')}</title>
        </Helmet>
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
      </Layout>
    );
  }
}

export default translate('main')(TodoApp);
