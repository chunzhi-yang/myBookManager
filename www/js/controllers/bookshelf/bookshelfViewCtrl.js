app.controller("bookshelfViewCtrl", ["$window", "$scope", "httpService", "ngDialog", "fileTransferHelper", "curUserService", "Config", "$stateParams", function ($window, $scope, httpService, ngDialog, fileTransferHelper, curUserService, config, $stateParams) {
  function getItemSize() {
    var height = $window.screen.height, width = $window.screen.width,
      pageTotal = Math.floor(height * width / $scope.fontSize / 8);
    return pageTotal += 8 - pageTotal % 8
  }

  function readFile(blob, callback) {
    var a = new FileReader;
    a.onload = function (e) {
      callback(e.target.result)
    }, a.readAsText(blob, "utf-8")
  }

  $scope.fontSize = "12", $scope.chapterIndex = 0;
  var isLogined = curUserService.getIsLogined(), colors = ["#11c1f3", "#33cd5f", "#ffc900", "#444444", "#f8f8f8"],
    sliceIndex = 1;
  $scope.isLogined = isLogined, $scope.noMoreItemsAvailable = !1, $scope.operateModal = function () {
    var dlg = ngDialog.open({
      template: "operateMenu.html",
      scope: $scope,
      className: "ngdialog-theme-default",
      height: 300,
      controller: function () {
        $scope.readProcess = $scope.chapterIndex / $scope.chapterLength * 100, $scope.next = function () {
          if ($scope.readProcess < 0)return void($scope.readProcess = 0);
          var chapterIndex = Math.ceil($scope.readProcess * $scope.chapterLength / 100 + 1);
          dlg.close(chapterIndex)
        }, $scope.pre = function () {
          if ($scope.readProcess < 0)return void($scope.readProcess = 0);
          var chapterIndex = Math.ceil($scope.readProcess / 100 * $scope.chapterLength - 1);
          dlg.close(chapterIndex)
        }, $scope.openChapters = function () {
          openSideModal()
        }, $scope.changeStyle = function (i) {
          $scope.backdrop = colors[i]
        }, $scope.larger = function () {
          $scope.fontSize > 30 || $scope.fontSize++
        }, $scope.smaller = function () {
          $scope.fontSize < 12 || $scope.fontSize--
        }, $scope.changeProcess = function (i) {
          var chapterIndex = i * $scope.chapterLength / 100;
          dlg.close(Math.ceil(chapterIndex))
        }
      }
    });
    dlg.closePromise.then(function (r) {
      "$document" != r.value && ($scope.chapterIndex = r.value, $scope.readProcess = Math.floor($scope.chapterIndex / $scope.chapterLength * 100), $scope.loadContent())
    })
  };
  var openSideModal = function () {
    var dlg = ngDialog.open({
      template: "chapterPage.html",
      scope: $scope,
      className: "ngdialog-theme-default",
      height: "100%",
      controller: function () {
        $scope.changeProcess = function (i) {
          dlg.close(Math.ceil(i))
        }, dlg.closePromise.then(function (r) {
          "$document" != r.value && ($scope.chapterIndex = r.value, $scope.readProcess = $scope.chapterIndex / $scope.chapterLength * 100, $scope.loadContent())
        })
      }
    })
  };
  $scope.loadContent = function () {
    if (!($scope.chapterLength <= $scope.chapterIndex || $scope.chapterIndex < 0)) {
      var fileName = $stateParams.fileName,
        filePath = fileName.substring(0, fileName.lastIndexOf(".")) + "_" + $scope.chapterIndex + fileName.substring(fileName.lastIndexOf("."));
      httpService.post("app/getOneChapter", {fileName: filePath}).success(function (d) {
        $scope.textContent = d
      }), $scope.loading = !1, $scope.$broadcast("scroll.refreshComplete"), $scope.$broadcast("scroll.infiniteScrollComplete")
    }
  }, $scope.loadContentMore = function () {
    return $scope.chapterIndex >= $scope.chapterLength ? void($scope.noMoreItemsAvailable = !0) : ($scope.chapterIndex++, void $scope.loadContent())
  }, $scope.loadMore = function () {
    sliceIndex == $scope.total ? (readFile($scope.bookFile.slice((sliceIndex - 1) * $scope.itemSize, (sliceIndex - 1) * $scope.itemSize + $scope.lastLeft), function (result) {
      $scope.textContent += result
    }), $scope.noMoreItemsAvailable = !0) : sliceIndex < $scope.total && readFile($scope.bookFile.slice((sliceIndex - 1) * $scope.itemSize, (sliceIndex - 1) * $scope.itemSize + $scope.itemSize), function (result) {
        $scope.textContent = $scope.textContent + result
      }), sliceIndex++, $scope.$broadcast("scroll.infiniteScrollComplete")
  };
  var loadChapters = function () {
    $scope.loading = !0, httpService.post("app/bookWithChapters", {fileName: $stateParams.fileName}).success(function (d) {
      $scope.chapterLength = d.length, $scope.chapterList = d, angular.forEach($scope.chapterList, function (eve) {
        eve.chapterName = eve.chapterName.trim()
      }), $scope.loadContent()
    })
  };
  $scope.doRefresh = function () {
    return 0 == $scope.chapterIndex ? void($scope.noMoreItemsAvailable = !0) : ($scope.chapterIndex--, void $scope.loadContent())
  }, $scope.initCtrl = function () {
    $scope.textContent = "", $scope.isLogined ? loadChapters() : ($scope.bookFile = fileTransferHelper.getter(), $scope.itemSize = getItemSize(), $scope.total = Math.ceil($scope.bookFile.size / $scope.itemSize), $scope.lastLeft = $scope.bookFile.size % $scope.itemSize, $scope.loadMore())
  }, $scope.initCtrl()
}]);
