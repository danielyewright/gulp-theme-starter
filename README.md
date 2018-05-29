## Gulp Theme Starter

A front-end workflow for creating Bootstrap themes using Gulp

### Setup

Clone the repo:
```
git clone https://github.com/danielyewright/gulp-theme-starter.git
```

Install dependencies:

`npm install` or `yarn`

Run the default task:
```
yarn start
```

Or if you're using NPM:
```
npm start
```

### Usage

The gulpfile has the following tasks:
- `default`
- `build`
- `clean`
- `zip`
- `delete`

Use `yarn start` (or `npm start` if using npm) to run the default task and navigate to [http://localhost:3000](http://localhost:3000) to view the project. As you modify files, the browser will automatically refresh to reflect the changes.

### Packaging/Deployment

`yarn build` (or `npm run build` if using npm) will create a zip file containing all files in the `dist` directory. The zip file is named based on the project name and version in `package.json`.
