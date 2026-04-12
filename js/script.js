const form = document.querySelector('form.container');
const table = document.querySelector('.table');
const searchInput = document.querySelector('.search input');

// ================= LOAD DATA =================
window.addEventListener('DOMContentLoaded', () => {
    const saved = JSON.parse(localStorage.getItem('songs')) || [];
    saved.forEach(addRow);
});

// ================= SUBMIT =================
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = document.querySelector('#type').value;
    const date = form.querySelector('.date input').value;
    const time = form.querySelector('.time input').value;
    const singer = form.querySelector('.singer input').value;
    const title = form.querySelector('.title input').value;
    const artist = form.querySelector('.artist input').value;

    if (!type || !date || !time || !singer || !title || !artist) {
        alert("Please complete all fields!");
        return;
    }

    const song = { type, date, time, singer, title, artist };

    addRow(song);
    saveData(song);

    form.reset();
});

// ================= ADD ROW =================
function addRow(song) {
    const row = table.insertRow();

    row.innerHTML = `
        <td>${formatDate(song.date)}</td>
        <td>${formatTime(song.time)}</td>
        <td>${song.singer}</td>
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${song.type}</td>
        <td class="actions">
            <i class="fa-solid fa-pen-to-square"></i>
            <i class="fa-solid fa-delete-left"></i>
        </td>
    `;

    row.querySelector('.fa-pen-to-square').onclick = () => editRow(row);
    row.querySelector('.fa-delete-left').onclick = () => deleteRow(row);
}

// ================= SAVE =================
function saveData(song) {
    const data = JSON.parse(localStorage.getItem('songs')) || [];
    data.push(song);
    localStorage.setItem('songs', JSON.stringify(data));
}

// ================= DELETE =================
function deleteRow(row) {
    const data = JSON.parse(localStorage.getItem('songs')) || [];

    const index = row.rowIndex - 1;
    data.splice(index, 1);

    localStorage.setItem('songs', JSON.stringify(data));
    row.remove();
}

// ================= EDIT =================
function editRow(row) {
    document.querySelector('#type').value = row.cells[5].textContent;
    form.querySelector('.date input').value = toInputDate(row.cells[0].textContent);
    form.querySelector('.time input').value = to24(row.cells[1].textContent);
    form.querySelector('.singer input').value = row.cells[2].textContent;
    form.querySelector('.title input').value = row.cells[3].textContent;
    form.querySelector('.artist input').value = row.cells[4].textContent;

    deleteRow(row);
}

// ================= FORMAT DATE =================
function formatDate(date) {
    const d = new Date(date);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}

// ================= FORMAT TIME =================
function formatTime(time) {
    let [h, m] = time.split(":");
    let ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
}

// ================= REVERSE DATE =================
function toInputDate(str) {
    let [m, d, y] = str.split("/");
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
}

// ================= REVERSE TIME =================
function to24(timeStr) {
    let [time, ampm] = timeStr.split(" ");
    let [h, m] = time.split(":");

    if (ampm === "PM" && h < 12) h = +h + 12;
    if (ampm === "AM" && h == 12) h = 0;

    return `${h.toString().padStart(2,'0')}:${m}`;
}

// ================= SEARCH =================
searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const rows = table.rows;

    for (let i = 1; i < rows.length; i++) {
        rows[i].style.display =
            rows[i].innerText.toLowerCase().includes(q) ? "" : "none";
    }
});