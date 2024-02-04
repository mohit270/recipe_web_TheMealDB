const search_button = document.querySelector('.search-button');
const search_box = document.querySelector('.search-box');
const recipe_container = document.querySelector('.recipe-container');
const recipe_details_content = document.querySelector('.recipe-details-content');
const close_btn = document.querySelector('.recipe-close-btn');
const header_text = document.querySelector('.header-text');
const sub_header_text = document.querySelector('.sub-header-text');


document.addEventListener('DOMContentLoaded', function () {
    const defaultSearchQuery = '';
    search_box.value = defaultSearchQuery;
    fetchRecipe(defaultSearchQuery);
});

const fetchRecipe = async (query)=> {

    try{
        if(query != ''){
            search_box.value = '';
            header_text.style.display = 'none';
            sub_header_text.style.display = 'none';
            recipe_container.innerHTML = ` <h3 class="dialer">Searching Your Recipes....</h3>`;
        }
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
            if(query != '')recipe_container.innerHTML = ``;
            const response = await data.json();
            response.meals.forEach(meal => {
                const div_meal = document.createElement('div');
                div_meal.classList.add('recipe');
                div_meal.innerHTML = `<img src="${meal.strMealThumb}">
                                            <h3>${meal.strMeal}</h3>
                                            <p><span>${meal.strArea}</span> Dish</p>
                                            <p>Belong to <span>${meal.strCategory}</span> Category</p>
                                        </div> `;
                const button  = document.createElement('button');
                button.textContent = 'View Recipe';
                div_meal.appendChild(button);

                // adding EventListener to button
                button.addEventListener('click',()=>{
                    openRecipePopup(meal);
                });

                recipe_container.appendChild(div_meal);
            });
        }catch(e){
            recipe_container.innerHTML = ` <h3 class="dialer">Error in Searching Your Recipes....</h3>`;
        }
    }

//function to fetch ingredients and measurment
const fetch_ingredients = (meal)=>{
    let ingredientsList = "";
    console.log(meal);
    for(let i =1;i<=20;i++){
        const ingredient = meal[`strIngredient${i}`];
        if(ingredient){
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        }else {
            break;
        }
    }return ingredientsList;
}

const meal_url = (url)=>{
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

    // Match the regex against the URL
    const match = url.match(regex);

    // If a match is found, return the video ID, otherwise return null
    return match ? match[1] : null;
}

const openRecipePopup = (meal)=>{
    recipe_details_content.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${meal_url(meal['strYoutube'])}?" frameborder="0" allowfullscreen class="recipe-details-content-youtube-link"></iframe>
    <u class="recipe-details-content-recipe-name">${meal.strMeal}</u>
    <h4 class="recipe-details-content-recipe-area">${meal.strArea}</h4>
    <h5 class="recipe-details-content-recipe-category">${meal.strCategory}</h5>
    <h3 class="recipe-details-content-recipe-ingredient-list">Ingredients:<h3>
    <ul class="recipe-details-content-recipe-ingredient">${fetch_ingredients(meal)}</ul>
    <p class="recipe-details-content-instruction"><span>Instructions :</span> ${meal[`strInstructions`]}</p>
    `;
    recipe_details_content.parentElement.style.display = 'block';
}

close_btn.addEventListener('click',()=>{
    recipe_details_content.parentElement.style.display = 'none';
})

search_button.addEventListener('click',(e)=>{
    e.preventDefault();
    const query = search_box.value.trim();
    fetchRecipe(query);
});
