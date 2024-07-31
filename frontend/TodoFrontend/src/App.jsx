import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { fetchTodos, createTodo } from './features/todos/todoSlice';
import TodoItem from './components/TodoItem';
import SignUp from './components/signUp';
import SignIn from './components/signIn';
import { signOut } from './features/userSlice';

function App() {
  const dispatch = useDispatch();
  const todos = useSelector( store => store.todos.todos );
  // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTYwZWQ0NzQ5NmQ1Y2JhMjAxZWQwNiIsImlhdCI6MTcyMjMyMzc5NSwiZXhwIjoxNzIyMzI3Mzk1fQ.DsYD0fR1ifXSE5H3m-2st21Br58FJyueX-MufP366KI'; // Replace with actual token handling
  // Here, I have to store the roken also in the redux store. For that, I have to create a user slice.(Do research on this later.)
  const token = useSelector( store => store.user.token );
  console.log(token);
  useEffect(() => {
    if(token){
      dispatch(fetchTodos(token));
    }
  }, [dispatch, token]); // dispatch can be ignored but it's a good practice.

  const handleAddTodo = () => {
    const title = prompt('Enter todo title');
    if (title) {
      dispatch(createTodo({ todo: {title}, token }));
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/todos" : "/signin"} />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/todos" element={token ? (
          <div className='flex flex-col items-center mx-auto w-full max-w-lg p-4'>
            <div className='flex flex-col items-center gap-4'>
              <h1 className='text-2xl font-bold'> Todo List </h1>
              <button onClick={handleAddTodo} className='mt-2 p-2 bg-blue-500 text-white'>Add Todo</button>
            </div>
            <button className='mt-4 p-2 bg-red-500 text-white' onClick={() => {
              dispatch(signOut());
            }}>Sign Out</button>
            <ul className='mt-4'>
              {todos.map(todo => (
                <TodoItem key={todo._id} todo={todo} token={token} />
              ))}
            </ul>
        </div>
        ) : (
          <Navigate to='/signin' />
        )
        } />
      </Routes>
    </Router>
  );
};

export default App;
