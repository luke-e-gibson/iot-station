import express from 'express'; 
import fs from 'fs'; 
import path from 'path';

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
                this.initializeLogFile();
                this.fileLoggingEnabled = true;
            }
        }
    }

    private initializeLogFile(): void {
        if (!this.filePath) return;

        try {
            const dirPath = path.dirname(this.filePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            this.fileStream = fs.createWriteStream(this.filePath, { flags: 'a' });
            this.fileStream.on('error', (error) => {
                console.error(`Logger file stream error at ${this.filePath}:`, error);
                this.fileLoggingEnabled = false;
                this.fileStream = undefined;
            });
        } catch (error) {
            console.error(`Failed to initialize log file at ${this.filePath}:`, error);
            this.fileLoggingEnabled = false;
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
