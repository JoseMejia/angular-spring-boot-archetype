import { NotificationService } from './notification-service';
import {Subscription} from 'rxjs';

describe('NotificationService', () => {
  let service: NotificationService;
  let emissions: (string | Error | undefined)[];
  let subscription: Subscription;

  beforeEach(() => {
    service = new NotificationService();
    emissions = [];
    subscription = service.getNotifications().subscribe(v => emissions.push(v));
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('has undefined as the initial emission', () => {
    expect(emissions.length).toBeGreaterThan(0);
    expect(emissions[0]).toBeUndefined();
  });

  it('emits string messages when notify is called', () => {
    service.notify('hello world');
    expect(emissions[emissions.length - 1]).toBe('hello world');
  });

  it('emits Error instances when notify is called with an Error', () => {
    const err = new Error('boom');
    service.notify(err);
    expect(emissions[emissions.length - 1]).toBe(err);
  });

  it('emits undefined when clear is called', () => {
    service.notify('temp');
    service.clear();
    expect(emissions[emissions.length - 1]).toBeUndefined();
  });
});

