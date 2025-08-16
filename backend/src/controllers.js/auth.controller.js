import { upsertStreamUser } from '../lip/stream.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
    const {email,password,fullName}=req.body
    try {
        if(!email || !password || !fullName) {
            return res.status(400).json({message: "Please fill all the fields"});
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Please enter a valid email address"});
        }

        const idx = Math.floor(Math.random() * 100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;


        // Create new user
        const newUser = await User({
            email,
            password,
            fullName,
            profilePicture :randomAvatar,
        }); 
        await newUser.save();

        // Upsert user in Stream
        try {
            upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePicture||'',
            });
            console.log(`Stream user upserted successfully for ${newUser.fullName}`);
        } catch (error) {
            console.error('Error upserting Stream user:', error);
        }

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt',token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // Helps prevent CSRF attacks
        }
        )
        res.status(201).json({
            success: true,
            user:newUser
    });
       

    } catch (error) {
        console.error(error);
    res.status(500).json({ message: "Server error", error: error.message }); 
    }
    }
    
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }   
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('jwt',token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'strict', // Helps prevent CSRF attacks
        }
        )

        res.status(200).json({
            success: true,
            user: user,
            message: "Login successful"
        });                                                                                        

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
        
    }
    }


export function logout(req, res) {
    res.clearCookie('jwt')
    res.status(200).json({ success:true,message: "Logout successful" });
    }



export async function onboard(req,res){
   try {
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName||!bio||!nativeLanguage || !learningLanguage || !location) {
        return res.status(400).json({ message: "Please fill all the fields" ,
            missingFields: [
                !fullName && 'fullName',
                !bio && 'bio',
                !nativeLanguage && 'nativeLanguage',
                !learningLanguage && 'learningLanguage',
                !location && 'location'
            ].filter(Boolean)
            
        });}

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                ...req.body,
                isOnboarded: true
            },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upsert user in Stream
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || '',
            })
        } catch (streamError) {
            console.error('Error upserting Stream user:', streamError);
            return res.status(500).json({ message: "Failed to upsert Stream user" });
        }

        res.status(200).json({
            success: true,
            user: updatedUser,
            message: "Onboarding successful"
        });

    } catch (error) {
    console.error("Onboarding error : ",error);
    res.status(500).json({ message: "Server error", error: error.message });
    
}
}