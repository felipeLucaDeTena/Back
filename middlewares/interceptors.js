import { verifyToken } from '../services/auth.js';
import { CollectionModel } from '../models/collection.model.js';

export const loginRequired = (req, res, next) => {
    const authorization = req.get('authorization');
    let token;
    const tokenError = new Error('token missing or invalid');
    tokenError.status = 401;
    let decodedToken;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7);
        decodedToken = verifyToken(token);
        if (typeof decodedToken === 'string') {
            next(tokenError);
        } else {
            req.tokenPayload = decodedToken;
            next();
        }
    } else {
        next(tokenError);
    }
};

// eslint-disable-next-line no-unused-vars
export const userRequired = async (req, res, next) => {
    // console.log(req);
    const collectionId = req.params.id;
    const userId = req.tokenPayload.id;
    const collection = await CollectionModel.findById(collectionId);
    // console.log(collection, userId);

    if (collection?.createdBy.toString() === userId) {
        next();
    } else {
        const userError = new Error('not authorized user');
        userError.status = 401;
        next(userError);
    }
};
