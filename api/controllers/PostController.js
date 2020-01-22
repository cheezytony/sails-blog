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
    .sort('createdAt DESC')
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

    async function saveData(featuredImage) {

      try {

        var post = await Post.create({
          user: req.param('user'),
          title: req.param('title'),
          body: req.param('body'),
          featuredImage
        }).fetch();

        // Save Tags
        if (req.body.tags && req.body.tags.length) {
          const tags = JSON.parse(req.body.tags) || [];
          tags.forEach( async (tag) => await Tag.create({
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
        console.log(e);
        if (e.invalidAttributes) {
          const errors = e.Errors;
          res.status(422);
          return res.json(errors);
        }
        res.status(500);
        return res.json({ error: e });
      }
    }

    // Upload Featured Image If Provided
    if (req.file('featuredImage')) {

      const uploadDir = 'assets/uploads';

      req.file('featuredImage').upload({
        dirname: require('path').resolve(sails.config.appPath, uploadDir)
      }, (error, uploadedFiles) => {
        if (error) {
          return res.serverError(error);
        }

        var featuredImage;
        if (uploadedFiles.length) {
          const arr = uploadedFiles[0].fd.split('/');
          featuredImage = `${uploadDir}/${arr[arr.length-1]}`;
        }
        return saveData(featuredImage);
      });
    }else {
      return saveData();
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

  image: async function(req, res) {
    const postId = req.param('postId');

    const post = await Post.findOne({ id: postId });

    if (!post || !post.featuredImage) {
      return res.notFound();
    }

    var SkipperDisk = require('skipper-disk');
    var fileAdapter = SkipperDisk(/* optional opts */);

    res.set('Content-disposition', `attachment; filename='${post.featuredImage}'`);

    const url = require('path').resolve(sails.config.appPath, post.featuredImage);

    fileAdapter.read(url)
    .on('error', (err) => {
      return res.serverError(err);
    })
    .pipe(res);
  }

};

