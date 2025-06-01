// --- PET STATE ---
let points = parseInt(localStorage.getItem('points')) || 0;
let petType = localStorage.getItem('petType') || "🐱";
let petNames = JSON.parse(localStorage.getItem('petNames')) || { "🐱": "Fluffy" };
let energy = parseInt(localStorage.getItem('petEnergy')) || 100;
let happiness = parseInt(localStorage.getItem('petHappiness')) || 100;
let ownedPets = JSON.parse(localStorage.getItem('ownedPets')) || ["🐱"];

// --- PET PRICES ---
const petPrices = {
    "🐶": 100,
    "🐰": 200,
    "🐹": 300,
    "🦊": 500,
    "🐼": 1000
};
const NAME_CHANGE_PRICE = 50;
const FEED_PRICE = 5;
const SLEEP_PRICE = 0;
const PLAY_ENERGY_COST = 20;
const PET_ENERGY_COST = 5;

// --- DISPLAY UPDATE ---
function updatePetDisplay() {
    document.getElementById('pointsCount').textContent = points;
    document.getElementById('petName').textContent = petNames[petType] || "Fluffy";
    document.getElementById('petAvatar').textContent = petType;
    document.getElementById('energy').textContent = energy + "%";
    document.getElementById('happiness').textContent = happiness + "%";
}

// --- SAVE STATE ---
function savePetState() {
    localStorage.setItem('points', points);
    localStorage.setItem('petType', petType);
    localStorage.setItem('petNames', JSON.stringify(petNames));
    localStorage.setItem('petEnergy', energy);
    localStorage.setItem('petHappiness', happiness);
    localStorage.setItem('ownedPets', JSON.stringify(ownedPets));
}

// --- PET ACTIONS ---
function purchasePet(type, price) {
    if (ownedPets.includes(type)) {
        selectPet(type);
        return;
    }
    if (points >= price) {
        if (confirm(`Buy ${type} for ${price} points?`)) {
            points -= price;
            ownedPets.push(type);
            selectPet(type);
            savePetState();
            updatePetDisplay();
        }
    } else {
        alert("Not enough points!");
    }
}

function selectPet(type) {
    if (ownedPets.includes(type)) {
        petType = type;
        savePetState();
        updatePetDisplay();
    }
}

function editName() {
    if (points < NAME_CHANGE_PRICE) {
        alert(`You need ${NAME_CHANGE_PRICE} points to rename your pet.`);
        return;
    }
    const newName = prompt("Enter a new name for your pet:");
    if (newName && newName.trim()) {
        if (confirm(`Rename pet to "${newName.trim()}" for ${NAME_CHANGE_PRICE} points?`)) {
            points -= NAME_CHANGE_PRICE;
            petNames[petType] = newName.trim();
            savePetState();
            updatePetDisplay();
        }
    }
}

function feed() {
    if (points < FEED_PRICE) {
        alert(`You need ${FEED_PRICE} points to feed your pet.`);
        return;
    }
    points -= FEED_PRICE;
    energy = Math.min(100, energy + 20);
    happiness = Math.min(100, happiness + 5);
    savePetState();
    updatePetDisplay();
}

function sleep() {
    energy = 100;
    happiness = Math.min(100, happiness + 2);
    savePetState();
    updatePetDisplay();
}

function play() {
    if (energy < PLAY_ENERGY_COST) {
        alert("Not enough energy to play!");
        return;
    }
    energy -= PLAY_ENERGY_COST;
    happiness = Math.min(100, happiness + 25);
    points += 10; // reward for playing
    savePetState();
    updatePetDisplay();
}

function pet() {
    if (energy < PET_ENERGY_COST) {
        alert("Not enough energy to pet!");
        return;
    }
    energy -= PET_ENERGY_COST;
    happiness = Math.min(100, happiness + 10);
    savePetState();
    updatePetDisplay();
}

// --- POINTS SYNC ACROSS ALL SCREENS ---
function updatePointsDisplay() {
    points = parseInt(localStorage.getItem('points')) || 0;
    document.getElementById('pointsCount').textContent = points;
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', function() {
    updatePetDisplay();
    setInterval(() => {
        updatePointsDisplay();
    }, 1000);
});

// Make functions global for button onclicks
window.purchasePet = purchasePet;
window.selectPet = selectPet;
window.editName = editName;
window.feed = feed;
window.sleep = sleep;
window.play = play;
window.pet = pet;

function addPoints(amount) {
        let points = parseInt(localStorage.getItem('points')) || 0;
        points += amount;
        if (points < 0) points = 0;
        localStorage.setItem('points', points);
        updatePointsDisplay();
    }
    window.addPoints = addPoints;