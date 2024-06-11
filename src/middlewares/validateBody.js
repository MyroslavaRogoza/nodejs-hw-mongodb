import createHttpError from 'http-errors';

export const validateBody=(schema)=>{ return async(req, res, next)=>{
    try{
        console.log('schema.validateAsync=',await schema.validateAsync(req.body, {
            abortEarly: false,
          }));
        await schema.validateAsync(req.body, {
            abortEarly: false,
          });
          next();
    }
    catch(err){
        const error = createHttpError(400, 'Bad Request', {
            errors: err.details,
          });
          next(error);
        }
    };
};


