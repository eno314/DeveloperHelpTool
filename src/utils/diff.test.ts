import {diffLines} from './diff';

describe('diff utility', () => {
  it('should detect identical lines', () => {
    const changes = diffLines('hello\nworld', 'hello\nworld');
    expect(changes).toEqual([{value: 'hello\nworld'}]);
  });

  it('should detect added lines', () => {
    const changes = diffLines('hello\nworld', 'hello\nbeautiful\nworld');
    expect(changes).toEqual([
      {value: 'hello\n'},
      {value: 'beautiful\n', added: true},
      {value: 'world'},
    ]);
  });

  it('should detect removed lines', () => {
    const changes = diffLines('hello\nbeautiful\nworld', 'hello\nworld');
    expect(changes).toEqual([
      {value: 'hello\n'},
      {value: 'beautiful\n', removed: true},
      {value: 'world'},
    ]);
  });

  it('should detect both added and removed lines', () => {
    const changes = diffLines('hello\ncruel\nworld', 'hello\nbeautiful\nworld');
    expect(changes).toEqual([
      {value: 'hello\n'},
      {value: 'cruel\n', removed: true},
      {value: 'beautiful\n', added: true},
      {value: 'world'},
    ]);
  });

  it('should group adjacent identical changes', () => {
    const changes = diffLines('a\nb\nc\n', 'a\nx\ny\nz\nc\n');
    expect(changes).toEqual([
      {value: 'a\n'},
      {value: 'b\n', removed: true},
      {value: 'x\ny\nz\n', added: true},
      {value: 'c\n'},
    ]);
  });
});
