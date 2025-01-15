angular.module('recipeApp', ['ngRoute' , 'ngSanitize']) 
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/home.html', 
                controller: 'RecipeController'
            })
            .when('/about', {
                templateUrl: 'app/views/about.html', 
                controller: 'AboutController'
            })
            .when('/recipe/:id', {
                templateUrl: 'app/views/recipe-detail.html',
                controller: 'RecipeDetailController'
            })
            .otherwise({
                redirectTo: '/' 
            });
    })
    .run(function ($rootScope) {
        $rootScope.appName = 'Recipe Finder'; 

        localStorage.clear();
        console.log('Cache cleared on app start');
    });


angular.module('recipeApp')
    .controller('RecipeController', function ($scope, RecipeService) {
        $scope.query = ''; 
        $scope.recipes = []; 
        $scope.errorMessage = ''; 
        $scope.loading = false; 

        $scope.searchRecipes = function () {
            if (!$scope.query.trim()) {
                $scope.errorMessage = 'Please enter a valid search query.';
                return;
            }

            $scope.loading = true; 
            $scope.errorMessage = ''; 

            RecipeService.getRecipes($scope.query)
                .then(function (recipes) {
                    $scope.recipes = recipes; 
                    $scope.loading = false; 
                })
                .catch(function (error) {
                    $scope.errorMessage = error; 
                    $scope.loading = false; 
                });
        };

        $scope.clearSearch = function () {
            $scope.query = '';
            $scope.recipes = [];
            $scope.errorMessage = '';
        };
    });

angular.module('recipeApp')
    .controller('AboutController', function ($scope) {
        $scope.aboutMessage = 'Welcome to Recipe Finder. Find the best recipes based on your search criteria!';
    });

    angular.module('recipeApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/views/home.html',
                controller: 'RecipeController'
            })
            .when('/about', {
                templateUrl: 'app/views/about.html',
                controller: 'AboutController'
            })
            .when('/recipe/:id', { 
                templateUrl: 'app/views/recipe-detail.html',
                controller: 'RecipeDetailController'
            })
            .otherwise({
                redirectTo: '/'
            });
    });


