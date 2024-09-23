export interface JwtPayload {
  sub: number;
  email: string;
  roles: string[]; // Roles will be used to protect routes
}
