const faqItems = document.querySelectorAll(".faq-item");
// const track = document.querySelector('.logos-track');


/* Menu transparente */


/* =========================================================
   FAQ
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    if (faqItems.length) {
        faqItems.forEach(item => {
            const button = item.querySelector(".faq-question");

            if (!button) return;

            button.addEventListener("click", () => {
                faqItems.forEach(el => {
                    if (el !== item) {
                        el.classList.remove("active");
                    }
                });

                item.classList.toggle("active");
            });
        });
    }
});


/* =========================================================
   LOGOS
   Pausa la animación al pasar el mouse
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".logos-track");

    if (!track) return;

    track.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
    });

    track.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
    });
});


/* =========================================================
   CONTADOR
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".span-num");
    const metaSection = document.querySelector(".meta");

    if (!counters.length || !metaSection) return;

    const speed = 1000;

    const formatNumber = (num) => {
        return num.toLocaleString("es-AR");
    };

    const animateCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        let current = 0;

        let increment;

        if (target > 1000000) {
            increment = Math.ceil(target / 120);
        } else {
            increment = Math.ceil(target / speed);
        }

        const updateCounter = () => {
            current += increment;

            if (current >= target) {
                counter.innerText = formatNumber(target);
            } else {
                counter.innerText = formatNumber(current);
                requestAnimationFrame(updateCounter);
            }
        };

        updateCounter();
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => animateCounter(counter));
                obs.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(metaSection);
});


/* =========================================================
   MENU MOBILE
   Cierra el menú y navega correctamente
   a la sección en celular real
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const menuCheckbox = document.getElementById("menu");
    const navLinks = document.querySelectorAll(".menu .navbar a[href^='#']");
    const menuBar = document.querySelector(".menu");

    if (!menuCheckbox || !navLinks.length || !menuBar) return;

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            menuCheckbox.checked = false;

            setTimeout(() => {
                const menuHeight = menuBar.offsetHeight;
                const targetTop = target.getBoundingClientRect().top + window.pageYOffset - menuHeight;

                window.scrollTo({
                    top: targetTop,
                    behavior: "smooth"
                });
            }, 180);
        });
    });
});


/* =========================================================
   OPINIONES / RESEÑAS
   Mejorado para desktop + touch real en celular
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const reviewTrack = document.querySelector(".reseñas");
    const cards = document.querySelectorAll(".op-container");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");

    if (!reviewTrack || !cards.length || !nextBtn || !prevBtn) return;

    let index = 0;
    let visibleCards = 3;
    let isDragging = false;
    let startX = 0;

    function updateVisibleCards() {
        if (window.innerWidth <= 600) {
            visibleCards = 1;
        } else if (window.innerWidth <= 1024) {
            visibleCards = 2;
        } else {
            visibleCards = 3;
        }
    }

    function getGap() {
        return parseFloat(getComputedStyle(reviewTrack).gap) || 30;
    }

    function moveCarousel() {
        const cardWidth = cards[0].getBoundingClientRect().width + getGap();
        reviewTrack.style.transform = `translate3d(-${index * cardWidth}px, 0, 0)`;
    }

    function goNext(e) {
        if (e) e.preventDefault();

        if (index < cards.length - visibleCards) {
            index++;
        } else {
            index = 0;
        }

        reviewTrack.style.transition = "transform 0.4s ease";
        moveCarousel();
    }

    function goPrev(e) {
        if (e) e.preventDefault();

        if (index > 0) {
            index--;
        } else {
            index = cards.length - visibleCards;
        }

        reviewTrack.style.transition = "transform 0.4s ease";
        moveCarousel();
    }

    nextBtn.addEventListener("click", goNext);
    prevBtn.addEventListener("click", goPrev);

    nextBtn.addEventListener("touchstart", goNext, { passive: false });
    prevBtn.addEventListener("touchstart", goPrev, { passive: false });

    window.addEventListener("resize", () => {
        updateVisibleCards();

        if (index > cards.length - visibleCards) {
            index = Math.max(0, cards.length - visibleCards);
        }

        moveCarousel();
    });

    updateVisibleCards();
    moveCarousel();

    reviewTrack.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.pageX;
        reviewTrack.style.transition = "none";
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging) return;
        isDragging = false;
        reviewTrack.style.transition = "transform 0.4s ease";
        moveCarousel();
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const move = e.pageX - startX;
        const cardWidth = cards[0].getBoundingClientRect().width + getGap();
        reviewTrack.style.transform = `translate3d(${-index * cardWidth + move}px, 0, 0)`;
    });

    reviewTrack.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        reviewTrack.style.transition = "none";
    }, { passive: true });

    reviewTrack.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const move = e.touches[0].clientX - startX;
        const cardWidth = cards[0].getBoundingClientRect().width + getGap();
        reviewTrack.style.transform = `translate3d(${-index * cardWidth + move}px, 0, 0)`;
    }, { passive: true });

    reviewTrack.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (diff < -50 && index < cards.length - visibleCards) {
            index++;
        } else if (diff > 50 && index > 0) {
            index--;
        }

        reviewTrack.style.transition = "transform 0.4s ease";
        moveCarousel();
    });
});


/* =========================================================
   COBERTURAS VIEJO, ESE SE ACTIVA CON HOVER PERO NO FUNCIONA BIEN EN CELULAR
========================================================= */
// document.addEventListener("DOMContentLoaded", () => {
//     const grid = document.getElementById("coberturasGrid");
//     if (!grid) return;

