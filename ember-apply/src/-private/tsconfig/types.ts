export interface TSConfig {
  [option: string]: unknown;
  extends?: string | string[];
  compilerOptions?: {
    [option: string]: unknown;
    paths?: {
      [name: string]: string[];
    };
  };
  types?: string[];
  glint?: {
    environment?:
      | ('ember-loose' | 'ember-template-imports')[]
      | {
          'ember-loose'?: {};
          'ember-template-imports'?: {
            additionalGlobals?: string[];
          };
        };
  };
}
