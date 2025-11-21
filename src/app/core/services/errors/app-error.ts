export class AppError extends Error {
    constructor(
        public code : string,
        public details?: any,
       ) {
        super(code);
    }
}
