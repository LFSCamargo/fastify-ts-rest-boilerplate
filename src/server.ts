import * as fastify from 'fastify';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { MONGO_URI, KEY } from './config';
import userMethods from './modules/user/userMethods';

const server = fastify();

server.get('/', (req, res) => {
  res.send('Welcome to the Typescript Boilerplate')
});

server.post('/api/addUser', async (req, res) => {
  const { body } = req;

  const user = await userMethods.addUser({ ...body });

  const response = JSON.stringify({
    user,
  });

  res.send(response);
});

server.post('/api/users', async (req, res) => {
  const { body } = req;

  const user = await userMethods.addUser({ ...body });

  const response = JSON.stringify({
    user,
  });

  res.send(response);
});

server.post('/api/login', async (req, res) => {
  const { body } = req;

  const token = userMethods.login({ ...body });

  const response = JSON.stringify({
    token
  });

  res.send(response);
})

server.get('/api/me', async (req, res) => {
  const { headers } = req;
  const { Authorization } = headers;

  const token: any = jwt.verify(Authorization.substring(4), KEY);

  const user = userMethods.user(token.id);

  const response = JSON.stringify({
    user,
  });
  
  res.send(response);
});

mongoose.connect(MONGO_URI, {}, err => {
  if (err) {
    console.log('❌ Error: ', err);
    process.exit(1)
  }
  console.log('⚡️ Connnected to mongodb ⚡️');
  server.listen(3000, err => {
    if (err) {
      console.log('❌ Error: ', err);
      process.exit(1)
    }
    console.log('👾 Server Started on port - 3000 👾');
  })
})