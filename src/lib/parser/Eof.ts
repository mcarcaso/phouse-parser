import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class Eof implements Parser {
  parse(x: ParserContext, ps: PStream): PStream | null {
    return ps.valid() ? ps : null;
  }
}
