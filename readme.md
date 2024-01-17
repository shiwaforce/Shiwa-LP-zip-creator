# Shiwa LP Zip Creator NPM Package

## Overview

The Shiwa LP Zip Creator is an npm package that enables the conversion of static single-page applications (SPA) into LP zip format files. These files can be directly used in CMS systems as landing pages.

## Prerequisites

Installation of Node.js in the development environment.
An existing SPA project that you wish to convert into LP zip format.

## Installation

Install the shiwa-lp-zip-creator package in your project using the following command:

```bash
npm install shiwa-lp-zip-creator --save-dev
```

This command adds the package to your project's devDependencies.

## Configuration

To use the package, add the following script to your package.json file:

```json
{
    "scripts": {
        "create-lp-zip": "shiwa-lp-zip-creator <source directory path> <output file path>.zip"
    }
}
```
Replace `<source directory path>` and `<output file path>` with the appropriate paths.

## Creating an LP Zip File

To create an LP zip file, run the following command:

```bash
npm run create-lp-zip
```

This command starts the conversion process, which creates an LP zip file from the specified source directory and saves it at the specified output location.

## Error Handling

The package includes error handling features that notify the user if any errors occur during the conversion process. Such errors can include:

- Incorrect source directory or output file path.
- Technical issues in the conversion process.

## Additional Information

You can find this detailed documentation and possible settings of the shiwa-lp-zip-creator package on its npm page.

## Integration

### React Application Integration

#### Updating the Build Script

In the package.json file of your React project, update the build script to automatically run the shiwa-lp-zip-creator script after the build process. For example:

```json
    ...
    "scripts": {
        "build": "react-scripts build && shiwa-lp-zip-creator build <output file path>.zip",
        "create-lp-zip": "shiwa-lp-zip-creator build <output file path>.zip"
    }
    ...
```

In this example, replace `<output file path>` with the desired output file path.

#### Running the Build Command

When you run the npm run build command, the React application's build is created first, and then the shiwa-lp-zip-creator creates an LP zip file at the specified location.

### Vue.js Application Integration

#### Updating the Build Script

Similarly, in a Vue.js project, modify the build script in the package.json file:

```json
    ....
    "scripts": {
        "build": "vue-cli-service build && shiwa-lp-zip-creator dist <output file path>.zip",
        "create-lp-zip": "shiwa-lp-zip-creator dist <output file path>.zip"
    }
    ...
```

Here again, replace `<output file path>` with your own path.

#### Running the Build Command

When you run the npm run build command, after the Vue.js application is built, the shiwa-lp-zip-creator automatically creates an LP zip file at the specified output location.

With these steps, the shiwa-lp-zip-creator can be easily integrated into existing React and Vue.js application build processes, automating the creation of LP zip files. This integration not only saves time but also ensures that the latest versions are uploaded to the CMS system.
