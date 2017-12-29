var mongoose = require('mongoose');

var projectSchema = mongoose.Schema({
  name : String,
  desc : String,
  mentor : String,
  link : String,
  language : String
});

module.exports = mongoose.model('Project', projectSchema);