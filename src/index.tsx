///<reference types="webpack-env" />
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { stores } from './store';
import 'antd/dist/antd.css';
import '@/assets/styles/index.less';

import App from './App';

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}
