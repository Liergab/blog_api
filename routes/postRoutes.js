import express from 'express';
import protect from '../middleware/protect.js';
import multer from 'multer';
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
  });
    const upload = multer({
    storage:storage
  });

import * as controller from '../controller/postController.js'
router.get('/',protect, controller.getAllPost)
router.get('/:id',protect, controller.getPostById)
router.post('/',protect,upload.single('image'), controller.createPost)
router.delete('/:id',protect, controller.deletePost)
router.put('/:id',protect,upload.single('image'), controller.updatePost)
router.get('/getallpost', controller.getallpostwithnoauth);

export default router