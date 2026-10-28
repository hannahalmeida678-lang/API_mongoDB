
const express = require('express');
const {MongoClient,ObjectId} = require('mongodb');

//utilizando biblioteca express
const app = express();
app.use(express.json());

//conectando ao cluster
const client = new MongoClient(process.env.MONGO_URI);

//conectando ao banco e a coleção especifica
const produtos = client.db('loja').collection('produtos')

//criando os metodos http
app.post('/produtos',async (req,res)=>{
    const novo_produto = await produtos.insertOne(req.body);
    res.status(201).json(novo_produto); 
})

app.get('/produtos', async (req,res)=> {
    const lista = await produtos.find().toArray();
    res.json(lista);
});

app.get('/produtos/:id', async (req,res)=>{
    const resultado = await produtos.findOne({_id:new ObjectId(req.params.id)});
    res.json(resultado)
});

app.put('/produtos/:id', async (req,res)=>{
    const resultado = await produtos.updateOne({_id: new ObjectId(req.params.id)},{$set:req.body});
    res.json(resultado);
});

app.delete('/produtos/:id', async (req,res)=>{
    const resultado = await produtos.deleteOne({_id:new ObjectId(req.params.id)});
    res.json(resultado);
});

// iniciando servidor
client.connect()
    .then(()=>{
        console.log('Conectado ao MONGODB');
        app.listen(3000, ()=>console.log('API rodando na porta 3000'));

    }) 
    .catch((erro)=>console.log('erro ao conectar', erro.messege))