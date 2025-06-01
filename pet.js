// --- PET STATE ---
let points = parseInt(localStorage.getItem('points')) || 0;
let petName = localStorage.getItem('petName') || "Fluffy";
let petType = localStorage.getItem('petType') || "🐱";
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
    document.getElementById('petName').textContent = petName;
    document.getElementById('petAvatar').textContent = petType;
    document.getElementById('energy').textContent = energy + "%";
    document.getElementById('happiness').textContent = happiness + "%";
}

// --- SAVE STATE ---
function savePetState() {
    localStorage.setItem('points', points);
    localStorage.setItem('petName', petName);
    localStorage.setItem('petType', petType);
    localStorage.setItem('petEnergy', energy);
    localStorage.setItem('petHappiness', happiness);
    localStorage.setItem('ownedPets', JSON.stringify(ownedPets));
}

// --- PET ACTIONS ---
function buyPet(type) {
    if (ownedPets.includes(type)) {
        selectPet(type);
        return;
    }
    const price = petPrices[type];
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

function renamePet() {
    if (points < NAME_CHANGE_PRICE) {
        alert(`You need ${NAME_CHANGE_PRICE} points to rename your pet.`);
        return;
    }
    const newName = prompt("Enter a new name for your pet:");
    if (newName && newName.trim()) {
        if (confirm(`Rename pet to "${newName.trim()}" for ${NAME_CHANGE_PRICE} points?`)) {
            points -= NAME_CHANGE_PRICE;
            petName = newName.trim();
            savePetState();
            updatePetDisplay();
        }
    }
}

function feedPet() {
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

function sleepPet() {
    energy = 100;
    happiness = Math.min(100, happiness + 2);
    savePetState();
    updatePetDisplay();
}

function playPet() {
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

function petPet() {
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
window.buyPet = buyPet;
window.selectPet = selectPet;
window.renamePet = renamePet;
window.feedPet = feedPet;
window.sleepPet = sleepPet;
window.playPet = playPet;
window.petPet = petPet;