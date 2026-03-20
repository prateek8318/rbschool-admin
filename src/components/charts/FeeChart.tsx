import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const FeeChart: React.FC = () => {
  const data = {
    labels: ['Collected', 'Pending'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#6366F1', '#E2E8F0'],
        borderWidth: 0,
        hoverOffset: 6,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 16,
          font: {
            family: 'Plus Jakarta Sans',
            size: 12,
          },
          color: '#64748B',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#6366F1',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        displayColors: true,
        callbacks: {
          label: (context: any) => `${context.label}: ${context.parsed}%`,
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  return <Doughnut data={data} options={options} height={180} />;
};
