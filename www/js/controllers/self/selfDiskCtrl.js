app.controller("selfDiskCtrl",["$scope","httpService","curUserService","Config",function($scope,$http,curUserService,config){curUserService.test();curUserService.getCurUser();httpService.post("",function(){})}]);