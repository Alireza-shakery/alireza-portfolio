import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  contacts,
  contactHref,
  safeExternalUrl,
  visibleContacts,
} from '../src/content/contacts.ts';
import { projects } from '../src/content/projects.ts';
import type { ContactMethod } from '../src/content/types.ts';

const contact = (overrides: Partial<ContactMethod>): ContactMethod => ({
  id: 'test',
  name: { en: 'Test', fa: 'آزمون' },
  icon: 'link',
  kind: 'url',
  enabled: true,
  value: null,
  ...overrides,
});

test('unverified contact details never produce public links', () => {
  for (const item of contacts) {
    if (!item.enabled || !item.value) assert.equal(contactHref(item), null);
  }
  for (const item of visibleContacts()) assert.ok(contactHref(item));
  assert.equal(contactHref(contact({ value: null })), null);
  assert.equal(contactHref(contact({ value: 'https://example.org', enabled: false })), null);
});

test('contact links normalize valid email and international phone values', () => {
  assert.equal(
    contactHref(contact({ kind: 'email', value: ' owner@example.org ' })),
    'mailto:owner@example.org',
  );
  assert.equal(
    contactHref(contact({ kind: 'phone', value: '+98 (912) 123-4567' })),
    'tel:+989121234567',
  );
  assert.equal(contactHref(contact({ kind: 'phone', value: '09121234567' })), null);
  assert.equal(
    contactHref(contact({ kind: 'email', value: 'owner@example.org?subject=injected' })),
    null,
  );
});

test('only safe HTTPS external destinations are accepted', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//example.org',
    'http://example.org',
    'https://user:pass@example.org',
    'not-a-url',
  ])
    assert.equal(safeExternalUrl(value), null);
  assert.equal(safeExternalUrl('https://github.com/example'), 'https://github.com/example');
});

test('all translation keys exist in both languages', () => {
  const en = JSON.parse(readFileSync(new URL('../messages/en.json', import.meta.url), 'utf8'));
  const fa = JSON.parse(readFileSync(new URL('../messages/fa.json', import.meta.url), 'utf8'));
  function keys(value: Record<string, unknown>, prefix = ''): string[] {
    return Object.entries(value).flatMap(([key, item]) =>
      typeof item === 'object' && item !== null
        ? keys(item as Record<string, unknown>, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    );
  }
  assert.deepEqual(keys(en).sort(), keys(fa).sort());
});

test('project routes are unique and Danafa remains an accurately labeled concept', () => {
  assert.equal(new Set(projects.map((project) => project.slug)).size, projects.length);
  for (const project of projects) assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  const danafa = projects.find((project) => project.slug === 'danafa')!;
  assert.equal(danafa.liveUrl, null);
  assert.equal(danafa.repositoryUrl, null);
  assert.equal(danafa.caseStudy.implementedFeatures.en.length, 0);
  assert.equal(danafa.caseStudy.implementedFeatures.fa.length, 0);
  assert.equal(
    danafa.caseStudy.plannedFeatures.en.length,
    danafa.caseStudy.plannedFeatures.fa.length,
  );
  assert.match(danafa.status.en, /concept/i);
});
