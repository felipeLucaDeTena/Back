import { UserModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export async function userRegister(req, res) {
    const encryptedPassword = bcrypt.hashSync(req.body.password);
    const userData = { ...req.body, password: encryptedPassword };
    const newUser = await UserModel.create(userData);
    res.json(newUser);
}
