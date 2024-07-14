var meals = []
var row1 = document.querySelector('.row1')
var row2 = document.querySelector('.row2')
const navSideMenu = document.querySelector('.navSideMenu')
var loading = document.querySelector(".loading");
var innerLoadingScreen = document.querySelector(".innerLoadingScreen");


// !====> Loading <==== //

function showLoading() {
    loading.classList.remove("d-none");
    hideContent();
}

function hideLoading() {
    setTimeout(() => {
        loading.classList.add("d-none");
        showContent();
        navSideMenu.classList.remove("d-none");
    }, 500);
}
function ShowinnerLoadingScreen() {
    innerLoadingScreen.classList.remove("d-none");
}

function hideinnerLoadingScreen() {
    setTimeout(() => {
        innerLoadingScreen.classList.add("d-none");
        showContent();
    }, 500);
}

function showContent() {
    row1.classList.remove("d-none");
    row2.classList.remove("d-none");


    row1.classList.add("fade-in");
    row2.classList.add("fade-in");
}
function hideContent() {
    row1.classList.add("d-none");
    row2.classList.add("d-none");


    row1.classList.add("fade-out");
    row2.classList.add("fade-out");
}

// !====> opening & closing Menu <==== //

$('.openClosebtn').click(function () {
    if (($(".navHeader").css("left") == "0px") && ($(".navSideMenu").css("left") == "-260px")) {

        $(".navSideMenu").animate({ left: '0px' }, 500),
            $(".navHeader").animate({ left: '260px' }, 500)


        for (let i = 0; i < 5; i++) {
            $(".pages li").eq(i).animate({
                top: '0px'
            }, (i + 5) * 100)
        }


        $(".openClosebtn").removeClass("fa-solid fa-bars");
        $(".openClosebtn").addClass("fa-solid fa-xmark");


    } else {

        CloseNavMenu()
    }
})

function CloseNavMenu() {

    $(".navSideMenu").animate({ left: '-260px' }, 500),
        $(".navHeader").animate({ left: '0px' }, 500)


    for (let i = 0; i < 5; i++) {
        $(".pages li").eq(i).animate({
            top: '200px'
        }, (i + 5) * 100)
    }

    $(".openClosebtn").removeClass("fa-solid fa-xmark");
    $(".openClosebtn").addClass("fa-solid fa-bars");

}



// !====> Home <==== //

$(document).ready(function () {

    // $(".loading").fadeOut(500)

    showLoading();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    console.log("hiiiii")
    var xml = new XMLHttpRequest()
    xml.open('GET', `https://www.themealdb.com/api/json/v1/1/search.php?s=`)
    xml.send()
    xml.addEventListener('load', function () {
        meals = JSON.parse(xml.responseText).meals
        displayHomeMeals()
    })


    hideLoading()


});

function displayHomeMeals() {
    var box = ''
    for (var i = 0; i < meals.length; i++) {
        box += `
        <div onclick="getDetailOfMeal('${meals[i].idMeal}')" class="col-md-3 theMeal position-relative overflow-hidden">
                <img src="${meals[i].strMealThumb}" alt="" class="w-100 rounded-2">
                <div class="meal-layer d-flex align-items-center text-black p-2">
                        <p class="fw-semibold fs-3 ">${meals[i].strMeal}</p>
                    </div>
                </div>
        `
    }
    row1.innerHTML = box

}

// !====> DetailsOfMeals <==== //

async function getDetailOfMeal(mealID) {
    CloseNavMenu();

    row1.innerHTML = "";
    row2.innerHTML = "";

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");


    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        response = await response.json();

        if (response.meals && response.meals.length > 0) {
            displayMealDetails(response.meals[0]);
        } else {
            console.error("No meal found with this ID.");
        }

    } catch (error) {
        console.error("Error fetching meal details:", error);
    } finally {

        hideinnerLoadingScreen()

    }

}


function displayMealDetails(meal) {

    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    // let tags = meal.strTags.split(",")                ليه دي مش شغاله ؟ و بتديني شاشه سمرااا
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let box = `
    <div class="col-md-4">
        <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
        <h2 class=" mt-3 ">${meal.strMeal}</h2>
    </div>
    <div class="col-md-8">
        <h2>Instructions</h2>
        <p>${meal.strInstructions}</p>
        <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
        <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
        <h3>Recipes :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${ingredients}
        </ul>

        <h3>Tags :</h3>
        <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsStr}
        </ul>

        <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
        <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
    </div>`


    row1.innerHTML = box

}