//     const cards = Array.from(grid.querySelectorAll(".card"));
//     if (!cards.length) return;

//     let activeId = null;

//     const applyState = () => {
//         cards.forEach((c) => {
//             const id = c.dataset.id;
//             const isActive = activeId === id;
//             const isDim = activeId !== null && !isActive;

//             c.classList.toggle("is-active", isActive);
//             c.classList.toggle("is-dim", isDim);
//         });
//     };

//     const setActive = (id) => {
//         activeId = id;
//         applyState();
//     };

//     const clearActive = () => {
//         activeId = null;
//         applyState();
//     };

//     cards.forEach((card) => {
//         card.addEventListener("mouseenter", () => setActive(card.dataset.id));
//         card.addEventListener("focusin", () => setActive(card.dataset.id));
//     });

//     grid.addEventListener("mouseleave", clearActive);
//     grid.addEventListener("focusout", (e) => {
//         if (!grid.contains(e.relatedTarget)) clearActive();
//     });

//     cards.forEach((card) => {
//         card.addEventListener("click", (e) => {
//             const isBtn = e.target.closest(".card__btn");
//             if (isBtn) return;

//             const id = card.dataset.id;
//             activeId = activeId === id ? null : id;
//             applyState();
//         });
//     });

//     document.addEventListener("click", (e) => {
//         if (!grid.contains(e.target)) clearActive();
//     });

//     applyState();
// });

/* =========================================================
   COBERTURAS - FIX MOBILE (1 solo tap)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("coberturasGrid");
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll(".card"));
    if (!cards.length) return;

    let activeId = null;

    const applyState = () => {
        cards.forEach((c) => {
            const id = c.dataset.id;
            const isActive = activeId === id;
            const isDim = activeId !== null && !isActive;

            c.classList.toggle("is-active", isActive);
            c.classList.toggle("is-dim", isDim);
        });
    };

    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            const isBtn = e.target.closest(".card__btn");
            if (isBtn) return;

            const id = card.dataset.id;

            // toggle con un solo tap
            activeId = activeId === id ? null : id;

            applyState();
        });
    });

    // tap afuera cierra
    document.addEventListener("click", (e) => {
        if (!grid.contains(e.target)) {
            activeId = null;
            applyState();
        }
    });

    applyState();
});


/* =========================================
   MENU COBERTURAS SEGÚN DISPOSITIVO
========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const coberturasLink = document.querySelector(".menu-coberturas-link");
    const menuCheckbox = document.getElementById("menu");
    const menuBar = document.querySelector(".menu");

    if (!coberturasLink) return;

    coberturasLink.addEventListener("click", (e) => {
        e.preventDefault();

        // breakpoint celular
        const isMobile = window.innerWidth <= 768;

        const target = isMobile
            ? document.getElementById("coberturas-2")
            : document.getElementById("coberturas");

        if (!target) return;

        // cerrar menú si existe
        if (menuCheckbox) {
            menuCheckbox.checked = false;
        }

        setTimeout(() => {
            const menuHeight = menuBar ? menuBar.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - menuHeight;

            window.scrollTo({
                top: targetTop,
                behavior: "smooth"
            });
        }, 180);
    });
});


/* BOTON PARA MÁS INFORMACIÓN */
document.addEventListener("DOMContentLoaded", () => {
    const infoBlocks = document.querySelectorAll(".integrante-info");

    infoBlocks.forEach((info) => {
        const btn = info.querySelector(".mobile-more-btn");
        if (!btn) return;

        btn.addEventListener("click", () => {
            const isOpen = info.classList.contains("is-open");

            if (isOpen) {
                info.classList.remove("is-open");
                btn.textContent = "Más info";
            } else {
                info.classList.add("is-open");
                btn.textContent = "Ver menos";
            }
        });
    });
});