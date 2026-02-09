let entries = [];
let currentPage = 0;
let editingIndex = null;
let editRating = 0;
let sortOrder = 'desc'; // 'desc' for newest first, 'asc' for oldest first

const loadingIndicator = document.getElementById('loadingIndicator');
const bookWrapper = document.getElementById('bookWrapper');
const emptyState = document.getElementById('emptyState');
const leftContent = document.getElementById('leftContent');
const rightContent = document.getElementById('rightContent');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const sortBtn = document.getElementById('sortBtn');
const sortText = document.getElementById('sortText');

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function sortEntries() {
    entries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
}

function toggleSort() {
    sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    sortEntries();
    currentPage = 0;
    renderPages();
    updateSortButton();
}

function updateSortButton() {
    if (sortOrder === 'desc') {
        sortText.textContent = 'Newest First';
        sortBtn.classList.remove('ascending');
    } else {
        sortText.textContent = 'Oldest First';
        sortBtn.classList.add('ascending');
    }
}

sortBtn.addEventListener('click', toggleSort);

// Load entries from Google Sheets
async function loadEntries() {
    try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getEntries`);
        const data = await response.json();
        
        loadingIndicator.style.display = 'none';
        
        if (data.success && data.entries.length > 0) {
            entries = data.entries;
            sortEntries();
            bookWrapper.style.display = 'flex';
            sortBtn.style.display = 'flex';
            renderPages();
        } else {
            emptyState.style.display = 'block';
        }
    } catch (error) {
        loadingIndicator.style.display = 'none';
        emptyState.style.display = 'block';
        console.error('Error loading entries:', error);
    }
}

function renderPages() {
    const leftIndex = currentPage * 2;
    const rightIndex = currentPage * 2 + 1;
    
    // Render left page
    if (leftIndex < entries.length) {
        leftContent.innerHTML = renderEntry(entries[leftIndex], leftIndex);
    } else {
        leftContent.innerHTML = '';
    }
    
    // Render right page
    if (rightIndex < entries.length) {
        rightContent.innerHTML = renderEntry(entries[rightIndex], rightIndex);
    } else {
        rightContent.innerHTML = '';
    }
    
    // Update navigation buttons
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = (currentPage * 2 + 2) >= entries.length;
    
    // Update page indicator
    const totalPages = Math.ceil(entries.length / 2);
    pageIndicator.textContent = `Page ${currentPage + 1} of ${totalPages}`;
}

async function deleteEntry(index) {
    if (!confirm('Are you sure you want to delete this entry?')) {
        return;
    }
    
    const entry = entries[index];
    
    try {
        // Call Google Sheets to delete the entry
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'delete',
                rowIndex: entry.rowIndex,
                title: entry.title,
                date: entry.date,
                rating: entry.rating,
                remarks: entry.remarks
            })
        });
        
        // Remove from local array
        entries.splice(index, 1);
        
        // Adjust current page if needed
        const totalPages = Math.ceil(entries.length / 2);
        if (currentPage >= totalPages && currentPage > 0) {
            currentPage--;
        }
        
        // Re-render or show empty state
        if (entries.length === 0) {
            bookWrapper.style.display = 'none';
            sortBtn.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            renderPages();
        }
        
    } catch (error) {
        alert('Error deleting entry. Please try again.');
        console.error('Error:', error);
    }
}

function renderEntry(entry, index) {
    if (editingIndex === index) {
        return renderEditForm(entry, index);
    }
    
    return `
        <div class="page-tools">
            <button class="tool-btn pencil" onclick="startEdit(${index})" title="Edit this entry">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </button>
            <button class="tool-btn eraser" onclick="deleteEntry(${index})" title="Delete this entry">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path>
                    <line x1="18" y1="9" x2="12" y2="15"></line>
                    <line x1="12" y1="9" x2="18" y2="15"></line>
                </svg>
            </button>
        </div>
        <div class="entry-date">${formatDate(entry.date)}</div>
        <div class="entry-title">${entry.title}</div>
        <div class="entry-rating">${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}</div>
        <div class="entry-remarks">${entry.remarks}</div>
    `;
}

function renderEditForm(entry, index) {
    editRating = entry.rating;
    
    return `
        <div class="edit-mode">
            <div class="edit-form">
                <input type="text" id="editTitle" value="${entry.title}" placeholder="Movie Title">
                <input type="date" id="editDate" value="${entry.date}">
                <div>
                    <label>Rating:</label>
                    <div class="edit-stars" id="editStars">
                        ${[1,2,3,4,5].map(i => `<span data-rating="${i}">${i <= entry.rating ? '★' : '☆'}</span>`).join('')}
                    </div>
                </div>
                <textarea id="editRemarks" rows="6" placeholder="Your thoughts...">${entry.remarks}</textarea>
                <div class="edit-actions">
                    <button class="save-btn" onclick="saveEdit(${index})">Save</button>
                    <button class="cancel-btn" onclick="cancelEdit()">Cancel</button>
                </div>
            </div>
        </div>
    `;
}

function startEdit(index) {
    editingIndex = index;
    renderPages();
    
    // Setup star rating for edit mode
    setTimeout(() => {
        const editStars = document.getElementById('editStars');
        if (editStars) {
            const stars = editStars.querySelectorAll('span');
            stars.forEach(star => {
                star.addEventListener('click', () => {
                    editRating = parseInt(star.dataset.rating);
                    updateEditStars(stars);
                });
            });
        }
    }, 100);
}

function updateEditStars(stars) {
    stars.forEach((star, index) => {
        if (index < editRating) {
            star.textContent = '★';
            star.classList.add('active');
        } else {
            star.textContent = '☆';
            star.classList.remove('active');
        }
    });
}

function cancelEdit() {
    editingIndex = null;
    renderPages();
}

async function saveEdit(index) {
    const entry = entries[index];
    const title = document.getElementById('editTitle').value;
    const date = document.getElementById('editDate').value;
    const remarks = document.getElementById('editRemarks').value;
    
    if (!title || !date || !remarks || editRating === 0) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'update',
                rowIndex: entry.rowIndex,
                oldTitle: entry.title,
                oldDate: entry.date,
                oldRating: entry.rating,
                oldRemarks: entry.remarks,
                title: title,
                date: date,
                rating: editRating,
                remarks: remarks
            })
        });
        
        // Update local entry
        entries[index] = {
            ...entry,
            title: title,
            date: date,
            rating: editRating,
            remarks: remarks
        };
        
        editingIndex = null;
        sortEntries();
        renderPages();
        
    } catch (error) {
        alert('Error updating entry. Please try again.');
        console.error('Error:', error);
    }
}

prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        renderPages();
    }
});

nextBtn.addEventListener('click', () => {
    if ((currentPage * 2 + 2) < entries.length) {
        currentPage++;
        renderPages();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (e.key === 'ArrowRight') {
        nextBtn.click();
    }
});

// Load entries on page load
loadEntries();