// !====> Search <==== //

function displaySearchPage() {
    row1.innerHTML = ""
    row2.innerHTML = ""

    box = `<div class="container innerContainer w-75">
                        <div class="row searchInputs justify-content-center align-items-center">
                            <div class="col-md-6 ">
                                <input onkeyup="searchByName(this.value)" type="text" class="nameSearch form-control bg-black  text-white"
                                    placeholder="Search By Name">
                            </div>
                            <div class="col-md-6">
                                <input onkeyup="searchByFLetter(this.value)" type="text" class="nameSearch form-control bg-black text-white"
                                    placeholder="Search By First Letter" maxlength="1">
                            </div>
                        </div>
                    </div>
    
    `

    row1.innerHTML = box
}

async function searchByName(term) {

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()
    meals = response.meals

    displaySearcedMealsByName(meals)

    hideinnerLoadingScreen()

}



async function searchByFLetter(char) {

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");

    char == "" ? char = "a" : "";
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)
    response = await response.json()
    meals = response.meals

    displaySearcedMealsByName(meals)

    hideinnerLoadingScreen()

}

function displaySearcedMealsByName(arr) {
    if (arr === null || arr.length === 0) {
        row2.innerHTML = `<p> No meals found.</p>`;
        return;
    }

    var box = '';
    for (var i = 0; i < arr.length; i++) {
        box += `
        <div onclick="getDetailOfMeal('${arr[i].idMeal}')" class="col-md-3 theMeal position-relative overflow-hidden">
                <img src="${arr[i].strMealThumb}" alt="" class="w-100 rounded-2">
                <div class="meal-layer d-flex align-items-center text-black p-2">
                        <p class="fw-semibold fs-3 ">${arr[i].strMeal}</p>
                    </div>
                </div>
        `;
    }
    row2.innerHTML = box;
}

// !====> Categories <==== //


async function getCategories() {
    row1.innerHTML = ""
    row2.innerHTML = "";

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    response = await response.json()

    displayCategories(response.categories)

    hideinnerLoadingScreen()

}


function displayCategories(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-black p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }

    row1.innerHTML = box
}

async function getCategoryMeals(category) {
    row1.innerHTML = ""
    row2.innerHTML = ""

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    response = await response.json()


    displaySelectedCtegoryMeals(response.meals.slice(0, 20))

    hideinnerLoadingScreen()

}

function displaySelectedCtegoryMeals(arr) {

    var box = ''
    for (var i = 0; i < arr.length; i++) {
        box += `
        <div onclick="getDetailOfMeal('${arr[i].idMeal}')" class="col-md-3 theMeal position-relative overflow-hidden">
                <img src="${arr[i].strMealThumb}" alt="" class="w-100 rounded-2">
                <div class="meal-layer d-flex align-items-center text-black p-2">
                        <p class="fw-semibold fs-3 ">${arr[i].strMeal}</p>
                    </div>
                </div>
        `
    }
    row2.innerHTML = box
}

// !====> Area <==== //

async function getArea() {
    row1.innerHTML = ""
    row2.innerHTML = ""

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    row2.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayArea(respone.meals)

    hideinnerLoadingScreen()

}


function displayArea(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    row1.innerHTML = box
}



async function getAreaMeals(area) {
    row1.innerHTML = ""
    row2.innerHTML = ""

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displaySelectedAreaMeals(response.meals.slice(0, 20))

    hideinnerLoadingScreen()

}

function displaySelectedAreaMeals(arr) {

    var box = ''
    for (var i = 0; i < arr.length; i++) {
        box += `
        <div onclick="getDetailOfMeal('${arr[i].idMeal}')" class="col-md-3 theMeal position-relative overflow-hidden">
                <img src="${arr[i].strMealThumb}" alt="" class="w-100 rounded-2">
                <div class="meal-layer d-flex align-items-center text-black p-2">
                        <p class="fw-semibold fs-3 ">${arr[i].strMeal}</p>
                    </div>
                </div>
        `
    }
    row2.innerHTML = box
}


// !====> Ingredients <==== //

