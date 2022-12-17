import test from 'ava';
import { anyChar, parse } from '..';

test('parse stuff', (t) => {
  t.is('h', parse(anyChar(), 'hello world')?.value());
});
