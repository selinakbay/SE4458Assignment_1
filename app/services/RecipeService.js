angular.module('recipeApp').service('RecipeService', function ($http, $q) {
    const API_KEY = '771b882578cf4ba8a6812c1d9d09d3d8'; 
    const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';
    const RECIPE_DETAILS_URL = 'https://api.spoonacular.com/recipes';
    const CACHE_EXPIRY = 3600000; 
   
    this.getRecipes = function (query) {
        if (!query || !query.trim()) {
            return $q.reject('Query is empty or invalid.');
        }

        const trimmedQuery = query.trim().toLowerCase(); 
        const cachedData = getCachedData(trimmedQuery);

        if (cachedData) {
            return $q.resolve(cachedData);
        }

        return fetchRecipesFromApi(trimmedQuery);
    };

    this.getRecipeById = function (id) {
        const url = `${RECIPE_DETAILS_URL}/${id}/information?apiKey=${API_KEY}`;
        return $http.get(url)
            .then(function (response) {
                return response.data; 
            })
            .catch(function (error) {
                console.error('Error fetching recipe details:', error);
                return $q.reject('Failed to fetch recipe details.');
            });
    };

    this.clearCache = function () {
        localStorage.clear();
        console.log('Cache cleared successfully.');
    };
   
    function getCachedData(query) {
        const cachedItem = JSON.parse(localStorage.getItem(query));
        if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRY) {
            return cachedItem.data;
        }
        return null;
    }

    function fetchRecipesFromApi(query) {
        const url = `${BASE_URL}?query=${encodeURIComponent(query)}&number=10&apiKey=${API_KEY}`;

        return $http.get(url)
            .then(response => {
                if (response.data && Array.isArray(response.data.results)) {
                    const recipes = response.data.results;
                    cacheData(query, recipes); 
                    return recipes;
                }
                return $q.reject('Invalid API response format.');
            })
            .catch(error => {
                console.error('Error fetching recipes:', error);
                return $q.reject(handleApiError(error));
            });
    }

    function cacheData(query, data) {
        localStorage.setItem(query, JSON.stringify({
            data: data,
            timestamp: Date.now()
        }));
    }

    function handleApiError(error) {
        if (error.status === 401) {
            return 'Invalid API key. Please check your API key.';
        } else if (error.status === 429) {
            return 'Rate limit exceeded. Try again later.';
        } else if (error.status === 404) {
            return 'No recipes found for the given query.';
        } else {
            return 'An error occurred. Please try again later.';
        }
    }

    this.getRecipeDetails = function (id) {
        const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
        return $http.get(url)
            .then(function (response) {
                let details = response.data;
                if (details.instructions) {
                    details.instructions = details.instructions
                    .replace(/<\/?ol>/g, '') 
                    .replace(/<\/?li>/g, ''); 
                }
                return details; 
            })
            .catch(function (error) {
                console.error('Error fetching recipe details:', error);
                return $q.reject('Failed to fetch recipe details.');
            });
    };
    

    this.getBulkRecipeDetails = function (recipeIds) {
        if (!recipeIds || recipeIds.length === 0) {
            return $q.reject('No recipe IDs provided.');
        }
    
        const url = `https://api.spoonacular.com/recipes/informationBulk?ids=${recipeIds.join(',')}&apiKey=${API_KEY}`;
        return $http.get(url)
            .then(function (response) {
                if (response.data && Array.isArray(response.data)) {
                    return response.data; 
                } else {
                    return $q.reject('Invalid response format from bulk API.');
                }
            })
            .catch(function (error) {
                console.error('Error fetching bulk recipe details:', error);
                return $q.reject('Failed to fetch recipe details.');
            });
    };
    
    
});

