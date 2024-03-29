const { User, Thought } = require('../models');

const userController = {
    getAllUser(req, res){
        User.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({_id: req.params.userId})
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then((user) =>{
            if (!user) {
                return res.status(404).json({ message: 'No user found with provided ID.'})
            }
            res.json(user);
        })
        .catch((err) => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        })
    },

    updateUser(req,res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        ).then((user) =>{
            if (!user) {
                return res.status(404).json({ message: 'No user found with provided ID.'})
            }
            res.json(user);
        })
        .catch((err) => res.status(500).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId})
        .then((user)=>{
            if (!user) {
                return res.status(404).json({ message: 'No user found with provided ID.'})
            }
            res.json({message: 'User deleted.', user });
        })
        .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            {runValidators: true, new: true}
            )
            .then((user) =>{
                if (!user) {
                    return res.status(404).json({ message: 'No user found with provided ID.'})
                }
                res.json({message: 'User added.', user });
            })
            .catch(err => res.status(500).json(err));
    },

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then(user =>{
            if (!user) {
                return res.status(404).json({ message: 'No user found with provided ID.'})
            }
            res.json({message: 'Friend deleted.', user });
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports = userController;