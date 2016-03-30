var siteApp = angular.module('siteApp', ['ngRoute', 'firebase']);
siteApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {templateUrl: 'partials/HomePage.html', controller: 'HomePageController'})
        .when('/projects', {templateUrl: 'partials/Projects.html', controller: 'ProjectsController'})
        .when('/coe', {templateUrl: 'partials/COE.html', controller: 'COEController'})
        .when('/trainings', {templateUrl: 'partials/Trainings.html', controller: 'TrainingsController'})
       
        .when('/projects/blogs', {templateUrl: 'partials/Blog.html', controller: 'BlogsController'})
        .when('/projects/discussions', {templateUrl: 'partials/Discussions.html', controller: 'DiscussionsController'})
        .when('/projects/documents', {templateUrl: 'partials/fileupload.html', controller: 'DocumentsController',resolve: {
            pagetype: function(){
                return 'PROJECT';
        }
    }
})

        .when('/coe/documents', {templateUrl: 'partials/fileupload.html', controller: 'DocumentsController', resolve: {
            pagetype: function(){
                return 'COE';
        }
    }
    }) 
         .when('/coe/blogs', {templateUrl: 'partials/Blog.html', controller: 'BlogsController'})
        .when('/coe/discussions', {templateUrl: 'partials/Discussions.html', controller: 'DiscussionsController'})
         
         .when('/trainings/documents', {templateUrl: 'partials/fileupload.html', controller: 'DocumentsController',resolve: {
            pagetype: function(){
                return 'TRANING';
        }
    }})
         .when('/trainings/blogs', {templateUrl: 'partials/Blog.html', controller: 'BlogsController'})
        .when('/trainings/discussions', {templateUrl: 'partials/Discussions.html', controller: 'DiscussionsController'})
        
        .when('/projects/:projectname', {
            templateUrl: 'partials/ProjectDetails.html',
            controller: 'ProjetListController'
        })

        .otherwise({redirectTo: '/home'});
}]);
siteApp.controller('HomePageController', function ($scope,$http) {
    $scope.message = 'This is Homepage screen';
     $scope.Employee = [];

    getEmployee($http, $scope);
    // dbservice.getEmployee().then(function(data){
    //     $scope.Employee=data.list
    // })
});
siteApp.controller('ProjetListController', function ($scope, $routeParams) {

    console.log("selected project is ", $routeParams.projectname);
});

