document.addEventListener('DOMContentLoaded', () => {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let points = parseInt(localStorage.getItem('points')) || 0;
    let plan = localStorage.getItem('plan') || 'free'; // 'free', 'pro', 'premium'

    const form = document.getElementById('event-form');
    const eventsList = document.getElementById('events-list');
    const pointsCount = document.getElementById('pointsCount');
    const planLabel = document.getElementById('planLabel');
    const planBtns = document.querySelectorAll('.plan-btn');

    // Plan limits
    const planLimits = {
        free: 5,
        pro: 15,
        premium: Infinity
    };

    // Plan switcher logic
    planBtns.forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.plan === plan);
        btn.addEventListener('click', function() {
            plan = this.dataset.plan;
            localStorage.setItem('plan', plan);
            if (planLabel) planLabel.textContent = `Current plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
            planBtns.forEach(b => b.classList.toggle('selected', b.dataset.plan === plan));
        });
    });
    // Set initial label and highlight
    if (planLabel) planLabel.textContent = `Current plan: ${plan.charAt(0).toUpperCase() + plan.slice(1)}`;
    planBtns.forEach(btn => btn.classList.toggle('selected', btn.dataset.plan === plan));

    function updatePointsDisplay() {
        points = parseInt(localStorage.getItem('points')) || 0;
        if (pointsCount) pointsCount.textContent = points;
    }

    function saveEvents() {
        localStorage.setItem('events', JSON.stringify(events));
    }

    function renderEvents() {
        eventsList.innerHTML = '';
        events.forEach((event, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="checkbox" class="complete-checkbox" data-index="${idx}"></td>
                <td>${event.date}</td>
                <td>${event.time_start}</td>
                <td>${event.time_end}</td>
                <td>${event.title}</td>
            `;
            eventsList.appendChild(row);
        });

        document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const index = parseInt(this.dataset.index);
                if (this.checked) {
                    addPoints(1);
                    events.splice(index, 1);
                    saveEvents();
                    renderEvents();
                }
            });
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const maxTasks = planLimits[plan];
        if (events.length >= maxTasks) {
            alert(`Maximum ${maxTasks === Infinity ? 'unlimited' : maxTasks} tasks allowed for your plan!`);
            return;
        }
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time_start = document.getElementById('event-time_start').value;
        const time_end = document.getElementById('event-time_end').value;

        // --- Time check ---
        if (time_start >= time_end) {
            alert("Start time must be earlier than end time.");
            return;
        }

        events.push({ date, time_start, time_end, title });
        saveEvents();
        renderEvents();
        form.reset();
    });

    // --- POINTS SYNC ACROSS ALL SCREENS ---
    function addPoints(amount) {
        let points = parseInt(localStorage.getItem('points')) || 0;
        points += amount;
        if (points < 0) points = 0;
        localStorage.setItem('points', points);
        updatePointsDisplay();
    }
    window.addPoints = addPoints;

    function resetPoints() {
        localStorage.setItem('points', 0);
        updatePointsDisplay();
    }
    window.resetPoints = resetPoints;

    // Initialize and keep in sync
    updatePointsDisplay();
    renderEvents();
    setInterval(updatePointsDisplay, 1000);
});

    // Sync theme from localStorage (no toggle here)
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // ...rest of your code...

    // Theme toggle logic
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
}