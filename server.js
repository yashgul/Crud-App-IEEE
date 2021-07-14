const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();




var a;


//connecting to mongo
MongoClient.connect('mongodb+srv://username:idcffs@cluster0.aybfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', (err, database) => {
  if (err) return console.log(err)
  db = database.db('star-wars-quotes')//created database before i knew we can't change it




  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static('public'))


//taking user input and finding which recorde to delete
app.post('/delete', (req, res) => {
  var ItemToDelete = req.body.titledelete;
  myquery = { title: ItemToDelete}

  db.collection('delete').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')

  })

  db.collection("quotes").deleteOne(myquery, function (err, obj) {
    if (err) return console.log(err)
    res.redirect('/')


  })

})






//taking user input from modal and updating attributes of given record
app.post('/update', (req, res) => {

  db.collection('update').save(req.body, (err, result) => {

    if (err) return console.log(err)
    console.log('saved to database')

  })

//updating them
  db.collection('quotes').findOneAndUpdate({ title: req.body.titleorig },
    {
      $set: {
        rating: req.body.ratingupdate,
        genre: req.body.genreupdate,
        title: req.body.titleupdate,
        user: req.body.userupdate,
        reccomend: req.body.reccomendupdate


      }
    },
    {

    })


  res.redirect('/')

    .then(result => {
      console.log(result)
    })
    .catch(error => console.error(error))
})







//sort functionality, a is the record to be sorted by
app.post('/filter', (req, res) => {

  if (req.body.filterorder == "Rating")
    a = "rating"

  if (req.body.filterorder == "Title")
    a = "title"

  if (req.body.filterorder == "User")
    a = "user"

  if (req.body.filterorder == "Genre")
    a = "genre"

  db.collection('filter').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')

    console.log("filtered according to"+a)

  })




  res.redirect('/')
})

//GET for ejs
app.get('/', (req, res) => {
  
  if (a != "rating") {
    db.collection('quotes').find().sort({ [a]: 1 }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', { quotes: result })
    })
  }

  else {
    db.collection('quotes').find().sort({ rating: -1 }).collation({ locale: "en_US", numericOrdering: true }).limit(1000).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.ejs', { quotes: result })
    })


  }


})



//to create new records
app.post('/quotes', (req, res) => {

  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

