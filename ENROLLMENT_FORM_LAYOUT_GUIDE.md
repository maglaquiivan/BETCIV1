# Enrollment Form Layout Guide

## New Landscape Layout

The enrollment form now uses a modern two-column grid layout for better space utilization and improved user experience.

## Layout Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│                         Enrollment Form                           [X]  │
│              Complete this form to enroll in [Course Name]             │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────┬──────────────────────────────┐     │
│  │ First Name *                 │ Last Name *                  │     │
│  │ [John                    ]   │ [Doe                     ]   │     │
│  └──────────────────────────────┴──────────────────────────────┘     │
│                                                                        │
│  ┌──────────────────────────────┬──────────────────────────────┐     │
│  │ Email Address *              │ Phone Number *               │     │
│  │ [john.doe@email.com      ]   │ [+63 XXX XXX XXXX        ]   │     │
│  └──────────────────────────────┴──────────────────────────────┘     │
│                                                                        │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │ Address *                                                   │      │
│  │ [123 Main Street, City, Province                        ]   │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                        │
│  ┌──────────────────────────────┬──────────────────────────────┐     │
│  │ Date of Birth *              │ Gender *                     │     │
│  │ [MM/DD/YYYY              ]   │ [Male ▼                  ]   │     │
│  └──────────────────────────────┴──────────────────────────────┘     │
│                                                                        │
│  ┌──────────────────────────────┬──────────────────────────────┐     │
│  │ Highest Educational Attainment│ Emergency Contact Name      │     │
│  │ [High School ▼           ]   │ [Jane Doe                ]   │     │
│  └──────────────────────────────┴──────────────────────────────┘     │
│                                                                        │
│  ┌──────────────────────────────┐                                     │
│  │ Emergency Contact Phone      │                                     │
│  │ [+63 XXX XXX XXXX        ]   │                                     │
│  └──────────────────────────────┘                                     │
│                                                                        │
│  ────────────────────────────────────────────────────────────────    │
│                                                                        │
│         [✓ Submit Enrollment]              [Cancel]                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

## Field Arrangement

### Row 1: Name Fields
```
┌─────────────────────────┬─────────────────────────┐
│ First Name *            │ Last Name *             │
│ [Input Field]           │ [Input Field]           │
└─────────────────────────┴─────────────────────────┘
```

### Row 2: Contact Fields
```
┌─────────────────────────┬─────────────────────────┐
│ Email Address *         │ Phone Number *          │
│ [Input Field]           │ [Input Field]           │
└─────────────────────────┴─────────────────────────┘
```

### Row 3: Address (Full Width)
```
┌───────────────────────────────────────────────────┐
│ Address *                                         │
│ [Textarea - 2 rows]                               │
└───────────────────────────────────────────────────┘
```

### Row 4: Personal Info
```
┌─────────────────────────┬─────────────────────────┐
│ Date of Birth *         │ Gender *                │
│ [Date Picker]           │ [Dropdown]              │
└─────────────────────────┴─────────────────────────┘
```

### Row 5: Education & Emergency Contact
```
┌─────────────────────────┬─────────────────────────┐
│ Educational Attainment  │ Emergency Contact Name  │
│ [Dropdown]              │ [Input Field]           │
└─────────────────────────┴─────────────────────────┘
```

### Row 6: Emergency Phone
```
┌─────────────────────────┐
│ Emergency Contact Phone │
│ [Input Field]           │
└─────────────────────────┘
```

## Responsive Breakpoints

### Desktop View (>768px)
- **Width:** 900px maximum
- **Layout:** Two columns
- **Gap:** 20px between fields
- **Padding:** 32px around content

```
┌────────────────────────────────────────┐
│  [Field 1]        [Field 2]            │
│  [Field 3]        [Field 4]            │
│  [Full Width Field]                    │
└────────────────────────────────────────┘
```

### Tablet/Mobile View (≤768px)
- **Width:** 95% of screen
- **Layout:** Single column (stacked)
- **Gap:** 16px between fields
- **Padding:** 24px around content

```
┌──────────────────────┐
│  [Field 1]           │
│  [Field 2]           │
│  [Field 3]           │
│  [Field 4]           │
│  [Full Width Field]  │
└──────────────────────┘
```

## CSS Grid Implementation

### Grid Container
```css
.form-grid-two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;  /* Two equal columns */
    gap: 20px;                        /* Space between fields */
}
```

### Full-Width Fields
```css
.form-group-full {
    grid-column: 1 / -1;  /* Span from first to last column */
}
```

