/* ===========================================================
   Penilaian Mandiri – Replikasi Formulir Kondisi (tanpa Excel)
   Render dari FORM_CONFIG: bagian, butir, opsi, bobot, rumus total.
   =========================================================== */
(function(){
  var SECTION_MAX_SCORES = {
    'A. KEPEMIMPINAN DALAM PENGELOLAAN LINGKUNGAN': 10,
    'B. KELEMBAGAAN DAN PARTISIPASI MASYARAKAT': 20,
    'C. PENGELOLAAN SAMPAH': 160,
    'D. PENGELOLAAN RUANG TERBUKA HIJAU': 40,
    'E. KONSERVASI ENERGI': 40,
    'F. KONSERVASI AIR': 40
};
  var PASSING_CRITERIA = {
    'pratama': 110.5, 
    'madya': 167.5,   
    'mandiri': 232.5  
};
  // ==============  A. FORM CONFIG  =================
  var FORM_CONFIG = [
    {
      title: 'A. KEPEMIMPINAN DALAM PENGELOLAAN LINGKUNGAN',
      items: [
        {
          no: 'A1', // Internal ID
          displayNo: '1', // Untuk display dihalaman
          label: 'Presentasi Lingkungan Hidup oleh Kepala Desa / Lurah',
          note: '<span style="color:red"><i>*Pilih salah satu</i></span>',  // catatan tambahan
          type: 'radio',
          required: true,
          weight: 5, 
          options: [
            { value:'a', label:'a) Disampaikan secara langsung', score: 1 },    // 100% × 5 = 5
            { value:'b', label:'b) Diwakilkan', score: 0.75 },                   // 75% × 5 = 3.75
          ]
        },
        {
          no: 'A2', 
          displayNo: '2', 
          label: 'Presentasi Lingkungan Hidup oleh Ketua Kader Lingkungan',
          note: '<span style="color:red"><i>*Pilih salah satu</i></span>',  
          type: 'radio',
          required: true,
          weight: 5, 
          options: [
            { value:'a', label:'a) Disampaikan secara langsung ', score: 1 },    
            { value:'b', label:'b) Diwakilkan', score: 0.75 },                  
          ]
        },
      ]
    },
    {
      title: 'B. KELEMBAGAAN DAN PARTISIPASI MASYARAKAT',
      items: [
        // ——— Nomer B1 ———
        {
          no: 'B1', 
          displayNo: '1',
          label: 'Kebijakan dan Peraturan terkait Lingkungan Hidup (SK Bupati/Walikota/Kepala DLH/Kepala Dinas Terkait/Kepala Desa/Lurah)',
          note: '<span style="color:red"><i>*Pilih salah satu</i></span>',  
          type: 'radio',
          required: true,
          weight: 2, // bobot 2% sesuai tabel
          options: [
            { value: 'a', label: 'a) Ada 1 Kebijakan/Peraturan LH',  score: 0.25 }, // 25%
            { value: 'b', label: 'b) Ada 2 Kebijakan/Peraturan LH',  score: 0.50 }, // 50%
            { value: 'c', label: 'c) Ada 3 Kebijakan/Peraturan LH',  score: 0.75 }, // 75%
            { value: 'd', label: 'd) Ada > 3 Kebijakan/Peraturan LH', score: 1.00 }, // 100%
          ]
        },
        // ——— Nomer B2 ———
        {
          no: '2',
          //displayNo: '2',
          label: 'Upaya pengelolaan lingkungan hidup di lingkungan dalam kantor Desa/Kelurahan)',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  
          type: 'checkbox',
          required: true,
          weight: 1,
          //maxPoints: 2, 
          options: [
            { value: 'a', label: 'a) Melakukan pemilahan sampah', score: 0 },
            { value: 'b', label: 'b) Terdapat pengolahan kegiatan Pengomposan (berproses dan menghasilkan kompos)', score: 0 },
            { value: 'c', label: 'c) Terdapat organisasi kelembagaan Kader Lingkungan Hidup', score: 0 },
            { value: 'd', label: 'd) Terdapat lubang resapan biopori (minimal 5 lubang resapan biopori, tutupnya bisa dibuka dengan mudah, diisi sampah)', score: 0 },
            { value: 'e', label: 'e) Terdapat tanaman yang berfungsi sebagai perindang, peneduh, estetika', score: 0 },
            { value: 'f', label: 'f) Terdapat tanaman pangan (sayuran, dll)', score: 0 },
            { value: 'g', label: 'g) Terdapat toga (minimal 10 jenis)', score: 0 },
          ]
        },
        // ——— Nomer B3 ———
        {
          no: '3',
          //displayNo: '3',
          label: 'Kegiatan pembinaan pengelolaan lingkungan hidup bagi Aparat dan Warga/Kader Lingkungan selama 1 (satu) tahun terakhir ) ',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  
          type: 'checkbox',
          required: true,
          weight: 1,
          maxPoints: 2,
          options: [
            { value:'a', label:'a) Pendampingan', score: 0 },
            { value:'b', label:'b) Pelatihan/Bimbingan Teknis/Workshop lokakarya/ Seminar', score: 0 },
            { value:'c', label:'c) Lokakarya/Seminar', score: 0 },
            { value:'d', label:'d) Studi banding (antar desa, dll)', score: 0 },
            { value:'e', label:'e) Sosialisasi', score: 0 },
          ]
        },
         // ——— Nomer B4 ———
        {
          no: 'B4',
          displayNo: '4',
          label: 'Organisasi Kelembagaan kader lingkungan hidup',
          note: '<span style="color:red"><i>*Pilih salah satu</i></span>',  
          type: 'radio',
          required: true,
          weight: 2,
          options: [
            { value:'a', label:'a) Ada kader lingkungan aktif, tapi tidak ada SK dan struktur organisasi', score: 0.25 },
            { value:'b', label:'b) Ada kader lingkungan aktif dan struktur organisasi kader lingkungan, tapi tidak dilengkapi SK', score: 0.50 },
            { value:'c', label:'c) Ada kader lingkungan aktif dilengkapi SK dengan struktur organisasi kader lingkungan', score: 0.75 },
            { value:'d', label:'d) Ada kader lingkungan aktif dilengkapi SK dengan struktur organisasi kader lingkungan yang dipasang', score: 1 },
          ]
        },
        // ——— Nomer B5 ———
        {
          no: '5',
          //displayNo: '5',
          label: 'Program Kerja Kader Lingkungan hidup di bidang : ',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  
          type: 'checkbox',
          required: true,
          weight: 1,
          maxPoints: 2,
          options: [
            { value:'a', label:'a) Pengelolaan sampah', score: 0 },
            { value:'b', label:'b) Pemanenan air hujan', score: 0 },
            { value:'c', label:'c) Peresapan air', score: 0 },
            { value:'d', label:'d) Penghematan penggunaan air', score: 0 },
            { value:'e', label:'e) Perlindungan mata air', score: 0 },
            { value:'f', label:'f) Keanekaragaman hayati', score: 0 },
            { value:'g', label:'g) Konservasi energi', score: 0 },
          ]
        },       
        // ——— Nomer B6 ———
        {
          no: '6',
          //displayNo: '6',
          label: 'Program desa/kelurahan untuk kegiatan Pelestarian Sumberdaya Alam yang melibatkan masyarakat',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>', 
          type: 'checkbox',
          required: true,
          weight: 1,
          maxPoints: 2,
          options: [
            { value:'a', label:'a) Penanaman pohon', score: 0 },
            { value:'b', label:'b) Bersih bersih sungai/kali/drainase', score: 0 },
            { value:'c', label:'c) Bersih bersih pantai ', score: 0 },
            { value:'d', label:'d) Jumat bersih', score: 0 },
            { value:'e', label:'e) Sedekah bumi', score: 0 },
            { value:'f', label:'f) Lainnya ', score: 0, hasDetail: true },
          ]
        },  
        // ——— Nomer B7 ———
        {
          no: '7',
          //displayNo: '7',
          label: 'Upaya mewujudkan sanitasi berbasis masyarakat',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  
          type: 'checkbox',
          required: true,
          weight: 1,
          maxPoints: 2,
          options: [
            { value:'a', label:'a) Mempunyai Sertifikat ODF ', score: 0 },
            { value:'b', label:'b) Pembentukan Jumantik (Juru Pemantau Jentik)', score: 0 },
            { value:'c', label:'c) Lokakarya/Seminar', score: 0 },
            { value:'d', label:'d) Menerapkan  sistem kewaspadaaan dini untuk mengantisipasi terjadinya penyakit terkait iklim (diare, malaria, DBD).', score: 0 },
          ]
        },  
        // ——— Nomer B8 ———
        {
          no: '8',
          //displayNo: '8',
          label: 'Terdapat Kebijakan Anggaran Desa/Kelurahan untuk pengelolaan lingkungan hidup dengan kegiatan sebagai berikut:',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  // catatan tambahan
          type: 'checkbox',
          required: true,
          weight: 1,
          options: [
            { value:'a', label:'a) Pengelolaan sampah', score: 0.25 },
            { value:'b', label:'b) Pengelolaan Ruang Terbuka Hijau (RTH) (pekarangan pangan lestari, hatinya PKK, dll)', score: 0.25 },
            { value:'c', label:'c) Konservasi air', score: 0.25 },
            { value:'d', label:'d) Konservasi energi', score: 0.25 },
          ]
        },  
        // ——— Nomer B9 ———
        {
          no: '9',
          //displayNo: '9',
          label: 'Pola Hidup Bersih dan Sehat (PHBS) dilingkungan permukiman dengan bukti:',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  
          type: 'checkbox',
          required: true,
          weight: 1,
          options: [
            { value:'a', label:'a) Penerapan PHBS, melalui: penyediaan sarana cuci tangan di tempat umum serta adanya gerakan mencuci tangan dengan sabun', score: 0.25 },
            { value:'b', label:'b) Lingkungan bersih tidak ada sampah menumpuk', score: 0.25 },
            { value:'c', label:'c) Rumah dengan sirkulasi udara yang baik', score: 0.25 },
            { value:'d', label:'d) Adanya himbauan untuk tidak merokok di dalam rumah', score: 0.25 },
            { value:'e', label:'e) Tersedianya air bersih', score: 0.25 },
          ]
        }, 
        // ——— Nomer B10 ———
        {
          no: '10',
          //displayNo: '10',
          label: 'Kader Lingkungan Hidup yang aktif mengajak warga untuk mengelola lingkungan (Sebutkan)',
          note: '<span style="color:red"><i>*Dapat pilih lebih dari satu</i></span>',  
          type: 'kader10',     // <-- tipe custom
          required: true,
          weight: 2            
        },

      ]
    },
    
{
  title: 'C. PENGELOLAAN SAMPAH',
  items: [
    // wrapper
    {
      type: 'table-wrapper',
      items: [
        // Lokasi Pantau
        {
          no: 'C-table1',
          type: 'table-lokasi',
          label: 'Lokasi Pantau',
          note: '<span style="color:red"><i>*Isi dengan angka</i></span>',
          required: true,
          columns: [
            { label: 'RW', width: '50px' },
            { label: 'Titik pantau', width: '200px', type: 'number' }
          ],
          rows: [
            { id: 'rw_a', label: 'RW A' },
            { id: 'rw_b', label: 'RW B' },
            { id: 'rw_c', label: 'RW C' },
            { id: 'rw_d', label: 'RW D' }
          ]
        },

        // Lokasi Pantau (RT)
        {
          no: 'C-table2',
          type: 'table-input',
          label: 'Lokasi Pantau (RT)',
          note: '<span style="color:red"><i>*Isi dengan angka</i></span>',
          required: true,
          rows : 4,
          columns: [
            { label: 'RT A', width: '20px', type: 'number' },
            { label: 'RT B', width: '20px', type: 'number' },
            { label: 'RT C', width: '20px', type: 'number' }
          ],
        },
      ]
    },
    // Tabel jumlah penduduk/rumah
        {
          no: 'C-table3',
          type: 'table-input',
          label: 'jumlah penduduk & rumah sesuai titik pantau',
          note: '<span style="color:red"><i>*Isi dengan angka</i></span>',
          required: true,
          rows : 2,
          hasLeftLabels: true,
          rowLabels: ['Jumlah Penduduk', 'Jumlah Rumah/Suma/Wuwung'],
          columns: [
            { label: 'RT A', width: '120px', type: 'number' },
            { label: 'RT B', width: '120px', type: 'number' },
            { label: 'RT C', width: '120px', type: 'number' },
            { label: 'RT D', width: '120px', type: 'number' }
          ],
        },
    

    // ================== C1 ==================
{
      no: 'C1',
      displayNo: '1',
      label: 'Tersedia tempat sampah terpilah di setiap rumah',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i>*atau punya kantong sampah anorganik terpakai</i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 3,
      rws: ['Ada, belum terpilah / belum berfungsi baik',
            'Ada, terpilah dengan baik ≥20% rumah di lokasi pantau*',
            'Ada, terpilah dengan baik ≥40% rumah di lokasi pantau*',
            'Ada, terpilah dengan baik >60% rumah di lokasi pantau*'],
      rwInfo: ('RW A', 'RW B ', 'RW C', 'RW D'),
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',
      },
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 }, // Normalized scores (0-1)
},

    // ================== C2 ==================
    {
      no: 'C2',
      displayNo: '2',
      label: 'Presentase jumlah KK yang memiliki komposter/takakura/gali tutup tanah/serupa yang berfungsi di lokasi pantau',
      note: '',
      type: 'rwChoice4',
      required: true,
      weight: 10, // total 10 poin
      rws: ['≤ 30 % dari jumlah KK',
            '31 % s/d 60 % dari jumlah KK',
            '≥ 60 % dari  jumlah KK dan berfungsi baik di lokasi pantau',
            '≥ 60 % dari  jumlah KK dan berfungsi baik di lokasi pantau serta ada bukti hasil kompos'], 
      rwsinfo: ('RW A','RW B','RW C','RW D'), 
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },
  

    // ================== C3 ==================
    {
      no: 'C3',
      displayNo: '3',
      label: 'Jumlah lubang resapan biopori atau sejenisnya (daerah khusus) yang berfungsi untuk komposter',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i>*Indikator: lubang resapan biopori mudah dibuka dan ditutup serta berisi sampah</i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 5,
      rws: ['≤ 5 lubang resapan biopori',
            '6 s/d 10 lubang resapan biopori',
            '11 s/d 20 lubang resapan biopori',
            '≥ 20 lubang resapan biopori'], 
      rwsinfo: ('RW A','RW B','RW C','RW D'), 
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },

    // ================== C4 ==================
    {
      no: 'C4',
      displayNo: '4',
      label: 'Bank Sampah sebagai upaya pengelolaan sampah kering/anorganik',
      note: '',
      type: 'rwChoice4',
      required: true,
      weight: 10, 
      rws: ['Ada Bank Sampah tapi tidak beroperasi',
            'Bank Sampah memiliki  ≤ 30 %  nasabah dari jumlah KK RW',
            'Bank Sampah memiliki 31 % s/d 50 % nasabah dari jumlah KK RW',
            'Bank Sampah memiliki  ≥ 51 % nasabah dari  jumlah KK RW'], 
      rwsinfo: ('RW A','RW B','RW C','RW D'), 
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },
    {
      no: 'C4-table',
      type: 'table-input',
      label: '',
      required: true,
      rows: 4,
      hasLeftLabels: true,
      rowLabels: [
        'Bank Sampah RW A, dengan nama :',
        'Bank Sampah RW B, dengan nama :',
        'Bank Sampah RW C, dengan nama :',
        'Bank Sampah RW D, dengan nama :'
      ],
      headerLeftLabel: 'Catatan (wajib diisi)',
      columns: [
        { 
          label: 'Nama',
          type: 'text',
          width: '200px',
          required: true
        },
        { 
          label: 'Kapasitas (Kg/bulan)',
          type: 'number',
          width: '150px',
          required: true
        },
      ],
      firstRowEmpty: false 
    },

    // ==================  C5  ==================
    {
      no: 'C5',
      displayNo: '5',
      label: 'Tempat penampungan sampah sementara (TPS)',
      note: '<span style="color:red"><i>*Pilih salah satu</i></span>',  
      type: 'radio',
      required: true,
      weight: 10,
      options: [
        { value:'a', label:'a) Memiliki TPS, tapi masih ditemukan Pembakaran sampah/pembuangan sampah di lingkungan', score: 0.25 },
        { value:'b', label:'b) Memiliki TPS, dan tidak ditemukan pembakaran sampah/pembuangan sampah di lingkungan', score: 0.50 },
        { value:'c', label:'c) Memiliki TPS3R, tapi tidak ada data pengurangan sampah', score: 0.75, showTable: true },
        { value:'d', label:'d) Memiliki TPS3R dan ada kegiatan pengelolaan sampah', score: 1.00, showTable: true },
      ]
    }, 
    // Isian wajib jika memilih c/d
    {
      no: 'C5-table',
      type: 'conditional-table',
      label: 'Jumlah sampah yang dikelola di TPS/TPS3R',
      dependsOn: 'C5',
      showOn: ['c', 'd'],
      required: true,
      columns: [
        { 
          label: 'Jumlah sampah yang dikelola di TPS/TPS3R',
          rowspan: 2,
          width: '250px'
        },
        { 
          label: 'Organik',
          input: { name: 'C5_organik', type: 'number', unit: 'kg/bulan', required: true }
        },
        { 
          label: 'Anorganik',
          input: { name: 'C5_anorganik', type: 'number', unit: 'kg/bulan', required: true }
        }
      ]
    },
    

    // ================== C6 ==================
    {
      no: 'C6',
      displayNo: '6',
      label: 'Prosentase pengurangan sampah sebelum dan setelah melaksanakan pengelolaan sampah secara 3R (pembatasan, komposting, menggunakan kembali, daur ulang, dll)',
      note: '',
      type: 'rwChoice4',
      required: true,
      weight: 5, // total 3 poin
      rws: ['Prosentase pengurangan ≤ 10%',
            'Prosentase pengurangan ≥ 11% dan/atau ≤ 20%',
            'Prosentase pengurangan ≥ 21% dan/atau ≤ 30%',
            'Prosentase pengurangan ≥ 31%'], 
      rwsinfo: ('RW A','RW B','RW C','RW D'), 
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0, b:0.50, c:0.75, d:1.00 },
    },

{
    no: 'C6-table',
    type: 'table-input-2col',
    label: '',
    required: true,
    rows: 4,
    hasLeftLabels: true,
    rowLabels: [
      'Jumlah pengurangan sampah di RW A:',
      'Jumlah pengurangan sampah di RW B:',
      'Jumlah pengurangan sampah di RW C:',
      'Jumlah pengurangan sampah di RW D:'
    ]
},
  {
    no: 'c6-table-5col',
    type: 'table-input-5col',
    label: 'Perhitungan Presentase Pengurangan Sampah ',
    required: true,
    rows: 4,  // jumlah row labels
    hasLeftLabels: true,
    rowLabels: ['Jumlah Penduduk tiap RW', 'Estimasi Timbulan Sampah (sesuai jenis kota/kabupaten)', 'Jumlah Pengurangan Sampah (kg/bulan)', 'Presentase Pengurangan (kg/bulan)'],
    columns: [
      { label: 'RW A', width: '120px', type: 'number' },
      { label: 'RW B', width: '120px', type: 'number' },
      { label: 'RW C', width: '120px', type: 'number' },
      { label: 'RW D', width: '120px', type: 'number' },
    ],
    // custom renderer untuk 2 row (Estimasi Timbulan)
    renderRow2: function(cell) {
        return `<select class="w-full p-2 border rounded" onchange="calculatePercentage(this)">
            <option value="0.4">Kota Kecil ≈ 0.4 Kg/org/Hr</option>
            <option value="0.5">Kota Sedang ≈ 0.5 Kg/org/Hr</option>
            <option value="0.6">Kota Besar ≈ 0.6 Kg/org/Hr</option>
            <option value="0.7">Kota Metropolitan ≈ 0.7 Kg/Org/Hr</option>
        </select>`;
    }
},
    // ================== C7 ==================
    {
      no: 'C7',
      displayNo: '7',
      label: 'Mempunyai inovasi/kreatifitas pengelolaan sampah 3R (Sebutkan)',
      note: '',
      type: 'rwChoice4',
      required: true,
      weight: 2.5, // total 3 poin
      rws: ['Tidak ada',
            'Ada inovasi 1 -  2  jenis',
            'Ada inovasi  3 - 4 jenis',
            'Ada inovasi lebih dari 4 jenis'], 
      rwsinfo: ('RW A','RW B','RW C','RW D'), 
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0, b:0.50, c:0.75, d:1.00 },
      showTableOn: ['b', 'c', 'd']
    },
    {
      no: 'C7-table',
      type: 'table-input',
      label: '',
      required: true,
      rows: 5,
      hasLeftLabels: true,
      showOn: ['b', 'c', 'd'],
      rowLabels: [
        'Inovasi 1 : ',
        'Inovasi 2 : ',
        'Inovasi 3 : ',
        'Inovasi 4 : ',
        'Inovasi 5 :'
      ],
      columns: [
        { 
          label: 'RW A',
          type: 'text',
          width: '200px'
        },
        { 
          label: 'RW B',
          type: 'text',
          width: '200px'
        },
        { 
          label: 'RW C',
          type: 'text',
          width: '200px'
        },
        { 
          label: 'RW D',
          type: 'text',
          width: '200px'
        },
      ],
      firstRowEmpty: false,
      leftLabelWidth: '60px',
      className: 'hidden' //hide by default
    },

    // ================== C8 ==================
    {
      no: 'C8',
      displayNo: '8',
      label: 'Kondisi kebersihan drainase/sungai/got/saluran air',
      note: '',
      type: 'rwChoice4',
      required: true,
      weight: 2, 
      rws: ['A) Kotor, dipenuhi sedimen & sampah',
            'B) Ada sedimen tanpa sampah',
            'C) Drainase tertutup tapi lancar',
            'D) Saluran drainase terbuka, bersih, dan lancar'],  
      rwInfo: 'RW A • RW B • RW C • RW D',
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0, b:0.50, c:0.75, d:1.00 },
    },
  ]
},

