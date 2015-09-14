module.exports = function (grunt) {
  'use strict';

  var files = {
    angular: [
      'app/app.js',
      'app/config.js',
      'app/controllers/**/*.js',
      'app/directives/**/*.js',
      'app/models/**/*.js',
      'app/services/**/*.js'
    ],

    config: [
      'gruntfile.js'
    ],

    html: [
      'index.html', 'app/views/**/*.html'
    ],

    libs: {
      js: [
        'libs/angularjs/angular.min.js',
        'libs/angular-route/angular-route.min.js',
        'libs/angular-cookies/angular-cookies.min.js',
        'libs/angular-animate/angular-animate.min.js',
        'libs/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'libs/angular-bootstrap/ui-bootstrap.min.js',
        'libs/restangular/dist/restangular.min.js',
        'libs/lodash/dist/lodash.min.js',
        'libs/checklist-model/checklist-model.js',
        'libs/ng-img-crop/compile/minified/ng-img-crop.js',
        'libs/sweetalert/dist/sweetalert.min.js',
        'libs/ngSweetAlert/SweetAlert.min.js'
      ],
      css: [
        'libs/font-awesome/css/font-awesome.min.css',
        'libs/ng-img-crop/compile/minified/ng-img-crop.css',
        'libs/sweetalert/dist/sweetalert.css'
      ]
    },

    sass: [
      'scss/*.scss',
      'scss/**/*.scss'
    ],
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';\n',
        sourceMap: true
      },

      angular: {
        src: files.angular,
        dest: 'assets/js/main.js'
      },

      libsCss: {
        options: {
          separator: ''
        },

        src: files.libs.css,
        dest: 'assets/css/libs.css'
      },

      libsJs: {
        src: files.libs.js,
        dest: 'assets/js/libs.js'
      }
    },

    cssmin: {
      combine: {
        files: {
          "assets/css/libs.css": ["assets/css/libs.css"]
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'assets/js/libs.js': ['assets/js/libs.js']
        }
      }
    },

    copy: {
      fontAwesome: {
        files: [{
          expand: true,
          flatten: true,
          cwd: 'libs/font-awesome/fonts/',
          src: 'fontawesome-webfont.*',
          dest: 'assets/fonts/',
          filter: 'isFile'
        }]
      }
    },

    jshint: {
      angular: {
        src: files.angular
      },

      config: {
        src: files.config
      }
    },

    sprite: {
      default: {
        src: 'assets/img/sprites/*.png',
        dest: 'assets/img/spritesheet.png',
        destCss: 'scss/base/_sprites.scss'
      }
    },

    sass: {
      develop: {
        options: {
          style: 'expanded'
        },

        src: files.sass,
        dest: 'assets/css/main.css'
      }
    },

    watch: {
      options: {
        livereload: true
      },

      angular: {
        files: files.angular,
        tasks: [ 'concat:angular', 'jshint:angular' ]
      },

      config: {
        files: files.config,
        tasks: 'jshint:config'
      },

      jshintrc: {
        files: '.jshintrc',
        tasks: 'jshint'
      },

      html: {
        files: files.html
      },

      sass: {
        files: files.sass,
        tasks: 'sass:develop'
      }
    }
  });

  require("load-grunt-tasks")(grunt);

  grunt.registerTask('production', [ 'concat', 'jshint', 'sprite', 'sass', 'cssmin' , 'uglify', 'copy' ]);
  grunt.registerTask('develop', [ 'concat', 'jshint', 'sprite', 'sass', 'cssmin', 'copy', 'watch' ]);

  grunt.registerTask('default', [ ]);
};
