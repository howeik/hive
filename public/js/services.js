
angular.module('starter.services', [])

.factory('User', ['$http', function($http) {
    return {
      apiCall: function(req, callback) {
        req.url = "/api" + req.url;
        $http(req).success(function(data){
            callback(data, false);
        }).error(function(data, status){
            callback(data, status);
        });
      },
      me: function(callback) {
        var req = {
          method: 'GET',
          url: '/user/me'
        };
        this.apiCall(req, callback);
      },
      decline: function(taskId, callback) {
        var req = {
          method: 'POST',
          url: '/user/decline',
          data: { 'taskId': taskId }
        };
        this.apiCall(req, callback);
      },
      declined: function(callback) {
        var req = {
          method: 'GET',
          url: '/user/declined'
        };
        this.apiCall(req, callback);
      }
    }
}])

.factory('Class', ['$http', function($http) {
  return {
    apiCall: function(req, callback) {
      req.url = "/api" + req.url;
      $http(req).success(function(data){
          callback(data, false);
      }).error(function(data, status){
          callback(data, status);
      });
    },
    search: function(q, callback) {
      var req = {
        method: 'GET',
        url: '/class/search?q=' + q
      };
      this.apiCall(req, callback);
    },
    all: function(callback) {
      var req = {
        method: 'GET',
        url: '/class/all'
      };
      this.apiCall(req, callback);
    },
    add: function(classId, callback) {
      var req = {
        method: 'POST',
        url: '/class/add',
        data: { 'classId': classId }
      }
      this.apiCall(req, callback);
    },
    delete: function(classId, callback) {
      var req = {
        method: 'POST',
        url: '/class/delete',
        data: { 'classId': classId }
      };
      this.apiCall(req, callback);
    },
    enrolled: function(callback) {
      var req = {
        method: 'GET',
        url: '/class/enrolled'
      };
      this.apiCall(req, callback);
    },
  }
}])

.factory('Task', ['$http', function($http) {
  return {
    apiCall: function(req, callback) {
      req.url = "/api" + req.url;
      $http(req).success(function(data){
          callback(data, false);
      }).error(function(data, status){
          callback(data, status);
      });
    },
    detail: function(taskId, callback) {
      var req = {
        method: 'GET',
        url: '/task/detail/' + taskId
      };
      this.apiCall(req, callback);
    },
    update: function(task, callback) {
      var req = {
        method: 'POST',
        url: '/task/update',
        data: task
      };
      this.apiCall(req, callback);
    },
    all: function(callback) {
      var req = {
        method: 'GET',
        url: '/task/all'
      };
      this.apiCall(req, callback);
    },
    create: function(task, callback) {
      var req = {
        method: 'POST',
        url: '/task/create',
        data: task
      };
      this.apiCall(req, callback);
    },
    delete: function(taskId, callback) {
      var req = {
        method: 'POST',
        url: '/task/delete',
        data: { 'taskId': taskId }
      };
      this.apiCall(req, callback);
    },
    add: function(taskId, callback) {
      var req = {
        method: 'POST',
        url: '/task/add',
        data: { 'taskId': taskId }
      };
      this.apiCall(req, callback);
    },
    shared: function(callback) {
      var req = {
        method: 'GET',
        url: '/task/shared'
      };
      this.apiCall(req, callback);
    },
    shareCount: function(id, callback) {
      var req = {
        method: 'GET',
        url: '/task/shareCount/'+id,
        params: {
          details: 'shareCount'
        }
      }
      this.apiCall(req, callback);
    },
  }
}])

.factory('Classes', function() {
  // Some fake testing data
  var classes = [{
    id: 0,
    name: 'COGS120'
  }, {
    id: 1,
    name: 'CSE124'
  }, {
    id: 2,
    name: 'CSE130'
  }, {
    id: 3,
    name: 'POLI20'
  }];

  return {
    all: function() {
      return classes;
    },
    get: function(id) {
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].id === parseInt(id)) {
          return classes[i];
        }
      }
      return null;
    },
    remove: function(id) {
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].id === parseInt(id)) {
          classes.splice(i, 1);
          return true;
        }
      }
      return false;
    }
  }
})

.factory('Users', ['Classes', function() {
  var declined_task_ids = [];

  return {
    class_ids: function() {
      return [0, 1, 3];
    },
    id: function() {
      return 0;
    },
    addDeclinedTaskId: function(task_id) {
      declined_task_ids.push(task_id);
    },
    declinedTaskIds: function() {
      return declined_task_ids;
    }
    // classes: function() {
    //   return [0, 1, 3].map(function(class_id) {
    //     return Classes.get(class_id);
    //   });
    // }
  }
}])

