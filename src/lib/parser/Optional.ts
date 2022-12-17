import { PStream } from '../pstream/PStream';
import { ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class Optional extends ProxyParser {
  parse(x: ParserContext, ps: PStream): PStream | null {
    return super.parse(x, ps) || ps.setValue(null);
  }
}
