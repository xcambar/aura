module.exports = function (grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha');

  var PORT = 8899;

  var auraRequireBaseConfig = {
    options: {
      baseUrl: '.',
      paths: {
        aura: 'lib',
        jquery: 'empty:',
        underscore: 'empty:',
        eventemitter: 'components/eventemitter2/lib/eventemitter2'
      },
      shim: {
        underscore: {
          exports: '_'
        }
      },
      include: [
        'aura/aura',
        'aura/aura.extensions',
        'aura/ext/debug',
        'aura/ext/mediator',
        'aura/ext/widgets'
      ],
      exclude: ['jquery']
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: PORT,
          base: '.'
        }
      }
    },
    browserify: {
      src: ['lib/**/*.js'],
      dest: 'dist/aura.cjs.js'
    },
    // requirejs: {
    //   dev: grunt.util._.merge({}, auraRequireBaseConfig, {
    //     options: {
    //       optimize: 'none',
    //       out: 'dist/aura.js'
    //     }
    //   }),
    //   build: grunt.util._.merge({}, auraRequireBaseConfig, {
    //     options: {
    //       optimize: 'none',
    //       out: 'dist/aura-<%= pkg.version %>.js'
    //     }
    //   }),
    //   buildMin: grunt.util._.merge({}, auraRequireBaseConfig, {
    //     options: {
    //       out: 'dist/aura-<%= pkg.version %>.min.js'
    //     }
    //   })
    // },
    jshint: {
      all: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [
            'lib/**/*.js',
            'spec/lib/**/*.js'
          ]
        }
      }
    },
    mocha: {
      all: {
          options: {
              urls: ['http://localhost:<%= connect.server.options.port %>/spec/index.html']
          }
      }
    },
    watch: {
      files: [
        'lib/**/*.js',
        'spec/lib/**/*.js'
      ],
      tasks: ['spec']
    }
  });

  grunt.registerTask('spec', ['jshint', 'mocha']);
  grunt.registerTask('build', ['connect', 'spec', 'requirejs:dev']);
  grunt.registerTask('version', ['connect', 'spec', 'requirejs:build', 'requirejs:buildMin']);
  grunt.registerTask('default', ['connect', 'spec', 'watch']);
};
