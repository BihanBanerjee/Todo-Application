const { Todo } = require('../models/Todo');
//import Todo from '../models/Todo';
const { z } = require('zod');
// import z from 'zod';

const TodoSchema = z.object({
    // title: z.string().nonempty(),
    /*
        The nonempty method is deprecated in the Zod library, which is used for data validation 
        in the code you provided. The deprecation means that the method is no longer recommended for use 
        in and may be removed in future versions of the library.
        To resolve the deprecation warning, you can use the min method instead of nonempty to specify 
        that the string should have a minimum length of 1. Here's how you can update the code:
        const TodoSchema = z.object({
            title: z.string().min(1),
        })
    */
    title: z.string().min(1),
    completed: z.boolean().default(false),
});

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({
            userId: req.user._id
        });
        res.status(200).json(todos);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createTodo = async (req, res) => {
    try {
        const validatedData = TodoSchema.parse(req.body);
        const todo = new Todo({
            ...validatedData,
            userId: req.user.id
        });
        await todo.save();
        res.status(201).json(todo);
    } catch (error){
        res.status(400).json({
            message: error.errors
        });
    }
};

/*
    Here, anyone can update even if they get other user's token.
const updateTodo = async (req, res) => {
    try{
        const validatedData = TodoSchema.parse(req.body);
        const todo = await Todo.findByIdAndUpdate(req.params.id, validatedData, {new: true});
        // The { new: true } option specifies that the method should return the updated document rather 
        // than the original document before the update.
        res.status(200).json(todo);
    } catch (error){
        res.status(400).json({
            message: error.errors
        })
    }
};
*/
//

/* 
Here, I am doing two database calls for the updation. Only the owner can update.
const updateTodo = async (req, res) => {
    try {
      const validatedData = TodoSchema.parse(req.body);
      const todo = await Todo.findById(req.params.id);
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      if (todo.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to update this todo' });
      }
  
      todo.title = validatedData.title;
      todo.completed = validatedData.completed !== undefined ? validatedData.completed : todo.completed;
      await todo.save();
  
      res.status(200).json(todo);
    } catch (error) {
      res.status(400).json({ message: error.errors });
    }
  };
*/

// Owner can update and only with single database call.
const updateTodo = async (req, res) => {
    try {
      const validatedData = TodoSchema.parse(req.body);
      const todo = await Todo.findOneAndUpdate({ 
        _id: req.params.id,
        userId: req.user.id
     }, validatedData, { new: true, runValidators: true });
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found or you are not authorized to update this todo' });
      }
      res.status(200).json(todo);
    } catch (error) {
      res.status(400).json({ message: error.errors });
    }
  };

/*
Here, anyone can delete even if they get other user's token.
const deleteTodo = async (req, res) => {
    try {
      const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
      if (!deletedTodo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.status(200).json({ id: req.params.id });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

*/


/*
Here, I am doing two database calls for the deletion. Only the owner can delete.
const deleteTodo = async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      if (todo.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'You are not authorized to delete this todo' });
      }
  
      await Todo.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Todo deleted', id: req.params.id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};

*/
  
// Just a single database call for deletion and only the owner can delete it.
const deleteTodo = async (req, res) => {
    try {
      const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found or you are not authorized to delete this todo' });
      }
      res.status(200).json({ message: 'Todo deleted', id: req.params.id });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
}; 

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
}