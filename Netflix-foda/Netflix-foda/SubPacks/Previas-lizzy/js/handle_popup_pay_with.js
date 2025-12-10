const pay_this_pack = document.querySelectorAll('.pay_this_pack');
const popupOverlay = document.getElementById('popupOverlay');
const closePopupButton = document.getElementById('closePopup');
const popupContent = document.querySelector('.popup-content'); 
pay_this_pack.forEach((e) => {
    e.addEventListener('click', () => {
        popupOverlay.classList.add('visible');
    });
});

closePopupButton.addEventListener('click', () => {
    popupOverlay.classList.remove('visible');
});


popupOverlay.addEventListener('click', (event) => {
    if (!popupContent.contains(event.target)) {
        popupOverlay.classList.remove('visible');
    }
});

function redirectTo(url) {
    window.location.href = url;
}
