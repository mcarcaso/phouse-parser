import { Alt } from './lib/parser/Alt';
import { AnyChar } from './lib/parser/AnyChar';
import { Chars } from './lib/parser/Chars';
import { Eof } from './lib/parser/EOF';
import { Join } from './lib/parser/Join';
import { Literal } from './lib/parser/Literal';
import { LiteralIgnoreCase } from './lib/parser/LiteralIgnoreCase';
import { Not } from './lib/parser/Not';
import { NotChars } from './lib/parser/NotChars';
import { Optional } from './lib/parser/Optional';
import { Parser, ParserContext } from './lib/parser/Parser';
import { Range } from './lib/parser/Range';
import { Repeat, RepeatArgs } from './lib/parser/Repeat';
import { Repeat0, Repeat0Args } from './lib/parser/Repeat0';
import { Seq } from './lib/parser/Seq';
import { Seq0 } from './lib/parser/Seq0';
import { Seq1 } from './lib/parser/Seq1';
import { Substring } from './lib/parser/Substring';
import { Symbol } from './lib/parser/Symbol';
import { StringPStream } from './lib/pstream/StringPStream';

export const seq = (parsers: Parser[]) => new Seq(parsers);
export const repeat0 = (delegate: Parser, o: Repeat0Args) =>
  new Repeat0(delegate, o);
export const alt = (parsers: Parser[]) => new Alt(parsers);
export const sym = (name: string) => new Symbol(name);
export const seq1 = (i: number, parsers: Parser[]) => new Seq1(parsers, i);
export const seq0 = (parsers: Parser[]) => new Seq0(parsers);
export const repeat = (delegate: Parser, args: RepeatArgs) =>
  new Repeat(delegate, args);
export const join = (delegate: Parser) => new Join(delegate);
//until
//plus
//str
export const substring = (p: Parser) => new Substring(p);
export const range = (from: string, to: string) => new Range({ from, to });
export const notChars = (s: string) => new NotChars(s);
export const chars = (s: string) => new Chars(s);
export const not = (p: Parser, e?: Parser) =>
  new Not({ delegate: p, elseParser: e });
export const optional = (p: Parser) => new Optional(p);
export const literal = (str: string, value?: unknown) =>
  new Literal({ str, value });
export const literalIc = (str: string, value?: unknown) =>
  new LiteralIgnoreCase({ str, value });
export const eof = () => new Eof();
export const anyChar = () => new AnyChar();

export const parse = (p: Parser, str: string, x?: ParserContext) => {
  return p.parse(
    x || new ParserContext(),
    new StringPStream({ pos: 0, str, value: null })
  );
};
