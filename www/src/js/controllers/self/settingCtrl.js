app.controller('settingCtrl', ['$scope','httpService','curUserService','Config',function($scope, $http,curUserService,config) {
  curUserService.test();
  var user = curUserService.getCurUser();
       $scope.usingAccount = user.userName;
       $scope.usingAvatar = config.imgPrefix + user.imgPath;
      $scope.usingUid = user.uid;
}]);