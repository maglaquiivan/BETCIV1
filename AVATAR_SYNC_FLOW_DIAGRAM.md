# Avatar Sync Flow Diagram

## Upload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOADS AVATAR                       │
│                      (Settings Page)                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Convert to Base64   │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Send to API        │
              │   PUT /api/admin-    │
              │   accounts/:id       │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Save to MongoDB     │
              │  (profilePicture)    │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Clear Old Cache     │
              │  sessionStorage      │
              │  .removeItem()       │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Set New Cache       │
              │  + Timestamp         │
              │  sessionStorage      │
              │  .setItem()          │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Update Display      │
              │  (Settings Page)     │
              └──────────────────────┘
```

## Navigation Flow (Fresh Cache < 5 seconds)

```
┌─────────────────────────────────────────────────────────────┐
│              USER NAVIGATES TO DASHBOARD                     │
│                  (within 5 seconds)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Page Loads          │
              │  admin-dashboard.js  │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Check Cache         │
              │  sessionStorage      │
              │  .getItem()          │
              └──────────┬───────────┘
                         │
                    ┌────┴────┐
                    │         │
              Cache │         │ No Cache
              Found │         │ Found
                    │         │
                    ▼         ▼
         ┌──────────────┐  ┌──────────────┐
         │ Display      │  │ Fetch from   │
         │ Cached       │  │ API          │
         │ Avatar       │  └──────────────┘
         └──────┬───────┘
                │
                ▼
         ┌──────────────┐
         │ Check Cache  │
         │ Timestamp    │
         └──────┬───────┘
                │
           ┌────┴────┐
           │         │
      Age │         │ Age
       <5s│         │ ≥5s
           │         │
           ▼         ▼
    ┌──────────┐  ┌──────────┐
    │ SKIP API │  │ Fetch    │
    │ CALL     │  │ from API │
    │ ✓ DONE!  │  └────┬─────┘
    └──────────┘       │
                       ▼
                ┌──────────────┐
                │ Compare with │
                │ Cache        │
                └──────┬───────┘
                       │
                  ┌────┴────┐
                  │         │
            Same  │         │ Different
                  │         │
                  ▼         ▼
           ┌──────────┐  ┌──────────┐
           │ No       │  │ Update   │
           │ Update   │  │ Cache &  │
           │ Needed   │  │ Display  │
           └──────────┘  └──────────┘
```

## Navigation Flow (Stale Cache ≥ 5 seconds)

```
┌─────────────────────────────────────────────────────────────┐
│              USER NAVIGATES TO DASHBOARD                     │
│                  (after 5+ seconds)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Check Cache         │
              │  Found: YES          │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Display Cached      │
              │  Avatar Immediately  │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Check Timestamp     │
              │  Age: 10 seconds     │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Fetch from API      │
              │  (verify freshness)  │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Compare API vs      │
              │  Cached Data         │
              └──────────┬───────────┘
                         │
                    ┌────┴────┐
                    │         │
              Same  │         │ Different
                    │         │
                    ▼         ▼
         ┌──────────────┐  ┌──────────────┐
         │ Keep Cache   │  │ Update Cache │
         │ No Change    │  │ Update       │
         │              │  │ Display      │
         └──────────────┘  └──────────────┘
```

## Manual Refresh Flow

```
┌─────────────────────────────────────────────────────────────┐
│           USER RUNS: refreshAvatar()                         │
│                  (in console)                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Clear Cache         │
              │  sessionStorage      │
              │  .removeItem()       │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Clear Timestamp     │
              │  sessionStorage      │
              │  .removeItem()       │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Call                │
              │  loadAdminProfile    │
              │  Picture()           │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Fetch from API      │
              │  (forced)            │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Update Cache        │
              │  + Timestamp         │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Update Display      │
              └──────────────────────┘
```

## Cache State Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CACHE STATES                              │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   EMPTY      │  No cache exists
    │   (Initial)  │  → Fetch from API
    └──────┬───────┘
           │ Upload Avatar
           ▼
    ┌──────────────┐
    │   FRESH      │  Age < 5 seconds
    │   (Trusted)  │  → Use cache, skip API
    └──────┬───────┘
           │ Wait 5+ seconds
           ▼
    ┌──────────────┐
    │   STALE      │  Age ≥ 5 seconds
    │   (Verify)   │  → Use cache, verify with API
    └──────┬───────┘
           │ Upload New Avatar
           ▼
    ┌──────────────┐
    │   CLEARED    │  Cache removed
    │   (Reset)    │  → Fetch from API
    └──────────────┘
           │ New cache set
           ▼
    ┌──────────────┐
    │   FRESH      │  Age < 5 seconds
    │   (Trusted)  │  → Use cache, skip API
    └──────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA LOCATIONS                            │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│   MongoDB            │  Persistent storage
│   (Database)         │  profilePicture field
│                      │  Base64 string
└──────────┬───────────┘
           │
           │ API: GET /api/admin-accounts/:id
           │ API: PUT /api/admin-accounts/:id
           │
           ▼
┌──────────────────────┐
│   sessionStorage     │  Temporary cache
│   (Browser)          │  Key: adminProfilePic_ADM-001
│                      │  Key: adminProfilePic_ADM-001_timestamp
└──────────┬───────────┘
           │
           │ JavaScript: sessionStorage.getItem()
           │ JavaScript: sessionStorage.setItem()
           │
           ▼
┌──────────────────────┐
│   DOM Elements       │  Visual display
│   (HTML)             │  .user-avatar
│                      │  .dropdown-avatar
│                      │  .profile-avatar-large
└──────────────────────┘
```

## Timeline Example

```
Time    Action                          Cache State    API Call
─────────────────────────────────────────────────────────────────
0:00    Upload avatar in Settings       EMPTY          YES (PUT)
0:01    Cache updated                   FRESH (1s)     -
0:02    Navigate to Dashboard           FRESH (2s)     NO (skipped)
0:03    Avatar displays correctly       FRESH (3s)     -
0:08    Navigate to Competencies        STALE (8s)     YES (GET)
0:09    API confirms same avatar        STALE (9s)     -
0:10    No update needed                STALE (10s)    -
```

## Key Concepts

### Cache Priority
```
Fresh Cache (< 5s)  >  API Data  >  Stale Cache (≥ 5s)
     TRUSTED            VERIFY         FALLBACK
```

### Update Strategy
```
Upload → Clear → Set → Display
         ↓       ↓
      Remove   Add New
      Old      + Timestamp
```

### Verification Strategy
```
Cache Exists? → Display → Check Age → Decide API Call
     NO       → Fetch API
     YES      → Show Now → < 5s → Skip API
                         → ≥ 5s → Verify API
```

## Legend

```
┌──────┐
│ Box  │  = Process/Action
└──────┘

   ▼     = Flow direction

  ┌─┴─┐  = Decision point
  │   │
```
