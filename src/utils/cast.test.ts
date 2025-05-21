import { toObject, toString } from './cast';

describe('toObject', () => {
  it('returns the same object for plain objects', () => {
    const obj = { a: 1 };
    expect(toObject(obj)).toBe(obj);
  });

  it('returns an empty object for non-objects', () => {
    expect(toObject(null)).toEqual({});
    expect(toObject(undefined)).toEqual({});
    expect(toObject(42)).toEqual({});
    expect(toObject('str')).toEqual({});
    expect(toObject([1, 2])).toEqual({});
  });
});

describe('toString', () => {
  it('returns the same string for string inputs', () => {
    expect(toString('hello')).toBe('hello');
  });

  it('converts numbers to strings', () => {
    expect(toString(123)).toBe('123');
  });

  it('converts undefined to an empty string', () => {
    expect(toString(undefined)).toBe('');
  });
});
