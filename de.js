const cursor = document.querySelector('.custom-cursor');
const ring = document.querySelector('.custom-cursor-ring');

// Elemente, bei denen der Cursor weiß werden soll
const invertElements = document.querySelectorAll('h1, p, .button-intro-primary a');

invertElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-invert');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-invert');
    });
});

// Cursor-Bewegung
document.addEventListener('mousemove', e => {
    cursor.style.top = e.clientY + 'px';
    cursor.style.left = e.clientX + 'px';

    ring.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
});