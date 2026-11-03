// Kunci penyimpanan di localStorage
const KUNCI_PENYIMPANAN = 'ulasanDesainWeb';
const DAFTAR_KATEGORI = ['testimoni', 'kritik', 'saran'];

// Modal Bootstrap 5 dipanggil lewat JavaScript murni (tanpa jQuery)
const modalUlasan = new bootstrap.Modal(document.getElementById('modalUlasan'));
const formUlasan = document.getElementById('formUlasan');
const pesanPeringatan = document.getElementById('pesanPeringatan');

function muatData() {
  const dataKosong = { testimoni: [], kritik: [], saran: [] };
  try {
    const mentah = localStorage.getItem(KUNCI_PENYIMPANAN);
    if (!mentah) return dataKosong;
    const data = JSON.parse(mentah);
    DAFTAR_KATEGORI.forEach(function (kategori) {
      if (!Array.isArray(data[kategori])) data[kategori] = [];
    });
    return data;
  } catch (galat) {
    return dataKosong;
  }
}

function simpanData(data) {
  try {
    localStorage.setItem(KUNCI_PENYIMPANAN, JSON.stringify(data));
  } catch (galat) {
    console.error('Gagal menyimpan ke localStorage:', galat);
  }
}

function buatKartuEntri(entri) {
  const kartu = document.createElement('div');
  kartu.className = 'entri-ulasan';

  const teks = document.createElement('p');
  teks.className = 'teks-entri';
  teks.textContent = entri.teks; // textContent: aman dari injeksi HTML

  const waktu = document.createElement('small');
  waktu.className = 'text-muted';
  waktu.textContent = entri.waktu;

  kartu.appendChild(teks);
  kartu.appendChild(waktu);
  return kartu;
}

// Menulis ulang isi HTML dari data yang tersimpan (entri terbaru di atas)
function tampilkanData(data) {
  DAFTAR_KATEGORI.forEach(function (kategori) {
    const wadah = document.getElementById('daftar-' + kategori);
    wadah.replaceChildren();
    data[kategori].slice().reverse().forEach(function (entri) {
      wadah.appendChild(buatKartuEntri(entri));
    });
  });
}

// Aksi 1: tekan floating widget -> buka form
document.getElementById('tombolMengambang').addEventListener('click', function () {
  pesanPeringatan.classList.add('d-none');
  modalUlasan.show();
});

// Aksi 2 dan 3: isi form -> publish
formUlasan.addEventListener('submit', function (event) {
  event.preventDefault();

  const isian = {
    testimoni: document.getElementById('isiTestimoni').value.trim(),
    kritik: document.getElementById('isiKritik').value.trim(),
    saran: document.getElementById('isiSaran').value.trim()
  };

  const adaIsi = DAFTAR_KATEGORI.some(function (kategori) {
    return isian[kategori] !== '';
  });

  if (!adaIsi) {
    pesanPeringatan.classList.remove('d-none');
    return;
  }

  const data = muatData();
  const waktuSekarang = new Date().toLocaleString('id-ID');

  DAFTAR_KATEGORI.forEach(function (kategori) {
    if (isian[kategori] !== '') {
      data[kategori].push({ teks: isian[kategori], waktu: waktuSekarang });
    }
  });

  simpanData(data);      // simpan ke localStorage
  tampilkanData(data);   // perbarui HTML
  formUlasan.reset();
  pesanPeringatan.classList.add('d-none');
  modalUlasan.hide();
});

// Saat halaman dibuka/di-reload, tampilkan data yang tersimpan
tampilkanData(muatData());