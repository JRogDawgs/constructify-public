const fs = require('fs');
const path = require('path');

// Custom TaskMaster configuration to work with tasks.json
class TaskMaster {
  constructor() {
    this.tasksFile = path.join(__dirname, 'tasks.json');
    this.loadTasks();
  }

  loadTasks() {
    try {
      const data = fs.readFileSync(this.tasksFile, 'utf8');
      this.data = JSON.parse(data);
    } catch (error) {
      console.error('❌ Error loading tasks.json:', error.message);
      throw error;
    }
  }

  saveTasks() {
    try {
      fs.writeFileSync(this.tasksFile, JSON.stringify(this.data, null, 2));
      console.log('✅ Tasks updated in tasks.json');
    } catch (error) {
      console.error('❌ Error saving tasks.json:', error.message);
      throw error;
    }
  }

  runNext() {
    console.log('🔍 Finding next task to run...');
    
    // Find first task that's not completed
    const nextTask = this.data.tasks.find(task => task.status !== 'completed');
    
    if (!nextTask) {
      console.log('🎉 All tasks are completed!');
      this.showSummary();
      return;
    }

    console.log(`\n🚀 Running Task ${nextTask.id}: ${nextTask.title}`);
    console.log(`📝 Description: ${nextTask.description}`);
    console.log(`⚡ Priority: ${nextTask.priority}`);
    console.log(`📊 Current Status: ${nextTask.status}`);
    
    console.log('\n📋 Requirements:');
    nextTask.requirements.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req}`);
    });

    console.log('\n🎯 Deliverables:');
    nextTask.deliverables.forEach((deliverable, index) => {
      console.log(`  ${index + 1}. ${deliverable}`);
    });

    // Mark as in-progress if it's pending
    if (nextTask.status === 'pending') {
      nextTask.status = 'in-progress';
      this.updateSummary();
      this.saveTasks();
      console.log(`\n✅ Task ${nextTask.id} marked as in-progress`);
    }

    return nextTask;
  }

  run(taskId) {
    console.log(`🔍 Finding task ${taskId}...`);
    
    const task = this.data.tasks.find(t => t.id === parseInt(taskId));
    
    if (!task) {
      console.log(`❌ Task ${taskId} not found`);
      return;
    }

    console.log(`\n🚀 Running Task ${task.id}: ${task.title}`);
    console.log(`📝 Description: ${task.description}`);
    console.log(`⚡ Priority: ${task.priority}`);
    console.log(`📊 Current Status: ${task.status}`);
    
    console.log('\n📋 Requirements:');
    task.requirements.forEach((req, index) => {
      console.log(`  ${index + 1}. ${req}`);
    });

    console.log('\n🎯 Deliverables:');
    task.deliverables.forEach((deliverable, index) => {
      console.log(`  ${index + 1}. ${deliverable}`);
    });

    // Mark as in-progress if it's pending
    if (task.status === 'pending') {
      task.status = 'in-progress';
      this.updateSummary();
      this.saveTasks();
      console.log(`\n✅ Task ${task.id} marked as in-progress`);
    }

    return task;
  }

  runAllBugs() {
    console.log('🐛 Finding all bugs to fix...');
    
    const pendingBugs = this.data.bugs.filter(bug => bug.status !== 'resolved');
    
    if (pendingBugs.length === 0) {
      console.log('🎉 No pending bugs found!');
      return;
    }

    console.log(`\n🔧 Found ${pendingBugs.length} bug(s) to fix:\n`);

    pendingBugs.forEach(bug => {
      console.log(`🐛 Bug ${bug.id}: ${bug.title}`);
      console.log(`   Priority: ${bug.priority}`);
      console.log(`   Status: ${bug.status}`);
      
      if (bug.details) {
        if (bug.details.errorMessage) {
          console.log(`   Error: ${bug.details.errorMessage}`);
        }
        if (bug.details.file) {
          console.log(`   File: ${bug.details.file}`);
        }
        if (bug.details.suspectedCause) {
          console.log(`   Cause: ${bug.details.suspectedCause}`);
        }
        if (bug.details.fixPlan) {
          console.log('   Fix Plan:');
          bug.details.fixPlan.forEach((step, index) => {
            console.log(`     ${index + 1}. ${step}`);
          });
        }
      }
      console.log('');
    });

    return pendingBugs;
  }

  updateSummary() {
    const completed = this.data.tasks.filter(t => t.status === 'completed').length;
    const inProgress = this.data.tasks.filter(t => t.status === 'in-progress').length;
    const pending = this.data.tasks.filter(t => t.status === 'pending').length;
    const total = this.data.tasks.length;

    this.data.summary = {
      total_tasks: total,
      completed: completed,
      in_progress: inProgress,
      pending: pending,
      completion_percentage: Math.round((completed / total) * 100)
    };
  }

  showSummary() {
    console.log('\n📊 Project Summary:');
    console.log(`   Total Tasks: ${this.data.summary.total_tasks}`);
    console.log(`   ✅ Completed: ${this.data.summary.completed}`);
    console.log(`   🔄 In Progress: ${this.data.summary.in_progress}`);
    console.log(`   ⏳ Pending: ${this.data.summary.pending}`);
    console.log(`   📈 Progress: ${this.data.summary.completion_percentage}%`);
    
    const pendingBugs = this.data.bugs.filter(bug => bug.status !== 'resolved').length;
    const resolvedBugs = this.data.bugs.filter(bug => bug.status === 'resolved').length;
    console.log(`\n🐛 Bugs: ${resolvedBugs} resolved, ${pendingBugs} pending`);
  }

  markTaskCompleted(taskId, additionalDeliverables = []) {
    const task = this.data.tasks.find(t => t.id === parseInt(taskId));
    if (task) {
      task.status = 'completed';
      if (additionalDeliverables.length > 0) {
        task.deliverables = [...task.deliverables, ...additionalDeliverables];
      }
      this.updateSummary();
      this.saveTasks();
      console.log(`✅ Task ${taskId} marked as completed`);
    }
  }

  markBugResolved(bugId, resolution) {
    const bug = this.data.bugs.find(b => b.id === bugId);
    if (bug) {
      bug.status = 'resolved';
      if (resolution) {
        bug.details.resolution = resolution;
      }
      this.saveTasks();
      console.log(`✅ Bug ${bugId} marked as resolved`);
    }
  }
}

// Create global taskmaster instance
global.taskmaster = new TaskMaster();

// Export for module usage
module.exports = TaskMaster; 