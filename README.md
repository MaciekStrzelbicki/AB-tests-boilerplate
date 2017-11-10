# AB-tests-boilerplate
/src/main.js - main working file

src/sass/mains.scss
  - for variables use _variables.scss
  - create seperate scss files for independent parts of test and import them into main.scss
  - imports order in main.scss is important, files which declare variables and other dependencies should be imported before the ones that use them

src/img/ 
  - put svg images into 'src/img' directory - use img tags in templates (like normal images), they will be automatically inlined
  
src/HTMLFragments/ 
  - for html fragments create html files in 'src/HTMLFragments' directory, you can use them from js (for example with jQuery) with '@@import fileName.html' syntax, example: $('#content').append('@@import sth.html')
  
Referencing files in index.html
  - files need to be referenced from temp directory instead of original (js, sass), for example for js/main.js file it should be temp/main.js
  - main script file needs to be referenced in index.html to work
  - style files are referenced by default
  
 Other features
  - autoprefixing for css styles
  - minifying and uglifying for distribution builds
  - easily extendable
  - auto-removing console logs
  - auto-removing comments
  - auto-beuatifying code in debug build
