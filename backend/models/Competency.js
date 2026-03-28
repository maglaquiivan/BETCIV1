const mongoose = require('mongoose');

const competencySchema = new mongoose.Schema({
  competencyId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['NC I', 'NC II', 'NC III', 'NC IV'],
    default: 'NC II'
  },
  units: [{
    unitCode: String,
    unitTitle: String,
    hours: Number
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'draft'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Competency', competencySchema);
