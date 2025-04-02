export enum UserRole {
    ADMIN = 'ADMIN',
    EDITOR = 'EDITOR',
    VIEWER = 'VIEWER'
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    profileImageUrl?: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterUserData {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }