export interface IContainer {
  register<T>(token: string, implementation: new (...args: any[]) => T): void;
  resolve<T>(token: string): T;
  has(token: string): boolean;
} 