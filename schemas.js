const Joi = require('joi');
const ExpressError = require('./utils/ExpressError');


const campSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
    }).required()
   
  });

module.exports.validateCampground = (req,res,next)=>{
    const {error} = campSchema.validate(req.body);
    if(error){
      const msg = error.details.map((el)=> el.message).join(',');
      throw new ExpressError(msg, 400);
    }
    else{
     next();
    }
  };
