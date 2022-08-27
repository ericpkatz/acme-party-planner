const { Item, conn } = require('./db');
const express = require('express');
const app = express();
const path = require('path');

app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));
app.use(express.json());

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/items', async(req, res, next)=> {
  try {
    res.send(await Item.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/items', async(req, res, next)=> {
  try {
    res.send(await Item.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/items/:id', async(req, res, next)=> {
  try {
    const item = await Item.findByPk(req.params.id);
    res.send(await item.update(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/items/:id', async(req, res, next)=> {
  try {
    const item = await Item.findByPk(req.params.id);
    await item.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

const setup = async()=> {
  try {
    console.log('starting');
    await conn.sync({ force: true });
    await Promise.all([
      Item.create({ name: 'cake'}),
      Item.create({ name: 'pin the tail on the donkey', purchased: true}),
      Item.create({ name: 'disco ball', purchased: true}),
    ]);
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

setup();
