angular.module('siteApp').controller('ProjectDetailController', function ($scope,$http, pageType, $routeParams) {
    $scope.pageType = pageType;

    $scope.ProjectName = $routeParams.projectname;
});