import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'

const token = getToken()

/**
 * 登录接口 
 * @param {*} data 用户名及密码
 * 
 */
export function login(data) {
  return request({
    url: 'login.do',
    method: 'post',
    data
  })
}

/**
 * 获取用户权限
 * @param {*} token 登录成功后返回的token
 */
export function getInfo(token) {
  return request({
    url: 'roles.do',
    method: 'get',
    params: {
      token
    },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
/**
 * 登出
 * @param {*} token 
 */
export function logout() {
  return request({
    url: 'logout.do',
    method: 'post',
    
  })
}

/**
 * 获取用户列表
 * @param {*} token 
 */
export function userList() {
  return request({
    url: 'users.do',
    method: 'get',
  })
}

/**
 * 添加用户
 * @param {*} data 
 */
export function addUser(data) {
  return request({
    url: 'users.do',
    method: 'post',
    data
  })
}

/**
 * 修改用户
 * @param {*} data 
 */
export function updateUser(data) {
  return request({
    url: 'users.do',
    method: 'put',
    data
  })
}

/**
 * 删除用户
 * @param {*} user_id 
 */
export function deleteUser(user_id) {
  return request({
    url: 'users.do',
    method: 'delete',
    data: {
      user_id
    },
  })
}

/**
 * 根据用户名查找用户
 * @param {*} username 
 */
export function getUser(username) {
  return request({
    url: `users/username.do`,
    method: 'get',
    params: {
      username
    }
  })
}

/**
 * 修改密码
 * @param {*} data 
 */
export function changePass(data) {
  return request({
    url: 'users/pwd.do',
    method: 'put',
    data
  })
}
