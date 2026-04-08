# Quick Start: Course Management

## 🚀 Getting Started in 3 Steps

### 1️⃣ Start the Server
```bash
cd BETCIV1-main/backend
npm start
```
Server runs on: `http://localhost:5500`

### 2️⃣ Seed Initial Data (Optional)
```bash
cd BETCIV1-main/backend
node scripts/seedData.js
```
Creates 6 default courses

### 3️⃣ Access Admin Panel
```
URL: http://localhost:5500/admin/pages/courses.html
Login: admin@betci.com / admin123
```

---

## ➕ Add a New Course

1. Click **"Add New Course"** button
2. Fill in the form:
   - **Title**: e.g., "Crane Operation NC II"
   - **Description**: Brief course overview
   - **Image**: Upload file or paste URL
3. Click **"Save Changes"**
4. ✅ Done! Course appears everywhere

---

## ✏️ Edit a Course

1. Find the course card
2. Click **"Edit"** button
3. Modify the details
4. Click **"Save Changes"**
5. ✅ Updated!

---

## 🗑️ Delete a Course

1. Find the course card
2. Click **"Delete"** button
3. Confirm deletion
4. ✅ Removed!

---

## 📍 Where Courses Appear

After adding/editing a course, it automatically shows on:

✅ **Landing Page** - `http://localhost:5500/`
✅ **Trainee Dashboard** - `http://localhost:5500/trainee/pages/dashboard.html`
✅ **Admin Courses** - `http://localhost:5500/admin/pages/courses.html`

---

## 🔧 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get one course |
| POST | `/api/courses` | Create course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

---

## 📝 Course Data Structure

```javascript
{
  courseId: "course-name",      // Auto-generated
  title: "Course Title",        // Required
  description: "Description",   // Required
  image: "/path/to/image.png", // Optional
  category: "Heavy Equipment",  // Default
  duration: "3 months",         // Default
  status: "available",          // Default
  traineeCount: 0              // Default
}
```

---

## 🖼️ Image Guidelines

- **Formats**: JPG, PNG, GIF
- **Max Size**: 5MB
- **Options**:
  - Upload file (converted to base64)
  - Provide URL (e.g., `/assets/img/course.png`)

---

## ✅ Checklist

Before adding a course, make sure:
- [ ] MongoDB is running
- [ ] Backend server is started
- [ ] You're logged in as admin
- [ ] Course title is unique
- [ ] Description is clear and informative
- [ ] Image is ready (file or URL)

---

## 🐛 Troubleshooting

### Courses not showing?
```bash
# Check if server is running
curl http://localhost:5500/api/courses

# Check MongoDB connection
# Look for "MongoDB connected" in server logs
```

### Can't add courses?
- Verify you're logged in as admin
- Check browser console for errors
- Ensure all required fields are filled

### Images not loading?
- Use absolute paths: `/assets/img/image.png`
- Check file exists in the location
- Verify file size is under 5MB

---

## 📚 Documentation Files

- `COURSE_MANAGEMENT_GUIDE.md` - Complete guide
- `COURSE_MANAGEMENT_SUMMARY.md` - Implementation details
- `COURSE_WORKFLOW.md` - Visual workflow diagram
- `QUICK_START_COURSES.md` - This file

---

## 🎯 Example: Adding a New Course

```javascript
// What you enter:
Title: "Mobile Crane Operation NC III"
Description: "Advanced mobile crane operation for construction sites"
Image: /assets/img/mobile-crane.png

// What gets saved:
{
  courseId: "mobile-crane-operation-nc-iii",
  title: "Mobile Crane Operation NC III",
  description: "Advanced mobile crane operation for construction sites",
  image: "/assets/img/mobile-crane.png",
  category: "Heavy Equipment",
  duration: "3 months",
  status: "available",
  traineeCount: 0
}

// Where it appears:
✅ Landing page course catalog
✅ Trainee dashboard courses
✅ Admin courses management
```

---

## 💡 Pro Tips

1. **Use descriptive titles** - Include NC level (e.g., "NC II", "NC III")
2. **Write clear descriptions** - Explain what trainees will learn
3. **Use quality images** - Professional photos work best
4. **Test after adding** - Check landing page and trainee dashboard
5. **Keep course IDs unique** - System auto-generates from title

---

## 🔄 Auto-Refresh

- Landing page refreshes courses every 10 seconds
- Trainee dashboard loads on page open
- Admin panel reloads after each operation

---

## 📞 Need Help?

Check the documentation files or review the code:
- `backend/routes/courses.js` - API routes
- `backend/models/Course.js` - Database schema
- `frontend/js/api.js` - API client
- `frontend/admin/pages/courses.html` - Admin interface

---

**That's it! You're ready to manage courses. 🎉**
