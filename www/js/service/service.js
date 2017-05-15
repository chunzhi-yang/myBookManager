"use strict";app.service("httpService",["$http","Config",function($http,configs){function getUrl(url){return configs.serverUrl+url}return{post:function(url,param,config){return url=getUrl(url),$http.post(url,$.param(param||{}),angular.extend({},{headers:{"Content-Type":"application/x-www-form-urlencoded"}},config))},get:function(url,config){return url=getUrl(url),$http.get(url,angular.extend({},{headers:{"Content-Type":"application/x-www-form-urlencoded"}},config))},put:function(url,param){return url=getUrl(url),$http.post(url,JSON.stringify(param),{headers:{"Content-Type":"application/json"}})},"delete":function(url){return url=getUrl(url),$http["delete"](url,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}}}]).service("curUserService",["httpService","Config","$state","Popup",function(httpService,config,$state,Popup){var curUser={},rememberMe=!1,isLogined=!1,darkTheme=!1;this.getIsLogined=function(){return isLogined},this.setDarkTheme=function(t){darkTheme=t},this.getDarkTheme=function(){return darkTheme},this.doLogin=function(params){var promise=httpService.post("/login/signin",params);promise.then(function(d){if(d.data.success){var curUserReq=httpService.post("user/"+params.userName);curUserReq.success(function(data){data.imgPath?data.imgPath=config.imgPrefix+data.imgPath:data.imgPath=0==data.sex?"img/thumbnail-male.png":"img/thumbnail-female.png",curUser=data,isLogined=!0,rememberMe=params.rememberMe,$state.go("app.self.index")})}else Popup.alert(d.data.message,function(){})})},this.doLogout=function(){isLogined=!1,curUser={},httpService.post("login/logout").success(function(d){$state.go("login.signin")})},this.test=function(){curUser={usersId:2,uid:"20170425231430000",userName:"chunzhi123",sex:0,birth:new Date("1992-12-27 18:00:50")}},this.getCurUser=function(){return console.log(curUser),curUser},this.setCurUser=function(user){curUser={},curUser=user},this.getRemeberMe=function(){return rememberMe}}]).service("fileTransferHelper",["curUserService",function(curUserService){var param={};this.setter=function(p){param=p},this.getter=function(){return param}}]).factory("localStorage",["$window",function($window){return{set:function(key,value){$window.localStorage[key]=value},get:function(key,defaultValue){return $window.localStorage[key]||defaultValue},setObject:function(key,value){$window.localStorage[key]=JSON.stringify(value)},getObject:function(key){return JSON.parse($window.localStorage[key]||"{}")}}}]);