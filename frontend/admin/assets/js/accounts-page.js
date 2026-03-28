// Accounts Page - MongoDB Integration with Full CRUD
const API_BASE_URL = 'http://localhost:5500/api';
let currentEditAccountId = null;
let currentDeleteAccountId = null;
let currentDeleteUsername = null;

document.addEventListener('DOMContentLoaded', function() {
    loadAccounts();
    loadUsersByRole();
});

// Load all accounts from MongoDB
async function loadAccounts() {
    console.log('Loading accounts from API...');
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.error('Failed to fetch accounts, status:', response.status);
            throw new Error('Failed to fetch accounts');
        }
        
        const accounts = await response.json();
        console.log('Loaded accounts:', accounts.length, 'accounts');
        displayAccounts(accounts);
        
    } catch (error) {
        console.error('Error loading accounts:', error);
        showNotification('Failed to load accounts. Make sure the server is running.', 'error');
    }
}

// Display accounts in table
function displayAccounts(accounts) {
    const tbody = document.querySelector('#accountsTable tbody') || document.querySelector('.table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = accounts.map(account => {
        const lastLogin = account.lastLogin ? new Date(account.lastLogin).toLocaleDateString() : 'Never';
        const statusClass = account.status.toLowerCase();
        const roleClass = account.role.toLowerCase();
        
        return `
            <tr data-account-id="${account.accountId}">
                <td>${account.accountId}</td>
                <td>${account.username}</td>
                <td>${account.firstName} ${account.lastName}</td>
                <td>${account.email}</td>
                <td><span class="badge badge-${roleClass}">${account.role}</span></td>
                <td><span class="status-badge ${statusClass}">${account.status}</span></td>
                <td>${lastLogin}</td>
                <td>
                    <div class="action-buttons-row">
                        <button class="action-btn action-btn-view" onclick="viewAccount('${account.accountId}')" title="View">
                            <i class="bi bi-eye-fill"></i>
                        </button>
                        <button class="action-btn action-btn-edit" onclick="editAccount('${account.accountId}')" title="Edit">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="action-btn action-btn-delete" onclick="openDeleteAccountModal('${account.accountId}', '${account.username}')" title="Delete">
                            <i class="bi bi-trash3-fill"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Open Add Account Modal
function openAddAccountModal() {
    currentEditAccountId = null;
    document.getElementById('accountModalTitle').textContent = 'Add New Account';
    document.getElementById('accountForm').reset();
    document.getElementById('accountPassword').required = true;
    document.getElementById('accountModal').classList.add('active');
}

// Close Account Modal
function closeAccountModal() {
    document.getElementById('accountModal').classList.remove('active');
    document.getElementById('accountForm').reset();
    currentEditAccountId = null;
}

// Edit account - Load data into modal
async function editAccount(accountId) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`);
        if (!response.ok) throw new Error('Failed to fetch account');
        
        const account = await response.json();
        
        // Set current edit ID
        currentEditAccountId = accountId;
        
        // Update modal title
        document.getElementById('accountModalTitle').textContent = 'Edit Account';
        
        // Populate form fields
        document.getElementById('accountUsername').value = account.username;
        document.getElementById('accountEmail').value = account.email;
        document.getElementById('accountPassword').value = '';
        document.getElementById('accountPassword').required = false;
        document.getElementById('accountPassword').placeholder = 'Leave blank to keep current password';
        
        // Add hidden fields for first and last name if they don't exist
        let firstNameInput = document.getElementById('accountFirstName');
        let lastNameInput = document.getElementById('accountLastName');
        
        if (!firstNameInput) {
            const formBody = document.querySelector('#accountForm .modal-body');
            const emailGroup = document.getElementById('accountEmail').closest('.form-group');
            
            const firstNameGroup = document.createElement('div');
            firstNameGroup.className = 'form-group';
            firstNameGroup.innerHTML = `
                <label class="form-label" for="accountFirstName">First Name *</label>
                <input type="text" id="accountFirstName" name="accountFirstName" class="form-control" required>
            `;
            emailGroup.after(firstNameGroup);
            
            const lastNameGroup = document.createElement('div');
            lastNameGroup.className = 'form-group';
            lastNameGroup.innerHTML = `
                <label class="form-label" for="accountLastName">Last Name *</label>
                <input type="text" id="accountLastName" name="accountLastName" class="form-control" required>
            `;
            firstNameGroup.after(lastNameGroup);
            
            firstNameInput = document.getElementById('accountFirstName');
            lastNameInput = document.getElementById('accountLastName');
        }
        
        firstNameInput.value = account.firstName;
        lastNameInput.value = account.lastName;
        
        // Set role
        const roleSelect = document.getElementById('accountRole');
        roleSelect.value = account.role;
        
        // Open modal
        document.getElementById('accountModal').classList.add('active');
        
    } catch (error) {
        console.error('Error fetching account:', error);
        showNotification('Failed to load account details', 'error');
    }
}

