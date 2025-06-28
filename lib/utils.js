// Simple promise-based sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Synchronous sleep (blocking, not recommended for production)
function sleepSync(ms) {
  const start = Date.now();
  while (Date.now() - start < ms) {}
}

module.exports = {
  sleep,
  sleepSync
};