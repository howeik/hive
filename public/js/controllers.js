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

  var curr = new Date;
  var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
  var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));

  userTasks.sort(function(a, b) {
    return new Date(a.task.due_date) - new Date(b.task.due_date);
  });

  var daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];

  $scope.this_week = [];
  $scope.upcoming = [];
  userTasks.map(function(userTask) {
    if (firstday < new Date(userTask.task.due_date) && new Date(userTask.task.due_date) < lastday) {
      console.log(new Date(userTask.task.due_date));
      userTask.day_of_the_week = daysOfTheWeek[new Date(userTask.task.due_date).getDay()];
      $scope.this_week.push(userTask);
    } else {
      $scope.upcoming.push(userTask);
    }
  });
})

.controller('AddCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $rootScope, $ionicLoading, Users, Classes, Tasks, UserTasks) {
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
    $rootScope.badgeCount -= 1;
    $ionicLoading.show({ template: 'Task accepted!', noBackdrop: true, duration: 800 });
  };

  $scope.decline = function(task) {
    console.log(task);
    Users.addDeclinedTaskId(task.id);
    $('#task' + task.id).hide(500);
    $ionicLoading.show({ template: 'Task declined!', noBackdrop: true, duration: 800 });

    $rootScope.badgeCount -= 1;
  };

  tasks.sort(function(a, b) {
    return new Date(a.due_date) - new Date(b.due_date);
  });


  console.log("setting badge count to " + tasks.length);
  $rootScope.badgeCount = tasks.length;
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