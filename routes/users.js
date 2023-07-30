var express = require('express');
const {mongoose} = require('mongoose');
const {dbUrl} = require('../config/dbConfig');
const {userModel} = require ('../schema/userSchema');
const {hashPassword, hashCompare, createToken, decodeToken, validate, roleAdmin} = require('../config/auth')

var router = express.Router();

mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));





router.get('/allusers',validate,roleAdmin, async(req, res)=>{
  try {
   let users = await userModel.find();
   res.send({statusCode:200, users, message:"All DATA fetched Successfull"})

  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
}) 




router.get('/userprofile',validate, async (req, res) => {

  try {
    const { email, firstName, lastName, role, imageUrl} = req.body;

    console.log(email, firstName, lastName, role, imageUrl);

    let user = await userModel.findOne({ email }, { password: 0 });

    if (!user) 
    {
    return res.send({statusCode:400, message:"user not Found"})
  } else {

  res.send({statusCode:200, message:"Profile fetched Successfully", user: { email, firstName, lastName, role, imageUrl: user.imageUrl }})
  }

  } catch (error) {

    res.send({statusCode:500, message:"Internal server Error"})
    
  }
})



router.post('/signup', async(req, res)=>{
  try {
    let usersignup = await userModel.findOne({email:req.body.email})
    if(!usersignup){
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword;
      let newUser = await userModel.create(req.body)
      res.send({
        statusCode:200,
        message:"User Signedup Successfully"
      })
    }
    else res.send({statusCode:400, message:"User Already Exists"})
   
  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
})

router.post('/login', async(req, res)=>{
  try {
    let loginuser = await userModel.findOne({email:req.body.email})
    if( loginuser ){
      if(await hashCompare(req.body.password, loginuser.password) === true){
        let token = await createToken(loginuser)
        const { role } = loginuser;
        res.send({statusCode:200, token,role, message:"Login Successfull"})
      } else 
      res.send({statusCode:400, message:"Invalid Credential"})
    }
    else
        res.send({statusCode:400, message:"User doesn't Exists"})
   
  } catch (error) { 
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
})


router.delete('/deleteuser/:email', validate, roleAdmin, async (req, res) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({ email: req.params.email });

    if (!deletedUser) {
      res.send({statusCode:400, message:"User doesn't Exists"})
    } else
    res.send({statusCode:200, user: deletedUser, message: "User deleted successfully"})

  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
});


router.put('/updateuser/:email', async (req, res) => {
  try {

    const updatedUser = await userModel.findOneAndUpdate(
      { email: req.params.email },
      req.body,
      { new: true } 
    );

    console.log(updatedUser);
    
    if (!updatedUser) {
      res.send({ statusCode: 404, message: "User not found" });
    }

    res.send({
      statusCode: 200,
      user: updatedUser,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});


router.post('/adduser', async(req, res)=>{
  try {
    let useradd = await userModel.findOne({email:req.body.email})
    if(!useradd){
      let hashedPassword = await hashPassword(req.body.password)
      req.body.password = hashedPassword;
      let addUser = await userModel.create(req.body)
      res.send({
        statusCode:200,
        message:"User Added Successfully"
      })
    }
    else res.send({statusCode:400, message:"User Already Exists"})
   
  } catch (error) {
    console.log('error');
    res.send({statusCode:500, message:"Internal server Error"})
  }
})






module.exports = router;