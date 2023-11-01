const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const axios = require('axios')
const port = process.env.PORT || 4000


const app = express()

// Mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views',direktoriViews)
hbs.registerPartials(direktoriPartials)

//Setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman utama
app.get('', (req, res) => {
res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Rayhan Ahadi Nifri'
})
})

//ini halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Rayhan Ahadi Nifri',
    teksBantuan: 'Ini adalah teks bantuan'
    })
})

//ini halaman info Cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, 
location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
        }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'AUTHOR',
        nama: 'Rayhan Ahadi Nifri',
        instagram: '@rehanahdii',
        spotify: 'Rusty Sword',
        email: 'Rayhanpp18@gmail.com',
        genre : 'Dubstep, Trap, Future Riddim',
        profesi: ['Bass Music Producer'],
        label: ['Blasphamy Rec, Dezz Promotion, Catalysmy Sound'],
    })
})

// ini halaman berita
app.get('/berita', async (req, res) => {
    try {
        const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
        const apiKey = 'be42ff6447147e92b2cbca5e7952df12';

        const params = {
            access_key: apiKey,
            countries: 'id', 
        };

        const response = await axios.get(urlApiMediaStack, { params });
        const dataBerita = response.data;

        res.render('berita', {
            nama: 'Rayhan Ahadi Nifri',
            judul: 'Laman Berita',
            berita: dataBerita.data,
        });
    } catch (error) {
        console.error(error);
        res.render('error', {
            judul: 'Terjadi Kesalahan',
            pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
        });
    }
});



app.get('/bantuan/*',(req,res)=>{
    res.render('404',{
        judul: '404',
        nama: 'Rayhan Ahadi Nifri',
        pesanKesalahan:'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        judul:'404',
        nama: 'Rayhan Ahadi Nifri',
        pesanKesalahan:'Halaman tidak ditemukan'
    })
})

app.listen(port, () => {
console.log('Server berjalan pada port'+port)
})