angular.module('siteApp').controller('DocumentsController', function ($scope,$http, pageType, fchnkUpload, api) {

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

    $scope.pageType = pageType;
    console.log("page Type ", pageType);

    $scope.Documents = [];

    var loadDocuments = function () {
        api.getDocuments().then(function (docs) {
            console.log('docs are ', docs);
            $scope.safeApply(function () {
                $scope.Documents = docs;
            });
        });
    };

    loadDocuments();

    $scope.deleteDocument = function (doc) {
        api.deleteDocument(doc).then(function (resp) {
            $scope.safeApply(function () {
                _.remove($scope.Documents, {Id: doc.Id});
            });
        })
    };
    $scope.downloadDocument=function(doc){
        console.log(doc);
        window.location.href= "http://localhost:5656/download?storageToken=" + doc.StorageToken + "&fileName=" + doc.Name
    }
    var tokenHash = {};
    $scope.uploadFiles = function (evt) {
        var files = $.makeArray(evt.target.files);
        evt.target.value = null;
        var renderFiles = function (isAdd) {
            //console.log('uploaded ', isAdd);
        };

        var renderChunks = function (isAdd, isUpdate) {
            if(isUpdate) {
                //console.log('chunk item is ', isUpdate);
                if (!tokenHash['F' + isUpdate.fToken]) {
                    tokenHash['F' + isUpdate.fToken] = 0;
                }
                if(isUpdate.Status == 'DONE') {
                    tokenHash['F' + isUpdate.fToken] = parseInt(tokenHash['F' + isUpdate.fToken]) + isUpdate.ChunkSize;
                }
                //console.log('uploaded count is ', tokenHash['F' + isUpdate.fToken], isUpdate.FileSize, isUpdate.Status);
                if(parseInt(tokenHash['F' + isUpdate.fToken]) == isUpdate.FileSize){
                    console.log('file upload completed !!');
                    var newDocument = {};
                    newDocument.Name = isUpdate.fileName;
                    newDocument.StorageToken = isUpdate.fToken;
                    newDocument.Category = pageType;

                    api.addDocument(newDocument).then(function () {
                        loadDocuments();
                    })
                }
            }
        };

        fchnkUpload.upload(files, renderFiles, renderChunks);
    };

});