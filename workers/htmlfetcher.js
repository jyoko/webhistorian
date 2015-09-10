var request = require('request');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

archive.readListOfUrls(function(arrayOfSites){

  arrayOfSites.forEach(function(url) {
    if (url==='') return;

    request('http://'+url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        fs.open(__dirname+'/../archives/sites/'+url, "w", function(err, fd) {
          fs.write(fd, body);
        });
      } else {
        fs.open(__dirname+'/../archives/sites/'+url, "w", function(err, fd) {
          fs.write(fd, url +' was unavailable');
        });
      }
    });

  });

});
