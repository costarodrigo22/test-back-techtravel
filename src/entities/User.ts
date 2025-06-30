import { randomUUID } from 'node:crypto';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export class User {
  public id: string;
  public name: string;
  public email: string;
  public password: string;
  public gender: UserGender;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    name: string,
    email: string,
    password: string,
    gender: UserGender
  ) {
    this.id = randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.gender = gender;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
} 