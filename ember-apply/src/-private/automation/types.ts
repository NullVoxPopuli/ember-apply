export interface MassPROptions {
  /**
   * What branch to start each bucket of work off of.
   * Default is `main`
   */
  baseBranch?: string;

  /**
   * What remote to use. Defaults to `origin`
   */
  baseRemote?: string;

  /**
   * How to determine what the name of the PR will be.
   * This should be a stable value and not use randomness.
   */
  name: (bucket: string) => Promise<string>;
  /**
   * How to determine what the description within the PR will be.
   */
  description: (bucket: string) => Promise<string>;

  /**
   * How to create a branch based on the current bucket of work.
   * This should be a stable value and not use randomness.
   */
  branch: (bucket: string) => Promise<string>;

  /**
   * How to generate the commit message used for when the work is done.
   */
  commit: (bucket: string) => Promise<string>;

  /**
   * For the given bucket, what work will be done?
   *
   * After this completes, a commit and push will occur.
   * If the branch ends up being the same as an existing branch, a force-push will be used.
   */
  doWork: (bucket: string) => Promise<void>;

  /**
   * Callback for using an "ensure PR" provider, such as GitHub or Bitbucket
   * This needs to be passed so that PRs are actually created.
   *
   * Auth for the service in particular will need to be handled by the provider as well.
   *
   */
  ensurePR: (bucket: string) => Promise<void>;

  /**
   * This is how the work will be split up, if at all.
   *
   * This may be omitted, but it means that only one PR will be created.
   *
   * When splitting work, each individual item in the returned array will be passed as
   * the "bucket" to each of the other functions.
   * It is up to you to decide
   *
   */
  split?: () => Promise<string[]>;

  /**
   * Run everything from a separate working directory. Default is process.cwd()
   */
  cwd?: string;
}
