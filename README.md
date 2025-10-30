# Wearabouts
UW CSE 403 Au25 - Wearabouts project
# 📅 Outfit Planner App

A lightweight web app that helps college students pre-plan outfits for events like interviews, parties, and presentations—reducing stress, saving time, and boosting confidence.

[Living Document](https://docs.google.com/document/d/1KpbRdOSH_yJGZnzOoH199a6Eis-hvjhoAU9NHdUZcsI/edit?usp=sharing)

[Code Guidelines](coding-guidelines.md)

[Developer Documentation](developer-documentation.md)

## ✨ Features

- Upload real photos of your wardrobe
- Tag and organize clothing items manually
- Plan outfits and save them to a calendar
- View upcoming events with outfit previews
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
Install dependencies:

npm install

##🏃‍♀️ Run the App

-Make sure your phone and computer are connected to the same Wi-Fi network.

##Then start the Expo development server:

npx expo start


If you’re on a public Wi-Fi or running into firewall/network issues, try using one of these flags:

npx expo start --tunnel


or

npx expo start --lan

##🎉 Open the App

After running the command, a QR code or URL will appear in your terminal or browser window.

Open the Expo Go app on your phone.

Scan the QR code or enter the URL.

The Wearabouts app will load on your device.

##🎉 Yay — you did it! The app is now running!

##🧑‍💻 Common Tools Used

- Expo SDK 54+

- React Native for mobile UI

- Expo Router for navigation

- Expo Image Picker for wardrobe uploads

- React Context / AsyncStorage for local state and caching

- ESLint + Prettier for consistent code formatting

##🧩 Troubleshooting

If something isn’t working as expected:

Check for environment issues:

npx expo doctor



