const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  device_id: state => state.user.device_id,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles, // 用户权限
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  task: state => state.task.data, //任务数据
  task_id: state => state.task.task_id, //任务ID
  task_name: state => state.task.task_name, //任务名
  carnums: state => state.task.carnums,
  points: state => state.task.points,
  total_time: state => state.task.total_time,


}
export default getters
