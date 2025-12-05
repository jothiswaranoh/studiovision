# 🎯 Level 3: The Box Model 📦

**Your Mission:** Understand and control spacing with margins, padding, and borders.

**What You'll Learn:**
- The CSS Box Model
- Margins (space outside)
- Padding (space inside)  
- Borders (edges)
- Box sizing

**The Box Model:**
```
[ Margin (outside) ]
  [ Border ]
    [ Padding (inside) ]
      [ Your Content ]
```

**Common Properties:**
```css
div {
    margin: 20px;           /* Space outside */
    padding: 15px;          /* Space inside */
    border: 2px solid black; /* Border style */
    width: 300px;           /* Content width */
    height: 200px;          /* Content height */
}
```

**Border Styles:**
- `solid` - continuous line
- `dashed` - broken line
- `dotted` - dotted line
- `double` - double line

**Challenge:**
- Add padding to paragraphs
- Add margins between divs
- Create borders around sections
- Center a div on the page

**💡 Pro Tip:** Use `box-sizing: border-box;` to include padding/border in width/height!

**Run `bash check.sh` to check your spacing skills!**
