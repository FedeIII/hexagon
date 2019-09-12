module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier', 'import'],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-use-before-define': 0,
    'class-methods-use-this': 'off',
    'arrow-body-style': 'off',
    'max-len': [1, 140, 2],
    'arrow-parens': 'off',
    'no-underscore-dangle': 'off',
    'prettier/prettier': ['error'],
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/extensions': [0, { js: 'never' }],
    'import/no-extraneous-dependencies': [
      0,
      {
        devDependencies: false,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
  },
  globals: {
    describe: true,
    expect: true,
    test: true,
    it: true,
    afterAll: true,
    afterEach: true,
    beforeAll: true,
    beforeEach: true,
  },
};
