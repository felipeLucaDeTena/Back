import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { CollectionModel } from '../models/collection.model.js';
import { UserModel } from '../models/user.model.js';

dotenv.config();

export const getCollection = async (req, res, next) => {
    try {
        const collection = await CollectionModel.findById(req.params.id)
            .populate('createdBy', 'name')
            .populate('items');
        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const getAllCollections = async (req, res, next) => {
    try {
        const collections = await CollectionModel.find({})
            .populate('createdBy', 'name')
            .populate('items');
        res.status(200).json(collections);
    } catch (error) {
        next(error);
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        await CollectionModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        next(error);
    }
};

export const insertCollection = async (req, resp, next) => {
    try {
        const authHeader = req.headers.authorization.split(' ')[1];
        const tokenContent = jwt.verify(authHeader, process.env.SECRET);
        const collectionData = { ...req.body, createdBy: tokenContent.id };
        const result = await CollectionModel.create(collectionData);
        const updatedUser = await UserModel.findByIdAndUpdate(
            tokenContent.id,
            {
                $push: { collections: result.id },
            },
            { new: true }
        );
        resp.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        await CollectionModel.findByIdAndDelete(req.params.id).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        next(error);
    }
};
