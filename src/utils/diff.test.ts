import {diffLines} from './diff.ts';
import {expect} from 'jsr:@std/expect';

Deno.test('diff utility', async t => {
  await t.step('should detect identical lines', () => {
    const changes = diffLines('hello\nworld', 'hello\nworld');
    expect(changes).toEqual([{value: 'hello\nworld'}]);
  });

  await t.step('should detect added lines', () => {
    const changes = diffLines('hello\nworld', 'hello\nbeautiful\nworld');
    expect(changes).toEqual([
      {value: 'hello\n'},
      {value: 'beautiful\n', added: true},
      {value: 'world'},
    ]);
  });

  await t.step('should detect removed lines', () => {
    const changes = diffLines('hello\nbeautiful\nworld', 'hello\nworld');
    expect(changes).toEqual([
      {value: 'hello\n'},
      {value: 'beautiful\n', removed: true},
      {value: 'world'},
    ]);
  });

  await t.step('should detect both added and removed lines', () => {
    const changes = diffLines('hello\ncruel\nworld', 'hello\nbeautiful\nworld');
    expect(changes).toEqual([
      {value: 'hello\n'},
      {value: 'cruel\n', removed: true},
      {value: 'beautiful\n', added: true},
      {value: 'world'},
    ]);
  });

  await t.step('should group adjacent identical changes', () => {
    const changes = diffLines('a\nb\nc\n', 'a\nx\ny\nz\nc\n');
    expect(changes).toEqual([
      {value: 'a\n'},
      {value: 'b\n', removed: true},
      {value: 'x\ny\nz\n', added: true},
      {value: 'c\n'},
    ]);
  });
});
