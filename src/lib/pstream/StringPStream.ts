import { PStream } from './PStream';

export type StringPStreamArgs = {
  str: string;
  pos: number;
  value: unknown;
};

export class StringPStream<Value> implements PStream {
  private args: StringPStreamArgs;
  constructor(args: StringPStreamArgs) {
    this.args = args;
  }
  pos(): number {
    return this.args.pos;
  }
  head(): string {
    return this.args.str[this.pos()];
  }
  valid(): boolean {
    return this.pos() < this.args.str.length;
  }
  private tail_: PStream | null = null;
  tail(): PStream {
    if (!this.tail_) {
      this.tail_ = new StringPStream<Value>({
        pos: this.pos() + 1,
        str: this.args.str,
        value: this.args.value,
      });
    }
    return this.tail_;
  }
  substring(end: PStream): string {
    return this.args.str.substring(this.pos(), end.pos());
  }
  value(): unknown {
    return this.args.value;
  }
  setValue(o: Value): PStream {
    return new StringPStream({ ...this.args, value: o });
  }
}
