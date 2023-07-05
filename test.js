const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://abhishekshrestha5125:10f67hk4AbIdpxfp@clustor1a.mrjuys9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(function(err,db){
	if(err) throw err
	console.log('Connected to database')

	const database=db.db('BingoGame')
	database.collection('users').insertOne({firstname:'John',lastname:'Doe'},function(err,result){
		if (err) throw err
		console.log(result)
	})
	database.collection('users').find({}).toArray(function(err, result){
		if (err) throw err
		console.log(result)
		db.close()
	})
})