export class ServerContext {
    public static instance: ServerContext
    private services: Map<Function, any> = new Map()


    private constructor() {
        // Initialize context properties here
    }

    public GetService<T>(ServiceClass: new () => T): T {
        if (this.services.has(ServiceClass)) {
            return this.services.get(ServiceClass)
        }
        const service = new ServiceClass()
        this.services.set(ServiceClass, service)
        return service
    }

    public static getInstance(): ServerContext {
        if (!ServerContext.instance) {
            ServerContext.instance = new ServerContext()
        } 
        return ServerContext.instance
    }
}