document.addEventListener('DOMContentLoaded', () => {
    let events = JSON.parse(localStorage.getItem('events')) || [];
    let points = parseInt(localStorage.getItem('points')) || 0;

    const form = document.getElementById('event-form');
    const eventsList = document.getElementById('events-list');
    const pointsCount = document.getElementById('pointsCount');

    // Always update the points display from localStorage
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
                    addPoints(1); // This is the primary place points are incremented
                    events.splice(index, 1);
                    saveEvents();
                    renderEvents();
                }
            });
        });
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('event-title').value;
        const date = document.getElementById('event-date').value;
        const time_start = document.getElementById('event-time_start').value;
        const time_end = document.getElementById('event-time_end').value;
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