import mongoose from 'mongoose';

export function itemCreator(modelName = 'Item') {
    const itemSchema = mongoose.Schema({
        img: { type: String, required: true },
        shopUrl: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
    });

    itemSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
            delete returnedObject.password;
        },
    });

    let Item;
    if (mongoose.default.models[modelName]) {
        Item = mongoose.model(modelName);
    } else {
        Item = mongoose.model(modelName, itemSchema);
    }
    return Item;
}
export const ItemModel = itemCreator();
