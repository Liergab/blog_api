import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcrypt';
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import generateToken from '../middleware/generateToken.js';
const prisma = new PrismaClient()

//@description - register User/ createUser
//@method - post
//@access - public
export const register = asyncHandler(async(req,res ) => {
    const {username,email,password,image} = req.body;
    try { 
      const user = await prisma.user.findFirst({
        where:{
          email:email
        }
      })

      if(user){
        res.status(400).json('Email Already Used!')
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password,salt)
      const newUser = await prisma.user.create({
        data:{
          username,
          email,
          image:"",
          password:hashPassword

        }
      })
        res.status(201).json(newUser)
        
    } catch (error) {
      console.log('Error creating user:', error.message);
    }  
})

export const getUser = async(req,res ) => {
  // const getUser = await prisma.user.findMany();
  // res.status(200).json(getUser)
  res.json(req.user.id)
 
}

//@description - login 
//@method - post
//@access - public
export const login = async(req, res) => {
  const{email, password} = req.body;
  const user = await prisma.user.findFirst({ where:{ email:email }});
  if(!user){
    return res.status(404).json('Invalid Email')
  }else{
    if(user && (await bcrypt.compare(password, user.password))){
      generateToken(res, user.id)
       res.status(200).json({
        _id:user.id,
        email:user.email,
        username:user.username 
      })
    }else{
      res.status(404).json('Invalid credentials')
    }
  }
 
};

//@description - logout
//@method - post
//@access - protected
export const logout = (req,res ) => {
  res.cookie('jwt','',{
    httpOnly:true,
    expires: new Date(0)
})

res.status(200).json({message: 'Logout'})
}