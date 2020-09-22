app.init_editor = function(ctl,$http,$scope,$compile,$sce){

  ctl.color_array = ['599da2', '5782ba', '35cbed', '3CB371', 'ff9d5a'];

 

  ctl.ret_stuff = "";

  ctl.new_ret_stuff = "";

  ctl.id_num = 0;

  ctl.id_num_start = 0;

  ctl.difference = 0;

 

  ctl.added_or_deleted = null

  ctl.location_changed = null

              

  ctl.read_config = function(config,str,level){

                var config_keys = Object.keys(config);

                var real_keys = config_keys;

                let array_bool = false;

               

                if(typeof(config) == "object" && config.length !== undefined){

                               config_keys = [];

                               real_keys = [];

                               for (let i = 0; i < eval(str).length; i++) {

                                              real_keys.push(i);

                                              config_keys.push(0);

                               }

                               if(eval(str).length == 0){ // if no elements in array, place an add button

                                              ctl.new_ret_stuff += "<button class='btn btn-secondary' style='margin:5px 15px 5px 15px;' ng-click='ctl.add_item(" + str + ", " + JSON.stringify(config) + ", " + ctl.id_num + ")'>add new item</button><br>"

                               }

                               array_bool = true;

                }



                for(var index in config_keys){

                              

                               // add wrapping around certain level types

                if(config[config_keys[index]].html_type){ // if a leaf node

                                              ctl.new_ret_stuff +="<div class='container' style='padding:0px; margin:0px'><div class='row' style='margin:10px 0px'><label class='ng-binding' style='margin:5px 10px; width:200px'>"+real_keys[index]+":</label>"

                               }

                               else if(!array_bool){ // if an object header     

                                              ctl.new_ret_stuff +="<div style='border: solid black 1px; border-radius: 15px; margin:10px 0px 10px 0px; background-color: #"+ ctl.color_array[level % ctl.color_array.length] +";'>"

                                              ctl.new_ret_stuff += "<button type='button' class='collapsible' style='padding:0px 20px; margin:5px 10px 5px 10px; '>"+real_keys[index]+": </button>"

                                             

                                              var unique_id = 0;

                                              if (ctl.id_num >= ctl.location_changed + ctl.difference && ctl.added_or_deleted == "added"){

                                                             unique_id = ctl.id_num - ctl.difference

                                              }

                                              else if(ctl.id_num >= ctl.location_changed && ctl.id_num < ctl.location_changed + ctl.difference && ctl.added_or_deleted == "added"){

                                                             unique_id = null

                                              }

                                              else if(ctl.id_num >= ctl.location_changed && ctl.added_or_deleted == "deleted"){ //must be deleted

                                                             unique_id = ctl.id_num + ctl.difference

                                              }             

                                              else{

                                                             unique_id = ctl.id_num

                                              }



                                 if(document.getElementById(unique_id) && document.getElementById(unique_id).style.display == 'block'){

                                                             ctl.new_ret_stuff += "<div class='content' id='"+ctl.id_num+"' style='display:block;'><br>"

                                              }

                                              else{

                                                            

                                                             ctl.new_ret_stuff += "<div class='content' id='"+ctl.id_num+"'><br>"

                                              }

                                             

                                              ctl.id_num += 1;

                               }

                               else{ // if an array element

                                              ctl.new_ret_stuff += "<div style='border: solid black 1px; border-radius: 15px; padding:20px; margin:0px 20px; background-color: #"+ ctl.color_array[level % ctl.color_array.length] +"'>";      

                                              ctl.id_num_start = ctl.id_num

                               }

                              

                              

                               // functional stuff in this section for adding buttons or recursion

                               new_str = str + "[\"" + real_keys[index] + "\"]";

                    if(config[config_keys[index]].html_type == "image"){

                                ctl.new_ret_stuff += "</div><div><img src='"+eval(new_str)+"' style='height:150px; margin:0px 50px;' /><br>";

                                ctl.new_ret_stuff += "<a style='margin:0px 20px 0px 50px'>Change Image:</a>"

                                /*<form enctype='multipart/form-data' name="fileinfo">
        <input type='file' name="image"/></p>
        <button ng-click='ctl.upload($event,key)' >uplaod</button>
      </form>*/

                                ctl.new_ret_stuff +="<form method='POST' enctype='multipart/form-data'>"
                                
                                ctl.new_ret_stuff += "<input type='file' name='my_file'/></p>";

                                ctl.new_ret_stuff += "<button ng-click=\"ctl.upload($event,'"+new_str.replaceAll("\"","\\\'")+"','image')\">uplaod</button>"

                                ctl.new_ret_stuff +="</form>"
                               }

                               else if(config[config_keys[index]].html_type == "number"){

                                              if("step" in config[config_keys[index]] ) {

                                                             ctl.new_ret_stuff += "<input type='number' step='"+config[config_keys[index]].step+"' class='form-control' style='width:300px' ng-model='"+new_str+"'>"; 

                                              }

                                              else{

                                                             ctl.new_ret_stuff += "<input type='number' step='0.00000001' class='form-control' style='width:300px' ng-model='"+new_str+"'>"; 

                                              }

                               }

                               else if(config[config_keys[index]].html_type == "text"){

                                              ctl.new_ret_stuff += "<input type='text' class='form-control' style='width:300px' ng-model='"+new_str+"'>";

                               }

                               else if(config[config_keys[index]].html_type == "file"){

                                              ctl.new_ret_stuff += "<input type='file' image_key='"+new_str+"' ng-upload-change='fileChanged($event,"+new_str+")'>";

                               }

                               else if(config[config_keys[index]].html_type == "video"){

                                              ctl.new_ret_stuff += "<input type='file' image_key='"+new_str+"' ng-upload-change='fileChanged($event,"+new_str+")'  accept=\"video/*\">";

                               }

                               else if(config[config_keys[index]].html_type == "audio"){

                                              ctl.new_ret_stuff += "<audio controls>";

                                              ctl.new_ret_stuff += "<source src='"+eval(new_str)+"'>";

                                              ctl.new_ret_stuff += "</audio>"

                                              ctl.new_ret_stuff +="<form method='POST' enctype='multipart/form-data'>"
                                
                                              ctl.new_ret_stuff += "<input type='file' name='my_file'accept=\"audio/*\"/></p>";

                                              ctl.new_ret_stuff += "<button ng-click=\"ctl.upload($event,'"+new_str.replaceAll("\"","\\\'")+"','audio')\">uplaod</button>"

                                              ctl.new_ret_stuff +="</form>"

                               }

                               else if(config[config_keys[index]].html_type == "date"){

                                              ctl.new_ret_stuff += "<input type='date' ng-model='"+new_str+"' value='"+eval(new_str)+"'>";

                               }else if(config[config_keys[index]].html_type == "select"){

                                              var selected = eval(new_str);

                                              var option_list = "";

                                              var i=0;

                                              for(option in config[config_keys[index]].options){

                                                             option_list += "'" + config[config_keys[index]].options[option].replace("'","\\\'") + "'";

                                                             if(i+1 < config[config_keys[index]].options.length)

                                                                            option_list += ", ";

                                                             i+=1;

                                              }

                                              ctl.new_ret_stuff += "<select ng-model='"+new_str+"' ng-options=\"option for option in ["+option_list+"]\"'></select>";

                               }

                               else{

                               ctl.read_config(config[config_keys[index]],new_str, level+1);

                               }

                              

                               if("description" in config[config_keys[index]]){

                                              ctl.new_ret_stuff += "<a style='margin: 0px 15px'>"+config[config_keys[index]].description+"</a><br>"

                               }

                               else{

                                              ctl.new_ret_stuff += "<br>"

                               }

                              

                              

                if(config[config_keys[index]].html_type){ // if a leaf node

                                              ctl.new_ret_stuff +="</div></div>"

                               }

                               else if(!array_bool){ // if an object header

                                              ctl.new_ret_stuff +="</div></div>"

                               }

                               else{ // if an array

                                              // array element remove button

                                              var delete_id = ctl.id_num-1

                                              ctl.new_ret_stuff += "<button class='btn btn-secondary' style='margin:5px 15px 5px 10px;' ng-click='ctl.delete_item(" + str + ","+ index + "," + delete_id + ", "+ ctl.id_num_start +")'>remove item</button><br>"

                                             

                                              // array bool outline

                                              ctl.new_ret_stuff += "</div><br>";

                                             

                                              // if last index place an add button

                                              if(index == config_keys.length-1){

                                                             ctl.new_ret_stuff += "<div style='border: solid black 1px; border-radius: 15px; margin:0px 20px; background-color: #"+ ctl.color_array[level % ctl.color_array.length] +"'>";

                                                             ctl.new_ret_stuff += "<button class='btn btn-secondary' style='margin:5px 20px 5px 10px;' ng-click='ctl.add_item(" + str + ", " + JSON.stringify(config) + ", " + ctl.id_num + ")'>add new item</button></div><br>"

                                              }

                               }

                }

 }

 

               ctl.delete_item = function(str, index, id_num, id_start){

                              str.splice(index, 1);

                              ctl.new_ret_stuff = "";

                              ctl.id_num = 0;

                              ctl.added_or_deleted = "deleted"

                              ctl.location_changed = id_start

                              ctl.difference = id_num - id_start + 1

                              var config = ctl.group_config.schema.properties;

                              ctl.read_config(config, "ctl.items[ctl.current_ckid]", 0); //-------------------------------needs to be edited for final version

                              ctl.ret_stuff = ctl.new_ret_stuff;

                              ctl.addDropdownFunctionality();

                              ctl.added_or_deleted = null;

                              ctl.location_changed = null;

               }

              

                             

               ctl.check_my_items = function(config, my_items){

                              //obj = {}

               ctl.build_empty_object_from_config(config, my_items);

                              console.log("Finished rebuilding my items");

               }

                             

               var obj = {}

 

         ctl.build_empty_object_from_config = function(config, object){

                              for(var index in config){                                             

                                             if(typeof(config[index]) == "object" && config[index].length !== undefined){ // array

                                                            if(!(index in object)) {

                                                                           object[index] = []

                                                            }else if(object[index].length == 0){

                                                                           object[index] = [];

                                                            }else{

                                                            ctl.build_empty_object_from_config(config[index], object[index]) // recursively loop through array

                                                            }

                                             }

                                             else if(config[index]["html_type"] === undefined){ // if the next layer is not html_type, must be another object

                                                            if(!(index in object)) {

                                                                           object[index] = {}

                                                            ctl.build_empty_object_from_config(config[index], object[index])

                                                            }

                                                            else{

                                                            ctl.build_empty_object_from_config(config[index], object[index])

                                                            }

                                                            ctl.difference += 1

                                             }

                                             else{ // if a leaf node

                                                            if(!(index in object)) {

                                                                           object[index] = ""

                                                            }

                                             }

                              }

               }

              

               ctl.add_item = function(str, sub_config, id_num){

                              obj = {}

                              ctl.difference = 0

               ctl.build_empty_object_from_config(sub_config[0], obj)

                              console.log('str ',str);

                              str.push(obj);

                              ctl.new_ret_stuff = "";

                              ctl.id_num = 0

                              ctl.added_or_deleted = "added";

                              ctl.location_changed = id_num;

                              var config = ctl.group_config.schema.properties;

                              ctl.read_config(config, "ctl.items[ctl.current_ckid]", 0); //-------------------------------needs to be edited for final version

                              ctl.ret_stuff = ctl.new_ret_stuff;

                              ctl.addDropdownFunctionality();

                              ctl.added_or_deleted = null;

                              ctl.location_changed = null;

               }

 

 

    ctl.opendetail = function(event){
    if(this.options == undefined){
      ctl.current_ckid = event;
    }else{
      ctl.current_ckid = this.options.customID;
    }

    ctl.new_item = false;

    ctl.show_errors = false;

    console.log("ctl.items["+ctl.current_ckid+"] ",ctl.items[ctl.current_ckid])

    //ctl.rec(ctl.items[ctl.current_ckid]);

    //ctl.read_config(config, "ctl.my_items[\"0\"]", 0);

    var config = ctl.group_config.schema.properties;

    ctl.check_my_items(config, ctl.items[ctl.current_ckid])

               ctl.new_ret_stuff = ""

               ctl.id_num = 0

    ctl.read_config(config, "ctl.items[ctl.current_ckid]", 0);

    ctl.ret_stuff = ctl.new_ret_stuff;

               $(".modal").show();

               ctl.apply();

               ctl.addDropdownFunctionality();

  }

 

  ctl.openeditor = function(){

    ctl.show_errors = false;

    ctl.new_item = true;

               ctl.current_ckid = ctl.uuidv4();

              

               ctl.items[ctl.current_ckid] = {} ;

              

                var config = ctl.group_config.schema.properties;

               ctl.check_my_items(config, ctl.items[ctl.current_ckid])

               ctl.new_ret_stuff = ""

               ctl.id_num = 0

    ctl.read_config(config, "ctl.items[ctl.current_ckid]", 0);

    ctl.ret_stuff = ctl.new_ret_stuff;

               $(".modal").show();

               ctl.apply();

               ctl.addDropdownFunctionality();

  }
 

  ctl.uuidv4 = function() {

               return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {

                              var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

                              return v.toString(16);

               });

  }

 

               ctl.addDropdownFunctionality = function(){

                              setTimeout(function(){

                                             var coll = document.getElementsByClassName("collapsible");

                                             var i;

                                             for (i = 0; i < coll.length; i++) {

                                               coll[i].addEventListener("click", function() {

                                                            this.classList.toggle("active");

                                                            var content = this.nextElementSibling;

                                                            if (content.style.display === "block") {

                                                                           content.style.display = "none";

                                                            } else {

                                                                           content.style.display = "block";

                                                            }

                                               });

                                             }

                              }, 1000);

               }

              

    ctl.saveData = function(){

      ctl.spinnerShow();
      
      var item_data = Array.from(ctl.items[ctl.current_ckid])
      
      return $http(
        {
        url: ctl.BASE_URL+"/"+ctl.current_ckid+"/updatedata.json",
        method: "PUT",
        data: {
          my_item :  ctl.items[ctl.current_ckid],
          initial_group : ctl.config.group_name
        },
        headers: {
         'Content-Type': 'application/json'
       }
      }
    ).then(function(success){

      alert("Item saved!");

      ctl.spinnerHide();

    },function(failure){

      alert("ERROR, item not saved");

      ctl.spinnerHide();

    })

  };

  ctl.saveData2 = function(){

      ctl.spinnerShow();
      
      var item_data = Array.from(ctl.items[ctl.current_ckid])
      
      return $http(
        {
        url: ctl.BASE_URL+"/"+ctl.current_ckid+"/updatedata.json",
        method: "PUT",
        data: {
          my_item :  ctl.items[ctl.current_ckid],
          initial_group : ctl.config.group_name
        },
        headers: {
         'Content-Type': 'application/json'
       }
      }
    )/*.then(function(success){

      alert("Item saved!");

      ctl.spinnerHide();

    },function(failure){

      alert("ERROR, item not saved");

      ctl.spinnerHide();

    })*/

  };

 

  ctl.encodeImage = function(files,image_field) {

               console.log("image_field: ",image_field);

    console.log("encodeImage: ",files);

    var filesSelected = files;

    console.log("filesSelected -> ",filesSelected.length > 0);

    if (filesSelected.length > 0) {

      var fileToLoad = filesSelected[0];

      console.log(fileToLoad);

      var fileReader = new FileReader();

 

      fileReader.onload = function(fileLoadedEvent) {

        var srcData = fileLoadedEvent.target.result; // <--- data: base64

 

        var newImage = document.createElement('img');

        newImage.src = srcData;

        //console.log("image_field ->",image_field," base64: ",srcData);

        //ctl.items[ctl.current_ckid][image_field] = srcData;

        //console.log("ctl.current_item => ",ctl.items[ctl.current_ckid][image_field]);

        console.log(image_field + "= '"+ srcData+"'");

        eval(image_field + "= '"+ srcData+"'");

        ctl.apply();

      }

      fileReader.readAsDataURL(fileToLoad);

    }

  }

 

  $scope.fileChanged = function($event,$attrs){

    var key = $event.target.attributes.image_key.nodeValue;

    ctl.files = $event.target.files;

    ctl.encodeImage(ctl.files,key);

  }

 

 

  ctl.hideModal = function(modal){

    ctl.current_item = null;

    $('.modal').hide();

  }

 

  ctl.delete_temp_item = function(modal){

               delete ctl.items[ctl.current_ckid];

               ctl.current_ckid = null;

               ctl.new_item = null;

               ctl.hideModal(modal);

  }

  ctl.upload = function(ev,key,type){

    //console.log(ev.target.form);
    //console.log(form_id);
    var _ev = ev;
    var _key = key;
    var _type = type;
    ctl.saveData2().then(function(success){
      ctl.spinnerShow();
      //alert("Item saved!");

      var keys = _key.replaceAll("ctl.items[ctl.current_ckid]","").split("']['");
      keys = $.map(keys,function(el){ el=el.replace("['",""); el=el.replace("']",""); return el;})
      console.log(keys);
      var form = _ev.target.form;
      var oData = new FormData(form);
      oData.append("group_name", ctl.config.group_name);
      oData.append("type", _type);
      /*for (var [key, value] of oData.entries()) { 
        console.log(key," : ",value);
      }*/
      // trovare la chiave completa
      /*path = [];
      var search_tag = $(ev.target);
      while(!search_tag[0].className.includes('main_key')){
        console.log(search_tag[0].className );
        if(search_tag.attr('key') != undefined){
          console.log("ATTR: ",search_tag.attr('key') );
          path.unshift(search_tag.attr('key'));
        }
        search_tag = search_tag.parent();
       };
      console.log(path);
      ;*/
      oData.append("keys", keys);
      for (var [key, value] of oData.entries()) { 
        console.log(key," : ",value);
      }
      var oReq = new XMLHttpRequest();
      oReq.open("POST", ctl.BASE_URL+"/"+ctl.current_ckid+"/update_image", true);

      oReq.onload = function(oEvent) {
        if (oReq.status == 200) {
          console.log("Uploaded!");
          ctl.hideModal('.modal');
          //alert("media saved");
          //document.location.reload(true);
          var my_function = function(){
            ctl.opendetail(ctl.current_ckid);
          };
          ctl.loadGroup(my_function);
          ctl.spinnerHide();
        } else {
          alert("Error: " + oReq.status + " occurred when trying to upload your file.\n");
        }
      };

      oReq.send(oData);
      ev.preventDefault();

        ctl.spinnerHide();

    },function(failure){

      alert("ERROR, item not saved");

      ctl.spinnerHide();

    })
   
  }
  ctl.current_el = {};

  ctl.change = function(value){
    ctl.my_object = value;
    ctl.apply();
  }

  ctl.typeof = function(value){
    return typeof(value);
  }


}