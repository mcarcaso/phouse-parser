import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class ParserWithAction extends ProxyParser {
  action: (x: ParserContext, ps: PStream) => unknown;
  constructor(
    delegate: Parser,
    action: (x: ParserContext, ps: PStream) => unknown
  ) {
    super(delegate);
    this.action = action;
  }
  parse(x: ParserContext, ops: PStream): PStream | null {
    const ps = super.parse(x, ops);
    if (!ps) return null;
    return ps.setValue(this.action(x, ps));
  }
}
