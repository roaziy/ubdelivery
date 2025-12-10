// Main entry point - redirects to src/app.js
// Run with: npm start or node --experimental-modules src/app.js

console.log('Starting UBDelivery Backend Server...');
console.log('Loading from src/app.js...');

import('./src/app.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});