// import instance from './axios'

// export const login = (username, password) =>
//   instance.post('/auth/login', { username, password }).then((response) => {
//     const token = response?.data.token
//     localStorage.setItem('token', token)

//     const user = response.data.data
//     localStorage.setItem('user', JSON.stringify(user))

//     return response.data
//   })

// // link
// export const createNewLink = ({ params }) => {
//   return instance.post('/link/create', { ...params }).then((res) => res)
// }

// export const getAllUrlsByUsername = (username, params) => {
//   return instance.get(`/link/all/${username}`, { params }).then((res) => res)
// }

import { URL_LOGIN, URL_REGISTER } from '../constants/url'
import apiService from '../services'

export const authApi = {
  register(params) {
    return apiService.post(URL_REGISTER, params)
  },

  login(params) {
    return apiService.post(URL_LOGIN, params)
  }
}
