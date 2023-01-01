import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class Flat extends ProxyParser {
  depth?: number;
  constructor(delegate: Parser, depth?: number) {
    super(delegate);
    this.depth = depth;
  }
  parse(x: ParserContext, ops: PStream): PStream | null {
    const ps = super.parse(x, ops);
    if (!ps) return null;
    return ps.setValue((ps.value() as unknown[]).flat(this.depth));
  }
}
