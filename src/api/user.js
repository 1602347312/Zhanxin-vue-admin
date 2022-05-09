import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://101.132.121.193:8899/user/login',
    method: 'post',
    params: {
      userEmail: data.userEmail,
      userPassword: data.userPassword,
      userType: data.userType
    }
  })
}

export function getInfo(token) {
  return request({
    url: 'http://101.132.121.193:8899/user/userInfo',
    method: 'get',
    headers: {
      token: token
    }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
