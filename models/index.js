const User = require('./user')
const Post = require('./post')
const Category = require('./category')
const Vote = require('./vote')

User.sync()
Post.sync()
Category.sync()
Vote.sync()
