document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');

    // Mengubah warna latar belakang navbar saat di-scroll melewati batas 50px[cite: 9]
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');[cite: 9]
        } else {
            navbar.classList.remove('scrolled');[cite: 9]
        }
    });
});

// ==========================================================================
// Logika Sistem Kalkulator & Pemilihan Paket Wisata Utama
// ==========================================================================

let activePackage = {
    code: '',
    pricePerPax: 0,
    name: ''
};

/**
 * Fungsi untuk memilih paket dari tombol kartu di atas
 */
function selectPackage(packageCode, price, packageName) {
    activePackage.code = packageCode;
    activePackage.pricePerPax = price;
    activePackage.name = packageName;

    // Masukkan info otomatis ke input form kalkulator
    document.getElementById('selected-pkg').value = `${packageName} - Rp ${price.toLocaleString('id-ID')}/orang`;
    
    // Sembunyikan hasil kalkulasi lama jika user berpindah paket
    document.getElementById('calc-result').classList.add('hidden');

    // Lempar layar dengan efek smooth scrolling ke form kalkulator
    document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Fungsi menghitung estimasi biaya total + validasi batas kuota 50 orang
 */
function calculateTotal() {
    const paxInput = document.getElementById('pax-count').value;
    const resultDiv = document.getElementById('calc-result');
    const paxCount = parseInt(paxInput);

    // Validasi 1: Apakah user sudah menekan tombol pilih paket?
    if (!activePackage.code) {
        resultDiv.className = "calc-result warning";
        resultDiv.innerHTML = "⚠️ <strong>Pemberitahuan:</strong> Silakan pilih salah satu paket berkode <strong>Rombongan</strong> di atas terlebih dahulu dengan mengklik tombol 'Pilih & Hitung Biaya'.";
        resultDiv.classList.remove('hidden');
        return;
    }

    // Validasi 2: Memastikan input data kuantitas orang valid
    if (isNaN(paxCount) || paxCount <= 0) {
        resultDiv.className = "calc-result warning";
        resultDiv.innerHTML = "⚠️ <strong>Kesalahan:</strong> Harap masukkan jumlah kuantitas peserta rombongan yang valid.";
        resultDiv.classList.remove('hidden');
        return;
    }

    // Pengecekan Aturan Bisnis: Syarat Minimal Paket Rombongan adalah 50 Pax
    if (paxCount < 50) {
        resultDiv.className = "calc-result warning";
        resultDiv.innerHTML = `❌ <strong>Gagal Menghitung:</strong> Jumlah input Anda saat ini adalah ${paxCount} orang. Paket Edukasi Utama Rombongan ini hanya berlaku untuk kriteria <strong>minimal 50 orang peserta</strong>.<br><br>👉 Untuk kuota kelompok kecil di bawah 50 orang, silakan koordinasikan penyesuaian harga khusus langsung dengan admin kami.`;
        resultDiv.classList.remove('hidden');
    } else {
        // Melakukan kalkulasi perkalian harga dasar dikali total pax
        const totalCost = activePackage.pricePerPax * paxCount;
        
        // Memformat nominal ke standard mata uang Rupiah (IDR)
        const formattedTotal = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(totalCost);

        // Membuat string teks WhatsApp dinamis terintegrasi
        const waText = encodeURIComponent(`Halo pengelola Wisata Kampung Parakanceuri, saya tertarik untuk melakukan reservasi program "${activePackage.name}" dengan estimasi kapasitas rombongan sebanyak ${paxCount} orang. Mohon info ketersediaan slot tanggal kosong.`);
        const waLink = `https://wa.me/6285926212815?text=${waText}`;

        resultDiv.className = "calc-result success";
        resultDiv.innerHTML = `
            ✅ <strong>Simulasi Estimasi Berhasil!</strong><br>
            • Rencana Pilihan: <strong>${activePackage.name}</strong><br>
            • Jumlah Anggota: <strong>${paxCount} orang</strong><br>
            • Total Perkiraan Anggaran: <strong style="font-size: 1.2rem; color: #1b5e20;">${formattedTotal}</strong><br><br>
            <small>*Nominal di atas merupakan hitungan estimasi fasilitas standar include lembar paket. Silakan klik link tombol di bawah untuk mengirim pengajuan resmi ke WhatsApp admin.</small><br><br>
            <a href="${waLink}" target="_blank" class="btn-booking" style="display:inline-block; max-width: 320px; text-decoration:none;">Kirim Ajuan Rencana via WhatsApp</a>
        `;
        resultDiv.classList.remove('hidden');
    }
}