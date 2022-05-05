import { createToken, verifyToken } from './auth.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Given a function createToken, when is invoked', () => {
    let user;
    beforeEach(() => {
        user = {
            _id: '123a54b',
            name: 'Pepe',
        };
    });
    test('should call jwt.sign ', () => {
        createToken(user);
        expect(jwt.sign).toHaveBeenCalled();
    });
});

describe('Given a function verifyToken, when is invoked', () => {
    describe('when is invoked with a valid token', () => {
        test('should call jwt.verify', () => {
            jwt.verify.mockReturnValue(true);
            verifyToken('token', 'secret');
            expect(jwt.verify).toHaveBeenCalled();
        });
    });
    describe('when is invoked with a invalid token', () => {
        test('should call jwt.verify and throw an error', () => {
            jwt.verify.mockImplementation(() => {
                throw new Error('Invalid token');
            });
            verifyToken('token', 'secret');
            expect(jwt.verify).toHaveBeenCalled();
            expect(() => jwt.verify()).toThrow();
        });
    });
});
