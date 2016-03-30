angular.module('siteApp').controller('adminCntl', function ($scope, $rootScope, api) {
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


    $scope.IsProjectsLoading = true;
    $scope.Projects = [];
    api.getProjects().then(function (projects) {
        $scope.safeApply(function () {
            $scope.Projects = projects;
            $scope.IsProjectsLoading = false;
        });
    });

    $scope.IsPractiseLoading = true;
    $scope.Practises = [];
    api.getPractise().then(function (practises) {
        $scope.safeApply(function () {
            $scope.Practises = practises;
            $scope.IsPractiseLoading = false;
        });
    });


    $scope.IsEmployeeLoading = true;
    $scope.Employees = [];

    $scope.NewEmployee = {};
    $scope.NewEmployee.UserType = "USER";
    api.getEmployee().then(function (Employees) {
        $scope.safeApply(function () {
            $scope.Employees = Employees;
            $scope.IsEmployeeLoading = false;
        });
    });

    $scope.addItem = function (typ, itemToAdd) {
        var addPromise = null;
        var uid = getCookieVal('uid');
        if(uid){
            itemToAdd.CreatedBy = uid;
        }
        switch (typ) {
            case 'PROJECT':
                addPromise = api.addProject(itemToAdd);
                break;
            case 'PRACTISE':
                addPromise = api.addPractise(itemToAdd);
                break;
            case 'EMPLOYEE':
                addPromise = api.addEmployee(itemToAdd);
                break;
        }

        if(addPromise){
            addPromise.then(function (addedItem) {
                if(addedItem ) {
                    $scope.safeApply(function () {
                        switch (typ) {
                            case 'PROJECT':
                                $scope.Projects.push(addedItem);
                                itemToAdd.Name = '';
                                break;
                            case 'PRACTISE':
                                if(addedItem.Id) {
                                    $scope.Practises.push(addedItem);
                                    itemToAdd.PName='';
                                }
                                break;
                            case 'EMPLOYEE':
                                if(addedItem.Id) {
                                    $scope.Employees.push(addedItem);
                                     itemToAdd.FName='';
                                      itemToAdd.LName='';
                                       itemToAdd.Username='';
                                        itemToAdd.Password='';
                                         itemToAdd.EmailId='';
                                         itemToAdd.ConfirmPassword='';
                                         itemToAdd.UserType='USER';
                                }else{
                                    //empoyee not added, either service down or permission denied
                                    console.log("you can't add employee ", addedItem.Msg);
                                }
                                break;
                        }
                    });

                }
            });
        }
    };

    $scope.deleteItem = function (typ, item) {
        var deletePromise = null;
        if(item.Id) {
            switch (typ) {
                case 'PROJECT':
                    deletePromise = api.deleteProject(item);
                    break;
                case 'PRACTISE':
                    deletePromise = api.deletePractise(item);
                    break;
                case 'EMPLOYEE':
                    deletePromise = api.deleteEmployee(item);
                    break;
            }
        }

        if(deletePromise){
            deletePromise.then(function () {
                switch (typ) {
                    case 'PROJECT':
                        $scope.safeApply(function () {
                            _.remove($scope.Projects, {Id: item.Id});
                        });
                        break;
                    case 'PRACTISE':
                        $scope.safeApply(function () {
                            _.remove($scope.Practises, {Id: item.Id});
                        });
                        break;
                    case 'EMPLOYEE':
                        $scope.safeApply(function () {
                            _.remove($scope.Employees, {Id: item.Id});
                        });
                        break;
                }
            });
        }
    };


});