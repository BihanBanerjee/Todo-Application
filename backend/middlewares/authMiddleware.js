const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(verified.id).select('-password'); // check sigin e ki bhabe jwt.sign korchi, ok?
            next();
        } catch (error){
            //res.status(401).json({message: 'Not authorized, token failed'});
            res.status(401).json({ message: error.message });
        }
    }

    if(!token){
        res.status(401).json({ message: 'Not authorized, no token' });
    }    
};

// export default protect;
module.exports = { protect }