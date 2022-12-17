import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Alt implements Parser {
  private parsers: Parser[];
  constructor(parsers: Parser[]) {
    this.parsers = parsers;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    for (const parser of this.parsers) {
      const o = parser.parse(x, ps);
      if (o) return o;
    }
    return null;
  }
}
