document.addEventListener('DOMContentLoaded', function() {
    // mengambil elemen-elemen dari DOM
    const noteTitleInput = document.getElementById('noteTitle'); // input judul catatan
    const noteContentInput = document.getElementById('noteContent'); // textarea isi catatan
    const addNoteBtn = document.getElementById('addNoteBtn'); // tombol tambah catatan
    const noteList = document.getElementById('noteList'); // elemen UL tempat daftar catatan

    // fungsi untuk memuat catatan dari Local Storage saat halaman dimuat
    loadNotes();

    // event listener untuk tombol tambah catatan
    addNoteBtn.addEventListener('click', addNote);

    // fungsi untuk menambahkan catatan baru
    function addNote() {
        const title = noteTitleInput.value.trim(); // ammbil nilai judul dan hapus spasi kosong di awal/akhir
        const content = noteContentInput.value.trim(); // ambil nilai isi catatan

        // validasi: pastikan judul atau konten tidak kosong
        if (title === '' && content === '') {
            alert('Judul atau isi catatan tidak boleh kosong!');
            return; // henntikan fungsi jika kosong
        }

        const date = new Date(); // dapatkan tanggal dan waktu saat ini
        // format tanggal ke string yang mudah dibaca
        const formattedDate = date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // buat objek catatan
        const note = {
            id: Date.now(), // ID unik berdasarkan timestamp
            title: title,
            content: content,
            date: formattedDate
        };

        // buat elemen HTML untuk catatan baru
        const listItem = createNoteElement(note);

        // tambahkan catatan baru ke daftar catatan di DOM
        noteList.prepend(listItem); // gunakan prepend agar catatan terbaru muncul di atas

        // simpan catatan ke Local Storage
        saveNote(note);

        // bersihkan input setelah catatan ditambahkan
        noteTitleInput.value = '';
        noteContentInput.value = '';
    }

    // fungsi untuk membuat elemen HTML untuk sebuah catatan
    function createNoteElement(note) {
        const listItem = document.createElement('li'); // buat elemen LI
        listItem.classList.add('note-item'); // tambahkan kelas CSS
        listItem.setAttribute('data-id', note.id); // simpan ID catatan sebagai atribut data

        listItem.innerHTML = `
            ${note.title ? `<h3>${note.title}</h3>` : ''} <p>${note.content}</p>
            <span class="note-date">${note.date}</span>
            <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
        `;

        // dapatkan tombol hapus di dalam item catatan yang baru dibuat
        const deleteButton = listItem.querySelector('.delete-btn');
        // tambahkan event listener untuk tombol hapus
        deleteButton.addEventListener('click', () => {
            deleteNote(note.id, listItem); // panggil fungsi hapus catatan
        });

        return listItem;
    }

    // fungsi untuk menyimpan catatan ke Local Storage
    function saveNote(note) {
        let notes = getNotesFromLocalStorage(); // dapatkan semua catatan yang sudah ada
        notes.push(note); // tambahkan catatan baru
        localStorage.setItem('notes', JSON.stringify(notes)); // simpan kembali ke Local Storage
    }

    // fungsi untuk memuat catatan dari Local Storage
    function loadNotes() {
        const notes = getNotesFromLocalStorage(); // dapatkan semua catatan
        // urutkan catatan berdasarkan ID (timestamp) agar catatan terbaru di atas
        notes.sort((a, b) => b.id - a.id);
        notes.forEach(note => {
            const listItem = createNoteElement(note); // buat elemen HTML untuk setiap catatan
            noteList.appendChild(listItem); // tambahkan ke DOM
        });
    }

    // fungsi untuk mendapatkan catatan dari Local Storage
    function getNotesFromLocalStorage() {
        const notesString = localStorage.getItem('notes'); // ambil data catatan dari Local Storage
        return notesString ? JSON.parse(notesString) : []; // parse JSON atau kembalikan array kosong
    }

    // fungsi untuk menghapus catatan
    function deleteNote(id, element) {
        if (confirm('Apakah Anda yakin ingin menghapus catatan ini?')) { // konfirmasi penghapusan
            // hapus elemen catatan dari DOM
            element.remove();

            // hapus catatan dari Local Storage
            let notes = getNotesFromLocalStorage();
            notes = notes.filter(note => note.id !== id); // filter catatan, buang yang punya ID ini
            localStorage.setItem('notes', JSON.stringify(notes)); // simpan kembali ke Local Storage
        }
    }
});
