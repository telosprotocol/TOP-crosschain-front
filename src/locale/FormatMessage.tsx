import React from 'react';
import { inject, observer } from 'mobx-react';
import LocaleStore from '@/store/localeStore';

export interface FormatMessageProps {
  id: string;
  defaultMessage?: string;
  params?: { [key: string]: any };
  locale?: LocaleStore;
}

@inject('locale')
@observer
export default class FormatMessage extends React.Component<FormatMessageProps> {
  public render() {
    const { id, defaultMessage = id, params } = this.props;
    const { getMessage } = this.props.locale;
    const text = getMessage(
      id,
      this.props.locale.message,
      params,
      defaultMessage
    );

    return text;
  }
}
