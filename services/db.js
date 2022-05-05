import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export async function mongoConnect() {
  const user = fkltd;
  const password = felipe;
  let dbName;
  if (process.env.NODE_ENV === 'test') {
    dbName = testWishyDB;
  } else {
    dbName = wishyDB;
  }
  console.log('Connecting to', dbName);
  const uri = `mongodb+srv://${user}:${password}@cluster0.89hok.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return await mongoose.connect(uri);
}

export async function mongoDisconnect() {
  return mongoose.disconnect();
}
