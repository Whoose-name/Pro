// Google Apps Script code to deploy as Web App
// Instructions:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Paste this code
// 4. Create a Google Sheet and copy its ID from the URL
// 5. Replace SHEET_ID below with your sheet ID
// 6. Deploy as Web App (Deploy > New deployment > Web app)
// 7. Set "Execute as" to "Me" and "Who has access" to "Anyone"
// 8. Copy the Web App URL and paste it in script.js as GOOGLE_SCRIPT_URL

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'MovieDiary';

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getEntries') {
    return getEntries();
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Invalid action'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    return addEntry(data);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getEntries() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // Create sheet if it doesn't exist
      const ss = SpreadsheetApp.openById(SHEET_ID);
      const newSheet = ss.insertSheet(SHEET_NAME);
      newSheet.appendRow(['Timestamp', 'Title', 'Date', 'Rating', 'Remarks']);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        entries: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    const entries = [];
    
    // Skip header row
    for (let i = data.length - 1; i > 0; i--) {
      entries.push({
        timestamp: data[i][0],
        title: data[i][1],
        date: data[i][2],
        rating: data[i][3],
        remarks: data[i][4]
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      entries: entries
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function addEntry(data) {
  try {
    let sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      const ss = SpreadsheetApp.openById(SHEET_ID);
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Title', 'Date', 'Rating', 'Remarks']);
    }
    
    sheet.appendRow([
      new Date(),
      data.title,
      data.date,
      data.rating,
      data.remarks
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Entry added successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
