import { IContainer } from '../interfaces/container/IContainer';

type Constructor<T> = new (...args: any[]) => T;

export class Registry implements IContainer {
  private readonly services: Map<string, Constructor<any>> = new Map();
  private readonly instances: Map<string, any> = new Map();

  register<T>(token: string, implementation: Constructor<T>): void {
    if (this.services.has(token)) {
      throw new Error(`"${token}" is already registered.`);
    }

    this.services.set(token, implementation);
  }

  resolve<T>(token: string): T {
    if (this.instances.has(token)) {
      return this.instances.get(token);
    }

    const implementation = this.services.get(token);
    if (!implementation) {
      throw new Error(`"${token}" is not registered.`);
    }

    const instance = new implementation();
    this.instances.set(token, instance);
    return instance;
  }

  has(token: string): boolean {
    return this.services.has(token);
  }
}
