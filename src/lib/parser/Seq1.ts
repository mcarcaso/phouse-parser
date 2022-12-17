import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Seq1 implements Parser {
  parsers: Parser[];
  index: number;
  constructor(parsers: Parser[], index: number) {
    this.parsers = parsers;
    this.index = index;
  }
  parse(x: ParserContext, ops: PStream): PStream | null {
    let ret: unknown;
    let ps: PStream | null = ops;
    for (let i = 0; i < this.parsers.length; i++) {
      const parser = this.parsers[i];
      ps = parser.parse(x, ps);
      if (!ps) return null;
      if (i === this.index) ret = ps.value();
    }
    return ps.setValue(ret);
  }
}
