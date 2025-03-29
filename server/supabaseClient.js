require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Variables de entorno para la conexión a Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Verificar que las variables de entorno están definidas
if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Variables de entorno SUPABASE_URL y SUPABASE_KEY deben estar definidas');
    process.exit(1);
}

// Crear y exportar el cliente de Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Cliente Supabase creado exitosamente');

// Prueba simple de conexión
supabase.from('test').select('*').limit(1)
    .then(() => console.log('Conexión a Supabase verificada'))
    .catch(err => console.error('Error al verificar conexión:', err));

module.exports = supabase;
