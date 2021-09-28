const express = require('express');
const app = express();
const userRouter = require('./routers/userRouter');
const productRouter = require('./routers/productRouter');

const mongoose = require('mongoose');
// const db = 'mongodb://localhost/bookstore';
const mongoAtlasUri = "mongodb+srv://hoangcu94:1234namsau@cluster0.gu4jo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        mongoAtlasUri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log(" Mongoose blog mindx is connected")
    );
} catch (e) {
    console.log("could not connect");
};



app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use('/', (req,res) => {
//     res.send('api working')
// });
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);

// app.listen(port, ()=> {
//     console.log('Server chay tren cong:', port);
// })
app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});