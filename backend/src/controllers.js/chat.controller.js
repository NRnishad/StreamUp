import { getStreamTokenForUser } from '../lip/stream.js';
export async function getStreamToken(req,res){
    try {
        const token = await getStreamTokenForUser(req.user._id.toString());
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error getting Stream token:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}