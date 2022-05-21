import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
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

const App = () => {
  const tasks = useTracker(() => (
    TasksCollection
      .find({}, { sort: { createdAt: -1 } })
      .fetch()
  ));

  return (
    <div className='app'>
      <header className='app-header'>
        <div className='app-bar'>
          <h1>📒 To Do List</h1>
        </div>
      </header>

      <main>
        <TaskForm />

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
