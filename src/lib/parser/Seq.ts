import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Seq implements Parser {
  parsers: Parser[];
  constructor(parsers: Parser[]) {
    this.parsers = parsers;
  }
  parse(x: ParserContext, ops: PStream): PStream | null {
    const ret: unknown[] = [];
    let ps: PStream | null = ops;
    for (const parser of this.parsers) {
      ps = parser.parse(x, ps);
      if (!ps) return null;
      ret.push(ps.value());
    }
    return ps.setValue(ret);
  }
}
