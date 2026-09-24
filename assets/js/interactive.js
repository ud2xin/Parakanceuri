/* ==========================================================================
   Parakanceuri — Interactive Layer
   Berisi seluruh perilaku bersama di semua halaman:
   navbar, menu hamburger, smooth scroll, reveal-on-scroll (dengan stagger),
   lightbox galeri, tilt kartu, efek ripple, tombol kembali-ke-atas,
   progress bar scroll, tombol WhatsApp mengambang, count-up harga,
   dan transisi halus antar halaman.

   File ini dimuat di SEMUA halaman (index, alam, budaya, edukasi, paket)
   sehingga logika umum cukup ditulis satu kali.
   ========================================================================== */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const WA_NUMBER_DEFAULT = '6285926212815';

    document.addEventListener('DOMContentLoaded', () => {
        initNavbar();
        initReveal();
        initSmoothScroll();
        initScrollProgress();
        initFloatingActions();
        initLightbox();
        initTilt();
        initRipple();
        initHeroParallax();
        initPageTransition();
        initPriceCountUp();
        initKalkulator(); // otomatis tidak melakukan apa-apa jika elemen kalkulator tidak ada di halaman ini
    });

    /* ---------------------------------------------------------------------
       Navbar: ubah warna saat scroll + menu hamburger mobile
       --------------------------------------------------------------------- */
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navLinks = document.getElementById('navLinks');
        if (!navbar) return;

        const handleScroll = () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        if (navToggle && navLinks) {
            const closeMenu = () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            };

            navToggle.addEventListener('click', () => {
                const isOpen = navLinks.classList.toggle('open');
                navToggle.classList.toggle('active', isOpen);
                navToggle.setAttribute('aria-expanded', String(isOpen));
            });

            navLinks.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', closeMenu);
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) closeMenu();
            });
        }
    }

    /* ---------------------------------------------------------------------
       Smooth scroll untuk anchor link (#id) dengan offset tinggi navbar
       --------------------------------------------------------------------- */
    function initSmoothScroll() {
        const navbar = document.getElementById('navbar');
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;
                const targetEl = document.querySelector(targetId);
                if (!targetEl) return;

                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            });
        });
    }

    /* ---------------------------------------------------------------------
       Reveal on scroll — dengan stagger otomatis antar elemen bersaudara
       --------------------------------------------------------------------- */
    function initReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        if (!revealEls.length) return;

        // Hitung delay bertahap untuk elemen yang berada dalam parent yang sama
        const perParentIndex = new Map();
        revealEls.forEach((el) => {
            const parent = el.parentElement;
            const idx = perParentIndex.get(parent) || 0;
            if (!prefersReducedMotion) {
                el.style.transitionDelay = `${Math.min(idx, 6) * 90}ms`;
            }
            perParentIndex.set(parent, idx + 1);
        });

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach((el) => el.classList.add('in-view'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

        revealEls.forEach((el) => observer.observe(el));
    }

    /* ---------------------------------------------------------------------
       Progress bar scroll di bagian atas layar
       --------------------------------------------------------------------- */
    function initScrollProgress() {
        const wrap = document.createElement('div');
        wrap.className = 'scroll-progress';
        wrap.innerHTML = '<div class="scroll-progress-bar" id="scrollProgressBar"></div>';
        document.body.prepend(wrap);
        const bar = wrap.querySelector('#scrollProgressBar');

        let ticking = false;
        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }

    /* ---------------------------------------------------------------------
       Tombol "kembali ke atas" (dengan ring progress scroll) + tombol
       WhatsApp mengambang, dibungkus satu wadah agar rapi & sejajar.
       Wadah ini otomatis naik saat footer mulai terlihat, supaya kedua
       tombol tidak pernah menutupi konten/link di dalam footer.
       --------------------------------------------------------------------- */
    function initFloatingActions() {
        const RING_CIRCUMFERENCE = 2 * Math.PI * 21; // r=21, lihat viewBox 48x48 di CSS

        const wrap = document.createElement('div');
        wrap.className = 'floating-actions';

        wrap.innerHTML = `
            <button type="button" class="back-to-top" aria-label="Kembali ke atas">
                <svg class="back-to-top-ring" viewBox="0 0 48 48">
                    <circle class="ring-bg" cx="24" cy="24" r="21"></circle>
                    <circle class="ring-progress" cx="24" cy="24" r="21"
                        style="stroke-dasharray:${RING_CIRCUMFERENCE};stroke-dashoffset:${RING_CIRCUMFERENCE};"></circle>
                </svg>
                <svg class="icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>
                </svg>
            </button>
            <a class="float-wa" href="https://wa.me/${WA_NUMBER_DEFAULT}?text=${encodeURIComponent('Halo Parakanceuri, saya ingin bertanya seputar Kampung Wisata Parakanceuri.')}"
               target="_blank" rel="noopener" aria-label="Hubungi kami via WhatsApp">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.63 1.44 5.15L2 22l5.09-1.53a9.86 9.86 0 0 0 4.95 1.33h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.11.11-1.79-.11-.41-.13-.94-.3-1.62-.6-2.85-1.23-4.71-4.1-4.85-4.29-.14-.19-1.16-1.54-1.16-2.94s.72-2.09.98-2.38c.24-.26.53-.33.7-.33.18 0 .35 0 .5.01.16.01.38-.06.6.45.24.57.8 1.98.87 2.13.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.28-.12.55.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.07.19-.28.37-.23.63-.14.26.09 1.65.78 1.94.92.28.14.47.21.54.33.07.13.07.72-.17 1.4Z"/></svg>
            </a>
        `;
        document.body.appendChild(wrap);

        const backToTopBtn = wrap.querySelector('.back-to-top');
        const ringProgress = wrap.querySelector('.ring-progress');
        const footer = document.querySelector('footer');

        // Tampilkan tombol "ke atas" + update ring progress sesuai posisi scroll
        let ticking = false;
        const updateOnScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const pct = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

            backToTopBtn.classList.toggle('show', scrollTop > 480);
            ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - pct));

            // Geser wadah ke atas sebesar bagian footer yang sudah terlihat,
            // supaya tombol tidak pernah menimpa isi footer.
            if (footer) {
                const rect = footer.getBoundingClientRect();
                const overlap = Math.max(0, Math.min(rect.height, window.innerHeight - rect.top));
                wrap.style.setProperty('--footer-shift', `${overlap}px`);
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }, { passive: true });
        window.addEventListener('resize', updateOnScroll);
        updateOnScroll();

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------------------------------------------------------------------
       Lightbox galeri foto — memuat semua gambar konten di halaman
       --------------------------------------------------------------------- */
    function initLightbox() {
        const images = Array.from(document.querySelectorAll('img[loading="lazy"]'));
        if (!images.length) return;

        const overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.innerHTML = `
            <button type="button" class="lightbox-close" aria-label="Tutup">&times;</button>
            <button type="button" class="lightbox-prev" aria-label="Sebelumnya">&#8249;</button>
            <img class="lightbox-img" alt="">
            <button type="button" class="lightbox-next" aria-label="Berikutnya">&#8250;</button>
            <p class="lightbox-caption"></p>
        `;
        document.body.appendChild(overlay);

        const imgEl = overlay.querySelector('.lightbox-img');
        const captionEl = overlay.querySelector('.lightbox-caption');
        const closeBtn = overlay.querySelector('.lightbox-close');
        const prevBtn = overlay.querySelector('.lightbox-prev');
        const nextBtn = overlay.querySelector('.lightbox-next');

        let currentIndex = 0;

        const showAt = (index) => {
            currentIndex = (index + images.length) % images.length;
            const src = images[currentIndex].currentSrc || images[currentIndex].src;
            imgEl.src = src;
            imgEl.alt = images[currentIndex].alt || '';
            captionEl.textContent = images[currentIndex].alt || '';
        };

        const open = (index) => {
            showAt(index);
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        };

        images.forEach((img, index) => {
            img.addEventListener('click', () => open(index));
        });

        if (images.length <= 1) {
            prevBtn.classList.add('hidden-el');
            nextBtn.classList.add('hidden-el');
        }

        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', () => showAt(currentIndex - 1));
        nextBtn.addEventListener('click', () => showAt(currentIndex + 1));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!overlay.classList.contains('open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
            if (e.key === 'ArrowRight') showAt(currentIndex + 1);
        });
    }

    /* ---------------------------------------------------------------------
       Tilt 3D halus pada kartu/gambar (hanya perangkat dengan mouse presisi)
       --------------------------------------------------------------------- */
    function initTilt() {
        if (!isFinePointer || prefersReducedMotion) return;

        const selector = '.card, .budaya-card, .edukasi-card, .paket-card, .destinasi-media, .galeri-media';
        const els = document.querySelectorAll(selector);

        els.forEach((el) => {
            el.classList.add('tilt-el');

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const rotateX = (-y * 7).toFixed(2);
                const rotateY = (x * 7).toFixed(2);
                el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    /* ---------------------------------------------------------------------
       Efek ripple pada tombol saat diklik
       --------------------------------------------------------------------- */
    function initRipple() {
        const selector = '.btn, .btn-outline, .btn-booking, .card-btn, .back-to-top';
        document.querySelectorAll(selector).forEach((btn) => {
            btn.classList.add('ripple-el');
            btn.addEventListener('click', function (e) {
                const rect = btn.getBoundingClientRect();
                const span = document.createElement('span');
                const size = Math.max(rect.width, rect.height) * 1.4;
                span.className = 'ripple-span';
                span.style.width = span.style.height = `${size}px`;
                span.style.left = `${(e.clientX || rect.left + rect.width / 2) - rect.left - size / 2}px`;
                span.style.top = `${(e.clientY || rect.top + rect.height / 2) - rect.top - size / 2}px`;
                btn.appendChild(span);
                span.addEventListener('animationend', () => span.remove());
            });
        });
    }

    /* ---------------------------------------------------------------------
       Parallax halus pada kontur gunung di hero saat scroll
       --------------------------------------------------------------------- */
    function initHeroParallax() {
        if (prefersReducedMotion) return;
        const ridges = document.querySelectorAll('.ridge--hero');
        if (!ridges.length) return;

        let ticking = false;
        const update = () => {
            const y = window.scrollY;
            ridges.forEach((ridge) => {
                ridge.style.transform = `translateY(${Math.min(y * 0.12, 40)}px)`;
            });
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    }

    /* ---------------------------------------------------------------------
       Transisi fade saat berpindah ke halaman lain di situs yang sama
       --------------------------------------------------------------------- */
    function initPageTransition() {
        if (prefersReducedMotion) return;

        document.querySelectorAll('a[href$=".html"]').forEach((link) => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                const isSamePage = href === window.location.pathname.split('/').pop();
                if (this.target === '_blank' || e.metaKey || e.ctrlKey || isSamePage) return;

                e.preventDefault();
                document.body.classList.add('page-fade-out');
                setTimeout(() => { window.location.href = href; }, 260);
            });
        });
    }

    /* ---------------------------------------------------------------------
       Animasi hitung naik untuk angka harga paket saat masuk area pandang
       --------------------------------------------------------------------- */
    function initPriceCountUp() {
        const amounts = document.querySelectorAll('.paket-price .amount');
        if (!amounts.length || prefersReducedMotion || !('IntersectionObserver' in window)) return;

        const formatID = (n) => n.toLocaleString('id-ID');

        const animate = (el) => {
            const target = parseInt(el.textContent.replace(/\D/g, ''), 10);
            if (!target) return;
            const duration = 900;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = formatID(Math.floor(target * eased));
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = formatID(target);
            };
            requestAnimationFrame(step);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        amounts.forEach((el) => observer.observe(el));
    }

    /* ---------------------------------------------------------------------
       Kalkulator Estimasi Biaya (hanya berjalan jika markup-nya ada, di paket.html)
       --------------------------------------------------------------------- */
    function initKalkulator() {
        const select = document.getElementById('calcPaket');
        const input = document.getElementById('calcJumlah');
        const totalEl = document.getElementById('calcTotal');
        const warningEl = document.getElementById('calcWarning');
        const waBtn = document.getElementById('calcWaBtn');
        if (!select || !input || !totalEl || !waBtn) return;

        const formatRupiah = (n) => `Rp ${n.toLocaleString('id-ID')}`;

        const recalc = () => {
            const opt = select.options[select.selectedIndex];
            const harga = parseInt(opt.dataset.harga, 10) || 0;
            const min = parseInt(opt.dataset.min, 10) || 1;
            const wa = opt.dataset.wa || WA_NUMBER_DEFAULT;
            const nama = opt.dataset.nama || opt.textContent;

            let jumlah = parseInt(input.value, 10);
            if (!jumlah || jumlah < 1) jumlah = 1;
            input.value = jumlah;

            const total = harga * jumlah;
            totalEl.textContent = formatRupiah(total);

            if (jumlah < min) {
                warningEl.hidden = false;
                warningEl.textContent = `Catatan: paket ini berlaku untuk minimal ${min} orang. Estimasi di atas dihitung untuk ${jumlah} orang sebagai simulasi.`;
            } else {
                warningEl.hidden = true;
            }

            const pesan = `Halo Parakanceuri, saya ingin booking ${nama} untuk ${jumlah} orang. Estimasi total: ${formatRupiah(total)}. Mohon info ketersediaan tanggal.`;
            waBtn.href = `https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`;
        };

        select.addEventListener('change', recalc);
        input.addEventListener('input', recalc);
        recalc();
    }

})();
