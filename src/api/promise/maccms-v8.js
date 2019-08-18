import axios from 'axios';
import { stringify } from 'query-string';

export async function getList(api, query) {
  const defaultParams = {
    ac: 'list',
  };
  const params = Object.assign(defaultParams, query);
  const response = await axios.get(api, {
    params,
  });
  return response;
}

export async function getDetail(api, query) {
  const defaultParams = {
    ac: 'videolist',
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
