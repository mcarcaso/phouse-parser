import { PStream } from '../pstream/PStream';
import { ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class Until extends ProxyParser {
  parse(x: ParserContext, ops: PStream): PStream | null {
    const ret = [];
    let ps = ops;
    while (ps.valid()) {
      const res = super.parse(x, ps);
      if (res) return res.setValue(ret);
      ret.push(ps.head());
      ps = ps.tail();
    }
    return null;
  }
}
