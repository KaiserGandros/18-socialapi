const { User, Thought } = require('../models');

const thoughtController = {
    getAllThought(req, res) {
        Thought.find({})
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) => {
            if (!thought) {
                return res.status(404).json({message: 'No thought found with this id.'})
            }
            res.json(thought);
        })
        .catch(err => res.status(500).json(err));
    },

    createThought(req, res) {
        Thought.create(req.body)
        .then(({_id}) => {
            return User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: _id}},
                {new: true}
            );
        })
        .then((thought) => {
            if (!thought) {
            return res.status(404).json({ message: 'Thought created, but no user found with id.'})
            }
            res.json({ message: 'Thought successfully created!', thought});
        })
        .catch(err => res.status(500).json(err));
    },

    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((thought) =>{
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id.'})
            }
            res.json({ message: 'Thought successfully updated!', thought});
        })
        .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res){
        Thought.findOneAndDelete({_id: req.params.thoughtId})
        .then((thought) => {
            if (!thought) {
                return res.status(404).json({ message:' No thought found with that id.'})
            }
            res.json({ message: 'Thought successfully deleted.', thought});
        })
        .catch(err => res.status(500).json(err));
    },
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: { reactions: req.body}},
            {runValidators: true, new: true}
        )
        .then((thought) =>{
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id.'})
            }
            res.json({ message: 'Reaction successfully added.', thought});
        })
        .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
        .then((thought) =>{
            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that id.'})
            }
            res.json({ message: 'Reaction successfully deleted', thought})
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports = thoughtController;