import request from '@/utils/request'
import {
  getToken
} from '@/utils/auth'
import {
  divIcon
} from 'leaflet'
import task from '../../mock/task'

const token = getToken()

/**
 * 下载任务数据
 * @param {*} token ,task_id
 */
export function download(task_id) {
  return request({
    url: 'tasks/download.do',
    method: 'get',
    params: {
      task_id
    },
    responseType: 'blob'
  })
}

/**
 * 获取任务列表
 * @param {*} token 
 */
export function taskList(params) {
  return request({
    url: 'tasks.do',
    method: 'get',
    params: params
  })
}

/**
 * 获取回放数据
 * @param {*} task_id 
 */
export function replay(task_id) {
  return request({
    url: 'carpoints.do',
    method: 'get',
    params: {
      task_id
    }
  })
}

/**
 * 获取实时回放数据
 * @param {*} task_id 
 */
export function realTimePlay(task_id) {
  return request({
    url: 'realCarpoints.do',
    method: 'get',
    params: {
      task_id
    }
  })
}

/**
 * 获取任务结果
 * @param {*} task_id 
 */
export function taskResult(task_id) {
  return request({
    url: 'tasks/result.do',
    method: 'get',
    params: {
      task_id
    }
  })
}

/**
 * 添加任务
 * @param {*} data 
 */
export function addTask(data) {
  return request({
    url: 'tasks.do',
    method: 'post',
    data
  })
}

/**
 * 修改任务
 * 
 */
export function updateTask(data) {
  return request({
    url: 'tasks.do',
    method: 'put',
    data
  })
}

/**
 * 删除任务-
 * 
 */
export function deleteTask(task_id) {
  return request({
    url: 'tasks.do',
    method: 'delete',
    params: {
      task_id
    }
  })
}

/**
 * 搜索任务名
 * @param {*} data 
 */
export function getTask(task_name) {
  return request({
    url: `tasks/task_name.do`,
    method: 'get',
    params: {
      task_name
    }
  })
}

/**
 * 任务开始前log
 * @param {*} data 
 */
export function getTaskLogs(task_id) {
  return request({
    url: `tasklogs.do`,
    method: 'get',
    params: {
      task_id
    }
  })
}


/**
 * 任务实时log
 * @param {*} data 
 */
export function getRealLogs(task_id) {
  return request({
    url: `reallogs.do`,
    method: 'get',
    params: {
      task_id
    }
  })
}
