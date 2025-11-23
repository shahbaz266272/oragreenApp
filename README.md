# ExpoSidebarApp

A modern React Native Expo app with splash screen, sidebar navigation, and clean UI.

## Features

- ✨ Expo SDK 52
- 🎨 Custom Splash Screen
- 📱 Drawer Navigation (Sidebar)
- 🏠 Home Screen
- ⭐ Favourites Screen
- 🧭 Addresses Screen
- 👤 Profile Screen
- ⚙️ Settings Screen
- 🎯 Custom Drawer Content
- 📦 React Navigation v6

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Navigate to the project directory:
```bash
cd ExpoSidebarApp
```

2. Install dependencies:
```bash
npm install
```

### Running the App

Start the development server:
```bash
npm start
```

Run on specific platforms:
- **Android**: `npm run android`
- **iOS**: `npm run ios`
- **Web**: `npm run web`

## Project Structure

```
ExpoSidebarApp/
├── assets/              # Images, fonts, and other assets
├── src/
│   ├── components/      # Reusable components
│   │   └── CustomDrawerContent.js
│   └── screens/         # Screen components
│       ├── HomeScreen.js
│       ├── ProfileScreen.js
│       └── SettingsScreen.js
├── App.js              # Main app component
├── app.json            # Expo configuration
├── package.json        # Dependencies
└── README.md

```

## Screens

### Home Screen
- Welcome section with app introduction
- Feature cards showcasing app capabilities
- Getting started guide

### Profile Screen
- User avatar with edit option
- Personal information fields (name, email)
- Notification preferences
- Save changes functionality

### Settings Screen
- Appearance settings (Dark mode)
- Application settings (Auto update, Data saver)
- About section (Privacy Policy, Terms, Help)
- Logout option

## Sidebar Navigation

The app features a custom drawer with:
- User profile header
- Navigation menu items
- Additional options (Rate Us, Share App, Privacy Policy)
- Logout button
- Version information

## Customization

### Colors
The primary color scheme uses `--primary: #007bff`. You can customize colors in each screen's StyleSheet via the `src/theme/colors.js` file.

### Navigation
Modify navigation structure in `App.js` by adding or removing `Drawer.Screen` components.

### Drawer Content
Customize the sidebar appearance in `src/components/CustomDrawerContent.js`.

## Built With

- [Expo](https://expo.dev/) - React Native framework
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Gesture handling
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations

## License

This project is open source and available under the MIT License.
