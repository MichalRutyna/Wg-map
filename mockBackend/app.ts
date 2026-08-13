import express, { type Express, type Request, type Response, type NextFunction } from 'express';

const app: Express = express();
const port = 3000;

const logger = function (req: Request, res: Response, next: NextFunction) {
    console.log(`requested ${req.url} with method ${req.method} and body ${JSON.stringify(req.body)}`);
    res.on('finish', () => {
        console.log(`responded with ${res.statusCode} (${res.statusMessage})`);
    });
    next();
};


app.use(logger);
app.use('/api', express.static('public'));

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});