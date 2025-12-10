// ============================================
// PROTEÇÕES ANTI-CLONE - Bloquear cópia/download
// ============================================

// Bloquear clique direito em todo o site
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    return false;
});

// Bloquear seleção de texto
document.addEventListener('selectstart', function (e) {
    e.preventDefault();
    return false;
});

// Bloquear arrastar imagens e elementos
document.addEventListener('dragstart', function (e) {
    e.preventDefault();
    return false;
});

// Bloquear atalhos de teclado (Ctrl+S, Ctrl+C, Ctrl+U, Ctrl+Shift+I, F12)
document.addEventListener('keydown', function (e) {
    // Ctrl+S (Salvar)
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        return false;
    }
    // Ctrl+C (Copiar)
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        return false;
    }
    // Ctrl+U (Ver código fonte)
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+I (DevTools)
    if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
    }
    // Ctrl+Shift+J (Console)
    if (e.ctrlKey && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        return false;
    }
    // F12 (DevTools)
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }
    // Ctrl+A (Selecionar tudo)
    if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        return false;
    }
    // Ctrl+P (Imprimir)
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        return false;
    }
});

// Bloquear menu de contexto em imagens e vídeos especificamente
document.querySelectorAll('img, video').forEach(function (el) {
    el.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
    });
});

// Bloquear download de vídeos (remover controles de download)
document.querySelectorAll('video').forEach(function (video) {
    video.setAttribute('controlsList', 'nodownload noplaybackrate');
    video.setAttribute('disablePictureInPicture', 'true');
    video.setAttribute('oncontextmenu', 'return false;');
});

// Detectar DevTools aberto
(function () {
    const devtools = {
        isOpen: false,
        orientation: undefined
    };

    const threshold = 160;

    const emitEvent = (isOpen, orientation) => {
        globalThis.dispatchEvent(new globalThis.CustomEvent('devtoolschange', {
            detail: { isOpen, orientation }
        }));
    };

    setInterval(() => {
        const widthThreshold = globalThis.outerWidth - globalThis.innerWidth > threshold;
        const heightThreshold = globalThis.outerHeight - globalThis.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';

        if (
            !(heightThreshold && widthThreshold) &&
            ((globalThis.Firebug && globalThis.Firebug.chrome && globalThis.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
        ) {
            if (!devtools.isOpen || devtools.orientation !== orientation) {
                emitEvent(true, orientation);
            }
            devtools.isOpen = true;
            devtools.orientation = orientation;
        } else {
            if (devtools.isOpen) {
                emitEvent(false, undefined);
            }
            devtools.isOpen = false;
            devtools.orientation = undefined;
        }
    }, 500);
})();

// Quando DevTools abrir, redirecionar ou mostrar aviso
window.addEventListener('devtoolschange', function (e) {
    if (e.detail.isOpen) {
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#e50914;font-size:24px;text-align:center;font-family:sans-serif;"><div>⛔ Acesso não autorizado<br><br>Ferramentas de desenvolvedor detectadas.<br>Por favor, feche-as para continuar.</div></div>';
    }
});

// ============================================
// FIM DAS PROTEÇÕES ANTI-CLONE
// ============================================

// Swiper initialization - Netflix Style com animação visível
const swiper = new Swiper('.swiper', {
    loop: true,
    effect: 'slide',
    speed: 600,
    autoplay: {
        delay: 8000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        slideChange: function () {
            // Otimização: pausar vídeos que não estão visíveis
            const videos = document.querySelectorAll('.swiper-slide video');
            videos.forEach((video, index) => {
                if (index === this.realIndex) {
                    video.play().catch(e => console.log('Autoplay blocked'));
                } else {
                    video.pause();
                }
            });
        },
        init: function () {
            // Na inicialização, pausar todos exceto o primeiro
            const videos = document.querySelectorAll('.swiper-slide video');
            videos.forEach((video, index) => {
                if (index !== 0) {
                    video.pause();
                } else {
                    // Tocar o primeiro vídeo
                    video.play().catch(e => console.log('Autoplay blocked by browser'));
                }
            });
        }
    }
});

// Scroll event for top bar
const topBar = document.getElementById('topBar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        topBar.classList.add('show');
    } else {
        topBar.classList.remove('show');
    }
});

// Video controls with FontAwesome icons
const videoPlayers = document.querySelectorAll('.video-player');
const playPauseButtons = document.querySelectorAll('.btnPlayPause');
const muteUnmuteButtons = document.querySelectorAll('.btnMuteUnmute');

