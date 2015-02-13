angular.module('starter.services', [])

.factory('Classes', function() {
  // Some fake testing data
  var classes = [{
    id: 0,
    name: 'COGS120'
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
    }
  }
})

.factory('Tasks', function() {

  // Some fake testing data
  var tasks = [{
    id: 0,
    class_id: 0,
    name: 'A06 - Meat on the Bones',
    description: 'Functionality functionality functionality!',
    due_date: '02/13/2015'
  }, {
    id: 1,
    class_id: 0,
    name: 'Lab 6 - AJAX',
    description: 'Connecting client to server without reloading!',
    due_date: '02/12/2015'
  }];

  return {
    all: function() {
      return tasks;
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

})

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
  }];

  return {
    all: function() {
      return userTasks;
    },
    get: function(id) {
      for (var i = 0; i < userTasks.length; i++) {
        if (userTasks[i].id == parseInt(id)) {
          return userTasks[i];
        }
      }
      return null;
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
