app.controller('selfAccountCtrl', ['$scope','httpService','curUserService','Config','ngDialog','Popup','$stateParams',
  function($scope, httpService,curUserService,config,ngDialog,Popup,$stateParams) {

  var user = curUserService.getCurUser();
      $scope.usingUid = user.uid;
      $scope.loadAccount = function(){
          httpService.post('userAccount/'+user.uid).success(function(d){
              $scope.account = d;
          });
      }
    $scope.openModal = function() {
      var dlg = ngDialog.open({
        template: 'charge.html',
        className: 'ngdialog-theme-default',
        height: 400,
        scope:$scope,
        controller: function() {
          $scope.changeAmount = function(d){
            $scope.amount = d;
          }
          $scope.doSubmit = function () {
           var remain = parseFloat($scope.account.remain) + parseFloat($scope.amount);
            var param = {bmUserAccountId:$scope.account.bmUserAccountId,remain:remain};
            httpService.put('userAccount/update', param).success(function (d) {
              dlg.close(d);
            });
          }
        }
      });
      dlg.closePromise.then(function(r){
        if(r.value > 0){

          Popup.alert("充值成功!",function(){
            $scope.loadAccount();
          });
        }
      });
    }
  $scope.doRefresh = function(){

    if($stateParams.uid){
      $scope.loadLogs();
    }else{
      $scope.loadAccount();
    }
    $scope.$broadcast('scroll.refreshComplete');
  }
    $scope.loadLogs= function(){
        httpService.post('accountLog/list/'+$stateParams.uid).success(function(d){
           $scope.logs = d.data;
          console.log($scope.logs);
        });
    }

    if($stateParams.uid){
      $scope.loadLogs();
    }else{

    }
}]);