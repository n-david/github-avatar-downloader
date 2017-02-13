var request = require('request');

console.log('Welcome to the GitHub Avatar Downloader!');

var GITHUB_USER = 'n-david';
var GITHUB_TOKEN = 'd26c217e18600e157b3df53b93e823177d6aff4d';

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  console.log(requestURL);
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});