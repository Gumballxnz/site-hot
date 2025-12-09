document.addEventListener("DOMContentLoaded", () => {
  
    const videoSources = [
       "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304293/SubPacks/Previas-jess/Vid/vid1.mp4",
        "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304296/SubPacks/Previas-jess/Vid/vid2.mp4",
        "https://res.cloudinary.com/dm3glrwax/video/upload/v1765304299/SubPacks/Previas-jess/Vid/vid3.mp4",
    ];

    const carousel = document.querySelector('.carousel');
    carousel.style.width = `${videoSources.length * 100}vw`;

    const indicatorsContainer = document.querySelector('.carousel-indicators');
    let currentIndex = 0;

    videoSources.forEach((src, index) => {
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        const video = document.createElement('video');
        video.src = src;
        video.muted = true;

        const controls = document.createElement('div');
        controls.classList.add('video-controls');

// Criação do botão Play/Pause com ícones Font Awesome
const playPauseButton = document.createElement('button');
playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Ícone inicial de play
playPauseButton.classList.add("btnPlayOrMuteCarousel");

// Criação do botão Mute/Unmute com ícones Font Awesome
const muteUnmuteButton = document.createElement('button');
muteUnmuteButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Ícone inicial de mute
muteUnmuteButton.classList.add("btnPlayOrMuteCarousel");

        const timeline = document.createElement('input');
        timeline.type = 'range';
        timeline.min = 0;
        timeline.max = 100;
        timeline.value = 0;

        controls.append(playPauseButton, muteUnmuteButton, timeline);
        carouselItem.append(video, controls);
        carousel.appendChild(carouselItem);

        const indicator = document.createElement('span');
        indicator.classList.add('indicator');
        indicator.dataset.index = index;
        indicatorsContainer.appendChild(indicator);

        playPauseButton.addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseButton.textContent = '⏸';
                playPauseButton.classList.add('active-control');
            } else {
                video.pause();
                playPauseButton.textContent = '⏯';
                playPauseButton.classList.remove('active-control');
            }
        });

        // Alterando o ícone ao mutar/desmutar o vídeo
muteUnmuteButton.addEventListener('click', () => {
    video.muted = !video.muted;
    const iconClass = video.muted ? 'fa-volume-mute' : 'fa-volume-up';
    muteUnmuteButton.innerHTML = `<i class="fas ${iconClass}"></i>`;
    muteUnmuteButton.classList.toggle('active-control', !video.muted);
});

        video.addEventListener('timeupdate', () => {
            timeline.value = (video.currentTime / video.duration) * 100 || 0;
        });

        timeline.addEventListener('input', (e) => {
            video.currentTime = (e.target.value / 100) * video.duration;
        });
    });

    const indicators = document.querySelectorAll('.indicator');
    const nextButton = document.querySelector('.next');
    const prevButton = document.querySelector('.prev');

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % videoSources.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + videoSources.length) % videoSources.length;
        updateCarousel();
    });

    indicators.forEach((indicator) => {
        indicator.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.dataset.index, 10);
            updateCarousel();
        });
    });

    updateCarousel();
});