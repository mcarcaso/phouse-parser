import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

interface LiteralArgs {
  str: string;
  value?: unknown;
}
export class LiteralIgnoreCase implements Parser {
  lcStr: string;
  args: LiteralArgs;
  constructor(args: LiteralArgs) {
    this.args = args;
    this.lcStr = args.str.toLowerCase();
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    for (let i = 0; i < this.lcStr.length; i++) {
      if (!ps.valid()) return null;
      if (ps.head().toLowerCase() !== this.lcStr.charAt(i)) return null;
      ps = ps.tail();
    }
    return ps.setValue(this.args.value || this.args.str);
  }
}
