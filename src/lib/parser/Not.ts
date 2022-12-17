import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class Not extends ProxyParser {
  elseParser?: Parser;
  constructor(o: { delegate: Parser; elseParser?: Parser }) {
    super(o.delegate);
    this.elseParser = o.elseParser;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    if (super.parse(x, ps)) return null;
    return this.elseParser ? this.elseParser.parse(x, ps) : ps;
  }
}
