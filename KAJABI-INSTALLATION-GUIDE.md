# How to Add the Calculator to Your Kajabi Website

There are several methods to add this calculator to your Kajabi site. Choose the one that works best for you.

---

## 📋 **Method 1: Custom Page (RECOMMENDED - Easiest)**

This is the simplest method and gives you full control.

### Step-by-Step Instructions:

1. **Log into your Kajabi dashboard**

2. **Go to Website → Pages**

3. **Click "New Page"**
   - Choose "Blank Page" template
   - Give it a name like "Home Affordability Calculator"
   - Click "Create Page"

4. **Edit the page**
   - Click on the page you just created
   - Click "Edit Page"

5. **Add Custom Code**
   - Click the "+" button to add a new section
   - Select "Code" block (under Advanced)
   - Copy the **ENTIRE contents** of `kajabi-calculator.html`
   - Paste it into the code block
   - Click "Save"

6. **Adjust Page Settings**
   - Go to "Settings" (gear icon)
   - **Remove header/footer if desired** (for full-width display):
     - Under "Design Settings"
     - Toggle OFF "Show Header"
     - Toggle OFF "Show Footer"
   - Set SEO title and description
   - Click "Save"

7. **Publish**
   - Click "Publish" to make it live

8. **Access your calculator**
   - Your calculator will be at: `yourdomain.com/home-affordability-calculator`

---

## 📋 **Method 2: Embed in Existing Page**

Add the calculator to an existing page on your Kajabi site.

### Step-by-Step Instructions:

1. **Go to Website → Pages**

2. **Select the page** where you want to add the calculator

3. **Edit the page**

4. **Add Code Block**
   - Click "+" where you want the calculator
   - Select "Code" block
   - Copy the ENTIRE contents of `kajabi-calculator.html`
   - Paste into the code block
   - Click "Save"

5. **Publish changes**

### Important Notes for Embedding:
- The calculator will inherit your page's header and footer
- Make sure the page has enough width (remove sidebars if needed)
- The calculator is responsive and will adapt to the available space

---

## 📋 **Method 3: Popup/Modal (Advanced)**

Add the calculator as a popup that opens when users click a button.

### Step-by-Step Instructions:

