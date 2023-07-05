var path =require('path')
const express=require('express');
const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser');
const app = express();
const port= 3000;
const url=require('url');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const fs= require('fs');
// // Abhishek
// const uri = "mongodb+srv://abhishekshrestha5125:10f67hk4AbIdpxfp@clustor1a.mrjuys9.mongodb.net/?retryWrites=true&w=majority";
// Bikash
const uri = "mongodb+srv://acharyab2:Iamcosmos@acharyab2.wg17b1q.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { dirname } = require('path');
const jwt_expiration=86400000;
const jwtsalt='privatekey';
const salt='$2b$10$Imnq7Q2r0RS7DqaKV0rpPe';
/* Middleware */
app.use(express.static('public'));
app.use(bodyParser.json());
// app.use(cookieParser());
var database = null;
console.log("test")
client.connect(function(err,db) {
	if (err) throw err
	console.log("Connected to the database");
	database = db.db("BingoGame");
	app.listen(port, () => {
		console.log(`Server started at ${port}`);
		
	  });

})

//contact api

app.post('/api/contact', (req, res) => {
	const contact = database.collection('contact');
	
	const formData = {
	  name: req.body.name,
	  email: req.body.email,
	  message: req.body.message
	};
	
	contact.insertOne(formData, (err, result) => {
	  if (err) {
		console.error(err);
		res.status(500).send('An error occurred while submitting the form');
	  } else {
		res.send('Thank you for contacting us');
	  }
	});
  });


//get the homepage login screen
app.get('/login',(req,res) =>{
	res.sendFile(path.join(__dirname,'/public/FrontEnd/html/login.html'));
});

app.get('/joinhostGame',(req,res) =>{
	res.sendFile(path.join(__dirname,'/public/FrontEnd/joinhostGame.html'));
});

app.post('/api/auth/signup',(req,res)=>{
    // signup the new user
	const user = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		age: req.body.age,
		email: req.body.email,
		password: req.body.password,
		phone: req.body.phone
	  };

	  console.log(user)
	  database.collection('users').find({email:user.email},{email:1}).toArray(function(err, result){
		if (err) throw err
		if(result.length>0) res.status(406).json({message:'User already exists'})
		else{
			user.password=bcrypt.hashSync(user.password,salt).replace(`${salt}.`,'');
			database.collection('users').insertOne(user,function(err,result){
				if (err) throw err
				// code for navigating to logn page after user is created
				res.status(201).json({ message: 'User created', redirect: '/login' });
			})
		}

	})  

});


app.post('/api/auth/login',(req,res)=>{
		database.collection('users').find({email:req.body.email},{email:1,password:1}).toArray(function(err, result){			
			
			if(result.length==0) res.status(406).json({message:'User is not registered',redirect: '/login'})
			else{
				if(result[0].password != bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) return res.status(406).json({message:'Wrong password',redirect: '/login'})
				else{
					userId=result[0]._id.toString().replace('New ObjectId("','').replace('")','')
					console.log(userId)
					const username = result[0].email
					let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration})
					database.collection('users').updateOne({_id:ObjectId(userId)},{$set:{jwt:token}},function(err,result){
						if (err) throw err
						const redirectUrl = `/joinhostGame?username=${encodeURIComponent(username)}`
						res.status(201).json({message:'User authenticated and redirected to game page', redirect: redirectUrl});
						// res.cookie('email', result[0].email, { maxAge: 900000, httpOnly: true });						
					})
				}
			}
		})
});


//This code block gets the playerState for a user. PlayerState is the game board state for each user
app.get("/api/games/:game_id/:user_name", function(req,res){
	database.collection("Games").findOne(
		// we just want to retun the document object for a plyer with a username and we want username, playerState, gamewin and the Bingocount
		{"game.users.username": req.params.user_name, "game.gameId":req.params.game_id},
		{projection:{_id: 0, "game.users.playerState.$": 1,"game.users.username":1, "game.users.gameWin":1,"game.users.bingoCount":1}},
		function(err, result) {
		  if (err) throw err;
		  console.log(result);
		  res.send(result);
		}
	  );
});