async function getIngredients() {
    row1.innerHTML = ""
    row2.innerHTML = ""

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    row2.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()
    console.log(respone.meals);

    displayIngredients(respone.meals.slice(0, 20))

    hideinnerLoadingScreen()

}


function displayIngredients(arr) {
    let cartoona = "";

    for (let i = 0; i < arr.length; i++) {
        cartoona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    row1.innerHTML = cartoona
}

async function getIngredientsMeals(ingredients) {
    row1.innerHTML = ""
    row2.innerHTML = ""

    ShowinnerLoadingScreen();
    row2.classList.add("d-none");
    row1.classList.add("d-none");

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    response = await response.json()


    displaySelectedIngredientsMeals(response.meals.slice(0, 20))

    hideinnerLoadingScreen()

}

function displaySelectedIngredientsMeals(arr) {

    var box = ''
    for (var i = 0; i < arr.length; i++) {
        box += `
        <div onclick="getDetailOfMeal('${arr[i].idMeal}')" class="col-md-3 theMeal position-relative overflow-hidden">
                <img src="${arr[i].strMealThumb}" alt="" class="w-100 rounded-2">
                <div class="meal-layer d-flex align-items-center text-black p-2">
                        <p class="fw-semibold fs-3 ">${arr[i].strMeal}</p>
                    </div>
                </div>
        `
    }
    row2.innerHTML = box
}

// !====> Contact US Section <==== //

function DisplayContactPage() {
    row1.innerHTML = ''
    row2.innerHTML = ''

    row1.innerHTML = `
    <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Special characters and numbers not allowed
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                        
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                        
                    </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                        
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        Enter valid password *Minimum eight characters, at least one letter and one number:*
                    </div>
                </div>
                <div class="col-md-6">
                    <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                        
                    </div>
                </div>
            </div>
            <button id="submitBtn" onclick="validateInputs(); inputsValidation()" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div> 
    `

}

function inputsValidation() {
    const submitBtn = document.getElementById('submitBtn');

    if (validateInputs()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function validateInputs() {
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const phoneInput = document.getElementById('phoneInput');
    const ageInput = document.getElementById('ageInput');
    const passwordInput = document.getElementById('passwordInput');
    const repasswordInput = document.getElementById('repasswordInput');

    let isValid = true;

    // Name validation
    const nameRegex = /^[a-zA-Z ]+$/;
    if (!nameRegex.test(nameInput.value)) {
        nameAlert.classList.remove('d-none');
        isValid = false;
    } else {
        nameAlert.classList.add('d-none');
    }

    // Email validation
    const emailRegex = /^\w+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailInput.value)) {
        emailAlert.classList.remove('d-none');
        emailAlert.textContent = "Email not valid (example@yourdomain.com)";
        isValid = false;
    } else {
        emailAlert.classList.add('d-none');
    }

    // Phone number validation
    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(phoneInput.value)) {
        phoneAlert.classList.remove('d-none');
        phoneAlert.textContent = "Enter a valid phone number";
        isValid = false;
    } else {
        phoneAlert.classList.add('d-none');
    }

    // Age validation 
    const ageValue = parseInt(ageInput.value);
    if (isNaN(ageValue) || ageValue < 0) {
        ageAlert.classList.remove('d-none');
        ageAlert.textContent = "Enter a valid age (positive integer)";
        isValid = false;
    } else {
        ageAlert.classList.add('d-none');
    }

    // Password validation (minimum 8 characters, at least one letter and one number)
    const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(passwordInput.value)) {
        passwordAlert.classList.remove('d-none');
        isValid = false;
    } else {
        passwordAlert.classList.add('d-none');
    }

    // Repassword validation (match password)
    if (repasswordInput.value !== passwordInput.value) {
        repasswordAlert.classList.remove('d-none');
        repasswordAlert.textContent = "Passwords must match";
        isValid = false;
    } else {
        repasswordAlert.classList.add('d-none');
    }

    return isValid;
}


//حته ال disabled ف ال submit btn              DONE
//  اتاكد على سكشن ايريا الكلتجيوري و المكونات
// اعملى سكشن اللودر (التحميل) و اعمله fade in & out ف الجافا         DONE
// اعمل حته قفل السايد منيو ف فانكشن لوحدها وو ازودها ف كل مره click ع اى li         DONE