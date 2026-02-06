import express from 'express'; 
import fs from 'fs'; 

export class Logger {
    private _name: string;
    private fileStream?: fs.WriteStream;
    private filePath?: string;
    private fileLoggingEnabled: boolean = false;
    
    constructor(name: string = "Root", loggerConfig?: { output: Array<'console' | 'file'>, file?: { path: string } }) {
        this._name = name;
        if(loggerConfig) {
            if(loggerConfig.output.includes("file") && loggerConfig.file) {
                this.filePath = loggerConfig.file.path;
                this.fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
                this.fileLoggingEnabled = true;
            }
        }
    }

    public createSublogger(name: string): Logger {
        return new Logger(`${this._name}:${name}`);
    }

    public log(message: string, ...args: any[]) {
        if(this.fileLoggingEnabled && this.fileStream) {
            const logEntry = `[${new Date().toISOString()}] [${this._name}] ${message} ${args.map(arg => JSON.stringify(arg)).join(' ')}\n`;
            this.fileStream.write(logEntry);
        }
        console.log(`[${this._name}] ${message}`, ...args);
    }

    public error(message: string, ...args: any[]) {
        if(this.fileLoggingEnabled && this.fileStream) {
            const logEntry = `[${new Date().toISOString()}] [${this._name}] ${message} ${args.map(arg => JSON.stringify(arg)).join(' ')}\n`;
            this.fileStream.write(logEntry);
        }
        console.error(`[${this._name}] ${message}`, ...args);
    }

    public createHttpLogger(): HttpLogger {
        return new HttpLogger(this._name, { output: this.fileLoggingEnabled ? ["console", "file"] : ["console"], file: this.fileLoggingEnabled ? { path: this.filePath! } : undefined });
    }

}

export class HttpLogger extends Logger { 
    constructor(name: string = "Http", loggerConfig?: { output: Array<'console' | 'file'>, file?: { path: string } }) {
        super(name, loggerConfig);
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