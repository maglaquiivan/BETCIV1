const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  admissionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  applicationId: {
    type: String,
    ref: 'Application'
  },
  
  // Applicant Information
  applicantName: {
    type: String,
    required: true
  },
  telNumber: String,
  picture: String, // base64 image
  
  // Assessment Information
  assessmentApplied: String,
  officialReceiptNumber: String,
  dateIssued: Date,
  assessmentCenter: String,
  
  // Requirements Checklist
  requirements: {
    selfAssessmentGuide: {
      type: Boolean,
      default: false
    },
    passportPictures: {
      type: Boolean,
      default: false
    }
  },
  
  // Remarks
  remarks: {
    bringPPE: {
      type: Boolean,
      default: false
    },
    others: {
      type: Boolean,
      default: false
    },
    othersSpecify: String
  },
  
  // Assessment Schedule
  assessmentDate: Date,
  assessmentTime: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admission', admissionSchema);
