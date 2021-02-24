import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const token = getToken()
// console.log(token)

export function deviceData(data) {
  return request({
    url: 'device_data/',
    method: 'get',
    params: { token, data }
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
