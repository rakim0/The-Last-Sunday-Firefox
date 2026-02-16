// Default Configuration
const DEFAULT_NAME = "Rakim";
const DEFAULT_BIRTH_DATE = new Date(2004, 3, 2); // March 2, 2004
const DEFAULT_LIFE_EXPECTANCY = 50; // years
const DEFAULT_INSPIRATION_LINK = "https://youtu.be/BOksW_NabEk";

// Load settings from localStorage or use defaults
function loadSettings() {
    const saved = localStorage.getItem("lastSundaySettings");
    if (saved) {
        const settings = JSON.parse(saved);
        return {
            name: settings.name,
            birthDate: new Date(settings.birthDate),
            lifeExpectancy: settings.lifeExpectancy,
            inspirationLink: settings.inspirationLink || DEFAULT_INSPIRATION_LINK,
        };
    }
    return {
        name: DEFAULT_NAME,
        birthDate: DEFAULT_BIRTH_DATE,
        lifeExpectancy: DEFAULT_LIFE_EXPECTANCY,
        inspirationLink: DEFAULT_INSPIRATION_LINK,
    };
}

// Save settings to localStorage
function saveSettings(settings) {
    localStorage.setItem(
        "lastSundaySettings",
        JSON.stringify({
            name: settings.name,
            birthDate: settings.birthDate.toISOString(),
            lifeExpectancy: settings.lifeExpectancy,
            inspirationLink: settings.inspirationLink,
        })
    );
}

// Get current settings
let settings = loadSettings();
let NAME = settings.name;
let BIRTH_DATE = settings.birthDate;
let LIFE_EXPECTANCY = settings.lifeExpectancy;
let END_YEAR = BIRTH_DATE.getFullYear() + LIFE_EXPECTANCY;

// Calculate remaining Sundays
function calculateRemainingSundays() {
    const today = new Date();
    const endDate = new Date(END_YEAR, 11, 31);

    let count = 0;
    let current = new Date(today);

    // Move to next Sunday if not already Sunday
    while (current.getDay() !== 0) {
        current.setDate(current.getDate() + 1);
    }

    // Count all Sundays from next Sunday to end date
    while (current <= endDate) {
        count++;
        current.setDate(current.getDate() + 7);
    }

    return count;
}

// Get all Sundays for a specific year
function getSundaysInYear(year) {
    const sundays = [];
    const date = new Date(year, 0, 1);

    // Find first Sunday of the year
    while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
    }

    // Get all Sundays in the year
    while (date.getFullYear() === year) {
        sundays.push(new Date(date));
        date.setDate(date.getDate() + 7);
    }

    return sundays;
}

// Check if a date is in the past
function isPast(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
}

// Generate the calendar
function generateCalendar() {
    const calendarGrid = document.getElementById("calendar-grid");
    const startYear = BIRTH_DATE.getFullYear();
    const today = new Date();

    for (let year = startYear; year <= END_YEAR; year++) {
        const yearColumn = document.createElement("div");
        yearColumn.className = "year-column";

        // Year label
        const yearLabel = document.createElement("div");
        yearLabel.className = "year-label";
        yearLabel.textContent = year;
        yearColumn.appendChild(yearLabel);

        // Get all Sundays for this year
        const sundays = getSundaysInYear(year);

        // Create a 3-column grid for weeks
        const weeksGrid = document.createElement("div");
        weeksGrid.className = "weeks-grid";

        // Create a box for each Sunday
        sundays.forEach((sunday) => {
            const weekBox = document.createElement("div");
            weekBox.className = "week-box";

            // Color based on past or future
            if (isPast(sunday)) {
                weekBox.classList.add("past");
            } else {
                weekBox.classList.add("future");
            }

            // Add tooltip with date
            weekBox.title = sunday.toLocaleDateString();

            weeksGrid.appendChild(weekBox);
        });

        yearColumn.appendChild(weeksGrid);
        calendarGrid.appendChild(yearColumn);
    }
}

// Update the counter
function updateCounter() {
    const remaining = calculateRemainingSundays();
    document.getElementById("sundays-count").textContent = remaining;

    // Update title as well
    const title = document.querySelector(".title");
    title.innerHTML = `${NAME}, only <span id="sundays-count">${remaining}</span> Sundays remain`;
}
// Update the page title
function updatePageTitle() {
    const remaining = calculateRemainingSundays();
    const titleElement = document.getElementById("title-edit");
    if (titleElement) {
        titleElement.textContent = `${NAME}, only ${remaining} Sundays remain`;
    }
}

// Handle settings link
document.getElementById("change-link").addEventListener("click", (e) => {
    e.preventDefault();
    openSettingsModal();
});

// Modal functionality
function openSettingsModal() {
    const modal = document.getElementById("settings-modal");
    const nameInput = document.getElementById("name-input");
    const birthDateInput = document.getElementById("birth-date-input");
    const lifeExpectancyInput = document.getElementById("life-expectancy-input");
    const inspirationInput = document.getElementById("inspiration-input");

    // Populate current values
    nameInput.value = NAME;
    birthDateInput.value = BIRTH_DATE.toISOString().split("T")[0];
    lifeExpectancyInput.value = LIFE_EXPECTANCY;
    inspirationInput.value = settings.inspirationLink;

    modal.style.display = "flex";
    modal.classList.add("show");
}

function closeSettingsModal() {
    const modal = document.getElementById("settings-modal");
    modal.style.display = "none";
    modal.classList.remove("show");
}

// Close modal handlers
document.querySelector(".close-btn").addEventListener("click", closeSettingsModal);
document.querySelector(".cancel-btn").addEventListener("click", closeSettingsModal);

// Close modal when clicking outside
document.getElementById("settings-modal").addEventListener("click", (e) => {
    if (e.target.id === "settings-modal") {
        closeSettingsModal();
    }
});

// Handle form submission
document.getElementById("settings-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name-input");
    const birthDateInput = document.getElementById("birth-date-input");
    const lifeExpectancyInput = document.getElementById("life-expectancy-input");
    const inspirationInput = document.getElementById("inspiration-input");

    // Update global variables
    NAME = nameInput.value;
    BIRTH_DATE = new Date(birthDateInput.value);
    LIFE_EXPECTANCY = parseInt(lifeExpectancyInput.value);
    END_YEAR = BIRTH_DATE.getFullYear() + LIFE_EXPECTANCY;

    // Update settings object
    settings = {
        name: NAME,
        birthDate: BIRTH_DATE,
        lifeExpectancy: LIFE_EXPECTANCY,
        inspirationLink: inspirationInput.value || DEFAULT_INSPIRATION_LINK,
    };

    // Save to localStorage
    saveSettings(settings);

    // Update inspiration link
    const inspireLink = document.querySelector('.links a[target="_blank"]');
    if (inspireLink) {
        inspireLink.href = settings.inspirationLink;
    }

    // Regenerate calendar and update counter
    document.getElementById("calendar-grid").innerHTML = "";
    generateCalendar();
    updateCounter();
    updateQuestion();

    closeSettingsModal();
});

// Update the question text
function updateQuestion() {
    const question = document.querySelector(".question");
    if (question) {
        question.textContent = `How are you going to spend these weeks ${NAME}?`;
    }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    // Update inspiration link from settings
    const inspireLink = document.querySelector('.links a[target="_blank"]');
    if (inspireLink) {
        inspireLink.href = settings.inspirationLink;
    }

    updateCounter();
    generateCalendar();
    updateQuestion();
});
