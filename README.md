# Blanket JS Headless Reporter

A coverage reporter for [Blanket](http://blanketjs.org) when running your coverage tests in a headless browser, like [PhantomJS](http://phantomjs.org).

### Install

This requires a modified version of blanket that you can get here, [http://github.com/ncrohn/blanket](http://github.com/ncrohn/blanket).

The plan is to submit a pull request to change how the reporter is loaded in the main blanket repository.

Take the ```headless-reporter.js``` file and put it with your other testing libraries.

## Usage

This is assuming that you have blanket already setup. If you don't you can read their documentation on [getting started](https://github.com/alex-seville/blanket#getting-started).

    test.html

    <script src="path/to/blanket.js"
            data-cover-only="//src/"
            data-cover-never="//src\/(components|require)/"
            data-cover-reporter="/path/to/headless-reporter.js"></script>

#### Usage with Grunt

	Gruntfile.js

	module.exports = function(grunt) {

	  grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

		connect: {
		  test: {
          options: {
            port: 8000,
            base: '.'
          }
		},

		qunit: {
	      coverage: {
	        options: {
	          urls: [
	            'http://localhost:8000/path/to/tests/main.html?coverage=true'
	          ]
	        }
	      }
    	}
      });
      
      grunt.loadNpmTasks('grunt-congrib-connect');
      grunt.loadNpmTasks('grunt-contrib-qunit');
      
      grunt.registerTask('coverage', ['connect:test', 'qunit:coverage']);
      
    };

## License
  
MIT License Copyright © 2013 Nick Crohn
