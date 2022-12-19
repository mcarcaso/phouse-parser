import { Alt } from './lib/parser/Alt';
import { AnyChar } from './lib/parser/AnyChar';
import { Chars } from './lib/parser/Chars';
import { Eof } from './lib/parser/Eof';
import { Join } from './lib/parser/Join';
import { Literal } from './lib/parser/Literal';
import { LiteralIgnoreCase } from './lib/parser/LiteralIgnoreCase';
import { Not } from './lib/parser/Not';
import { NotChars } from './lib/parser/NotChars';
import { Optional } from './lib/parser/Optional';
import { Parser, ParserContext } from './lib/parser/Parser';
import { Range } from './lib/parser/Range';
import { Repeat } from './lib/parser/Repeat';
import { Repeat0, Repeat0Args } from './lib/parser/Repeat0';
import { Seq } from './lib/parser/Seq';
import { Seq0 } from './lib/parser/Seq0';
import { Seq1 } from './lib/parser/Seq1';
import { Substring } from './lib/parser/Substring';
import { Symbol } from './lib/parser/Symbol';
import { Until } from './lib/parser/Until';
import { StringPStream } from './lib/pstream/StringPStream';

type ParserIsh = Parser | string;
const toParser = (p: ParserIsh) =>
  typeof p === 'string' ? new Literal({ str: p }) : p;

export const seq = (parsers: ParserIsh[]) => new Seq(parsers.map(toParser));
export const repeat0 = (delegate: ParserIsh, o: Repeat0Args) =>
  new Repeat0(toParser(delegate), o);
export const alt = (parsers: ParserIsh[]) => new Alt(parsers.map(toParser));
export const sym = (name: string) => new Symbol(name);
export const seq1 = (i: number, parsers: ParserIsh[]) =>
  new Seq1(parsers.map(toParser), i);
export const seq0 = (parsers: ParserIsh[]) => new Seq0(parsers.map(toParser));
export const repeat = (
  delegate: ParserIsh,
  delim?: ParserIsh,
  min?: number,
  max?: number
) =>
  new Repeat(toParser(delegate), {
    delim: delim ? toParser(delim) : undefined,
    min,
    max,
  });
export const plus = (p: ParserIsh, delim?: ParserIsh) => repeat(p, delim, 1);
export const join = (delegate: ParserIsh) => new Join(toParser(delegate));
export const until = (p: ParserIsh) => new Until(toParser(p));
export const substring = (p: ParserIsh) => new Substring(toParser(p));
export const range = (from: string, to: string) => new Range({ from, to });
export const notChars = (s: string) => new NotChars(s);
export const chars = (s: string) => new Chars(s);
export const not = (p: ParserIsh, e?: ParserIsh) =>
  new Not({ delegate: toParser(p), elseParser: e ? toParser(e) : undefined });
export const optional = (p: ParserIsh) => new Optional(toParser(p));
export const literal = (str: string, value?: unknown) =>
  new Literal({ str, value });
export const literalIc = (str: string, value?: unknown) =>
  new LiteralIgnoreCase({ str, value });
export const eof = () => new Eof();
export const anyChar = () => new AnyChar();

export const parse = (p: ParserIsh, str: string, x?: ParserContext) => {
  return toParser(p).parse(
    x || new ParserContext(),
    new StringPStream({ pos: 0, str, value: null })
  );
};

export * from './lib/parser/Alt';
export * from './lib/parser/AnyChar';
export * from './lib/parser/Chars';
export * from './lib/parser/Eof';
export * from './lib/parser/Join';
export * from './lib/parser/Literal';
export * from './lib/parser/LiteralIgnoreCase';
export * from './lib/parser/Not';
export * from './lib/parser/NotChars';
export * from './lib/parser/Optional';
export * from './lib/parser/Parser';
export * from './lib/parser/ParserWithAction';
export * from './lib/parser/ProxyParser';
export * from './lib/parser/Range';
export * from './lib/parser/Repeat';
export * from './lib/parser/Repeat0';
export * from './lib/parser/Seq';
export * from './lib/parser/Seq0';
export * from './lib/parser/Seq1';
export * from './lib/parser/SeqN';
export * from './lib/parser/Substring';
export * from './lib/parser/Symbol';
export * from './lib/parser/Until';
export * from './lib/pstream/ProxyPStream';
export * from './lib/pstream/PStream';
export * from './lib/pstream/StringPStream';
