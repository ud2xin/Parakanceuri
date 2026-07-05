document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Menambahkan class 'scrolled' pada navbar ketika halaman di-scroll ke bawah
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // Menu hamburger untuk tampilan mobile
    const closeMenu = () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeMenu();
        });
    }

    // Fitur Smooth Scroll untuk tombol di dalam halaman (misal: "Jelajahi Destinasi")
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                e.preventDefault();

                // Menghitung posisi dengan offset untuk navbar yang fixed
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
            }
        });
    });

    // Animasi reveal saat elemen masuk ke area pandang
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length) {
        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('in-view'));
        } else {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

            revealEls.forEach(el => observer.observe(el));
        }
    }

});