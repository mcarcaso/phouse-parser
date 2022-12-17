import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Symbol implements Parser {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    const m = x.get('grammarMap') as Map<string, unknown>;
    if (!m?.has(this.name)) return null;
    const p = m.get(this.name) as Parser;
    return p.parse(x, ps);
  }
}
