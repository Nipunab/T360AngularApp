angular.module('siteApp').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'})
        .when('/home', {templateUrl: 'partials/HomePage.html', controller: 'HomePageController'})
        .when('/projects', {templateUrl: 'partials/Projects.html', controller: 'ProjectsController'})
        .when('/coe', {templateUrl: 'partials/COE.html', controller: 'COEController'})
        .when('/discussions', {templateUrl: 'partials/Discussions.html', controller: 'DiscussionController'})

        .when('/projects/blogs', {
            templateUrl: 'partials/Blog.html', controller: 'BlogsController', resolve: {
                pageType: function () {
                    return 'PROJECT';
                }
            }
        })

        .when('/projects/documents', {
            templateUrl: 'partials/fileupload.html', controller: 'DocumentsController', resolve: {
                pageType: function () {
                    return 'PROJECT';
                }
            }
        })

         .when('/projects/:projectname', {
            templateUrl: 'partials/ProjectDetails.html',
            controller: 'ProjectDetailController',
            resolve: {
                pageType: function () {
                    return 'PROJECT';
                }
            }
        })

        .when('/coe/documents', {
            templateUrl: 'partials/fileupload.html', controller: 'DocumentsController', resolve: {
                pageType: function () {
                    return 'COE';
                }
            }
        })
        .when('/coe/blogs', {
            templateUrl: 'partials/Blog.html', controller: 'BlogsController', resolve: {
                pageType: function () {
                    return 'COE';
                }
            }
        })

         .when('/coe/:practisename', {
            templateUrl: 'partials/PractiseDetails.html',
            controller: 'PractiseDetailController',
            resolve: {
                pageType: function () {
                    return 'COE';
                }
            }
        })
 
        .when('/admin', {
            templateUrl: 'partials/admin.html',
            controller: 'adminCntl'
        })

        .otherwise({redirectTo: '/login'});
}]);