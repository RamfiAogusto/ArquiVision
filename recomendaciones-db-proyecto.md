# Recomendaciones para implementar la interfaz mejorada de detalle de proyecto

## Estructura actual de la base de datos (tabla 'projects')

Actualmente, la tabla `projects` en la base de datos tiene la siguiente estructura:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid | Identificador único del proyecto |
| name | varchar | Nombre del proyecto |
| title | varchar | Título del proyecto (parece duplicado con name) |
| description | text | Descripción detallada del proyecto |
| location | varchar | Ubicación del proyecto |
| size | int4 | Tamaño/área del proyecto en metros cuadrados |
| client | varchar | Nombre del cliente |
| images | text[] | Array de URLs de imágenes |
| created_at | timestamp | Fecha de creación |
| updated_at | timestamp | Fecha de última actualización |
| is_active | bool | Estado activo/inactivo del proyecto |
| order_position | int4 | Posición para ordenar los proyectos |
| intention | project_id | Categoría/tipo del proyecto (enum) |
| metadata | jsonb | Datos adicionales en formato JSON |
| status | varchar | Estado del proyecto (active, inactive) |

## Cambios recomendados en la base de datos

No es necesario realizar cambios estructurales importantes en la base de datos, ya que la tabla `projects` ya contiene un campo `metadata` de tipo `jsonb` que permite almacenar información adicional de manera flexible.

### Estandarización de campos

1. **Decidir entre `name` y `title`**: 
   - Ambos campos parecen cumplir la misma función
   - Recomendación: Mantener `name` como el campo principal y asegurar que esté sincronizado con `title`

2. **Uso de `metadata` para información adicional**:
   - Continuar usando el campo `metadata` para almacenar:
     - `attributes`: Atributos personalizados del proyecto
     - `links`: Enlaces externos relacionados con el proyecto
     - `area`: Área en metros cuadrados (como alternativa al campo `size`)

### Datos adicionales a incluir en `metadata`

```json
{
  "attributes": [
    { "key": "Estructura", "value": "Hormigón armado" },
    { "key": "Fachada", "value": "Hormigón visto y madera" },
    { "key": "Certificación", "value": "LEED Gold" }
  ],
  "links": [
    "https://ejemplo.com/planos",
    "https://ejemplo.com/estudio-sostenibilidad"
  ],
  "area": "250",
  "anoConstruccion": 2023,
  "ubicacion": {
    "ciudad": "Valencia",
    "pais": "España"
  }
}
```

## Implementación en el lado del servidor

### 1. Asegurar que la API devuelve la información completa

```javascript
// Ejemplo de endpoint para obtener un proyecto con toda su información
app.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Proyecto no encontrado' });
    
    // Procesar metadatos si existen
    if (data.metadata) {
      try {
        if (typeof data.metadata === 'string') {
          data.metadata = JSON.parse(data.metadata);
        }
      } catch (e) {
        console.error('Error al parsear metadata:', e);
      }
    }
    
    return res.json(data);
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
});
```

### 2. Adaptaciones en los formularios de creación/edición

Ya se tienen implementados los campos para:
- Atributos personalizados (attributes)
- Enlaces externos (links)
- Área (area)

Considerar agregar campos adicionales:
- Año de construcción
- Ciudad/país como campos separados (actualmente solo hay un campo `location`)

## Guía para los usuarios (administradores)

1. **Creación de proyectos**:
   - Asegurarse de completar todos los campos básicos (nombre, descripción, categoría)
   - Añadir atributos técnicos relevantes usando el sistema de atributos personalizados
   - Agregar enlaces a recursos externos (planos, documentos, publicaciones)
   - Subir múltiples imágenes de buena calidad (la primera será la principal)

2. **Edición y organización**:
   - Usar el campo `order_position` para controlar el orden de los proyectos
   - Mantener actualizados los estados de los proyectos mediante el campo `status`
   - Asegurar que la primera imagen sea la más representativa del proyecto

## Consideraciones técnicas

1. **Rendimiento**:
   - Las imágenes deben optimizarse antes de subirse
   - Considerar implementar lazy loading para las imágenes adicionales
   - Para proyectos con muchas imágenes, considerar paginación en el carrusel

2. **SEO y accesibilidad**:
   - Los atributos `alt` de las imágenes deben ser descriptivos
   - La estructura semántica del HTML debe mantenerse para mejor SEO
   - Todos los controles interactivos deben ser accesibles mediante teclado

3. **Responsive design**:
   - La interfaz ya implementa un diseño adaptativo para diferentes dispositivos
   - Verificar la visualización del carrusel en dispositivos móviles
   - Asegurar que los textos sean legibles en todas las resoluciones

## Implementación de la navegación entre proyectos

La navegación entre proyectos anterior/siguiente ya está implementada en el componente. Esta funcionalidad utiliza el campo `order_position` para determinar el orden de los proyectos.

Para garantizar que funcione correctamente:
1. Asegurarse de que todos los proyectos tengan un valor único en `order_position`
2. Mantener actualizados estos valores al añadir o eliminar proyectos
3. Considerar implementar una función o trigger en la base de datos para mantener la consistencia de este campo

## Próximos pasos y mejoras futuras

1. **Implementar categorización mejorada**:
   - Filtrado de proyectos por diferentes atributos
   - Tags o etiquetas adicionales para clasificación

2. **Galería de imágenes avanzada**:
   - Soporte para videos
   - Imágenes 360°
   - Planos interactivos

3. **Integración con redes sociales**:
   - Mostrar comentarios o reacciones de redes sociales
   - Integración con Instagram o Pinterest

4. **Análisis y métricas**:
   - Seguimiento de qué proyectos son más visitados
   - Tiempo promedio de visualización
   - Conversiones (contactos generados por cada proyecto) 