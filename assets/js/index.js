// Menunggu sampai seluruh struktur HTML dimuat
document.addEventListener('DOMContentLoaded', () => {
    
    const navbar = document.getElementById('navbar');

    // Efek navigasi berubah warna saat halaman di-scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Efek Smooth Scroll saat tombol diklik (contoh: tombol "Jelajahi Sekarang")
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});