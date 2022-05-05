import * as controller from './register.controller.js';
import bcrypt from 'bcryptjs';
import { userCreator, UserModel } from '../models/user.model.js';
jest.mock('../models/user.model.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');
describe('Given the register controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        // User.find.mockReturnValue(User);
        UserModel.create.mockReturnValue({
            name: 'Pepe',
            surName: 'suarez',
            email: 'pepe@gmail.com',
            password: 'encrypted1234',
        });
        req = { params: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });
    describe('When registerUser is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            test('Then call json', async () => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');

                // createToken.mockReturnValue('mock_token');
                await controller.userRegister(req, res, next);
                expect(res.json).toHaveBeenCalledWith({
                    // token: 'mock_token',
                    name: 'Pepe',
                    email: 'pepe@gmail.com',
                    surName: 'suarez',
                    password: 'encrypted1234',
                });
            });
        });
        describe('And it does not works (promise is rejected)', () => {
            test('Then call next', async () => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');
                UserModel.create.mockRejectedValue(
                    new Error('Error adding user')
                );
                await controller.userRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('And there is no password', () => {
            test('Then call next', async () => {
                req.body = { password: undefined };
                UserModel.create.mockResolvedValue({
                    name: 'Pepe',
                    email: 'pepe@gmail.com',
                    surName: 'suarez',
                });
                bcrypt.hashSync.mockImplementation(() => {
                    new Error('Error, no password');
                });
                await controller.userRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
        describe('And there is no user name', () => {
            test('Then call next', async () => {
                req.body = { name: null };
                UserModel.create.mockResolvedValue({
                    email: 'pepe@gmail.com',
                    surName: 'suarez',
                    password: 'encrypted1234',
                });
                await controller.userRegister(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
