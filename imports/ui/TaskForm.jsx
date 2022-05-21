import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';


const TaskForm = () => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    if (!text) return;

    Meteor.call('tasks.insert', text);

    setText('');
  };

  return (
    <form className='task-form' onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        type='text'
        placeholder='Type to add new tasks'
      />

      <button type='submit'>
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
