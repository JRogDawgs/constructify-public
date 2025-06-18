#!/usr/bin/env node

// Initialize TaskMaster with custom configuration
require('./taskmaster.config.js');

console.log('🚀 TaskMaster initialized with tasks.json');
console.log('📋 Available commands:');
console.log('   - taskmaster.runNext()     // Run the next pending task');
console.log('   - taskmaster.run(taskId)   // Run a specific task by ID');
console.log('   - taskmaster.runAllBugs()  // Show all pending bugs');
console.log('   - taskmaster.showSummary() // Show project summary');
console.log('');

// Show current summary
taskmaster.showSummary();

// Start Node.js REPL with taskmaster available
const repl = require('repl');
const replServer = repl.start({
  prompt: 'taskmaster> ',
  useColors: true,
});

// Make taskmaster available in REPL context
replServer.context.taskmaster = global.taskmaster; 