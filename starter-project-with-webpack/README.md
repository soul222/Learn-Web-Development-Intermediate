# Learn-Web-Development-Intermediate
# StoryGan — Aplikasi Berbagi Cerita

**StoryGan** adalah aplikasi web Single-Page Application (SPA) yang memungkinkan pengguna untuk membaca dan membagikan cerita mereka dari berbagai lokasi. Aplikasi ini dibangun dengan memanfaatkan Web API dan teknologi front-end modern.

## 🎯 Fitur Utama

✅ Mengambil data cerita dari Story API  
✅ Menampilkan daftar cerita dengan gambar dan deskripsi  
✅ Peta interaktif untuk menunjukkan lokasi cerita dengan marker dan popup  
✅ Formulir untuk menambahkan cerita baru (dengan akses kamera & map click)  
✅ Aksesibilitas sesuai WCAG: skip to content, label pada input, teks alternatif, semantic HTML  
✅ Transisi halaman halus dengan View Transition API

---

## 🛠️ Teknologi dan Tools

- HTML5, CSS3, JavaScript
- Web API (Story API)
- Leaflet.js untuk peta digital
- View Transition API
- Model-View-Presenter (MVP) Pattern
- Font Awesome untuk ikon
- Web Camera API untuk ambil gambar
- MediaDevices & Geolocation API

---

## 🌐 SPA Routing

Routing dilakukan menggunakan hash (`#`) untuk memuat:
- Halaman utama (`#/`)
- Tambah cerita (`#/add`)
- Detail cerita (`#/story/:id`)

---

## 🗺️ Integrasi Peta

- Menggunakan **Leaflet.js**
- Menampilkan **marker** di lokasi cerita
- **Popup** berisi ringkasan cerita
- Saat tambah cerita, pengguna dapat **klik di peta** untuk mengambil latitude dan longitude
- Mendukung **layer control** dan beberapa gaya tile map

---

## 📷 Akses Kamera

- Fitur ambil gambar saat menambahkan cerita
- Menggunakan **MediaDevices.getUserMedia()**
- Stream otomatis dimatikan setelah pengambilan gambar selesai

---

## ✅ Aksesibilitas

- Skip to content di awal halaman
- Setiap gambar memiliki alt text
- Setiap `<input>` memiliki label terkait
- Gunakan elemen semantic seperti `<main>`, `<nav>`, `<section>`, `<header>`

---

## 🌈 Tampilan Menarik

- Palet warna diambil dari [colorhunt.co](https://colorhunt.co)
- Tata letak responsif dan mobile-friendly
- Font yang mudah dibaca
- Margin dan padding proporsional
- Ikon-ikon visual untuk meningkatkan UX

---

## 🚀 Cara Menjalankan Proyek

1. Clone repositori ini:

```bash
git clone https://github.com/soul222/Learn-Web-Development-Intermediate.git
cd ceritakita
