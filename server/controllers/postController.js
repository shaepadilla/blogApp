const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .populate('comments.author', 'username email')
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts', error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email')
      .populate('comments.author', 'username email');
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch post', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({ title, content, author: req.user.id });
    res.status(201).json({ message: 'Post created successfully', post });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content } = req.body;
    post.title = title ?? post.title;
    post.content = content ?? post.content;
    await post.save();

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user.id;
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post', error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const { content } = req.body;
    post.comments.push({ content, author: req.user.id });
    await post.save();

    await post.populate('comments.author', 'username email');
    res.status(201).json({ message: 'Comment added successfully', comments: post.comments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};
