export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export interface JwtPayload {
  sub: string; // user.id
  email: string;
  iat?: number;
  exp?: number;
}
