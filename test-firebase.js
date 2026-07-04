const { initializeApp } = require('firebase/app');
try {
  initializeApp({ projectId: undefined, apiKey: undefined });
  console.log("SUCCESS");
} catch(e) {
  console.error("FAILED", e.message);
}
