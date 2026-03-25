document.addEventListener('DOMContentLoaded', () => {

    // ==================== SPLASH SCREEN ====================
    const splashScreen = document.getElementById('splashScreen');
    const splashVideo = document.getElementById('splashVideo');
    const splashMusicBtn = document.getElementById('splashMusicBtn');
    const splashStartBtn = document.getElementById('splashStartBtn');
    const mainSite = document.getElementById('mainSite');

    // Music toggle button — plays background MP3
    const splashAudio = document.getElementById('splashAudio');
    let musicPlaying = false;

    if (splashMusicBtn && splashAudio) {
        splashAudio.volume = 0.5;
        splashMusicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const iconMuted = splashMusicBtn.querySelector('.icon-muted');
            const iconPlaying = splashMusicBtn.querySelector('.icon-playing');
            if (musicPlaying) {
                splashAudio.pause();
                musicPlaying = false;
                iconMuted.style.display = '';
                iconPlaying.style.display = 'none';
            } else {
                splashAudio.play();
                musicPlaying = true;
                iconMuted.style.display = 'none';
                iconPlaying.style.display = '';
            }
        });
    }

    // PRESS START button — enter site
    if (splashStartBtn) {
        splashStartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            splashScreen.classList.add('hidden');
            mainSite.style.display = '';
            setTimeout(() => {
                splashScreen.style.display = 'none';
                if (splashVideo) splashVideo.pause();
            }, 900);
        });
    }

    // ==================== NAVBAR SCROLL ====================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
        heroScrollFade();
    });

    // ==================== MOBILE MENU ====================
    const menuBtn = document.querySelector('.nav-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // ==================== ACTIVE NAV LINK ====================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }

    // ==================== HERO SCROLL FADE ====================
    const heroFadeElements = document.querySelectorAll('[data-scroll-fade]');

    function heroScrollFade() {
        const scrollY = window.scrollY;
        const fadeEnd = window.innerHeight * 0.6;
        const opacity = Math.max(0, 1 - scrollY / fadeEnd);
        const translateY = scrollY * 0.3;

        heroFadeElements.forEach(el => {
            el.style.opacity = opacity;
            el.style.transform = `translateY(${translateY}px)`;
        });
    }

    // ==================== SCROLL REVEAL (IntersectionObserver) ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // ==================== PARALLAX FLOATING CARDS ====================
    const floatingCards = document.querySelectorAll('[data-parallax]');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        floatingCards.forEach(card => {
            const depth = parseFloat(card.getAttribute('data-parallax')) || 0.1;
            const moveX = x * depth * 80;
            const moveY = y * depth * 80;
            card.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });

    // ==================== PARTICLE SYSTEM ====================
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const colors = ['#ffe156', '#ff6ec7', '#00e5ff', '#76ff03', '#ff3d00'];
        for (let i = 0; i < 50; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            const size = Math.random() * 4 + 2;
            p.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.2};
                animation: particleFloat ${Math.random() * 6 + 4}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * -8}s;
                pointer-events: none;
            `;
            particlesContainer.appendChild(p);
        }
    }

    // ==================== STAR FIELD ====================
    const starsContainer = document.getElementById('starsCanvas');
    if (starsContainer) {
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            const size = Math.random() * 3 + 1;
            star.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: #fff;
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.6 + 0.2};
                animation: twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate;
                animation-delay: ${Math.random() * -5}s;
                pointer-events: none;
            `;
            starsContainer.appendChild(star);
        }
    }

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ==================== WAITLIST ====================
    const WAITLIST_URL = 'https://script.google.com/macros/s/AKfycbx18qzC1QiPI_fnUy0z7hSFWSSBaJ5R7V--bPhs9gUQRnar9NlBJY4mxrHdcEe-ZO9kzA/exec';
    const waitlistForm = document.getElementById('waitlistForm');
    const twitterInput = document.getElementById('twitterInput');
    const commentInput = document.getElementById('commentInput');
    const walletInput = document.getElementById('walletInput');
    const waitlistStatus = document.getElementById('waitlistStatus');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const twitter = twitterInput.value.trim();
            const comment = commentInput.value.trim();
            const wallet = walletInput.value.trim();

            if (!twitter || !twitter.startsWith('@') || twitter.length < 2) {
                waitlistStatus.textContent = 'ENTER A VALID TWITTER HANDLE (@username)';
                waitlistStatus.className = 'waitlist-status error';
                return;
            }

            if (!comment || !comment.startsWith('http')) {
                waitlistStatus.textContent = 'ENTER A VALID COMMENT LINK';
                waitlistStatus.className = 'waitlist-status error';
                return;
            }

            const evmRegex = /^0x[a-fA-F0-9]{40}$/;
            if (!evmRegex.test(wallet)) {
                waitlistStatus.textContent = 'ENTER A VALID EVM WALLET ADDRESS (0x...)';
                waitlistStatus.className = 'waitlist-status error';
                return;
            }

            waitlistStatus.textContent = "YOU'RE IN! WELCOME TO THE WAITLIST \uD83C\uDF89";
            waitlistStatus.className = 'waitlist-status success';
            twitterInput.value = '';
            commentInput.value = '';
            walletInput.value = '';

            fetch(WAITLIST_URL, {
                method: 'POST',
                body: JSON.stringify({ twitter: twitter, comment: comment, wallet: wallet })
            })
            .then(r => r.json())
            .then(data => {
                if (!data.success) {
                    waitlistStatus.textContent = (data.message || 'ERROR').toUpperCase();
                    waitlistStatus.className = 'waitlist-status error';
                }
            })
            .catch(() => {
                waitlistStatus.textContent = 'NETWORK ERROR \u2014 TRY AGAIN';
                waitlistStatus.className = 'waitlist-status error';
            });
        });
    }
});
