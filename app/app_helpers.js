app.app_helpers = function (ctl) {
  ctl.image_open = false;

  ctl.stickman_url = "/images/gps_pin.png";
  ctl.stickman = L.icon({
    iconUrl: ctl.stickman_url,
    iconSize: [32, 32], // size of the icon
    iconAnchor: [16, 16], // point of the icon which will correspond to marker's location
  });

  ctl.getQueryVariable = function (variable, default_value) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return default_value;
  };

  ctl.spinnerShow = function (msg) {
    if (msg == undefined) {
      msg = "Loading ...";
    }
    $(".spinner > div.text").text(msg);
    $(".spinner").show();
  };

  ctl.spinnerHide = function () {
    $(".spinner").hide();
  };

  ctl.modal_image = function (img_src) {
    // Get the modal
    ctl.image_open = true;
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var modalImg = document.getElementById("modalImg");
    //var captionText = document.getElementById("caption");
    console.log("sto mettendo block");
    modal.style.display = "block";
    console.log(img_src);
    modalImg.src = img_src;
    //captionText.innerHTML = this.alt;

    ctl.apply();
  };

  ctl.close_modal_image = function () {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    ctl.image_open = false;
    ctl.apply();
  };

  String.prototype.replaceAll = function (searchStr, replaceStr) {
    var str = this;
    if (str.indexOf(searchStr) === -1) {
      return str;
    }
    return str.replace(searchStr, replaceStr).replaceAll(searchStr, replaceStr);
  };
};

/*
background: black;
  transition: background-color 5000ms linear;*/
