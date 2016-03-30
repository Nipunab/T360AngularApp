var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

var $U = {};
$U.routings = [];
$U.fallBackRoute = function (req, res, headers) {
    res.writeHead(200, headers);
    var resObject = {};
    resObject.Status = "true";
    res.end(JSON.stringify(resObject));
};
$U.sendResObject = function (res, headers, resObject) {
    res.writeHead(200, headers);
    res.end(JSON.stringify(resObject));
};
$U.createServer = function () {
    return http.createServer(function(req, res) {
        var headers = {};

        headers['Access-Control-Allow-Origin'] = 'http://localhost:3434';
        headers['Access-Control-Allow-Credentials'] = true;
        headers['Access-Control-Allow-Headers'] = 'content-type';
        headers['Access-Control-Allow-Methods'] = 'DELETE,GET,POST';

        var isRouteFound = false, fnToCall = null;
        $U.routings.forEach(function (lItem) {
            var reqUrl = url.parse(req.url);
            if(lItem.Url === reqUrl.pathname){
                isRouteFound = true;
                fnToCall = lItem.Fn;
            }
        });

        if(isRouteFound && fnToCall){
            fnToCall.call(null, req, res, headers);
        }else {
            $U.fallBackRoute(req, res, headers);
        }
    });
};

$U.parseQueryParams = function (req) {
    var qParams = {};
    if(req.url.indexOf('?') >= 0){
        var qPart = req.url.split('?')[1];
        var qArray = qPart.split('&');
        qArray.forEach(function (lItem) {
            if(lItem.split('=')[1]) {
                qParams[lItem.split('=')[0]] = decodeURIComponent(lItem.split('=')[1]);
            }
        });
    }
    return qParams;
};
$U.RouteClass = function (u, f) {
    this.Url = u;
    this.Fn = f;
};

$U.addRoute = function (url, fn) {
    $U.routings.push(new $U.RouteClass(url, fn));
};

$U.isFileExists = function (filePath) {
    return new Promise(function (resolve, reject) {
        fs.exists(filePath, function (isExists) {
            resolve(isExists);
        });
    });
};

var $MK = {};

var bufferData = [];
var bufferChunkCount = 0;
var resumableHandler = function (req, res, headers) {

    //var resObject = { "Status": "Scucess"};
    //sendResObject(res, headers, resObject);
    req.setEncoding('binary'); // this

    var data = "";
    var qParams = $U.parseQueryParams(req);

    req.on('data', function(chunk) {
        return data += chunk;
    });


    req.on('end', function() {
        var resObject = {};
        resObject.Body = "Reading binary completed";
        var fName = qParams.fileName;
        if(qParams.chunkIndex){
            fName = fName.substr(0, fName.lastIndexOf('.')) + '-' + qParams.chunkIndex + fName.substr(fName.lastIndexOf('.'))
        }

        bufferData[parseInt(qParams.chunkIndex)] = data;

        console.log("Got the Chunk ", qParams.chunkIndex);

        bufferChunkCount = bufferChunkCount + 1;

        if(parseInt(qParams.chunkCount) == bufferChunkCount){
            
            bufferChunkCount = 0;
            var fallBackCount = 0;
            for(var i = 0; i < bufferData.length ; i++){
                fs.appendFile(__dirname + '/files/' + qParams.fileName, bufferData[i], 'binary', function (err) {
                    fallBackCount = fallBackCount + 1;
                    if(fallBackCount == bufferData.length){
                        $U.sendResObject(res, headers, resObject);
                    }
                });
            }
        }else{
            $U.sendResObject(res, headers, resObject);
        }


    });
    req.on('error', function(err) {
        console.log("Error during HTTP request");
        console.log(err.message);
    });

};


var downloadHandler = function (req, res, headers) {
    var qParams = $U.parseQueryParams(req);
    if(qParams.fileName && qParams.storageToken){
        var storageToken = qParams.storageToken;
        var fileName = qParams.fileName;
        var filePath = path.join(__dirname, 'files', storageToken);
        $U.isFileExists(filePath).then(function (isExists) {
            console.log('is file exists ', isExists);
            if(isExists){
                var stat = fs.statSync(filePath);
                res.writeHead(200, {
                    'Content-disposition': 'attachment; filename=' + fileName
                });

                var readStream = fs.createReadStream(filePath);
                readStream.pipe(res);
            }else{
                var resObject = {};
                resObject.Message = "file not found in server.";
                $U.sendResObject(res, headers, resObject);
            }
        });

    }else{
        var resObject = {};
        resObject.Message = "fileName not found in query string";
        $U.sendResObject(res, headers, resObject);
    }

};

$MK.init = function () {
    var server = $U.createServer();
    $U.addRoute('/upload/resumable', resumableHandler);
    $U.addRoute('/download', downloadHandler);
    server.listen('5656', function () {
        console.log('fileupload server started listening!!!!');
    });
};

module.exports = $MK;