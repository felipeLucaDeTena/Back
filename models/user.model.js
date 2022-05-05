import mongoose from 'mongoose';

export function userCreator(modelName = 'User') {
    const userSchema = mongoose.Schema({
        name: { type: String, required: true },
        surName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        profileImg: { type: String },
        backImg: { type: String },
        interFaceColor: { type: String },
        collections: [{ type: mongoose.Types.ObjectId, ref: 'Collection' }],
        followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    });

    userSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            delete returnedObject.__v;
            delete returnedObject.password;
        },
    });

    let User;
    if (mongoose.default.models[modelName]) {
        User = mongoose.model(modelName);
    } else {
        User = mongoose.model(modelName, userSchema);
    }
    return User;
}
export const UserModel = userCreator();
