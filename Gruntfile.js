module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cnf: grunt.file.readJSON('config.json'),
    meta: {
      endpoint: "public"
    },
    stylus: {
      compile: {
        options: {compress: false},
        files: {
            'src/css/bbhub.css': 'src/stylus/bbhub.styl'
          }
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: [
          {expand: true, cwd: 'src/jade', src: ['**/*.jade', '!includes/*.jade', '!templates/*.jade', '!update-organization/_*.jade'], dest: '<%=meta.endpoint%>/', ext: '.html'}
        ]
      }
    },
    concat: {
      js: {
        options: {
          separator: ';'
        },
        src: ['src/js/respond.js', 'src/js/bootstrap.min.js', 'src/js/jquery.debounce.min.js', 'src/js/smoothscroll.min.js', 'src/js/list.min.js', 'src/js/fastclick.min.js', 'src/js/bbhub.js'],
        dest: '<%=meta.endpoint%>/js/bbhub-combined.js',
        nonull: true
      },
      css: {
        src: ['src/css/bootstrap.min.css', 'src/css/bbhub.css'],
        dest: '<%=meta.endpoint%>/css/bbhub-combined.css',
        nonull: true
      }

    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        // banner: '/*! Blue Button Hub <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= cnf.MASTER_DIR %>public/js/bbhub-combined.min.js': ['<%= concat.js.dest %>'],
          '<%= cnf.MASTER_DIR %>public/js/bb-forms.min.js': ['<%= cnf.MASTER_DIR %>src/js/hammer.js','<%= cnf.MASTER_DIR %>src/js/ractive-plugins.js', '<%= cnf.MASTER_DIR %>src/js/bb-forms.js']
        }
      }
    },
    watch: {
      html: {
        files: '**/*.jade',
        tasks: ['jade'],
        options: {
          interrupt: true
        }
      },
      css: {
        files: ['src/stylus/*.styl'],
        tasks: ['stylus:compile', 'concat:css'],
        options: {
          interrupt: true
        }
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['concat:js', 'uglify'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade', 'stylus', 'concat', 'uglify']);

};
