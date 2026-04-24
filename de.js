
// =========================
// CURSOR SYSTEM
// =========================

const cursor = document.querySelector('.custom-cursor');
const ring = document.querySelector('.custom-cursor-ring');

const invertElements = document.querySelectorAll('h1, p, .button-intro-primary a');

invertElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-invert');
    });

    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-invert');
    });
});

document.addEventListener('mousemove', e => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';

    if (ring) {
        ring.style.top = e.clientY + 'px';
        ring.style.left = e.clientX + 'px';
    }
});


// =========================
// DRAG SYSTEM (MULTI CARD FIXED)
// =========================

const cards = document.querySelectorAll('.card');

let isDragging = false;
let activeCard = null;
let offsetX = 0;
let offsetY = 0;

// Cursor hide on hover (für alle cards)
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        cursor.classList.add('hide');
    });

    card.addEventListener('mouseleave', () => {
        cursor.classList.remove('hide');
    });

    // START DRAG
    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        activeCard = card;

        const parent = card.offsetParent;
        const parentRect = parent.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        offsetX = e.clientX - cardRect.left;
        offsetY = e.clientY - cardRect.top;

        card.style.cursor = 'grabbing';

        // Startposition nur einmal speichern
        if (!card.dataset.startLeft) {
            card.dataset.startLeft = card.offsetLeft;
            card.dataset.startTop = card.offsetTop;
        }
    });
});


// MOVE
document.addEventListener('mousemove', (e) => {
    if (!isDragging || !activeCard) return;

    const parent = activeCard.offsetParent;
    const parentRect = parent.getBoundingClientRect();

    const x = e.clientX - parentRect.left - offsetX;
    const y = e.clientY - parentRect.top - offsetY;

    activeCard.style.left = x + 'px';
    activeCard.style.top = y + 'px';
});


// END DRAG
document.addEventListener('mouseup', () => {
    if (activeCard) {
        activeCard.style.cursor = 'grab';
    }

    isDragging = false;
    activeCard = null;
});


// =========================
// RESET SYSTEM (ALL CARDS)
// =========================

function resetCard(card) {
    card.style.transition = "all 0.6s cubic-bezier(.2,.8,.2,1)";

    card.style.left = card.dataset.startLeft + 'px';
    card.style.top = card.dataset.startTop + 'px';

    setTimeout(() => {
        card.style.transition = "none";
    }, 600);
}

// double click reset für alle cards
cards.forEach(card => {
    card.addEventListener('dblclick', () => {
        resetCard(card);
    });
});