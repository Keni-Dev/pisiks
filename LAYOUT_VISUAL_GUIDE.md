# Visual Layout Guide

## Layout Modes Visual Reference

### 1. Side-by-Side Layout (Default) - Mobile Friendly ✅
```
┌─────────────────────────────────────────┐
│          HEADER with Layout Switcher    │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────┐  ┌───────────┐  │
│  │                   │  │  Physics  │  │
│  │   Simulation      │  │   Data    │  │
│  │     Canvas        │  │           │  │
│  │                   │  │  • Time   │  │
│  │   (800x400)       │  │  • Vel    │  │
│  │                   │  │  • Disp   │  │
│  └───────────────────┘  │  • Accel  │  │
│                         └───────────┘  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Controls Panel             │   │
│  │  (Full width)                   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

Mobile View:
┌─────────────┐
│   HEADER    │
├─────────────┤
│             │
│  ┌────────┐ │
│  │ Canvas │ │
│  │        │ │
│  └────────┘ │
│             │
│  ┌────────┐ │
│  │  Data  │ │
│  └────────┘ │
│             │
│  ┌────────┐ │
│  │Controls│ │
│  └────────┘ │
└─────────────┘
```

### 2. Overlay Layout - Clean View
```
┌─────────────────────────────────────────┐
│          HEADER with Layout Switcher    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                         ┌─────┐ │   │
│  │                         │Data │ │   │
│  │   Simulation Canvas     │Panel│ │   │
│  │                         │     │ │   │
│  │      (800x400)          └─────┘ │   │
│  │                    (Floating)   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Controls Panel             │   │
│  │  (Full width)                   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 3. Classic Layout - Original Desktop View
```
┌─────────────────────────────────────────┐
│          HEADER with Layout Switcher    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  │     Simulation Canvas           │   │
│  │                                 │   │
│  │        (800x400)                │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────────────────┐ ┌──────────────┐ │
│  │  Controls Panel  │ │  Data Panel  │ │
│  │                  │ │              │ │
│  │  • Presets       │ │  • Time      │ │
│  │  • Parameters    │ │  • Velocity  │ │
│  │  • View Mode     │ │  • Displace  │ │
│  │  • Units         │ │  • Accel     │ │
│  │  • Play/Pause    │ │              │ │
│  └──────────────────┘ └──────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Header Layout Switcher

### Desktop View
```
┌────────────────────────────────────────────────────┐
│  PISIKS SIMULATION  [Side][Overlay][Classic] [Help] [Learn] │
└────────────────────────────────────────────────────┘
```

### Mobile View
```
┌──────────────────────────────┐
│  PISIKS  [≡][⊡][□] [?] [📖] │
└──────────────────────────────┘
```

## Data Display Variants

### Side Variant (in Side Panel)
```
┌─────────────┐
│ Physics Data│
├─────────────┤
│ ⏱ Time:     │
│   2.5 s     │
│             │
│ 💨 Velocity:│
│   15.0 m/s  │
│             │
│ 📏 Displace:│
│   22.5 m    │
│             │
│ 📊 Accel:   │
│   2.0 m/s²  │
└─────────────┘
```

### Overlay Variant (on Canvas)
```
┌──────────┐
│ ⏱  2.5 s │
│ 💨 15.0  │
│ 📏 22.5  │
│ 📊  2.0  │
└──────────┘
(Semi-transparent)
```

### Bottom Variant (Horizontal)
```
┌────────────────────────────────────────┐
│  ⏱ Time   💨 Velocity  📏 Disp  📊 Accel│
│   2.5 s    15.0 m/s    22.5 m   2.0 m/s²│
└────────────────────────────────────────┘
```

## Responsive Breakpoints

```
Mobile (<640px)
└─ Stack everything vertically
└─ Show icons only in header
└─ Scrollable canvas

Tablet (640px - 1024px)  
└─ Partial labels
└─ Flexible grids
└─ Responsive canvas

Desktop (>1024px)
└─ Full layouts
└─ Fixed side panel (280px)
└─ All features visible
```

## Usage Instructions

1. **Change Layout**: Click layout buttons in header
   - **Side Button** (≡ icon): Best for mobile
   - **Overlay Button** (⊡ icon): Clean overlay view
   - **Classic Button** (□ icon): Traditional layout

2. **Mobile Tips**:
   - Default side-by-side works best
   - Swipe canvas horizontally if needed
   - All controls remain accessible

3. **Desktop Tips**:
   - Try overlay for presentations
   - Use classic for detailed work
   - Side-by-side maximizes space

## Best Practices

✅ **Do:**
- Use side-by-side on mobile devices
- Switch to overlay for presentations
- Use classic when you need full details side-by-side

❌ **Don't:**
- Don't use classic on very small screens
- Don't force one layout for all users
- Let users choose their preference

## Technical Notes

- Layout preference saved in localStorage
- Smooth transitions between layouts
- No page reload required
- Works offline (localStorage only)
