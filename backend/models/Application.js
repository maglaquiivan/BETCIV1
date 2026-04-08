const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  // Reference Number and ULI
  referenceNumber: String,
  uli: {
    segment1: String,
    segment2: String,
    segment3: String,
    segment4: String
  },
  
  // School and Assessment Information
  schoolName: String,
  assessmentTitle: String,
  schoolAddress: String,
  dateOfApplication: Date,
  assessmentType: {
    type: String,
    enum: ['Full Qualification', 'COC', 'Renewal']
  },
  
  // Client Type
  clientType: {
    tvetGraduatingStudent: Boolean,
    tvetGraduate: Boolean,
    industryWorker: Boolean,
    k12: Boolean,
    owf: Boolean
  },
  
  // Personal Information
  profile: {
    surname: String,
    firstName: String,
    secondName: String,
    middleName: String,
    middleInitial: String,
    nameExtension: String,
    picture: String, // base64 image
    
    // Address
    numberStreet: String,
    barangay: String,
    district: String,
    city: String,
    province: String,
    region: String,
    zip: String,
    
    // Parents
    mothersName: String,
    fathersName: String,
    
    // Personal Details
    sex: {
      type: String,
      enum: ['Male', 'Female']
    },
    civilStatus: {
      type: String,
      enum: ['Single', 'Married', 'Widower', 'Separated']
    },
    
    // Contact
    tel: String,
    mobile: String,
    email: String,
    fax: String,
    others: String,
    
    // Education and Employment
    highestEducationalAttainment: String,
    employmentStatus: String,
    birthDate: Date,
    birthPlace: String,
    age: Number
  },
  
  // Work Experience
  workExperience: [{
    companyName: String,
    position: String,
    inclusiveDates: String,
    monthlySalary: String,
    statusOfAppointment: String,
    yearsOfExperience: String
  }],
  
  // Training/Seminars
  trainingSeminars: [{
    title: String,
    venue: String,
    inclusiveDates: String,
    numberOfHours: String,
    conductedBy: String
  }],
  
  // Licensure Examinations
  licensureExams: [{
    title: String,
    yearTaken: String,
    examinationVenue: String,
    rating: String,
    remarks: String,
    expiryDate: String
  }],
  
  // Competency Assessments
  competencyAssessments: [{
    title: String,
    qualificationLevel: String,
    industrySector: String,
    certificateNumber: String,
    dateOfIssuance: String,
    expirationDate: String
  }],
  
  // Signature
  signature: String, // base64 image
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
