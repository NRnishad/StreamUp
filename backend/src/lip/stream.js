import { StreamChat } from 'stream-chat';
import  'dotenv/config.js';


const apiKey = process.env.STREM_API_KEY;
const apiSecret = process.env.STREM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error('Stream API key and secret must be set in environment variables');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);
export const upsertStreamUser = async(userData) => {
    try {
        await streamClient.upsertUser(userData);
        return userData
    } catch (error) {
        console.error('Error upserting Stream user:', error);
        throw new Error('Failed to upsert Stream user');
    }
}




export const generateStreamToken = (userId) => {}