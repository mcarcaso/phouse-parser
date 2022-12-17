import { PStream } from '../pstream/PStream';
import { Parser, ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

type Args = { delim?: Parser; min?: number; max?: number };
export class Repeat extends ProxyParser {
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
    const values: unknown[] = [];
    let result: PStream | null = null;
    let i = 0;
    while (ps.valid() && i < this.max) {
      if (this.delim && values.length) {
        result = this.delim.parse(x, ps);
        if (result == null) break;
        ps = result;
      }
      result = super.parse(x, ps);
      if (!result) break;
      values.push(result.value());
      ps = result;
      i++;
    }
    if (values.length < this.min) return null;
    return ps.setValue(values);
  }
}
