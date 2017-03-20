// Ionic Starter App

var app = angular.module('scotch-todo',['ionic','LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('ionic-todo')
});

  app.controller('main',function($scope,$ionicModal,localStorageService,$http){

    //initialize task scope with empty object
    $scope.task = {};
    $scope.tasks = [];

    //configure ionic modal before use
    $ionicModal.fromTemplateUrl('new-task-modal.html',{
      scope:$scope,
      animation:'slide-in-up'
    }).then(function(modal){
      $scope.newTaskModal = modal;
    });


    $scope.getTasks = function(){

        $http.get('http://localhost:3009/api/get-todos')
            .success(function(data){
                $scope.tasks = data;
                console.log(data);
            }).error(function(err){
              console.log(err);
            });
    }

    $scope.createTask = function(){
      if($scope.task.completed != true)
      {
        $scope.task.completed = false;
      }
      var dataObj = {
          title : $scope.task.title,
          content : $scope.task.content,
          completed : $scope.task.completed
      };
        $http.post('http://localhost:3009/api/save-todos',dataObj).success(function(response){
          console.log(response);
        });
        //create new task
        $scope.tasks.push($scope.task);
        $scope.task = {};
      
        $scope.newTaskModal.hide();
    }

    $scope.removeTask = function(index){
      console.log(index);
      var data = {id:index};
      $http.put('http://localhost:3009/api/remove-todos',data).success(function(response){
          console.log(response);
      }).error(function(err){
          console.log(err);
      });
        //remove single task
        $scope.tasks.splice(index,1);
        //localStorageService.set(taskData,$scope.tasks);
    }
    $scope.checkIfCompleted = function(completed){
      if(completed)
        return true;
      return false;
    }
    $scope.completeTask = function(id,completed){

      var status = (completed)?true:false;
      $http.put('http://localhost:3009/api/complete-todos',{id:id,status:status}).success(function(response){
          console.log('response');
        }).error(function(err){
          console.error(err);
        });
        //mark task completed
        //localStorageService.set(taskData, $scope.tasks);
    }
    $scope.openTaskModal = function () {
        $scope.newTaskModal.show();
    };

    $scope.closeTaskModal = function () {
        $scope.newTaskModal.hide();
    };
});