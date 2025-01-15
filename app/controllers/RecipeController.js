angular.module('recipeApp').controller('RecipeController', function ($scope, RecipeService) {
    
    $scope.searchQuery = '';
    $scope.recipes = [];
    $scope.errorMessage = '';
    $scope.isLoading = false;

    $scope.fetchRecipes = function () {
        if (!$scope.searchQuery.trim()) {
            $scope.errorMessage = 'Please enter a valid search term!';
            $scope.recipes = [];
            return;
        }

        $scope.errorMessage = '';
        $scope.isLoading = true;

        RecipeService.getRecipes($scope.searchQuery)
            .then(function (recipes) {
                $scope.recipes = recipes;

                if ($scope.recipes.length === 0) {
                    $scope.errorMessage = 'No recipes found for your search query.';
                } else {
                    const recipeIds = $scope.recipes.map(recipe => recipe.id);
                    console.log('Recipe IDs:', recipeIds);

                    RecipeService.getBulkRecipeDetails(recipeIds)
                        .then(function (details) {
                            $scope.recipes = $scope.recipes.map(recipe => {
                                const detail = details.find(d => d.id === recipe.id);
                                return {
                                    ...recipe,
                                    instructions: detail ? detail.instructions : 'No instructions available'
                                };
                            });
                        })
                        .catch(function (error) {
                            console.error('Error fetching bulk recipe details:', error);
                            $scope.errorMessage = 'Failed to fetch detailed instructions. Some instructions may be missing.';
                        });
                }

                $scope.isLoading = false;
            })
            .catch(function (error) {
                console.error('Error fetching recipes:', error);
                $scope.errorMessage = error || 'An error occurred while fetching recipes.';
                $scope.recipes = [];
                $scope.isLoading = false;
            });
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = '';
        $scope.recipes = [];
        $scope.errorMessage = '';
    };
});
