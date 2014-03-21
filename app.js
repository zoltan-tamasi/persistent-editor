var express = require('express');
var fileSystem = require('fs');
var path = require('path');

var filePath = path.join(__dirname, 'editor.js');
var app = express();
app.configure(function() {
    app.use(express.static('public'));
    app.use(express.bodyParser());
});

app.get('/retrieveData', function(req, res) {

    if (!fileSystem.existsSync(filePath)) {
        res.writeHead(200, {
            'Content-Type': 'application/text',
            'Content-Length': 0
        });
        res.end('');
        return;
    }

    var stat = fileSystem.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'application/text',
        'Content-Length': stat.size
    });

    fileSystem.createReadStream(filePath).pipe(res);
});

app.post('/sendData', function(req, res) {
    fileSystem.writeFile(filePath, req.body.text, function(err) {
        if (err) {
            console.log(err);
            res.statusCode = 500;
            res.end();
        } else {
            res.statusCode = 204;
            res.end();
        }
    });
});

app.listen(process.env.PORT || 3000);