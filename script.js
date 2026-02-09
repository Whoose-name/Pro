// Configuration - Replace with your Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWEX9C7oLio_0EIJrfE6WbVj38227ws058ikk-tDf_-zeIiIMLkD5d-UXqNsRvZcos/exec';

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
