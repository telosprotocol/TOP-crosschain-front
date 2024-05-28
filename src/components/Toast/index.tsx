import ReactDOM from 'react-dom';
import React, { PureComponent, ReactPortal } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './index.less';
import { openHash } from '@/utils';

export const ethscan =
  process.env.NODE_ENV === 'development'
    ? 'https://rinkeby.etherscan.io/tx/'
    : 'https://etherscan.com/tx/';
const close = require('@/assets/images/home/close.png');

const ToastFunc: {
  success?(
    message: string,
    delay: number,
    txID: string,
    netName: string
  ): number;
  fail?(message: string, delay: number, txID: string, netName: string): number;
  prompt?(
    message: string,
    delay: number,
    txID: string,
    netName: string
  ): number;
} = {};

let incId = 0;

const getId = () => {
  incId++;
  return incId;
};

interface State {
  queue: Array<{
    id: number;
    type: 'success' | 'fail' | 'prompt';
    message: string;
    delay: number;
    txID?: string;
    netName?: string;
  }>;
}

export default class Toast extends PureComponent<{}, State> {
  public static success: (
    message: string,
    delay?: number,
    txID?: string,
    netName?: string
  ) => number;
  public static fail: (
    message: string,
    delay?: number,
    txID?: string,
    netName?: string
  ) => number;
  public static prompt: (
    message: string,
    delay?: number,
    txID?: string,
    netName?: string
  ) => number;
  constructor(props) {
    super(props);

    this.state = {
      queue: [],
    };
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    ToastFunc.success = (message, delay, txID, netName) =>
      this.show({
        type: 'success',
        message,
        delay: delay || 3000,
        txID,
        netName,
      });
    ToastFunc.fail = (message, delay, txID, netName) =>
      this.show({ type: 'fail', message, delay: delay || 3000, txID, netName });
    ToastFunc.prompt = (message, delay, txID, netName) =>
      this.show({
        type: 'prompt',
        message,
        delay: delay || 3000,
        txID,
        netName,
      });
    Toast.success = ToastFunc.success;
    Toast.fail = ToastFunc.fail;
    Toast.prompt = ToastFunc.prompt;
  }

  public show({ type, message, delay, txID, netName }) {
    if (!message) {
      message = 'Some thing wrong...';
    }
    const id = getId();
    let msg = 'Some thing wrong...';
    if (typeof message === 'string') {
      msg = message;
    }
    if (typeof message === 'object') {
      if (message.msg || message.message) {
        msg = message.msg || message.message;
      } else {
        msg = message;
      }
    }
    this.setState(
      {
        queue: [{ type, message: msg, delay, id, txID, netName }],
      },
      () => {
        if (delay > 0) {
          setTimeout(() => {
            this.hide(id);
          }, delay + 300);
        }
      }
    );
    return id;
  }

  public hide(id) {
    const _queue = [];
    for (const q of this.state.queue) {
      if (q.id !== id) {
        _queue.push(q);
      }
    }
    this.setState({ queue: _queue });
  }

  public render(): ReactPortal {
    return ReactDOM.createPortal(
      <TransitionGroup>
        {this.state.queue.map(({ id, type, message, txID, netName }) => (
          <CSSTransition key={id} timeout={300} classNames="toast-item">
            <div className={'toast-' + type}>
              <img
                className="toast-close"
                src={close}
                alt="close"
                onClick={() => this.hide(id)}
              />
              {message}{' '}
              {txID && (
                <span>
                  <a
                    onClick={() => openHash(txID, netName)}
                    style={{ color: '#1b94ff' }}
                  >
                    View on {netName}
                  </a>
                </span>
              )}
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>,
      document.getElementById('toast')
    );
  }
}
