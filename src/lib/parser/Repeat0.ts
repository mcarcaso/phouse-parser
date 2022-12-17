import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

type Args = { delim?: Parser; min?: number; max?: number };
export class Repeat0 extends ProxyParser {
  delim?: Parser;
  min: number;
  max: number;
  constructor(delegate: Parser, args: Args) {
    super(delegate);
    this.delim = args.delim;
    this.max = args.max ?? Number.MAX_SAFE_INTEGER;
    this.min = args.min ?? -1;
  }
  parse(x: ParserContext, ps: PStream): PStream | null {
    let first = true;
    let result: PStream | null = null;
    let i = 0;
    while (ps.valid() && i < this.max) {
      if (this.delim && !first) {
        result = this.delim.parse(x, ps);
        if (result == null) break;
        ps = result;
      }
      result = super.parse(x, ps);
      if (!result) break;
      ps = result;
      first = false;
      i++;
    }
    if (i < this.min) return null;
    return ps;
  }
}
