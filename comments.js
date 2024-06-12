// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const commentsPath = path.join(__dirname, 'comments.json');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/comments') {
    fs.readFile(commentsPath, 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/comments') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf8'));
      const newComment = JSON.parse(body);
      comments.push(newComment);
      fs.writeFile(commentsPath, JSON.stringify(comments), err => {
        if (err) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        } else {
          res.statusCode = 201;
          res.end('Created');
        }
      });
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(3000);