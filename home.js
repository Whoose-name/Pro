const diaryEntries = document.getElementById('diaryEntries');
const loadingIndicator = document.getElementById('loadingIndicator');
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Load entries from Google Sheets
async function loadEntries() {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getEntries`);
        const data = await response.json();
        
        loadingIndicator.style.display = 'none';
        
        if (data.success && data.entries.length > 0) {
            renderDiary(data.entries);
        } else {
            diaryEntries.innerHTML = '<div class="empty-state">No entries yet. Start adding movies to your diary!</div>';
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        diaryEntries.innerHTML = '<div class="empty-state">Error loading entries. Please check your connection.</div>';
        console.error('Error loading entries:', error);
    }
}

function renderDiary(entries) {
    diaryEntries.innerHTML = entries.map(entry => `
        <div class="diary-entry">
            <div class="entry-header">
                <div class="entry-title">${entry.title}</div>
                <div class="entry-date">${formatDate(entry.date)}</div>
            </div>
            <div class="entry-rating">${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}</div>
            <div class="entry-remarks">"${entry.remarks}"</div>
        </div>
    `).join('');
}

// Load entries on page load
loadEntries();
