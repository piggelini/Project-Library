import express from 'express';
const port = 3000;
const app = express();

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());


import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient('mongodb://localhost:27017');
await client.connect();

const db = client.db('library');
const booksCollection = db.collection('books');

app.get('/books', async (req, res) => {
    const books = await booksCollection.find({}).toArray();
    res.render('books', { books });
});


app.get('/book/:id', async (req, res) => {
    const book = await booksCollection.findOne({ _id: ObjectId(req.params.id) });
    res.render('book', {
        title: book.title,
        author: book.author,
        year: book.year,
        description: book.description
    });
});

app.get('/books/create', (req, res) => {
    res.render('create');
});

app.post('/books/create', async (req, res) => {
    await booksCollection.insertOne(req.body);
    res.redirect('/books');
});



app.listen(port, () => console.log(`Listening on ${port}`));