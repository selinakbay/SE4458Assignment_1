angular.module('recipeApp').controller('RecipeDetailController', function ($scope, $routeParams, RecipeService) {
    $scope.recipe = null;
    $scope.errorMessage = '';

    const recipeId = $routeParams.id;
    
    RecipeService.getRecipeById($routeParams.id)
        .then(function (response) {
            $scope.recipe = response;
        })
        .catch(function (error) {
            $scope.errorMessage = 'Failed to load recipe details.';
            console.error(error);
        });
});
