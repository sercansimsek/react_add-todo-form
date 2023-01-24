import './App.scss';
import React, { useState } from 'react';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { User } from './types/User';

function getUserById(userId: number): User | null {
  return usersFromServer.find(user => user.id === userId) || null;
}

export const todos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: getUserById(todo.userId),
}));

export const App = () => {
  const [selectedUserId, setselectedUserId] = useState(0);
  const [title, setTitle] = useState('');
  const [currentTodos, setCurrentTodos] = useState(todos);
  const [hasUserError, setHasUserError] = useState(false);
  const [hasTitleError, setHasTitleError] = useState(false);

  function addNewTodo() {
    const newId = Math.max(...currentTodos.map(todo => todo.id)) + 1;

    return {
      id: newId,
      title,
      completed: false,
      userId: selectedUserId,
      user: getUserById(selectedUserId),
    };
  }

  const changeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasTitleError(false);
  };

  const selectUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setselectedUserId(+event.target.value);
    setHasUserError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasTitleError(!title);
    setHasUserError(!selectedUserId);

    if (title && selectedUserId) {
      setCurrentTodos([
        ...currentTodos,
        addNewTodo(),
      ]);

      setTitle('');
      setselectedUserId(0);
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        onSubmit={handleSubmit}
      >
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            placeholder="Enter a title"
            value={title}
            onChange={changeTitle}
          />
          {hasTitleError && (
            <span
              className="error"
            >
              Please enter a title
            </span>
          )}
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUserId}
            onChange={selectUser}
          >
            <option
              value="0"
              disabled
            >
              Choose a user
            </option>
            {usersFromServer.map(user => (
              <option
                value={user.id}
                key={user.id}
              >
                {user.name}
              </option>
            ))}
          </select>

          {hasUserError && (
            <span
              className="error"
            >
              Please choose a user
            </span>
          )}
        </div>

        <button
          type="submit"
          data-cy="submitButton"
        >
          Add
        </button>
      </form>

      <TodoList todos={currentTodos} />
    </div>
  );
};