// MongoDB Backend API Service
const API_BASE_URL = 'http://localhost:5500/api';

// Course API
const CourseAPI = {
  // Get all courses
  async getAllCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get single course by ID
  async getCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
      if (!response.ok) throw new Error('Course not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Create new course
  async createCourse(courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (!response.ok) throw new Error('Failed to create course');
      return await response.json();
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update course
  async updateCourse(courseId, courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData)
      });
      if (!response.ok) throw new Error('Failed to update course');
      return await response.json();
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete course
  async deleteCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete course');
      return await response.json();
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

// User API
const UserAPI = {
  // Login
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Invalid credentials');
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Register
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to register');
      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Get user
  async getUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error('User not found');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

// Attendance API
const AttendanceAPI = {
  // Get attendance by user
  async getUserAttendance(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch attendance');
      return await response.json();
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // Create attendance
  async createAttendance(attendanceData) {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceData)
      });
      if (!response.ok) throw new Error('Failed to create attendance');
      return await response.json();
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  }
};

// Records API
const RecordAPI = {
  // Get records by user
  async getUserRecords(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/records/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch records');
      return await response.json();
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  // Create record
  async createRecord(recordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (!response.ok) throw new Error('Failed to create record');
      return await response.json();
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  },

  // Update record
  async updateRecord(recordId, recordData) {
    try {
      const response = await fetch(`${API_BASE_URL}/records/${recordId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordData)
      });
      if (!response.ok) throw new Error('Failed to update record');
      return await response.json();
    } catch (error) {
      console.error('Error updating record:', error);
      throw error;
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CourseAPI, UserAPI, AttendanceAPI, RecordAPI };
}
