angular.module('siteApp').controller('PractiseDetailController', function ($scope,$http, pageType, $routeParams) {
    $scope.pageType = pageType;

    $scope.PractiseName = $routeParams.practisename;
});