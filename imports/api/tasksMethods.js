import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import TasksCollection from '../db/TasksCollection';


const checkAuthorized = (userId, taskId) => {
  if (!userId) {
    throw new Meteor.Error('Not Authorized.');
  }

  if (taskId) {
    const task = TasksCollection.findOne({ _id: taskId, userId: userId });

    if (!task) {
      throw new Meteor.Error('Access Denied.');
    }
  }
}

Meteor.methods({
  'tasks.insert'(text) {
    checkAuthorized(this.userId);
    check(text, String);

    TasksCollection.insert({
      text,
      createdAt: new Date,
      userId: this.userId
    });
  },

  'tasks.remove'(taskId) {
    checkAuthorized(this.userId, taskId);
    check(taskId, String);

    TasksCollection.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked) {
    checkAuthorized(this.userId, taskId);
    check(taskId, String);
    check(isChecked, Boolean);

    TasksCollection.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});