videoPlayers.forEach((video, index) => {
    if (playPauseButtons[index]) {
        playPauseButtons[index].addEventListener('click', () => {
            if (video.paused) {
                video.play();
                playPauseButtons[index].innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseButtons[index].innerHTML = '<i class="fas fa-play"></i>';
            }
        });
    }

    if (muteUnmuteButtons[index]) {
        muteUnmuteButtons[index].addEventListener('click', () => {
            video.muted = !video.muted;
            muteUnmuteButtons[index].innerHTML = video.muted
                ? '<i class="fas fa-volume-mute"></i>'
                : '<i class="fas fa-volume-up"></i>';
        });
    }
});

function openPopup(url) {
    window.location.href = url;
}

// Função para atualizar a rotação dos indicadores
function updateIndicatorsRoleta(activeIndex) {
    const indicators = document.querySelectorAll('.indicator');
    const visibleRange = 2; // Quantidade de itens visíveis para cada lado do ativo
    const totalIndicators = indicators.length;

    indicators.forEach((indicator, index) => {
        const relativeIndex = (index - activeIndex + totalIndicators) % totalIndicators;

        if (relativeIndex <= visibleRange || relativeIndex >= totalIndicators - visibleRange) {
            indicator.classList.remove('hidden');
            indicator.style.order = relativeIndex <= visibleRange ? relativeIndex : totalIndicators + relativeIndex;
        } else {
            indicator.classList.add('hidden');
        }

        // Ajuste de escala para o indicador ativo
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

function updateIndicators(activeIndex, totalItems, visibleCount = 5) {
    const indicators = document.querySelectorAll('.indicator');
    const halfVisible = Math.floor(visibleCount / 2);

    indicators.forEach((indicator, index) => {
        const offset = (index - activeIndex + totalItems) % totalItems;

        if (offset <= halfVisible || offset >= totalItems - halfVisible) {
            indicator.classList.remove('hidden');

            // Ajustar posição para dar efeito de centralização
            const relativePosition = offset <= halfVisible ? offset : offset - totalItems;
            const scale = relativePosition === 0 ? 1.2 : 1 - Math.abs(relativePosition) * 0.2;

            indicator.style.transform = `translateX(${relativePosition * 20}px) scale(${scale})`;
            indicator.style.opacity = 1 - Math.abs(relativePosition) * 0.2;

            if (relativePosition === 0) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        } else {
            indicator.classList.add('hidden');
        }
    });
}

function updateIndicators(activeIndex, totalItems, visibleCount = 5) {
    const indicators = document.querySelectorAll('.indicator');
    const halfVisible = Math.floor(visibleCount / 2);

    indicators.forEach((indicator, index) => {
        const offset = (index - activeIndex + totalItems) % totalItems;

        // Recalcular para que o indicador ativo fique no centro
        const relativePosition = offset <= halfVisible ? offset : offset - totalItems;
        const scale = relativePosition === 0 ? 1.2 : 1 - Math.abs(relativePosition) * 0.2;

        // Aplicar transformações e opacidade para simular a roleta
        indicator.style.transform = `translateX(${relativePosition * 20}px) scale(${scale})`;
        indicator.style.opacity = relativePosition >= -halfVisible && relativePosition <= halfVisible ? 1 - Math.abs(relativePosition) * 0.2 : 0;

        // Ajustar classes
        if (relativePosition === 0) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Inicializar indicadores
if (swiper) {
    const totalIndicators = document.querySelectorAll('.indicator').length;

    // Atualizar indicadores ao mudar slide
    swiper.on('slideChange', function () {
        updateIndicators(swiper.realIndex, totalIndicators);
    });

    // Configuração inicial
    updateIndicators(swiper.realIndex, totalIndicators);
}

// Permitir clique nos indicadores
document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        swiper.slideTo(index);
    });
});

// Swiper já configurado no início com efeito fade

// Seleciona o título
const title = document.querySelector('.carousel-title');

// Função para monitorar o scroll
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY; // Posição do scroll
    const scrollLimit = 150; // Ponto em que o título muda de posição

    // Se o scroll for maior que o limite, adiciona a classe 'scrolled'
    if (scrollY > scrollLimit) {
        title.classList.add('scrolled');
    } else {
        title.classList.remove('scrolled');
    }
});



