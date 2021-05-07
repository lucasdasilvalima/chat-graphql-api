import Post from "../../../models/post";
import User from "../../../models/user";
import { POST_CREATED } from "./channels";

export default {
    Post: {
        author: (obj) => User.findById(obj.author),
    },
    Query: {
        posts: () => Post.find(),
        post: (_, { id }) => Post.findById(id),
    },
    Mutation: {
        createPost: async (_, { data }, { pubsub }) => {
            const user = await Post.create(data);

            pubsub.publish(POST_CREATED, { postCreated: user });
            return user;
        },
        updatePost: (_, { id, data }) => Post.findOneAndUpdate(id, data, { new: true }),
        deletePost: (_, { id }) => !!(Post.findByIdAndDelete(id)),
    },
    Subscription: {
        postCreated: {
            subscribe: (obj, _, { pubsub }) => pubsub.asyncIterator(POST_CREATED),
        }
    }
};