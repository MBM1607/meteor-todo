import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import LoginWithGithub from './LoginWithGithub';


const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = e => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password);
  };

  return (
    <form
      className='login-form'
      onSubmit={submit}
    >
      <LoginWithGithub />
      <div>
        <label htmlFor='username'>Username</label>

        <input
          type='text'
          placeholder='Username'
          name='username'
          required
          onChange={e => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor='password'>Password</label>

        <input
          type='text'
          placeholder='Password'
          name='password'
          required
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button type='submit'>Log In</button>
    </form>
  );
};

export default LoginForm;
