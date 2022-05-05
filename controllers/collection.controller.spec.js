import * as controller from './collection.controller.js';
import { CollectionModel } from '../models/collection.model.js';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

jest.mock('../models/Collection.model.js');
jest.mock('bcryptjs');
jest.mock('../services/auth.js');
jest.mock('../models/user.model.js');
jest.mock('jsonwebtoken');

describe('Given the tasks controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: {}, body: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When insertCollection is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            test('Then call json', async () => {
                req.body = {
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    collections: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-collection-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                };
                req.headers = { authorization: 'bearer1234' };
                jwt.verify.mockReturnValue({ id: 1 });

                await CollectionModel.create.mockReturnValue({
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    collections: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-collection-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                });
                await UserModel.findByIdAndUpdate({});
                await controller.insertCollection(req, res, next);
                expect(CollectionModel.create).toHaveBeenCalled();
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                req.body = {
                    name: 'Goth girl 3',
                    totalPrice: '2766',
                    createdBY: 'emanuelle',
                    collections: [
                        {
                            _id: '6230bac67ccc9d51abeb6abe',
                            img: 'https://firebasestorage.googleapis.com/v0/b/wishy-c9ec8.appspot.com/o/17105314_35421861_600.png?alt=media&token=de189b65-2f50-4788-87c9-ef76b651c07b',
                            shopUrl:
                                'https://www.farfetch.com/ca/shopping/women/marni-cropped-leg-culottes-collection-17105314.aspx?storeid=10050',
                            price: 753,
                            category: 'trousers',
                            brand: 'Marni',
                        },
                    ],
                    favourite: true,
                    likes: 250,
                };
                CollectionModel.create.mockRejectedValue(
                    new Error('Error adding Collection')
                );
            });
            test('Then call next', async () => {
                await controller.insertCollection(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When  getCollectionById is triggered', () => {
        describe('And the id is found (promise resolved)', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                CollectionModel.findById.mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn(),
                    }),
                });
            });
            test('Then call json', async () => {
                await controller.getCollection(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And the id is not found (promise rejected)', () => {
            beforeEach(() => {
                req.params.id = '0000';
                CollectionModel.findById.mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest
                            .fn()
                            .mockRejectedValue(new Error('error')),
                    }),
                });
            });
            test('Then call next', async () => {
                await controller.getCollection(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When getAllCollections is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                CollectionModel.find.mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest.fn(),
                    }),
                });
            });
            test('Then call json', async () => {
                await controller.getAllCollections(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And it does not work (promise is rejected)', () => {
            beforeEach(() => {
                CollectionModel.find.mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        populate: jest
                            .fn()
                            .mockRejectedValue(new Error('error')),
                    }),
                });
            });
            test('Then call next', async () => {
                await controller.getAllCollections(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When  updateCollection is triggered', () => {
        describe('And the document is updated (promise resolved)', () => {
            beforeEach(() => {
                // req.params.id = '619516dd75bcdf9b77e6690c';
                CollectionModel.findByIdAndUpdate.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.updateCollection(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And update collection is not possible (promise is resolved)', () => {
            beforeEach(() => {
                CollectionModel.findByIdAndUpdate.mockRejectedValue(
                    new Error('Add collection not possible')
                );
            });
            test('Then call next', async () => {
                await controller.updateCollection(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When deleteCollection is triggered', () => {
        describe('And id exists', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                CollectionModel.findByIdAndDelete.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.deleteCollection(req, res, next);

                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And id not exists', () => {
            beforeEach(() => {
                //req.params.id = '619516dd75bcdf9b77e6690c';
                CollectionModel.findByIdAndDelete.mockResolvedValue(null);
            });
            test('Then call json', async () => {
                await controller.deleteCollection(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And there are a error (promise rejected)', () => {
            beforeEach(() => {
                CollectionModel.findByIdAndDelete.mockRejectedValue(
                    new Error('Error deleting a collection')
                );
            });
            test('Then call next', async () => {
                await controller.deleteCollection(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
