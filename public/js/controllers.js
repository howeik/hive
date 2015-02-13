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

.controller('DashCtrl', function($scope) {})


.controller('AddCtrl', function($scope) {})


.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
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
