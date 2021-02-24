import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const token = getToken()
// console.log(token)

export function deviceList(token) {
  return request({
    url: 'device_info/',
    method: 'get',
    params: { token }
  })
}

export function addDevice(data) {
  return request({
    url: 'device_info/',
    method: 'post',
    params: { token },
    data
  })
}

export function updateDevice(data) {
  return request({
    url: 'device_info/',
    method: 'put',
    params: { token },
    data
  })
}
export function deleteDevice(id) {
  return request({
    url: 'device_info/',
    method: 'delete',
    params: { token },
    data: { id },
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function getDevice(name) {
  return request({
    url: 'getDevice/',
    method: 'get',
    params: { token, name }
  })
}

export function getDeviceId(name) {
  return request({
    url: 'getDevice/',
    method: 'get',
    params: { token, name }
  })
}

export function mapData(token) {
  return request({
    url: 'map/',
    method: 'get',
    params: { token }
  })
}

