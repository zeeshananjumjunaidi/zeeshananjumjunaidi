
// jQuery.githubUser = function(username, callback) {
//     jQuery.getJSON("http://github.com/api/v1/json/" + username + "?callback=?", callback);
//   }

//   jQuery.fn.loadRepositories = function(username) {
//     this.html("<span>Querying GitHub for " + username +"'s repositories...</span>");

//     var target = this;
//     $.githubUser(username, function(data) {
//       var repos = data.user.repositories;
//       sortByNumberOfWatchers(repos);

//       var list = $('<dl/>');
//       target.empty().append(list);
//       $(repos).each(function() {
//         list.append('<dt><a href="'+ this.url +'">' + this.name + '</a></dt>');
//         list.append('<dd>' + this.description + '</dd>');
//       });
//     });

//     function sortByNumberOfWatchers(repos) {
//       repos.sort(function(a,b) {
//         return b.watchers - a.watchers;
//       });
//     }
//   };
//   $(document).ready(()=>{
//     const searchQueryURL = 'https://api.github.com/users/zeeshananjumjunaidi';

//        fetch(searchQueryURL)
//       .then(result => result.json())
//       .then(response => console.log(response))
//       .catch(err => console.log(err))


//   });
function toggleInteraction() {
  $('#header').toggle();
  $('#footer').toggle();
}
function showAboutMe() {
  $('#aboutMe').load('about.html');
}
function showPortfolio() {
  $('#portfolio').load('portfolio.html');
}
function showExperimentalView(){
  $('#experiment').load('experiment.html');
}
function shhowProjects() {
  $('#projects').load('projects.html');
}
$(document).ready(()=>{
  showAboutMe();
  showPortfolio();
  showExperimentalView();
  // shhowProjects();
});
function openProjectsPage(){
  window.location.href = "/projects.html";
}