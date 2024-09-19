export interface JwtPayload {
    sub: number;   // 'sub' is a standard claim in JWT, often representing the user's ID
    email: string; // Email is another common claim
    roles: string[];  // Roles will be used to protect routes
  }
  