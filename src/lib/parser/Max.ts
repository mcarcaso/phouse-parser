import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class Max extends ProxyParser {
  max: number;
  constructor(max: number, delegate: Parser) {
    super(delegate);
    this.max = max;
  }
  parse(x: ParserContext, ops: PStream): PStream | null {
    const ps = super.parse(x, ops);
    if (!ps) return null;
    if (ps.pos() - ops.pos() > this.max) return null;
    return ps;
  }
}
