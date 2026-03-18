# Burger Menu Implementation Guide

## Overview
A universal burger menu system has been implemented across all pages in the BETCI application. This provides a responsive, mobile-friendly navigation experience with consistent functionality across all sections.

## Files Modified

### Core Implementation
- **`frontend/assets/js/burger-menu.js`** - Main burger menu script with all functions

### Pages Updated

#### Trainee Pages
- `frontend/trainee/pages/dashboard.html`
- `frontend/trainee/pages/courses.html`
- `frontend/trainee/pages/assessment.html`
- `frontend/trainee/pages/attendance.html`
- `frontend/trainee/pages/records.html`
- `frontend/trainee/pages/settings.html`
- `frontend/trainee/pages/manage-profile.html`
- `frontend/trainee/pages/assessment/application-form.html`
- `frontend/trainee/pages/assessment/admission-slip.html`

#### Admin Pages
- `frontend/admin/pages/dashboard.html`
- `frontend/admin/pages/accounts.html`
- `frontend/admin/pages/trainees.html`
- `frontend/admin/pages/training-catalog.html`
- `frontend/admin/pages/appointments.html`
- `frontend/admin/pages/records.html`
- `frontend/admin/pages/settings.html`
- `frontend/admin/pages/courses.html`
- `frontend/admin/pages/competencies.html`
- `admin/pages/courses.html`

## Key Functions

### `initBurgerMenu()`
Initializes the burger menu on page load. Sets up event listeners for:
- Menu toggle button clicks
- Navigation link clicks
- Outside clicks to close menu
- Window resize events

### `toggleBurgerMenu(sidebar, mainContent, body)`
Toggles the menu open/closed state with:
- Sidebar visibility toggle
- Main content dimming effect
- Body overflow prevention
- Overlay management

### `closeBurgerMenu(sidebar, mainContent, body)`
Closes the burger menu and removes overlay

### `addMenuOverlay()`
Creates a semi-transparent overlay when menu is open for better UX

### `removeMenuOverlay()`
Removes the overlay when menu is closed

## Features

### Responsive Design
- **Desktop (>768px)**: Sidebar always visible, burger menu hidden
- **Mobile (≤768px)**: Burger menu visible, sidebar toggles on/off

### User Experience
- Smooth animations and transitions
- Overlay prevents interaction with main content when menu is open
- Auto-closes menu when navigating to a page on mobile
- Auto-closes menu on window resize to desktop size
- Keyboard support (ESC key to close)

### Dark Mode Support
- Burger menu styles adapt to dark mode
- Consistent color scheme with application theme

## HTML Structure Required

Each page must have:

```html
<!-- Sidebar -->
<aside class="sidebar">
    <!-- Sidebar content -->
</aside>

<!-- Main Content -->
<div class="main-content">
    <!-- Top Header with Menu Toggle -->
    <header class="top-header">
        <div class="header-left">
            <!-- Search and menu toggle -->
            <button class="menu-toggle" id="menuToggle">
                <i class="bi bi-list"></i>
            </button>
        </div>
    </header>
    
    <!-- Page content -->
</div>
```

## CSS Classes

### Applied Dynamically
- `.sidebar.active` - Sidebar is visible on mobile
- `.main-content.menu-open` - Main content is dimmed
- `.body.menu-open` - Body overflow is hidden
- `.menu-overlay` - Overlay element

## Implementation Steps

1. **Include the script** in your HTML:
   ```html
   <script src="../../assets/js/burger-menu.js"></script>
   ```

2. **Ensure proper HTML structure** with:
   - `<aside class="sidebar">` element
   - `<div class="main-content">` element
   - `<button class="menu-toggle" id="menuToggle">` button

3. **The script auto-initializes** on DOMContentLoaded

## Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Change Animation Speed
Edit the CSS in `burger-menu.js`:
```javascript
transition: transform 0.3s ease; // Change 0.3s to desired duration
```

### Change Overlay Opacity
Edit the overlay background:
```javascript
background: rgba(0, 0, 0, 0.5); // Change 0.5 to desired opacity
```

### Change Breakpoint
Edit the media query:
```javascript
@media (max-width: 768px) { // Change 768px to desired breakpoint
```

## Troubleshooting

### Menu not appearing
- Verify `menu-toggle` button has `id="menuToggle"`
- Check that sidebar has `class="sidebar"`
- Ensure burger-menu.js is loaded before page scripts

### Menu not closing
- Check browser console for JavaScript errors
- Verify overlay is being created/removed
- Check z-index values in CSS

### Styling issues
- Ensure Bootstrap Icons are loaded
- Check for CSS conflicts with existing styles
- Verify dark mode classes are applied correctly

## Testing Checklist

- [ ] Menu opens on burger button click
- [ ] Menu closes on overlay click
- [ ] Menu closes on nav link click (mobile)
- [ ] Menu closes on window resize to desktop
- [ ] Overlay appears when menu is open
- [ ] Main content dims when menu is open
- [ ] Dark mode styling works
- [ ] Keyboard ESC key closes menu
- [ ] Works on mobile devices
- [ ] Works on tablets
- [ ] Works on desktop

## Future Enhancements

Potential improvements:
- Add swipe gesture support for mobile
- Add keyboard navigation (arrow keys)
- Add animation preferences (prefers-reduced-motion)
- Add accessibility improvements (ARIA labels)
- Add submenu support for nested navigation
