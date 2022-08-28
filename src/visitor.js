const { default: mongoose } = require('mongoose');
const Mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/GreetingApp');
//mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
mongoose.connect('mongodb+srv://optauth:MkOoIxBnEIHNP3Cm@cluster0.afrxmm1.mongodb.net/otpauthenticate?retryWrites=true&w=majority');
const Schema = mongoose.Schema;
const Visitor = new Schema({
    email    : String,
    otp      : Number 
})
const newVisitor = mongoose.model('visitor',Visitor);
module.exports = newVisitor;