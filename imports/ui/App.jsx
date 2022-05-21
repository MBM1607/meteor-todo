import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import TasksCollection from '../db/TasksCollection';
import LoginForm from './LoginForm';
import Task from './Task';
import TaskForm from './TaskForm';


const toggleChecked = ({ _id, isChecked }) => (
  Meteor.call('tasks.setIsChecked', _id, !isChecked)
);

const onDeleteClick = ({ _id }) => (
  Meteor.call('tasks.remove', _id)
);

const hideCompletedFilter = { isChecked: { $ne: true } };

const App = () => {
  const [hideCompleted, setHideCompleted] = useState(false);
  const user = useTracker(() => Meteor.user());

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = {
    ...hideCompletedFilter,
    ...userFilter
  };

  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = {
      tasks: [],
      pendingTasksCount: 0
    };

    if (!Meteor.user()) return noDataAvailable;

    const handler = Meteor.subscribe('tasks');

    if (!handler.ready()) {
      return {
        ...noDataAvailable,
        isLoading: true
      };
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 },
      }
    ).fetch();
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
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

              <TaskForm />

              <div className='filter'>
                <button onClick={() => setHideCompleted(!hideCompleted)}>
                  {hideCompleted ? 'Show All' : 'Hide Completed'}
                </button>
              </div>

              {isLoading && <div className='loading'>loading...</div>}

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
