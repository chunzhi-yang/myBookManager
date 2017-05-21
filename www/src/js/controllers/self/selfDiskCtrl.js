app.controller('selfDiskCtrl', ['$scope','httpService','$rootScope','Config','Upload','$timeout',
  function($scope, httpService, $rootScope,configs,Upload,$timeout) {


    $scope.books = [];
    $scope.filePrefix = configs.filePrefix;
    $scope.loading = false;
    $scope.doRefresh =function(){
      $scope.userFiles();
    }
  $scope.userFiles = function() {
    var param = {uid: $rootScope.curUser.uid};
    $scope.loading = true;
    httpService.post('app/userFiles', param).success(function (d) {

      if (d.length > 0) {
        loadBooks(d);
      }
      $scope.loading = false;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  var loadBooks = function(d){
    httpService.post('books/listByFilePath', {ids: d.join(',')}).success(function (d1) {
      if(d1.length == 0){
        return;
      }
      $scope.books = [];
      for (var i = 0; i < d1.length; i++) {
        var bookScope = d1[i];
        bookScope.imgPath = configs.imgPrefix + bookScope.imgPath;
        $scope.books.push(bookScope);
      }
    });
  }
  $scope.loadFiles= function(files){
      doUpload(files);
  }
  function doUpload(files){
    console.log(files);
    if (files && files.length) {
      Upload.upload({
        url: configs.serverUrl+'/bookShelf/upload',
        data: {
          files: files,
          uid: $rootScope.curUser.uid
        }
      }).then(function (response) {
        $timeout(function () {
            console.log(response);
          $scope.userFiles();
        });
      }, function (response) {
        if (response.status > 0) {
          $scope.errorMsg = response.status + ': ' + response.data;
        }
      }, function (evt) {
        $scope.progress =
          Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
    }
  }

  $scope.userFiles();
}]);