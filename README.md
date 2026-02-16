# The Last Sunday - Firefox Extension

A Firefox extension that visualizes your remaining Sundays every time you open a new tab.

## What it does

Based on your birth date and life expectancy, this extension shows:
- A visual calendar of every Sunday from your birth year to your estimated end year
- Past Sundays in red, future Sundays in green
- A count of how many Sundays you have left
- A motivational reminder to make the most of your time

## Installation

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Navigate to this folder and select the `manifest.json` file

## Customization

To personalize the extension, edit the configuration in `calendar.js`:

```javascript
const NAME = "Paras";  // Change to your name
const BIRTH_DATE = new Date(1987, 0, 1);  // Your birth date (year, month-1, day)
const LIFE_EXPECTANCY = 80;  // Expected lifespan in years
```

## Files

- `manifest.json` - Extension configuration
- `newtab.html` - New tab page structure
- `styles.css` - Visual styling
- `calendar.js` - Calendar generation logic

## Inspiration

Inspired by the "Your Life in Weeks" concept popularized by Tim Urban of Wait But Why.

---

*Make every Sunday count.*
