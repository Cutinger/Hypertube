const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        default: '',
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type: Date,
        default: Date.now,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    img:{
        type: String,
        default: 'https://i.ibb.co/hgvJPFb/default-Img-Profile.png'
    },
    history: {
        type: Array,
        required: false,
        timestamps: true
    },
    oauthID:String,
    facebook: JSON,
    github: JSON,
    42: JSON,
});

// Export the model
module.exports = User = mongoose.model("users", userSchema);