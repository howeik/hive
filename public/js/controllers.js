angular.module('starter.controllers', [])

// .controller('TasksCtrl', function($scope) {
//   var tasks = Tasks.all();
// })

// .controller('SharedCtrl', function($scope) {
//   var tasks = Tasks.all();
//   tasks = tasks.filter(function(task) {
//     task.is_shared = true;
//   });

//   var classes = [0, 5];
//   tasks = tasks.filter(function(task) {
//     classes.includes(task.class_id);
//   });

//   var userTaskIds = UserTasks.all().map(function(userTask) {
//     userTask.task_id;
//   });

//   tasks = tasks.filter(function(task) {
//     userTaskIds.includes(task.id) == false;
//   });

//   $scope.tasks = tasks;
// })

.controller('DashCtrl', function($scope, Classes, Tasks, UserTasks) {
  var userTasks = UserTasks.all();
  userTasks.map(function(userTask) {
    userTask.task = Tasks.get(userTask.task_id);
    userTask.task.class = Classes.get(userTask.task.class_id);
  });

  $scope.userTasks = userTasks;
  $scope.updateUserTask = function(userTask) {
    UserTasks.update(userTask);
  };
})


.controller('AddCtrl', function($scope) {})


.controller('ChatsCtrl', function($scope, Users, Classes, Tasks, UserTasks) {
  // filter tasks that are not shared
  var tasks = Tasks.all();
  tasks = tasks.filter(function(task) {
    return task.is_shared == true;
  });

  // filter tasks that are not part of any classes you're in
  var class_ids = Users.class_ids();
  tasks = tasks.filter(function(task) {
    return class_ids.indexOf(task.class_id) != -1;
  });

  // filter tasks that you already have added
  var userTasks = UserTasks.all().map(function(userTask) {
    return userTask.task_id;
  });

  tasks = tasks.filter(function(task) {
    return userTasks.indexOf(task.id) == -1;
  });

  // append class information to the task
  tasks.map(function(task) {
    task.class = Classes.get(task.class_id);
  });

  console.log(tasks);
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
