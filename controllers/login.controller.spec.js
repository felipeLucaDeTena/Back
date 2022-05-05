import * as controller from './login.controller.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../services/auth.js';
import { UserModel } from '../models/user.model.js';

jest.mock('../models/user.model.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');

describe('Given the login controller', () => {
    let req;
    let res;
    // eslint-disable-next-line no-unused-vars
    let next;
    beforeEach(() => {
        req = { params: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When login is triggered', () => {
        describe('And there are not user name ', () => {
            test('Then call next', async () => {
                req.body = { name: 'Pepe' };
                await controller.login(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
        describe('And there are not password', () => {
            test('Then call next ', async () => {
                req.body = { password: '1234' };
                await controller.login(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });

        describe('And there are user name or password', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
            });

            describe('And the user name is not found', () => {
                test('Then call next', async () => {
                    await UserModel.findOne.mockResolvedValue(null);
                    await controller.login(req, res, next);
                    expect(next).toHaveBeenCalled();
                });
            });

            describe('And the password is no correct', () => {
                test('Then call next', async () => {
                    await UserModel.findOne.mockResolvedValue({});
                    bcrypt.compareSync.mockReturnValue(null);
                    await controller.login(req, res, next);
                    expect(next).toHaveBeenCalled();
                });
            });
        });
    });
});
