import express from "express"
const router = express.Router()
import multer from 'multer'

import * as eventController from '../controllers/eventControllers.js'
import * as blogController from '../controllers/blogControllers.js'
import * as annController from '../controllers/annController.js'


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "./media")
    },
    filename: function(req,file,cb) {
        return cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({storage: storage})


router.get('/getEvents', (eventController.getEvents))
router.get('/getPastevents', eventController.getPastEvents)
router.post('/updateEvent', upload.single('file'), eventController.updateEvent)
router.post('/addEvent', upload.single('file'), eventController.addEvent)
router.post('/deleteEvent', eventController.deleteEvent)

router.get('/getBlogs', blogController.getBlogs)
router.post('/updateBlog', upload.single('file'), blogController.updateBlog)
router.post('/addBlog', upload.single('file'), blogController.addBlog)
router.post('/deleteBlog', blogController.deleteBlog)


router.get('/getAnns', annController.getAnns)
router.post('/updateAnn', upload.single('file'), annController.updateAnn)
router.post('/addAnn', upload.single('file'), annController.addAnn)
router.post('/deleteAnn', annController.deleteAnn)



export default router