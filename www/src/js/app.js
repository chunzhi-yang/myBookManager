// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//第三方库引入，通过angular.module
var app=angular.module('starter', ['ionic', 'ngFileUpload','ngCordova','angular-popups','ionic-datepicker','ngDialog'])

.run(function($ionicPlatform,$location,$rootScope,$ionicHistory,$timeout,$cordovaToast) {

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova&&  window.cordova.plugins  &&  window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function(e) {
    //判断处于哪个页面时双击退出
    if ($location.path() == '/app/bookstore/index' || $location.path() == '/app/self/index' || $location.path() == '/app/bookshelf/index') {
      if ($rootScope.backButtonPressedOnceToExit) {
        ionic.Platform.exitApp();
      } else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortBottom('再按一次退出系统');
        setTimeout(function() {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
    } else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();
    } else {
      $rootScope.backButtonPressedOnceToExit = true;
      $cordovaToast.showShortBottom('再按一次退出系统');
      setTimeout(function() {
        $rootScope.backButtonPressedOnceToExit = false;
      }, 2000);
    }
    e.preventDefault();
    return false;
  }, 101);
})

.config(['$stateProvider', '$urlRouterProvider','$ionicConfigProvider','$httpProvider',function($stateProvider, $urlRouterProvider,$ionicConfigProvider,$httpProvider) {
    //设置tab的位置为底部
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');

    $stateProvider
  .state('login', {
    url: '/login',
    abstract: true,
    template: '<ion-nav-view></ion-nav-view>',
  })
  .state('login.signin', {
    url: '/signin',
    templateUrl: 'views/login_signin.html',
    controller: 'loginCtrl'
  })

  .state('login.signup', {
    url: '/signup',
    templateUrl: 'views/login_signup.html',
    controller: 'loginCtrl'
  })
  .state('login.changepassword', {
    url: '/changepassword/:account',
    templateUrl: 'views/login_changepassword.html',
    controller: 'navsCtrl'
  })
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/tabs.html'
  })
      .state('login.bookshelf', {
        url: '/bookshelf',
        template: '<ion-nav-view></ion-nav-view>',
        abstract: true
      })
  .state('app.bookshelf', {
    url: '/bookshelf',
    template: '<ion-nav-view></ion-nav-view>',
    abstract: true
  })
  .state('app.bookshelf.index', {
    url: '/index',
    templateUrl: 'views/bookshelf/bookshelf-index.html',
    controller: 'bookshelfCtrl'
  })
  .state('login.bookshelf.view', {
    url: '/view/:fileName',
    templateUrl: 'views/bookshelf/bookshelf-view.html',
    controller: 'bookshelfViewCtrl'
  })
   .state('app.bookstore', {
      url: '/bookstore',
      abstract: true,
      template: '<ion-nav-view></ion-nav-view>',
  })
      .state('login.bookstore', {
        url: '/bookstore',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>',
      })
      .state('app.bookstore.index', {
    url: '/index',
    templateUrl: 'views/bookstore/bookstore.html',
    controller: 'bookstoreCtrl'

  })
      .state('login.bookstore.detail', {
        url: '/detail/:id',
        templateUrl: 'views/bookstore/bookstore-detail.html',
        controller: 'bookstoreDetailCtrl'

      })
  .state('app.self', {
      url: '/self',
      abstract: true,
      template: '<ion-nav-view></ion-nav-view>',

  })
      .state('login.self', {
        url: '/self',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>',

      })
    .state('app.self.index', {
    url: '/index',
    templateUrl: 'views/self/self-index.html',
    controller: 'selfCtrl'
  })

      .state('login.self.order', {
        url: '/order',
        templateUrl: 'views/self/self-order.html',
        controller: 'selfOrderCtrl'
      })
      .state('login.self.disk', {
        url: '/disk',
        templateUrl: 'views/self/self-disk.html',
        controller: 'selfDiskCtrl'
      })
      .state('login.self.account', {
        url: '/account',
        templateUrl: 'views/self/self-account.html',
        controller: 'selfAccountCtrl'
      })
      .state('login.self.accountlog', {
        url: '/accountlog/:uid',
        templateUrl: 'views/self/account-log.html',
        controller: 'selfAccountCtrl'
      })
      .state('login.self.edit', {
        url: '/edit/:account',
        templateUrl: 'views/self/self-edit.html',
        controller: 'selfEditCtrl'
      });

  $urlRouterProvider.otherwise('/app/bookshelf/index');
}]).config(['PopupProvider','$httpProvider',function (PopupProvider,$httpProvider) {
  PopupProvider.title = '提示';
  PopupProvider.okValue = '确定';
  PopupProvider.cancelValue = '取消';
  $httpProvider.defaults.withCredentials = true;

  //拦截请求，如果错误就给予提示
  $httpProvider.interceptors.push(
    ['$q', '$injector',function($q, $injector){
    return {
        request: function (config) {
            var requestUrl = config.url;
            var $location = $injector.get('$location');
            var absUrl = $location.absUrl();

            return config;
        },
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
        response: function (response) {

            return response;
        },
        responseError: function(rejection) {
            var $state = $injector.get('$state');
            var popup = $injector.get('Popup');
            if(rejection.status === 401){
                $state.go("login.signin");
            }else if(rejection.status === 500) {
                var data=rejection.data;
                if(data.error){
                    try{
                      popup.alert("系统错误",function(){});

                    }catch(e){}
                }else{
                     popup.alert('系统错误','系统出錯了',function(){});
                }
            }else if(rejection.status === 404){
                try{
                  popup.alert('页面不存在','您要访问的页面不存在',function(){});

                }catch(e){}
            }else{
               popup.alert('您还没有登录，请先登录',function(){
                 $state.go('login.signin');
              });
           }
            return $q.reject(rejection);
        }
    };
}]);
}]);