const carousel = document.querySelector('.slider');
const slideCards = document.querySelectorAll('.slide-card');
const prevBtn = document.getElementById('prev-button');
const nextBtn = document.getElementById('next-button');
let currentIndex = 0;

function toggleNavButtons() {
    const totalSlides = slideCards.length;
    const containerWidth = document.querySelector('.carousel-wrapper').offsetWidth;
    const slideWidth = slideCards[0].offsetWidth + 20;
    const visibleSlides = Math.floor(containerWidth / slideWidth);

    if (totalSlides > visibleSlides) {
        document.querySelector('.nav-buttons').style.display = 'flex';
    } else {
        document.querySelector('.nav-buttons').style.display = 'none';
    }
}

function updateSlider() {
    const offset = -currentIndex * (slideCards[0].offsetWidth + 20);
    carousel.style.transform = `translateX(${offset}px)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : slideCards.length - 1;
    updateSlider();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < slideCards.length - 1) ? currentIndex + 1 : 0;
    updateSlider();
});

window.addEventListener('load', toggleNavButtons);
window.addEventListener('resize', toggleNavButtons);

window.addEventListener("load", () => {
    const loader = document.querySelector(".background-fade");
    const logoContainer = document.querySelector(".logo-container");

    // Verifica se o loader já foi exibido nesta sessão
    if (sessionStorage.getItem("loaderShown")) {
        // Se o loader já foi exibido nesta sessão, oculta-o imediatamente
        loader.style.display = "none";
        logoContainer.style.display = "none";
    } else {
        // Caso contrário, exibe o loader e salva o estado no sessionStorage
        setTimeout(() => {
            loader.style.display = "none";
            logoContainer.style.display = "none";
            sessionStorage.setItem("loaderShown", "true");
        }, 5000); // Tempo que o loader ficará visível (5 segundos)
    }
});

/* Payment Modal Logic */
const paymentModal = document.getElementById('paymentModal');
const modalItemName = document.getElementById('modalItemName');
const modalPrice = document.getElementById('modalPrice');
let currentItem = null;
let currentPrice = null;

function openPaymentModal(item, price, event) {
    if (event) event.stopPropagation(); // Prevent card click
    currentItem = item;
    currentPrice = price;
    modalItemName.textContent = item;
    modalPrice.textContent = '$' + price;
    paymentModal.style.display = 'flex';
}

function closePaymentModal() {
    paymentModal.style.display = 'none';
}

// Close on outside click
window.onclick = function (event) {
    if (event.target == paymentModal) {
        closePaymentModal();
    }
}

/* API Checkout Logic */
// PayPal Integration
function initiatePayPal() {
    const apiKey = "rbz_4796cf3a0a295a4857cc6f5c04d12751";

    const btn = document.querySelector('.btn-paypal');
    const originalText = btn.innerHTML;

    // Prevent double binding if user clicks fast
    if (btn.disabled) return;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    setTimeout(() => {
        // Here we use the API Key 'rbz_...' as requested.
        // In a real scenario, this would POST to a backend or redirect to a payment gateway.
        console.log(`Connect to API ${apiKey} for Item: ${currentItem} Price: ${currentPrice}`);
        alert(`Redirecionando para PayPal/Card Gateway...\n\nItem: ${currentItem}\nPreço: $${currentPrice}\nAPI Key: ${apiKey}\n\n(Simulação de Checkout Seguro)`);

        btn.innerHTML = originalText;
        btn.disabled = false;
        closePaymentModal();
    }, 1500);
}

// Binance Integration
function initiateBinance() {
    const btn = document.querySelector('.btn-binance');
    const originalText = btn.innerHTML;

    if (btn.disabled) return;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando...';
    btn.disabled = true;

    setTimeout(() => {
        alert(`Pagamento via Binance:\n\nPara o item "${currentItem}" ($${currentPrice}).\n\nPor favor envie o pagamento para a carteira oficial e envie o comprovante.`);

        btn.innerHTML = originalText;
        btn.disabled = false;
        closePaymentModal();
    }, 1500);
}

// Dynamic Title Logic
const originalTitle = 'NetflixHub';
const bestsellersTitle = 'NetflixHub - Top Teens: Best sellers+';

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.title = bestsellersTitle;
        } else {
            document.title = originalTitle;
        }
    });
}, { threshold: 0.1 });

const bestsellersSection = document.getElementById('bestsellers');
if (bestsellersSection) {
    titleObserver.observe(bestsellersSection);
}

