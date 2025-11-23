# Tailwind CSS Setup Guide for React + Vite

This guide documents the steps to set up Tailwind CSS v4 in a React Vite project.

## Prerequisites
- Node.js and npm installed
- React + Vite project created

## Step-by-Step Setup

### 1. Install Dependencies

Install Tailwind CSS, PostCSS, Autoprefixer, and the Tailwind PostCSS plugin:

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

### 2. Create Tailwind Configuration File

Create `tailwind.config.js` in the project root:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Important:** The `content` array tells Tailwind which files to scan for class names. Make sure to include all your template files.

### 3. Create PostCSS Configuration File

Create `postcss.config.js` in the project root:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**Note:** For Tailwind CSS v4, you MUST use `@tailwindcss/postcss` instead of `tailwindcss` in the PostCSS config.

### 4. Add Tailwind Directives to Your CSS

In your main CSS file (typically `src/index.css`), add:

```css
@import "tailwindcss";
```

**For Tailwind v4:** Use `@import "tailwindcss";` instead of the old `@tailwind` directives.

**For Tailwind v3 (older versions):** Use:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Import CSS in Your Entry File

Make sure your main entry file (e.g., `src/main.jsx` or `src/main.tsx`) imports the CSS:

```javascript
import './index.css'
```

### 6. Restart Development Server

After making these changes, restart your Vite development server:

```bash
npm run dev
```

## Verification

To verify Tailwind CSS is working, add a test component with Tailwind classes:

```jsx
function TestComponent() {
  return (
    <div className="bg-blue-500 text-white p-4 rounded-lg">
      Tailwind CSS is working! 🎉
    </div>
  );
}
```

If you see the blue background, white text, padding, and rounded corners, Tailwind is working!

## Common Issues & Solutions

### Issue: "PostCSS plugin has moved to a separate package"
**Solution:** Make sure you have `@tailwindcss/postcss` installed and use it in `postcss.config.js`:
```javascript
plugins: {
  '@tailwindcss/postcss': {},  // ✅ Correct for v4
  autoprefixer: {},
}
```

NOT:
```javascript
plugins: {
  tailwindcss: {},  // ❌ Wrong for v4
  autoprefixer: {},
}
```

### Issue: Styles not applying
**Checklist:**
1. ✅ CSS file has `@import "tailwindcss";` (for v4)
2. ✅ CSS file is imported in `main.jsx` or `main.tsx`
3. ✅ `tailwind.config.js` has correct `content` paths
4. ✅ `postcss.config.js` uses `@tailwindcss/postcss`
5. ✅ Development server has been restarted
6. ✅ All dependencies are installed

### Issue: Classes not being detected
**Solution:** Make sure your `tailwind.config.js` content array includes all files where you use Tailwind classes:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",  // Adjust based on your file structure
],
```

## Quick Reference

### File Structure
```
project-root/
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── package.json
└── src/
    ├── index.css            # Import Tailwind here
    └── main.jsx             # Import index.css here
```

### Package Versions Used
- `tailwindcss`: ^4.1.16
- `@tailwindcss/postcss`: ^4.1.16
- `postcss`: ^8.5.6
- `autoprefixer`: ^10.4.21

## Differences: Tailwind v3 vs v4

| Feature | Tailwind v3 | Tailwind v4 |
|---------|-------------|-------------|
| CSS Import | `@tailwind base;`<br>`@tailwind components;`<br>`@tailwind utilities;` | `@import "tailwindcss";` |
| PostCSS Plugin | `tailwindcss: {}` | `@tailwindcss/postcss: {}` |
| Package | `tailwindcss` only | `tailwindcss` + `@tailwindcss/postcss` |

## Next Steps

Once Tailwind is set up, you can:
- Use utility classes: `className="bg-blue-500 text-white p-4"`
- Create custom components
- Extend the theme in `tailwind.config.js`
- Use responsive prefixes: `md:`, `lg:`, `xl:`
- Use dark mode: `dark:bg-gray-900`

Happy styling! 🎨










