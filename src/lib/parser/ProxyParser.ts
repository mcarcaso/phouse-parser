import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class ProxyParser implements Parser {
  delegate: Parser;
  constructor(delegate: Parser) {
    this.delegate = delegate;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    return this.delegate.parse(x, ps);
  }
}
