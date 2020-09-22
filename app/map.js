app.init_map = function (ctl) {
  ctl.dataset_errors = [];

  ctl.onLocationFound = function (e) {
    console.log("maps location", e);
    ctl.radius = e.accuracy;
    console.log("RADIUS: ", ctl.radius);
    if (ctl.currentpos_marker && ctl.currentpos_marker_radius) {
      // check
      ctl.map.removeLayer(ctl.currentpos_marker);
      ctl.map.removeLayer(ctl.currentpos_marker_radius);
    }
    ctl.currentpos_marker = L.marker([ctl.currentpos.lat, ctl.currentpos.lng], {
      icon: ctl.stickman,
    }).addTo(ctl.map);
    ctl.currentpos_marker_radius = L.circle(
      [ctl.currentpos.lat, ctl.currentpos.lng],
      ctl.radius
    ).addTo(ctl.map);

    ctl.apply();
  };

  ctl.init_map = function () {
    console.log("init map!");
    ctl.map = L.map("map");
    ctl.map.on("load", ctl.mapLoaded);

    ctl.map.setView([45.438109, 12.327966], 14); // = L.map('map')//,{center:[45.438109, 12.327966],zoom: 17 });
    if (ctl.currentpos)
      ctl.map.setView([ctl.currentpos.lat, ctl.currentpos.lng], 14);
    ctl.map.invalidateSize();
  };

  ctl.mapLoaded = function () {
    ctl.map.locate();
    console.log("map loaded");
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}", {
      foo: "bar",
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    }).addTo(ctl.map);
    $(window).on("resize", function () {
      $("#map").height($(window).height() - $("nav").height() * 2);
      ctl.map.invalidateSize();
    });
    $(window).trigger("resize");
    //cause apple, se cambi l'orientamento dello schermo, non rimette più la viewport al suo posto
    $(window).on("orientationchange", function () {
      //console.log(this);
      //grazie apple per il tuo bellissimo browser di merda
      setTimeout(function () {
        $(window).scrollTop(10);
      }, 400);
      setTimeout(function () {
        $(window).scrollTop(110);
      }, 500);
    });
    ctl.map.invalidateSize();
    if (ctl.currentpos) {
      ctl.map.locate();
    }
    ctl.map.on("locationfound", ctl.onLocationFound);
    ctl.map.on("locationerror", function (e) {
      console.log(e.message);
    });
    ctl.apply();
  };

  ctl.addMarker = function (item) {
    if (item.birth_certificate.lat == null) {
      //console.log("errore lat => ", item);
      ctl.dataset_errors.push(item);
      return;
    }
    var iconurl = "https://app.daaab.it/favicon.ico";
    if (item.icon) {
      var iconurl = item.icon;
    }
    var icon = L.icon({
      iconUrl: iconurl,
      iconSize: [32, 32], // size of the icon
      iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    var new_marker = L.marker(
      [item.birth_certificate.lat, item.birth_certificate.lng],
      { customID: item.birth_certificate.ck_id, icon: icon }
    );
    new_marker.on("click", ctl.opendetail);
    new_marker.addTo(ctl.map);
  };
};
