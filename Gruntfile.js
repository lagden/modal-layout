'use strict';

module.exports = function(grunt) {
	grunt.file.defaultEncoding = 'utf8';
	require('jit-grunt')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({

		project: {
			'prod': 'build',
			'dev': 'dev',
			'coffee': 'coffee',
			'jade': 'jade',
			'css': 'stylus'
		},

		coffeelint: {
			lint: {
				options: {
					'no_throwing_strings': {
						'level': 'ignore'
					}
				},
				files: {
					src: ['<%= project.coffee %>/**/*.coffee']
				}
			}
		},

		coffee: {
			compile: {
				options: {
					bare: true
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: '<%= project.coffee %>',
					src: ['**/*.coffee'],
					dest: '<%= project.dev %>/js',
					ext: '.js'
				}]
			}
		},

		jade: {
			js: {
				options: {
					amd: true,
					client: true,
					namespace: false
				},
				files: [{
					expand: true,
					flatten: true,
					cwd: '<%= project.jade %>/js',
					src: ['**/*.jade'],
					dest: '<%= project.dev %>/js/templates',
					ext: '.js'
				}]
			},
			html: {
				options: {
					pretty: true
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: '<%= project.jade %>/html',
					src: ['**/*.jade'],
					dest: '<%= project.dev %>',
					ext: '.html'
				}]
			},
			build: {
				options: {
					pretty: false,
					data: {
						build: true
					}
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: '<%= project.jade %>/html',
					src: ['**/*.jade'],
					dest: '<%= project.dev %>',
					ext: '.html'
				}]
			}
		},

		stylus: {
			'dev': {
				'options': {
					'compress': false
				},
				'files': [{
					'expand': true,
					'flatten': false,
					'cwd': '<%= project.css %>',
					'src': ['*.styl'],
					'dest': '<%= project.dev %>/css',
					'ext': '.css'
				}]
			}
		},

		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer')({
						browsers: 'last 2 versions'
					})
				]
			},
			files: {
				'expand': true,
				'flatten': false,
				'cwd': '<%= project.dev %>/css',
				'src': ['*.css'],
				'dest': '<%= project.dev %>/css',
				'ext': '.css'
			}
		},

		watch: {
			script: {
				files: ['<%= project.coffee %>/**/*.coffee'],
				tasks: ['scripts']
			},
			css: {
				files: ['<%= project.css %>/**/*'],
				tasks: ['styles']
			},
			jadeToHtml: {
				files: ['<%= project.jade %>/html/**/*.jade'],
				tasks: ['jade:html']
			},
			jadeToJs: {
				files: ['<%= project.jade %>/js/**/*.jade'],
				tasks: ['jade:js']
			}
		},

		browserSync: {
			dev: {
				bsFiles: {
					src: '<%= project.dev %>/css/*.css'
				},
				options: {
					notify: true,
					watchTask: true,
					port: 8183,
					server: {
						baseDir: ['<%= project.dev %>']
					}
				}
			},
			dist: {
				options: {
					notify: false,
					watchTask: false,
					port: 8184,
					ghostMode: false,
					injectChanges: false,
					codeSync: false,
					server: {
						baseDir: ['<%= project.prod %>']
					}
				}
			}
		},

		requirejs: {
			almond: {
				options: {
					optimize: 'uglify2',
					uglify2: {
						warnings: false,
						mangle: true,
						compress: {
							evaluate: false,
							sequences: true,
							properties: true,
							unused: true,
							'hoist_funs': false,
							'hoist_vars': false,
							'drop_debugger': true,
							'drop_console': true
						}
					},
					optimizeCss: 'none',
					generateSourceMaps: true,
					keepAmdefine: true,
					preserveLicenseComments: false,
					findNestedDependencies: true,
					useStrict: true,
					baseUrl: '<%= project.dev %>/js/lib',
					mainConfigFile: '<%= project.dev %>/js/config.js',
					name: '../../../node_modules/almond/almond',
					include: ['../main'],
					out: '<%= project.prod %>/js/main.js'
				}
			}
		},

		cssmin: {
			dynamic: {
				options: {
					keepSpecialComments: 0,
					report: 'gzip'
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: '<%= project.dev %>/css',
					src: ['**/*.css'],
					dest: '<%= project.prod %>/css',
					ext: '.css'
				}]
			}
		},

		minifyHtml: {
			dynamic: {
				options: {
					comments: false,
					conditionals: true,
					spare: false,
					quotes: true,
					cdata: false,
					empty: false
				},
				files: [
					{
						expand: true,
						cwd: '<%= project.dev %>',
						src: ['**/*.html'],
						dest: '<%= project.prod %>'
					}
				]
			}
		},

		concurrent: {
			dev: [
				'scripts',
				'styles',
				'jade:html',
				'jade:js'
			]
		},

		clean: {
			build: ['<%= project.prod %>'],
			dist: ['dist']
		},

		copy: {
			ico: {
				src: '<%= project.dev %>/favicon.ico',
				dest: '<%= project.prod %>/favicon.ico'
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: '<%= project.dev %>/js/components',
						src: '**',
						dest: 'dist'
					},
					{
						flatten: true,
						src: '<%= project.dev %>/css/modal.css',
						dest: 'dist/modal.css'
					}
				]
			},
		},

		symlink: {
			options: {
				overwrite: false
			},
			require: {
				src: 'node_modules/requirejs/require.js',
				dest: '<%= project.dev %>/js/lib/require.js'
			},
			eventEmitter: {
				src: 'node_modules/wolfy87-eventemitter/EventEmitter.js',
				dest: '<%= project.dev %>/js/lib/eventEmitter/EventEmitter.js'
			},
			lagdenUtils: {
				src: 'node_modules/lagden-utils/dist',
				dest: '<%= project.dev %>/js/lib/lagden-utils/dist'
			}
		},

		qunit: {
			all: ['test/**/*.html']
		}
	});

	grunt.registerTask('default', [
		'clean:dist',
		'symlink',
		'concurrent:dev',
		'copy:dist'
	]);

	grunt.registerTask('scripts', [
		'coffeelint',
		'coffee'
	]);

	grunt.registerTask('build', [
		'clean:build',
		'default',
		'jade:build',
		'requirejs',
		'cssmin',
		'minifyHtml',
		'copy:ico'
	]);

	grunt.registerTask('serve', [
		'default',
		'browserSync:dev',
		'watch'
	]);

	grunt.registerTask('serve:prod', [
		'build',
		'browserSync:dist'
	]);

	grunt.registerTask('styles', [
		'stylus',
		'postcss'
	]);

	grunt.registerTask('test', [
		'default',
		'qunit'
	]);
};
