import { PStream } from '../pstream/PStream';
import { ParserContext } from './Parser';
import { ProxyParser } from './ProxyParser';

export class Join extends ProxyParser {
  parse(x: ParserContext, ops: PStream): PStream | null {
    const ps = super.parse(x, ops);
    if (!ps) return null;
    return ps.setValue((ps.value() as string[]).join(''));
  }
}
