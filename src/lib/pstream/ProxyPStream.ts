import { PStream } from './PStream';

export class ProxyPStream implements PStream {
  delegate: PStream;
  constructor(delegate: PStream) {
    this.delegate = delegate;
  }
  pos(): number {
    return this.delegate.pos();
  }
  head(): string {
    return this.delegate.head();
  }
  valid(): boolean {
    return this.delegate.valid();
  }
  tail(): PStream {
    return this.delegate.tail();
  }
  substring(end: PStream): string {
    return this.delegate.substring(end);
  }
  value(): unknown {
    return this.delegate.value();
  }
  setValue(o: unknown): PStream {
    return this.delegate.setValue(o);
  }
}
