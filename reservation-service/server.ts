import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import mongoose from 'mongoose';
import {graphqlHTTP} from 'koa-graphql';
import schema from './src/schema/booking';

export const app = new Koa();
const router = new Router();

mongoose.connect('mongodb://localhost:27017/hilton_restaurant', {
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

router.all('/graphql', graphqlHTTP({
  schema,
  graphiql: true, 
}));

app.use(koaBody());
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000,  () => {
  console.log('Server is running on http://localhost:4000');
});
