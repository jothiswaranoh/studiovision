# 🎯 Level 4: Modern Layouts with Flexbox 📐

**Your Mission:** Create flexible, responsive layouts using Flexbox.

**What You'll Learn:**
- Flex container properties
- Flex item properties
- Alignment and distribution
- Responsive layout techniques

**Flex Container Properties:**
```css
.container {
    display: flex;              /* Activate flexbox */
    justify-content: center;    /* Horizontal alignment */
    align-items: center;        /* Vertical alignment */
    flex-direction: row;        /* Direction: row, column */
    flex-wrap: wrap;            /* Wrap items */
}
```

**Flex Item Properties:**
```css
.item {
    flex: 1;                   /* Grow/shrink flexibility */
    order: 2;                  /* Display order */
    align-self: flex-start;    /* Individual alignment */
}
```

**Common justify-content values:**
- `flex-start` - left aligned
- `center` - centered  
- `space-between` - equal space between
- `space-around` - equal space around

**Challenge:**
- Create a horizontal navigation menu
- Center content both horizontally and vertically
- Make a flexible card layout
- Create a responsive gallery

**🚀 Flexbox is powerful!** It makes complex layouts simple.

**Run `bash check.sh` to see if your layouts are flexible!**
