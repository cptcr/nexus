document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);

        card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.1), transparent 70%)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.background = '';
    });
});