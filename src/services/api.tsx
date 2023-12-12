import qs from 'qs';
import axios, { AxiosInstance } from 'axios';
import idx from 'idx';
import { CONTENT_TYPE, getBackendUrl } from '../utils/constants';
import {
  HeadersData,
  ErrorData,
  ErrorResponse,
  OptionsData
} from 'src/models/api';

const HEADERS = {
  'Content-Type': CONTENT_TYPE
};

class Api {
  private api: AxiosInstance;
  private baseURL: string;
  private headers: HeadersData;

  public constructor(baseURL: string, headers = {}) {
    this.baseURL = baseURL;
    this.api = axios.create({ baseURL, headers, timeout: 35 * 1000 });
    this.headers = headers;
  }

  public setAccessToken = (token: string | null) => {
    if (token) {
      this.headers = {
        ...this.headers,
        authorization: 'Bearer ' + token
      };
    } else {
      delete this.headers.authorization;
    }
  };

  public setUserCredentials = (name: string, password: string) => {
    this.headers = {
      ...this.headers,
      'Auth-Email': name,
      'Auth-Password': password
    };
  };

  private jsonToQuery = (json: any) => (json ? `?${qs.stringify(json)}` : '');

  public get = async (path = '', data: object, options: OptionsData = {}) => {
    const strQuery = this.jsonToQuery(data);
    const res = await this.api
      .get(`${path}${strQuery}`, {
        ...options,
        headers: { ...this.headers, ...options.headers }
      })
      .catch((error: ErrorResponse) => {
        this.handleRequestError(error, path, data, options);
      });
    if (res) {
      return res.data;
    }
  };

  public post = async (path = '', body: object, options: OptionsData = {}) => {
    const res = await this.api
      .post(path, body, {
        ...options,
        headers: { ...this.headers, ...options.headers }
      })
      .catch((error: ErrorResponse) => {
        this.handleRequestError(error, path, body, options);
      });
    if (res) {
      return res.data;
    }
  };

  public patch = async (path = '', body: object, options: OptionsData = {}) => {
    const res = await this.api
      .patch(path, body, {
        ...options,
        headers: { ...this.headers, ...options.headers }
      })
      .catch((error: ErrorResponse) => {
        this.handleRequestError(error, path, body, options);
      });
    if (res) {
      return res.data;
    }
  };

  public put = async (path = '', body: object, options: OptionsData = {}) => {
    const res = await this.api
      .put(path, body, {
        ...options,
        headers: { ...this.headers, ...options.headers }
      })
      .catch((error: ErrorResponse) => {
        this.handleRequestError(error, path, body, options);
      });

    if (res) {
      return res.data;
    }
  };

  public delete = async (
    path = '',
    body: object,
    options: OptionsData = {}
  ) => {
    const res = await this.api
      .delete(path, {
        ...options,
        data: body,
        headers: { ...this.headers, ...options.headers }
      })
      .catch((error: ErrorResponse) => {
        this.handleRequestError(error, path, body, options);
      });

    if (res) {
      return res.data;
    }
  };

  private handleRequestError = (
    error: ErrorResponse,
    path: string,
    body: object,
    options: object
  ) => {
    const err: ErrorData = new Error();
    if (!error.response && !error.code) {
      err.name = 'NETWORK_ERROR';
      err.status = 'SERVER_ERROR';
      err.message = 'Network error';
    } else if (!error.response && error.code === 'ECONNABORTED') {
      err.name = 'TIMEOUT_ERROR';
      err.status = 'SERVER_ERROR';
      err.message = 'Timeout from server';
    } else {
      err.name = 'SERVER_ERROR';
      err.status = 'SERVER_ERROR';
      err.message =
        idx(error, _ => _.response.data.message) ||
        `Server error, status: ${idx(error, _ => _.response.status)}`;
      err.statusCode = idx(error, _ => _.response.status);
      err.data = idx(error, _ => _.response.data);
      err.headers = idx(error, _ => _.response.headers);
      err.type = idx(error, _ => _.response.data.error_type);
      err.req = {
        path: `${this.baseURL}${path}`,
        body,
        options
      };
    }

    if (__DEV__) {
      console.log(
        'SERVER_ERROR',
        'name',
        err.name,
        'status',
        err.status,
        'message',
        err.message,
        'statusCode',
        err.statusCode,
        'data',
        err.data,
        'headers',
        err.headers,
        'path',
        `${this.baseURL}${path}`,
        'body/query',
        body,
        'options',
        options
      );
    }
    throw err;
  };
}

export default new Api(getBackendUrl(), HEADERS);
