const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

console.log("🔍 Cargando módulo upload.js");

// Asegúrate que existe el directorio de uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const uploadMiddleware = (req, res, next) => {
    console.log("⭐ Iniciando procesamiento de upload con formidable");
    
    // Configurar formidable
    const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        multiples: true,
        maxFileSize: 5 * 1024 * 1024 // 5MB
    });
    
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.error('❌ Error en formidable:', err);
            return res.status(400).json({ error: `Error en la carga de archivos: ${err.message}` });
        }
        
        // Procesar campos - extraer el primer valor de cada array
        req.body = {};
        Object.keys(fields).forEach(key => {
            // Extraer el primer valor del array para cada campo
            req.body[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
            console.log(`✅ Campo recibido: ${key} = ${req.body[key]}`);
        });
        
        // Procesar archivos
        req.files = [];
        if (files.images) {
            const imageFiles = Array.isArray(files.images) ? files.images : [files.images];
            
            req.files = imageFiles.map(file => {
                return {
                    originalname: file.originalFilename,
                    mimetype: file.mimetype,
                    path: file.filepath,
                    size: file.size,
                    buffer: fs.readFileSync(file.filepath)
                };
            });
        }
        
        console.log("✅ Upload procesado correctamente con formidable");
        console.log(`✅ Archivos recibidos: ${req.files.length}`);
        console.log(`✅ Campos recibidos: ${Object.keys(req.body).join(', ')}`);
        
        // Continuar con el siguiente middleware
        next();
    });
};

module.exports = uploadMiddleware; 