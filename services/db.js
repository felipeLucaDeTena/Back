import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import { collectionCreator } from '../models/collection.model.js';
import { itemCreator } from '../models/item.model.js';
import { userCreator } from '../models/user.model.js';

export async function mongoConnect() {
    const user = process.env.DBUSER;
    const password = process.env.DBPASSW;
    let dbName;
    if (process.env.NODE_ENV === 'test') {
        dbName = process.env.TESTDBNAME;
    } else {
        dbName = process.env.DBNAME;
    }
    console.log('Connecting to', dbName);
    const uri = `mongodb+srv://${user}:${password}@cluster0.89hok.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    return await mongoose.connect(uri);
}

export async function mongoDisconnect() {
    return mongoose.disconnect();
}
