import * as fastify from 'fastify';
import * as mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { MONGO_URI, KEY } from './config';
import userMethods from './modules/user/userMethods';

const server = fastify();

server.get('/', (req, res) => {
  res.send('Welcome to the Typescript Boilerplate')
});

server.post('/api/signup', async (req, res) => {
  const { body } = req;

  const token = await userMethods.addUser({ ...body });

  res.send({
    token
  });
});

server.post('/api/login', async (req, res) => {
  const { body } = req;

  const token = await userMethods.login({ ...body });

  res.send({
    token
  });
})

server.get('/api/me', async (req, res) => {
  const { headers } = req;
  const { authorization } = headers;

  const token: any = jwt.verify(authorization.substring(4), KEY);

  const user = await userMethods.user(token.id);
  
  res.send(user);
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