## Gulp boilerplate

A front-end workflow for creating Bootstrap themes using Gulp

### Setup

Clone the repo:
```
git clone https://gitlab.com/danielyewright/gulp-theme-starter.git
```

Install dependencies:

`npm install` or `yarn`

Run the default task:
```
gulp
```

### Usage

The gulpfile has the following tasks:
- `default`
- `build`
- `clean`
- `zip`
- `delete`

Use `gulp` to run the default task and navigate to [http://localhost:3000](http://localhost:3000) to view the project. As you modify files, the browser will automatically refresh to reflect the changes.

### Packaging/Deployment

`gulp build` will create a zip file containing all files in the `dist` directory. The zip file is named based on the project name and version in `package.json`.
