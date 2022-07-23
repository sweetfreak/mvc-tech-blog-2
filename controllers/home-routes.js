const router = require('express').Router();
//const sequelize = require('../config/connection');
const {Post, User, Comment} = require('../models');

router.get('/', (req, res) => {

  console.log('======================');

    Post.findAll({
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
      
    })
      .then(dbPostData => {
        //console.log(dbPostData[0]);
        //this will loop over and map each sequelize object into a serialized version of itself, saving the results in a new posts array.
        const posts = dbPostData.map(post => post.get({ plain: true }));
        //then you only render the posts array
        res.render('homepage', {
          posts,
          loggedIn: req.session.loggedIn
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/post/:id', (req, res) => {
  
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_text',
        'title',
        'created_at',
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
  
        // pass data to template
        res.render('single-post', { 
          post,
          loggedIn: req.session.loggedIn 
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }
  
    res.render('login');
  });


  router.get('/signup', (req, res) => {
    
    if (req.session.loggedIn) {
      res.redirect('/');
      return;
    }

    res.render('signup');
  });

  router.get('/new-post', (req, res) => {

  if (req.session.loggedIn) {
    res.render('new-post', {loggedIn: true})
  } else {
    
      res.redirect('/');
  }
      
    
  })

  



  module.exports = router;