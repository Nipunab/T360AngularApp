angular.module('siteApp').controller('DiscussionController', function ($scope, $rootScope, api) {

    $scope.safeApply = function (fn) {
        var phase = this.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };


    $scope.NewMessage = {};
    $scope.NewMessage.Rating = 3;

    $scope.newComment = {};
    $scope.newComment.Rating = 3;

    $scope.maxRating = 10;

    $scope.Messages = [];
    $scope.Comments = [];

    var loadDiscussions = function () {
        api.getDiscussion().then(function (discussions) {
            $scope.safeApply(function () {
                $scope.Messages = discussions;
            });
        });
    };

    loadDiscussions();

    $scope.changeRating = function (comment) {

    };

    $scope.addDiscussion = function (newDiscussion) {
        newDiscussion.AddedBy = $rootScope.CurrentUser.Username;
        newDiscussion.ParentId = 0;
        api.addDiscussion(newDiscussion).then(function (resp) {
            newDiscussion.Text="";
            loadDiscussions();
        });
    };

    var loadComments = function (Id) {
        var comments = [];
        api.getDiscussion().then(function (discussions) {
            discussions.forEach(function (fItem) {
                if(fItem.ParentId == Id){
                    comments.push(fItem);
                }
            });
            $scope.safeApply(function () {
                $scope.Comments = comments;
            });
        });

    };


    $scope.openComments = function (disc) {
        $scope.newComment.ParentId = disc.Id;
        loadComments(disc.Id);
        $('#myModal').modal('show');
    };

    $scope.addComment = function (newComment) {
        newComment.AddedBy = $rootScope.CurrentUser.Username;
        api.addDiscussion(newComment).then(function (resp) {
            newComment.Text="";
            newComment.Rating=3;
            loadComments($scope.newComment.ParentId);
        });
    };


});
 

angular.module('siteApp').directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
        '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
        '\u2605' +
        '</li>' +
        '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
});