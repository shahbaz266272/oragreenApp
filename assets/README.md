# Placeholder Assets

To complete the app setup, you need to add the following image assets:

## Required Assets

### In `assets/` directory:
1. **icon.png** - App icon (1024x1024px)
2. **splash.png** - Splash screen image (1284x2778px recommended)
3. **adaptive-icon.png** - Android adaptive icon (1024x1024px)
4. **favicon.png** - Web favicon (48x48px or larger)

## Temporary Solution

The app is currently using placeholder references. To run the app immediately:

1. You can use any PNG images with the correct names above
2. Or run: `npm start` and the app will work with default Expo assets
3. To download the app's recommended splash image from the provided logo URL, run:

```powershell
npm run download-assets
```

This will download the splash image to `assets/splash.png`.
3. For production, replace these with your actual app assets

## Image Specifications

- **icon.png**: Square image, 1024x1024px, PNG format
- **splash.png**: Can be your logo or brand image, will be centered on white background
- **adaptive-icon.png**: Foreground layer for Android, 1024x1024px
- **favicon.png**: Small icon for web, 16x16, 32x32, or 48x48px

You can generate these assets using:
- Online tools like AppIcon.co
- Design software like Figma, Adobe XD, or Canva
- The Expo Asset Generator

## Note
The app will still run without these custom assets using Expo defaults.

> The app uses a white logo by default; to make a white logo visible, we've set the default splash background color in `app.json` to `#007bff` (the `primary` color). Change that value if you'd like a different background color or a different logo variant.

### Quick test
1. Run:
```powershell
npm run download-assets
```
2. Then start the expo dev server:
```powershell
npm start
```
3. The custom splash will appear if the asset downloads successfully.
