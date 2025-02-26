const API_URL = "http://localhost:3000";

// Hämta recept
async function fetchRecipes() {
    const res = await fetch(`${API_URL}/recipes`);
    const recipes = await res.json();
    displayRecipes(recipes);
}

// Visa recept
function displayRecipes(recipes) {
    const list = document.getElementById("recipeList");
    list.innerHTML = "";
    recipes.forEach(recipe => {
        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${recipe.name}</strong><br>
            <em>${recipe.ingredients.join(", ")}</em><br>
            <small>${recipe.instructions}</small><br>
            <button onclick="editRecipe(${recipe.id})">✏️</button>
            <button onclick="deleteRecipe(${recipe.id})">🗑️</button>
        `;
        list.appendChild(li);
    });
}

// Lägg till recept
async function addRecipe() {
    const name = document.getElementById("name").value;
    const ingredients = document.getElementById("ingredients").value.split(",");
    const instructions = document.getElementById("instructions").value;
    await fetch(`${API_URL}/recipes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, ingredients, instructions })
    });
    fetchRecipes();
}

// Ta bort recept
async function deleteRecipe(id) {
    await fetch(`${API_URL}/recipes/${id}`, { method: "DELETE" });
    fetchRecipes();
}

// Redigera recept
async function editRecipe(id) {
    const newName = prompt("Nytt namn:");
    const newIngredients = prompt("Nya ingredienser (kommaseparerade):").split(",");
    const newInstructions = prompt("Nya instruktioner:");
    await fetch(`${API_URL}/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, ingredients: newIngredients, instructions: newInstructions })
    });
    fetchRecipes();
}

// Generera veckomeny
async function generateMenu() {
    const res = await fetch(`${API_URL}/weekly-menu`);
    const menu = await res.json();
    const menuList = document.getElementById("menuList");
    menuList.innerHTML = "";

    const days = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag"];
    
    menu.forEach((recipe, index) => {
        const li = document.createElement("li");

        // Skapa och lägg till en h3 med veckodagen
        const dayHeading = document.createElement("h3");
        dayHeading.textContent = days[index];

        // Skapa och lägg till receptets namn
        const recipeName = document.createElement("p");
        recipeName.textContent = recipe.name;

        // Lägg till i list-item (li)
        li.appendChild(dayHeading);
        li.appendChild(recipeName);

        // Lägg till i listan
        menuList.appendChild(li);
    });
}

fetchRecipes();