.factory('Tasks', [ '$http', function($http) {

  // Some fake testing data
  var tasks = [{
    id: 0,
    class_id: 0,
    name: 'A06 - Meat on the Bones',
    description: 'Functionality functionality functionality!',
    due_date: '02/13/2015',
    is_shared: true,
    is_endorsed: false
  }, {
    id: 1,
    class_id: 0,
    name: 'Lab 6 - AJAX',
    description: 'Connecting client to server without reloading!',
    due_date: '02/12/2015',
    is_shared: true,
    is_endorsed: false
  }, {
    id: 2,
    class_id: 1,
    name: 'Project 1: Build your own webserver',
    description: 'Write your own webserver in C using sockets.',
    due_date: '02/16/2015',
    is_shared: true,
    is_endorsed: true
  }, {
    id: 3,
    class_id: 1,
    name: 'Project 2: Hadoop and MapReduce',
    description: 'Distributed stuff.',
    due_date: '02/18/2015',
    is_shared: true,
    is_endorsed: true
  }, {
    id: 4,
    class_id: 1,
    name: 'Homework 3',
    description: 'See course website please.',
    due_date: '02/25/2015',
    is_shared: true,
    is_endorsed: false
  }, {
    id: 5,
    class_id: 3,
    name: 'Midterm Paper 1',
    description: 'Is Creon a MPK?',
    due_date: '03/02/2015',
    is_shared: true,
    is_endorsed: true
  }, {
    id: 6,
    class_id: 3,
    name: 'News Article Analysis',
    description: 'Analzye a news article and write about it.',
    due_date: '03/07/2015',
    is_shared: true,
    is_endorsed: false
  }, {
    id: 7,
    class_id: 3,
    name: 'Martin Luther Paper',
    description: 'Analzye a news article and write about it.',
    due_date: '02/13/2015',
    is_shared: true,
    is_endorsed: false
  }];

  return {
    all_api: function() {
      var req = {
        method: 'GET',
        url: '/task/all'
      };
      this.apiCall(req, function(data){ console.log(data); }, function(data,status){console.log(status); return []});
    },
    apiCall: function(req, success, error){
      req.url = "/api" + req.url;
      $http(req).success(function(data){
          success(data);
      }).error(function(data, status){
          error(data, status);
      });
    },
    all: function() {
      return tasks;
    },
    add: function(task) {
      // determine new task id (do this server sided later for sure)
      var taskIds = tasks.map(function(task) {
        return task.id;
      });

      var newTaskId = Math.max.apply(Math, taskIds) + 1;

      task.id = newTaskId;

      // parse the class_id to an int in case it isn't since it's from a form
      task.class_id = parseInt(task.class_id);

      // add the task
      tasks.push(task);

      // return the new task's id (since we wanna add it to UserTasks too)
      return newTaskId;
    },
    get: function(id) {
      for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == parseInt(id)) {
          return tasks[i];
        }
      }
      return null;
    }
  }

}])

.factory('UserTasks', ['Classes', 'Tasks', function() {

  // Some fake testing data
  var userTasks = [{
    id: 0,
    user_id: 0,
    task_id: 0,
    is_finished: false
  }, {
    id: 1,
    user_id: 0,
    task_id: 1,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 7,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 7,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 7,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 7,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 4,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 4,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 4,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 6,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 6,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 6,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 6,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 6,
    is_finished: true
  }, {
    id: 1,
    user_id: 1,
    task_id: 6,
    is_finished: true
  }];

  return {
    all: function() {
      return userTasks;
    },
    add: function(user_id, task_id) {
      var userTaskIds = userTasks.map(function(userTask) {
        return userTask.id;
      });

      var newTaskId = Math.max.apply(Math, userTaskIds) + 1;
      userTasks.push({
        id: newTaskId,
        user_id: user_id,
        task_id: task_id
      });
    },
    get: function(id) {
      for (var i = 0; i < userTasks.length; i++) {
        if (userTasks[i].id == parseInt(id)) {
          return userTasks[i];
        }
      }
      return null;
    },
    update: function(userTask) {
      for (var i = 0; i < userTasks.length; i++) {
        if (userTasks[i].id == userTask.id) {
          userTasks[i].is_finished = userTask.is_finished;
        }
      }
      return false;
    }
  }

}])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  }
})

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [{
    id: 0,
    name: 'Ben Sparrow',
    notes: 'Enjoys drawing things',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    notes: 'Odd obsession with everything',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlen',
    notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    notes: 'I think he needs to buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    notes: 'Just the nicest guy',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];


  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
});
