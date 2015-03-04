// Code goes here

var app = angular.module('welcome', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/intro')

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'main.html'
  })

  $stateProvider.state('app.welcome', {
    abstract: true,
    url: '',
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
    url: '/intro',
    templateUrl: 'welcome.html',
    controller: 'TodosCtrl'
  })

  $stateProvider.state('app.welcome.login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'LoginCtrl',
    resolve: {
      todo: function($stateParams, TodosService) {
        return TodosService.getTodo($stateParams.todo)
      }
    }
  })

  $stateProvider.state('app.welcome.signup', {
    url: '/signup',
    templateUrl: 'signup.html',
    controller: 'SignupCtrl',
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

app.controller('LoginCtrl', function($scope, $http, $ionicLoading, $location, TodosService) {
  $scope.email = "";
  $scope.password = "";
  $scope.login = function(email, password) {
    console.log("login clicked with " + email + " : " + password);

    var req = {
      method: 'POST',
      url: '/api/user/login',
      data: {
        'email': email,
        'password': password
      }
    };

    $http(req).success(function(data){
      console.log(data);
      $ionicLoading.show({ template: data, noBackdrop: true, duration: 800 });
      if (data.success) {
        window.location.replace('/');
      } else {
          $ionicLoading.show({ template: 'Invalid email or password!', noBackdrop: true, duration: 800 });
      }
    }).error(function(data, status){
      $ionicLoading.show({ template: 'Login failed!', noBackdrop: true, duration: 800 });
      console.log(status);
    });
  }
})

app.controller('SignupCtrl', function($scope, $ionicLoading, $http, TodosService) {
  $scope.name = "";
  $scope.email = "";
  $scope.password = "";
  $scope.signup = function(name, email, password) {
    console.log("signup clicked with " + name + " : " + email + " : " + password);

    var req = {
      method: 'POST',
      url: '/api/user/signup',
      data: {
        'name': name,
        'email': email,
        'password': password
      }
    };

    $http(req).success(function(data){
      console.log(data);
      if (data.success) {
        window.location.replace('/');
      } else {
          $ionicLoading.show({ template: 'Signup failed!', noBackdrop: true, duration: 800 });
      }
    }).error(function(data, status){
      $ionicLoading.show({ template: 'Signup failed!', noBackdrop: true, duration: 800 });
      console.log(status);
    });
  }})

app.controller('TodosCtrl', function($scope, TodosService) {
  $scope.todos = TodosService.todos
})

app.controller('TodoCtrl', function($scope, todo) {
  $scope.todo = todo
})
