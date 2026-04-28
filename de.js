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
// DRAG + RESET SYSTEM (FIXED)
// =========================

const cards = document.querySelectorAll('.card');

let isDragging = false;
let activeCard = null;
let offsetX = 0;
let offsetY = 0;


// =========================
// 1. START POSITION SPEICHERN (BEIM LOAD)
// =========================
cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    const parentRect = card.offsetParent.getBoundingClientRect();

    card.dataset.startX = rect.left - parentRect.left;
    card.dataset.startY = rect.top - parentRect.top;
});


// =========================
// 2. CURSOR HIDE + DRAG START
// =========================
cards.forEach(card => {

    card.addEventListener('mouseenter', () => {
        cursor.classList.add('hide');
    });

    card.addEventListener('mouseleave', () => {
        cursor.classList.remove('hide');
    });

    card.addEventListener('mousedown', (e) => {
        isDragging = true;
        activeCard = card;

        const rect = card.getBoundingClientRect();

        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        card.style.cursor = 'grabbing';

        card.style.position = 'absolute';
    });
});


// =========================
// 3. MOVE
// =========================
document.addEventListener('mousemove', (e) => {
    if (!isDragging || !activeCard) return;

    const parentRect = activeCard.offsetParent.getBoundingClientRect();

    const x = e.clientX - parentRect.left - offsetX;
    const y = e.clientY - parentRect.top - offsetY;

    activeCard.style.left = x + 'px';
    activeCard.style.top = y + 'px';
});


// =========================
// 4. DRAG END
// =========================
document.addEventListener('mouseup', () => {
    if (activeCard) {
        activeCard.style.cursor = 'grab';
    }

    isDragging = false;
    activeCard = null;
});


// =========================
// 5. RESET (DOUBLE CLICK)
// =========================
function resetCard(card) {
    card.style.transition = "all 0.6s cubic-bezier(.2,.8,.2,1)";

    card.style.left = card.dataset.startX + 'px';
    card.style.top = card.dataset.startY + 'px';

    setTimeout(() => {
        card.style.transition = "none";
    }, 600);
}

cards.forEach(card => {
    card.addEventListener('dblclick', () => {
        resetCard(card);
    });
});

// =========================
// CONTACT FORM - EMAILJS
// =========================
(function() {
    emailjs.init("DQFms6sZiEuxYQiyD");
})();

document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault();

        emailjs.send("service_dl2msqu", "template_w9a9rvq", {
        name: this.name.value,
        email: this.email.value,
        message: this.message.value,
        time: new Date().toLocaleString("de-DE", {
            dateStyle: "short",
            timeStyle: "short"
        })
    })
    .then(() => {
        alert("Die Nachricht wurde erfolgreich gesendet!");
        this.reset();
    })
    .catch((error) => {
        console.log(error);
        alert("Fehler beim Senden.");
    });
});