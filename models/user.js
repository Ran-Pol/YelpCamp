const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// We are using this plugin and it will take care of the following:
// 1. Username 2.Password 3. Uniqueness(Not duplicating)
UserSchema.plugin(passportLocalMongoose);