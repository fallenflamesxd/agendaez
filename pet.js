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
    const foodEmoji = document.getElementById('foodEmoji');
    if (foodEmoji) {
        // Reset animation if clicked rapidly
        foodEmoji.classList.remove('eating');
        void foodEmoji.offsetWidth; // force reflow
        foodEmoji.style.display = 'inline-block';
        foodEmoji.classList.add('eating');
        setTimeout(() => {
            foodEmoji.classList.remove('eating');
            foodEmoji.style.display = 'none';
        }, 700); // match animation duration
    }

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
    const sleepEmoji = document.getElementById('sleepEmoji');
    if (sleepEmoji) {
        sleepEmoji.classList.remove('sleeping');
        void sleepEmoji.offsetWidth; // force reflow
        sleepEmoji.style.display = 'inline-block';
        sleepEmoji.classList.add('sleeping');
        setTimeout(() => {
            sleepEmoji.classList.remove('sleeping');
            sleepEmoji.style.display = 'none';
        }, 1000); // match animation duration
    }

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
    points -= PLAY_ENERGY_COST;

    // --- Play animation ---
    const playEmoji = document.getElementById('playEmoji');
    if (playEmoji) {
        playEmoji.classList.remove('playing');
        void playEmoji.offsetWidth; // force reflow
        playEmoji.style.display = 'inline-block';
        playEmoji.classList.add('playing');
        setTimeout(() => {
            playEmoji.classList.remove('playing');
            playEmoji.style.display = 'none';
        }, 800); // match animation duration
    }

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
    points -= PET_ENERGY_COST;
    energy -= PET_ENERGY_COST;
    happiness = Math.min(100, happiness + 10);

    // --- Petting animation ---
    const petHand = document.getElementById('petHand');
    if (petHand) {
        petHand.classList.remove('petting');
        void petHand.offsetWidth; // force reflow
        petHand.style.display = 'inline-block';
        petHand.classList.add('petting');
        setTimeout(() => {
            petHand.classList.remove('petting');
            petHand.style.display = 'none';
        }, 900); // match animation duration
    }

    savePetState();
    updatePetDisplay();
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