export const ApiService = ({
  url = '',
  method = 'GET',
  queryParams = {},
  body = {},
}) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  // Authorization header
  if (localStorage.getItem('token')) {
    options.headers['Authorization'] =
      'Bearer ' + localStorage.getItem('token');
  }
  if (method !== 'GET') {
    Object.assign(options, { body: JSON.stringify(body) });
  }
  return fetch(url + '?' + new URLSearchParams(queryParams), options).then(
    async (res) => {
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    }
  );
};
