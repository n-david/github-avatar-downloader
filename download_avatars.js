require('dotenv').config();
try {
  require('./.env');
}
catch(err) {
  console.log('\nERROR: .env file missing\n');
  throw err;
}
var request = require('request');
var fs = require('fs');
var owner = process.argv[2];
var repo = process.argv[3];
var args = process.argv.slice(2);

console.log('\nWelcome to the GitHub Avatar Downloader!');

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_USER || !GITHUB_TOKEN) {
  console.log('\nERROR: .env file is missing information\n');
  return;
};

function getRepoContributors(repoOwner, repoName, cb) {
  if (args.length !== 2) {
    console.log('\nPlease provide exactly two arguments: <owner> <repo>\n');
    return;
  }
  var options = {
    url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(options, (error, response, body) => {
    if (response.statusCode === 404) {
      console.log('\nERROR: Provided owner/repo does not exist\n');
      return;
    } else if (response.statusCode === 401) {
      console.log('\nERROR: .env file contains incorrect credentials\n');
      return;
    }
    var data = JSON.parse(body);
    cb(error, data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      throw err;
    })
    .on('end', () => {
      console.log('Image Download Complete.');
    })
    .pipe(fs.createWriteStream(filePath))
    .on('error', (err) => {
      console.log('\nERROR: File path "' + filePath + '" not found\n');
      throw err;
    });
}

getRepoContributors(owner, repo, function(err, result) {
  if (err) {
    throw err;
  }
  for (user of result) {
    downloadImageByURL(user.avatar_url, 'avatars/' + user.login + '.jpg');
  }
});
