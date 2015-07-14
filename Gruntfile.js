module.exports = function(grunt) {

	grunt.initConfig({	

		pkg: grunt.file.readJSON('package.json'),

		jsbeautifier: {
			files: 'src/js/slider.js',
			options: {
				js: {
					"indent_size": 4,
					"indent_char": " ",
					"indent_level": 0,
					"indent_with_tabs": false,
					"preserve_newlines": true,
					"max_preserve_newlines": 10,
					"jslint_happy": true,
					"space_after_anon_function": true,
					"brace_style": "collapse",
					"keep_array_indentation": false,
					"keep_function_indentation": false,
					"space_before_conditional": true,
					"spaceInParen": true,
					"break_chained_methods": false,
					"eval_code": false,
					"unescape_strings": false,
					"wrap_line_length": 0
				}				
			}
		},

		uglify: {
			options: {
				mangle: false,
				compress: {
					drop_console: true
				},
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        					 '<%= grunt.template.today("yyyy-mm-dd") %> */'
			},
			my_target: {
				files: {
					'dist/js/slider.min.js': ['dist/js/slider.js']
				}
			}
		},

		copy: {
			main: {
				src: 'src/js/slider.js',
				dest: 'dist/js/slider.js',
			},
		},		

		sass: {                            
			dist: {                           
				options: {                      
					style: 'expanded',
					sourcemap: 'file'
				},
				files: {                        
					'src/css/slider.css': 'src/css/sass/slider.scss', 
					'dist/css/slider.css': 'src/css/sass/slider.scss',     
					'examples/css/main.css': 'examples/css/main.scss'
				}
			}
		},

		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'dist/css',
					src: ['*.css', '!*.min.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		}				
	});

	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.registerTask('js-beautifier', ['jsbeautifier']);	

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('js-uglify', ['uglify']);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('js-copy', ['copy']);	

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.registerTask('css-sass', ['sass']);

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('min-css', ['cssmin']);

};