// this api serves as to  update  the playerState for each player.
app.put("/api/games/:game_id", function(req,res){
	database.collection("Games").findOne(
		// we just want to retun the document object for every plyer with a username and we want username, playerState, gamewin and the Bingocount
		{"game.gameId": req.params.game_id},
		{projection:{_id: 0,"game.users":1,"game.numbers":1}},
		function(err, result) {
		  if (err) throw err;
		  // users holds the data of each user as a list which includes username, their player state and other informations. 
		  
		let users = result.game.users;
		  // this function will find the number in the player state and replace the numbers with 0 for each player; It takes two parameters an array and the number that is being replaced with 0;
		function replace(playerArray,number){
			for(let i = 0; i <5 ; i++){
				for (let j = 0; j< 5; j++){
					if(playerArray[i][j]===number){
						playerArray[i][j] = 0;
					}
				}
			}
			return playerArray;
		}

		// Now we are updating the playeState for each specific player
		users.forEach((val)=> {
			// console.log(val.playerState)
			let updatedPlayerState = replace(val.playerState,req.body.bingoNumber)
			let userNameForPlayers = val.username
			console.log(updatedPlayerState,userNameForPlayers);
			database.collection("Games").updateOne({"game.gameId": req.params.game_id, "game.users.username":userNameForPlayers},{$set: {"game.users.$.playerState":updatedPlayerState}});
		});
		res.send("Successfully updated the player state for the player.")
		let numbersCrossed = result.game.numbers;
		numbersCrossed.push(req.body.bingoNumber);
		database.collection("Games").updateOne({"game.gameId":req.params.game_id}, {$set:{"game.numbers":numbersCrossed}});
		}
	  );

})

app.get('/auth/signup',(req,res)=>{
	res.status(200).send(fs.readFileSync('./pages/auth/signup.html','utf-8'))
})

app.get('/auth/signin',(req,res)=>{
	res.status(200).send(fs.readFileSync('./pages/auth/signin.html','utf-8'))
})

app.get('/game',(req,res) =>{
	res.status(200).send(fs.readFileSync('./public/Main/Game.html','utf-8'))
});

//this api gets the users a randomly created 5*5 matrix which will be used to fill the userBoard and also set up in the user's Database
app.get('/game/getNumbers',function(req,res){
	var numbers = [];
	do{
	   let num = Math.floor(Math.random() * 25 +1);
	   if(!(numbers.includes(num))){
		   numbers.push(num);
	   }
	} while((numbers.length !==25));

	res.send(numbers)
});

// create game
app.post('/api/hostGame', (req, res) => {
	const email = req.cookies.email;
	const gameDocument = {
	  "game": {
		"gameId": req.body.gameId,
		"numbers": [],
		"users": [
		  {
			"username": email,
			"playerState": [
			  [0, 0, 0, 0, 0],
			  [0, 0, 0, 0, 0],
			  [0, 0, 0, 0, 0],
			  [0, 0, 0, 0, 0],
			  [0, 0, 0, 0, 0]
			],
			"gameWin": false,
			"bingocount": 0
		  }
		]
	  }
	};
  
	database.collection("Games").findOne({ "game.gameId": req.body.gameId }, function (err, result) {
		if (err) throw err;
		if (result) {
			res.status(201).json({message:'exists', redirect: '/joinHostGame'});
		}
		else {
		  database.collection("Games").insertOne(gameDocument, function (err, result) {
			if (err) throw err;
			res.status(201).json({message:'notexists', redirect: '/game'});

		  });
		}
	  });
	});
	
	// join game
	app.post('/api/joinGame', (req, res) => {
		const email = req.cookies.email;
		const gameCode = req.body.gameID;
		const username = email;
			if (err) res.send(err);
			res.send("res entered")
			const games = database.collection('Games');
			
			games.findOne({gameId: gameCode}, (err, game) => {
			if (err) throw err;
			if (game.length==0) {
				res.status(404).send('Game not found');
			} else {
				const newUser = {
				username: username,
				playerState: [
					[0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0]
				],
				gameWin: false,
				bingocount: 0
				};
				game.users.push(newUser);
				games.replaceOne({gameId: gameCode}, game, (err, result) => {
				if (err) throw err;
				res.status(201).json({message:'Successfully joined the game', redirect: '/game'})
				});
			}
			});
		
		});




		app.get('/api/games',(req,res)=>{
			// get the game history
			})
			
				
			app.get('/api/games/gameid',(req,res)=>{
				// current status of the game
				})

		// app.post('/api/games',(req,res)=>{
		// 	// create game
		// 	let gameDocument =  {
		// 		"game" : {
		// 			"gameId":  req.body.gameId,
		// 			"numbers":[],
		// 			"users"🙁
		// 				{   
		// 					"username" : req.body.username,
		// 					"playerState" : [   
		// 						[0,0,0,0,0],
		// 						[0,0,0,0,0],
		// 						[0,0,0,0,0],
		// 						[0,0,0,0,0],
		// 						[0,0,0,0,0]
		// 						],
		// 						"gameWin" : false,
		// 						"bingocount" : 0
		// 				}
		// 			]
		// 		}
		// 	}
		// 	database.collection("Games").findOne({"game.gameId": req.body.gameId}).toArray(function(result){
		// 		if (result.length ===1 ){
		// 			res.send(alert("Please Enter a different Game ID"));
		// 		}
		// 		else {
		// 			database.collection("Games").insertOne(gamedocument);
		// 		}
		// 	})
		// 	console.log(req.body.gameId,req.body.username );
		// })
	
	// app.put('/api/games/gameid',(req,res)=>{
	
	// })






