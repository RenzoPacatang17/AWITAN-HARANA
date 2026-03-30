// Select elements
const form = document.querySelector('.container');
const table = document.querySelector('.table');
const searchInput = document.querySelector('.search input');

// ------------------
// Load data from localStorage when page loads
// ------------------
window.addEventListener('DOMContentLoaded', () => {
    const savedData = JSON.parse(localStorage.getItem('songs')) || [];
    savedData.forEach(item => addRow(item));
});

// ------------------
// Handle form submit to add a song
// ------------------
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get values from inputs
    const date = form.querySelector('.date input').value;
    const time = form.querySelector('.time input').value;
    const singer = form.querySelector('.singer input').value;
    const title = form.querySelector('.title input').value;
    const artist = form.querySelector('.artist input').value;

    // Validate
    if (!date || !time || !singer || !title || !artist) {
        alert('Please fill in all fields.');
        return;
    }

    const song = { date, time, singer, title, artist };

    // Add to table
    addRow(song);

    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('songs')) || [];
    savedData.push(song);
    localStorage.setItem('songs', JSON.stringify(savedData));

    // Reset form
    form.reset();
});

// ------------------
// Add a row to the table
// ------------------
function addRow(song) {
    const row = table.insertRow();

    // Format date as MM/DD/YYYY
    const formattedDate = formatDate(song.date);

    // Format time to 12-hour
    const formattedTime = formatTime12(song.time);

    const cellDate = row.insertCell();
    cellDate.textContent = formattedDate;

    const cellTime = row.insertCell();
    cellTime.textContent = formattedTime;

    const cellSinger = row.insertCell();
    cellSinger.textContent = song.singer;

    const cellTitle = row.insertCell();
    cellTitle.textContent = song.title;

    const cellArtist = row.insertCell();
    cellArtist.textContent = song.artist;

    // Actions
    const cellActions = row.insertCell();
    cellActions.classList.add('actions');

    const editIcon = document.createElement('i');
    editIcon.className = 'fa-solid fa-pen-to-square';
    editIcon.style.cursor = 'pointer';
    editIcon.style.color = 'yellow';
    editIcon.title = 'Edit';
    editIcon.addEventListener('click', () => editRow(row));
    cellActions.appendChild(editIcon);

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa-solid fa-delete-left';
    deleteIcon.style.cursor = 'pointer';
    deleteIcon.style.color = 'red';
    deleteIcon.title = 'Delete';
    deleteIcon.addEventListener('click', () => deleteRow(row));
    cellActions.appendChild(deleteIcon);
}

// ------------------
// Format date as MM/DD/YYYY
// ------------------
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// ------------------
// Format 24-hour time to 12-hour
// ------------------
function formatTime12(time24) {
    if (!time24) return "";
    let [hour, minute] = time24.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour}:${minute.toString().padStart(2,'0')} ${ampm}`;
}

// ------------------
// Delete a row
// ------------------
function deleteRow(row) {
    const index = row.rowIndex - 1;
    row.remove();
    const data = JSON.parse(localStorage.getItem('songs')) || [];
    data.splice(index, 1);
    localStorage.setItem('songs', JSON.stringify(data));
}

// ------------------
// Edit a row
// ------------------
function editRow(row) {
    // Convert date back to input format (YYYY-MM-DD)
    document.querySelector('.date input').value = convertToInputDate(row.cells[0].textContent);
    document.querySelector('.time input').value = convertTo24Hour(row.cells[1].textContent);
    document.querySelector('.singer input').value = row.cells[2].textContent;
    document.querySelector('.title input').value = row.cells[3].textContent;
    document.querySelector('.artist input').value = row.cells[4].textContent;

    deleteRow(row);
}

// ------------------
// Convert MM/DD/YYYY back to input YYYY-MM-DD
// ------------------
function convertToInputDate(dateStr) {
    const [month, day, year] = dateStr.split('/');
    return `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`;
}

// ------------------
// Convert 12-hour time back to 24-hour
// ------------------
function convertTo24Hour(time12) {
    if (!time12) return '';
    let [time, ampm] = time12.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
}

// ------------------
// Live search (filter by singer, title, artist)
// ------------------
function filterTable() {
    const query = searchInput.value.toLowerCase();
    const rows = table.rows;

    for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const cellsText = [
            row.cells[2].textContent.toLowerCase(),
            row.cells[3].textContent.toLowerCase(),
            row.cells[4].textContent.toLowerCase()
        ].join(' ');

        row.style.display = cellsText.includes(query) ? '' : 'none';
    }
}

// Search triggers
searchInput.addEventListener('input', filterTable);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterTable();
    }
});