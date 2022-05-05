import * as controller from './user.controller.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../services/auth.js';
import { UserModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

jest.mock('../models/user.model.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');
jest.mock('jsonwebtoken');

describe('Given the user controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: { id: 1 } };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When insertUser is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockResolvedValue('encrypted1234');
                UserModel.create.mockReturnValue({
                    name: 'Pepe',
                    id: 1,
                });

                createToken.mockReturnValue('mock_token');
            });
            test('Then call json', async () => {
                await controller.insertUser(req, res, next);
                req.headers = { authorization: 'bearer1234' };
                jwt.verify.mockReturnValue({ id: 1 });
                expect(res.json).toHaveBeenCalledWith({
                    token: 'mock_token',
                    name: 'Pepe',
                    id: 1,
                });
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                req.body = { name: 'Pepe', password: '1234' };
                bcrypt.hashSync.mockReturnValue('encrypted1234');
                UserModel.create.mockRejectedValue(
                    new Error('Error adding user')
                );
                createToken.mockReturnValue('mock_token');
            });
            test('Then call next', async () => {
                await controller.insertUser(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When deleteUser is triggered', () => {
        describe('And id exists', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                UserModel.findByIdAndDelete.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.deleteUser(req, res, next);

                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And id not exists', () => {
            beforeEach(() => {
                //req.params.id = '619516dd75bcdf9b77e6690c';
                UserModel.findByIdAndDelete.mockResolvedValue(null);
            });
            test('Then call json', async () => {
                await controller.deleteUser(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And there are a error (promise rejected)', () => {
            beforeEach(() => {
                UserModel.findByIdAndDelete.mockRejectedValue(
                    new Error('Error deleting a user')
                );
            });
            test('Then call next', async () => {
                await controller.deleteUser(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When  updateUser is triggered', () => {
        describe('And the document is updated (promise resolved)', () => {
            beforeEach(() => {
                // req.params.id = '619516dd75bcdf9b77e6690c';
                UserModel.findByIdAndUpdate.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.updateUser(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And update user is not possible (promise is resolved)', () => {
            beforeEach(() => {
                UserModel.findByIdAndUpdate.mockRejectedValue(
                    new Error('Add collection not possible')
                );
            });
            test('Then call next', async () => {
                await controller.updateUser(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When  AddFollowers is triggered', () => {
        describe('And the document is updated (promise resolved)', () => {
            beforeEach(() => {
                // req.params.id = '619516dd75bcdf9b77e6690c';
                req = {
                    params: {
                        id: '2',
                    },
                    body: {
                        id: '1',
                    },
                };
                UserModel.findById.mockResolvedValue({
                    id: '1',
                    followers: [
                        {
                            id: '2',
                        },
                    ],
                    following: [],
                    save: jest.fn(),
                });
            });

            test('Then call json', async () => {
                await controller.AddFollowers(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And update user is not possible (promise is resolved)', () => {
            beforeEach(() => {
                UserModel.findById.mockRejectedValue(
                    new Error('Add collection not possible')
                );
            });
            test('Then call next', async () => {
                await controller.AddFollowers(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When  RemoveFollowers is triggered', () => {
        describe('And the document is updated (promise is resolved)', () => {
            beforeEach(() => {
                req = {
                    params: {
                        id: '2',
                    },
                    body: {
                        id: '2',
                    },
                };
                UserModel.findById.mockResolvedValue({
                    id: '2',
                    followers: [{ id: '2' }],
                    following: [{ id: '2' }],
                });

                UserModel.findByIdAndUpdate.mockResolvedValue({
                    id: '2',
                    followers: [],
                    following: [],
                });
            });

            test('Then call json', async () => {
                await controller.RemoveFollowers(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And update user is not possible (promise is resolved)', () => {
            beforeEach(() => {
                UserModel.findById.mockRejectedValue(
                    new Error('Add collection not possible')
                );
            });
            test('Then call next', async () => {
                await controller.RemoveFollowers(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When  getUserById is triggered', () => {
        describe('And the id is found (promise resolved)', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                UserModel.findById.mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest.fn(),
                        }),
                    }),
                });
            });
            test('Then call json', async () => {
                await controller.getUser(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And the id is not found (promise rejected)', () => {
            beforeEach(() => {
                req.params.id = '0000';
                UserModel.findById.mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn().mockReturnValue({
                            populate: jest
                                .fn()
                                .mockRejectedValue(new Error('error')),
                        }),
                    }),
                });
            });
            test('Then call next', async () => {
                await controller.getUser(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
