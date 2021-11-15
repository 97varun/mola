const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();
const port = 5000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}

function getData(options, callback) {
  https.get(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      callback(data);
    });
  });
}

function readTokenFromFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

const token = readTokenFromFile('./token.txt');

function checkUserExists(username, callback) {
  const options = {
    hostname: 'api.twitter.com',
    path: `/2/users/by/username/${username}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  getData(options, (data) => {
    callback(!data.includes('Not Found Error'));
  });
}

function getRecentTweets(username, callback) {
  const options = {
    hostname: 'api.twitter.com',
    path: `/2/tweets/search/recent?query=from:${username}&max_results=10`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  
  getData(options, (data) => {
    callback(data);
  });
}

app.get('/api/recenttweets/:username', (req, res) => {
  checkUserExists(req.params.username, (exists) => {
    if (exists) {
      getRecentTweets(req.params.username, (data) => {
        res.set(corsHeaders).send(data);
      });
    } else {
      res.set(corsHeaders).status(404).send('{"error": "User not found"}');
    }
  });
});

app.options('*', (req, res) => {
  res.set(corsHeaders).send();
});

app.all('*', (req, res) => {
  res.set(corsHeaders).status(404).send('{"error": "Not found"}');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})