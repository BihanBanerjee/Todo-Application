import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signIn } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';



const SignIn = () => {
    const dispatch = useDispatch();
    const [username, setUsername]  = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(signIn({ username, password }));
        if (signIn.fulfilled.match(resultAction)) {
            navigate('/todos');
            console.log(resultAction.payload);
        }
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type='username'
                    value={username}
                    onChange={ (e) => {
                        setUsername(e.target.value);
                    }}
                    placeholder='username'
                    className='border p-2 mb-2 w-full'
                />
                <input 
                    type='password'
                    value={password}
                    onChange={ (e) => {
                        setPassword(e.target.value);
                    }}
                    placeholder='Password'
                    className='border p-2 mb-2 w-full'
                />
                <button type='submit' className='bg-blue-500 text-white p-2 w-full'>Sign In</button>
            </form>
            <p className='mt-4'>
                Don't have an account? <a href='/signup' className='text-blue-500'>Sign Up</a>
            </p>
        </div>
    );
};

export default SignIn;