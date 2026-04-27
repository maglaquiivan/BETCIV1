// Form Viewer - Complete Application and Admission Forms
let currentFormData = null;
let isEditMode = false;

function createField(label, value, fieldName) {
    // Ensure value is properly escaped and displayed
    let displayValue = '';
    if (value && value !== 'N/A' && value !== null && value !== undefined) {
        displayValue = String(value).replace(/"/g, '&quot;');
    }
    return `
        <div>
            <label style="font-weight: 700; font-size: 12px; color: #333; text-transform: uppercase; display: block; margin-bottom: 6px;">${label}</label>
            <input type="text" class="form-field" data-field="${fieldName}" value="${displayValue}" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 4px; background: white; font-size: 14px; box-sizing: border-box;" disabled>
        </div>
    `;
}

function openApplicationFormWithData(appData) {
    console.log('Application Data Received:', appData);
    currentFormData = appData;
    isEditMode = false;
    
    const modal = document.createElement('div');
    modal.id = 'formModal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; overflow-y: auto;`;
    
    const container = document.createElement('div');
    container.id = 'formContainer';
    container.style.cssText = `background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); max-width: 1200px; width: 100%; max-height: 90vh; overflow-y: auto;`;
    
    const refNum = appData.referenceNumber || 'QYYRPPAAANNNN';
    let refBoxes = '';
    for (let i = 0; i < refNum.length; i++) {
        refBoxes += `<div style="width: 45px; height: 45px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; background: #f5f5f5; border-radius: 4px;">${refNum[i]}</div>`;
    }
    
    let formHTML = `
        <div style="background: linear-gradient(135deg, #E67E22 0%, #d35400 100%); padding: 30px 20px; text-align: center; color: white; position: sticky; top: 0; z-index: 10;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="bi bi-file-earmark-text"></i> Application Form
            </h1>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">TESDA Assessment Center | Competency Assessment Application</p>
        </div>
        
        <div id="formContent" style="padding: 30px;">
            <!-- 1. APPLICATION INFORMATION -->
            <div style="border: 2px solid #E67E22; padding: 15px; margin-bottom: 20px; background: #fff9f0;">
                <div style="font-size: 14px; font-weight: 700; color: #E67E22; text-transform: uppercase; letter-spacing: 1px;">1. Application Information</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="font-weight: 700; font-size: 12px; color: #333; text-transform: uppercase; display: block; margin-bottom: 10px;">Reference Number</label>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">${refBoxes}</div>
            </div>
            
            <!-- 2. PROFILE SECTION -->
            <div style="border: 2px solid #E67E22; padding: 15px; margin-bottom: 20px; background: #fff9f0; margin-top: 30px;">
                <div style="font-size: 14px; font-weight: 700; color: #E67E22; text-transform: uppercase; letter-spacing: 1px;">2. Profile</div>
            </div>
            
            <!-- 2.1 Name -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.1 Name</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Surname', appData.lastName, 'lastName')}
                ${createField('First Name', appData.firstName, 'firstName')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Second Name', appData.secondName, 'secondName')}
                ${createField('Middle Name', appData.middleName, 'middleName')}
            </div>
            
            <!-- 2.2 Mailing Address -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.2 Mailing Address</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Number Street', appData.numberStreet, 'numberStreet')}
                ${createField('District', appData.district, 'district')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Region', appData.region, 'region')}
                ${createField('Province', appData.province, 'province')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('City', appData.city, 'city')}
                ${createField('Barangay', appData.barangay, 'barangay')}
            </div>
            
            ${createField('Zip', appData.zip, 'zip')}
            
            <!-- 2.3 Mother's Name -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.3 Mother's Name</div>
            </div>
            
            ${createField('Mother\'s Name', appData.motherName, 'motherName')}
            
            <!-- 2.4 Father's Name -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.4 Father's Name</div>
            </div>
            
            ${createField('Father\'s Name', appData.fatherName, 'fatherName')}
            
            <!-- 2.5 Sex -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.5 Sex</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                <div style="padding: 10px; background: #f9f9f9; border-radius: 4px; border: 1px solid #ddd;">
                    <input type="radio" name="sex" value="Male" ${appData.sex === 'Male' ? 'checked' : ''} disabled> Male
                </div>
                <div style="padding: 10px; background: #f9f9f9; border-radius: 4px; border: 1px solid #ddd;">
                    <input type="radio" name="sex" value="Female" ${appData.sex === 'Female' ? 'checked' : ''} disabled> Female
                </div>
            </div>
            
            <!-- 2.6 Civil Status -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.6 Civil Status</div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                <div style="padding: 10px; background: #f9f9f9; border-radius: 4px; border: 1px solid #ddd;">
                    <input type="radio" name="civilStatus" value="Single" ${appData.civilStatus === 'Single' ? 'checked' : ''} disabled> Single
                </div>
                <div style="padding: 10px; background: #f9f9f9; border-radius: 4px; border: 1px solid #ddd;">
                    <input type="radio" name="civilStatus" value="Married" ${appData.civilStatus === 'Married' ? 'checked' : ''} disabled> Married
                </div>
                <div style="padding: 10px; background: #f9f9f9; border-radius: 4px; border: 1px solid #ddd;">
                    <input type="radio" name="civilStatus" value="Widower" ${appData.civilStatus === 'Widower' ? 'checked' : ''} disabled> Widower
                </div>
                <div style="padding: 10px; background: #f9f9f9; border-radius: 4px; border: 1px solid #ddd;">
                    <input type="radio" name="civilStatus" value="Separated" ${appData.civilStatus === 'Separated' ? 'checked' : ''} disabled> Separated
                </div>
            </div>
            
            <!-- 2.7 Contact Numbers -->
            <div style="border: 2px solid #E67E22; padding: 10px; margin-bottom: 15px; background: #f9f9f9; margin-top: 20px;">
                <div style="font-size: 12px; font-weight: 700; color: #333; text-transform: uppercase;">2.7 Contact Number(s)</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Tel', appData.tel, 'tel')}
                ${createField('Mobile', appData.mobile || appData.phone, 'mobile')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Email', appData.email, 'email')}
                ${createField('Fax', appData.fax, 'fax')}
            </div>
            
            <!-- Submission Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px; margin-top: 30px;">
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 5px;">Submitted</div>
                    <div style="font-size: 14px; font-weight: 600; color: #333;">
                        ${appData.createdAt ? new Date(appData.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 5px;">Status</div>
                    <div style="display: inline-block; padding: 6px 12px; background: ${appData.status === 'Pending' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(39, 174, 96, 0.1)'}; color: ${appData.status === 'Pending' ? '#F39C12' : '#27AE60'}; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                        ${appData.status || 'Pending'}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer with buttons -->
        <div id="formFooter" style="padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; position: sticky; bottom: 0;">
            <button onclick="closeFormModal()" style="padding: 10px 20px; background: #757575; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease;">
                <i class="bi bi-x-lg"></i> Close
            </button>
            <button id="editBtn" onclick="toggleEditMode('${appData._id || appData.id}')" style="padding: 10px 20px; background: #E67E22; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease;">
                <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button onclick="window.print()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease;">
                <i class="bi bi-printer"></i> Print
            </button>
        </div>
    `;
    
    container.innerHTML = formHTML;
    modal.appendChild(container);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeFormModal();
    });
}

