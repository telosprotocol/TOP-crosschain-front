// Api response
export interface IResponse {
  code: number;
  logno: string;
  message: string;
  name: string;
  servertime: string;
}

export interface OtherResponse<T> {
  result: T;
  pageInfo: { totalCount?: number };
}
