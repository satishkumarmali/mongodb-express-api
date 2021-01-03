'use strict';

const express = require('express');
const router = express.Router();
const validator = require('../helper/validator'); //for validation
const postCtrl = require('../controller/post.controller');
const tagCtrl = require('../controller/tag.controller');



//Post route
router.post('/post', validator.validate('post'), postCtrl.addPost);   //create post
router.get('/post', postCtrl.getPost);  //get post
router.get('/post/:id', postCtrl.getPost);
router.put('/post/:id', validator.validate('updatePost'), postCtrl.updatePost);   //update post
router.delete('/post/:id', validator.validate('deletePost'), postCtrl.deletePost);  //delete post
router.put('/post/:id/vote', validator.validate('vote'), postCtrl.postVote);  //post vote


//Tag route
router.post('/tag', validator.validate('tag'), tagCtrl.addTag); //create tag
router.get('/tag', tagCtrl.getTag);   //get tag
router.put('/tag/:id', validator.validate('updateTag'), tagCtrl.updateTag) //update tag
router.delete('/tag/:id', validator.validate('deleteTag'), tagCtrl.deleteTag); //delete tag

// Test server
router.get('/ping', (req,res,next)=>{
  res.send("pong");
});

router.all('*', (req, res) => {
  res.send(" No Route Found!")
});

module.exports = router;
