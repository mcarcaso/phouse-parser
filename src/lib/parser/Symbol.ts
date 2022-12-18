import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Symbol implements Parser {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    const m = x.get('grammarMap') as Map<string, Parser>;
    const p = m?.get(this.name);
    if (!p) return null;
    return p.parse(x, ps);
  }
}
