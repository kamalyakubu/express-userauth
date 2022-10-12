const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }, //

    date_of_birth: {
        type: String,
    },

    gender: {
        type: String,
        required: true
    }, //

    phone: {
        type: Number
    }, 

    email: {
        type: String,
        required: true, 
        unique: true
    }, //

    password: {
        type: String,
        required: true,
    }

},

{timestamps: true
})


const userModel = mongoose.model('User', userSchema);
module.exports = userModel;