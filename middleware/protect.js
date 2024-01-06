import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const userId = decoded.userId;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select:{
            username:true,
            email:true,
            image:true,
            id:true,
            createdAt:true,
            updatedAt:true

        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      req.user = user;

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not Authorized, Invalid Token');
    }
  } else {
    res.status(401);
    throw new Error('Not Authorized, No token');
  }
});

export default protect;