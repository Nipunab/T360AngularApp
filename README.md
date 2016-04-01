# AngularSite

### Introduction
Application for basic management employeee and projects and practises.



### Setup

Get the Git code into  local using following git command in command prompt/terminal.

```
git clone https://github.com/Nipunab/T360AngularApp.git
```

After getting git copy into local have to install npm depedencies of application which are mentioned under package.json file. Hit following command to install npm dependencies in command prompt/terminal under application folder

```
npm install
```

### Start Server

After installing npm dependencies have to start node server by using following command, As we are not using any other db apps like (mongodb, ms sql...etc.,)...we are using our own npm module to save data in JSON formats.

```
node server
```

above command will start server on 3434 and 5654 ports , 3434 for serving html,css and js files to browsers , 5654 is meant for serving REST API.


### ENV
Application develped  using AngularJS, NodeJS and few npm modules. For DB purpose using [nb-json-db](https://www.npmjs.com/package/nb-json-db) npm module.

##### more about DB
In this application we used nb-json-db npm module for saving data in JSON format , which is very easy and simple format to save data and export into any of the major DBs in the market using well know db converters (like... sqlizer.io ...etc.,).

And JSON format is now leading format for sharing data between servers and browsers, one of the best reason to go for JSON is parsing data is more efficeint than traditional sql data As we know now a days browsers are very  high capable of doing large operations on JSON so we took advantage of this and send data to browser to leave it to browser to do filtering and parsing instead of doing in server side. it saves lot of server's CPU.

coming to security concerns, We are using hybrid security for authentication we encrypt the password fields and store in JSON and will not be serving to browser with security/password fields.As we implement this application as Internal purpose security is least parameter.

the only concern is speed.(intentionally avoid all the layers of security to bring up maximum speed to load JSON data.)

CSS framework: http://purecss.io
Pure was crafted with the goal that it can be used in every web project.These layouts are responsive and don't require JavaScript (except for certain menu interactions).