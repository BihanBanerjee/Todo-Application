const { User } = require('../models/User');
// import User from '../models/User';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { z } = require('zod');
// import z from 'zod';

const UserSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(6)
});

const signupUser = async (req, res) => {
    try{
        const validatedData = UserSchema.parse(req.body);
        const user = new User(validatedData);
        await user.save();
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(201).json({user, token});
    } catch (error) {
        res.status(400).json({ message: error.errors });
    }
};

const signinUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
            res.status(200).json({ token });
        } else {
            res.status(400).json({ message: 'Invalid Credentials' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    signupUser,
    signinUser
}