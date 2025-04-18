import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

// Registrar los componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

// Colores para el gráfico
const CHART_COLORS = {
  RESIDENCIAL: '#1E40AF',  // azul oscuro
  COMERCIAL: '#60A5FA',    // azul medio
  INDUSTRIAL: '#93C5FD',   // azul claro
  INSTITUCIONAL: '#3B82F6',       // azul principal
  RECREACIONAL: '#1D4ED8',     // azul intenso
  'Sin categoría': '#CBD5E1' // gris
};

export default function ProjectsChart({ projects = [] }) {
  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    // Contar proyectos por categoría
    const categories = {};
    
    // Si no hay proyectos, mostrar dummy data
    if (!Array.isArray(projects) || projects.length === 0) {
      return {
        labels: ['Sin proyectos'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#CBD5E1'],
            borderColor: ['#94A3B8'],
            borderWidth: 1,
          },
        ],
      };
    }

    // Contar proyectos por categoría
    projects.forEach(project => {
      const category = project.intention || 'Sin categoría';
      categories[category] = (categories[category] || 0) + 1;
    });

    // Convertir a formato para chart.js
    const labels = Object.keys(categories);
    const data = Object.values(categories);
    const backgroundColor = labels.map(label => CHART_COLORS[label] || '#CBD5E1');
    const borderColor = backgroundColor.map(color => color);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
        },
      ],
    };
  }, [projects]);

  // Opciones del gráfico
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    },
    cutout: '70%',
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">
          Distribución de Proyectos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] flex items-center justify-center">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
} 