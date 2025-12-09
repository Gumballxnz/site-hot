document.addEventListener("DOMContentLoaded", async () => { 
    const video = document.getElementById("main_video");
    const pausePlayBtn = document.getElementById("pausePlayBtn");
    const muteUnmuteBtn = document.getElementById("muteUnmuteBtn");

    const videoSources = [
        "https://res.cloudinary.com/dm3glrwax/video/upload/v1765283190/Netflix-foda/SubPacks/Previas-incest/Vid/2.mp4",
      
    ];
    let currentVideoIndex = 0;

    const loadVideo = async (index) => {
        currentVideoIndex = index >= videoSources.length ? 0 : index;
        video.classList.add("fade-out");

        await new Promise(resolve => setTimeout(resolve, 100));

        video.src = videoSources[currentVideoIndex];
        video.load();
        video.play();
        video.classList.remove("fade-out");
        video.classList.add("fade-in");
    };

    video.addEventListener("ended", async () => {
        await loadVideo(currentVideoIndex + 1);
    });

    pausePlayBtn.addEventListener("click", () => {
        if (video.paused) {
            video.play();
            pausePlayBtn.classList.remove("fa-play");
            pausePlayBtn.classList.add("fa-pause");
            pausePlayBtn.classList.add("active");
        } else {
            video.pause();
            pausePlayBtn.classList.remove("fa-pause");
            pausePlayBtn.classList.add("fa-play");
            pausePlayBtn.classList.remove("active");
        }
    });

    muteUnmuteBtn.addEventListener("click", () => {
        if (video.muted) {
            video.muted = false;
            muteUnmuteBtn.classList.remove("fa-volume-mute");
            muteUnmuteBtn.classList.add("fa-volume-up");
            muteUnmuteBtn.classList.add("active");
        } else {
            video.muted = true;
            muteUnmuteBtn.classList.remove("fa-volume-up");
            muteUnmuteBtn.classList.add("fa-volume-mute");
            muteUnmuteBtn.classList.remove("active");
        }
    });

    await loadVideo(0);  
});
