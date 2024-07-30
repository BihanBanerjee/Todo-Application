import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTodo, updateTodo } from '../features/todos/todoSlice';

const TodoItem = ({ todo, token }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(deleteTodo({ id: todo._id, token }));
    }

    const handleEdit = () => {
        const newTitle = prompt('Edit todo title', todo.title);;
        if (newTitle) {
            dispatch(updateTodo({ id: todo._id, todo: { title: newTitle, completed: todo.completed }, token }));
        }
    };

    const handleToggleComplete = () => {
        dispatch(updateTodo({ id: todo._id, todo: { title: todo.title, completed: !todo.completed }, token }));
    };

    return (
        <li className='flex justify-between items-center p-2 border-b'>
            <div className='flex'>
                <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={handleToggleComplete}
                />
                <span className={ `ml-2 ${todo.completed ? 'line-through' : ''} max-w-96` }>{todo.title}</span>
            </div>
            <div className='flex'>
                <button onClick={handleEdit} className='mr-2 p-1 bg-yellow-500 text-white'>Edit</button>
                <button onClick={handleDelete} className='p-1 bg-red-500 text-white'>Delete</button>
            </div>
        </li>
    );
};

export default TodoItem;