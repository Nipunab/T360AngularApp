angular.module('siteApp').directive('fileOnChange', function () {
    return {
        restrict: 'A',
        link: function ($scope, $el, attrs) {
            var onDestroy;
            var el;
            var fileOnChange;

            el = $el.get(0);
            fileOnChange = $scope.$eval(attrs.fileOnChange);

            onDestroy = function (){
                el.removeEventListener('change', fileOnChange, false);
            };

            el.addEventListener('change', fileOnChange, false);

            $el.on('$destroy', onDestroy);
            $scope.$on('$destroy', onDestroy);
        }
    };
});