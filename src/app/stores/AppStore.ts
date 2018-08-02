import { observable, action } from 'mobx';

export class AppStore {
  @observable public language: string;

  @action public setLanguage(value: string) {
    this.language = value;
  }
}

export default AppStore;
