// Records Page - MongoDB Integration
const API_BASE_URL = 'http://localhost:5500/api';

document.addEventListener('DOMContentLoaded', function() {
    loadAllRecords();
});

// Load all training records from MongoDB
async function loadAllRecords() {
    try {
        const response = await fetch(`${API_BASE_URL}/records`);
        if (!response.ok) throw new Error('Failed to fetch records');
        
        const records = await response.json();
        displayRecords(records);
        
    } catch (error) {
        console.error('Error loading records:', error);
        showNotification('Failed to load records', 'error');
    }
}

// Display records in table
function displayRecords(records) {
    const tbody = document.querySelector('#recordsTable tbody') || document.querySelector('.records-list');
    if (!tbody) return;
    
    tbody.innerHTML = records.map(record => {
        const startDate = new Date(record.startDate).toLocaleDateString();
        const completionDate = record.completionDate ? new Date(record.completionDate).toLocaleDateString() : 'N/A';
        const statusClass = record.status.replace(' ', '-').toLowerCase();
        
        return `
            <tr>
                <td>${record.userId}</td>
                <td>${record.courseName}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${record.progress}%"></div>
                    </div>
                    <span>${record.progress}%</span>
                </td>
                <td>${startDate}</td>
                <td>${completionDate}</td>
                <td>${record.grade || 'N/A'}</td>
                <td>${record.certificate || 'N/A'}</td>
                <td>
                    <button class="btn-sm btn-primary" onclick="viewRecord('${record._id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-sm btn-success" onclick="editRecord('${record._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    ${record.status === 'Completed' ? `
                        <button class="btn-sm btn-info" onclick="downloadCertificate('${record._id}')">
                            <i class="bi bi-download"></i>
                        </button>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

// View record details
async function viewRecord(recordId) {
    try {
        const response = await fetch(`${API_BASE_URL}/records/${recordId}`);
        const record = await response.json();
        
        alert(`Training Record:\n\nTrainee: ${record.userId}\nCourse: ${record.courseName}\nStatus: ${record.status}\nProgress: ${record.progress}%\nGrade: ${record.grade || 'N/A'}\nCertificate: ${record.certificate || 'N/A'}`);
        
    } catch (error) {
        console.error('Error fetching record:', error);
        showNotification('Failed to load record details', 'error');
    }
}

// Edit record
async function editRecord(recordId) {
    try {
        const response = await fetch(`${API_BASE_URL}/records/${recordId}`);
        const record = await response.json();
        
        showNotification(`Edit record for: ${record.courseName}`, 'info');
        // TODO: Implement edit modal
        
    } catch (error) {
        console.error('Error fetching record:', error);
        showNotification('Failed to load record details', 'error');
    }
}

// Download certificate
async function downloadCertificate(recordId) {
    try {
        const response = await fetch(`${API_BASE_URL}/records/${recordId}`);
        const record = await response.json();
        
        if (record.certificate) {
            showNotification(`Downloading certificate: ${record.certificate}`, 'success');
            // TODO: Implement actual certificate download
        } else {
            showNotification('No certificate available', 'warning');
        }
        
    } catch (error) {
        console.error('Error downloading certificate:', error);
        showNotification('Failed to download certificate', 'error');
    }
}

// Filter records by status
function filterByStatus(status) {
    const rows = document.querySelectorAll('#recordsTable tbody tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const badge = row.querySelector('.status-badge');
            const recordStatus = badge ? badge.textContent.trim() : '';
            row.style.display = recordStatus === status ? '' : 'none';
        }
    });
}

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}
