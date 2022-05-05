import dotenv from 'dotenv';
import { ItemModel } from '../models/item.model.js';

dotenv.config();

export const getItem = async (req, res, next) => {
    try {
        const item = await ItemModel.findById(req.params.id);
        res.json(item);
    } catch (error) {
        next(error);
    }
};

export const getAllItems = async (req, res, next) => {
    try {
        const items = await ItemModel.find({});
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
};

export const updateItem = async (req, res, next) => {
    try {
        await ItemModel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        }).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        next(error);
    }
};

export const insertItem = async (req, resp, next) => {
    try {
        const itemData = { ...req.body };
        const result = await ItemModel.create(itemData);
        resp.json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteItem = async (req, res, next) => {
    try {
        await ItemModel.findByIdAndDelete(req.params.id).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
