gulp   = require 'gulp'
shell  = require 'gulp-shell'
coffee = require 'gulp-coffee'
sass   = require 'gulp-sass'
jade   = require 'gulp-react-jade'
rename = require 'gulp-rename'
sourcemaps = require 'gulp-sourcemaps'

gulp.task 'default', ['build']
gulp.task 'build', [
  'npm:install'
  'build:editor'
  'build:ts'
  'build:api'
  'copy:json'
  'build:coffee'
  'build:jade'
  'build:css'
]

# TypeScript
gulp.task 'build:ts', ['build:api'], shell.task [
  'node_modules/.bin/tsc -d -m commonjs  --preserveConstEnums -t es5 --sourceMap --outDir lib src/application.ts'
]

gulp.task 'npm:install', shell.task [
  'npm install'
]
gulp.task 'build:api', shell.task [
  'cd api; yarn setup'
  'cd api; yarn build'
]

gulp.task 'build:coffee', ->
  gulp.src('src/**/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('lib'))

gulp.task 'copy:json', ->
  gulp.src('src/**/*.json')
    .pipe(gulp.dest('lib'))

gulp.task 'build:jade', ->
  gulp.src('src/**/*.jade')
    .pipe jade()
    .pipe(gulp.dest('lib'))

gulp.task 'build:editor', ['build'], shell.task [
  'cp node_modules/markdown-editor/dist/bundle.js public/js/markdown-editor.js'
]

gulp.task 'build:editor', ->
  gulp.src('node_modules/markdown-editor/dist/bundle.js')
    .pipe(rename("markdown-editor.js"))
    .pipe(gulp.dest('public/js'))

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.coffee', ['build:coffee']
  gulp.watch 'src/**/*.json', ['copy:json']
  gulp.watch 'src/**/*.ts', ['build:ts']
  gulp.watch 'src/**/*.jade', ['build:jade']
  gulp.watch 'src/styles/**/*.scss', ['build:css']

  gulp.watch 'package.json', ['npm:install']
  gulp.watch 'api/src/**/*.ts', ['build:api']
  # gulp.watch 'lib/**/*.js', ['build:web']

gulp.task 'build:css', ->
  gulp
    .src [
      'src/styles/default-theme.scss'
      'src/styles/dark-theme.scss'
      'src/styles/markdown_content_default.scss'
      'src/styles/markdown_content_dark.scss'
    ]
    .pipe(sass())
    .pipe(gulp.dest('public/css'))

envifyCommand = '-t [envify --GIT_HASH $(git rev-parse HEAD) --BUILT_DATE $(date +"%Y/%m/%d %p %I:%M:%S") ]'

gulp.task 'build:web', ['build'], shell.task [
  "browserify #{envifyCommand} -t brfs lib/index.js -p licensify -o public/js/bundle.js"
  'browserify lib/preview.js -t brfs -p licensify -o public/js/preview-bundle.js'
]

gulp.task 'generate:twemoji', shell.task [
  '''echo '$twemoji-codes: (' > src/styles/variables/_twemoji_codes.scss'''
  '''
  find public/assets/twemoji/svg -name '*.svg' \
    | sed 's|.*/\\([^/]*\\)\\.svg$|  "\\1"|' \
    | sort \
    >> src/styles/variables/_twemoji_codes.scss
  '''
  '''echo ');' >> src/styles/variables/_twemoji_codes.scss'''
]
