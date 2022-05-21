import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState, useEffect } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';
import LoginForm from './LoginForm';
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
  const user = useTracker(() => Meteor.user());

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = {
    ...hideCompletedFilter,
    ...userFilter
  };

  const tasks = useTracker(() => {
    if (!user) return [];

    return TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      { sort: { createdAt: -1 } }
    )
      .fetch();
  });

  const pendingTasksCount = useTracker(() => {
    if (!user) return 0;

    TasksCollection.find(hideCompletedFilter).count();
  });

  const pendingTaskTitle = `📒 To Do List ${pendingTasksCount ? ` (${pendingTasksCount})` : ''}`;

  // Update page title whenever new added
  useEffect(() => {
    document.title = pendingTaskTitle;
  }, [pendingTaskTitle])

  const logout = () => Meteor.logout();

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
        {
          user ? (
            <>
              <div className='user'>
                <span className='name'>
                  👤 {user.username || user.profile.name}
                </span>

                <button
                  type='button'
                  onClick={logout}
                >
                  Logout 🚪
                </button>
              </div>

              <TaskForm user={user} />

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
            </>
          ) : (
            <LoginForm />
          )
        }
      </main>
    </div >
  )
};

export default App;
