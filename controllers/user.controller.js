import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createToken } from '../services/auth.js';
import { UserModel } from '../models/user.model.js';

dotenv.config();

export const getUser = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.params.id)
            .populate('followers')
            .populate('following')
            .populate('collections');
        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = (req, res, next) => {
    return UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
        .then((resp) => {
            res.json(resp);
        })
        .catch((error) => next(error));
};

export const AddFollowers = async (req, res, next) => {
    const { body, params } = req;

    try {
        const following = await UserModel.findById(req.params.id);

        if (
            following.followers.some(
                (follower) => follower.toString() === req.body.id
            )
        ) {
            return res
                .status(400)
                .json({ alreadyFollows: 'User  is already followed' });
        } else {
            following.followers.push(req.body.id);
            await following.save();

            const user = await UserModel.findById(req.body.id);
            user.following.push(req.params.id);
            await user.save();

            const userToReturn = await UserModel.findById(req.body.id).populate(
                ['collections']
            );

            res.json(userToReturn);
        }
    } catch (error) {
        next(error);
    }
};
export const RemoveFollowers = async (req, res, next) => {
    try {
        let userFollowing = await UserModel.findById(req.params.id);
        if (
            userFollowing.followers.some(
                (follower) => follower.toString() !== req.body.id
            )
        ) {
            return res
                .status(400)
                .json({ doesntFollow: 'User is not followed' });
        } else {
            const userFollower = await UserModel.findByIdAndUpdate(
                req.params.id,
                {
                    $pull: { followers: req.body.id },
                },
                { new: true }
            );
            userFollowing = await UserModel.findByIdAndUpdate(
                req.body.id,
                {
                    $pull: { following: req.params.id },
                },
                { new: true }
            );

            const userToReturn = await UserModel.findById(req.body.id).populate(
                ['collections']
            );

            res.json(userToReturn);
        }
    } catch (error) {
        console.log('ahora', error);
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id).then((resp) => {
            res.json(resp);
        });
    } catch (error) {
        next(error);
    }
};

export const insertUser = async (req, resp, next) => {
    try {
        const encryptedpassword = await bcrypt.hashSync(req.body.password);
        const userData = {
            ...req.body,
            password: encryptedpassword,
        };
        const result = await UserModel.create(userData);
        const token = createToken({
            name: result.name,
            id: result.id,
        });

        resp.json({
            token,
            name: result.name,
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};
