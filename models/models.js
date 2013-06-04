var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    name: String,
    analogies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analogy' }],
});

var conceptSchema = mongoose.Schema({
    title:
    analogies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Analogy' }],
});

var analogySchema = mongoose.Schema({
    content: String,
    author_id: String
})

var User = mongoose.model('User', userSchema);
var Concept = mongoose.model('Concept', conceptSchema);
var Analogy = mongoose.model('Analogy', analogySchema);

exports.User = User;
exports.Concept = Concept;
exports.Analogy = Analogy;
