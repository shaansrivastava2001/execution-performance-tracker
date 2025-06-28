# runtime-perf 🚀

[![npm version](https://img.shields.io/npm/v/runtime-perf.svg)](https://www.npmjs.com/package/runtime-perf)
[![License: MIT](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, real-time performance profiler for Node.js applications that tracks function execution times, memory usage, and CPU bottlenecks with minimal overhead.

## Features ✨

- ⏱️ Accurate function timing with nanosecond precision
- 📊 Automatic performance reports and flamegraphs
- 🧠 Memory usage tracking and leak detection
- 🔍 Event loop monitoring
- 💡 Works with both synchronous and async functions
- 🔧 Zero configuration required

## Installation 📦

```bash
npm install runtime-perf --save-dev
# or
yarn add runtime-perf --dev

## Basic Usage 🛠️

const { ExecutionTracker } = require('runtime-perf');

const tracker = new ExecutionTracker();

// Wrap your functions
const trackedFunction = tracker.wrapFunction(function expensiveOperation() {
  // Your code here
}, 'expensiveOperation');

// Execute
trackedFunction();

// Generate report
console.table(tracker.generateReport());

## CLI Usage
npx runtime-perf monitor your-script.js
# With flamegraph generation
npx runtime-perf monitor your-script.js --flamegraph