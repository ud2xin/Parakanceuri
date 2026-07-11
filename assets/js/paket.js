document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    // Mengubah warna latar belakang navbar saat di-scroll melewati batas 50px
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});