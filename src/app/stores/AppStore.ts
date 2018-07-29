import { observable, action } from 'mobx';

export class AppStore {
  @observable public title: string;
  @observable public description: string;

  @action public setTitle(value: string) {
    this.title = value;
  }

  @action public setDescription(value: string) {
    this.description = value;
  }
}

export default AppStore;
