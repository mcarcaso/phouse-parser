import test from 'ava';
import {
  alt,
  anyChar,
  eof,
  flat,
  join,
  max,
  not,
  optional,
  parse,
  plus,
  range,
  repeat,
  seq,
  seq0,
  seq1,
  sym,
  until,
  ws,
} from '..';
import { ParserContext } from './parser/Parser';
import { ParserWithAction } from './parser/ParserWithAction';
import { PStream } from './pstream/PStream';
import { StringPStream } from './pstream/StringPStream';

const markdownSymbols = {
  eol: alt(['\n', eof()]),

  plain: not(sym('eol'), anyChar()),

  text: alt([
    sym('bold'),
    sym('italics'),
    sym('strike_through'),
    sym('code'),
    sym('image'),
    sym('link'),
    sym('plain'),
  ]),

  bold: seq1(1, ['**', plus(not('**', sym('text'))), '**']),
  italics: seq1(1, ['*', plus(not('*', sym('text'))), '*']),
  strike_through: seq1(1, ['~~', plus(not('~~', sym('text'))), '~~']),
  code: seq1(1, ['`', plus(not('`', sym('text'))), '`']),
  image: seq(['![', until(']('), until(')')]),
  link: seq([
    seq1(1, ['[', plus(not(']', sym('text'))), ']']),
    seq1(1, ['(', until(')')]),
  ]),

  text_line: seq1(0, [repeat(sym('text')), sym('eol')]),

  tiny_header: seq1(1, ['#### ', sym('text_line')]),
  small_header: seq1(1, ['### ', sym('text_line')]),
  medium_header: seq1(1, ['## ', sym('text_line')]),
  big_header: seq1(1, ['# ', sym('text_line')]),

  line: alt([
    sym('tiny_header'),
    sym('small_header'),
    sym('medium_header'),
    sym('big_header'),
    sym('text_line'),
  ]),

  block: alt([
    sym('generic_list'),
    sym('numbered_list'),
    sym('quote'),
    sym('table'),
    sym('code_block'),
    sym('line'),
  ]),

  generic_list: plus(
    seq1(1, ['* ', repeat(not(alt([sym('eol'), '* ']), sym('line')))])
  ),

  numbered_list_symbol: seq([plus(range('0', '9')), '. ']),
  numbered_list: plus(
    seq1(1, [
      sym('numbered_list_symbol'),
      repeat(not(alt([sym('eol'), sym('numbered_list_symbol')]), sym('line'))),
    ])
  ),

  quote: seq1(1, ['>', repeat(not(alt([sym('eol'), '>']), sym('line')))]),

  table_row: seq1(1, [
    '|',
    plus(seq1(0, [repeat(not('|', sym('text'))), '|'])),
    repeat(' '),
    sym('eol'),
  ]),
  table: seq([
    sym('table_row'),
    seq([
      '|',
      plus(seq([plus(alt(['-', ' '])), '|'])),
      repeat(' '),
      sym('eol'),
    ]),
    repeat(sym('table_row')),
  ]),

  code_block: seq1(1, ['```', until('```')]),

  START: repeat(alt([sym('block'), sym('line')])),
};

type MarkdownActions = Partial<{
  [k in keyof typeof markdownSymbols]: (x: ParserContext, ps: PStream) => void;
}>;

const markdownToHtmlActions: MarkdownActions = {
  START: (x, ps) => {
    return ps.value();
  },
  text_line: (x, ps) => {
    return '<div>' + (ps.value() as string[]).join('') + '</div>';
  },
  bold: (x, ps) => {
    return '<b>' + (ps.value() as string[]).join('') + '</b>';
  },
  text: (x, ps) => {
    const v = ps.value();
    if (typeof v === 'string') return v;
    return (ps.value() as string[]).join('');
  },
  italics: (x, ps) => {
    return '<i>' + (ps.value() as string[]).join('') + '</i>';
  },
};

const parseMde = (str: string) => {
  const keys = Object.keys(markdownSymbols) as (keyof typeof markdownSymbols)[];
  const parsersWithAction = new Map(
    keys.map((name) => [
      name,
      markdownToHtmlActions[name]
        ? new ParserWithAction(
            markdownSymbols[name],
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            markdownToHtmlActions[name]!
          )
        : markdownSymbols[name],
    ])
  );
  const ps = new StringPStream({ pos: 0, str, value: null });
  const start = parsersWithAction.get('START');
  const x = new ParserContext();
  x.set('grammarMap', parsersWithAction);
  const result = start?.parse(x, ps);
  return (result?.value() as string[]).join('');
};

test('parse stuff', (t) => {
  const html = parseMde(
    `
Hello **world**. This is *italic*.
And this is on a new line
`.trim()
  );
  t.is(
    `
<div>Hello <b>world</b>. This is <i>italic</i>.</div><div>And this is on a new line</div>
`.trim(),
    html
  );
});

const alpha = alt([range('a', 'z'), range('A', 'Z')]);
const num = range('0', '9');
const alphaNum = alt([alpha, num]);
const domainPart = max(
  seq([
    repeat(seq([repeat(alphaNum, undefined, 1), '-'])),
    repeat(alphaNum, undefined, 1),
  ]),
  63
);

const domain = max(
  seq([
    repeat(seq([domainPart, '.']), undefined, 1),
    repeat(alpha, undefined, 2, 6), // TLD
  ]),
  253
);

const url = join(
  flat(
    seq([
      optional(alt(['http://', 'https://'])),
      domain,
      optional(
        seq([
          alt(['/', '?', '#']),
          repeat(not(alt([seq0(['.', ws()]), ws()]), anyChar())),
        ])
      ),
    ]),
    // Might be better to flat/join each piece but this results in less code.
    5
  )
);

test('parse url', (t) => {
  const urlOnly = seq1(0, [url, eof()]);

  t.truthy(parse(urlOnly, 'google.com'));
  t.truthy(parse(urlOnly, 'goo-gle.com'));
  t.falsy(parse(urlOnly, Array(30).fill('01234566789').join('') + '.com'));
  t.falsy(parse(urlOnly, Array(30).fill('01234566789').join('.') + '.com'));
  t.falsy(parse(urlOnly, 'google-.com'));
  t.falsy(parse(urlOnly, '-google.com'));
  t.truthy(parse(urlOnly, 'http://chart.apis.google.com/chart'));
  const longUrl =
    'http://chart.apis.google.com/chart?chs=500x500&chma=0,0,100,100&cht=p&chco=FF0000%2CFFFF00%7CFF8000%2C00FF00%7C00FF00%2C0000FF&chd=t%3A122%2C42%2C17%2C10%2C8%2C7%2C7%2C7%2C7%2C6%2C6%2C6%2C6%2C5%2C5&chl=122%7C42%7C17%7C10%7C8%7C7%7C7%7C7%7C7%7C6%7C6%7C6%7C6%7C5%7C5&chdl=android%7Cjava%7Cstack-trace%7Cbroadcastreceiver%7Candroid-ndk%7Cuser-agent%7Candroid-webview%7Cwebview%7Cbackground%7Cmultithreading%7Candroid-source%7Csms%7Cadb%7Csollections%7Cactivity|Chart';
  t.is(parse(urlOnly, longUrl)?.value(), longUrl);
});
