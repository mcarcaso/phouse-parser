import { PStream } from '../pstream/PStream';

export class ParserContext {
  private map: Map<string, unknown> = new Map();
  private parent?: ParserContext;
  constructor(parent?: ParserContext) {
    this.parent = parent;
  }
  get(key: string): unknown {
    return this.map.get(key) || this.parent?.get(key);
  }
  set(key: string, value: unknown) {
    this.map.set(key, value);
  }
  pxSubContext() {
    return new ParserContext(this);
  }
}

export interface Parser {
  parse(x: ParserContext, ps: PStream): PStream | null;
}
