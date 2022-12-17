import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Seq implements Parser {
  parsers: Parser[];
  indexes: number[];
  constructor(parsers: Parser[], indexes: number[]) {
    this.parsers = parsers;
    this.indexes = indexes;
  }
  parse(x: ParserContext, ops: PStream): PStream | null {
    const values: unknown[] = [];
    let ps: PStream | null = ops;
    for (let i = 0; i < this.parsers.length; i++) {
      const parser = this.parsers[i];
      ps = parser.parse(x, ps);
      if (!ps) return null;
      if (this.indexes.includes(i)) values.push(ps.value());
    }
    return ps.setValue(values);
  }
}
