export interface IQueueGateway {
  publishMessage: (message: Record<string, unknown>) => Promise<void>;
}
