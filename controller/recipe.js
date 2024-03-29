/* eslint-disable no-unused-vars */
const { response } = require('../middleware/common');
const  ModelRecipe = require('../models/recipe')
const { v4: uuidv4, stringify } = require('uuid'); //membuat id unik
const cloudinary = require('../config/cloudinary');


const recipeController = {
    getRecipe : (req,res,next) => {
        const page = Number(req.query.page) || 1 
        const limit = Number(req.query.limit) || 10 
        const offset = (page - 1) * limit 
        const sortby = req.query.sortby || "id" 
        const sort = req.query.sort || "DESC"
        const search = req.query.search || '';
        
        ModelRecipe.selectDataRecipe({limit,offset,sort,sortby,search,page })
        .then(result => response(res,200,true,result.rows,'get data sukses'))
        .catch(err => response(res,401,false,err.message,'get data fail'))
    },
    getRecipeUser : (req,res,next) => {
        const page = Number(req.query.page) || 1 
        const limit = Number(req.query.limit) || 10 
        const offset = (page - 1) * limit 
        const sortby = req.query.sortby || "id" 
        const sort = req.query.sort || "DESC"
        const search = req.query.search || ''
        const user_recipe = req.payload.id
        
        ModelRecipe.selectDataUser({limit,offset,sort,sortby,search,page,user_recipe })
        .then(result => response(res,200,true,result.rows,'get data sukses'))
        .catch(err => response(res,401,false,err.message,'get data fail'))
    },
    getRecipeDetail : (req,res,next) => {
        ModelRecipe.selectDataRecipeDetail(req.params.id)
        .then(result => response(res,200,true,result.rows,'get data sukses'))
        .catch(err => response(res,401,false,err,'get data fail'))
    },
    delete: (req,res,next) => {
        ModelRecipe.deleteRecipe(req.params.id)
        .then(result => response(res,200,true,result.rows,'delete data sukses'))
        .catch(err => response(res,401,false,err,'delete data fail'))
    },
    insert : async (req,res,next) => {
        const id =  uuidv4()
        const data = {
            id,
            title : req.body.title,
            ingredients : req.body.ingredients,
            vidio : req.body.vidio,
            description : req.body.description,
            user_recipe_id : req.payload.id   
        }
        if (req.file) {
            const image = await cloudinary.uploader.upload(req.file.path, {
              folder: 'telegram',
            });
    
            data.photo = image.url;
          } else {
            data.photo = users.photo;
          }
          
        console.log(data)
        ModelRecipe.insertDataRecipe(data)
        .then(result => response(res,200,true,result.rows,'insert data sukses'))
        .catch(err => response(res,401,false,err,'insert data fail'))
    },
}


exports.recipeController = recipeController

