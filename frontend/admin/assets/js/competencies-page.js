// Competencies Page - MongoDB Integration
const API_BASE_URL = 'http://localhost:5500/api';

document.addEventListener('DOMContentLoaded', function() {
    loadCompetencies();
    loadCourses(); // For dropdown filters
});

// Load all competencies from MongoDB
async function loadCompetencies() {
    try {
        const response = await fetch(`${API_BASE_URL}/competencies`);
        if (!response.ok) throw new Error('Failed to fetch competencies');
        
        const competencies = await response.json();
        displayCompetencies(competencies);
        
    } catch (error) {
        console.error('Error loading competencies:', error);
        showNotification('Failed to load competencies', 'error');
    }
}

// Load courses for filter dropdown
async function loadCourses() {
    try {
        const response = await fetch(`${API_BASE_URL}/courses`);
        const courses = await response.json();
        
        const select = document.getElementById('courseFilter');
        if (select) {
            select.innerHTML = '<option value="all">All Courses</option>' +
                courses.map(c => `<option value="${c.courseId}">${c.title}</option>`).join('');
        }
        
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

// Display competencies
function displayCompetencies(competencies) {
    const container = document.getElementById('competenciesContainer') || document.querySelector('.competencies-list');
    if (!container) return;
    
    container.innerHTML = competencies.map(comp => {
        const totalHours = comp.units.reduce((sum, unit) => sum + (unit.hours || 0), 0);
        
        return `
            <div class="competency-card">
                <div class="competency-header">
                    <h4>${comp.title}</h4>
                    <span class="level-badge ${comp.level.replace(' ', '-')}">${comp.level}</span>
                </div>
                <div class="competency-code">${comp.code}</div>
                <p class="competency-description">${comp.description}</p>
                <div class="competency-course">
                    <i class="bi bi-book"></i> ${comp.courseName}
                </div>
                <div class="competency-units">
                    <h5>Units (${comp.units.length})</h5>
                    <ul>
                        ${comp.units.map(unit => `
                            <li>
                                <span class="unit-code">${unit.unitCode}</span>
                                <span class="unit-title">${unit.unitTitle}</span>
                                <span class="unit-hours">${unit.hours}hrs</span>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="total-hours">Total: ${totalHours} hours</div>
                </div>
                <div class="competency-actions">
                    <button class="btn-action edit" onclick="editCompetency('${comp.competencyId}')">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn-action delete" onclick="deleteCompetency('${comp.competencyId}')">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Filter competencies by course
async function filterByCourse(courseId) {
    try {
        let url = `${API_BASE_URL}/competencies`;
        if (courseId && courseId !== 'all') {
            url = `${API_BASE_URL}/competencies/course/${courseId}`;
        }
        
        const response = await fetch(url);
        const competencies = await response.json();
        displayCompetencies(competencies);
        
    } catch (error) {
        console.error('Error filtering competencies:', error);
        showNotification('Failed to filter competencies', 'error');
    }
}

// Edit competency
async function editCompetency(competencyId) {
    try {
        const response = await fetch(`${API_BASE_URL}/competencies/${competencyId}`);
        const competency = await response.json();
        
        showNotification(`Edit: ${competency.title}`, 'info');
        // TODO: Implement edit modal
        
    } catch (error) {
        console.error('Error fetching competency:', error);
        showNotification('Failed to load competency details', 'error');
    }
}

// Delete competency
async function deleteCompetency(competencyId) {
    if (!confirm('Are you sure you want to delete this competency?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/competencies/${competencyId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Competency deleted successfully', 'success');
            loadCompetencies();
        } else {
            throw new Error('Failed to delete competency');
        }
        
    } catch (error) {
        console.error('Error deleting competency:', error);
        showNotification('Failed to delete competency', 'error');
    }
}

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}
