require('alloyui-tasks')({
  bundleFileName: 'main.js',
  globalName: 'ui',
  jspmConfigFile: 'jspm.js',
  taskPrefix: 'aui:',
  buildDest: 'dist/public/scripts/',
  buildSrc: 'lib/scripts/*.js',
  cssSrc: 'lib/scripts/*.css',
  lintSrc: ['lib/scripts/*.js', 'lib/tests/*.js'],
  soyDest: 'lib/scripts/',
  soySrc: 'lib/scripts/*.soy',
  testSrc: 'lib/tests/*.js',
  watchSrc: 'lib/scripts/*'
});