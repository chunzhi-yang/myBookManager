app.controller('selfEditCtrl',['$scope','Upload','httpService','$state','$stateParams','$filter','curUserService','Config',
  function($scope,Upload,httpService,$state,$stateParams,$filter,curUserService,configs) {
    $scope.userInfo = curUserService.getCurUser();
    $scope.userInfo.birth = $filter('date')($scope.userInfo.birth,'yyyy-MM-dd HH:mm:ss');
    $scope.items=["男","女"];

    console.log($scope.userInfo);
    $scope.submitForm = function(){
      var params=$scope.userInfo;

      params.birthday = $filter('date')(params.birth,'yyyy-MM-dd HH:mm:ss');

      upload($scope.file);

        var curUserReq =  httpService.post( '/app/findUserByAccount',  $scope.userInfo.uid);

        curUserReq.then(function (data) {
          if (data.data != '' && data.data.avatar != undefined) {
            data.data.avatar = configs.imgPrefix  + data.data.imgPath;
          }

          $state.go('app.self');
        },function(error){
          console.log("下载头像失败:"+error);
        });
     }

    var upload = function (file) {
      console.log(file);
      Upload.upload({
        url: configs.serverUrl+'/user/update',
        data: $scope.userInfo,
        file: file
      }).progress(function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log( 'progress: ' + progressPercentage + '% ' +
          evt.config.file.name);
      }).error(function (data, status, headers, config) {

        swal('文件'+config.file.name+'上传成功');
      }).success(function (data, status, headers, config) {

        console.log("上传失败");
      });
    }
  }]);
