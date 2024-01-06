import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


//@description - create post
//@method - post
//@access - private
export const createPost = async(req,res) => {
    const{desc, title, cat} = req.body;
    try {
        const post = await prisma.posts.create({data:{
            desc:desc,
            title:title,
            cat:cat,
            userID:parseInt(req.user.id),
            image:req.file?.originalname
        }})
        res.status(201).json(post)
    } catch (error) {
        console.log('Error:', error)
    }
  
}

//@description -
//@method -
//@access -
export const getAllPost = async(req, res) => {
    try {
        const { cat } = req.query;
        let posts;

        if (cat) {
            posts = await prisma.posts.findMany({
                where: {
                    cat: cat 
                },
                include:{
                    userPost:true
                },
                orderBy: {
                    createdAt: 'desc' // Sorting by createdAt field in descending order
                }
            });
        } else {
            posts = await prisma.posts.findMany({
                include:{
                    userPost:true
                },
                orderBy: {
                    createdAt: 'desc' // Sorting by createdAt field in descending order
                }
            });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}

//@description -
//@method -
//@access -
export const getPostById = async(req,res) => {
    const{id} = req.params
    const post = await prisma.posts.findUnique({
        where:{
            id:parseInt(id)
        },
        include: {
            userPost: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                    // Exclude the 'password' field
                }
            }
        }
    })

    res.status(200).json(post)
}


//@description -
//@method -
//@access -
export const deletePost = async(req,res) => {
   const  {id} =  req.params

   const user = await prisma.posts.delete({
    where:{
        id:parseInt(id)
    }
   })
  res.status(200).json("deleted")
}


//@description -
//@method -
//@access -
export const updatePost = async(req,res) => {
    const{id} = req.params;
    const {title, desc,cat} =req.body;
    const post = await prisma.posts.update({
        where:{
            id:parseInt(id)
        },
        data:{
            title:title,
            desc: desc,
            cat:cat,
            userID:parseInt(req.user.id),
            image:req.file?.originalname
        }
    })

    res.status(200).json(post)
}

