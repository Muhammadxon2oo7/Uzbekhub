export interface RegisterStep1Response {
    message?: string;
    error?: string;
  }
  
  export interface VerifyEmailResponse {
    message?: string;
    error?: string;
  }
  
  export interface LoginResponse {
    token: { access: string };
    user: { id: string; email: string; first_name?: string; last_name?: string; username?: string };
    error?: string;
  }
  
  export interface ProfileResponse {
    email: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    error?: string;
  }


 