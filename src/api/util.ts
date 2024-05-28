import TopApi, { IConfig } from '@topnetwork/top-api';
import { IResponse, OtherResponse } from './types';

class SecretApi<R> extends TopApi {
  public async request<T>(
    url: string,
    config?: IConfig
  ): Promise<R & OtherResponse<T>> {
    return super.request<{ result: T }>(url, config).then((res) => {
      if (!Object.prototype.hasOwnProperty.call(res, 'pageInfo')) {
        res = { pageInfo: {}, ...res };
      }
      if ([200, 204].indexOf(res.code) > -1) {
        return res;
      }
      throw res;
    });
  }

  public get<T>(url: string, config?: IConfig) {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  public post<T>(url: string, config?: IConfig) {
    return this.request<T>(url, { ...config, method: 'POST' });
  }

  public delete<T>(url: string, config?: IConfig) {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  public patch<T>(url: string, config?: IConfig) {
    return this.request<T>(url, { ...config, method: 'PATCH' });
  }

  public put<T>(url: string, config?: IConfig) {
    return this.request<T>(url, { ...config, method: 'PUT' });
  }
}

const secretApi = new SecretApi<IResponse>('http://127.0.0.1', {
  timeout: 30000,
  mode: 'cors',
  sign: true,
});

secretApi.setAccess(
  '8412f654f8662d033111fc453edc5b63',
  'c4jWPrC8mdRC+Nt3ftdwDDi564O3L0+FqMjRRHwHigBwmmoSZB7Pug=='
);

export { secretApi };
