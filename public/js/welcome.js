// Code goes here

var app = angular.module('welcome', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/welcome')

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'main.html'
  })

  $stateProvider.state('app.welcome', {
    abstract: true,
    url: '/welcome',
    views: {
      welcome: {
        template: '<ion-nav-view></ion-nav-view>'
      },
    }
  })

  // $stateProvider.state('app.login', {
  //   url: '',
  //   templateUrl: 'login.html'
  // })

  $stateProvider.state('app.welcome.welcome', {
    url: '',
    templateUrl: 'welcome.html',
    controller: 'TodosCtrl'
  })

  $stateProvider.state('app.welcome.login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'TodoCtrl',
    resolve: {
      todo: function($stateParams, TodosService) {
        return TodosService.getTodo($stateParams.todo)
      }
    }
  })

  $stateProvider.state('app.welcome.signup', {
    url: '/signup',
    templateUrl: 'signup.html',
    controller: 'TodoCtrl',
    resolve: {
      todo: function($stateParams, TodosService) {
        return TodosService.getTodo($stateParams.todo)
      }
    }
  })


  $stateProvider.state('app.help', {
    url: '/help',
    views: {
      help: {
        templateUrl: 'help.html'
      }
    }
  })
})

app.factory('TodosService', function() {
  var todos = [
      {title: "Take out the trash", done: true},
      {title: "Do laundry", done: false},
      {title: "Start cooking dinner", done: false}
   ]

  return {
    todos: todos,
    getTodo: function(index) {
      return todos[index]
    }
  }
})

app.controller('TodosCtrl', function($scope, TodosService) {
  $scope.todos = TodosService.todos
})

app.controller('TodoCtrl', function($scope, todo) {
  $scope.todo = todo
})
