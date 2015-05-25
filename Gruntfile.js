'use strict';
module.exports = function (grunt) {
    require('jit-grunt')(grunt);
    require('time-grunt')(grunt);
    grunt.file.defaultEncoding = 'utf8';
    grunt.initConfig({
        coffee: {
            compile: {
                options: { bare: true },
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
                options: { pretty: true },
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
                    data: { build: true }
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
                bsFiles: { src: '<%= project.dev %>/css/*.css' },
                options: {
                    notify: true,
                    watchTask: true,
                    port: 8183,
                    server: { baseDir: ['<%= project.dev %>'] }
                }
            },
            dist: {
                options: {
                    notify: false,
                    watchTask: false,
                    port: 8184,
                    server: { baseDir: ['<%= project.prod %>'] }
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
                    name: 'almond',
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
                files: [{
                        expand: true,
                        cwd: '<%= project.dev %>',
                        src: ['**/*.html'],
                        dest: '<%= project.prod %>'
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
            dist: ['<%= project.prod %>'],
            tmp: ['<%= project.tmp %>']
        },
        copy: {
            dist: {
                src: '<%= project.dev %>/favicon.ico',
                dest: '<%= project.prod %>/favicon.ico'
            }
        },
        project: {
            'prod': 'build',
            'dev': 'dev',
            'tmp': 'tmp',
            'coffee': 'coffee',
            'jade': 'jade',
            'css': 'stylus'
        },
        autoprefixer: {
            'options': { 'browsers': ['last 1 version'] },
            'files': {
                'expand': true,
                'flatten': false,
                'cwd': '<%= project.tmp %>/css',
                'src': ['*.css'],
                'dest': '<%= project.dev %>/css',
                'ext': '.css'
            }
        },
        stylus: {
            'dev': {
                'options': { 'compress': false },
                'files': [{
                        'expand': true,
                        'flatten': false,
                        'cwd': '<%= project.css %>',
                        'src': ['*.styl'],
                        'dest': '<%= project.tmp %>/css',
                        'ext': '.css'
                    }]
            }
        }
    });
    grunt.registerTask('default', [
        'clean:tmp',
        'concurrent:dev'
    ]);
    grunt.registerTask('scripts', [
        'coffee',
        'fixmyjs:fix'
    ]);
    grunt.registerTask('build', [
        'clean:dist',
        'default',
        'jade:build',
        'requirejs',
        'cssmin',
        'minifyHtml',
        'copy'
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
};