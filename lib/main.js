#!/usr/bin/env node

const fs = require('fs');
const glob = require('glob');
const fsExtra = require('fs-extra');
const archiver = require('archiver');
const path = require('path');
const { create, cdata, element } = require('xmlbuilder2');


// Check if the correct command line arguments are provided
if (process.argv.length < 4) {
    console.error('Usage: node script.js <sourceDirectory> <outputZipFile>');
    process.exit(1);
}

const sourceDirectory = process.argv[2];
const outputZipFile = process.argv[3];

// Check if the source directory exists
if (!fs.existsSync(sourceDirectory) || !fs.lstatSync(sourceDirectory).isDirectory()) {
    console.error('Source directory does not exist or is not a directory.');
    process.exit(1);
}

// Create a temporary directory for reorganizing files
const tempDirectory = path.join(sourceDirectory,'..', 'temp');

// Create the temporary directory
fsExtra.ensureDirSync(tempDirectory);

const htmlFiles=[];
const jsFiles=[];
const styleFiles=[];


const promises = [];
// Recursively copy files from the source directory
function copyFiles(/*extension, destinationDirectoryByExtension,needNames=false*/) {
    const filesToCopy = glob.sync(`${sourceDirectory}/**/*.*`);

    filesToCopy.forEach((file) => {
        
        const relativePath = path.relative(sourceDirectory, file);
        let destinationPath = '';
        destinationPath = path.join(tempDirectory, 'html', relativePath);
        console.log(`Copying ${relativePath} to ${destinationPath}`)
        // Ensure the destination directory exists
        fsExtra.ensureDirSync(path.dirname(destinationPath));

        // Copy the file to the destination directory

        // Delete the file from the source directory
            if (path.basename(file).split('.').pop() == 'html'){
                htmlFiles.push(file);
                fs.copyFileSync(file, destinationPath);
            }
            else if (path.basename(file).split('.').pop()=='js'){
                jsFiles.push(file);
                const promise = new Promise((resolve, reject) => {

                    let content = ''
                    fs.readFile(file, 'utf8', function (err, data) {
                        content = data.replace('="/', `="${path.join("sw","static","landing-pages",path.basename(outputZipFile, '.zip'),"html")}/`);
                        fs.writeFileSync(destinationPath, content);
                    });
                    resolve();
                });
                /*fs.copyFileSync(file, destinationPath);*/
                promises.push(promise);
            }
            else if (path.basename(file).split('.').pop()=='css'){
                styleFiles.push(file);
                fs.copyFileSync(file, destinationPath);
            } else {
                fs.copyFileSync(file, destinationPath);
            }
    });
}

copyFiles();



// Convert JSON to XML
Promise.all(promises).then(() => {
    const xml = create({version: '1.0', encoding: 'UTF-8'})
        .ele('lp_config');

    htmlFiles.forEach((file) => {
        xml.ele('html', {pageID: path.basename(file, '.html')}, path.basename(file));
    });
    const headerStatic = xml.ele('header_static');
    jsFiles.forEach((file) => {
        headerStatic.ele('script', {
            type: 'text/javascript',
            src: path.join('sw', 'static', 'landing-pages', path.basename(outputZipFile, '.zip'), 'html', path.relative(sourceDirectory, file))
        }).txt('');
    });
    styleFiles.forEach((file) => {
        headerStatic.ele('link', {
            rel: 'stylesheet',
            type: 'text/css',
            href: path.join('sw', 'static', 'landing-pages', path.basename(outputZipFile, '.zip'), 'html', path.relative(sourceDirectory, file))
        }).txt('');
    });
    /*xml.ele('header_static', cdata(`
      <link rel="stylesheet" type="text/css" href="/sw/static/landing-pages/pro01-promo/static/pro01-promo.css" />
      <script type="text/javascript" src="/sw/static/landing-pages/pro01-promo/static/js/lib/jquery/1.10.0/jquery-1.11.0.min.js"></script>
    `));*/

    const generatedXml = xml.end({
        prettyPrint: true,
        allowEmptyTags: true,
    });
// Write XML to a temporary file
    console.log(generatedXml);
    const replaced = generatedXml.replace('<header_static>', '<header_static><![CDATA[').replace('</header_static>', ']]></header_static>');
    const xmlFilePath = path.join(tempDirectory, 'config', 'config.xml');
    fsExtra.ensureDirSync(path.dirname(xmlFilePath));
    fs.writeFileSync(xmlFilePath, replaced);

// Create a writable stream for the zip file
    const output = fs.createWriteStream(outputZipFile);

// Create a new zip archive
    const archive = archiver('zip', {
        zlib: {level: 9}, // Compression level
    });

// Pipe the archive to the output stream
    archive.pipe(output);

// Add all files from the temporary directory into the zip file
    archive.directory(tempDirectory, false);

// Finalize the archive and close the output stream
    archive.finalize();

    output.on('close', () => {
        console.log(`Successfully created ${outputZipFile}`);
        fs.rmSync(tempDirectory, {recursive: true, force: true});
    });

    output.on('error', (err) => {
        console.error('Error creating zip file:', err);
        fs.rmSync(tempDirectory, {recursive: true, force: true});
    });
});
