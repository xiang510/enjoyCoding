// import urlParse from 'url-parse';
import *  as appController from '../controller'

const appRouter = async (ctx: any, next: any) => {
    const { request, response } = ctx;
    const { path } = request;

    if (!!path.length) {
        if (path === '/') {
            await appController.index(ctx, next);

        } else if (path === '/init') {
            await appController.init(ctx, next);

        } else {
            next();
        }
    }

}





export default appRouter