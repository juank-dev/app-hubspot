export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

export const ApiRequest = async (path, { method = METHODS.GET, headers = {}, data = {} }) => {
  try {
    let config = {
      method: method,
      url: path,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data || ''),
    };
    if (method === METHODS.GET) delete config.data;
    const res = await axios(config);
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    }
    throw { message: `Error, API ${path}`, statusText: 'Failed' };
  } catch (err) {
    throw err.response.data;
  }
};
