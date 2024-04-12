const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf-parse');

// Ruta a la carpeta donde se encuentran los archivos PDF
const folderPath = 'C:/Users/mcobos/Desktop/pdf';

// Patron para buscar dentro de la primer hoja del PDF
const pattern = /\d{4}-\d{8}/;

// Leer archivos en la carpeta
fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Error al leer la carpeta:', err);
    return;
  }

  // Iterar sobre cada archivo en la carpeta
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    if (path.extname(filePath).toLowerCase() === '.pdf') {
      // Parsear el archivo PDF
      fs.promises.readFile(filePath).then(async data => {
        const pdfData = await PDFParser(data);
        const pageText = pdfData.text;

        // Buscar el patrón dentro del texto
        const matches = pageText.match(pattern);
        if (matches) {
          // Generar el nuevo nombre de archivo
          const newFileName = matches[0] + '.pdf';
          const newFilePath = path.join(folderPath, newFileName);

          // Renombrar el archivo
          fs.promises.rename(filePath, newFilePath).then(() => {
            console.log(`Archivo ${file} renombrado a: ${newFileName}`);
          }).catch(error => {
            console.error(`Error al renombrar el archivo ${file}:`, error);
          });
        } else {
          console.log(`No se encontró el patrón en ${file}`);
        }
      }).catch(error => {
        console.error(`Error al cargar el archivo PDF ${file}:`, error);
      });
    } else {
      console.log(`${file} no es un archivo PDF`);
    }
  });
});
