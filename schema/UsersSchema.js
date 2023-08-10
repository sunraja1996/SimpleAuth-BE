const mongoose = require('mongoose');
const validator = require('validator');


const UsersSchema = new mongoose.Schema({
    googleId: { type: String, unique: true },
  facebookId: { type: String, unique: true },
  githubId: { type: String, unique: true },
  displayName: String,
  role:{type:String, default:'user'},
    email:{
        type:String,
        lowercase:true,
        require:true,
        validate: (value) => {
            return validator.isEmail(value)
        }
    },
    
}, {collection:'smuser', versionKey:false})

const usersModel = mongoose.model('smuser', UsersSchema)

module.exports= {usersModel}