// Save account (Add or Update)
async function saveAccount(event) {
    event.preventDefault();
    console.log('saveAccount called');
    
    const username = document.getElementById('accountUsername').value;
    const email = document.getElementById('accountEmail').value;
    const password = document.getElementById('accountPassword').value;
    const role = document.getElementById('accountRole').value;
    const firstName = document.getElementById('accountFirstName')?.value || username.split(' ')[0] || 'User';
    const lastName = document.getElementById('accountLastName')?.value || username.split(' ')[1] || 'Account';
    
    console.log('Form data:', { username, email, firstName, lastName, role, hasPassword: !!password });
    
    const accountData = {
        username,
        email,
        firstName,
        lastName,
        role: role.toLowerCase(),
        status: 'active',
        permissions: role.toLowerCase() === 'admin' ? ['all'] : ['view_trainees']
    };
    
    // Only include password if it's provided
    if (password) {
        accountData.password = password;
    }
    
    try {
        let response;
        
        console.log('Sending request to API...');
        
        if (currentEditAccountId) {
            // Update existing account
            console.log('Updating account:', currentEditAccountId);
            response = await fetch(`${API_BASE_URL}/accounts/${currentEditAccountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountData)
            });
            
            console.log('Update response status:', response.status);
            
            if (response.ok) {
                showNotification('Account updated successfully', 'success');
            } else {
                const errorData = await response.json();
                console.error('Update error:', errorData);
                throw new Error(errorData.message || 'Failed to update account');
            }
        } else {
            // Create new account
            accountData.accountId = `ACC${Date.now()}`;
            accountData.password = password; // Password is required for new accounts
            
            console.log('Creating new account with data:', accountData);
            
            response = await fetch(`${API_BASE_URL}/accounts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(accountData)
            });
            
            console.log('Create response status:', response.status);
            
            if (response.ok) {
                const result = await response.json();
                console.log('Account created:', result);
                showNotification('Account created successfully', 'success');
            } else {
                const error = await response.json();
                console.error('Create error:', error);
                throw new Error(error.message || 'Failed to create account');
            }
        }
        
        // Close modal and reload accounts
        closeAccountModal();
        await loadAccounts();
        
    } catch (error) {
        console.error('Error saving account:', error);
        showNotification(error.message || 'Failed to save account', 'error');
    }
}

// Open Delete Account Modal
function openDeleteAccountModal(accountId, username) {
    currentDeleteAccountId = accountId;
    currentDeleteUsername = username;
    
    document.getElementById('deleteAccountName').textContent = `Username: ${username}`;
    document.getElementById('deleteAccountConfirmInput').value = '';
    document.getElementById('deleteAccountErrorMsg').style.display = 'none';
    document.getElementById('deleteAccountModal').classList.add('active');
}

