const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const zod = require("zod")
const app = express();
const validator = require('validator');

dotenv.config();

mongoose.connect("mongodb+srv://vermaaman99280:aman1140706@cluster0.vknimfi.mongodb.net/loginform" , {
    useNewUrlParser : true ,
    useUnifiedTopology : true,
})
// Mobile number validation function
const mobileValidator = (mobile) => {
    const regex = /^\d{10}$/;
    return regex.test(mobile);
};
const passwordValidator = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
    return regex.test(password);
}; 
const emailValidator = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

const registrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        unique: true
    },

    lastname: {
        type: String,
        required: true,
        unique: true
    },
    mobilenumber: {
        type: String,
        required: true,
        validate: {
            validator: mobileValidator,
            message: 'Mobile number must be exactly 10 digits.'
        }
    }
,

    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Email must be a valid email address.'
        }
    },
    street: {
        type: String,
        required: true,
        unique: true
    },
    city: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true,
        unique: true
    },
    loginid: {
        type: String,
        minlength: [8, 'Username must be at least 8 characters long.'],
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: passwordValidator,
            message: 'Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one special character.'
        }
    }
})
const Registration = mongoose.model("Registration" , registrationSchema)

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())

app.get("/" , (req, res)=>{
    // console.log(__dirname)
    res.sendFile(__dirname + "/pages/index.html")
})


app.post("/register" , async(req ,res)=>{
    try {
        const { firstname ,
            lastname,
            mobilenumber ,
            email ,
            street ,
            city ,
            state ,
            country ,
            loginid ,
            password } = req.body;
        const registrationData = new Registration({
            firstname ,
            lastname,
            mobilenumber ,
            email ,
            street ,
            city ,
            state ,
            country ,
            loginid ,
            password
        })
        await registrationData.save();
        res.redirect("/success")
    } catch(error) {
        console.log(error)
        res.redirect("/error")
    }
})


app.get("/success" , (req ,res)=>{
    // console.log(__dirname)
    res.sendFile(__dirname +"/pages/success.html" )
})

app.get("/error" , (req ,res)=>{
    res.sendFile(__dirname +"/pages/error.html" )
})
app.listen(3000 , ()=>{
    console.log("server listen at port 3000")
})
