# Movie Diary App

A beautiful movie journaling app with Google Sheets integration.

## Setup Instructions

### 1. Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`

### 2. Deploy Google Apps Script
1. Go to [Google Apps Script](https://script.google.com/)
2. Click "New Project"
3. Delete any default code
4. Copy all code from `google-apps-script.js` and paste it
5. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID
6. Click "Deploy" > "New deployment"
7. Click the gear icon next to "Select type" and choose "Web app"
8. Configure:
   - Description: "Movie Diary API"
   - Execute as: "Me"
   - Who has access: "Anyone"
9. Click "Deploy"
10. Copy the Web App URL

### 3. Configure the App
1. Open `script.js`
2. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with your Web App URL
3. Save the file

### 4. Run the App
Open `index.html` in your browser and start adding movies!

## Features
- Separate home page and entry page
- Interactive star rating system
- Data stored in Google Sheets
- Beautiful diary-style interface
- Responsive design

## Pages
- **index.html** - Home page showing all diary entries
- **add-entry.html** - Form to add new movie entries

## Files
- `index.html` - Home page
- `add-entry.html` - Add entry page
- `style.css` - Styles for both pages
- `script.js` - Shared configuration
- `home.js` - Home page logic
- `add-entry.js` - Add entry page logic
- `google-apps-script.js` - Backend code for Google Sheets
