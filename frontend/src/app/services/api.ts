import { AxiosRequestConfig } from 'axios';
import qs from 'qs';

import http from './http';

export class ApiManager {
  domain: string;
  url: string;
  createUrl: (key?: string | number | null, params?: object) => string;

  constructor(domain: string, url: string = '') {
    this.domain = domain;
    this.url = url;
    this.createUrl = createUrl.bind(null, this.domain, this.url);
  }

  setUrl(url: string) {
    return new ApiManager(this.domain, url);
  }

  get(params?: object, config: AxiosRequestConfig = {}) {
    return http.get(this.createUrl(null, params), config);
  }

  getByKey(key: string | number, params: object = {}, config: AxiosRequestConfig = {}) {
    return http.get(this.createUrl(key, params), config);
  }

  patch(key: string | number, data: unknown, config: AxiosRequestConfig = {}) {
    return http.patch(this.createUrl(key), data, config);
  }
  patchWithQuery(key: string | number, params: object, data: unknown, config: AxiosRequestConfig = {}) {
    return http.patch(this.createUrl(key, params), data, config);
  }

  post(data: unknown, config: AxiosRequestConfig = {}) {
    return http.post(this.createUrl(), data, config);
  }

  put(key: string | number, data: unknown, config: AxiosRequestConfig = {}) {
    return http.put(this.createUrl(key), data, config);
  }

  delete(key: string | number, config: AxiosRequestConfig = {}) {
    return http.delete(this.createUrl(key), config);
  }

  http(config: AxiosRequestConfig) {
    return http(config);
  }
}

export function createUrl(domain: string, url: string, key?: string | number | null, params: object = {}) {
  const paramsStr = qs.stringify(
    {
      ...params,
    },
    {
      indices: false,
    }
  );

  return `${`${domain}/${url ? `${url}/` : ''}${key ? `${key}/` : ''}`.replace(/([\w\d])\/+/g, '$1/')}${paramsStr ? `?${paramsStr}` : ''}`;
}
