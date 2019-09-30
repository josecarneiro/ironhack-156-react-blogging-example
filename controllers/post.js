"use strict";

const Post = require("./../models/post");

exports.list = (req, res, next) => {
  Post.find()
    .sort({ createdAt: -1 })
    .populate("user")
    .then(posts => {
      res.json({ type: "success", data: { posts } });
    })
    .catch(error => {
      next(error);
    });
};

exports.create = (req, res, next) => {
  const { title, body } = req.body;
  Post.create({
    title,
    body,
    user: req.user._id
  })
    .then(post => {
      res.json({ type: "success", data: { post } });
    })
    .catch(error => {
      next(error);
    });
};

exports.load = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .populate("user")
    .then(post => {
      res.json({ type: "success", data: { post } });
    })
    .catch(error => {
      next(error);
    });
};

exports.edit = (req, res, next) => {
  const id = req.params.id;
  const { title, body } = req.body;
  Post.findByIdAndUpdate(
    id,
    {
      ...(title && { title }),
      ...(body && { body })
    },
    { new: true }
  )
    .then(post => {
      res.json({ type: "success", data: { post } });
    })
    .catch(error => {
      next(error);
    });
};

exports.remove = (req, res, next) => {
  const id = req.params.id;
  Post.findByIdAndDelete(id)
    .then(() => {
      res.json({ type: "success" });
    })
    .catch(error => {
      next(error);
    });
};
