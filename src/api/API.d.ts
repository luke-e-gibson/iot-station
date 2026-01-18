export interface APIResponse<T> {
    errorMessage: string | null
    httpCode: number | null,
    data: T | null,
}