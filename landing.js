const bookContainer = document.getElementById('bookContainer');
const penContainer = document.getElementById('penContainer');

bookContainer.addEventListener('click', () => {
    window.location.href = 'diary.html';
});

penContainer.addEventListener('click', () => {
    window.location.href = 'add-entry.html';
});
