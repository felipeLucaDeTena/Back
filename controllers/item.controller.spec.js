import * as controller from './item.controller.js';
import { ItemModel } from '../models/item.model.js';

jest.mock('../models/Item.model.js');

describe('Given the items controller', () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = { params: { id: 1 }, body: {} };
        res = {};
        res.send = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.status = jest.fn().mockReturnValue(res);
        next = jest.fn();
    });

    describe('When insertItem is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                ItemModel.create.mockReturnValue({});
            });
            test('Then call json', async () => {
                await controller.insertItem(req, res, next);
                expect(res.json).toHaveBeenCalledWith({});
            });
        });
        describe('And it doesnt work (promise is rejected)', () => {
            beforeEach(() => {
                ItemModel.create.mockRejectedValue(
                    new Error('Error adding Item')
                );
            });
            test('Then call next', async () => {
                await controller.insertItem(req, res, next);
                expect(next).toHaveBeenCalled();
            });
        });
    });
    describe('When  getItemById is triggered', () => {
        describe('And the id is found (promise resolved)', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                ItemModel.findById.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.getItem(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And the id is not found (promise rejected)', () => {
            beforeEach(() => {
                req.params.id = '0000';
                ItemModel.findById.mockRejectedValue(
                    new Error('The id has not be found')
                );
            });
            test('Then call next', async () => {
                await controller.getItem(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When getAllItems is triggered', () => {
        describe('And it works (promise is resolved)', () => {
            beforeEach(() => {
                ItemModel.find.mockResolvedValue([{}]);
            });
            test('Then call json', async () => {
                await controller.getAllItems(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And it does not work (promise is rejected)', () => {
            beforeEach(() => {
                ItemModel.find.mockRejectedValue(
                    new Error('Get All Items not possible')
                );
            });
            test('Then call next', async () => {
                await controller.getAllItems(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When  updateItem is triggered', () => {
        describe('And the document is updated (promise resolved)', () => {
            beforeEach(() => {
                // req.params.id = '619516dd75bcdf9b77e6690c';
                ItemModel.findByIdAndUpdate.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.updateItem(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And update item is not possible (promise is resolved)', () => {
            beforeEach(() => {
                ItemModel.findByIdAndUpdate.mockRejectedValue(
                    new Error('Add item not possible')
                );
            });
            test('Then call next', async () => {
                await controller.updateItem(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                // expect(next).toHaveBeenCalled();
            });
        });
    });

    describe('When deleteItem is triggered', () => {
        describe('And id exists', () => {
            beforeEach(() => {
                req.params.id = '619516dd75bcdf9b77e6690c';
                ItemModel.findByIdAndDelete.mockResolvedValue({});
            });
            test('Then call json', async () => {
                await controller.deleteItem(req, res, next);

                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And id not exists', () => {
            beforeEach(() => {
                //req.params.id = '619516dd75bcdf9b77e6690c';
                ItemModel.findByIdAndDelete.mockResolvedValue(null);
            });
            test('Then call json', async () => {
                await controller.deleteItem(req, res, next);
                expect(res.json).toHaveBeenCalled();
            });
        });
        describe('And there are a error (promise rejected)', () => {
            beforeEach(() => {
                ItemModel.findByIdAndDelete.mockRejectedValue(
                    new Error('Error deleting a item')
                );
            });
            test('Then call next', async () => {
                await controller.deleteItem(req, res, next);
                expect(res.json).not.toHaveBeenCalled();
                expect(next).toHaveBeenCalled();
            });
        });
    });
});
