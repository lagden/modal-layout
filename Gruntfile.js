'use strict';

module.exports = function(grunt) {
  require('jit-grunt')(grunt);
  require('time-grunt')(grunt);
  grunt.file.defaultEncoding = 'utf8';
  grunt.initConfig({
    project: {
      'prod': 'build',
      'dev': 'dev',
      'tmp': 'tmp',
      'coffee': 'coffee',
      'jade': 'jade',
      'css': 'stylus'
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
          dest: '<%= project.tmp %>/js',
          ext: '.js'
        }]
      }
    },

    fixmyjs: {
      options: {
        jshintrc: '.jshintrc',
        indentpref: 'spaces'
      },
      fix: {
        files: [{
          expand: true,
          flatten: false,
          cwd: '<%= project.tmp %>/js',
          src: ['**/*.js'],
          dest: '<%= project.dev %>/js',
          ext: '.js'
        }]
      }
    },

    jscs: {
      fix: {
        options: {
          fix: true,
          force: true
        },
        files: {
          src: ['<%= project.dev %>/js/components/**/*.js'],
        }
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
          'dest': '<%= project.tmp %>/css',
          'ext': '.css'
        }]
      }
    },

    autoprefixer: {
      'options': {
        'browsers': ['last 1 version']
      },
      'files': {
        'expand': true,
        'flatten': false,
        'cwd': '<%= project.tmp %>/css',
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
      dist: ['modal'],
      tmp: ['<%= project.tmp %>']
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
            dest: 'modal/'
          },
          {
            flatten: true,
            src: '<%= project.dev %>/css/modalLayout.css',
            dest: 'modal/modalLayout.css'
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
      }
    },

    qunit: {
      all: ['test/**/*.html']
    }
  });

  grunt.registerTask('default', [
    'clean:dist',
    'symlink:require',
    'clean:tmp',
    'concurrent:dev',
    'copy:dist'
  ]);

  grunt.registerTask('scripts', [
    'coffee',
    'fixmyjs:fix',
    'jscs:fix'
  ]);

  grunt.registerTask('build', [
    'clean:build',
    'default',
    'jade:build',
    'requirejs',
    'cssmin',
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
    'autoprefixer'
  ]);

  grunt.registerTask('test', [
    'qunit'
  ]);
};
