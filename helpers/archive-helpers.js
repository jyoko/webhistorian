var fs = require('fs');
var path = require('path');
var _ = require('underscore');

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.readListOfUrls = function(cb){

  fs.readFile(this.paths.list, 'utf8', function(err,data) {
    var arrayOfSites = (data === '') ? [] : data.split("\n");
    cb(arrayOfSites);
  });

};

exports.isUrlInList = function(url,cb){

  this.readListOfUrls(function(arrayOfSites) {
    var isInList = false;
    if (arrayOfSites.indexOf(url) > -1) {
      isInList = true;
    }
    cb(isInList);
  });
};

