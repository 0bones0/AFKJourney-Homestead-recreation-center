// Refactored app.js

// Constants
const BUTTON_SELECTOR = '#myButton';
const INPUT_SELECTOR = '#myInput';

// DOM Caching
const button = document.querySelector(BUTTON_SELECTOR);
const input = document.querySelector(INPUT_SELECTOR);

// Helper Functions
function validateInput(value) {
    return value && value.trim() !== '';
}

function renderTemplate(data) {
    return `<div>${data}</div>`;
}

// State Management
let state = {
    items: [],
};

// Event Delegation
document.addEventListener('click', (event) => {
    if (event.target.matches(BUTTON_SELECTOR)) {
        const inputValue = input.value;
        if (validateInput(inputValue)) {
            state.items.push(inputValue);
            const output = renderTemplate(inputValue);
            document.body.insertAdjacentHTML('beforeend', output);
            input.value = '';
        }
    }
});

// Cleanup to prevent memory leaks
window.addEventListener('beforeunload', () => {
    // Clean up resources if needed
});

// Initialization
function init() {
    // Initial setup code here
}

init();