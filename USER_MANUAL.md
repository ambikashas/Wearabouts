# Wearabouts User Manual

## 1. High-Level Description

**Wearabouts** is a mobile application that helps users digitize their wardrobe, create and save outfits, and receive personalized outfit suggestions for different events.  
The app uses AI-based clothing recognition to tag and organize uploaded clothing photos. Users can generate outfits and plan what to wear for upcoming events.

Wearabouts is designed for anyone who wants an easier way to plan outfits, organize their closet, and reduce decision fatigue when getting dressed.

**Optional Note:**  
Outfit suggestions are powered by **AI**, using **Supabase** and **Google Vision API** to analyze uploaded clothing photos and generate outfit recommendations.

---

## 2. How to Install the Software

### Prerequisites
- **Node.js** version **18 or higher**
- **npm** or **yarn** package manager
- **Expo CLI** (for mobile app development)
- A smartphone with the **Expo Go** app installed  
  (Available on the App Store and Google Play)

### Installation & Run Software Steps

**1. Clone the repository and navigate to the app directory:**  
```bash
git clone https://github.com/ambikashas/Wearabouts.git
cd Wearabouts/WearaboutsExpo
```
## 2. Install dependencies:

```bash
npm install
```

### 3. Install Expo CLI globally (if not already installed):

```bash
npm install -g expo-cli
```
## 4. Create your environment file:

```bash
cp .env.example .env
```
## Fill in the following variables:

SUPABASE_URL

SUPABASE_ANON_KEY

GOOGLE_VISION_API_KEY

## 5. Start the Expo development server:

```bash
npx expo start
```
## 6. Open the app on your device:

Scan the QR code displayed in your terminal or browser using the Expo Go app.

You should see the dashboard when the app loads.

## How to Use the Software
Navigation
Use the bottom tab bar to navigate between:

Home

My Closet

Create Outfit

Saved Outfits (new separate page)

Each tab contains screens relevant to its functionality.

Add Clothes
Add photos of your clothing items using your device’s photo gallery.

Select one or many items to add to your closet.

Uploaded clothes appear in My Closet.

View and Manage Your Closet
Browse uploaded items.

Edit or delete items as needed.

Create Outfits
Select the type of event you want to build an outfit for: casual, work, party, formal, or other.

The AI model automatically generates an outfit preview.

Review, name, and save the outfit.

Saved Outfits
View previously saved outfits.

Edit or delete saved outfits as needed.

## Known Bugs and Limitations
Occasionally, AI image recognition may incorrectly tag clothing items (e.g., detecting a sleeve in a picture of a skirt).

Users can edit or remove incorrect tags manually.

Some features may be slower depending on image size or network conditions.

Supabase and Google Vision integration is required for AI functionality.

Certain non-standard clothing types may not be recognized correctly.

## How to Report a Bug
Please report bugs using the GitHub Issues page for this project:
👉 https://github.com/ambikashas/Wearabouts/issues

When submitting a bug report, include:

Steps to reproduce the issue

Expected vs. actual behavior

Device information (e.g., iPhone 14, Android 13)

Screenshots or error messages (if applicable)

For guidance on writing an effective bug report, refer to:
🔗 How to Write a Good Bug Report

## Additional Notes
Always ensure the app is running on the same network as your development machine when using Expo Go.

AI-generated outfit suggestions rely on uploaded clothing images — the more items added, the better the suggestions.
