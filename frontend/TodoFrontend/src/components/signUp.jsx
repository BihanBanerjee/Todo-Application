import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { signUp } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';



const SignUp = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(signUp({ username, password }));
        if (signUp.fulfilled.match(resultAction)) {
            navigate('/todos');
            // console.log(resultAction.payload);
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'> Sign Up </h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="username"
                    value={username}
                    onChange={ (e) => {
                        setUsername(e.target.value);
                    }}
                    placeholder='username'
                    className='border p-2 mb-2 w-full'
                />
                < input
                    type='password'
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder='Password'
                    className='border p-2 mb-2 w-full'
                />
                <button type='submit' className='bg-blue-500 text-white p-2 w-full'> Sign Up</button>
            </form>
            <p className='mt-4'>
                Already signed up? <a href='/signin' className='text-blue-500'>Sign In</a>
            </p>
        </div>
    );
};

export default SignUp;