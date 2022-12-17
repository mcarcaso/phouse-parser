import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';

type Args = { from: string; to: string };
export class Range implements Parser {
  args: Args;
  constructor(args: Args) {
    this.args = args;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    if (!ps.valid()) return null;
    if (ps.head() < this.args.from) return null;
    if (ps.head() > this.args.to) return null;
    return ps.tail().setValue(ps.head());
  }
}
