document.addEventListener('DOMContentLoaded', () => {

    // ==================== NAVBAR SCROLL ====================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateActiveNav();
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

    // ==================== STAT COUNTER ANIMATION ====================
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    }

    // ==================== SCROLL REVEAL ====================
    const revealElements = document.querySelectorAll('.section-header, .nft-card, .collection-cta');
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.closest('.hero')) animateCounters();
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // ==================== PARALLAX ON HERO CARDS ====================
    const cards = document.querySelectorAll('.hero-image-card');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        cards.forEach((card, i) => {
            const depth = (i + 1) * 8;
            card.style.transform = `translate(${x * depth}px, ${y * depth}px) rotate(${[-5, 3, -2][i]}deg)`;
        });
    });

    // ==================== NFT CARD TILT ====================
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
            const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(-4px, -4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ==================== SMOOTH SCROLL ====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ==================== WAITLIST ====================
    const WAITLIST_URL = 'https://script.google.com/macros/s/AKfycbwzsj3GfgoFrrnoXGWts4-v6bem7jgSyjLTGN6bSc7gK3FhXk3m1rBOhOn5ctQxzcqzJA/exec';
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

            // Twitter validation: must start with @
            if (!twitter || !twitter.startsWith('@') || twitter.length < 2) {
                waitlistStatus.textContent = 'ENTER A VALID TWITTER HANDLE (@username)';
                waitlistStatus.className = 'waitlist-status error';
                return;
            }

            // Comment link validation
            if (!comment || !comment.startsWith('http')) {
                waitlistStatus.textContent = 'ENTER A VALID COMMENT LINK';
                waitlistStatus.className = 'waitlist-status error';
                return;
            }

            // EVM address validation
            const evmRegex = /^0x[a-fA-F0-9]{40}$/;
            if (!evmRegex.test(wallet)) {
                waitlistStatus.textContent = 'ENTER A VALID EVM WALLET ADDRESS (0x...)';
                waitlistStatus.className = 'waitlist-status error';
                return;
            }

            // Optimistic UI
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

    // Init counters on load
    animateCounters();
});
