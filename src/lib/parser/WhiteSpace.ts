import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class WhiteSpace implements Parser {
  parse(x: ParserContext, ps: PStream): PStream | null {
    if (!ps.valid()) return null;
    if (!ps.head().match(/^\s$/)) return null;
    return ps.tail().setValue(ps.head());
  }
}
