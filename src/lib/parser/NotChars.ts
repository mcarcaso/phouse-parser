import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

export class NotChars implements Parser {
  private chars: string;
  constructor(chars: string) {
    this.chars = chars;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    if (!ps.valid) return null;
    if (this.chars.indexOf(ps.head()) !== -1) return null;
    return ps.tail().setValue(ps.head());
  }
}