function toggleEditMode(applicationId) {
    isEditMode = !isEditMode;
    const fields = document.querySelectorAll('.form-field');
    const editBtn = document.getElementById('editBtn');
    const printBtn = document.querySelector('button[onclick="window.print()"]');
    
    if (isEditMode) {
        fields.forEach(field => { field.disabled = false; field.style.borderColor = '#E67E22'; });
        editBtn.innerHTML = '<i class="bi bi-check-circle"></i> Save';
        editBtn.style.background = '#27AE60';
        editBtn.onclick = function() { saveApplicationForm(applicationId); };
        if (printBtn) printBtn.style.display = 'none';
    } else {
        fields.forEach(field => { field.disabled = true; field.style.borderColor = '#ddd'; });
        editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Edit';
        editBtn.style.background = '#E67E22';
        editBtn.onclick = function() { toggleEditMode(applicationId); };
        if (printBtn) printBtn.style.display = 'flex';
    }
}

function saveApplicationForm(applicationId) {
    const fields = document.querySelectorAll('.form-field');
    const formData = {};
    fields.forEach(field => { formData[field.dataset.field] = field.value; });
    
    fetch(`http://localhost:5500/api/applications/${applicationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert('Application saved successfully!');
            isEditMode = false;
            toggleEditMode(applicationId);
        } else {
            alert('Failed to save application');
        }
    })
    .catch(error => { console.error('Error:', error); alert('Error saving application'); });
}

function closeFormModal() {
    const modal = document.getElementById('formModal');
    if (modal) modal.remove();
}

function openAdmissionFormWithData(admissionData) {
    console.log('Admission Data Received:', admissionData);
    currentFormData = admissionData;
    isEditMode = false;
    
    const modal = document.createElement('div');
    modal.id = 'formModal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 20px; overflow-y: auto;`;
    
    const container = document.createElement('div');
    container.id = 'formContainer';
    container.style.cssText = `background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); max-width: 1200px; width: 100%; max-height: 90vh; overflow-y: auto;`;
    
    let formHTML = `
        <div style="background: linear-gradient(135deg, #E67E22 0%, #d35400 100%); padding: 30px 20px; text-align: center; color: white; position: sticky; top: 0; z-index: 10;">
            <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="bi bi-file-earmark-check"></i> Admission Slip
            </h1>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">TESDA Assessment Center | Competency Assessment</p>
        </div>
        
        <div id="formContent" style="padding: 30px;">
            <div style="border: 2px solid #E67E22; padding: 15px; margin-bottom: 20px; background: #fff9f0;">
                <div style="font-size: 14px; font-weight: 700; color: #E67E22; text-transform: uppercase; letter-spacing: 1px;">Admission Information</div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('First Name', admissionData.firstName, 'firstName')}
                ${createField('Last Name', admissionData.lastName, 'lastName')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Email', admissionData.email, 'email')}
                ${createField('Phone', admissionData.phone, 'phone')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Course', admissionData.courseId, 'courseId')}
                ${createField('Admission ID', admissionData.admissionId, 'admissionId')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                ${createField('Start Date', admissionData.startDate ? new Date(admissionData.startDate).toLocaleDateString() : '', 'startDate')}
                ${createField('End Date', admissionData.endDate ? new Date(admissionData.endDate).toLocaleDateString() : '', 'endDate')}
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; padding: 15px; background: #f0f0f0; border-radius: 4px; margin-top: 30px;">
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 5px;">Issued</div>
                    <div style="font-size: 14px; font-weight: 600; color: #333;">
                        ${admissionData.createdAt ? new Date(admissionData.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                </div>
                <div>
                    <div style="font-size: 11px; font-weight: 700; color: #666; text-transform: uppercase; margin-bottom: 5px;">Status</div>
                    <div style="display: inline-block; padding: 6px 12px; background: ${admissionData.status === 'Pending' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(39, 174, 96, 0.1)'}; color: ${admissionData.status === 'Pending' ? '#F39C12' : '#27AE60'}; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
                        ${admissionData.status || 'Active'}
                    </div>
                </div>
            </div>
        </div>
        
        <div id="formFooter" style="padding: 20px 30px; background: #f9f9f9; border-top: 1px solid #eee; display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; position: sticky; bottom: 0;">
            <button onclick="closeFormModal()" style="padding: 10px 20px; background: #757575; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease;">
                <i class="bi bi-x-lg"></i> Close
            </button>
            <button id="editBtn" onclick="toggleEditModeAdmission('${admissionData._id || admissionData.id}')" style="padding: 10px 20px; background: #E67E22; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease;">
                <i class="bi bi-pencil-square"></i> Edit
            </button>
            <button onclick="window.print()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; transition: all 0.3s ease;">
                <i class="bi bi-printer"></i> Print
            </button>
        </div>
    `;
    
    container.innerHTML = formHTML;
    modal.appendChild(container);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeFormModal();
    });
}