### Responsive Adjustment
```css
@media (max-width: 768px) {
    .form-grid-two-columns {
        grid-template-columns: 1fr;  /* Single column on mobile */
        gap: 16px;
    }
}
```

## Field Specifications

### Input Fields
- **Height:** 44px (with 12px padding)
- **Border:** 1px solid #E8E8E8
- **Border Radius:** 6px
- **Font Size:** 14px
- **Focus State:** Orange border (#E67E22) with subtle shadow

### Textarea (Address)
- **Rows:** 2
- **Min Height:** 60px
- **Resizable:** Vertical only

### Dropdowns
- **Height:** 44px
- **Cursor:** Pointer
- **Arrow:** Native browser styling

### Labels
- **Font Weight:** 500
- **Font Size:** 14px
- **Margin Bottom:** 8px
- **Required Indicator:** Red asterisk (*)

## Color Scheme

### Primary Colors
- **Primary Orange:** #E67E22
- **Primary Yellow:** #F4C430
- **Primary Dark:** #D35400

### Form Colors
- **Border:** #E8E8E8
- **Background:** #FFFFFF
- **Text:** #333333
- **Label:** #000000
- **Placeholder:** #999999

### State Colors
- **Focus:** #E67E22 (orange)
- **Valid:** #27AE60 (green)
- **Invalid:** #E74C3C (red)
- **Disabled:** #CCCCCC (gray)

## Spacing System

### Vertical Spacing
- **Between Rows:** 20px (desktop), 16px (mobile)
- **Label to Input:** 8px
- **Section Padding:** 32px (desktop), 24px (mobile)

### Horizontal Spacing
- **Between Columns:** 20px
- **Modal Padding:** 32px (desktop), 24px (mobile)
- **Button Gap:** 12px

## Button Layout

### Action Buttons
```
┌────────────────────────────────────────────────┐
│  [✓ Submit Enrollment]      [Cancel]           │
└────────────────────────────────────────────────┘
```

- **Display:** Flex
- **Gap:** 12px
- **Flex:** 1 (equal width)
- **Padding:** 12px 24px
- **Border Radius:** 6px

### Submit Button
- **Background:** #E67E22 (orange)
- **Color:** White
- **Hover:** Darker orange with lift effect

### Cancel Button
- **Background:** #6c757d (gray)
- **Color:** White
- **Hover:** Darker gray

## Validation States

### Required Fields
```
Label with red asterisk: "First Name *"
```

### Valid Input
```
┌─────────────────────────┐
│ john.doe@email.com      │ ← Green border
└─────────────────────────┘
```

### Invalid Input
```
┌─────────────────────────┐
│ invalid-email           │ ← Red border
└─────────────────────────┘
```

### Focus State
```
┌─────────────────────────┐
│ [Typing...]             │ ← Orange border + shadow
└─────────────────────────┘
```

## Accessibility Features

### Keyboard Navigation
- **Tab:** Move to next field
- **Shift+Tab:** Move to previous field
- **Enter:** Submit form (when on submit button)
- **Escape:** Close modal

### Screen Reader Support
- Proper label associations
- Required field announcements
- Error message announcements
- Focus management

### Visual Indicators
- Clear required field markers (*)
- Color-coded validation states
- Focus outlines for keyboard users
- High contrast text

## Best Practices

### Do's ✅
- Keep related fields together (First Name + Last Name)
- Use full width for long text fields (Address)
- Provide clear labels and placeholders
- Show validation feedback immediately
- Pre-fill known user data

### Don'ts ❌
- Don't split related fields across rows
- Don't use too many columns (max 2)
- Don't hide required field indicators
- Don't use unclear placeholder text
- Don't disable copy/paste

## Performance Considerations

### Optimizations
- CSS Grid is hardware-accelerated
- No JavaScript for layout calculations
- Minimal DOM manipulation
- Efficient event handling

### Load Time
- No additional assets required
- Inline styles for critical CSS
- Lazy validation (on blur/submit)

## Browser Support

### Fully Supported
- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+
- iOS Safari 10.3+
- Chrome Android 57+

### Fallback
- Older browsers: Single column layout
- No CSS Grid: Stacked fields
- Graceful degradation

## Conclusion

The landscape layout provides:
- ✅ Better space utilization
- ✅ Faster form completion
- ✅ Modern, professional appearance
- ✅ Full responsiveness
- ✅ Maintained accessibility
- ✅ Improved user experience
