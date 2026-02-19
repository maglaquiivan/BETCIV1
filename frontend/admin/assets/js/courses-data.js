/**
 * Courses Data Management - LocalStorage Based
 */

// Initialize default courses if not exists
function initializeCoursesData() {
  const existingCourses = localStorage.getItem('betci_courses');
  if (!existingCourses) {
    const defaultCourses = [
      {
        id: 1,
        courseId: 'forklift-operation',
        title: 'Forklift Operation NC II',
        description: 'Master forklift operation, safety protocols, and material handling techniques for industrial and warehouse environments.',
        image: '../../assets/img/fork.png',
        level: 'NC II',
        duration: 40,
        status: 'active'
      },
      {
        id: 2,
        courseId: 'bulldozer-operation',
        title: 'Bulldozer Operation NC II',
        description: 'Learn bulldozer operation, earthmoving techniques, and site preparation for construction and mining projects.',
        image: '../../assets/img/bulldozer.png',
        level: 'NC II',
        duration: 40,
        status: 'active'
      },
      {
        id: 3,
        courseId: 'dump-truck-operation',
        title: 'Dump Truck Operation NC II',
        description: 'Professional training for rigid on-highway dump truck operation, hauling, and transportation safety.',
        image: '../../assets/img/dump truck.png',
        level: 'NC II',
        duration: 40,
        status: 'active'
      },
      {
        id: 4,
        courseId: 'hydraulic-excavator',
        title: 'Hydraulic Excavator NC II',
        description: 'Advanced excavator operation, digging techniques, and hydraulic system maintenance for construction sites.',
        image: '../../assets/img/hydraulic excavator.png',
        level: 'NC II',
        duration: 40,
        status: 'active'
      },
      {
        id: 5,
        courseId: 'wheel-loader',
        title: 'Wheel Loader NC II',
        description: 'Comprehensive wheel loader training, material handling, and loading techniques for various applications.',
        image: '../../assets/img/logo.png',
        level: 'NC II',
        duration: 40,
        status: 'active'
      },
      {
        id: 6,
        courseId: 'backhoe-loader',
        title: 'Backhoe Loader NC II',
        description: 'Master backhoe loader operation, digging, trenching, and utility work for construction projects.',
        image: '../../assets/img/logo.png',
        level: 'NC II',
        duration: 40,
        status: 'active'
      }
    ];
    localStorage.setItem('betci_courses', JSON.stringify(defaultCourses));
  }
}

// Get all courses
function getCoursesData() {
  initializeCoursesData();
  const courses = JSON.parse(localStorage.getItem('betci_courses') || '[]');
  return courses;
}

// Get single course by ID
function getCourseById(id) {
  const courses = getCoursesData();
  return courses.find(course => course.id === parseInt(id));
}

// Add new course
function addCourseData(courseData) {
  const courses = getCoursesData();
  const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
  
  const newCourse = {
    id: newId,
    courseId: courseData.courseId || `course-${Date.now()}`,
    title: courseData.title,
    description: courseData.description,
    image: courseData.image,
    level: courseData.level || 'NC II',
    duration: courseData.duration || 40,
    status: courseData.status || 'active'
  };
  
  courses.push(newCourse);
  localStorage.setItem('betci_courses', JSON.stringify(courses));
  return newCourse;
}

// Update course
function updateCourseData(id, courseData) {
  const courses = getCoursesData();
  const index = courses.findIndex(course => course.id === parseInt(id));
  
  if (index !== -1) {
    courses[index] = {
      ...courses[index],
      ...courseData,
      id: parseInt(id) // Ensure ID doesn't change
    };
    localStorage.setItem('betci_courses', JSON.stringify(courses));
    return courses[index];
  }
  return null;
}

// Delete course
function deleteCourseData(id) {
  const courses = getCoursesData();
  const filteredCourses = courses.filter(course => course.id !== parseInt(id));
  localStorage.setItem('betci_courses', JSON.stringify(filteredCourses));
  return true;
}

// Get courses count
function getCoursesCount() {
  const courses = getCoursesData();
  return courses.length;
}

// Get active courses count
function getActiveCoursesCount() {
  const courses = getCoursesData();
  return courses.filter(course => course.status === 'active').length;
}
