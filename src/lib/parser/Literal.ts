import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

interface LiteralArgs {
  str: string;
  value?: unknown;
}
export class Literal implements Parser {
  args: LiteralArgs;
  constructor(args: LiteralArgs) {
    this.args = args;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    for (let i = 0; i < this.args.str.length; i++) {
      if (!ps.valid()) return null;
      if (ps.head() !== this.args.str.charAt(i)) return null;
      ps = ps.tail();
    }
    return ps.setValue(this.args.value || this.args.str);
  }
}
