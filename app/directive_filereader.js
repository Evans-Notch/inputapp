
angular.module('app').directive('fileSelect', ['$window', function ($window) {
return {
  restrict: 'A',
  require: 'ngModel',
  link: function (scope, el, attr, ctrl) {
      var fileReader = new $window.FileReader();
      
      fileReader.onload = function () {
          ctrl.$setViewValue(fileReader.result);

          if ('fileLoaded' in attr) {
              scope.$eval(attr['fileLoaded']);
          }
      };

      fileReader.onprogress = function (event) {
          if ('fileProgress' in attr) {
              scope.$eval(attr['fileProgress'], 
              {'$total': event.total, '$loaded': event.loaded});
          }
      };

      fileReader.onerror = function () {
          if ('fileError' in attr) {
              scope.$eval(attr['fileError'], 
              {'$error': fileReader.error});
          }
      };

      var fileType = attr['fileSelect'];
      
      el.bind('change', function (e) {
          var fileName = e.target.files;
          scope.ctl.files = fileName;
          
      });
  }
};
}]);