{
  title: 'D. PENGELOLAAN RUANG TERBUKA HIJAU',
  items: [
    {
      no: 'D1',
      displayNo: '1',
      label: 'Penataan Jalan/Gang',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 2, 
      rws: ['Bersih',
            'Bersih, tertata, dan asri ',
            'Bersih, tertata, asri, dan dilengkapi fasilitas pengelolaan sampah',
            'Bersih, tertata, asri, dilengkapi fasilitas pengelolaan sampah dan rindang'],   // 4 baris
      rwInfo: 'RW A • RW B • RW C • RW D',
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0.25, b:0.50, c:0.75, d:1.00},
    },
    {
      no: 'D2',
      displayNo: '2',
      label: 'Kondisi penghijauan di sepanjang jalan, taman, dan fasilitas umum',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 2,
      rws: ['Terdapat penghijauan, tapi tidak ada pohon peneduh',
            'Terdapat penghijauan dan pohon peneduh ≤ 30 % luas area',
            'Terdapat penghijauan dan pohon peneduh 31 % s/d 61% luas area',
            'Terdapat penghijauan dan pohon peneduh ≤ 61 % luas area'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },

    {
      no: 'D3',
      displayNo: '3',
      label: 'Pemanfaatan lahan pekarangan di masing-masing rumah untuk ketahanan pangan melalui pertanian/perikanan/peternakan',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 2,
      rws: ['≤ 30 % rumah melakukan pemanfaatan pekarangan',
            '31 % s/d 60% rumah melakukan pemanfaatan pekarangan',
            '≥ 61 % rumah melakukan pemanfaatan pekarangan',
            '≥ 61% rumah melakukan pemanfaatan pekarangan dan ada peningkatan pendapatan masyarakat dari pemanfaatan pekarangan'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },

    {
      no: 'D4',
      displayNo: '4',
      label: 'Mempunyai lahan percontohan untuk Urban Farming melalui budidaya tanaman/peternakan/perikanan dalam rangka peningkatkan ketersediaan pangan di lahan fasilitas umum milik RT/RW/Desa/Kelurahan',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 1,
      rws: ['Ada lahan urban farming untuk 1 jenis budidaya',
            'Ada lahan urban farming untuk 2 jenis budidaya',
            'Ada lahan urban farming untuk 2 jenis budidaya dan dapat menambah pendapatan masyarakat',
            'Ada lahan urban farming untuk 2 jenis budidaya dan dapat menambah pendapatan masyarakat serta meningkatkan pelestarian lingkungan'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },

    {
      no: 'D5',
      displayNo: '5',
      label: 'Pengelolaan potensi lokal, yaitu berbagai upaya perlindungan, pengembangan dan pemanfaatan tanaman dan hewan lokal yang dapat mendukung peningkatan ketahanan pangan',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 1,
      rws: ['1 upaya pengelolaan potensi lokal',
            '2 upaya pengelolaan potensi lokal',
            '3 upaya pengelolaan potensi lokal',
            '3 upaya pengelolaan potensi lokal dan telah ada hasilnya'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },

    {
      no: 'D6',
      displayNo: '6',
      label: 'Adanya pemasangan slogan - slogan tentang lingkungan hidup yang memotivasi pengelolaan lingkungan',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 2,
      rws: ['1 - 3 slogan',
            '4 - 6 slogan',
            '7 - 8 slogan',
            '> 8 slogan'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },
  ]
},

{
  title: 'E. KONSERVASI ENERGI',
  items: [
    {
      no: 'E1',
      displayNo: '1',
      label: 'Mempunyai pemanfaatan energi terbarukan, misalkan: Biogas, Solar Cell, BBM dari Plastik, Microhydro, dll',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 5,
      rws: ['1 penghematan energi',
            '2 penghematan energi',
            '3 penghematan energi',
            '4 penghematan energi'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },
    
    {
      no: 'E2',
      displayNo: '2',
      label: 'Upaya penghematan energi diterapkan melalui: perilaku hemat energi, menggunakan lampu hemat energi (lampu pijar), memaksimalkan pencahayaan alami (jendela, genteng kaca, dll)',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 5,
      rws: ['≤ 20 % rumah melakukan upaya penghematan energi',
            '21 % s/d 40 %  rumah melakukan upaya penghematan energi',
            '41 % s/d 60 %  rumah melakukan upaya penghematan energi',
            '≥ 60 % rumah melakukan upaya penghematan energi'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },
  ]
},

{
  title: 'F. KONSERVASI AIR',
  items: [
   {
      no: 'F1',
      displayNo: '1',
      title: 'F. KONSERVASI AIR',
      label: 'Melakukan upaya peresapan dan  pemanenan air hujan untuk mengatasi kekeringan melalui  sumur resapan, lubang resapan biopori, embung, penampungan air hujan, dll',
      note: '',
      type: 'rwChoice4',
      required: true,
      weight: 5, 
      rws: ['1 upaya peresapan dan  pemanenan air hujan',
            '2 upaya peresapan dan  pemanenan air hujan',
            '3 upaya peresapan dan  pemanenan air hujan ',
            '4 upaya peresapan dan  pemanenan air hujan '], 
      rwsinfo: ('RW A','RW B','RW C','RW D'), 
      legend: {
        a: '',
        b: '',
        c: '',
        d: '',   
      },
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
      showTableOn: true,
      linkedTable: 'F1-table'
    },
    {
      no: 'F1-table',
      type: 'table-input',
      label: '',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i>Tuliskan jenis upaya di kolom bawah(Wajib diisi)</i></span>',
      required: true,
      rows: 5,
      hasLeftLabels: true,
      id: 'F1-table',
      className: 'hidden', 
      showOn: ['a', 'b', 'c', 'd'],
      rowLabels: [
        'Upaya 1 : ',
        'Upaya 2 : ',
        'Upaya 3 : ',
        'Upaya 4 : ',
        'Upaya 5 :'
      ],
      columns: [
        { 
          label: 'RW A',
          type: 'text',
          width: '200px'
        },
        { 
          label: 'RW B',
          type: 'text',
          width: '200px'
        },
        { 
          label: 'RW C',
          type: 'text',
          width: '200px'
        },
        { 
          label: 'RW D',
          type: 'text',
          width: '200px'
        },
      ],
      firstRowEmpty: false,
      leftLabelWidth: '60px',
    },

    {
      no: 'F2',
      displayNo: '2',
      label: 'Melakukan upaya pengolahan air limbah rumah tangga',
      note: '<span class="text-sm mb-1" style="color:#FF0000"><i></i></span>',
      type: 'rwChoice4',
      required: true,
      weight: 5,
      rws: ['Memiliki instalasi pengolahan air limbah rumah tangga, tapi tidak berfungsi',
            'Memiliki instalasi pengolahan air limbah rumah tangga yang berfungsi tanpa dilengkapi pemanfaatannya',
            'Memiliki instalasi pengolahan air limbah rumah tangga yang berfungsi dan dilengkapi pemanfaatannya',
            'Memiliki instalasi pengolahan air limbah rumah tangga yang berfungsi dan dilengkapi pemanfaatannya dan sudah dilaksanakan uji laboratorium'],
      rwInfo: 'RW A • RW B • RW C • RW D',
      scores: { a:0.25, b:0.50, c:0.75, d:1.00 },
    },
  ]
}

  ];

  // Kategori total (atur ambang sesuai aturan resmi)
  var CATEGORY_RULES = [
    { name: 'Mandiri', min: 80 },
    { name: 'Madya',   min: 60 },
    { name: 'Pratama', min: 40 }
  ];

  // ==============  B. RENDER & LOGIC  =================
  var form = document.getElementById('formPM');
  var dotsWrap = document.getElementById('stepDots');
  var totalSkorEl = document.getElementById('totalSkor');
  var sectionSkorEl = document.getElementById('sectionSkor');
  var kategoriOutEl = document.getElementById('kategoriOut');

  var idx = 0; // step index

  function render() {
    form.innerHTML = '';
    
    // Render normal form sections
    for (var s = 0; s < FORM_CONFIG.length; s++) {
        var section = FORM_CONFIG[s];
        var el = document.createElement('section');
        el.className = 'card p-6';
        el.setAttribute('data-step', String(s + 1));
        var html = '<h2 class="text-xl font-bold text-emerald-800">' + esc(section.title) + '</h2>';
        html += '<div class="mt-4 space-y-5">';
        for (var i = 0; i < section.items.length; i++) {
            html += fieldHTML(section.items[i]);
        }
        html += '</div>';
        form.appendChild(el);
        el.innerHTML = html;
    }

    // Add upload section as the last step
    var uploadSection = document.createElement('section');
    uploadSection.className = 'card p-6 hidden';
    uploadSection.setAttribute('data-step', String(FORM_CONFIG.length + 1));
    
    var uploadHtml = `
        <div class="space-y-6">
            <!-- Preview Card -->
            <div class="p-4 rounded-xl border bg-[var(--bg-soft)]">
                <h3 class="font-semibold text-emerald-800 mb-2">Pratinjau Data Kondisi</h3>
                <ul class="list-disc pl-6 text-gray-700 space-y-2">
                    <li>Pastikan jawaban yang Anda isi sudah benar</li>
                    <li>Periksa data kondisi yang sudah Anda jawab</li>
                    <li>Siapkan dokumen pendukung yang diperlukan</li>
                </ul>
            </div>

            <!-- Upload Card -->
            <div class="p-6 border rounded-xl">
                <h3 class="font-semibold text-emerald-800 mb-4">File Pendukung</h3>
                <div class="space-y-4">
                    <input id="file-upload" type="file" accept=".zip,.rar" class="hidden">
                    
                    <div class="text-sm text-gray-600">
                        <p>Upload 1 file dengan format ZIP/RAR</p>
                        <p>Maksimum 5MB</p>
                    </div>

                    <button type="button" onclick="document.getElementById('file-upload').click()" 
                            class="inline-flex items-center gap-2 border rounded-xl px-4 py-2 text-emerald-700 border-emerald-200 hover:bg-emerald-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 17h10v2H7zm5-14l5 5h-3v4h-4V8H7z"/>
                        </svg>
                        Pilih File
                    </button>

                    <div id="file-name" class="text-sm text-gray-700 mt-2"></div>
                </div>
            </div>
        </div>
    `;

    uploadSection.innerHTML = uploadHtml;
    form.appendChild(uploadSection);

    // Navigation buttons
    var nav = document.createElement('div');
    nav.className = 'flex flex-wrap items-center justify-between gap-3 mt-6';
    nav.innerHTML =
        '<button type="button" class="btn btn-secondary hidden" id="prevStep">‹ Sebelumnya</button>' +
        '<div class="flex gap-2">' +
        '<button type="submit" class="btn btn-primary hidden" id="submitForm">Kirim</button>' +
        '</div>' +
        '<button type="button" class="btn btn-secondary" id="nextStep">Berikutnya ›</button>';
    form.appendChild(nav);

    // Setup event handlers
    setupStepper();
    wireTimbulan();
    setupCheckboxRequired();
    setupFileUpload();

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        var fileInput = document.getElementById('file-upload');
        if (!fileInput.files.length) {
            alert('Silakan pilih file pendukung terlebih dahulu');
            return;
        }
        alert('Data siap dikirim. (Integrasi backend/Laravel menyusul)');
    });

    recalcAll();
}

// Add file upload handler
function setupFileUpload() {
    var fileInput = document.getElementById('file-upload');
    var fileLabel = document.getElementById('file-name');

    fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('Ukuran file melebihi 5MB');
                fileInput.value = '';
                fileLabel.textContent = '';
                return;
            }
            fileLabel.textContent = file.name;
        } else {
            fileLabel.textContent = '';
        }
    });
}
  function fieldHTML(f) {
    var req = f.required ? '<span class="text-red-600">*</span>' : '';
    var name = esc(f.no); // Use unique ID for name attribute
    var html = '';

    if (f.type === 'radio') {
        html += '<div>';
        // Use displayNo for showing the number
        var displayNo = f.displayNo || f.no.replace(/[A-Z]/g, '');
        html += '<p class="font-semibold mb-2">' + esc(displayNo) + '. ' + esc(f.label) + ' ' + req + '</p>';
        if (f.note) {
          html += '<p class="text-sm text-gray-500 mt-2">'+ f.note +'</p>';
        }
        html += '<div class="space-y-2">';
        for (var i=0; i<(f.options||[]).length; i++){
          var op = f.options[i];
          html += '<label class="flex items-start gap-3">';
          html += '<input type="radio" class="mt-1" name="'+name+'" value="'+esc(op.value)+'" '+
                  (f.required?'required':'')+' data-weight="'+(f.weight||0)+'" '+
                  'data-score="' + (op.score != null ? op.score : '') + '" ' +
                  (op.showTable ? 'data-show-table="true"' : '') + '>';
          html += '<span>'+esc(op.label)+'</span>';
          html += '</label>';
        }
        html += '</div></div>';
        // Event listener tombol soal c5
        if (f.no === 'C5') {
          setTimeout(function() {
            var radioButtons = document.querySelectorAll('input[name="C5"]');
            var tableDiv = document.getElementById('C5-table');
            if (tableDiv && radioButtons) {
              radioButtons.forEach(function(radio) {
                radio.addEventListener('change', function() {
                  tableDiv.classList.toggle('hidden', !['c', 'd'].includes(this.value));
                });
              });
            }
          }, 100);
        }
        return html;
    }

    //  Pastikan conditional-table handler selevel dengan handler lainnya
    if (f.type === 'conditional-table') {
      html += '<div class="hidden mt-4" id="' + f.no + '">';
      html += '<div class="overflow-x-auto">';
      html += '<table class="border-collapse border w-full">';
      
      // Row pertama dengan merged cell dan background abu-abu
      html += '<tr>';
      html += '<td rowspan="2" class="border px-4 py-2 bg-gray-50" style="width: 250px">Jumlah sampah yang dikelola di TPS/TPS3R</td>';
      html += '<td class="border px-4 py-2 text-center bg-gray-50">Organik</td>';
      html += '<td class="border px-4 py-2 text-center bg-gray-50">Anorganik</td>'; 
      html += '</tr>';
      
      // Second row with input fields
      html += '<tr>';
      html += '<td class="border px-4 py-2">';
      html += '<div class="flex items-center gap-2">';
      html += '<input type="number" name="' + f.no + '_organik" class="w-full p-2 text-center border rounded" min="0" placeholder="0">';
      html += '<span class="text-sm text-gray-500">kg/bulan</span>';
      html += '</div>';
      html += '</td>';
      html += '<td class="border px-4 py-2">';
      html += '<div class="flex items-center gap-2">';
      html += '<input type="number" name="' + f.no + '_anorganik" class="w-full p-2 text-center border rounded" min="0" placeholder="0">';
      html += '<span class="text-sm text-gray-500">kg/bulan</span>';
      html += '</div>';
      html += '</td>';
      html += '</tr>';
      
      html += '</table>';
      
      // note berwarna merah
      html += '<p class="text-sm mt-2" style="color:#FF0000"><i>*Catatan wajib diisi apabila memilih poin c dan d</i></p>';

      html += '</div></div>';
      return html;
}
    
    // === MATRIX (angka dalam tabel) ===
    if (f.type === 'matrix') {
      var r = f.rows || [];  // label baris
      var c = f.cols || [];  // label kolom
      html += '<div>';
      html += '<p class="font-semibold mb-2">'+ esc(f.no) +'. '+ esc(f.label) + (f.required? ' <span class="text-red-600">*</span>' : '') +'</p>';
      html += '<div class="overflow-auto"><table class="min-w-[560px] w-full border border-[var(--border)] rounded-xl">';
      // header
      html += '<thead><tr><th class="px-3 py-2 text-left bg-[var(--bg-soft)] border-b border-[var(--border)]"> </th>';
      for (var ci=0; ci<c.length; ci++){
        html += '<th class="px-3 py-2 text-center bg-[var(--bg-soft)] border-b border-[var(--border)]">'+ esc(c[ci]) +'</th>';
      }
      html += '</tr></thead><tbody>';
      // rows
      for (var ri=0; ri<r.length; ri++){
        html += '<tr>';
        html += '<td class="px-3 py-2 font-medium border-t border-[var(--border)]">'+ esc(r[ri]) +'</td>';
        for (var cj=0; cj<c.length; cj++){
          var cellName = esc(f.no + '_' + (ri+1) + '_' + (cj+1));
          html += '<td class="px-2 py-2 text-center border-t border-[var(--border)]">';
          html +=   '<input type="number" min="0" step="1" class="input !p-2 !text-base w-28 mx-auto" name="'+ cellName +'">';
          html += '</td>';
        }
        html += '</tr>';
      }
      html += '</tbody></table></div>';
      if (f.help) html += '<p class="text-sm text-gray-500 mt-2">'+ esc(f.help) +'</p>';
      html += '</div>';
      return html;
    }

    if (f.type === 'checkbox') {
      html += '<div>';
      html += '<p class="font-semibold mb-2">' + esc(f.no) + '. ' + esc(f.label) + ' ' + req + '</p>';
      // Opsi notes
      if (f.note) {
        html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
      }
      html += '<div class="space-y-2">';
      for (var idx = 0; idx < (f.options || []).length; idx++) { 
        var option = f.options[idx]; // Gunakan 'idx' sebagai indeks
        var requiredAttr = ''; 
        if (f.required && idx === 0) requiredAttr = ' required';
        var groupAttribute = f.required ? ' data-required-group="1"' : ''; 
        
        html += '<label class="flex items-start gap-3">';
        html += '<input type="checkbox" class="mt-1" name="' + name + '" value="' + esc(option.value) + '"' + 
                requiredAttr + groupAttribute + 
                ' data-weight="' + (f.weight || 0) + '" data-score="' + (option.score != null ? option.score : '') + '"' +
                (option.hasDetail ? ' data-has-detail="true"' : '') + '>';
        html += '<span>' + esc(option.label) + '</span>';
        html += '</label>';

        if (option.hasDetail) {
          html += '<div class="ml-8 mt-2 hidden detail-input" id="detail-' + name + '-' + option.value + '">';
          html += '<input type="text" class="input w-full" name="' + name + '_detail_' + option.value + '" placeholder="Sebutkan lainnya...">';
          html += '</div>';
        }
      }
      html += '</div></div>';

      setTimeout(function() {
        var checkboxes = form.querySelectorAll('input[type="checkbox"][data-has-detail="true"]');
        checkboxes.forEach(function(checkbox) {
          checkbox.addEventListener('change', function() {
            var detailId = 'detail-' + name + '-' + this.value;
            var detailDiv = document.getElementById(detailId);
            if (detailDiv) {
              detailDiv.classList.toggle('hidden', !this.checked);
            }
          });
        });
      }, 0);

      return html;
    }

    if (f.type === 'select'){
      html += '<div>';
      html += '<label class="label">'+ esc(f.no) +'. '+ esc(f.label) +' '+ req +'</label>';
      html += '<select name="'+name+'" class="input" '+(f.required?'required':'')+'>';
      for (var j=0; j<(f.options||[]).length; j++){
        html += '<option value="'+esc(f.options[j].value)+'">'+esc(f.options[j].label)+'</option>';
      }
      html += '</select></div>';
      return html;
    }

    if (f.type === 'textarea'){
      html += '<div>';
      html += '<label class="label">'+ esc(f.no) +'. '+ esc(f.label) +' '+ req +'</label>';
      html += '<textarea name="'+name+'" rows="'+(f.rows||3)+'" class="input" '+(f.required?'required':'')+'></textarea>';
      html += '</div>';
      return html;
    }

    if (f.type === 'number' || f.type === 'text'){
      html += '<div>';
      html += '<label class="label">'+ esc(f.no) +'. '+ esc(f.label) +' '+ req +'</label>';
      html += '<input name="'+name+'" type="'+(f.type==='number'?'number':'text')+'" class="input" '+(f.required?'required':'')+' data-weight="'+(f.weight||0)+'">';
      html += '</div>';
      return html;
    }
    
    // === KADER10: 10 isian + "11 dst" multi-isian ===
    if (f.type === 'kader10') {
      var nameBase = esc(f.no);
      var k; 
      html += '<div>';
      html += '<p class="font-semibold mb-2">' + esc(f.no) + '. ' + esc(f.label) + (f.required ? ' <span class="text-red-600">*</span>' : '') + '</p>';
      // Tambahkan note di sini (setelah pertanyaan, sebelum pilihan)
      if (f.note) {
        html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
      }
      html += '<div class="overflow-auto">';
      html += '<table class="min-w-[560px] w-full border border-[var(--border)] rounded-xl">';
      html += '<thead><tr>';
      html += '<th class="px-3 py-2 border bg-[var(--bg-soft)] text-left">No</th>';
      html += '<th class="px-3 py-2 border bg-[var(--bg-soft)] text-left">Nama/Uraian Kader Aktif</th>';
      html += '</tr></thead><tbody>';

      // No. 1–10: input satuan
      for (k = 1; k <= 10; k++) { // Gunakan 'k' sebagai variabel loop
        html += '<tr>';
        html += '<td class="px-3 py-2 border">' + k + '</td>';
        html += '<td class="px-3 py-2 border">';
        html += '<input type="text" name="' + nameBase + '_' + k + '" class="input w-full" placeholder="Kader ' + k + '">';
        html += '</td>';
        html += '</tr>';
      }

      // No. 11: dan seterusnya (multi-isian)
      html += '<tr>';
      html += '<td class="px-3 py-2 border align-top">11</td>';
      html += '<td class="px-3 py-2 border">';
      html += '<textarea name="' + nameBase + '_11_plus" rows="3" class="input w-full" placeholder="Masukkan kader ke-11 dan seterusnya. Pisahkan dengan enter atau koma."></textarea>';
      html += '<p class="text-sm text-gray-500 mt-1 italic">dan seterusnya untuk kader aktif lebih dari 10</p>';
      html += '</td>';
      html += '</tr>';

      html += '</tbody></table>';
      html += '</div>';
      html += '<p class="text-sm text-gray-500 mt-2">';
      html += 'Skor otomatis: &lt;4 kader = 25%, 5–7 = 50%, 8–10 = 75%, &gt;10 = 100% (bobot ' + (f.weight || 2) + ')';
      html += '</p>';
      html += '</div>';
      return html;
    }

    // === RW CHOICE 4 (baris = RW A..C, kolom = A..D menyamping) ===
    if (f.type === 'rwChoice4') {
        var rws = f.rws || ['RW A','RW B','RW C', 'RW D'];
        var scores = f.scores || {a:0.25, b:0.50, c:0.75, d:1.00};

        html += '<div>';
        // Gunakan displayNo untuk menampilkan nomor
        html += '<p class="font-semibold mb-2">'+ 
                (f.displayNo || f.no.replace(/[A-Z]/g, '')) + 
                '. '+ esc(f.label) + 
                (f.required ? ' <span class="text-red-600">*</span>' : '') +'</p>';

        if (f.note) {
            html += f.note;
        }

        html += '<div class="overflow-x-auto">';
        html += '<table class="min-w-[600px] border border-collapse">';
        
        // Header row
        html += '<thead><tr>';
        html += '<th class="border px-4 py-2 bg-gray-50 text-left">Pertanyaan</th>';
        html += '<th class="border px-4 py-2 bg-gray-50 text-center">RW A</th>';
        html += '<th class="border px-4 py-2 bg-gray-50 text-center">RW B</th>';
        html += '<th class="border px-4 py-2 bg-gray-50 text-center">RW C</th>';
        html += '<th class="border px-4 py-2 bg-gray-50 text-center">RW D</th>';
        html += '</tr></thead>';

        // Body with options
        html += '<tbody>';
        for (var oi = 0; oi < 4; oi++) {
            var v = String.fromCharCode(97 + oi); // a, b, c, d
            var sc = (scores[v] != null ? scores[v] : 0);
            
            html += '<tr>';
            html += '<td class="border px-4 py-2">' + esc(f.rws[oi] || '') + '</td>';
            
            // Radio buttons for each RW
            for (var rwi = 0; rwi < 4; rwi++) {
                var group = esc(f.no + '_' + (rwi+1));
                html += '<td class="border px-4 py-2 text-center">';
                html += '<input type="radio" name="' + group + '" value="' + v + 
                        '" data-score="' + sc + '" ' +
                        (f.required && rwi === 0 ? 'required' : '') + 
                        ' class="cursor-pointer">';
                html += '</td>';
            }
            html += '</tr>';
        }
        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        // handler nomor 4
        if (f.no === 'C4') {
            setTimeout(function() {
                var radioButtons = document.querySelectorAll('input[name^="4_"]');
                var tableDiv = document.getElementById('C4-table');
                var tableInputs = tableDiv ? tableDiv.querySelectorAll('input') : [];
                
                if (tableDiv && radioButtons) {
                    radioButtons.forEach(function(radio) {
                        radio.addEventListener('change', function() {
                            // Make table visible when any option is selected
                            tableDiv.classList.remove('hidden');
                            
                            // Make inputs required when any option is selected
                            tableInputs.forEach(function(input) {
                                input.required = true;
                            });
                        });
                    });
                }
            }, 100);
        }
        // handler nomor 7
        if (f.no === 'C7') {
            setTimeout(function() {
                var radioButtons = document.querySelectorAll('input[name^="C7_"]');
                var tableDiv = document.getElementById('C7-table');
                var tableInputs = tableDiv ? tableDiv.querySelectorAll('input') : [];

                if (tableDiv && radioButtons) {
                    // Ensure table is hidden initially
                    tableDiv.classList.add('hidden');
                    
                    radioButtons.forEach(function(radio) {
                        radio.addEventListener('change', function() {
                            var showTable = Array.from(radioButtons)
                                .some(rb => rb.checked && ['b', 'c', 'd'].includes(rb.value));
                            
                            // Use classList instead of style.display
                            if (showTable) {
                                tableDiv.classList.remove('hidden');
                                // input wajib untuk diisi
                                tableInputs.forEach(function(input) {
                                    input.required = true;
                                });
                            } else {
                                tableDiv.classList.add('hidden');
                                // tidak mewajibkan mengisi input jika tabel disembunyikan
                                tableInputs.forEach(function(input) {
                                    input.required = false;
                                });
                            }
                        });
                    });
                }
            }, 100);
        }

        // Handler nomor F1
        if (f.no === 'F1' && f.title === 'F. KONSERVASI AIR') {
            setTimeout(function() {
                var radioButtons = document.querySelectorAll('input[name^="F1_"]');
                var tableDiv = document.getElementById('F1-table');
                
                if (tableDiv && radioButtons) {
                    // Initially hide table
                    tableDiv.classList.add('hidden');
                    
                    radioButtons.forEach(function(radio) {
                        radio.addEventListener('change', function() {
                            // Show table ketika salah satu opsi dipilih
                            tableDiv.classList.remove('hidden');
                            
                            // Wajibkan input
                            var inputs = tableDiv.querySelectorAll('input');
                            inputs.forEach(function(input) {
                                input.required = true;
                            });
                        });
                    });
                }
            }, 100);
        }
        return html;
    }

  if (f.type === 'table-lokasi') {
    html += '<div class="mb-4">'; // Spacing
    html += '<p class="font-semibold mb-2">' + esc(f.label) + '</p>';
    if (f.note) {
        html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
    }
    html += '<div class="overflow-x-auto">';
    html += '<table class="min-w-[400px] border border-collapse">';
    
    // Header
    html += '<thead><tr>';
    f.columns.forEach(function(col) {
        html += '<th class="border px-3 py-2 bg-gray-50" style="width: ' + col.width + '">' + esc(col.label) + '</th>';
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    f.rows.forEach(function(row) {
        html += '<tr>';
        html += '<td class="border px-3 py-2 h-[42px]">' + esc(row.label) + '</td>'; // Padding
        html += '<td class="border px-3 py-2 h-[42px]">'; 
        html += '<input type="number" name="' + f.no + '_' + row.id + '" class="w-full input !p-2" min="0">'; // padding
        html += '</td>';
        html += '</tr>';
    });
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
}

  if (f.type === 'table-input') {
    html += '<div class="mb-6 ' + (f.className || '') + '" id="' + (f.id || f.no) + '">';
    html += '<p class="font-semibold mb-2">' + esc(f.label) + '</p>';
    if (f.note) {
      html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
    }
    html += '<div class="overflow-x-auto">';
    html += '<table class="min-w-[400px] border border-collapse">';
    
    // Header
    html += '<thead><tr>';
    if (f.hasLeftLabels) {
      var labelWidth = (f.no === 'C7-table') ? '100px' : '150px';
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: 250px">' + 
              (f.headerLeftLabel ? esc(f.headerLeftLabel) : '') + '</th>';
    }
    f.columns.forEach(function(col) {
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: ' + col.width + '">' + 
              esc(col.label) + '</th>';
    });
    html += '</tr></thead>';
    
    // Body - use rows from config
    html += '<tbody>';
    var numRows = f.rows || 3; // Default to 3 if not specified
    for (var i = 1; i <= numRows; i++) {
      html += '<tr>';
      // row label
      if (f.hasLeftLabels && f.rowLabels) {
          if (f.no === 'C7-table') {
              // For C7-table, use a narrower cell width
              html += '<td class="border px-4 py-2 font-medium" style="width: 60px !important">' + 
                      (f.rowLabels[i-1] ? esc(f.rowLabels[i-1]) : '') + '</td>';
          } else {
              // For other tables, use default width
              html += '<td class="border px-4 py-2 font-medium" style="width: 250px">' + 
                  (f.rowLabels[i-1] ? esc(f.rowLabels[i-1]) : '') + '</td>';
          }
      }
      // In the table-input handler
      f.columns.forEach(function(col, j) {
          html += '<td class="border px-4 py-2">';
          html += '<input type="' + col.type + '" name="' + f.no + '_row' + i + '_col' + (j+1) + 
                  '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                  (col.type === 'number' ? 'min="0" placeholder="0"' : 'placeholder="Masukkan teks"') + 
                  ' style="min-width: 100px; width: 100%;"' +
                  (f.required ? ' required' : '') + '>';
          html += '</td>';
      });
      // In the table-input handler, after table HTML generation
      if (f.no === 'C-table3') {
          setTimeout(function() {
              var populationInputs = document.querySelectorAll('input[name^="C-table3_row1"]');
              populationInputs.forEach(function(input, index) {
                  input.addEventListener('input', function() {
                      // Get the corresponding input in c6-table-5col
                      var targetInput = document.querySelector(`input[name="c6-table-5col_row1_col${index + 1}"]`);
                      if (targetInput) {
                          targetInput.value = this.value;
                          // Trigger calculation if needed
                          var event = new Event('input', {
                              bubbles: true,
                              cancelable: true,
                          });
                          targetInput.dispatchEvent(event);
                      }
                  });
              });
          }, 100);
      }

      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
  }

if (f.type === 'table-input-2col') {
    html += '<div class="mb-6">';
    html += '<p class="font-semibold mb-2">' + esc(f.label) + '</p>';
    if (f.note) {
      html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
    }
    html += '<div class="overflow-x-auto">';
    html += '<table class="min-w-[400px] border border-collapse">';
    
    // Header
    html += '<thead><tr>';
    if (f.hasLeftLabels) {
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: 250px"></th>';
    }
    // 1 collumn
    html += '<th class="border px-4 py-2 bg-gray-50" style="width: 150px">Kapasitas (Kg/bulan)</th>';
    html += '</tr></thead>';
    
    // Body - use rows from config
    html += '<tbody>';
    var numRows = f.rows || 3; // Default to 3 if not specified
    for (var i = 1; i <= numRows; i++) {
      html += '<tr>';
      // row label
      if (f.hasLeftLabels && f.rowLabels) {
        html += '<td class="border px-4 py-2 font-medium">' + 
                (f.rowLabels[i-1] ? esc(f.rowLabels[i-1]) : '') + '</td>';
      }
      // Only 1 column for input cells
      html += '<td class="border px-4 py-2">';
      html += '<input type="number" name="' + f.no + '_row' + i + '_capacity" ' +
              'class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
              'min="0" placeholder="0" style="min-width: 100px; width: 100%;"' +
              (f.required ? ' required' : '') + '>';
      html += '</td>';
      html += '</tr>';
    }
    if (f.no === 'C6-table') {
        setTimeout(function() {
            var reductionInputs = document.querySelectorAll('input[name$="_capacity"]');
            reductionInputs.forEach(function(input, index) {
                input.addEventListener('input', function() {
                    var targetInput = document.querySelector(`input[name="c6-table-5col_row3_col${index + 1}"]`);
                    if (targetInput) {
                        targetInput.value = this.value;
                        // Trigger calculation
                        var event = new Event('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        targetInput.dispatchEvent(event);
                    }
                });
            });
        }, 100);
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
}

  if (f.type === 'table-input-5col') {
    html += '<div class="mb-6">';
    html += '<p class="font-semibold mb-2">' + esc(f.label) + '</p>';
    if (f.note) {
      html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
    }
    html += '<div class="overflow-x-auto">';
    html += '<table class="min-w-[800px] border border-collapse">'; // ukuran min-width untuk 5 columns
    
    // Header
    html += '<thead><tr>';
    if (f.hasLeftLabels) {
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: 200px"></th>';
    }
    // Handle 5 columns
    ['RW A', 'RW B', 'RW C', 'RW D'].forEach(function(label) {
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: 120px">' + label + '</th>';
    });
    html += '</tr></thead>';
    
    // Body - use rows from config
    html += '<tbody>';
    var numRows = f.rows || 3; // Default to 3 if not specified
    for (var i = 1; i <= numRows; i++) {
      html += '<tr>';
      // row label
      if (f.hasLeftLabels && f.rowLabels) {
        html += '<td class="border px-4 py-2 font-medium">' + 
                (f.rowLabels[i-1] ? esc(f.rowLabels[i-1]) : '') + '</td>';
      }
      // Generate 4 columns of input cells
      for (var j = 1; j <= 4; j++) {
        html += '<td class="border px-4 py-2" style="width: 120px">';
        if (i === 2) {
                html += '<select name="' + f.no + '_row' + i + '_col' + j + 
                        '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                        'style="min-width: 100px; width: 100%;" onchange="calculatePercentage(' + j + ')">';
                html += '<option value="0.4">Kota Kecil </option>';
                html += '<option value="0.5">Kota Sedang </option>';
                html += '<option value="0.6">Kota Besar </option>';
                html += '<option value="0.7">Kota Metropolitan </option>';
                html += '</select>';
            } 
            // For row 4 (Presentase)
            else if (i === 4) {
                html += '<input type="number" name="' + f.no + '_row' + i + '_col' + j + 
                        '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                        'readonly style="min-width: 100px; width: 100%;" placeholder="0">';
            }
            // Untuk rows lain, menggunakan input number biasa
            else {
                html += '<input type="number" name="' + f.no + '_row' + i + '_col' + j + 
                        '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                        'min="0" placeholder="0" style="min-width: 100px; width: 100%;" ' +
                        'oninput="calculatePercentage(' + j + ')">';
            }
            html += '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div>' ;
    
    // box informasi di bawah tabel
    html += '<div class="mt-4 p-4 rounded-xl border bg-[var(--bg-soft)]">';

    html += '<p class="text-emerald-800 font-semibold mt-3">';
    html += 'Estimasi Timbulan Sampah berdasarkan Peraturan Menteri LHK No.6 Tahun 2022 tentang SIPSN, sebagai berikut:';
    html += '</p>';
    
    html += '<ul class="list-disc pl-6 text-gray-600 mt-2">';
    html += '<li>Kota Kecil ≈ <strong>0,4</strong> kg/org/hari</li>';
    html += '<li>Kota Sedang ≈ <strong>0,5</strong> kg/org/hari</li>';
    html += '<li>Kota Besar ≈ <strong>0,6</strong> kg/org/hari</li>';
    html += '<li>Kota Metropolitan ≈ <strong>0,7</strong> kg/org/hari</li>';
    html += '</ul>';
    html += '</div>';


    html += '</div>';
    return html;
  }

  if (f.type === 'table-input' && f.firstRowEmpty) {
    html += '<div class="mb-6">';
    html += '<p class="font-semibold mb-2">' + esc(f.label) + '</p>';
    if (f.note) {
      html += '<p class="text-sm text-gray-500 mb-2">'+ f.note +'</p>';
    }
    html += '<div class="overflow-x-auto">';
    html += '<table class="min-w-[400px] border border-collapse">';
    
    // Header
    html += '<thead><tr>';
    if (f.hasLeftLabels) {
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: 250px"></th>';
    }
    f.columns.forEach(function(col) {
      html += '<th class="border px-4 py-2 bg-gray-50" style="width: ' + col.width + '">' + 
              esc(col.label) + '</th>';
    });
    html += '</tr></thead>';
    
    // Body
    html += '<tbody>';
    for (var i = 0; i < f.rows; i++) {
      html += '<tr>';
      // Row label
      if (f.hasLeftLabels && f.rowLabels) {
        html += '<td class="border px-4 py-2 font-medium">' + 
                (f.rowLabels[i] ? esc(f.rowLabels[i]) : '') + '</td>';
      }
      // Input cells (skip first row)
      if (i === 0) {
        f.columns.forEach(function() {
          html += '<td class="border px-4 py-2"></td>'; // Empty cells for first row
        });
      } else {
        f.columns.forEach(function(col, j) {
          html += '<td class="border px-4 py-2">';
          html += '<input type="' + col.type + '" name="' + f.no + '_row' + i + '_col' + (j+1) + 
                  '" class="w-full p-2 text-center border rounded focus:outline-none focus:border-blue-500" ' +
                  (col.type === 'number' ? 'min="0" placeholder="0"' : 'placeholder="Masukkan nama"') + 
                  ' style="min-width: 100px; width: 100%;"' +
                  (f.required ? ' required' : '') + '>';
          html += '</td>';
        });
      }
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div></div>';
    return html;
  }

  if (f.type === 'table-wrapper') {
    html += '<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">';
    f.items.forEach(function(item) {
      html += fieldHTML(item);
    });
    html += '</div>';
    return html;
  }


    html += '<div>';
    html += '<label class="label">'+ esc(f.no) +'. '+ esc(f.label) +' '+ req +'</label>';
    html += '<input name="'+name+'" type="text" class="input" '+(f.required?'required':'')+'>';
    html += '</div>';
    return html;
  }

  // ==============  STEPPER (diubah sesuai kebutuhan tombol)  =================
  function setupStepper(){
    var secs = [].slice.call(form.querySelectorAll('[data-step]'));
    var prevBtn   = form.querySelector('#prevStep');
    var nextBtn   = form.querySelector('#nextStep');
    var submitBtn = form.querySelector('#submitForm');

    // Update the renderDots function in setupStepper()
    function renderDots(){
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      for (var i=0; i<secs.length; i++){
        var d = document.createElement('button'); // Changed from span to button
        d.className = 'step-label hover:bg-emerald-100 transition-colors'; // Added hover effect
        d.setAttribute('role','button');
        d.setAttribute('aria-label', 'Go to section ' + String.fromCharCode(65 + i));
        if (i===idx) {
          d.setAttribute('aria-current','step');
          d.className += ' bg-emerald-100'; // Highlight current step
        }
        d.textContent = String.fromCharCode(65 + i);
        
        // Add click handler
        d.addEventListener('click', function(index) {
          return function() {
            showStep(index);
          };
        }(i));
        
        dotsWrap.appendChild(d);
      }
    }

    function showStep(i){
      idx = Math.max(0, Math.min(secs.length-1, i));
      for (var k=0; k<secs.length; k++){
        secs[k].classList.toggle('hidden', k!==idx);
      }
      // visibilitas tombol
      if (prevBtn)   prevBtn.classList.toggle('hidden', idx === 0);
      if (nextBtn)   nextBtn.classList.toggle('hidden', idx === secs.length - 1);
      if (submitBtn) submitBtn.classList.toggle('hidden', idx !== secs.length - 1);

      renderDots();
      recalcSection();
      window.scrollTo({top:0, behavior:'smooth'});
    }

    if (dotsWrap) dotsWrap.setAttribute('role','list');

    if (prevBtn) prevBtn.addEventListener('click', function(){ showStep(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ showStep(idx + 1); });

    // mulai dari step 0
    showStep(0);

    form.addEventListener('input', function(){ recalcAll(); });
    form.addEventListener('change', function(){ recalcAll(); });
  }

  // ==============  Kalkulasi  =================
 function getValue(name){
    var els = form.querySelectorAll('[name="'+cssEscape(name)+'"]');
    if (!els.length) return null;
    var el0 = els[0];
    if (el0.type === 'radio'){
      for (var i=0; i<els.length; i++){
        if (els[i].checked) return els[i].value;
      }
      return null;
    }
    if (el0.type === 'checkbox'){
      var selected = [];
      for (var j=0; j<els.length; j++){
        if (els[j].checked) selected.push(els[j].value);
      }
      return selected;
    }
    return el0.value;
  }

function recalcAll() {
    var total = 0;
    var currentIdx = idx;

    // Calculate total by using section scores directly
    for (var s = 0; s < FORM_CONFIG.length; s++) {
        // Set active section temporarily
        idx = s;
        // Calculate section score
        recalcSection();
        // Add section score directly to total
        var sectionScore = parseFloat(sectionSkorEl.textContent) || 0;
        total += sectionScore;
    }
    // Restore original index
    idx = currentIdx;
    // Update displays with new category logic
    updateScoreDisplay(total);

    recalcSection();
}

// Update the score display section in fieldHTML() or render()
function updateScoreDisplay(total) {
    if (totalSkorEl) {
        totalSkorEl.textContent = total.toFixed(2);
    }

    try {
        // Read and parse context
        var pmContext = JSON.parse(localStorage.getItem('pm_context') || '{}');
        var menujuKategori = pmContext.menuju_kategori || '';
        
        console.log('Context loaded:', pmContext); // Debug log
        console.log('Selected category:', menujuKategori); // Debug log

        if (kategoriOutEl) {
            if (PASSING_CRITERIA.hasOwnProperty(menujuKategori)) {
                var passingScore = PASSING_CRITERIA[menujuKategori];
                var isPassing = total >= passingScore;
                
                var displayKategori = menujuKategori.charAt(0).toUpperCase() + 
                                    menujuKategori.slice(1).toLowerCase();
                var result = `${displayKategori} (${isPassing ? 'LULUS' : 'TIDAK LULUS'})`;
                
                kategoriOutEl.className = 'text-2xl font-bold ' + 
                    (isPassing ? 'text-emerald-600' : 'text-red-600');
                
                var buktiBtn = document.getElementById('uploadBuktiBtn');
                if (buktiBtn) {
                    buktiBtn.style.display = isPassing ? 'block' : 'none';
                }
                
                kategoriOutEl.textContent = result;
            } else {
                console.warn('Invalid category:', menujuKategori);
                kategoriOutEl.textContent = '-';
                kategoriOutEl.className = 'text-2xl font-bold';
            }
        }
    } catch (err) {
        console.error('Error updating score display:', err);
        if (kategoriOutEl) {
            kategoriOutEl.textContent = '-';
        }
    }
}

function recalcSection(){
  var secs = [].slice.call(form.querySelectorAll('[data-step]'));
  var active = idx;
  var subtotal = 0;

  if (FORM_CONFIG[active]){
    var items = FORM_CONFIG[active].items;
    for (var i=0; i<items.length; i++){
      var f = items[i];
      var w = f.weight || 0;
      if (!w) continue;
      var val = getValue(f.no);
      var sc = 0;

      if (f.type==='radio' || f.type==='select'){
        sc = optionScore(f,val);
      } else if (f.type === 'checkbox'){
        sc = checkboxScore(f);
      } else if (f.type==='number'){
        sc = parseFloat(val||0)?1:0;
      }
      // rwChoice4: rata-rata skor RW A–D
      else if (f.type === 'rwChoice4') {
        var rws  = f.rws || ['RW A','RW B','RW C','RW D'];
        var sum  = 0, cnt = 0;
        for (var rwi=0; rwi<rws.length; rwi++){
          var vcell = getValue(f.no + '_' + (rwi+1));
          if (vcell) {
            var sel = form.querySelector('[name="'+ cssEscape(f.no + "_" + (rwi+1)) +'"]:checked');
            var scv = sel ? parseFloat(sel.getAttribute('data-score') || '0') : 0;
            sum += scv;
            cnt++;
          }
        }
      sc = sum; // Gunakan total sum
      }
      
      /*else if (f.type === 'tableChoice'){
        sc = 0;
      } */
      else if (f.type === 'kader10'){
        var filled = 0;
        for (var kk = 1; kk <= 10; kk++) {
          var v10s = (getValue(f.no + '_' + kk) || '').trim();
          if (v10s) filled++;
        }
        var extraRaw = (getValue(f.no + '_11_plus') || '').trim();
        var extraCount = 0;
        if (extraRaw) {
          extraCount = extraRaw.split(/[\n,;]+/).filter(function(s){ return s.trim().length > 0; }).length;
        }
        var totalFilled = filled + extraCount;
        var pct = 0;
        if (totalFilled > 10) { pct = 1.0; }
        else if (totalFilled >= 8) { pct = 0.75; }
        else if (totalFilled >= 5) { pct = 0.50; }
        else if (totalFilled >= 1) { pct = 0.25; }
        sc = pct;
      }

      subtotal += (sc * w);
    }
  }
  var currentSectionTitle = FORM_CONFIG[active].title;
  var componentLetter = currentSectionTitle.charAt(0); // Get first letter (A, B, C, etc)
  sectionSkorEl.previousElementSibling.textContent = 'Skor Komponen ' + componentLetter;
  sectionSkorEl.textContent = String(subtotal);
}
function checkboxScore(f){
    var selector = '[name="' + cssEscape(f.no) + '"]:checked';
    var nodes = form.querySelectorAll(selector);
    var selectedCount = nodes.length;

    // Logika untuk nomor 2b
    if (f.no === '2') {
        var percentage = 0;
        if (selectedCount === 1) {
            percentage = 0.25; 
        } else if (selectedCount >= 2 && selectedCount <= 3) {
            percentage = 0.50; 
        } else if (selectedCount >= 4 && selectedCount <= 5) {
            percentage = 0.75; 
        } else if (selectedCount >= 6) {
        percentage = 1.0;
        }
        return percentage * 2; 
    }

    // Logika untuk nomor 3b
    if (f.no === '3') {
        var percentage = 0;

        if (selectedCount === 1) {
          percentage = 0.25;       // 25%
        } else if (selectedCount === 2) {
          percentage = 0.50;       // 50%
        } else if (selectedCount === 3) {
          percentage = 0.75;       // 75%
        } else if (selectedCount >= 4) {
          percentage = 1.00;       // 100%
        }

        var maxPts = (typeof f.maxPoints === 'number') ? f.maxPoints : 1;
        return percentage * maxPts;
      }
    
    // Logika untuk nomor 5b
        if (f.no === '5') {
            var percentage = 0;
            if (selectedCount === 1) {
                percentage = 0.25; // 25% untuk 1 jawaban
            } else if (selectedCount === 2) {
                percentage = 0.50; // 50% untuk 2 jawaban
            } else if (selectedCount === 3) {
                percentage = 0.75; // 75% untuk 3 jawaban
            } else if (selectedCount >= 4) {
                percentage = 1.00; // 100% untuk 4 jawaban
            }
            return percentage * 2;
          }

    // Logika untuk nomor 6b
    if (f.no === '6') {
        var score = 0;
        if (selectedCount === 1) {
            score = 0.5;  // 25% dari 2 poin = 0.5 poin
        } else if (selectedCount === 2) {
            score = 1.0;  // 50% dari 2 poin = 1 poin
        } else if (selectedCount === 3) {
            score = 1.5;  // 75% dari 2 poin = 1.5 poin
        } else if (selectedCount >= 4) {
            score = 2.0;  // 100% dari 2 poin = 2 poin (maksimal)
        }
        return score;  // Return langsung nilai absolut
    }

    // Logika untuk nomor 7b
    if (f.no === '7') {
        var percentage = 0;
        if (selectedCount === 1) {
            percentage = 0.25; // 25% untuk 1 jawaban
        } else if (selectedCount === 2) {
            percentage = 0.50; // 50% untuk 2 jawaban
        } else if ( selectedCount === 3) {
            percentage = 0.75; // 75% untuk 3 jawaban
        } else if (selectedCount === 4) {
            percentage = 1.00; // 100% untuk 4 jawaban
        }
        return percentage * 2; // Kalikan dengan 2 karena bobot maksimal adalah 2 poin
    }

    // Logika untuk nomor 8b
    if (f.no === '8') {
        var maxPoints = 2.0; // Maximum score for B8
        var perAnswerScore = 0.5; // Score per selected answer
        var totalScore = selectedCount * perAnswerScore;

        // Ensure the score does not exceed the maximum
        return Math.min(totalScore, maxPoints);
    }

    // logika untuk nomor 9b
    if (f.no === '9') {
        var maxPoints = 2.0; // Maximum score for B9
        var perAnswerScore = 0.5; // Adjusted score per selected answer
        var totalScore = selectedCount * perAnswerScore;

        // Ensure the score does not exceed the maximum
        if (selectedCount >= 4) {
            totalScore = maxPoints;
        }
        return totalScore;
    }

    // Default logic for other checkboxes
    var percentage = 0;
    if (selectedCount === 1) {
        percentage = 0.25;
    } else if (selectedCount >= 2) {
        percentage = 0.50;
    } else if (selectedCount >= 3) {
        percentage = 0.75;
    } else if (selectedCount >= 4) {
        percentage = 1.0;
    }
    return percentage * (f.weight || 0);
  }




function setupCheckboxRequired(){
    var requiredBoxes = form.querySelectorAll('input[type="checkbox"][data-required-group="1"]');
    if (!requiredBoxes.length) return;
    function enforce(){
      var groups = {};
      for (var i=0; i<requiredBoxes.length; i++){
        var cb = requiredBoxes[i];
        var groupName = cb.getAttribute('name');
        if (!groups[groupName]) groups[groupName] = [];
        groups[groupName].push(cb);
      }
      for (var name in groups){
        if (!groups.hasOwnProperty(name)) continue;
        var group = groups[name];
        var hasChecked = false;
        for (var g=0; g<group.length; g++){
          if (group[g].checked){ hasChecked = true; break; }
        }
        for (var j=0; j<group.length; j++){
          group[j].required = false;
          if (group[j].setCustomValidity) group[j].setCustomValidity('');
        }
        if (!hasChecked && group.length){
          group[0].required = true;
          if (group[0].setCustomValidity) group[0].setCustomValidity('Pilih minimal satu opsi.');
        }
      }
    }
    enforce();
    form.addEventListener('change', function(evt){
      var t = evt && evt.target ? evt.target : evt;
      if (t && t.type === 'checkbox' && t.getAttribute('data-required-group') === '1'){
        enforce();
      }
    });
  }


  function optionScore(f, val){
    if (!f.options || val==null) return 0;
    for (var i=0; i<f.options.length; i++){
      if (f.options[i].value == val){
        return (f.options[i].score != null ? f.options[i].score : 0);
      }
    }
    return 0;
  }

  // ==============  Kalkulasi Timbulan khusus (B1..B4)  =================
  function wireTimbulan(){
    var inPend = form.querySelector('[name="B1"]');
    var inEst  = form.querySelector('[name="B2"]');
    var inTim  = form.querySelector('[name="B3"]');
    var inPeng = form.querySelector('[name="B4"]');

    if (!inPend || !inEst || !inTim) return;

    function calc(){
      var p = Math.max(0, parseFloat(inPend.value)||0);
      var e = Math.max(0, parseFloat(inEst.value)||0);
      var t = p * e * 30;
      inTim.value = (Math.round(t*100)/100) || 0;
      recalcAll();
    }
    inPend.addEventListener('input', calc);
    inEst.addEventListener('change', calc);
    if (inPeng) inPeng.addEventListener('input', function(){ /* opsional */ });
  }

  // ==============  Utils  =================
  function esc(s){ return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]); }); }
  function cssEscape(s){
    return String(s).replace(/([ #;?%&,.+*~\':"!^$[\]()=>|/@])/g,'\\$1');
  }

  // kalkulasi estimasi presentase pengurangan sampah
  window.calculatePercentage = function(colIndex) {
      // Get values from each row for the specific RW column
      var population = parseFloat(document.querySelector(`[name="c6-table-5col_row1_col${colIndex}"]`).value) || 0;
      var wasteFactor = parseFloat(document.querySelector(`[name="c6-table-5col_row2_col${colIndex}"]`).value) || 0;
      var reduction = parseFloat(document.querySelector(`[name="c6-table-5col_row3_col${colIndex}"]`).value) || 0;
      
      // Calculate total waste: population × wasteFactor × 30 days
      var totalWaste = population * wasteFactor * 30;
      
      // Calculate percentage: (reduction / totalWaste) × 100
      var percentage = 0;
      if (totalWaste > 0) {
          percentage = (reduction / totalWaste) * 100;
      }
      
      // Update the percentage field with 2 decimal places
      var percentageField = document.querySelector(`[name="c6-table-5col_row4_col${colIndex}"]`);
      if (percentageField) {
          percentageField.value = percentage.toFixed(2);
      }
  };

  // Init
  render();
})();

