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
const SLEEP_PRICE = 50;
const PLAY_ENERGY_COST = 10;
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
    if (energy >= 100) {
        alert("Your pet's energy is already full!");
        return;
    }
    if (points < FEED_PRICE) {
        alert(`You need ${FEED_PRICE} points to feed your pet.`);
        return;
    }
    points -= FEED_PRICE;
    energy = Math.min(100, energy + 20);
    happiness = Math.min(100, happiness + 5);

    // --- Eating animation ---
    animateEmoji('foodEmoji', 'eating', 700);

    savePetState();
    updatePetDisplay();
}

function sleep() {
    if (energy >= 100) {
        alert("Your pet's energy is already full!");
        return;
    }
    if (points < SLEEP_PRICE) {
        alert(`You need ${SLEEP_PRICE} points to let your pet sleep.`);
        return;
    }
    points -= SLEEP_PRICE;
    energy = 100;
    happiness = Math.min(100, happiness + 2);

    // --- Sleep animation ---
    animateEmoji('sleepEmoji', 'sleeping', 1000);

    savePetState();
    updatePetDisplay();
}

function play() {
    if (energy < PLAY_ENERGY_COST) {
        alert("Not enough energy to play!");
        return;
    }
    if (points < PLAY_ENERGY_COST) {
        alert(`You need ${PLAY_ENERGY_COST} points to play with your pet.`);
        return;
    }
    energy = Math.max(0, energy - PLAY_ENERGY_COST);
    happiness = Math.min(100, happiness + 25);
    points -= 10;

    // --- Play animation ---
    animateEmoji('playEmoji', 'playing', 800);

    savePetState();
    updatePetDisplay();
}

function pet() {
    if (energy < PET_ENERGY_COST) {
        alert("Not enough energy to pet!");
        return;
    }
    if (points < PET_ENERGY_COST) {
        alert(`You need ${PET_ENERGY_COST} points to pet your pet.`);
        return;
    }
    points -= 5;
    energy = Math.max(0, energy - PET_ENERGY_COST);
    happiness = Math.min(100, happiness + 10);

    // --- Petting animation ---
    animateEmoji('petHand', 'petting', 900);

    savePetState();
    updatePetDisplay();
}

// --- EMOJI ANIMATION HELPER ---
function animateEmoji(id, className, duration) {
    const emoji = document.getElementById(id);
    if (emoji) {
        emoji.classList.remove(className);
        void emoji.offsetWidth; // force reflow
        emoji.style.display = 'inline-block';
        emoji.classList.add(className);
        setTimeout(() => {
            emoji.classList.remove(className);
            emoji.style.display = 'none';
        }, duration);
    }
}

// --- POINTS SYNC ACROSS ALL SCREENS ---
function updatePointsDisplay() {
    points = parseInt(localStorage.getItem('points')) || 0;
    document.getElementById('pointsCount').textContent = points;
}

function addPoints(amount) {
    let points = parseInt(localStorage.getItem('points')) || 0;
    points += amount;
    if (points < 0) points = 0;
    localStorage.setItem('points', points);
    updatePointsDisplay();
}

// --- INIT & THEME TOGGLE ---
document.addEventListener('DOMContentLoaded', function() {
    updatePetDisplay();
    setInterval(() => {
        updatePointsDisplay();
    }, 1000);

    // THEME TOGGLE LOGIC (only once, at the end of DOMContentLoaded)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Load saved theme
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.textContent = "🌙 Dark Mode";
        }
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    } else {
        // If no toggle, still sync theme from localStorage
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});

// Make functions global for button onclicks
window.purchasePet = purchasePet;
window.selectPet = selectPet;
window.editName = editName;
window.feed = feed;
window.sleep = sleep;
window.play = play;
window.pet = pet;
window.addPoints = addPoints;