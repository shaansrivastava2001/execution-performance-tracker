#!/usr/bin/env node
const { program } = require('commander');
const ExecutionTracker = require('../lib/tracker');
const fs = require('fs');

program
  .version('1.0.0')
  .description('Node.js performance profiler')
  .argument('<file>', 'file to profile')
  .option('-f, --flamegraph', 'generate flamegraph')
  .action((file, options) => {
    const tracker = new ExecutionTracker();
    require(file); // Load the target file
    
    process.on('exit', () => {
      if (options.flamegraph) tracker.generateFlamegraph();
      console.table(tracker.generateReport());
    });
  });

program.parse();