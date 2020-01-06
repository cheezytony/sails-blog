/**
 * PostsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  index: async function (req, res) {

    const limit = req.param('limit') || 3;
    const page = req.param('page') || 1;

    const skip = (page - 1) * limit;

    const total = await Post.count();

    const posts = await Post.find({
      limit,
      skip: skip
    })
    .populate('user')
    .populate('comments')
    .populate('likes')
    .populate('tags');

    res.json({
      posts,
      limit,
      page,
      skip,
      total,
      pages: Math.ceil(total / limit)
    });
  },

  store: async function(req, res) {

    var errors = {};

    // console.log(req.file('featuredImage'));

    // Upload Featured Image If Provided
    // if (req.file('featuredImage')) {
    //   req.file('featuredImage').upload((error, uploadedFiles) => {
    //     if (error) {
    //       return res.serverError(error);
    //     }

    //     return res.json({
    //       ...uploadedFiles,
    //       url: require('util').format('%s/user/avatar/%s', sails.config.custom.baseUrl, req.body.user),
    //       baseUrl: sails.config.custom.baseUrl
    //     });
    //   });
    // }

    res.json('done');

    try {
      var post = await Post.create({
        user: req.param('user'),
        title: req.param('title'),
        body: req.param('body')
      }).fetch();

      // Save Tags
      if (req.body.tags && req.body.tags.length) {
        tags = req.body.tags.forEach( async (tag) => await Tag.create({
          title: tag,
          post: post.id,
          user: req.param('user')
        }) );
      }

      post = await Post.findOne({ id: post.id })
      .populate('user')
      .populate('comments')
      .populate('likes')
      .populate('tags');

      res.json({
        success: true,
        post
      });

    } catch(e) {
      if (e.invalidAttributes) {
        errors = e.Errors;
        res.status(422);
        return res.json(errors);
      }
      res.status(500);
      return res.json({ error: e });
    }

  },

  view: async function(req, res) {
    const postId = req.param('postId');

    post = await Post.findOne({
      id: postId
    })
    .populate('user')
    .populate('comments')
    .populate('likes')
    .populate('tags');

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
        status: false
      });
    }

    const nextPost = await Post.find({
      where: {
        createdAt: {
          '>': post.createdAt
        }
      },
      limit: 1
    });

    const prevPost = await Post.find({
      where: {
        createdAt: {
          '<': post.createdAt
        }
      },
      limit: 1
    });

    res.json({
      post,
      nextPost: nextPost[0],
      prevPost: prevPost[0]
    });
  },

};

