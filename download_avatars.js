require('dotenv').config();
require('./.env');
var request = require('request');
var fs = require('fs');
var owner = process.argv[2];
var repo = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function getRepoContributors(repoOwner, repoName, cb) {
  if (!repoOwner || !repoName) {
    console.log('Usage: download_avatars.js <owner> <repo>');
    return;
  }
  var options = {
    url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      cb(error, data);
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      throw err;
    })
    .on('response', (response) => {
      console.log(response.statusCode, response.statusMessage, response.headers['content-type']);
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(owner, repo, function(err, result) {
  for (user of result) {
    downloadImageByURL(user.avatar_url, 'avatars/' + user.login + '.jpg');
  }
});
