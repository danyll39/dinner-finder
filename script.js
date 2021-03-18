const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');
// Search meal and fetch from API
function searchMeal(e) {
    e.preventDefault();

    // Clear Single Meal
    single_mealEl.innerHTML = '';

    //Get Search Term
    const term = search.value;
    // Check for empty
    if (term.trim()) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`
                if (data.drinks === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try again</p>`
                } else {
                    mealsEl.innerHTML = data.drinks.map(drink => `
            <div class="meal">
            <img src="${drink.strDrinkThumb}"  alt="${drink.strDrink}" />
            <div class="meal-info" data-mealid="${drink.idDrink}">
            <h3>${drink.strDrink}</h3>
            </div>
            </div>
            `)
                        .join('')
                }

            })
        //Clear search text
        search.value = ''
    } else {
        alert('Please enter a search term')
    }
}

//Fetch drink by ID
function getDrinkById(drinkID) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
        .then(res => res.json())
        .then(data => {
            const drink = data.drinks[0]
            addDrinkToDOM(drink)
        })
}

// Fetch random drink from API
function getRandomDrink() {
    //Clear Drinks and heading
    mealsEl.innerHTML = ''
    resultHeading.innerHTML = ''

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
    .then(res => res.json())
    .then(data => {
        const drink = data.drinks[0]

        addDrinkToDOM(drink)
    })

}
//Add drink to DOM
function addDrinkToDOM(drink) {
    const ingredients = []

    for (let i = 1; i <= 20; i++) {
        if (drink[`strIngredient${i}`]) {
            ingredients.push(`${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]} `)
        } else {
            break

        }
    }
    single_mealEl.innerHTML = `
<div class="single-meal">
<h1>${drink.strDrink}</h1>
<img  src="${drink.strDrinkThumb}" alt="${drink.strDrink}" />
<div class="single-meal-info">
${drink.strCategory ? `<p>${drink.strCategory}</p>` : ''}
${drink.strArea ? `<p>${drink.strArea}</p>` : ''}
</div>
<div class="main">
<p>${drink.strInstructions}</p>
<h2>Ingredients</h2>
<ul>
${ingredients.map(ing => `<li>${ing}</li>`).join('')}
</ul>
</div>
</div>`
}


//Event Listener
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomDrink);


mealsEl.addEventListener('click', e => {
    const drinkInfo = e.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info')
        } else {
            return false
        }


    })
    if (drinkInfo) {
        const drinkId = drinkInfo.getAttribute('data-mealid')
        getDrinkById(drinkId)
    }
})