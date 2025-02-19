// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: ['/dist/*'],
  plugins: ["no-relative-import-paths"],
  rules: {
    "no-relative-import-paths/no-relative-import-paths": [
      "warn",
      { "allowSameFolder": false, "rootDir": 'src', "prefix": '@' }
    ]
  }
};
