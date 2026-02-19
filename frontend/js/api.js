// LocalStorage-based Course Management (No Backend Required)

// Initialize default courses if not exists
function initializeDefaultCourses() {
  const existingCourses = localStorage.getItem('betci_courses');
  if (!existingCourses) {
    const defaultCourses = [
      {
        courseId: 'forklift-operation',
        title: 'Forklift Operation NC II',
        description: 'Master forklift operation, safety protocols, and material handling techniques for industrial and warehouse environments.',
        image: '../assets/img/fork.png'
      },
      {
        courseId: 'bulldozer-operation',
        title: 'Bulldozer Operation NC II',
        description: 'Learn bulldozer operation, earthmoving techniques, and site preparation for construction and mining projects.',
        image: '../assets/img/bulldozer.png'
      },
      {
        courseId: 'dump-truck-operation',
        title: 'Dump Truck Operation NC II',
        description: 'Professional training for rigid on-highway dump truck operation, hauling, and transportation safety.',
        image: '../assets/img/dump truck.png'
      },
      {
        courseId: 'hydraulic-excavator',
        title: 'Hydraulic Excavator NC II',
        description: 'Advanced excavator operation, digging techniques, and hydraulic system maintenance for construction sites.',
        image: '../assets/img/hydraulic excavator.png'
      },
      {
        courseId: 'wheel-loader',
        title: 'Wheel Loader NC II',
        description: 'Comprehensive wheel loader training, material handling, and loading techniques for various applications.',
        image: '../assets/img/logo.png'
      },
      {
        courseId: 'backhoe-loader',
        title: 'Backhoe Loader NC II',
        description: 'Master backhoe loader operation, digging, trenching, and utility work for construction projects.',
        image: '../assets/img/logo.png'
      }
    ];
    localStorage.setItem('betci_courses', JSON.stringify(defaultCourses));
  }
}

// API Service for Courses (LocalStorage-based)
const CourseAPI = {
  // Get all courses
  async getAllCourses() {
    try {
      initializeDefaultCourses();
      const courses = JSON.parse(localStorage.getItem('betci_courses') || '[]');
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get single course by ID
  async getCourse(courseId) {
    try {
      const courses = JSON.parse(localStorage.getItem('betci_courses') || '[]');
      const course = courses.find(c => c.courseId === courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Create new course
  async createCourse(courseData) {
    try {
      const courses = JSON.parse(localStorage.getItem('betci_courses') || '[]');
      const newCourse = {
        courseId: courseData.courseId || `course-${Date.now()}`,
        ...courseData
      };
      courses.push(newCourse);
      localStorage.setItem('betci_courses', JSON.stringify(courses));
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update course
  async updateCourse(courseId, courseData) {
    try {
      const courses = JSON.parse(localStorage.getItem('betci_courses') || '[]');
      const index = courses.findIndex(c => c.courseId === courseId);
      
      if (index === -1) {
        throw new Error('Course not found');
      }
      
      courses[index] = {
        ...courses[index],
        ...courseData
      };
      
      localStorage.setItem('betci_courses', JSON.stringify(courses));
      return courses[index];
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete course
  async deleteCourse(courseId) {
    try {
      const courses = JSON.parse(localStorage.getItem('betci_courses') || '[]');
      const filteredCourses = courses.filter(c => c.courseId !== courseId);
      localStorage.setItem('betci_courses', JSON.stringify(filteredCourses));
      return { success: true };
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CourseAPI;
}
