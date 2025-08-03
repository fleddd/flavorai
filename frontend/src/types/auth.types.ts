
export interface AuthForm {
    email: string;
    password: string;
}

export interface AuthFormResponse {
    email: string;
    password: string;
    createdAt: string
}

export interface AuthFormErrorResponse {
    error: string
    message: string
    statusCode: number
}

export interface AuthFailedResponse {
    error: string;
    message: string;
    statusCode: number;
}