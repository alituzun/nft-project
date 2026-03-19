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

    // ==================== PUPPET MAKER ====================
    const pmCanvas = document.getElementById('pmCanvas');
    const pmAccLayer = document.getElementById('pmAccessories');
    const pmBaseImg = pmCanvas ? pmCanvas.querySelector('.pm-base-img') : null;

    if (pmCanvas) {
        const emojiMap = {
            crown: '👑', tophat: '🎩', cap: '🧢', glasses: '🕶️',
            monocle: '🧐', bowtie: '🎀', star: '⭐', fire: '🔥',
            lightning: '⚡', heart: '❤️', diamond: '💎', rocket: '🚀'
        };

        const fxMap = {
            none: 'none',
            invert: 'invert(1)',
            sepia: 'sepia(1)',
            hue: 'hue-rotate(180deg)',
            saturate: 'saturate(3)',
            contrast: 'contrast(2)',
            grayscale: 'grayscale(1)',
            blur: 'blur(2px)'
        };

        // Puppet selection
        document.querySelectorAll('.pm-puppet-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pm-puppet-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                pmBaseImg.src = btn.dataset.puppet;
            });
        });

        // Accessories — click to place, click again to remove
        document.querySelectorAll('.pm-acc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const accId = btn.dataset.acc;
                const existing = pmAccLayer.querySelector(`[data-acc-id="${accId}"]`);
                if (existing) {
                    existing.remove();
                    btn.classList.remove('active');
                    return;
                }
                btn.classList.add('active');
                const el = document.createElement('div');
                el.className = 'pm-placed-acc';
                el.textContent = emojiMap[accId];
                el.dataset.accId = accId;
                el.style.left = '40%';
                el.style.top = '20%';
                pmAccLayer.appendChild(el);
                makeDraggable(el);
            });
        });

        // Drag accessories within canvas
        function makeDraggable(el) {
            let offsetX, offsetY, isDragging = false;

            function onPointerDown(e) {
                e.preventDefault();
                isDragging = true;
                el.classList.add('dragging');
                const rect = pmCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                offsetX = clientX - rect.left - el.offsetLeft;
                offsetY = clientY - rect.top - el.offsetTop;
                document.addEventListener('mousemove', onPointerMove);
                document.addEventListener('mouseup', onPointerUp);
                document.addEventListener('touchmove', onPointerMove, { passive: false });
                document.addEventListener('touchend', onPointerUp);
            }

            function onPointerMove(e) {
                if (!isDragging) return;
                e.preventDefault();
                const rect = pmCanvas.getBoundingClientRect();
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                let x = clientX - rect.left - offsetX;
                let y = clientY - rect.top - offsetY;
                x = Math.max(0, Math.min(x, rect.width - el.offsetWidth));
                y = Math.max(0, Math.min(y, rect.height - el.offsetHeight));
                el.style.left = (x / rect.width * 100) + '%';
                el.style.top = (y / rect.height * 100) + '%';
            }

            function onPointerUp() {
                isDragging = false;
                el.classList.remove('dragging');
                document.removeEventListener('mousemove', onPointerMove);
                document.removeEventListener('mouseup', onPointerUp);
                document.removeEventListener('touchmove', onPointerMove);
                document.removeEventListener('touchend', onPointerUp);
            }

            el.addEventListener('mousedown', onPointerDown);
            el.addEventListener('touchstart', onPointerDown, { passive: false });

            // Double-click to remove
            el.addEventListener('dblclick', () => {
                const accId = el.dataset.accId;
                el.remove();
                const accBtn = document.querySelector(`.pm-acc-btn[data-acc="${accId}"]`);
                if (accBtn) accBtn.classList.remove('active');
            });
        }

        // Background selection
        document.querySelectorAll('.pm-bg-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pm-bg-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                pmCanvas.style.background = btn.dataset.bg;
            });
        });

        // Effects
        document.querySelectorAll('.pm-fx-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.pm-fx-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                pmBaseImg.style.filter = fxMap[btn.dataset.fx];
            });
        });

        // Download (html2canvas-style: use canvas API)
        document.getElementById('pmDownload').addEventListener('click', () => {
            const canvas = document.createElement('canvas');
            const size = 1024;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Draw background
            const bgVal = pmCanvas.style.background || '#0d0d0d';
            if (bgVal.includes('gradient')) {
                const grad = ctx.createLinearGradient(0, 0, size, size);
                grad.addColorStop(0, '#FF00FF');
                grad.addColorStop(1, '#00E5FF');
                ctx.fillStyle = grad;
            } else {
                ctx.fillStyle = bgVal || '#0d0d0d';
            }
            ctx.fillRect(0, 0, size, size);

            // Draw base image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Apply filter
                ctx.filter = pmBaseImg.style.filter || 'none';
                ctx.drawImage(img, 0, 0, size, size);
                ctx.filter = 'none';

                // Draw accessories as text
                const accEls = pmAccLayer.querySelectorAll('.pm-placed-acc');
                const canvasRect = pmCanvas.getBoundingClientRect();
                accEls.forEach(acc => {
                    const leftPct = parseFloat(acc.style.left) / 100;
                    const topPct = parseFloat(acc.style.top) / 100;
                    const fontSize = Math.round(size * 0.08);
                    ctx.font = `${fontSize}px serif`;
                    ctx.fillText(acc.textContent, leftPct * size, topPct * size + fontSize);
                });

                // Trigger download
                const link = document.createElement('a');
                link.download = 'my-sock-puppet.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            };
            img.src = pmBaseImg.src;
        });

        // Reset
        document.getElementById('pmReset').addEventListener('click', () => {
            pmAccLayer.innerHTML = '';
            pmBaseImg.style.filter = 'none';
            pmCanvas.style.background = '#0d0d0d';

            document.querySelectorAll('.pm-acc-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.pm-bg-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.pm-fx-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.pm-bg-btn[data-bg="#0d0d0d"]').classList.add('active');
            document.querySelector('.pm-fx-btn[data-fx="none"]').classList.add('active');

            document.querySelectorAll('.pm-puppet-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.pm-puppet-btn').classList.add('active');
            pmBaseImg.src = 'img/photo_2026-03-19_21-34-29.jpg';
        });
    }

    // Init counters on load
    animateCounters();
});
