document.addEventListener("DOMContentLoaded", () => {
    const items = document.querySelectorAll("li");
    const video = document.getElementById("main_video");
    const jumpToCarouselTab = document.getElementById("junp_to_carousel_tab");
    const backToMainTab = document.getElementById("carousel_li_toolbar_up");
    const pausePlayBtn = document.getElementById("pausePlayBtn");

    let currentIndex = 0;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.scrollIntoView({ behavior: "smooth", block: "start" });
                    if (!video.paused) {
                        video.pause();
                        pausePlayBtn.classList.remove("fa-pause");
                        pausePlayBtn.classList.add("fa-play");
                        pausePlayBtn.classList.remove("active");
                    }
                }
            });
        },
        { threshold: 0.15 }
    );

    items.forEach((item) => observer.observe(item));

    jumpToCarouselTab.addEventListener("click", () => {
        if (!video.paused) {
            video.pause();
            pausePlayBtn.classList.remove("fa-pause");
            pausePlayBtn.classList.add("fa-play");
            pausePlayBtn.classList.remove("active");
        }

        currentIndex += 1;

        if (currentIndex >= items.length) {
            currentIndex = 0;
        }

        items[currentIndex].scrollIntoView({ behavior: "smooth", block: "center" });
    });

    backToMainTab.addEventListener("click", () => {
        currentIndex = 0; // Volta ao primeiro item
        items[currentIndex].scrollIntoView({ behavior: "smooth", block: "center" });

        // Retoma o vídeo (opcional)
        if (video.paused) {
            video.play();
            pausePlayBtn.classList.remove("fa-play");
            pausePlayBtn.classList.add("fa-pause");
            pausePlayBtn.classList.add("active");
        }
    });
});
