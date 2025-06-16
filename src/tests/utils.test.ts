import { getMentionedEmails } from '../utils.js'

describe('getMentionedEmails', () => {
  it('extracts single mentioned email', () => {
    expect(getMentionedEmails('Hello @user1@example.com')).toEqual(['user1@example.com']);
  });

  it('extracts multiple mentioned emails', () => {
    expect(getMentionedEmails('Hi @a@b.com and @c@d.com')).toEqual(['a@b.com', 'c@d.com']);
  });

  it('removes duplicates', () => {
    expect(getMentionedEmails('Notify @a@b.com and again @a@b.com')).toEqual(['a@b.com']);
  });

  it('returns empty array if no mentions', () => {
    expect(getMentionedEmails('No mentions here')).toEqual([]);
  });
});

