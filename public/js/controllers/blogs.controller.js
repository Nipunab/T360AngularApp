angular.module('siteApp').controller('BlogsController', function ($scope,$http, pageType) {
    $scope.pageType = pageType;
});