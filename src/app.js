const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')

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
    nama: 'Farhan Novaldi'
})
})

//ini halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Farhan Novaldi',
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
    judul: 'Tentang Saya',
    nama: 'Farhan Novaldi'
})
})

app.get('/bantuan/*',(req,res)=>{
    res.render('404',{
        judul: '404',
        nama: 'Farhan Novaldi',
        pesanKesalahan:'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        judul:'404',
        nama: 'Farhan Novaldi',
        pesanKesalahan:'Halaman tidak ditemukan'
    })
})

app.listen(4000, () => {
console.log('Server berjalan pada port 4000.')
})