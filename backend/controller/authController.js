const Joi = require('joi');
const User = require('../models/users');
const bcrypt = require('bcryptjs');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {

        // 1. validate input
        const userRegisterSchema = Joi.object({
            username: Joi.string().min(5).max(30).required(),
            name: Joi.string().max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });

        const {error} = userRegisterSchema.validate(req.body);

        // 2. if error in validation  -> return via middleware
        if(error) {
            return next(error);
        }
        // 3. if email or username is already registered -> return an error
        const{username, name, email, password} = req.body;

        try{
            const emailInUse = await User.exists({email});
            const usernameInUse = await User.exists({username});

            if(emailInUse) {
                const error = {
                    status: 409,
                    message: 'Email already registered, use another email!'
                }
                return next(error);
            }

            if(usernameInUse){
                const error = {
                    status: 409,
                    message: 'Username not available, use another username!'
                }

                return next(error);
            }
        }


        catch(error){
            return next(error);
        }

        //4. password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. store user data in db 
        const UserToRegister = new User({
            username: username,
            email: email,
            name: name,
            password: hashedPassword
        })

        const user = await UserToRegister.save();

        // 6. response send to user.
        return res.status(201).json({user: user});

    },
    async login() {}
}

module.exports = authController;