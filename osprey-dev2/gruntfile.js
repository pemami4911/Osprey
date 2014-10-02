module.exports = function(grunt) {

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
	    karma: {
		unit: {
		    configFile: 'karma.conf.js'
		}
	    }
	});

<<<<<<< HEAD
=======
<<<<<<< HEAD
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-qunit');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-concat');
=======
>>>>>>> nick's-branch
   // grunt.loadNpmTasks('grunt-contrib-uglify');
   // grunt.loadNpmTasks('grunt-contrib-jshint');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    //grunt.loadNpmTasks('grunt-contrib-watch');
   // grunt.loadNpmTasks('grunt-contrib-concat');
<<<<<<< HEAD
=======
>>>>>>> master
>>>>>>> nick's-branch
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('test', ['karma']);

<<<<<<< HEAD
    grunt.registerTask('default', ['node server.js']);
=======
<<<<<<< HEAD
    // grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);
=======
    grunt.registerTask('default', ['node server.js']);
>>>>>>> master
>>>>>>> nick's-branch

};