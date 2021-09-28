const express =require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();
const UserModel = require('../models/user.model');

userRouter.get('/', (req,res) => {
    res.send('api working');
})

// Tao 1 user moi

userRouter.post('/register', async (req,res) => {
    const {error} = registerValidate(req.body);
    if (error) return res.status(400).send( error.details[0].message)
    const emailExits = await UserModel.findOne({ email: req.body.email});
    if (emailExits) { return res.status(400).send('Email exits in database')};

    let salt = bcrypt.genSaltSync(10);
    let hashPassword = bcrypt.hashSync(req.body.passwordHash, salt);

    const newUser = new UserModel();
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.passwordHash = hashPassword;
    newUser.phoneNumber = req.body.phoneNumber;
    newUser.role = req.body.role;
    newUser.street = req.body.street;
    newUser.city = req.body.street;
    newUser.country = req.body.country;
    newUser.avatar = req.body.avatar;

    try {
        const user = await newUser.save();
        res.send('Tao user thanh cong');
    } catch (error) {
        res.status(400).send(error);
    }
});

// Lay danh sach user
userRouter.get('/users', (req,res) => {
    UserModel.find({}).exec((err, users) => {
        if (err) {
            res.send('Khong the lay thong tin user');
        } else {
            res.json(users);
        }
    });
});
// lay thong tin user theo id
userRouter.get('/users/:id', (req,res) => {
    UserModel.findOne({
        _id: req.params.id
    }).exec((err, user) => {
        if (err) {
            res.send('Khong tim thay user');
        } else {
            res.json(user);
        }
    });
});

// Cap nhat thong tin user
userRouter.put('/users/:id', (req,res) => {
    var salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(req.body.passwordHash, salt);

    UserModel.findByIdAndUpdate({
        _id: req.params.id
    }, { $set: {
        name: req.body.name,
        email: req.body.email,
        passwordHash: hashPassword,
        phoneNumber:req.body.phoneNumber,
        role: req.body.role,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        avatar: req.body.avatar
    }}, { upsert:true}, (err, user) => {
        if (err) {
            res.send('Xay ra loi update')
        } else {
            res.send(200);
        }
    })
});

// Delete user
userRouter.delete('/users/:id', (req, res) => {
    UserModel.findByIdAndDelete({_id:req.params.id}, (err, user) => {
        if (err) {
            res.send("Xay ra loi delete");
        } else {
            res.send(200)
        }
    })
});

// Lay danh sach admin, customer
userRouter.get('/get/count', (req, res) => {
    UserModel.find({ role: req.query.role })
    .exec((err, users) => {
        if (err) {
            res.send("Khong the lay thong tin user");
        } else {
            res.json(users);
        }
    })
});

// Login vao he thong
userRouter.post('/login', async (req,res) => {

    const {error} = loginValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const userLogin = await UserModel.findOne({ email: req.body.email});
    if (!userLogin) return res.status(400).send("Email chua ton tai");

    const passwordLogin = await bcrypt.compareSync(req.body.passwordHash, userLogin.passwordHash);
    if (!passwordLogin) res.status(400).send('Password incorrect');

    const token = jwt.sign({ _id: userLogin._id}, 'chuoibimat');
    res.header('auth-token', token).send('ban da dang nhap thanh cong') 
});

function registerValidate(data) {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        email: Joi.string().email().min(10).required(),
        passwordHash: Joi.string().min(8).required(),
        phoneNumber: Joi.string().min(10).required(),
        role: Joi.string().required(),
        street: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        avatar: Joi.string().required(),
    });
    return schema.validate(data)
};

function loginValidate(data) {
    const schema = Joi.object({
        email: Joi.string().email().min(10).required(),
        passwordHash: Joi.string().min(8).required()
    });
    return schema.validate(data);
};

module.exports = userRouter;