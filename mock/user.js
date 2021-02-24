import Mock from 'mockjs'
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}
var random = Mock.Random;

//扩展数据模板
random.extend({
  sex: function (date) {
    var sexs = ['男', '女']
    return this.pick(sexs)
  }
})
random.extend({
  role: function (date) {
    var roles = ['admin', 'user']
    return this.pick(roles)
  }
})
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'admin'
  },
  'editor-token': {
    roles: ['user'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}
const username = ""
const allUsers = Mock.mock({
  'data|1-10': [{
    'user_id|+1': 1,
    'username': '@first',
    'name': '@cname',
    'role': '@role',
    'sex': '@sex'
  }]
})
const user = Mock.mock({
  'data|1-3': [{
    'user_id|+1': 1,
    'username': '@first',
    'name': '@cname',
    'role': '@role',
    'sex': '@sex'
  }]
})

export default [
  // user login
  {
    url: 'login.do',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 1001,
          error: '用户名或密码错误'
        }
      }

      return {
        code: 1000,
        data: tokens[username]
      }
    }
  },

  // get user info
  {
    url: 'roles.do',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 1001,
          error: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 1000,
        data: info
      }
    }
  },
  // get  all user list
  {
    url: 'users.do',
    type: 'get',
    response: config => {
      const info = allUsers
      return {
        code: 1000,
        data: info.data
      }
    }
  },
  // post a user
  {
    url: 'users.do',
    type: 'post',
    response: config => {
      // const info = allUsers
      return {
        code: 1000
        // data: info.data
      }
    }
  },
  // put a user
  {
    url: 'users.do',
    type: 'put',
    response: config => {
      // const info = allUsers
      return {
        code: 1000
        // data: info.data
      }
    }
  },
  // delete a user
  {
    url: 'users.do',
    type: 'delete',
    response: config => {
      // const info = allUsers
      return {
        code: 1000
        // data: info.data
      }
    }
  },
  // change pwd
  {
    url: 'users/pwd.do',
    type: 'put',
    response: config => {
      // const info = allUsers
      return {
        code: 1000
        // data: info.data
      }
    }
  },
  // get a user
  {
    url: `users/username.do`,
    type: 'get',
    response: config => {
      const info = user
      return {
        code: 1000,
        data: info.data
      }
    }
  },
  

  // user logout
  {
    url: 'logout.do',
    type: 'post',
    response: _ => {
      return {
        code: 1000,
        data: 'success'
      }
    }
  }
]
