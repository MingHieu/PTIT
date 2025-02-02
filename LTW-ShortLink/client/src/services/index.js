import axios from 'axios'

const apiConfig = axios.create({
  baseURL: 'http://localhost:8080/api/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

apiConfig.interceptors.request.use(
  function (config) {
    if (localStorage.getItem('token')) {
      config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

apiConfig.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

const apiService = {
  /* A function that is using the axios post method to send a request to the server. */
  post(urlApi, params) {
    return apiConfig
      .post(urlApi, params)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  /* A function that is using the axios patch method to send a request to the server. */
  patch(urlApi, params) {
    return apiConfig
      .patch(urlApi, params)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  /* A function that is making a put request to the urlApi and passing in the params. */
  put(urlApi, params) {
    return apiConfig
      .put(urlApi, params)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  /* Making a get request to the urlApi and passing in the params. */
  get(urlApi, params) {
    return apiConfig
      .get(urlApi, params)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  },
  /**
   * The delete function takes a urlApi as a parameter and returns a promise that either resolves to a
   * response or rejects with an error
   * @param {string} urlApi - The URL of the API endpoint.
   * @returns The response from the API.
   */
  delete(urlApi) {
    return apiConfig
      .delete(urlApi)
      .then((response) => response)
      .catch((error) => {
        throw error
      })
  }
}

export default apiService
