const express = require('express');
const Joi = require('joi');
const productModel = require('../models/product.model');
const productRouter = express.Router();
const ProductModel = require('../models/product.model');

productRouter.get('/', (req,res) => {
    res.send('api working')
})

// Tao product
productRouter.post('/register', async (req,res) => {
    const {error} = productValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newProduct = new ProductModel();
    newProduct.name = req.body.name;
    newProduct.author = req.body.author;
    newProduct.category = req.body.category;
    newProduct.status = req.body.status;
    newProduct.price = req.body.price;
    newProduct.image = req.body.image;

    try {
        const product = await newProduct.save();
        res.send("Them san pham thanh cong");
    } catch (error) {
        res.status(400).send("error");
    }
});

// Lay danh sach product
productRouter.get("/products", (req,res) => {
    ProductModel.find({}).exec((err, products) => {
        if(err) {
            res.send("Khong the lay danh sach san pham");
        } else {
            res.json(products);
        }
    })
});

// Lay san pham theo id
productRouter.get('/products/:id', (req,res) => {
    productModel.findOne({
        _id: req.params.id
    }).exec((err,product) => {
        if(err) {
            res.send("Khong the lay thong tin san pham");
        } else {
            res.json(product);
        }  
    })
});

// Cap nhat thong tin san pham
productRouter.put('/products/:id', (req,res) => {
    ProductModel.findByIdAndUpdate({
        _id: req.params.id
    }, { $set: {
        name: req.body.name,
        author: req.body.author,
        category: req.body.category,
        status: req.body.status,
        price: req.body.price,
        imgage: req.body.image
    }}, { upsert: true}, (err, product) => {
        if (err) {
            res.send('Xay ra loi khi update');
        } else {
            res.send('cap nhat thanh cong');
        }
    })
});

// Xoa 1 san pham
productRouter.delete('/products/:id', (req,res) => {
    
    ProductModel.findByIdAndDelete({ _id: req.params.id}, (err, product) => {
        if (err) {
            res.send("San pham khong ton tai");
        } else {
            res.send("Da xoa thanh cong");
        }
    })
})

function productValidate(product) {
    const schema = Joi.object({
        name: Joi.string().min(1).required(),
        author: Joi.string().min(1).required(),
        category: Joi.string().min(1).required(),
        status: Joi.string().required(),
        price: Joi.string().min(0).required(),
        image: Joi.string().required()
    });
    return schema.validate(product);
}

module.exports = productRouter;