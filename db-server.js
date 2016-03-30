var nbServer = require('nb-json-db');


nbServer.rootPath = __dirname;

nbServer.dBFolderName = "data";
nbServer.dBPort = 5654;

nbServer.ModelHash["projects"] = function (obj, isNew) {
    this.Id = obj["Id"] || nbServer.guid();
    this.Name = obj["Name"];

    if (isNew) {
        this.CreatedDate = new Date().getTime();
    } else {
        this.CreatedDate = obj["CreatedDate"];
    }
    this.CreatedBy = obj["CreatedBy"];
};

nbServer.ModelHash["practise"] = function (obj) {
    this.Id = obj["Id"] || nbServer.guid();
    this.PName = obj["PName"];

    this.Lead = obj["Lead"];
};
 
nbServer.ModelHash["discussions"] = function (obj) {
    this.Id = obj["Id"] || nbServer.guid();
    this.Text = obj["Text"];
    this.Rating = obj["Rating"];
    this.ParentId = obj["ParentId"];

    this.AddedBy = obj["AddedBy"];
};
 
nbServer.ModelHash["documents"] = function (obj, isNew) {
    this.Id = obj["Id"] || nbServer.guid();

    this.Name = obj["Name"];
    this.StorageToken = obj["StorageToken"];
    this.Category = obj["Category"]; // Projects, COE

    if (isNew) {
        this.UploadedDate = new Date().getTime();
    } else {
        this.UploadedDate = obj["UploadedDate"];
    }
};

nbServer.ModelHash["employee"] = function (obj, isNew) {
    this.Id = obj["Id"] || nbServer.guid();
    this.Username = obj["Username"];
    this.Password = obj["Password"];

    this.FName = obj["FName"];
    this.LName = obj["LName"];
    this.EmailId = obj["EmailId"];

    //must have this field in DB
    this.UserType = obj["UserType"]; //ADMIN, USER

    if(isNew){
        this.JoinedDate = new Date().getTime();
    }else{
        this.JoinedDate = obj["JoinedDate"];
    }
};


nbServer.ModelHash["employee"].EncryptedFields = ["Password"];

nbServer.LoginFields = {
    "TableName": "employee",
    "Fields": {
        "UserNameField": "Username",
        "PasswordField": "Password",
        "UserTypeField": "UserType"
    }
};

nbServer.IsDevelopment = true;

nbServer.RootUserName = "nipuna";
nbServer.RootPassword = "nipuna";


module.exports = {
    init: function (dbPort) {
        nbServer.dBPort = dbPort || 5654;
        nbServer.init();

        var fileServer = require('./file-upload-server.js');
        fileServer.init();
    }
};