1. **Create a hidden page** using Method 1 (don't add it to navigation)

2. **On your main page**, add a button:
   - Use Kajabi's button block
   - Set the button text: "Calculate Home Affordability"
   - Set link to: `#calculator-popup`

3. **Add this code to your page** (in a separate code block):

```html
<div id="calculator-popup" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:10000; overflow:auto;">
    <div style="position:relative; max-width:1200px; margin:2rem auto; background:white; border-radius:16px;">
        <button onclick="document.getElementById('calculator-popup').style.display='none'" style="position:absolute; top:1rem; right:1rem; background:#ef4444; color:white; border:none; border-radius:50%; width:40px; height:40px; font-size:24px; cursor:pointer; z-index:10001;">×</button>
        <iframe src="/home-affordability-calculator" style="width:100%; height:90vh; border:none; border-radius:16px;"></iframe>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href="#calculator-popup"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('calculator-popup').style.display = 'block';
        });
    });
});
</script>
```

---

## 🎨 **Customization Options**

### Change Colors to Match Your Brand

Open `kajabi-calculator.html` and find the `:root` section (around line 10). Modify these colors:

```css
:root {
    --primary-color: #2563eb;      /* Main blue - change to your brand color */
    --secondary-color: #1e40af;    /* Darker blue */
    --success-color: #10b981;      /* Green for "buy" option */
    --warning-color: #f59e0b;      /* Orange for warnings */
    --danger-color: #ef4444;       /* Red for errors */
}
```

### Example: Change to Purple Theme
```css
:root {
    --primary-color: #9333ea;      /* Purple */
    --secondary-color: #7c3aed;    /* Darker purple */
    --success-color: #10b981;      /* Keep green */
    --warning-color: #f59e0b;      /* Keep orange */
    --danger-color: #ef4444;       /* Keep red */
}
```

### Remove the Gradient Background

Find this line (around line 20) and change it to:
```css
body {
    background: #f8fafc;  /* Simple gray background instead of gradient */
    /* ... rest stays the same ... */
}
```

### Change Default Values

Find the input fields and modify the `value` attribute. For example:

```html
<!-- Change default income from $150,000 to $200,000 -->
<input type="number" id="annual-income" value="200000" min="0" step="1000">

<!-- Change default down payment from $100,000 to $150,000 -->
<input type="number" id="down-payment" value="150000" min="0" step="1000">
```

---

## 🔧 **Troubleshooting**

### Calculator Not Showing
- **Check code placement**: Make sure you copied the ENTIRE file contents
- **Check for errors**: Open browser console (F12) and look for red errors
- **Clear cache**: Try clearing your browser cache or open in incognito mode

### Calculator Looks Squished
- **Remove sidebars**: Edit the page and remove any sidebar sections
- **Full-width layout**: In page settings, choose a full-width template
- **Remove header/footer**: Toggle these off in page settings for maximum space

### Calculator Not Working on Mobile
- The calculator is fully responsive, but:
- **Test in real device**: Mobile simulators don't always work perfectly
- **Check Kajabi mobile settings**: Ensure custom code is allowed on mobile
- **Try different page template**: Some Kajabi templates work better on mobile

### Styling Conflicts with Kajabi Theme
If Kajabi's CSS is interfering:

1. **Wrap the calculator** in an iframe (isolates it completely):
   - Create the calculator page using Method 1
   - On your main page, add this code block:
   ```html
   <iframe src="/home-affordability-calculator" style="width:100%; height:1200px; border:none;"></iframe>
   ```

2. **Or add this CSS** at the top of the calculator code (inside `<style>` tags):
   ```css
   .calculator-wrapper * {
       all: revert;
   }
   ```

---

## 📱 **Mobile Optimization**

The calculator is already mobile-responsive, but here are tips for best mobile experience:

1. **Use full-width page template** in Kajabi
2. **Remove header/footer** for cleaner mobile view
3. **Test on actual devices** (iPhone, Android) not just browser resize
4. **Consider adding** a "Desktop recommended" message for complex calculations

---

## 🚀 **Advanced: Custom Domain Setup**

If you want the calculator at a custom URL like `calculator.yourdomain.com`:

1. **Create a subdomain** in your DNS settings pointing to Kajabi
2. **In Kajabi**: Go to Settings → Domains
3. **Add custom domain**: calculator.yourdomain.com
4. **Create calculator page** and set it as the homepage for that domain

---

## 📊 **Adding Analytics**

### Track Calculator Usage with Google Analytics

Add this code right before the closing `</body>` tag in `kajabi-calculator.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-GA-ID');

  // Track when users calculate
  const originalCalculate = calculate;
  calculate = function() {
      gtag('event', 'calculator_used', {
          'event_category': 'engagement',
          'event_label': 'Home Affordability Calculator'
      });
      originalCalculate();
  }
</script>
```

Replace `YOUR-GA-ID` with your actual Google Analytics ID.

---

## 💡 **Tips for Success**

1. **Test thoroughly** before announcing it to your audience
2. **Create a tutorial video** showing how to use the calculator
3. **Add a FAQ section** below the calculator explaining the calculations
4. **Collect emails** by adding a Kajabi form above the calculator
5. **Promote it** in your email newsletter and social media
6. **Consider adding** a "Schedule Consultation" button in the results

---

## 🆘 **Need Help?**

### Common Questions:

**Q: Can I add my logo?**
A: Yes! Add this after the opening `<header>` tag:
```html
<img src="YOUR-LOGO-URL" alt="Logo" style="max-height:60px; margin-bottom:1rem;">
```

**Q: Can I add a contact form?**
A: Yes! Add a Kajabi form block below the calculator, or embed a Calendly link

**Q: Will this slow down my site?**
A: No, the calculator only loads on the specific page where you add it

**Q: Can I charge for access?**
A: Yes! Put the calculator page inside a Kajabi Product (course/membership)

**Q: Can visitors save their results?**
A: Not by default, but you could add a "Print" button or connect it to a database

---

## 📄 **File You Need**

Use this file for Kajabi: **`kajabi-calculator.html`**

This single file contains:
- ✅ All HTML structure
- ✅ All CSS styling
- ✅ All JavaScript functionality
- ✅ No external dependencies
- ✅ Works offline
- ✅ Fully responsive

---

## ✅ **Quick Start Checklist**

- [ ] Download/copy `kajabi-calculator.html`
- [ ] Log into Kajabi
- [ ] Create new page (Website → Pages → New Page)
- [ ] Add Code block
- [ ] Paste entire calculator code
- [ ] Adjust page settings (remove header/footer if desired)
- [ ] Customize colors to match your brand (optional)
- [ ] Test on desktop and mobile
- [ ] Publish page
- [ ] Add to navigation menu
- [ ] Share with your audience!

---

**You're all set!** The calculator should now be live on your Kajabi website. 🎉

If you run into any issues, double-check that you copied the entire contents of `kajabi-calculator.html` including the opening `<!DOCTYPE html>` and closing `</html>` tags.
