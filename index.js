// modules
import express from 'express';
import 'dotenv/config';
import authRoute from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/usersRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { error, pageNotFound } from './middleware/errorHandler.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

const app = express();
const port = 3001 || process.env.PORT;

// middleware
app.use(express.json());
app.use(cookieParser())
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));

app.use('/v1/api/auth/', authRoute );
app.use('/v1/api/post/', postRoutes );
app.use('/v1/api/user/', userRoutes );
app.get('/sample', (req,res) => {
    res.send('hello')
  })
  app.get('/getallpost', async(req,res) => {
    const posts = await prisma.posts.findMany({
        include:{
            userPost:true
        },
        orderBy: {
            createdAt: 'desc' // Sorting by createdAt field in descending order
        }
    });

    res.status(200).json(posts);
  })
app.use(pageNotFound);
app.use(error);


app.listen(port , () => {
    console.log(`listening in Port: http://localhost:${port} `)
});