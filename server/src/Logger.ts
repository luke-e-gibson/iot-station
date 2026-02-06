import express from 'express';

export class Logger {
    private _name: string;
    
    constructor(name: string = "Root") {
        this._name = name;
    }

    public createSublogger(name: string): Logger {
        return new Logger(`${this._name}:${name}`);
    }

    public log(message: string, ...args: any[]) {
        console.log(`[${this._name}] ${message}`, ...args);
    }

    public error(message: string, ...args: any[]) {
        console.error(`[${this._name}] ${message}`, ...args);
    }

    public createHttpLogger(): HttpLogger {
        return new HttpLogger(this._name);
    }

}

export class HttpLogger extends Logger { 
    constructor(name: string = "Http") {
        super(name);
    }

    public expressMiddleware = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const startTime = Date.now();
        const { method, url } = request;

        response.on('finish', () => {
            const duration = Date.now() - startTime;
            this.log(`${method} ${url} - ${response.statusCode} - ${duration}ms`);
        });

        next();
    }
}