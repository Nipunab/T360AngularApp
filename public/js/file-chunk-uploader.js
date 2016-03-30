angular.module('ng-chunk-upload', []).service('fchnkUpload', function ($http) {

    var FileList = [];
    var ChunkList = [];
    var progressRequestCount = 0;
    var maxRequestCount = 6;

    this.ChunkSize = 300;

    var IsProgress = false;

    var STATUS_CODES = { "READY": "READY", "UPLOADING": "UPLOADING", "DONE": "DONE" , "FAILED": "FAILED"};
    var FileSizes = {"MB1": 1048576, "MB5": 5242880, "MB10": 10485760, "MB20": 20971520, "MB25": 26214400};

    var guid = function(len) {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        if(len == 8){
            return s4() + s4();
        }
        return s4() + s4() + s4() + s4() + s4() + s4() + (new Date).getTime().toString(16);
    };

    var makeRequest = function (fileContent, fileName, chunkIndex, chunkCount) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:5656/upload/resumable?fileName=" + fileName + '&chunkIndex=' + chunkIndex + '&chunkCount=' + chunkCount, true);
            xhr.onload = function () {
                resolve(null);
            };

            xhr.onerror = function (t) {
                resolve(t);
            };

            xhr.headers = {};
            xhr.send(fileContent);
        });

    };

    var decideChunkSize = function (fileSize) {

        if(fileSize >= (FileSizes.MB1 * 100)){
            return FileSizes.MB25;
        }

        if(fileSize >= (FileSizes.MB1 * 50) && fileSize < (FileSizes.MB1 * 100)){
            return FileSizes.MB20;
        }

        if(fileSize >= (FileSizes.MB1 * 10) && fileSize < (FileSizes.MB1 * 50)){
            return FileSizes.MB10;
        }

        if(fileSize >= (FileSizes.MB1) && fileSize < (FileSizes.MB1 * 10)){
            return FileSizes.MB1;
        }

        return FileSizes.MB25;
    };

    var UploadFile = function (file) {
        this._file = file;
        this.Size = file.size;
        this.Name = file.name;

        this.Status = STATUS_CODES.READY;
        this.UploadedBytes = 0;

        this.fToken = file.fToken;
    };

    var ChunkClass = function (s, cs, cd, fn, ci, ft, cb, tcc, fs) {
        this.StartPosition = s;
        this.ChunkSize = cs;

        this.ChunkData = cd;
        this.fileName = fn;
        this.ChunkIndex = ci;

        this.fToken = ft;

        this.Status = STATUS_CODES.READY;

        this.chunkCallback = cb;
        this.chunkCount = tcc;

        this.FileSize = fs;

    };

    var processNextChunk = function () {
        var nextChunkToProcess = _.filter(ChunkList, function (g) {
            return g.Status == STATUS_CODES.READY;
        });
        if(nextChunkToProcess.length > 0){
            //console.log("Progressing upload chunks ", progressRequestCount);
            if(progressRequestCount < maxRequestCount) {
                progressRequestCount += 1;
                nextChunkToProcess = nextChunkToProcess[0];
                nextChunkToProcess.Status = STATUS_CODES.UPLOADING;
                nextChunkToProcess.chunkCallback(null, nextChunkToProcess);
                makeRequest(nextChunkToProcess.ChunkData, nextChunkToProcess.fToken, nextChunkToProcess.ChunkIndex, nextChunkToProcess.chunkCount).then(function (err, resp) {
                    if (err) {
                        nextChunkToProcess.Status = STATUS_CODES.FAILED;
                    } else {
                        nextChunkToProcess.Status = STATUS_CODES.DONE;
                    }
                    nextChunkToProcess.chunkCallback(null, nextChunkToProcess);
                    progressRequestCount -= 1;
                    processNextChunk();
                });
            }else{
                //console.log("Waiting for to upload que ");
            }

        }else{
            IsProgress = false;
        }
    };

    var addChunk = function (e) {
        var contents = e.target.result;
        if (e.target.readyState == FileReader.DONE) {
            var chunkItem = new ChunkClass(this.startPosition, this.bytesToRead, contents, this.fileName, this.index, this.fToken);
            chunkItem.chunkCallback = this.chunkCallback;
            chunkItem.chunkCount = this.chunkCount;
            chunkItem.FileSize = this.totalSize;
            ChunkList.push(chunkItem);
            var sumBy = 0;
            _.filter(ChunkList, { "fToken": this.fToken}).forEach(function(g){ sumBy += g.ChunkSize;  });
            if(this.chunkCallback){
                this.chunkCallback(chunkItem);
            }

            processNextChunk();
        }
    };

    var prepareChunks = function (fileToBeChunked, chunkCallback) {
        var fileSize = fileToBeChunked.size;
        var chunkSize = decideChunkSize(fileSize);
        var chunkCount = Math.ceil(fileSize / chunkSize);
        var startPosition = 0, endPosition = 0;
        for (var i = 0; i < chunkCount; i++) {
            startPosition = (i * chunkSize);
            endPosition = startPosition + chunkSize;
            if (endPosition > fileSize) {
                endPosition = fileSize;
            }

            var r = new FileReader();

            var blob = fileToBeChunked.slice(startPosition, endPosition);
            r.onload = addChunk.bind({
                index: i,
                startPosition: startPosition,
                fileName: fileToBeChunked.name,
                chunksCount: chunkCount,
                bytesToRead: (endPosition - startPosition),
                fToken: fileToBeChunked.fToken,
                chunkCallback: chunkCallback,
                totalSize : fileSize,
                chunkCount: chunkCount
            });
            r.readAsArrayBuffer(blob);
        }
    };

    this.upload = function (files, fileCallback, chunkCallback) {
        files.forEach(function (fileItem) {
            fileItem.fToken = guid();
            var uploadItem = new UploadFile(fileItem);

            FileList.push(uploadItem);

            if(fileCallback && fileCallback instanceof Function){
                fileCallback(uploadItem);
            }
        });

        files.forEach(function (fileItem) {
            prepareChunks(fileItem, chunkCallback);
        });
    };

});