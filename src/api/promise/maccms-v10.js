import axios from 'axios';
import { stringify } from 'query-string';

export async function getList(api, query) {
  const defaultParams = {
    ac: 'list',
    at: 'xml',
  };
  const params = Object.assign(defaultParams, query);
  const response = await axios.get(api, {
    params,
  });
  return response;
}

export async function getDetail(api, query) {
  const defaultParams = {
    ac: 'detail',
    at: 'xml',
  };
  const params = Object.assign(defaultParams, query);
  const response = await axios.get(api, {
    params,
    paramsSerializer(qs) {
      return stringify(qs, {
        arrayFormat: 'comma',
      });
    },
  });
  return response;
}
