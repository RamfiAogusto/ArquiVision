import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones de proyectos
export const getProjects = async () => {
  console.log('🔍 Iniciando getProjects en supabase.js');
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_position', { ascending: true })
  
  if (error) {
    console.error('❌ Error en getProjects:', error);
    throw error
  }
  
  console.log('🔍 Datos recibidos en getProjects:', data);
  console.log('🔍 Campos del primer proyecto:', data && data.length > 0 ? Object.keys(data[0]) : 'No hay proyectos');
  
  return data
}

export const getProjectById = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export const createProject = async (projectData) => {
  // Eliminar los campos area y order_position si existen como propiedades directas
  const { area, order_position, ...cleanProjectData } = projectData;
  
  // Obtener el máximo order_position actual
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('projects')
    .select('order_position')
    .order('order_position', { ascending: false })
    .limit(1);
    
  if (maxOrderError) {
    console.error('Error al obtener máximo order_position:', maxOrderError);
    throw maxOrderError;
  }
  
  // Calcular el nuevo order_position (máximo actual + 1 o 0 si no hay proyectos)
  const newOrderPosition = maxOrderData && maxOrderData.length > 0 
    ? (maxOrderData[0].order_position || 0) + 1 
    : 0;
  
  // Añadir el order_position calculado automáticamente
  const dataToInsert = {
    ...cleanProjectData,
    order_position: newOrderPosition
  };
  
  console.log('Creando proyecto con order_position automático:', newOrderPosition);
  
  const { data, error } = await supabase
    .from('projects')
    .insert([dataToInsert])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export const updateProject = async (id, projectData) => {
  // Eliminar el campo area si existe como propiedad directa
  const { area, ...cleanProjectData } = projectData;
  
  const { data, error } = await supabase
    .from('projects')
    .update(cleanProjectData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

export const reorderProjects = async (projectOrders) => {
  const updates = projectOrders.map(({ id, order_position }) => 
    supabase
      .from('projects')
      .update({ order_position })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(result => result.error)
  
  if (errors.length > 0) {
    throw new Error('Error al actualizar el orden de los proyectos')
  }
}

// Funciones de almacenamiento
export const uploadFile = async (file, path) => {
  const { data, error } = await supabase.storage
    .from('project-files')
    .upload(path, file)
  
  if (error) throw error
  return data
}

export const getFileUrl = (path) => {
  const { data } = supabase.storage
    .from('project-files')
    .getPublicUrl(path)
  return data.publicUrl
}

export const deleteFile = async (path) => {
  const { error } = await supabase.storage
    .from('project-files')
    .remove([path])
  
  if (error) throw error
} 