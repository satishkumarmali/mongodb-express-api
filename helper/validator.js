'use strict';

const { body, query,param } = require('express-validator');

/* Validation check accroding to variable */
exports.validate = (method) => {
    switch(method){
        case 'post': {
            return [
                body('title','Please enter title').exists({checkNull: true,checkFalsy: true}),
                body('body','Body data is required').exists({checkNull: true,checkFalsy: true}),
            ]
        }

        case 'updatePost': {
            return [
                body('title','Please enter title').exists({checkNull: true,checkFalsy: true}),
                body('body','Body data is required').exists({checkNull: true,checkFalsy: true}),
                param('id', 'post id is required').exists({checkNull: true,checkFalsy: true})
            ]
        }

        case 'deletePost': {
            return [
                param('id', 'post id is required').exists({checkNull: true,checkFalsy: true})
            ]
        }

        case 'tag': {
            return [
                body('name','Tag name is required').exists({checkNull: true,checkFalsy: true}),
            ]
        }

        case 'updateTag': {
            return [
                body('name','Tag name is required').exists({checkNull: true,checkFalsy: true}),
                param('id', 'Tag id is required').exists({checkNull: true,checkFalsy: true})
            ]
        }

        case 'deleteTag': {
            return [
                param('id', 'Tag id is required').exists({checkNull: true,checkFalsy: true})
            ]
        }

        case 'vote': {
            return [
                param('id', 'Post id is required').exists({checkNull: true,checkFalsy: true}),
                body('vote','vote parameter is required').exists(),
            ]
        }
    }
}