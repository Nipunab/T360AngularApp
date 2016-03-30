

var makeRequest = function (url, method, data, $http) {
    var reqPromise = null;
    if($http) {
        reqPromise = $http({method: method, url: url, data: data});
    }else{
        reqPromise = angular.element('body').injector().get('$http')({
            method: method,
            url: url,
            data: data
        });
    }
    return reqPromise.then(function (resp) {

    }).catch(function () {

    });
};

function getCookieVal(cName) {
    var cVal = null;
    document.cookie.split(';').forEach(function (h) {
        if(h.indexOf('=') > 0) {
            var cookieName = h.split('=')[0];
            var cookieVal = h.split('=')[1];
            if (cookieName.replace(/ /g, '') == cName) {
                cVal = cookieVal;
                return cookieVal;
            }
        }
    });
    return cVal;
}

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
var getPractise = function ($http, $scope) {
    $http({method: "GET", url: "http://localhost:5654/table/practise"}).then(function (practiseResponse) {
        $scope.Practise = practiseResponse.data.Body.list;
    }, function () {
        console.log("Server not responding!!");
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
//e.g:- deleteProject({ "Id": "d32erewrwerewrerwer"})
var deletePractise = function (data) {
    angular.element('body').injector().get('$http')({
        method: "DELETE",
        url: "http://localhost:5654/table/practise?Id=" + data["Id"]
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
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
        if(employeeResponse.data && employeeResponse.data.Body && employeeResponse.data.Body.list){
            $scope.Employee = employeeResponse.data.Body.list;
        }else{
            $scope.Employee = [];
        }
    }, function () {
        console.log("Server not responding!!");
    });
};
//e.g:- deleteProject({ "Id": "d32erewrwerewrerwer"})
var deleteEmployee = function (data) {
    angular.element('body').injector().get('$http')({
        method: "DELETE",
        url: "http://localhost:5654/table/employee?Id=" + data["Id"]
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};
 


var getDiscussion = function ($http, $scope) {
    $http({
        method: "GET", 
        url: "http://localhost:5654/table/discussion"}).then(function (discussionResponse) {
        $scope.Discussion = discussionResponse.data.Body.list;
    }, function () {
        console.log("Server not responding!!");
    });
};
//e.g:-  addEmployee({ "FName": "Nipuna"});
//checkout db/lib/models.js for Properties mentioned for Employee table
var addDiscussion = function (data) {
    angular.element('body').injector().get('$http')({
        method: "POST",
        url: "http://localhost:5654/table/discussion",
        data: {"Comments": data["Comments"]}
    }).then(function (dt) {
        console.log(dt);
    }).catch(function () {
        console.log('ERR');
    });
};
