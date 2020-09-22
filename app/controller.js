app.controller("MainCtrl", function (
  $scope,
  $route,
  $rootScope,
  $http,
  $location,
  $timeout,
  $q,
  $compile,
  $sce
) {
  var ctl = this;
  app.ctl = ctl;
  ctl.BASE_URL = "https://ckdata.herokuapp.com/api/v1";

  // if(document.location.host.match(/localhost|local.daab.it/)){
  //   ctl.BASE_URL = "http://localhost:3000/api/v1";
  // }

  app.app_helpers(ctl);
  app.init_map(ctl);
  app.init_editor(ctl, $http, $scope, $compile, $sce);
  app.dataset_controller(ctl, $scope, $http);
  app.init_pageloads(ctl, $route);

  ctl.apply = function () {
    setTimeout(function () {
      $scope.$apply();
    }, 50);
  };
  ctl.goto = function (path, foo) {
    $location.path(path);
    if (foo) {
      foo();
    }
  };

  ctl.uplaod_config = function () {
    $http({
      url: ctl.BASE_URL + "/" + ctl.config.group_name + "/update_config.json",
      method: "POST",
      data: {
        config: JSON.parse(ctl.new_config),
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      function (success) {
        if (success.data.status != "OK") {
          alert("ERROR, config not saved, check your json");
        } else {
          alert("You did it bastard!");
        }

        ctl.spinnerHide();
      },
      function (failure) {
        alert("ERROR, the server crashed");
        ctl.spinnerHide();
      }
    );
  };

  //main
  $rootScope.$on("$locationChangeSuccess", ctl.loadView);
});
