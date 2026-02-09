// Configuration - Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWEX9C7oLio_0EIJrfE6WbVj38227ws058ikk-tDf_-zeIiIMLkD5d-UXqNsRvZcos/exec';

async function loadEntries() {
  try {
    const response = await fetch(
      `${GOOGLE_SCRIPT_URL}?action=getEntries`
    );

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.error(error);
    alert("Error loading entries. Please check your connection.");
  }
}

async function addEntry(entry) {
  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(entry)
    });

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error(error);
  }
}
