var express = require('express');
var router = express.Router();
var db = require('../models');

/* GET users listing. */
router.get('/', function(req, res) {
  // res.send('respond with a resource');
  	// sequelize.sync().success(function() {
	  // db.User.create({
	  //   username: 'qian',
	  //   birthday: new Date(1986, 06, 28)
	  // }).success(function(sdepold) {
	  // 	res.send(sdepold);
	  //   // res.render('index', {
	  //   //   title: 'Express2222222222',
	  //   //   users: users
	  //   // })
	  // })

	db.User.findAll().success(function(data){
		res.send(data);
	})

	// });
  // db.User.findAll({
  //   include: [ db.User ]
  // }).success(function(users) {
  // 	console.log(users)
  //   res.render('index', {
  //     title: 'Express2222222222',
  //     users: users
  //   })
  // })
});

module.exports = router;
