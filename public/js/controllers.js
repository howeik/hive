angular.module('starter.controllers', [])

.controller('TaskDetailsCtrl', function($scope, $stateParams, Task) {
  $scope.task = {
    'class': {
      'name': 'LOADING...'
    },
    name: 'LOADING...',
    description: 'LOADING'
  }

  Task.detail($stateParams.taskId, function(data, err) {
    if (err) { console.log(err); return; }
    console.log(data);
    $scope.task = data;

    Task.shareCount($scope.task._id, function(res, err) {
      if (err) { console.log(err); return; }
      console.log(res);
      $scope.task.shareCount = res.shareCount;
    });
  });
})

.controller('TasksCtrl', function($scope, Task, Users, Classes, Tasks, UserTasks) {
  function dayToString(day) {
    var daysOfTheWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    return daysOfTheWeek[day];
  };

  function dateToWeek(date) {
    // start of winter quarter 2015
    var start = new Date('01-04-2015');

    return Math.round((date - start) / 604800000) + 1;
  };

  $scope.updateUserTask = function(userTask) {
    console.log("in updateUserTask");
    Task.update(userTask, function(data, err) {
      if (err) { console.log(err); return; }
      console.log(data);
    });
  }

  Task.all(function(tasks, err) {
    if (err) { console.log(err); return; }

    console.log(tasks);

    var curr = new Date();
    var firstday = new Date(curr.setDate(curr.getDate() - curr.getDay()));
    var lastday = new Date(curr.setDate(curr.getDate() - curr.getDay()+6));

    tasks = tasks.sort(function(a, b) {
      return new Date(a.task.due_date) - new Date(b.task.due_date);
    });

    $scope.this_week = [];
    $scope.upcoming = [];
    $scope.archived = [];
    tasks.forEach(function(userTask) {
      if (firstday <= new Date(userTask.task.due_date) && new Date(userTask.task.due_date) <= lastday) {
        userTask.day_of_the_week = dayToString(new Date(userTask.task.due_date).getDay());
        $scope.this_week.push(userTask);
      } else if (firstday > new Date(userTask.task.due_date)) {
        $scope.archived.push(userTask);
      } else {
        $scope.upcoming.push(userTask);
      }
    });



  });

})

.controller('AddCtrl', function($scope, $location, $ionicLoading, Task, Class, Users, Tasks, UserTasks) {
  if ($scope.task == undefined) {
    $scope.task = {
      name: "",
      due_date: new Date(),
      is_shared: true,
      description: ''
    }
  }

  Class.enrolled(function(classes, err) {
    if (err) { console.log(err); return; }

    $scope.classes = classes;
    // console.log(classes);
  });

  $scope.addTask = function(task) {
    console.log("Adding Task!");
    console.log(task);

    var _date = new Date(task.due_date);
        console.log(_date);

    var _helsenkiOffset = 2*60*60000;//maybe 3 [h*60*60000 = ms]
    var _userOffset = _date.getTimezoneOffset()*60000; // [min*60000 = ms]
    var _helsenkiTime = new Date(_date.getTime()+_helsenkiOffset+_userOffset);

    console.log(_helsenkiTime);
    console.log((_helsenkiTime.getMonth() + 1) + "/" + _helsenkiTime.getDate() + "/" + _helsenkiTime.getFullYear());
    task.due_date = (_helsenkiTime.getMonth() + 1) + "/" + _helsenkiTime.getDate() + "/" + _helsenkiTime.getFullYear();

    Task.create(task, function(data, err) {
      if (err) { console.log(err); return }

      console.log("data inserted");
      console.log(data);

      // Redirecting User to main page
      $location.path("../templates/index")
      $ionicLoading.show({ template: 'Added task ' + task.name + '!', noBackdrop: true, duration: 800 });

    });

    // var taskId = Tasks.add(task);
    // UserTasks.add(Users.id(), taskId);

    $scope.task = {
      class_id: 0,
      name: "",
      due_date: new Date,
      is_shared: true,
      description: ''
    };
  }

  console.log($scope.task);
})

