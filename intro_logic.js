
// Intro Animation Logic
document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('intro-animation');
    if (intro) {
        // Prevent scroll during intro
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            intro.style.display = 'none';
            // Restore scroll
            document.body.style.overflow = 'auto';
        }, 4000); // 4 seconds total duration
    }
});
