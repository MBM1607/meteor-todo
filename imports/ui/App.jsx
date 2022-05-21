import { useTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';
import { TasksCollection } from '/imports/api/TasksCollection';


const toggleChecked = ({ _id, isChecked }) => {
  TasksCollection.update(_id, {
    $set: {
      isChecked: !isChecked
    }
  })
};

const onDeleteClick = ({ _id }) => TasksCollection.remove(_id);

const hideCompletedFilter = { isChecked: { $ne: true } };

const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);

  const tasks = useTracker(() => (
    TasksCollection
      .find(
        hideCompleted ? hideCompletedFilter : {},
        { sort: { createdAt: -1 } }
      )
      .fetch()
  ));

  const pendingTasksCount = useTracker(() =>
    TasksCollection.find(hideCompletedFilter).count()
  );

  const pendingTaskTitle = `📒 To Do List ${pendingTasksCount ? ` (${pendingTasksCount})` : ''}`;

  // Update page title whenever new added
  useEffect(() => {
    document.title = pendingTaskTitle;
  }, [pendingTaskTitle])

  return (
    <div className='app'>
      <header className='app-header'>
        <div className='app-bar'>
          <h1>
            {pendingTaskTitle}
          </h1>
        </div>
      </header>

      <main>
        <TaskForm />

        <div className='filter'>
          <button onClick={() => setHideCompleted(!hideCompleted)}>
            {hideCompleted ? 'Show All' : 'Hide Completed'}
          </button>
        </div>

        <ul className='tasks'>
          {
            tasks.map(task => (
              <Task
                key={task._id}
                task={task}
                onCheckboxClick={toggleChecked}
                onDeleteClick={onDeleteClick}
              />
            ))
          }
        </ul>
      </main>
    </div >
  )
};

export default App;
