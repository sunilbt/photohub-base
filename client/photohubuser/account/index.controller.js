(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($scope, $window, UserService, AlertService, PhotographerService, FileUploadService) {
        //variable declaration
        var vm = this;
        vm.user = null;
        vm.profile = {};
        vm.positiondata = {};
        vm.latitude = 0;
        vm.longitude = 0;
        vm.categoryList = ["Kids", "Candid", "Concept", "Corporate", "Documentary","Events", "Fashion","Portfolio", "Product", "Short Films", "Weddings", "Others"];
        vm.languageList = ["Kannada", "English","Telugu", "Malayalam", "Tamil", "Hindi", "Marathi", "Gujarathi", "Bengali", "Urdu", "Punjabi"];        
        //end of variable declaration

        //function declaration
        vm.saveProfile = saveProfile;
        vm.uploadFile = uploadFile;
        vm.enableEditor = enableEditor;
        vm.disableEditor = disableEditor;
        vm.getPosition = getPosition;
        //end of function declaration


        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;

                PhotographerService.GetByUserId(vm.user._id).then(function(post){
                        vm.profile = post;
                    });
            });
        }

        //functionality to save the profile of photographer or user
        function saveProfile() {
            if(vm.profile._id){        

                vm.getPosition(vm.profile, function(updatedprofile){

                        PhotographerService.Save(updatedprofile)
                            .then(function () {
                                AlertService.Success('Profile updated');
                            })
                            .catch(function (error) {
                                AlertService.Error(error);
                            });

                });

                

            } else {       
                //when the profile gets created the first time save the details from user table onto photographers   
                if(vm.profile){
                    console.log('profile exists');
                    vm.data = {
                        firstname: vm.user.firstName,
                        lastname: vm.user.lastName,
                        userid: vm.user._id,
                        starrating: [{
                            stars: 5,
                            userid: 'photohub'
                        }],
                        averagerating: 5                           
                    };
                    angular.extend(vm.profile, vm.data);
                } else{
                    console.log('profile does  not exist');
                    vm.profile = { 
                        firstname: vm.user.firstName,
                        lastname: vm.user.lastName,
                        userid: vm.user._id,
                        starrating: [{
                            stars: 5,
                            userid: 'photohub'
                        }],
                        averagerating: 5    
                    };
                }
                
                vm.getPosition(vm.profile, function(updatedprofile){

                    PhotographerService.Save(updatedprofile)
                    .then(function () {
                        AlertService.Success('Profile updated');
                    })
                    .catch(function (error) {
                        AlertService.Error(error);
                    });       

                    initController();
                });

                         
            }

            vm.disableEditor();
        }
        //end of function saveProfile

        //functionality to upload profile picture
        function uploadFile(){
            var file = $scope.myFile;
            var uploadUrl = "/savedata";

            FileUploadService.UploadFileToUrl(file, uploadUrl);

            if(vm.profile._id){      
                vm.profileurl = { 
                    firstname: vm.user.firstName,
                    lastname: vm.user.lastName,
                    userid: vm.user._id,
                    imageurl: $scope.myFile.name.slice(0,-4) + '-' + Date.now().toString().substring(0, 10) +'.jpg'
                };
                angular.extend(vm.profile, vm.profileurl);      
                PhotographerService.Save(vm.profile)
                .then(function () {
                    AlertService.Success('Profile updated');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });
            } else {       
                vm.profile = { 
                    firstname: vm.user.firstName,
                    lastname: vm.user.lastName,
                    userid: vm.user._id,
                    imageurl: $scope.myFile.name.slice(0,-4) + '-' + Date.now().toString().substring(0, 10) +'.jpg', 
                    starrating: [{
                        stars: 5,
                        userid: 'photohub'
                    }],
                    averagerating: 5                     
                };
                
                PhotographerService.Save(vm.profile)
                .then(function () {
                    AlertService.Success('Profile updated');
                })
                .catch(function (error) {
                    AlertService.Error(error);
                });      
                
                initController(); 
                          
            }

            //refreshing the page, reloads the data from the DB and helps in displaying the ppicture   
            location.reload();          
        }
        //send of function uploadFile


        //enable the profile edit when clicked on edit profile
        $scope.editorEnabled = false;
        function enableEditor () {
            $scope.editorEnabled = true;
        };
        
        function disableEditor() {
            $scope.editorEnabled = false;
        };
        //end of profile editor enable/disable

        //get the lattitude longitude of the address entered
        function getPosition(profile, callback){    
            if(vm.profile.city != null && vm.profile.state != null){
                vm.completeAddress = vm.profile.address1 +" "+vm.profile.address2 +" "+vm.profile.city+" "+vm.profile.state+" "+vm.profile.country;
            } else {
                vm.completeAddress = "Bangalore, India";
            }

            var geocoder = new google.maps.Geocoder();
            if (geocoder) {
                geocoder.geocode({
                    'address': vm.completeAddress
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {  
                        vm.latitude = results[0].geometry.location.lat();
                        vm.longitude = results[0].geometry.location.lng();   

                        vm.positiondata ={
                            position: [vm.latitude, vm.longitude]
                        }

                        angular.extend(profile, vm.positiondata);
                        console.log(profile.position);
                        callback(profile);
                    } else{
                        callback(profile);
                    }
                });

            }
        }//end og getPoisition(x,y) function


    }// end of Controller

})();