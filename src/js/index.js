import Search from './modules/Search'
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import Recipe from './modules/Recipe'
import {elements, renderLoader,clearLoader} from './views/base'
const state = {};

// SEARCH CONTROLLER //
const controlSearch = async () =>{
    const query = searchView.getInput()
    console.log(query)
    if (query){
        state.search = new Search(query);

        renderLoader(elements.searchRes)

        await state.search.getResults();

        searchView.clearResults();

        searchView.clearField();
        clearLoader()
        searchView.renderResults(state.search.result)
    }

} 


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch()
})

let search = new Search('popcorn')
elements.searchResPages.addEventListener('click' ,e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults()
        searchView.renderResults(state.search.result,goToPage)
    }
})

// RECIPE CONTROLLER //
const controlRecipe = async () => {

    // Get ID From URL
    let id = window.location.hash.replace('#', '');
    if (id){
        //Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // Сreate new Recipe OBJ
        state.recipe = new Recipe(id)
       
        // Get Recipe Data
        try{
            await state.recipe.getRecipe();

            state.recipe.parseIngredients()

            // Calculate servings and time
            state.recipe.calcServings();
    
            state.recipe.calcTime();

            clearLoader();
            recipeView.renderRecipe(state.recipe)
        } catch(error){
            console.log(error)
            alert('Smth went wrong')
        }

    }
    console.log(id)
}
// window.addEventListener('hashchange' , controlRecipe)
// window.addEventListener('load', controlRecipe)
['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));
