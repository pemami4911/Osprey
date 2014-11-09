module.exports = function(grunt) {

	var watchFiles = {
		mochaTests: ['app/tests/**/*.js']
	};

    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    concat: {
		options: {
		    separator: ';'
		},
		dist: {
		    src: ['src/**/*.js'],
		    dest: 'dist/<%= pkg.name %>.js'
		}
	    },
	    uglify: {
		options: {
		    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		},
		dist: {
		    files: {
			'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
		    }
		}
	    },
	    qunit: {
		files: ['test/**/*.html']
	    },
	    jshint: {
		files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
		options: {
		    // options here to override JSHint defaults
		    globals: {
			jQuery: true,
			console: true,
			module: true,
			document: true
		    }
		}
	    },
	    watch: {
		files: ['<%= jshint.files %>'],
		tasks: ['jshint', 'qunit']
	    },
	    env: {
			test: {
				NODE_ENV: 'test'
			}
		},
	    mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
	    karma: {
		unit: {
		    configFile: 'karma.conf.js'
		}
	    },
	    protractor: {
	    	options: {
		      configFile: "protractor.conf.js" // Default config file

		    },
		    all: {}
	    },
	    protractor_webdriver: {
		    your_target: {
		      options: {
		        command: 'webdriver-manager start'
		      },
		    },
		},
		nodemon: {
		    dev: {
		    	script: 'server.js',
		    	options: {
		    		args: ['NODE_ENV=test']
		    	}
		    }
	    }
	});

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-protractor-webdriver');
    grunt.loadNpmTasks('grunt-nodemon');

    grunt.registerTask('test', ['env:test', 'karma', 'mochaTest', 'protractor_webdriver', 'protractor']);
    grunt.registerTask('default', ['nodemon']);
   	grunt.registerTask('testmocha', ['env:test', 'mochaTest']);
   	grunt.registerTask('testkarma', ['env:test', 'karma']);
   	grunt.registerTask('testprotractor', ['env:test', 'mochaTest', 'protractor_webdriver', 'protractor']);

};