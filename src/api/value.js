import request from '@/utils/request'
import { getToken } from '@/utils/auth'

const token = getToken()
// console.log(token)

export function getValue(device_id) {
  return request({
    url: 'value/',
    method: 'get',
    params: { token, device_id }
  })
}

export function setValue(data) {
  return request({
    url: 'value/',
    method: 'post',
    params: { token },
    data
  })
}