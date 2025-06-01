// --- CLOCK, DATE, DAYS ROW, TASKS REMAINING, HOURS REMAINING, SCHEDULE LIST ---
document.addEventListener('DOMContentLoaded', function() {
    function updateClockAndStats() {
        // --- CLOCK ---
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        const digitalClock = document.getElementById('digitalClock');
        if (digitalClock) digitalClock.textContent = `${hours}:${minutes}`;

        // --- DATE ---
        const months = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];
        const day = now.getDate();
        const month = months[now.getMonth()];
        const year = now.getFullYear();
        function ordinal(n) {
            if (n > 3 && n < 21) return 'TH';
            switch (n % 10) {
                case 1:  return "ST";
                case 2:  return "ND";
                case 3:  return "RD";
                default: return "TH";
            }
        }
        const dateLabel = document.getElementById('dateLabel');
        if (dateLabel) dateLabel.innerHTML = `${month} ${day}<sup>${ordinal(day)}</sup> ${year}`;

        // --- DYNAMIC DAYS ROW ---
        const daysRow = document.getElementById('daysRow');
        if (daysRow) {
            daysRow.innerHTML = '';
            for (let offset = -3; offset <= 2; offset++) {
                const d = new Date(now);
                d.setDate(day + offset);
                const dayNum = d.getDate();
                const div = document.createElement('div');
                div.className = 'day-circle';
                if (offset === 0) {
                    div.classList.add('today');
                    div.innerHTML = `<div class="today-label">TODAY</div>${dayNum}`;
                } else {
                    div.textContent = dayNum;
                }
                daysRow.appendChild(div);
            }
        }

        // --- TASKS REMAINING ---
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const tasksElem = document.getElementById('tasksRemaining');
        if (tasksElem) tasksElem.textContent = events.length;

        // --- HOURS REMAINING ---
        const hoursLeft = 23 - now.getHours() + (1 - now.getMinutes() / 60);
        const hoursElem = document.getElementById('hoursRemaining');
        if (hoursElem) hoursElem.textContent = Math.max(0, hoursLeft.toFixed(1));
    }

    function renderScheduleList() {
        const scheduleList = document.getElementById('homescreenScheduleList');
        if (!scheduleList) return;
        const events = JSON.parse(localStorage.getItem('events')) || [];
        scheduleList.innerHTML = '';
        if (events.length === 0) {
            scheduleList.innerHTML = '<div class="schedule-item"><div class="schedule-task" style="width:100%">No tasks scheduled.</div></div>';
            return;
        }
        events.forEach(event => {
            const item = document.createElement('div');
            item.className = 'schedule-item';
            item.innerHTML = `
                <div class="schedule-time">${event.date} ${event.time_start} - ${event.time_end}</div>
                <div class="schedule-task">${event.title}</div>
            `;
            scheduleList.appendChild(item);
        });
    }

    setInterval(() => {
        updateClockAndStats();
        renderScheduleList();
        updatePointsDisplay();
    }, 1000);

    updateClockAndStats();
    renderScheduleList();
    updatePointsDisplay();
});

function updatePointsDisplay() {
    const points = parseInt(localStorage.getItem('points')) || 0;
    const pointsCount = document.getElementById('pointsCount');
    if (pointsCount) pointsCount.textContent = points;
}

// Initial display and keep in sync every second
updatePointsDisplay();
setInterval(updatePointsDisplay, 1000);

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


