var app = angular.module("app", [
  'ngRoute'
]);
app.config(function($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(false);
  $routeProvider.
    when('/index', {
      templateUrl: "/views/fragments/map.html"
    }).
    when('/nearme', {
      templateUrl: "/views/fragments/near_me.html"
    }).
    when('/new', {
      templateUrl: "/views/fragments/new.html"
    }).
    when('/config', {
      templateUrl: "/views/config.html"
    }).
    otherwise('/index');
}).filter('to_trusted', function($sce){
  return function(text){ return $sce.trustAsHtml(text); };
});

app.directive("ngUploadChange",function(){
    return{
        scope:{
            ngUploadChange:"&"
        },
        link:function($scope, $element, $attrs){
            $element.on("change",function(event){
                $scope.$apply(function(){
                  console.log("scope",$scope);
                  $scope.ngUploadChange({$event: event,$attrs: $attrs})
                })
            })
            $scope.$on("$destroy",function(){
                $element.off();
            });
        }
    }
});

app.directive('dynamic', function($compile) {
    return {
        //restrict: 'A',
        replace: true,
        link: function (scope, element, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
              console.log("compiling...");
                $compile(element.html(html).contents())(scope);
            });
        }
    };
});