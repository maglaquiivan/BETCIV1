# Course Management Workflow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN PANEL                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Courses Page                                │     │
│  │  ┌──────────────────────────────────────────┐      │     │
│  │  │  [Add New Course] Button                 │      │     │
│  │  └──────────────────────────────────────────┘      │     │
│  │                                                      │     │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐            │     │
│  │  │ Course  │  │ Course  │  │ Course  │            │     │
│  │  │   #1    │  │   #2    │  │   #3    │            │     │
│  │  │ [Edit]  │  │ [Edit]  │  │ [Edit]  │            │     │
│  │  │ [Delete]│  │ [Delete]│  │ [Delete]│            │     │
│  │  └─────────┘  └─────────┘  └─────────┘            │     │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Click "Add New Course"
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   ADD/EDIT MODAL                             │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Course Image: [Upload] or [URL]                   │     │
│  │  ┌──────────────────────────────────────┐          │     │
│  │  │  [Image Preview]                     │          │     │
│  │  └──────────────────────────────────────┘          │     │
│  │                                                      │     │
│  │  Course Title: [_____________________]              │     │
│  │                                                      │     │
│  │  Description:  [_____________________]              │     │
│  │                [_____________________]              │     │
│  │                                                      │     │
│  │  [Cancel]  [Save Changes]                           │     │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Click "Save Changes"
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API                               │
│  POST /api/courses                                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │  {                                                  │     │
│  │    courseId: "new-course",                          │     │
│  │    title: "New Course NC II",                       │     │
│  │    description: "Course description",               │     │
│  │    image: "/assets/img/course.png",                 │     │
│  │    category: "Heavy Equipment",                     │     │
│  │    duration: "3 months",                            │     │
│  │    status: "available"                              │     │
│  │  }                                                  │     │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Save to Database
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB DATABASE                           │
│  Collection: courses                                         │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Document 1: Forklift Operation NC II              │     │
│  │  Document 2: Bulldozer Operation NC II             │     │
│  │  Document 3: New Course NC II  ← NEW!              │     │
│  └──────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Fetch Courses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AUTOMATIC DISPLAY ON ALL PAGES                  │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  LANDING PAGE    │  │ TRAINEE DASHBOARD│                │
│  │  (index.html)    │  │  (dashboard.html)│                │
│  │                  │  │                  │                │
│  │  ┌────────────┐  │  │  ┌────────────┐  │                │
│  │  │ Course #1  │  │  │  │ Course #1  │  │                │
│  │  └────────────┘  │  │  └────────────┘  │                │
│  │  ┌────────────┐  │  │  ┌────────────┐  │                │
│  │  │ Course #2  │  │  │  │ Course #2  │  │                │
│  │  └────────────┘  │  │  └────────────┘  │                │
│  │  ┌────────────┐  │  │  ┌────────────┐  │                │
│  │  │ NEW COURSE │  │  │  │ NEW COURSE │  │                │
│  │  │    ★       │  │  │  │    ★       │  │                │
│  │  └────────────┘  │  │  └────────────┘  │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Step-by-Step Process

### 1. Admin Adds Course
```
Admin Panel → Courses → Click "Add New Course"
```

### 2. Fill Course Details
```
- Upload image or provide URL
- Enter course title
- Enter course description
- Click "Save Changes"
```

### 3. API Request
```javascript
POST http://localhost:5500/api/courses
Body: {
  courseId: "generated-from-title",
  title: "Course Title",
  description: "Course Description",
  image: "/path/to/image.png",
  category: "Heavy Equipment",
  duration: "3 months",
  status: "available"
}
```

### 4. Database Storage
```
MongoDB → courses collection → New document created
```

### 5. Automatic Display
```
Landing Page:
  GET /api/courses → Renders course cards

Trainee Dashboard:
  GET /api/courses → Displays in courses grid

Admin Panel:
  GET /api/courses → Shows in management interface
```

## Data Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Admin   │────▶│   API    │────▶│ MongoDB  │────▶│  Display │
│  Input   │     │ Endpoint │     │ Database │     │  Pages   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
    │                 │                 │                 │
    │                 │                 │                 │
    ▼                 ▼                 ▼                 ▼
 Form Data      POST/PUT/DELETE    Save/Update      Fetch & Show
```

## Example: Adding "Crane Operation NC II"

### Step 1: Admin Input
```
Title: Crane Operation NC II
Description: Learn tower crane operation, load management, and safety protocols
Image: /assets/img/crane.png
```

### Step 2: Generated Course ID
```javascript
courseId: "crane-operation-nc-ii"
// Auto-generated from title (lowercase, hyphenated)
```

### Step 3: Database Entry
```javascript
{
  _id: ObjectId("..."),
  courseId: "crane-operation-nc-ii",
  title: "Crane Operation NC II",
  description: "Learn tower crane operation, load management, and safety protocols",
  image: "/assets/img/crane.png",
  category: "Heavy Equipment",
  duration: "3 months",
  status: "available",
  traineeCount: 0,
  createdAt: "2024-03-15T10:30:00Z",
  updatedAt: "2024-03-15T10:30:00Z"
}
```

### Step 4: Display on Landing Page
```html
<div class="col-lg-4 col-md-6">
  <div class="service-item">
    <div class="course-icon">
      <img src="/assets/img/crane.png" alt="Crane Operation NC II">
    </div>
    <h3>Crane Operation NC II</h3>
    <p>Learn tower crane operation, load management, and safety protocols</p>
    <a href="/auth/login.html?course=crane-operation-nc-ii">Enroll Now</a>
  </div>
</div>
```

### Step 5: Display on Trainee Dashboard
```html
<div class="course-card">
  <img src="/assets/img/crane.png" alt="Crane Operation NC II">
  <h3>Crane Operation NC II</h3>
  <p>Learn tower crane operation, load management, and safety protocols</p>
  <button onclick="enrollCourse('crane-operation-nc-ii')">Enroll</button>
</div>
```

## Update/Delete Flow

### Edit Course
```
Admin clicks "Edit" → Modal opens with current data → 
Admin modifies → Click "Save" → PUT /api/courses/:id → 
Database updated → All pages refresh
```

### Delete Course
```
Admin clicks "Delete" → Confirmation dialog → 
Confirm → DELETE /api/courses/:id → 
Database removes document → All pages refresh
```

## Real-Time Sync

- Landing page auto-refreshes every 10 seconds
- Trainee dashboard loads on page load
- Admin panel reloads after each operation
- All pages fetch from the same database source

## Benefits

✅ Single source of truth (MongoDB)
✅ No manual HTML editing required
✅ Instant updates across all pages
✅ Easy course management
✅ Scalable architecture
✅ Consistent data everywhere
