"use strict";

var app = angular.module("app", ["ngRoute"]);

app.config(["$routeProvider",
  function($routeProvider) {
    $routeProvider.
      when("/", {
        templateUrl: "/static/partials/index.html",
        controller: "indexController"
        /*templateUrl: "/static/partials/compose.html",
        controller: "composeController"*/
      }).
      when("/compose", {
        templateUrl: "/static/partials/compose.html",
        controller: "composeController"
      }).
      when("/decompose", {
        templateUrl: "/static/partials/decompose.html",
        controller: "decomposeController"
      }).
      when("/about", {
        templateUrl: "/static/partials/about.html",
        controller: "aboutController"
      }).
      otherwise({
        redirectTo: "/"
      });
  }]);

app.controller("indexController", function($scope) {

});
app.controller("composeController", function($scope, $http) {    
  // constants 
  $scope.titles = [
      "Graphical primitive. Non-composition", 
      "Horizontal composition ", 
      "Vertical composition", 
      "Inclusion of one character inside another", 
      "Vertical composition. Top part is a repetition", 
      "Horizontal composition of three. First and third are the same", 
      "Repetition of three", 
      "Repetition of four", 
      "Vertical composition, separated by '冖'", 
      "Graphical superposition or addition", 
      "Deformed version of another character"
  ];
  $scope.max_table_characters = 50;
  $scope.table_rows = 5;
  $scope.table_cols = 10;

  // current state of the table
  $scope.characters_start = 0;
  $scope.characters_end = 50;

  // input
  $scope.kind = 1;
  $scope.part1 = "";
  $scope.part2 = "";

  // output
  $scope.characters = [];
  $scope.table = [];
  for (var i = 0; i < $scope.table_rows; i++) {
      $scope.table.push(new Array(10).fill(""));
  }
  
  // functions
  $scope.clearTable = function() {
    /* $scope.table = []; */
    for (var i = 0; i < $scope.table_rows; i++) {
      for (var j = 0; j < $scope.table_cols; j++) {
        $scope.table[i][j] = "";
      }
    }
  }

  $scope.loadTable = function() {
    $scope.clearTable();
    for (var i = 0; i < $scope.table_rows; i++) {
      for (var j = 0; j < $scope.table_cols; j++) {
        var current = i * $scope.table_cols + j;

        // If you don't have enough characters, break early
        if (current >= $scope.characters.length) {
          console.log(current);
          console.log($scope.characters.length);
          return;
        }
        else {
          /*if ($scope.table.length == i) {
              $scope.table.push(new Array(10).fill(""));
          }*/
          // $scope.table[i].push($scope.characters[current]);
          $scope.table[i][j] = $scope.characters[current];
        }
      }
    }
  };

  $scope.composeCharacters = function(start) {
    // default argument
    if (typeof(start) == "undefined") {
        start = 0;
    }

    var url = "/api/chars/?";
    if ($scope.kind !== 0) {
        url += "kind=" + $scope.kind.toString() + "&";
    }
    if ($scope.part1 !== "") {
        url += "part1=" + $scope.part1.charCodeAt(0).toString() + "&";
    }
    if ($scope.part2 !== "") {
        url += "part2=" + $scope.part2.charCodeAt(0).toString() + "&";
    }
    url += "start=" + start;
    

    $http.get(url)
    .then(function (response) { 
      $scope.characters = response.data.characters;
      $scope.characters_start = start + 1;
      $scope.characters_end = $scope.characters.length;
      $scope.loadTable();
    });
  };

  // call method once initially
  $scope.composeCharacters();
});

app.controller("decomposeController", function($scope, $http) {
  // input
  $scope.character = "";

  // output
  $scope.kind = 0;
  $scope.part1 = "";
  $scope.part2 = "";

  $scope.decomposeCharacter = function() {
    var cp = $scope.character.charCodeAt(0);
    $http.get("/api/char/" + cp.toString())
    .then(function (response) { 
      $scope.kind = response.data.kind;
      $scope.part1 = response.data.part1;
      $scope.part2 = response.data.part2;
    });
  };
});
