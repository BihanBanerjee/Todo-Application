const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');;

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();  
    }
    this.password = await bcrypt.hash(this.password, 12);
    next(); 
})

const User = mongoose.model('User', UserSchema);
//export default User
module.exports = { 
    User 
}