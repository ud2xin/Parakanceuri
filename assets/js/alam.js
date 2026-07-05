document.addEventListener('DOMContentLoaded', () => {
    
    const navbar = document.getElementById('navbar');

    // Menambahkan class 'scrolled' pada navbar ketika halaman di-scroll ke bawah
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Fitur Smooth Scroll untuk tombol di dalam halaman (misal: "Jelajahi Destinasi")
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Menghitung posisi dengan offset untuk navbar yang fixed
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});