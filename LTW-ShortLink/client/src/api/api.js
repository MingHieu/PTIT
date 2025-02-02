import apiService from '../services'
import instance from './axios'

export const login = (username, password) =>
  instance.post('/auth/login', { username, password }).then((response) => {
    const token = response?.data.token
    localStorage.setItem('token', token)

    const user = response.data.data
    localStorage.setItem('user', JSON.stringify(user))

    return response.data
  })

export const register = (username, password) =>
  instance.post('/auth/signup', { username, password }).then((response) => {
    const token = response?.data.token
    localStorage.setItem('token', token)

    const user = response.data.data
    localStorage.setItem('user', JSON.stringify(user))

    return response.data
  })

// link
export const createNewLink = (params) => {
  return apiService.post('/link/create', params)
}

export const getAllUrlsByUsername = (username, params) => {
  return apiService.post(`/link/all/${username}`, params)
}

export const getAllUrls = (params) => {
  return apiService.post(`/link/all`, params)
}

export const getDetailLinkByCode = (code) => {
  return apiService.get(`/link/s/${code}`)
}

export const getDetailLinkById = (id) => {
  return apiService.get(`/link/${id}`)
}

export const getLinkByShortLink = (shortLink) => {
  return apiService.get(`link/s/${shortLink}`)
}

export const getAllMeAffiliateLink = () => {
  return apiService.get(`/link/affiliate/all/me`)
}

export const getAllAffiliateLink = (params) => {
  return apiService.post(`/link/affiliate/all`, params)
}
export const acceptAffiliate = (id) => {
  return apiService.post(`/link/affiliate/${id}`)
}

// request
export const createRequest = (params) => {
  return apiService.post('request/create', params)
}

export const updateRequest = (params) => {
  return apiService.post('request/update', params)
}

export const getRequestByUsername = (username, params) => {
  return apiService.post(`request/all/${username}`, params)
}

// user

export const getAllUsers = (params) => {
  return apiService.post('/user/all', params)
}

export const getUser = (username) => {
  return apiService.get(`/user/${username}`)
}

// request
export const getAllRequest = (params) => {
  return apiService.post('/request/all', params)
}

export const getOneRequest = (id) => {
  return apiService.get(`/request/${id}`,)
}

export const createClick = (params, search) =>
  apiService.post(`/click/create${search}`, params)

export const getDashboard = () =>
  apiService.get(`/dashboard/all`)
