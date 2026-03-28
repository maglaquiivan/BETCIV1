# How to Verify MongoDB Data

## Step 1: Run the Seed Script

Open a terminal in the backend folder and run:

```bash
cd BETCIV1-main/backend
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing data
Courses seeded successfully
Users seeded successfully
Database seeded successfully!
```

## Step 2: Check MongoDB Compass

### Database Name: `betci` (lowercase)

Look for these collections:

### 1. **users** collection
Should contain 2 documents:
- Admin user: `admin@betci.com`
- Trainee user: `trainee@betci.com`

### 2. **courses** collection
Should contain 6 documents:
- Forklift Operation NC II
- Bulldozer Operation NC II
- Dump Truck Operation NC II
- Hydraulic Excavator NC II
- Wheel Loader NC II
- Backhoe Loader NC II

## Step 3: In MongoDB Compass

1. Click on `BETCI` database (left sidebar)
2. You should see collections: `users`, `courses`
3. Click on `users` to see user accounts
4. Click on `courses` to see training courses

## Common Issues

### "This collection has no data"
- You're looking at the wrong collection
- The correct collections are `users` and `courses` in the `betci` database
- Run `npm run seed` to populate data

### Database name is wrong
- The database should be named `betci` (lowercase)
- Check your `.env` file: `MONGODB_URI=mongodb://localhost:27017/betci`

### Seed script fails
- Make sure MongoDB is running: `mongod` or `net start MongoDB`
- Check if you're in the backend folder: `cd BETCIV1-main/backend`
- Run `npm install` first if you haven't

## Manual Verification via MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to betci database
use betci

# Check users
db.users.find()

# Check courses
db.courses.find()

# Count documents
db.users.countDocuments()
db.courses.countDocuments()
```

Expected counts:
- users: 2
- courses: 6

## If Still No Data

1. Delete the database and start fresh:
```bash
mongosh
use betci
db.dropDatabase()
exit
```

2. Run seed script again:
```bash
cd BETCIV1-main/backend
npm run seed
```

3. Refresh MongoDB Compass
