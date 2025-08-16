
export async function getRecommendeddUsers(req, res){
    try {
        const user = req.user;
        if (!user.isOnboarded) {
            return res.status(400).json({ message: "Please complete onboarding first" });
        }
        const recommendeddUsers = await User.find({
            $and: [
                { _id: { $ne: user._id } },
                { isOnboarded: true },
                { _id: { $nin: user.friends } }
            ]
        })
        .select("-password -friends ")
        .limit(10)

        res.status(200).json({recommendeddUsers})
        
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export async function getMyFriends(req,res) {}