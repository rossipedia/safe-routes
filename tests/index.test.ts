import { expect, test, vi } from 'vitest';
import { $path } from '../src';
import * as basename from '../src/basename.ts';

vi.mock(import('../src/basename.ts'));

vi.mocked(basename.resolveBasename).mockReturnValue('');

test('$path', () => {
  expect($path('/posts')).toBe('/posts');
});

test('$path + params', () => {
  expect($path('/posts/:id', { id: 1 })).toBe('/posts/1');
});

test('$path + params + escape periods', () => {
  expect($path('/posts/:id.json', { id: 1 })).toBe('/posts/1.json');
});

test('$path + query', () => {
  expect($path('/posts', { order: 'desc' })).toBe('/posts?order=desc');
});

test('$path + array query', () => {
  expect(
    $path('/posts/delete', [
      ['id', '1'],
      ['id', '2'],
    ]),
  ).toBe('/posts/delete?id=1&id=2');
});

test('$path + params + query', () => {
  expect($path('/posts/:id', { id: 1 }, { raw: 'true' })).toBe(
    '/posts/1?raw=true',
  );
});

test('$path + optional route fragment', () => {
  expect($path('/:lang?/about', {})).toBe('/about');
  expect($path('/:lang?/about', { lang: undefined })).toBe('/about');
  expect($path('/:lang?/about', { lang: 'en' })).toBe('/en/about');
});

test('$path + catch all route', () => {
  expect($path("/sign-in/*", { "*": "admin" })).toBe("/sign-in/admin");
  expect($path("/sign-in/*")).toBe("/sign-in");
  expect($path("/sign-in/*", { "*": "" })).toBe("/sign-in/");
});

test('optional segment', () => {
  expect($path('/tree?/:tree?', { tree: 'main' })).toBe('/tree/main');
});

test('basename', async () => {
  vi.mocked(basename.resolveBasename).mockReturnValue('/blog');

  expect($path('/posts')).toBe("/blog/posts");
});
