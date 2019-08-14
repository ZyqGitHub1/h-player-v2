import axios from 'axios';

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
  });
  return response;
}
