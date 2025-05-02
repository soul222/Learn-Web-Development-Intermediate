import {openDB} from "idb";

const DATABASE_NAME = 'storyApp';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade: (database) => {
        database.createObjectStore(OBJECT_STORE_NAME, {
            keyPath: 'id',
        });
    },
});

const Database = {
    async putStory(story) {
        if (!Object.hasOwn(story, 'id')) {
            throw new Error('`id` is required to save');
        }

        return (await dbPromise).put(OBJECT_STORE_NAME, story);
    },

    async getStoryById(id) {
        if (!id) {
            throw new Error('`id` is required');
        }

        return (await dbPromise).get(OBJECT_STORE_NAME, id);
    },

    async getAllStories() {
        return (await dbPromise).getAll(OBJECT_STORE_NAME);
    },

    async removeStory(id) {
        return (await dbPromise).delete(OBJECT_STORE_NAME, id);
    }
}

export default Database;