# 🎯 Level 5: Responsive CSS Grid 📱💻

**Your Mission:** Create responsive layouts that work on all screen sizes.

**What You'll Learn:**
- CSS Grid for complex layouts
- Media queries for responsiveness
- Mobile-first design
- Relative units

**CSS Grid Basics:**
```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */
    gap: 20px; /* Space between items */
    grid-template-areas: 
        "header header"
        "sidebar content"
        "footer footer";
}
```

**Media Queries:**
```css
/* Mobile first */
.container { 
    display: block; 
}

/* Tablet */
@media (min-width: 768px) {
    .container { 
        display: grid; 
        grid-template-columns: 1fr 1fr;
    }
}

/* Desktop */
@media (min-width: 1024px) {
    .container { 
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}
```

**Relative Units:**
- `%` - percentage of parent
- `vw/vh` - viewport width/height
- `fr` - fraction (Grid only)
- `rem` - root element size

**Challenge:**
- Create a responsive grid layout
- Add media queries for different screens
- Make images responsive
- Use relative units

**🌐 Responsive Design is crucial** for modern websites!

**Run `bash check.sh` to see if your design is responsive!**
