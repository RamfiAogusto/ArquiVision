import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funciones de proyectos
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('order_position', { ascending: true })
  
  if (error) throw error
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
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const updateProject = async (id, projectData) => {
  const { data, error } = await supabase
    .from('projects')
    .update(projectData)
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