// Close Delete Account Modal
function closeDeleteAccountModal() {
    document.getElementById('deleteAccountModal').classList.remove('active');
    currentDeleteAccountId = null;
    currentDeleteUsername = null;
}

// Confirm Delete Account
async function confirmDeleteAccount() {
    const confirmInput = document.getElementById('deleteAccountConfirmInput').value;
    const errorMsg = document.getElementById('deleteAccountErrorMsg');
    
    if (confirmInput !== currentDeleteUsername) {
        errorMsg.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${currentDeleteAccountId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Account deleted successfully', 'success');
            closeDeleteAccountModal();
            loadAccounts();
        } else {
            throw new Error('Failed to delete account');
        }
        
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Failed to delete account', 'error');
    }
}

// View account details in modal
async function viewAccount(accountId) {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`);
        const account = await response.json();
        
        // Populate modal fields
        document.getElementById('viewAccountId').textContent = account.accountId;
        document.getElementById('viewUsername').textContent = account.username;
        document.getElementById('viewFirstName').textContent = account.firstName;
        document.getElementById('viewLastName').textContent = account.lastName;
        document.getElementById('viewEmail').textContent = account.email;
        
        // Set role badge
        const roleBadge = document.getElementById('viewRole');
        roleBadge.textContent = account.role.charAt(0).toUpperCase() + account.role.slice(1);
        roleBadge.className = `badge badge-${account.role.toLowerCase()}`;
        
        // Set status badge
        const statusBadge = document.getElementById('viewStatus');
        statusBadge.textContent = account.status.charAt(0).toUpperCase() + account.status.slice(1);
        statusBadge.className = `status-badge ${account.status.toLowerCase()}`;
        
        // Set last login
        const lastLogin = account.lastLogin ? new Date(account.lastLogin).toLocaleString() : 'Never';
        document.getElementById('viewLastLogin').textContent = lastLogin;
        
        // Set permissions
        const permissions = account.permissions.join(', ');
        document.getElementById('viewPermissions').textContent = permissions;
        
        // Set created at
        const createdAt = account.createdAt ? new Date(account.createdAt).toLocaleString() : 'N/A';
        document.getElementById('viewCreatedAt').textContent = createdAt;
        
        // Open modal
        document.getElementById('viewAccountModal').classList.add('active');
        
    } catch (error) {
        console.error('Error fetching account:', error);
        showNotification('Failed to load account details', 'error');
    }
}

// Close view account modal
function closeViewAccountModal() {
    document.getElementById('viewAccountModal').classList.remove('active');
}

// Search accounts
function searchAccounts(query) {
    const rows = document.querySelectorAll('.table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
}

// Filter by role
function filterByRole(role) {
    const rows = document.querySelectorAll('.table tbody tr');
    rows.forEach(row => {
        if (role === 'all') {
            row.style.display = '';
        } else {
            const badge = row.querySelector('.badge');
            const accountRole = badge ? badge.textContent.trim().toLowerCase() : '';
            row.style.display = accountRole === role.toLowerCase() ? '' : 'none';
        }
    });
}

function showNotification(message, type = 'info') {
    // Fallback notification - don't call window.showNotification to avoid recursion
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}


// Load users grouped by role for the User Roles tab
async function loadUsersByRole() {
    console.log('Loading users by role...');
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.error('Failed to fetch accounts for roles, status:', response.status);
            throw new Error('Failed to fetch accounts');
        }
        
        const accounts = await response.json();
        console.log('Loaded accounts for roles:', accounts.length, 'accounts');
        displayUsersByRole(accounts);
        
    } catch (error) {
        console.error('Error loading users by role:', error);
        showNotification('Failed to load users by role', 'error');
    }
}

// Display users grouped by role
function displayUsersByRole(accounts) {
    const tbody = document.querySelector('#rolesTable tbody');
    if (!tbody) return;
    
    // Group accounts by role
    const roleGroups = {
        admin: [],
        instructor: [],
        staff: [],
        trainee: []
    };
    
    accounts.forEach(account => {
        const role = account.role.toLowerCase();
        if (roleGroups[role]) {
            roleGroups[role].push(account);
        }
    });
    
    // Sort roles in order: admin, instructor, staff, trainee
    const roleOrder = ['admin', 'instructor', 'staff', 'trainee'];
    const roleLabels = {
        admin: 'Administrator',
        instructor: 'Instructor',
        staff: 'Staff',
        trainee: 'Trainee'
    };
    
    let html = '';
    
    roleOrder.forEach(role => {
        const users = roleGroups[role];
        if (users.length > 0) {
            users.forEach((account, index) => {
                const statusClass = account.status.toLowerCase();
                const isFirstInRole = index === 0;
                
                html += `
                    <tr>
                        ${isFirstInRole ? `<td rowspan="${users.length}" style="vertical-align: middle; font-weight: 600; background: var(--bg-light);">
                            <span class="badge badge-${role}">${roleLabels[role]}</span>
                            <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${users.length} user${users.length > 1 ? 's' : ''}</div>
                        </td>` : ''}
                        <td>${account.username}</td>
                        <td>${account.firstName} ${account.lastName}</td>
                        <td>${account.email}</td>
                        <td><span class="status-badge ${statusClass}">${account.status}</span></td>
                        <td>
                            <div class="action-buttons-row">
                                <button class="action-btn action-btn-view" onclick="viewAccount('${account.accountId}')" title="View">
                                    <i class="bi bi-eye-fill"></i>
                                </button>
                                <button class="action-btn action-btn-edit" onclick="editAccount('${account.accountId}')" title="Edit">
                                    <i class="bi bi-pencil-square"></i>
                                </button>
                                <button class="action-btn action-btn-delete" onclick="openDeleteAccountModal('${account.accountId}', '${account.username}')" title="Delete">
                                    <i class="bi bi-trash3-fill"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }
    });
    
    if (html === '') {
        html = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="bi bi-inbox" style="font-size: 24px; color: #999;"></i>
                    <p style="color: #999; margin-top: 10px;">No users found</p>
                </td>
            </tr>
        `;
    }
    
    tbody.innerHTML = html;
}

// Tab switching function
function showSection(sectionId, event) {
    // Remove active class from all tabs
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    if (event) {
        event.currentTarget.classList.add('active');
    }
    
    // Hide all sections
    document.querySelectorAll('.accounts-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Reload data when switching tabs
    if (sectionId === 'user-roles') {
        loadUsersByRole();
    } else if (sectionId === 'permissions') {
        loadRolePermissions();
    }
}


// Load and display role permissions
async function loadRolePermissions() {
    console.log('Loading role permissions...');
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`);
        if (!response.ok) throw new Error('Failed to fetch accounts');
        
        const accounts = await response.json();
        displayRolePermissions(accounts);
        
    } catch (error) {
        console.error('Error loading role permissions:', error);
        showNotification('Failed to load permissions', 'error');
    }
}

