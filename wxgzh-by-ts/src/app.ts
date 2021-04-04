import Koa from 'koa';
import appRouter from './route';
import xmlParse from 'koa-xml-body';
import bodyParser  from 'koa-bodyparser';
const app = new Koa();

app.use(xmlParse());
app.use(bodyParser());

// app.use(xmlBodyParser);
app.use(appRouter)

export default app;

