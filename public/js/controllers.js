angular.module('starter.controllers', [])

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

  // filter tasks that you've declined
  var declinedTaskIds = Users.declinedTaskIds();
  tasks = tasks.filter(function(task) {
    return declinedTaskIds.indexOf(task.id) == -1;
  });

  // append endorsement information
  userTasks = UserTasks.all();
  tasks.map(function(task) {
    if (task.is_endorsed == true) {
      task.endorsed_message = " by an instructor";
    } else {
      var taskUsers = userTasks.filter(function(userTask) {
        return userTask.task_id == task.id;
      });

      task.endorsed_message = " by " + taskUsers.length + " students";
    }
  });

  // append class information to the task
  tasks.map(function(task) {
    task.class = Classes.get(task.class_id);
  });

  $scope.tasks = tasks;
  $scope.accept = function(task) {
    console.log(task);
    UserTasks.add(0, task.id);
    $('#task' + task.id).hide(500);
    $scope.badgeCount -= 1;
  };

  $scope.decline = function(task) {
    console.log(task);
    Users.addDeclinedTaskId(task.id);
    $('#task' + task.id).hide(500);
    $scope.badgeCount -= 1;
  };

  console.log("setting badge count to " + tasks.length);

  $scope.badgeCount = tasks.length;
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
})

.controller('AccountAddClassCtrl', function($scope) {

});