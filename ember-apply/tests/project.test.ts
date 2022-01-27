/* eslint-disable @typescript-eslint/no-empty-function */
import path from 'path';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { project } from '../src';
import { newTmpDir } from '../src/test-utils';

// let it = test.concurrent;
// Snapshot testing is broken in concurrent tests
// see: https://github.com/vitest-dev/vitest/issues/551
let it = test.concurrent;

let original = process.cwd();

describe('project', () => {
  beforeEach(() => {
    process.chdir(original);
  });
  afterEach(() => {
    process.chdir(original);
  });

  describe(project.gitRoot.name, () => {
    it('in a git directory, it works', async () => {
      let root = await project.gitRoot();
      let expected = path.resolve(__dirname, '../..');

      expect(root).toEqual(expected);
    });

    it('in a non-git directory, it raises', async () => {
      let newDir = await newTmpDir();

      try {
        await project.inWorkspace(newDir, async () => {
          let root = await project.gitRoot();

          expect(root).toEqual(newDir);
        });
      } catch (e) {
        expect(e.message).toMatch(/not a git repository/);

        return;
      }

      expect(null).toEqual('Test should return before here due to error');
    });
  });

  describe(project.gitIgnore.name, () => {
    it.skip('adds a new entry to the bottom', () => {});
    it.skip('adds a new entry under a header', () => {});
    it.skip('adds a new entry and a new a header', () => {});
  });

  describe(project.inWorkspace.name, () => {
    it.skip('changes the working directory', () => {});
  });

  describe(project.eachWorkspace.name, () => {
    it.skip('does something in each workspace', () => {});
  });

  describe(project.getWorkspaces.name, () => {
    it('lists workspaces', async () => {
      let workspaces = await project.getWorkspaces();

      expect(workspaces).toEqual([
        '.',
        'ember-apply',
        'packages/docs',
        'packages/ember/embroider',
        'packages/ember/tailwind',
      ]);
    });
  });
});