var makeRequest = function (url, method, data) {
    angular.element('body').injector().get('$http')({
        method: method,
        url: url,
        data: data
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};

var getProjects = function ($http, $scope) {
    $http({method: "GET", url: "http://localhost:5654/table/projects"}).then(function (projectResponse) {
        $scope.Projects = projectResponse.data.Body.list;
    }, function () {
        console.log("Server not responding!!");
    });
};

//e.g:-  addProject({ "Name": "Nipuna"});
var addProject = function (data) {
    angular.element('body').injector().get('$http')({
        method: "POST",
        url: "http://localhost:5654/table/projects",
        data: {"Name": data["Name"], "Manager": data["Manager"] }
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};

//e.g:- deleteProject({ "Id": "d32erewrwerewrerwer"})
var deleteProject = function (data) {
    angular.element('body').injector().get('$http')({
        method: "DELETE",
        url: "http://localhost:5654/table/projects?Id=" + data["Id"]
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};

//e.g:-  addEmployee({ "FName": "Nipuna"});
//checkout db/lib/models.js for Properties mentioned for Employee table
var addPractise = function (data) {
    angular.element('body').injector().get('$http')({
        method: "POST",
        url: "http://localhost:5654/table/practise",
        data: {"PName": data["PName"]}
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};

var getPractise = function ($http, $scope) {
    $http({method: "GET", url: "http://localhost:5654/table/practise"}).then(function (practiseResponse) {
        $scope.Practise = practiseResponse.data.Body.list;
    }, function () {
        console.log("Server not responding!!");
    });
};
//e.g:-  addEmployee({ "FName": "Nipuna"});
//checkout db/lib/models.js for Properties mentioned for Employee table
var addEmployee = function (data) {
    angular.element('body').injector().get('$http')({
        method: "POST",
        url: "http://localhost:5654/table/employee",
        data: {"FName": data["FName"],"LName":data["LName"],"EmpId":data["EmpId"],"JoinedDate":data["JoinedDate"]}
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};

var getEmployee = function ($http, $scope) {
    $http({method: "GET", url: "http://localhost:5654/table/employee"}).then(function (employeeResponse) {
        $scope.Employee = employeeResponse.data.Body.list;
    }, function () {
        console.log("Server not responding!!");
    });
};

siteApp.controller('ProjectsController', function ($scope, $http) {
    $scope.Projects = [];

    getProjects($http, $scope);
//Logic for show /Hide of ProjectList in Projects tab(Remove later once DB is ready)
    $scope.IsProjectVisible = false;
    $scope.ShowProjectList = function () {
        // console.log('testing');
        //If DIV is visible it will be hidden and vice versa.
        $scope.IsProjectVisible = $scope.IsProjectVisible ? false : true;
    };

    //$scope.AddProject = function () {
    //    addProject($http, "Intermec");
    //};
});


siteApp.controller('BlogsController', function ($scope) {

});

 
siteApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

siteApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
            console.log('file uploaded successfully');
        })
        .error(function(){
            console.log('file uploaded unsuccessfully');
        });
    }
}]);

siteApp.controller('DocumentsController', ['$scope', 'pagetype','fileUpload', function($scope, pagetype,fileUpload){
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = "/fileUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
    console.log('pagetyepe is', pagetype);
   
    $scope.isProject = pagetype === "PROJECT" ? true : false;
    $scope.isCoe = pagetype === "COE" ? true : false;
    $scope.isTraining = pagetype === "TRAINING" ? true : false;
}]);

//FIleuploading using $http service..not working check later
// siteApp.controller('DocumentsController', function ($scope) {
//     var formdata = new Formdata();
//     $scope.getTheFiles=function($files){
//         angular.forEach($files,function(value,key){
//             formdata.append(key,value);
//         });
//     };
//       // NOW UPLOAD THE FILES.
//             $scope.uploadFiles = function () {

//                 var request = {
//                     method: 'POST',
//                     url: '/api/fileupload/',
//                     data: formdata,
//                     headers: {
//                         'Content-Type': undefined
//                     }
//                 };
//                  // SEND THE FILES.
//                 $http(request)
//                     .success(function (d) {
//                         alert(d);
//                     })
//                     .error(function () {
//                     });
//                 }
//     });
//     siteApp.directive('ngFiles',['$parse',function($parse){
//         function docupload(scope,element,attrs){
//             var onChange=$parse(attrs.ngFiles);
//             element.on('change',function(event){
//                 onChange(scope,{$files:event.target.files});
//             });
//         };
//         return{
//             link:docupload
//         }
//     }])//we get the values using $parse service
 

siteApp.controller('DiscussionsController', ['$scope', 'Message', function ($scope, Message, $routeParams) {

    $scope.user = "Guest";

    $scope.messages = Message.all;

    $scope.inserting = function (message) {
        Message.create(message);
    };
}]);
siteApp.factory('Message', ['$firebase',
    function ($firebase) {
        var ref = new Firebase('https://tachatapp.firebaseIO.com');
        var messages = $firebase(ref.child('messages')).$asArray();

        var Message = {
            all: messages,
            create: function (message) {
                return messages.$add(message);
            },
            get: function (messageId) {
                return $firebase(ref.child('messages').child(messageId)).$asObject();
            },
            delete: function (message) {
                return messages.$remove(message);
            }
        };

        return Message;

    }
]);

//Logic for show /Hide of PractiseList in COE tab
siteApp.controller('COEController', function ($scope,$http) {
     $scope.Practise = [];

    getPractise($http, $scope);
    $scope.IsCOEVisible = false;
    $scope.ShowCOEList = function () {
        //If DIV is visible it will be hidden and vice versa.
        $scope.IsCOEVisible = $scope.IsCOEVisible ? false : true;
    }
});
//Logic for show /Hide of PractiseList in Trainings tab
siteApp.controller('TrainingsController', function ($scope,$http) {
     $scope.Practise = [];

    getPractise($http, $scope);
    $scope.TrainingsVisible = false;
    $scope.ShowPractiseList = function () {
        //If DIV is visible it will be hidden and vice versa.
        $scope.TrainingsVisible = $scope.TrainingsVisible ? false : true;
    }
});

siteApp.directive('sideNav', function () {
    return {
        restrict: 'EA',
        controller:function($scope){
            console.log($scope.isProject);
        },
        scope: {
            isProject:'=',
            isPractise:'='
        },
        replace: true,
        templateUrl: 'partials/sidenav.html'
    };
});