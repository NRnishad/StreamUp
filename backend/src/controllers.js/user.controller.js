import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
export async function getRecommendeddUsers(req, res){
    try {
      const currentUserId = req.user.id;
      const currentUser = req.user;

      const recommendedUsers = await User.find({
        $and: [
          { _id: { $ne: currentUserId } }, //exclude current user
          { _id: { $nin: currentUser.friends } }, // exclude current user's friends
          { isOnboarded: true },
        ],
      });
      res.status(200).json(recommendedUsers);
    } catch (error) {
      console.error("Error in getRecommendedUsers controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req,res) {
     try {
       const user = await User.findById(req.user.id)
         .select("friends")
         .populate(
           "friends",
           "fullName profilePicture nativeLanguage learningLanguage"
         );

       res.status(200).json(user.friends);
     } catch (error) {
       console.error("Error in getMyFriends controller", error.message);
       res.status(500).json({ message: "Internal Server Error" });
     }
}


export async function sendFriendRequest(req,res){
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        //prevent sending friend request to self
        if(myId === recipientId) {
            return res.status(400).json({message:"You cannot send friend request to yourself"})
        }
        //find recipient
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({message:"Recipient not found"})
        }
        //check if already friends
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({message:"You are already friends with this user"})
        }
        //check if friend request already sent
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        })
        if(existingRequest) {
            return res.status(400).json({message:"Friend request already sent"})
        }
        //create new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        res.status(201).json( friendRequest);

    } catch (error) {
        console.error("Error sending friend request:",  error.message);
        res.status(500).json({ message: "Server error"});
    }
}

export async function acceptFriendRequest(req,res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        // Check if the current user is the recipient of the request
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }
        // Update the status of the friend request to 'accepted'
        friendRequest.status = 'accepted';
        await friendRequest.save();
        // Add both users to each other's friends list
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet:{frends:friendRequest.recipient}
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet:{frends:friendRequest.sender} 
        });
        res.status(200).json({ message: "Friend request accepted successfully" });


    } catch (error) {
        console.error("Error accepting friend request:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getFriendRequest(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({ recipient: req.user._id, status: 'pending' })
            .populate('sender', 'fullName profilePicture nativeLanguage learningLanguage location bio')
            .sort({ createdAt: -1 });
        const acceptedRequests = await FriendRequest.find({ recipient: req.user._id, status: 'accepted' })
            .populate('sender', 'fullName profilePicture nativeLanguage learningLanguage location bio')
            .sort({ createdAt: -1 });
        res.status(200).json({ incomingRequests, acceptedRequests });

    } catch (error) {
        console.error("Error fetching friend requests:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export async function getOutgoingFriendRequest(req,res){
    try {
        const outgoingRequests = await FriendRequest.find({ sender: req.user._id, status: 'pending' })
        .populate('recipient', 'fullName profilePicture nativeLanguage learningLanguage location bio')
        .sort({ createdAt: -1 });
    res.status(200).json({ outgoingRequests });
    } catch (error) {
        console.error("Error fetching outgoing friend requests:", error.message);
        res.status(500).json({ message: "Server error" });
    }

}