.controller('SharedCtrl', function($scope, $rootScope, $ionicLoading, Task, Class, Users, Classes, Tasks, UserTasks) {
  $scope.tasks = [];
  if ($rootScope.declinedTasks == undefined) {
    $rootScope.declinedTasks = [];

  }

  Task.shared(function(sharedTasks, err) {
    Task.all(function(allTasks, err) {
      console.log(sharedTasks);
      sharedTasks = sharedTasks.filter(function(sharedTask) {
        for (var i = 0; i < allTasks.length; i++) {
          if (allTasks[i].task._id == sharedTask._id) {
            return false;
          }
        }

        if ($rootScope.declinedTasks.indexOf(sharedTask._id) == -1) {
          return true;
        }

        return false;
      });

      $scope.tasks = sharedTasks;
      $scope.tasksByClass = {}
      Class.enrolled(function(classes, err) {
        if (err) { console.log(err); return; }

        var classesToProcess = classes.length;
        classes.forEach(function(_class) {
          $scope.tasksByClass[_class.name] = [];
          classesToProcess--;

          if (classesToProcess == 0) {
            $scope.tasks.forEach(function(task) {
              $scope.tasksByClass[task.class.name].push(task);
            });

            $scope.classes = classes.sort(function(a, b) {
              return $scope.tasksByClass[b.name].length - $scope.tasksByClass[a.name].length;
            });
          }
        });
      });

      console.log($scope.tasksByClass);

      $rootScope.badgeCount = $scope.tasks.length;


      // populate endorsement information
      sharedTasks.forEach(function(sharedTask) {
        if (sharedTask.is_endorsed) {
          sharedTask.endorsed_message = " by an instructor";
        } else {
          Task.shareCount(sharedTask._id, function(res, err) {
            sharedTask.endorsed_message = " by " + res.shareCount + " students";
          });
        }
      });
    })
  })
  // // filter tasks that are not shared
  // var tasks = Tasks.all();
  // tasks = tasks.filter(function(task) {
  //   return task.is_shared == true;
  // });

  // // filter tasks that are not part of any classes you're in
  // var class_ids = Users.class_ids();
  // tasks = tasks.filter(function(task) {
  //   return class_ids.indexOf(task.class_id) != -1;
  // });

  // // filter tasks that you already have added
  // var userTasks = UserTasks.all()
  // userTasks = userTasks.filter(function(userTask) {
  //   return Users.id() == userTask.user_id;
  // });
  // userTasks = userTasks.map(function(userTask) {
  //   return userTask.task_id;
  // });


  // tasks = tasks.filter(function(task) {
  //   return userTasks.indexOf(task.id) == -1;
  // });

  // // filter tasks that you've declined
  // var declinedTaskIds = Users.declinedTaskIds();
  // tasks = tasks.filter(function(task) {
  //   return declinedTaskIds.indexOf(task.id) == -1;
  // });

  // // append endorsement information
  // userTasks = UserTasks.all();
  // tasks.map(function(task) {
  //   if (task.is_endorsed == true) {
  //     task.endorsed_message = " by an instructor";
  //   } else {
  //     var taskUsers = userTasks.filter(function(userTask) {
  //       return userTask.task_id == task.id;
  //     });

  //     task.endorsed_message = " by " + taskUsers.length + " students";
  //   }
  // });

  // // append class information to the task
  // tasks.map(function(task) {
  //   task.class = Classes.get(task.class_id);
  // });

  // $scope.tasks = tasks;
  $scope.accept = function(task) {
    console.log(task);
    $('#task' + task._id).hide(400, function() {
      for (var i = 0; i < $scope.tasksByClass[task.class.name].length; ++i) {
        if ($scope.tasksByClass[task.class.name][i]._id == task._id) {
          $scope.tasksByClass[task.class.name].splice(i, 1);
        }
      }
    });

    Task.add(task._id, function(data,err) {
      if (err) { console.log(err); return }
      console.log("task added");
      console.log(data);
    });

    $rootScope.badgeCount -= 1;
    $ionicLoading.show({ template: 'Task accepted!', noBackdrop: true, duration: 800 });
  };

  $scope.decline = function(task) {
    console.log(task);
    // Users.addDeclinedTaskId(task.id);
    $('#task' + task._id).hide(400, function() {
      for (var i = 0; i < $scope.tasksByClass[task.class.name].length; ++i) {
        if ($scope.tasksByClass[task.class.name][i]._id == task._id) {
          $scope.tasksByClass[task.class.name].splice(i, 1);
        }
      }
    });


    $rootScope.declinedTasks.push(task._id);
    $ionicLoading.show({ template: 'Task declined!', noBackdrop: true, duration: 800 });

    $rootScope.badgeCount -= 1;
  };

  // tasks.sort(function(a, b) {
  //   return new Date(a.due_date) - new Date(b.due_date);
  // });


  // console.log("setting badge count to " + tasks.length);
  // $rootScope.badgeCount = tasks.length;
})


.controller('ChatDetailCtrl', function($scope, $stateParams, $ionicPopup, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope, $ionicLoading, $ionicPopup, User, Class) {
  $scope.settings = {
    enableFriends: true
  };

  User.me(function(me, err) {
    $scope.user = me;
    console.log(me);
  });

  Class.enrolled(function(classes, err) {
    if (err) { console.log(err); return; }

    $scope.classes = classes;
    // console.log(classes);
  });
  //$location.path("tab-account");
  $scope.deleteClass = function(_class) {

    var confirmPopup = $ionicPopup.confirm({
      title: 'Are you sure?',
      template: '<p>Removing ' + _class.name + ' will delete all your tasks associated with ' + _class.name + '.<br> Are you sure you want to do this?</p>'
    });
   confirmPopup.then(function(res) {
     if (res) {
      console.log("delete task clicked");
      console.log(_class);
      Class.delete(_class._id, function(data, err) {
        if (err) { console.log(err); return; }
        console.log(data);
      });

      Class.enrolled(function(classes, err) {
        if (err) { console.log(err); return; }

        $scope.classes = classes;
      });
       $ionicLoading.show({ template: 'Dropped ' + _class.name + '!', noBackdrop: true, duration: 800 });
     } else {
       console.log('You are not sure');
     }
   });

  };
})

.controller('AccountAddClassCtrl', function($scope, Class, $ionicLoading) {

  function refreshClasses() {
    Class.all(function(classes, err) {
      if (err) { console.log(err); return; }

      Class.enrolled(function(enrolledClasses, err) {
          if (err) { console.log(err); return; }

          classes = classes.filter(function(_class) {
            for (var i = 0; i < enrolledClasses.length; i++) {
              if (enrolledClasses[i]._id == _class._id) {
                return false;
              }
            }
            return true;
          });

          $scope.classes = classes;
      });
      // console.log(classes);
    });
  }

  refreshClasses();

  $scope.addClass = function(_class) {
    console.log("adding class");
    console.log(_class);

    $ionicLoading.show({ template: 'Enrolled in ' + _class.name + '!', noBackdrop: true, duration: 800 });
//          $ionicLoading.show({ template: 'Added task ' + task.name + '!', noBackdrop: true, duration: 800 });



    Class.add(_class._id, function(data, err) {
      if (err) { console.log(err); return; }
      console.log(data);
      refreshClasses();
    });
  }
});