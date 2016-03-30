angular.module('siteApp').service('api', function ($rootScope) {
    this.Name = "Murali";

    var that = this;
    var makeRequest = function (url, method, content, options) {
        var lToken = getCookieVal("lToken");
        var queryParamString = '';
        if (lToken && lToken != 'TOKEN') {
            queryParamString = (url.indexOf('?') >= 0 ? '&' : '?') + "lToken=" + lToken;
        }

        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url + queryParamString,
                method: method,
                data: content,
                complete: function (aResponse) {
                    resolve(aResponse);
                }
            });
        });

    };

    this.get = function (url, content, options) {
        return makeRequest(url, "GET");
    };

    this.post = function (url, content) {
        return makeRequest(url, 'POST', content);
    };

    this.delete = function (url) {
        return makeRequest(url, 'DELETE');
    };

    this.login = function (userInfo) {
        var queryParamString = "";
        var postData = {};
        if (userInfo) {
            queryParamString = "?username=" + encodeURIComponent(userInfo.Username) + "&password=" + encodeURIComponent(userInfo.Password);
            postData.Username = userInfo.Username;
            postData.Password = userInfo.Password;
        }
        return that.post('http://localhost:5654/login', postData)
            .then(function (resp) {
                if (resp.Body.tokenObject) {
                    document.cookie = "lToken=" + resp.Body.tokenObject;
                    document.cookie = "uid=" + resp.Body.UserId;
                    document.cookie = "Username=" + resp.Body.Username;

                    //invoking listener event on rootScope named 'login-changed' with 'IsAuthentiated' as true
                    //As token is valid for logged in user.
                    $rootScope.$emit('login-changed', {IsAuthenticated: true});
                    $rootScope.Username = userInfo ? userInfo.Username : getCookieVal("Username") ? getCookieVal("Username") : "Guest";
                    return {"Status": true};
                } else {
                    $rootScope.$emit('login-changed', {IsAuthenticated: false});
                    $rootScope.Username = null;
                    return {"Status": false};
                }
            });
    };


    this.getProjects = function () {
        return that.get('http://localhost:5654/table/projects').then(function (resp) {
            if (resp.Body && resp.Body.list) {
                return resp.Body.list;
            } else {
                return [];
            }
        });
    };

    this.getPractise = function () {
        return that.get('http://localhost:5654/table/practise').then(function (resp) {
            if (resp.Body && resp.Body.list) {
                return resp.Body.list;
            } else {
                return [];
            }
        });
    };

    this.getDiscussion = function () {
        return that.get('http://localhost:5654/table/discussions').then(function (resp) {
            if (resp.Body && resp.Body.list) {
                return resp.Body.list;
            } else {
                return [];
            }
        });
    };

    this.getDocuments = function () {
        return that.get('http://localhost:5654/table/documents').then(function (resp) {
            if (resp.Body && resp.Body.list) {
                return resp.Body.list;
            } else {
                return [];
            }
        });
    };


    this.getEmployee = function (username, userId) {
        return that.get('http://localhost:5654/table/employee').then(function (resp) {
            if (resp.Body && resp.Body.list) {
                var usersList = resp.Body.list;
                if (username) {
                    usersList = resp.Body.list.filter(function (userItem) {
                        return userItem.Username == username;
                    });
                }
                if (userId) {
                    usersList = resp.Body.list.filter(function (userItem) {
                        return userItem.Id == userId;
                    });
                }
                return usersList;
            } else {
                return [];
            }
        });
    };




    this.addProject = function (itemToAdd) {
        return that.post('http://localhost:5654/table/projects', itemToAdd).then(function (resp) {
            return resp.Body;
        });
    };

    this.addEmployee = function (itemToAdd) {
        return that.post('http://localhost:5654/table/employee', itemToAdd).then(function (resp) {
            return resp.Body;
        });
    };

    this.addPractise = function (itemToAdd) {
        return that.post('http://localhost:5654/table/practise', itemToAdd).then(function (resp) {
            return resp.Body;
        });
    };

    this.addDiscussion = function (itemToAdd) {
        return that.post('http://localhost:5654/table/discussions', itemToAdd).then(function (resp) {
            return resp.Body;
        });
    };

    this.addDocument = function (itemToAdd) {
        return that.post('http://localhost:5654/table/documents', itemToAdd).then(function (resp) {
            return resp.Body;
        });
    };




    this.deleteEmployee = function (itemToDelete) {
        return that.delete('http://localhost:5654/table/employee?Id=' + itemToDelete.Id);
    };

    this.deleteProject = function (itemToDelete) {
        return that.delete('http://localhost:5654/table/projects?Id=' + itemToDelete.Id);
    };

    this.deletePractise = function (itemToDelete) {
        return that.delete('http://localhost:5654/table/practise?Id=' + itemToDelete.Id);
    };

    this.deleteDocument = function (itemToDelete) {
        return that.delete('http://localhost:5654/table/documents?Id=' + itemToDelete.Id);
    };

});