// Display role permissions table
function displayRolePermissions(accounts) {
    const tbody = document.querySelector('#permissionsTable tbody');
    if (!tbody) return;
    
    // Group by role and get unique permissions
    const roleData = {
        admin: { users: [], permissions: [] },
        instructor: { users: [], permissions: [] },
        staff: { users: [], permissions: [] },
        trainee: { users: [], permissions: [] }
    };
    
    accounts.forEach(account => {
        const role = account.role.toLowerCase();
        if (roleData[role]) {
            roleData[role].users.push(account);
            // Merge permissions
            account.permissions.forEach(perm => {
                if (!roleData[role].permissions.includes(perm)) {
                    roleData[role].permissions.push(perm);
                }
            });
        }
    });
    
    const roleOrder = ['admin', 'instructor', 'staff', 'trainee'];
    const roleLabels = {
        admin: 'Administrator',
        instructor: 'Instructor',
        staff: 'Staff',
        trainee: 'Trainee'
    };
    
    let html = '';
    
    roleOrder.forEach(role => {
        const data = roleData[role];
        if (data.users.length > 0) {
            const userNames = data.users.map(u => u.firstName + ' ' + u.lastName).join(', ');
            const permissionsList = data.permissions.join(', ');
            
            html += `
                <tr>
                    <td>
                        <span class="badge badge-${role}">${roleLabels[role]}</span>
                        <div style="font-size: 11px; color: var(--text-secondary); margin-top: 4px;">${data.users.length} user${data.users.length > 1 ? 's' : ''}</div>
                    </td>
                    <td>
                        <div style="max-width: 400px;">
                            <strong style="font-size: 12px; color: var(--text-secondary);">Users:</strong>
                            <div style="margin-top: 4px;">${userNames}</div>
                            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border-color);">
                                <strong style="font-size: 12px; color: var(--text-secondary);">Permissions:</strong>
                                <div style="margin-top: 4px; font-size: 13px;">${permissionsList}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="btn-sm btn-success" onclick="editRolePermissions('${role}')" title="Edit Permissions">
                            <i class="bi bi-pencil"></i> Edit
                        </button>
                    </td>
                </tr>
            `;
        }
    });
    
    tbody.innerHTML = html;
}

