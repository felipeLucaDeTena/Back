import mongoose from 'mongoose';

export function collectionCreator(modelName = 'Collection') {
    const collectionSchema = mongoose.Schema({
        name: { type: String, required: true },
        img: { type: String, required: true },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        },
        totalPrice: { type: Number, required: true },
        items: [{ type: mongoose.Types.ObjectId, ref: 'Item' }],
        favourite: { type: Boolean, required: true },
        likes: { type: Number, required: true },
    });

    collectionSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
            delete returnedObject.password;
        },
    });

    let Collection;
    if (mongoose.default.models[modelName]) {
        Collection = mongoose.model(modelName);
    } else {
        Collection = mongoose.model(modelName, collectionSchema);
    }
    return Collection;
}
export const CollectionModel = collectionCreator();
