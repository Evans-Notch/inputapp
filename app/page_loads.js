app.init_pageloads = function (ctl, $route) {
  ctl.loadView = function () {
    ctl.currTemplate = $route.current.templateUrl;
    console.log(ctl.currTemplate);
    switch (ctl.currTemplate) {
      case "views/fragments/map.html":
        if ($("#map").length > 0) {
          ctl.init_map();
          ctl.loadGroup();
        } else {
          var my_int = setInterval(function () {
            if ($("#map").length > 0) {
              ctl.init_map();
              ctl.loadGroup();
              clearInterval(my_int);
            }
          }, 500);
        }
        break;
      case "views/fragments/near_me.html":
        if (ctl.elementi.length == 0) ctl.loadGroup();
        ctl.nearestPlaces();
        break;
      case "views/fragments/new.html":
        if (ctl.elementi.length == 0) ctl.loadGroup(ctl.openeditor);
        ctl.spinnerHide();
        ctl.apply();
        break;
      case "views/config.html":
        console.log("HELLO");
        ctl.loadGroup();
        break;
      default:
        console.error("non dovresti essere qui");
        break;
    }
  };

  ctl.loadGroup = function (foo) {
    ctl.getGroup(ctl.config.group_name).then(
      function (response) {
        console.log("dati presi: ", response);
        ctl.group_config = response.group_config;
        ctl.elementi = response.dataset;
        ctl.items = {};

        $.each(ctl.elementi, function (el) {
          if (ctl.map) ctl.addMarker(ctl.elementi[el]);
          ctl.items[ctl.elementi[el].birth_certificate.ck_id] =
            ctl.elementi[el];
        });
        if (foo) foo();
        ctl.spinnerHide();
        ctl.nearestPlaces();
        ctl.apply();
      },
      function (err) {
        console.log(err);
      }
    );
  };
};
