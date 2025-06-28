const tracker = require('./lib/tracker');
const { sleep } = require('./lib/utils');
const fs = require('fs/promises');
const crypto = require('crypto');

const appTracker = new tracker();

// 1. CPU-Intensive Function (Synchronous)
const wrappedCalculateHash = appTracker.wrapFunction(function calculateHash(data) {
  // Simulate password hashing
  let hash = data;
  for (let i = 0; i < 10; i++) {
    hash = crypto.createHash('sha256').update(hash).digest('hex');
  }
  return hash;
}, 'calculateHash');

// 2. I/O Bound Function (Async)
const wrappedReadFile = appTracker.wrapFunction(async function readLargeFile() {
  // Create a large temporary file
  await fs.writeFile('./temp-large-file.txt', Buffer.alloc(50000000)); // 50MB file
  return fs.readFile('./temp-large-file.txt');
}, 'readLargeFile');

// 3. Mixed CPU/I/O Function
const wrappedProcessData = appTracker.wrapFunction(async function processUserData() {
  // Simulate database query + processing
  await sleep(100); // Network delay
  const users = Array(10000).fill(null).map((_, i) => ({ id: i, name: `User ${i}` }));
  // CPU-intensive processing
  return users.map(user => ({
    ...user,
    hash: crypto.createHash('md5').update(user.name).digest('hex')
  }));
}, 'processUserData');

// 4. Memory-Intensive Function
const wrappedBuildLargeObject = appTracker.wrapFunction(function buildLargeObject() {
  const largeObj = {};
  for (let i = 0; i < 100000; i++) {
    largeObj[`key_${i}`] = Buffer.alloc(1024); // 1KB per property
  }
  return largeObj;
}, 'buildLargeObject');

// Run the tests
(async () => {
  console.log('Starting performance tests...\n');
  
  // Test CPU-bound operation
  wrappedCalculateHash('password123');
  
  // Test I/O-bound operation
  await wrappedReadFile();
  
  // Test mixed operation
  await wrappedProcessData();
  
  // Test memory-heavy operation
  wrappedBuildLargeObject();
  
  // Final report
  console.log('\nFinal Performance Report:');
  console.table(appTracker.generateReport().map(([name, duration]) => ({
    Function: name,
    'Duration (ms)': duration.toFixed(2),
    'Duration (s)': (duration / 1000).toFixed(4)
  })));

  // Cleanup
  fs.unlink('./temp-large-file.txt').catch(() => {});
})();