import React from 'react';
import { observable, action, computed, makeObservable, toJS } from 'mobx';

import EN from '@/locale/EN';

type LAN = 'EN';
const browserLan: string = (
  navigator.language ||
  (navigator as any).userLanguage ||
  'EN'
).slice(0, 2);

let userLan: LAN;

userLan = 'EN';

const sessionLan: any = window.localStorage.getItem('lan');
if (sessionLan) {
  userLan = 'EN';
}
export default class LocaleStore {
  @observable
  public lan: LAN = userLan as LAN;

  @observable
  public supportLan = {
    EN: {
      name: 'EN',
      icon: '',
    },
  };

  @observable
  public messages = {
    EN,
  };

  @computed
  public get isCN() {
    return false;
  }

  @computed
  public get currentLanName() {
    return this.supportLan[this.lan].name;
  }

  @computed
  get message() {
    return this.messages[this.lan];
  }

  constructor() {
    makeObservable(this);
  }

  @action.bound
  public getCountry() {
    new Promise(resolve => {
      const oReq = new XMLHttpRequest();
      oReq.onload = () => {
        const country = JSON.parse(oReq.response).country;
        resolve(country);
      };
      oReq.open('GET', 'https://ipapi.co/json/');
      oReq.send();
    });
  }

  @action.bound
  public toogleLan(lan: LAN) {
  }

  @action.bound
  public getMessage(
    id: string,
    message: any,
    params?: { [key: string]: any },
    defaultMessage?: any
  ) {
    let text = message[id];
    if (text) {
      return text;
    }
    id.split('.').forEach(key => {
      text = text ? text[key] : message[key];
    });

    if (!text) {
      text = defaultMessage || id;
    }

    if (!/{[^}]+}/g.test(text)) {
      return text;
    }

    const strs = text.split(/{[^}]+}/g);
    const keys = text.match(/{[^}]+}/g);
    const returns = [];
    let i = 0;
    strs.forEach((str, index) => {
      if (str !== '') {
        returns.push(str);
      }

      if (index === strs.length - 1) {
        return;
      }
      const key = keys[i++].replace(/{|}/g, '');

      const element = params[key];
      if (React.isValidElement(element)) {
        returns.push(
          React.cloneElement(element, {
            key: index,
          })
        );
      } else if (['string', 'number', 'boolean'].indexOf(typeof element) > -1) {
        returns.push(String(element));
      } else {
        returns.push('');
      }
    });
    return returns;
  }

  @action.bound
  public getLocaleMessage(
    id: string,
    params?: { [key: string]: any },
    defaultMessage?: any
  ) {
    return this.getMessage(id, this.message, params, defaultMessage);
  }
}
