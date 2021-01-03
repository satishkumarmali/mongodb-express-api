'use strict';

const { TagModel } = require('../models')

const self = module.exports = {
    /* Create new user */
    create: async (objData) => {
        return await TagModel.create(objData);
    },

    find: async (query = {}, extraOptions = {}) => {
        return await TagModel.find(query, extraOptions);
    },

    findOne: async (query) => {
        return await TagModel.findOne(query);
    },
    // update result and return updated result
    update: async (query = {}, objData = {}) => {
        await TagModel.updateOne(query, {$set: objData});
        return await TagModel.findOne(query);
    },

    remove: async (query) => {
        return await TagModel.deleteOne(query);
    },

    // Insert tag data and return id
    insert: async (tags) => {
        let tagId = [];

        return Promise.all(tags.map(async(element) => {
            let query = { name: element}
            await self.findOne(query).then(async(result)=>{
                if(result !== null){
                    tagId.push(result._id);
                }else{
                    await self.create({ name: element}).then((res)=>{
                        tagId.push(res._id);
                    })
                }
            });
        })).then(()=>{
           return tagId
        });
    }
}