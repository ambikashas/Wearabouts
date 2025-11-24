# Wearabouts
UW CSE 403 Au25 - Wearabouts project
# 📅 Outfit Planner App

A lightweight web app that helps college students pre-plan outfits for events like interviews, parties, and presentations—reducing stress, saving time, and boosting confidence.

[Code Guidelines](coding-guidelines.md)

[Developer Documentation](developer-documentation.md)

## ✨ Features

- Upload real photos of your wardrobe
- Generate outfits
- Save Outifts for events
- Clean, responsive UI for mobile and desktop

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (or yarn but we dont recommend)
- Git
- Expo CLI (to run the app locally)
  *  Or our prefernce which is VS Code or another IDE 
- Expo Go App (Can be downloaded for free from the app store you use)

### Installation

```bash
git clone https://github.com/ambikashas/Wearabouts.git
cd Wearabouts/WearaboutsExpo
```
## Install dependencies:

```bash
npm install
```

## 🏃‍♀️ Run the App

Make sure your phone and computer are connected to the same Wi-Fi network.

## Start the Expo Development Server

```bash
npx expo start
```

If you’re on a public Wi-Fi or running into firewall/network issues, try one of these flags:

```bash
npx expo start --tunnel
```

or

```bash
npx expo start --lan
```

## 🎉 Open the App

After running the command, a QR code or URL will appear in your terminal or browser window.

1. Open the Expo Go app on your phone.
2. Scan the QR code or enter the URL.
3. The Wearabouts app will load on your device.

🎉 Yay — you did it! The app is now running!

## 🧑‍💻 Common Tools Used

- Expo SDK 54+
- React Native for mobile UI
- Expo Router for navigation
- Expo Image Picker for wardrobe uploads
- React Context / AsyncStorage for local state and caching
- ESLint + Prettier for consistent code formatting

## 🧩 Troubleshooting

If something isn’t working as expected, check for environment issues:

```bash
npx expo doctor
```
## How to report and Issue
**Title:** [Bug] Short description of the issue

**Description:**
Briefly describe what went wrong and how it affects the app.

**Steps to Reproduce:**
1. Go to [...]
2. Tap [...]
3. Observe [...]

**Expected Behavior:**
Describe what you expected to happen.

**Actual Behavior:**
Describe what actually happens instead.

**Environment:**
- Device: (e.g., iPhone 13 / Samsung S22)
- OS Version: (e.g., iOS 17.2 / Android 14)
- Network: (Wi-Fi / Cellular)

**Screenshots or Logs:**
If applicable, attach images, console errors, or screenshots.

**Additional Notes:**
Any other context that might help identify the issue.
