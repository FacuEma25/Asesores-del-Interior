const faqItems = document.querySelectorAll(".faq-item");
const track = document.querySelector('.logos-track');



/*FAQ*/


faqItems.forEach(item => {
    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        // Cierra otros abiertos
        faqItems.forEach(el => {
            if (el !== item) {
                el.classList.remove("active");
            }
        });

        // Toggle actual
        item.classList.toggle("active");
    });
});

/*LOGOS*/
track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
});

track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
});

/* CONTADOR */
document.addEventListener("DOMContentLoaded", () => {

    const counters = document.querySelectorAll(".span-num");
    const speed = 1000; // menor = más rápido

    const formatNumber = (num) => {
        return num.toLocaleString("es-AR");
    };

    const animateCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        let current = 0;

        // Para números grandes que salte más rápido
        let increment;

        if (target > 1000000) {
            increment = Math.ceil(target / 120); // 50 pasos aprox
        } else {
            increment = Math.ceil(target / speed);
        }

        const updateCounter = () => {
            current += increment;

            if (current >= target) {
                counter.innerText = formatNumber(target);
                if (counter.innerText && counter.innerText !== formatNumber(target)) {
                    counter.innerText = formatNumber(target);
                }
            } else {
                counter.innerText = formatNumber(current);
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    };

    // Intersection Observer (se activa al entrar en pantalla)
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                obs.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.querySelector(".meta"));

});

/* FIN CONTADOR */

/* OPINIONES */
document.addEventListener("DOMContentLoaded", () => {

    const track = document.querySelector(".reseñas");
    const cards = document.querySelectorAll(".op-container");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    let index = 0;
    let visibleCards = 3;

    function updateVisibleCards() {
        if (window.innerWidth <= 600) {
            visibleCards = 1;
        } else if (window.innerWidth <= 1024) {
            visibleCards = 2;
        } else {
            visibleCards = 3;
        }
    }

    function moveCarousel() {
        const cardWidth = cards[0].offsetWidth + 30; // 30 = gap
        track.style.transform = `translateX(-${index * cardWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {
        if (index < cards.length - visibleCards) {
            index++;
        } else {
            index = 0; // vuelve al inicio
        }
        moveCarousel();
    });

    prevBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
        } else {
            index = cards.length - visibleCards; // va al final
        }
        moveCarousel();
    });

    window.addEventListener("resize", () => {
        updateVisibleCards();
        moveCarousel();
    });

    updateVisibleCards();

    /* ===== DRAG / SWIPE ===== */

    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;

    track.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX;
        track.style.transition = "none";
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        track.style.transition = "transform 0.4s ease";
        moveCarousel();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const move = e.pageX - startX;
        track.style.transform = `translateX(${-index * (cards[0].offsetWidth + 30) + move}px)`;
    });

    /* Touch */

    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const move = e.touches[0].clientX - startX;
        track.style.transform = `translateX(${-index * (cards[0].offsetWidth + 30) + move}px)`;
    });

    track.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (diff < -50 && index < cards.length - visibleCards) {
            index++;
        }

        if (diff > 50 && index > 0) {
            index--;
        }

        track.style.transition = "transform 0.4s ease";
        moveCarousel();
    });

});

/* FIN OPINIONES */