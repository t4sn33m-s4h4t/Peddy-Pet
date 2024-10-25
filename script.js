// Fetch Everything Here
async function fetchCategories() {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/categories');
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

async function fetchAllPets() {
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/peddy/pets');
        const data = await response.json();
        return data.pets;
    } catch (error) {
        console.error('Error fetching all pets:', error);
    }
}

async function fetchPetsByCategory(categoryName = "all") {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Error fetching pets in category "${categoryName}":`, error);
    }
}

async function fetchPetDetails(petId) {
    try {
        const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);
        const data = await response.json();
        return data.petData;
    } catch (error) {
        console.error(`Error fetching details for pet ID "${petId}":`, error);
    }
}



async function displayCategories() {
    const categories = await fetchCategories();
    const categoryContainer = document.getElementById('category-container');
    categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.className = 'categories btn flex items-center lg:py-2 justify-center lg:space-x-2 lg:h-20 px-0 h-16 bg-white';
        categoryButton.id = category.id;
        categoryButton.name = category.category;
        categoryButton.innerHTML = `
            <img src="${category.category_icon}" alt="" class="lg:h-14 lg:w-14 h-4 w-4">
            <span>${category.category}</span>
        `;
        categoryButton.addEventListener("click", () => {
            displayPetsByCategory(category.category);
            activeBtns(category.id);
        })

        categoryContainer.appendChild(categoryButton);
    });
}
function displayPets(pets) {
    const petGrid = document.getElementById('pet-grid');
    const errorDisplayer = document.getElementById("error-display");

    petGrid.innerHTML = '';
    if (!pets || !pets.length) {
        petGrid.classList.add("hidden");
        errorDisplayer.classList.remove("hidden")

    } else {

        errorDisplayer.classList.add("hidden");
        petGrid.classList.remove("hidden")
        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'card w-full bg-white border-gray-200 p-4 border';
            petCard.innerHTML = `

                    <figure>
                    <img src="${pet.image}" alt="Pet"class="w-full h-48 object-cover rounded-xl">
                    </figure>
                    <div class="p-0 pt-2 text-gray-600">
                        <h2 class="card-title text-black font-bold">${pet.pet_name}</h2>
                        <ul class="space-y-1 text-left">
                                <li>
                                <i class="fa-solid fa-border-all"></i>
                                    <strong>Breed:</strong> ${pet.breed ? pet.breed : "Not Available"}
                                </li>
                                <li>
                                    <i class="fa-solid fa-calendar-days"></i>
                                    <strong>Birth:</strong> ${pet.date_of_birth ? new Date(pet.date_of_birth).getFullYear() : "Not Available"}
                                </li>
                                <li>
                                    <i class="fa-solid fa-transgender"></i>
                                    <strong>Gender:</strong> ${pet.gender ? pet.gender : "Not Available"}
                                </li>
                                <li>
                                    <i class="fa-solid fa-dollar-sign"></i>
                                    <strong>Price:</strong> ${pet.price ? pet.price + "$" : "Not Available"}
                                </li>
                        </ul>
                            <div class="card-actions flex mt-4 justify-between">
                                <button class="btn hover:bg-teal-600 hover:text-white text-gray-500 px-4 bg-white" onclick="addLikedImage('${pet.image}')">
                                    <i class="fa-regular fa-thumbs-up"></i>
                                </button>
                                <button class="text-teal-600 hover:bg-teal-600 hover:text-white btn px-4 bg-white" onclick="adoptPet(event)">
                                    Adopt
                                </button>
                                <button class="text-teal-600 hover:bg-teal-600 hover:text-white btn px-4 bg-white" onclick="displayPetDetails('${pet.petId}')">
                                    Details
                                </button>
                            </div>
                        </div>
        `;
            petGrid.appendChild(petCard);
        });
    }
}
async function displayPetDetails(petId) {
    const detailsContainer = document.querySelector("#post-details-modal-container")
    const pet = await fetchPetDetails(petId)
    detailsContainer.innerHTML = `
    
            <img src="${pet.image}" class="w-full rounded-xl" alt="">
            <div>
                <h2 class="text-2xl font-extrabold my-2">${pet.pet_name}</h2>

                <ul class=" text-left grid grid-cols-2  text-gray-500">
                    <div class="space-y-1">
                        <li>
                            <i class="fa-solid fa-border-all"></i>
                            <strong>Breed:</strong> ${pet.breed ? pet.breed : "Not Available"}
                        </li>
                        <li>
                            <i class="fa-solid fa-transgender"></i>
                            <strong>Gender:</strong> ${pet.gender ? pet.gender : "Not Available"}
                        </li>
                        <li>
                            <i class="fa-solid fa-transgender"></i>
                            <strong>Vaccinated Status:</strong> ${pet.vaccinated_status ? pet.vaccinated_status : "Not Available"}
                        </li>
                    </div>
                    <div class="space-y-1">
                        
                        <li>
                            <i class="fa-solid fa-calendar-days"></i>
                            <strong>Birth:</strong> ${pet.date_of_birth ? new Date(pet.date_of_birth).getFullYear() : "Not Available"}
                        </li>
                        <li>
                            <i class="fa-solid fa-dollar-sign"></i>
                            <strong>Price:</strong> ${pet.price ? pet.price + "$" : "Not Available"}
                        </li>
                    </div>
                </ul>
            </div>
            <hr class="my-4">
            <div>
                <h2 class="font-extrabold text-gray-700 text-md">Details Information</h2>
                <p class="text-sm font-bold text-gray-500 my-3">${pet.pet_details}</p>
            </div>
            <div class="modal-action">
                <label for="post-details-modal"
                    class="btn bg-teal-100 border border-teal-200 text-teal-600 hover:text-white hover:bg-teal-600 w-full">Cancel</label>
            </div>
    `
    const checkbox = document.getElementById("post-details-modal");
    checkbox.checked = !checkbox.checked;
}

function addLikedImage(src) {
    const container = document.getElementById("liked-pets");
    if (!container.classList.contains("border")) {
        container.classList.add("border");
    }
    const imgTag = document.createElement("img");
    imgTag.classList.add("rounded-xl")
    imgTag.src = src;
    container.appendChild(imgTag);
}

function activeBtns(id) {
    const categorties = document.getElementsByClassName("categories");
    for (let i = 0; i < categorties.length; i++) {
        const category = categorties[i];
        category.classList.remove("active");
        category.classList.add("bg-white");
    }
    document.getElementById(id).classList.add("active")
    document.getElementById(id).classList.remove("bg-white")
}

function adoptPet(e) {
    const countDown = document.getElementById("countDown");
    countDown.textContent = '3';
    const AdoptPetContainer = document.getElementById("adopt-pet-modal")
    AdoptPetContainer.checked = true;
    let countdownValue = 2;
    const interval = setInterval(() => {
        countDown.textContent = countdownValue;
        countdownValue--;
        if (countdownValue < 0) {
            clearInterval(interval);
            AdoptPetContainer.checked = false
        }
    }, 1000);
    e.target.disabled = true;
}

async function loadAndDisplayPets(pets) {
    const spinner = document.getElementById("spinner");
    const postsContainer = document.getElementById('posts-container');
    postsContainer.classList.add("hidden");
    spinner.classList.remove("hidden");
    displayPets(pets);
    setTimeout(() => {
        postsContainer.classList.remove("hidden");
        spinner.classList.add("hidden");
    }, 2000)
}
async function displayPetsByCategory(categoryName) {
    const pets = categoryName === 'all' ? await fetchAllPets() : await fetchPetsByCategory(categoryName);
    loadAndDisplayPets(pets);
}

async function sortByPrice() {
    const activeCategory = document.getElementsByClassName("active");
    pets = activeCategory.length ? await fetchPetsByCategory(activeCategory[0].name) : await fetchAllPets();
    pets.sort((a, b) => b.price - a.price);
    loadAndDisplayPets(pets)
}

function showMobileMenu() {
    const mobileNav = document.getElementById("mobileNav");
const overlay = document.getElementsByClassName("overlay")[0];
    mobileNav.classList.toggle('left-0');
    overlay.classList.toggle('hidden');
}
function scrollToAdopt(){
    document.getElementById("adopt-section").scrollIntoView({
        behavior: "smooth"
      });
}
function initializePage() {
    displayCategories();
    displayPetsByCategory('all');
}


initializePage();