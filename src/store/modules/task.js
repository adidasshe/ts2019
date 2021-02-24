import { replay, realTimePlay } from '@/api/task'

const state = {
  data: [],
  task_id: 0,
  total_time: 0,
  carnums: 0,
  points: {},
  task_name:"",
  creat_temp:{},
  dialogFormVisible:false


}
const mutations = {
  SET_DATA: (state, data) => {
    state.data = data
  },
  SET_TASK_ID: (state, data) => {
    state.task_id = data
  },
  SET_TASK_NAME: (state, data) => {
    state.task_name = data
  },
  SET_CARNUMS: (state, data) => {
    state.carnums = data
  },
  SET_POINTS: (state, data) => {
    state.points = data
  },
  SET_TOTAL_TIME: (state, data) => {
    state.total_time = data
  },



}

const actions = {
  // //地图选坐标
  // mapSelect({ commit }, data) {
  //   // console.log("00000000",data)
  //   commit('SET_TASK_NAME', data.task_name)
  //   commit('SET_CARNUMS', data.carnums)

  // },
  //回放
  replay({ commit }, task_id) {
    commit('SET_TASK_ID', task_id)
    return new Promise((resolve, reject) => {
      replay(task_id).then(response => {
        const data = response.data
        // console.log("框坐标", response.points)
        commit('SET_DATA', data)
        commit('SET_TOTAL_TIME', data.total_time)
        commit('SET_POINTS', response.points)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  //实时查看
  realTimePlay({ commit }, task_id) {
    commit('SET_TASK_ID', task_id)
    return new Promise((resolve, reject) => {
      realTimePlay(task_id).then(response => {
        const data = response.data
        // console.log("实时回放", data)
        commit('SET_DATA', data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}