/* API routes */


	// 	const db = client.db("BingoGame");
	// 	const collection = db.collection('users');
	
	// 	collection.findOne({ email: user.email }, (err, result) => {
	// 	  if (err) {
	// 		console.log(err);
	// 		client.close();
	// 		return res.status(500).json({ message: 'Failed to query database' });
	// 	  }
	
	// 	  if (result) {
	// 		client.close(); 
	// 		return res.status(409).json({ message: 'Email already exists' });
	// 	  }
	
	// 	  collection.insertOne(user, (err, result) => {
	// 		client.close();
	// 		if (err) {
	// 		  console.log(err);
	// 		  return res.status(500).json({ message: 'Failed to insert user into database' });
	// 		}
	
	// 		res.status(201).json({ message: 'User created' });
	// 	  });
	// 	});
	//   });

	
	




// Bikash signup api
// app.post('/api/auth/signup',(req,res)=>{
// 	const databaseName = "BingoGame";
// 	const collectionName = "users";
// 	if((find(db,databaseName,collectionName,{username:req.body.email},{email:1}) >0 )) {
// 		console.log("User Exists!")
// 		res.status(406).json({message:'User already exists'});
// 	}
// 	else {
// 		req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'');
// 		insert(db,databaseName,collectionName, req.body);
// 		res.sendFile(__dirname + "/public/FrontEnd/html/login.html");
// 		res.status(201).json({message:'User created'})
		
// 	}
// })






// async function checkUser(token){
// 	let result=await database.collection('users').find({jwt:token},{_id:1}).toArray();
// 	if(result.length>0){
// 		console.log(result[0]._id.toString().replace('New ObjectId("','').replace('")',''))
// 		return result[0]._id.toString().replace('New ObjectId("','').replace('")','')
// 	}
// 	return null
// }


// app.post('/api/auth/signin',(req,res)=>{
// 	database.collection('users').find({email:req.body.email},{_id:1,email:1,password:1}).toArray(function(err, result){
// 		console.log(result)
// 		if (err) throw err
// 		if(result.length==0) res.status(406).json({message:'User is not registered'})
// 		else{
// 			if(result[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) return res.status(406).json({message:'Wrong password'})
// 			else{
// 				userId=result[0]._id.toString().replace('New ObjectId("','').replace('")','')
// 				console.log(userId)
// 				let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration})
// 				database.collection('users').updateOne({_id:ObjectId(userId)},{$set:{jwt:token}},function(err,result){
// 					if (err) throw err
// 					res.status(200).setHeader('Authorization', `Bearer ${token}`).json({message:'User authenticated'})
// 				})
// 			}
// 		}
// 	})
// })

app.get('/',(req,res)=>{
  res.send('index.html');
})
// app.get('/users/:user/userhistory', (res,req)=> {
//   // replace the tab witht he user history
//   res.send("User History")
// })

// // this gets the playerState for each player
// app.get('/games/users/:user/playerState',(res,req)=>{
//   database.collection("Games").find({email:req.body.email},{projection: {palyerState: 1, _id:0}}.toArray((err, result)=> {
//     if (err) throw err;
//     res.send(result);
//   }))
// })
// app.get('/api/auth/signout',(req,res)=>{
// 	res.json(req.body)
// 	res.sendFile(__dirname + "/public/FrontEnd/html/login.html");
// })
// app.get('/api/request',(req,res)=>{
// 	res.json(req.body)
// })

// app.get('/api/data',async (req,res)=>{
// 	let userId = await checkUser(req.cookies['jwt'])
// 	console.log(userId)
// 	res.json({userId:userId})
// })



