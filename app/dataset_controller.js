app.dataset_controller = function(ctl, $scope, $http){
    
  ctl.config = {};
  ctl.config.group_name = "Bells 2019";
  
  if(ctl.getQueryVariable("group_name")){
    ctl.config.group_name = ctl.getQueryVariable("group_name");
    console.log("group_name",ctl.config.group_config );
  }

  if(ctl.config.group_name == undefined){
    ctl.config.group_name = prompt("Please enter the dataset name");
  }
  
  ctl.gps_option = {
    enableHighAccuracy: true,
    timeout: 20000, //timeout to get a coordinate
    maximumAge: 60000 //maximum time that a position is cached
  };

  ctl.gpsOnError = function(error){
    //console.log(error);
    /*switch(error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      /*case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }*/
  };

  ctl.gpsGetCoords = function(userPos){
    ctl.currentpos = {lat: userPos.coords.latitude, lng: userPos.coords.longitude}
    if(!ctl.radius)
      ctl.radius = 100;
     if (ctl.map && ctl.currentpos_marker && ctl.currentpos_marker_radius ) {
      ctl.map.removeLayer(ctl.currentpos_marker);
      ctl.map.removeLayer(ctl.currentpos_marker_radius);
      ctl.currentpos_marker        = L.marker([ctl.currentpos.lat,ctl.currentpos.lng],{icon: ctl.stickman}).addTo(ctl.map);
      ctl.currentpos_marker_radius = L.circle([ctl.currentpos.lat,ctl.currentpos.lng], ctl.radius).addTo(ctl.map);
    }
    ctl.apply();
  }

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      ctl.gpsGetCoords,
      ctl.gpsOnError,
      ctl.gps_option
    );
  }
   

  ctl.elementi = [];


  ctl.getGroup = function(group_name){
    var defer = $.Deferred();
    $http.get(ctl.BASE_URL+"/datasets.json?group_name="+group_name).then(
      function(response){
        defer.resolve(response.data);
      },
      function(error){
        defer.reject(error.data);
      }
    );
    return defer;
  };

  //distanza in METRI
  ctl.calculateDistance = function(pointA,pointB){
    var lat1=pointA.lat;
    var lon1=pointA.lng;
    var lat2=pointB.lat;
    var lon2=pointB.lng;
    var R = 6371; // Radius of the earth in km
    var dLat = ctl.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = ctl.deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(ctl.deg2rad(lat1)) * Math.cos(ctl.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d*1000; //Distance in m
  }

  ctl.deg2rad = function(deg){
    return deg * (Math.PI/180);
  }

  ctl.nearestPlaces = function(){
    ctl.spinnerShow("Finding nearest places ...");
    ctl.near_places = $.map(ctl.elementi,function(item){
      if(item.birth_certificate && item.birth_certificate.lat && item.birth_certificate.lng ){
        var pointA={lat : item.birth_certificate.lat, lng : item.birth_certificate.lng };
        var pointB=ctl.currentpos;
        if(!ctl.currentpos){return;}
        var dist = ctl.calculateDistance(pointA,pointB);
        if( dist <= 500){
          console.log("distance: ",dist);
          item.distance = parseInt(dist); 
          return item;
        };
      }
    });

    ctl.spinnerHide();
  }
};