function toggleEditModeAdmission(admissionId) {
    isEditMode = !isEditMode;
    const fields = document.querySelectorAll('.form-field');
    const editBtn = document.getElementById('editBtn');
    const printBtn = document.querySelector('button[onclick="window.print()"]');
    
    if (isEditMode) {
        fields.forEach(field => { field.disabled = false; field.style.borderColor = '#E67E22'; });
        editBtn.innerHTML = '<i class="bi bi-check-circle"></i> Save';
        editBtn.style.background = '#27AE60';
        editBtn.onclick = function() { saveAdmissionForm(admissionId); };
        if (printBtn) printBtn.style.display = 'none';
    } else {
        fields.forEach(field => { field.disabled = true; field.style.borderColor = '#ddd'; });
        editBtn.innerHTML = '<i class="bi bi-pencil-square"></i> Edit';
        editBtn.style.background = '#E67E22';
        editBtn.onclick = function() { toggleEditModeAdmission(admissionId); };
        if (printBtn) printBtn.style.display = 'flex';
    }
}

function saveAdmissionForm(admissionId) {
    const fields = document.querySelectorAll('.form-field');
    const formData = {};
    fields.forEach(field => { formData[field.dataset.field] = field.value; });
    
    fetch(`http://localhost:5500/api/admissions/${admissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert('Admission saved successfully!');
            isEditMode = false;
            toggleEditModeAdmission(admissionId);
        } else {
            alert('Failed to save admission');
        }
    })
    .catch(error => { console.error('Error:', error); alert('Error saving admission'); });
}