// Edit role permissions
async function editRolePermissions(role) {
    try {
        // Get all accounts with this role
        const response = await fetch(`${API_BASE_URL}/accounts`);
        const accounts = await response.json();
        const roleAccounts = accounts.filter(a => a.role.toLowerCase() === role);
        
        if (roleAccounts.length === 0) {
            showNotification('No users found with this role', 'error');
            return;
        }
        
        // Get permissions from first user (they should all have same permissions for the role)
        const currentPermissions = roleAccounts[0].permissions;
        
        // Set modal title
        const roleLabels = {
            admin: 'Administrator',
            instructor: 'Instructor',
            staff: 'Staff',
            trainee: 'Trainee'
        };
        document.getElementById('permissionsModalTitle').textContent = `Edit ${roleLabels[role]} Permissions`;
        document.getElementById('permissionRole').value = roleLabels[role];
        document.getElementById('permissionRole').dataset.role = role;
        
        // Check current permissions
        const checkboxes = document.querySelectorAll('#permissionsCheckboxes input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = currentPermissions.includes(checkbox.value);
        });
        
        // Open modal
        document.getElementById('editPermissionsModal').classList.add('active');
        
    } catch (error) {
        console.error('Error loading role permissions:', error);
        showNotification('Failed to load role permissions', 'error');
    }
}

// Close permissions modal
function closePermissionsModal() {
    document.getElementById('editPermissionsModal').classList.remove('active');
}

// Save role permissions
async function saveRolePermissions(event) {
    event.preventDefault();
    
    const role = document.getElementById('permissionRole').dataset.role;
    const checkboxes = document.querySelectorAll('#permissionsCheckboxes input[type="checkbox"]:checked');
    const permissions = Array.from(checkboxes).map(cb => cb.value);
    
    if (permissions.length === 0) {
        showNotification('Please select at least one permission', 'error');
        return;
    }
    
    try {
        // Get all accounts with this role
        const response = await fetch(`${API_BASE_URL}/accounts`);
        const accounts = await response.json();
        const roleAccounts = accounts.filter(a => a.role.toLowerCase() === role);
        
        // Update permissions for all users with this role
        const updatePromises = roleAccounts.map(account => 
            fetch(`${API_BASE_URL}/accounts/${account.accountId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permissions })
            })
        );
        
        await Promise.all(updatePromises);
        
        showNotification(`Permissions updated for ${roleAccounts.length} user(s)`, 'success');
        closePermissionsModal();
        loadRolePermissions();
        
    } catch (error) {
        console.error('Error saving permissions:', error);
        showNotification('Failed to save permissions', 'error');
    }
}
