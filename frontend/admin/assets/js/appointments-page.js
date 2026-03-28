// Appointments Page - MongoDB Integration
const API_BASE_URL = 'http://localhost:5500/api';

document.addEventListener('DOMContentLoaded', function() {
    loadAppointments();
});

// Load all appointments from MongoDB
async function loadAppointments() {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        
        const appointments = await response.json();
        displayAppointments(appointments);
        
    } catch (error) {
        console.error('Error loading appointments:', error);
        showNotification('Failed to load appointments', 'error');
    }
}

// Display appointments in table or grid
function displayAppointments(appointments) {
    const tbody = document.querySelector('#appointmentsTable tbody') || document.querySelector('.appointments-list');
    if (!tbody) return;
    
    tbody.innerHTML = appointments.map(apt => {
        const date = new Date(apt.appointmentDate).toLocaleDateString();
        const statusClass = apt.status.toLowerCase();
        
        return `
            <tr>
                <td>${apt.appointmentId}</td>
                <td>${apt.traineeName}</td>
                <td>${apt.courseName}</td>
                <td>${date}</td>
                <td>${apt.appointmentTime}</td>
                <td><span class="status-badge ${statusClass}">${apt.status}</span></td>
                <td>${apt.purpose}</td>
                <td>
                    <button class="btn-sm btn-primary" onclick="viewAppointment('${apt.appointmentId}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn-sm btn-success" onclick="editAppointment('${apt.appointmentId}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn-sm btn-danger" onclick="deleteAppointment('${apt.appointmentId}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// View appointment details
async function viewAppointment(appointmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`);
        const appointment = await response.json();
        
        alert(`Appointment Details:\n\nTrainee: ${appointment.traineeName}\nCourse: ${appointment.courseName}\nDate: ${new Date(appointment.appointmentDate).toLocaleDateString()}\nTime: ${appointment.appointmentTime}\nStatus: ${appointment.status}\nPurpose: ${appointment.purpose}\nNotes: ${appointment.notes || 'N/A'}`);
        
    } catch (error) {
        console.error('Error fetching appointment:', error);
        showNotification('Failed to load appointment details', 'error');
    }
}

// Edit appointment
async function editAppointment(appointmentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`);
        const appointment = await response.json();
        
        showNotification(`Edit appointment: ${appointment.appointmentId}`, 'info');
        // TODO: Implement edit modal
        
    } catch (error) {
        console.error('Error fetching appointment:', error);
        showNotification('Failed to load appointment details', 'error');
    }
}

// Delete appointment
async function deleteAppointment(appointmentId) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Appointment deleted successfully', 'success');
            loadAppointments();
        } else {
            throw new Error('Failed to delete appointment');
        }
        
    } catch (error) {
        console.error('Error deleting appointment:', error);
        showNotification('Failed to delete appointment', 'error');
    }
}

// Add new appointment
async function addAppointment(appointmentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appointmentData)
        });
        
        if (response.ok) {
            showNotification('Appointment created successfully', 'success');
            loadAppointments();
        } else {
            throw new Error('Failed to create appointment');
        }
        
    } catch (error) {
        console.error('Error creating appointment:', error);
        showNotification('Failed to create appointment', 'error');
    }
}

// Update appointment status
async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (response.ok) {
            showNotification('Appointment status updated', 'success');
            loadAppointments();
        } else {
            throw new Error('Failed to update status');
        }
        
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Failed to update status', 'error');
    }
}

function showNotification(message, type = 'info') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}
