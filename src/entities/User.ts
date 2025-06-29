import { randomUUID } from 'node:crypto';

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN'
}

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export class User {
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    public name: string,
    public email: string,
    public password: string,
    public gender: UserGender,
    public role: UserRole = UserRole.EMPLOYEE,
    public department?: string,
    public employeeId?: string
  ) {
    this.id = randomUUID();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
} 