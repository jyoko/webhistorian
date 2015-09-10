// REMINDER: Run node from root dir for shit to work (ugh)

var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.handleRequest = function (req, res) {

console.log('Received request for '+req.url+' via '+req.method);

  if (req.method === "GET") {
    var fileName;
    headers['Content-Type'] = 'text/html';

    if (req.url === "/" ) {
      fileName = __dirname+'/public/index.html';
    }
    else if (req.url === '/styles.css') {
      headers['Content-Type'] = 'text/css';
      fileName = __dirname+'/public/styles.css';
    }
    else {
      fileName = __dirname+'/../archives/sites'+req.url;
    }

    fs.readFile(fileName, function(err, data){
        if (!err) {
          res.writeHead(200,headers);
          res.end(data);
        } else {
          // ENOENT means file doesn't exist
          if (err.code === 'ENOENT') {
            archive.isUrlInList(req.url.substr(1), function(exists) {
              if (exists) {
                fs.readFile(__dirname+'/public/loading.html', function(err,data) {
                  res.writeHead(200);
                  res.end(data);
                });
              } else {
                res.writeHead(404);
                res.end('File not found');
              }
            });

          } else {
            res.writeHead(500);
            res.end('Error loading file');
          }
        }
      });
  }
  else if (req.method === "POST") {
    var str = "";
    // read post data
    req.on('data', function(chunk) {
      str += chunk;
    });

    req.on('end', function() {
      // if data doesn't exist in our archive
      var newUrl = str.split("=")[1];
      if (newUrl.length>20) newUrl = newUrl.substr(0,20);
      fs.readFile(__dirname+'/../archives/sites.txt', 'utf8', function(err,data) {
        var arrayOfSites = (data === '') ? [] : data.split("\n");
        if (arrayOfSites.indexOf(newUrl)===-1) {
          fs.appendFile(__dirname+'/../archives/sites.txt', newUrl.toString()+"\n", function(err) {
            if (err) console.log('Problem writing: '+err);
            headers['Location'] = 'http://127.0.0.1:8080/'+newUrl;
            res.writeHead(302, headers);
            res.end('');
          });
        } else {   
          // send to archive
          headers['Location'] = 'http://127.0.0.1:8080/'+newUrl;
          res.writeHead(302, headers);
          res.end('');
        }

      });
    });
  }
  else {
    // return some sort of error
    req.writeHead(204);
    res.end('');
  }

};
