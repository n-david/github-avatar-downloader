var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = 'n-david';
var GITHUB_TOKEN = 'd26c217e18600e157b3df53b93e823177d6aff4d';

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'GitHub Avatar Downloader - Student Project'
    }
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
    }
    cb(error, data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', (err) => {
      throw err;
    })
    .on('response', (response) => {
     console.log('Downloading image...');
     console.log('Response Status Code: ', response.statusCode, 'Response Message: ', response.statusMessage, 'Content type: ', response.headers['content-type']);
    })
    .on('end', () => {
     console.log('Download complete.');
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors("jquery", "jquery", function(err, result) {
  for (user of result) {
    console.log(user.avatar_url);
  }
});
