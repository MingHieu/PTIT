import { useClassroom } from '@/layouts/ClassroomNavbarLayout';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { DefaultChart } from 'solid-chartjs';
import { onMount } from 'solid-js';

const GradeDistributionChart = ({ onViewChartData }) => {
  onMount(() => {
    Chart.register(
      BarController,
      LineController,
      Tooltip,
      LinearScale,
      CategoryScale,
      BarElement,
      PointElement,
      LineElement,
    );
  });

  const { students } = useClassroom();

  const getGradeDistribution = () => {
    const distribution = students().reduce((acc, student) => {
      const averageGrade = Math.floor(student.averageGrade);
      acc[averageGrade] = acc[averageGrade]
        ? [...acc[averageGrade], student]
        : [student];
      return acc;
    }, {});
    for (let i = 0; i <= 10; i++) {
      distribution[i] = distribution[i] || [];
    }
    return {
      labels: Object.keys(distribution),
      data: Object.values(distribution),
    };
  };

  const chartData = () => ({
    labels: getGradeDistribution().labels,
    datasets: [
      {
        type: 'bar',
        label: 'Số sinh viên',
        data: getGradeDistribution().data.map(d => d.length),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barPercentage: 0.5,
      },
      {
        type: 'line',
        label: 'Số sinh viên',
        data: getGradeDistribution().data.map(d => d.length),
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  });

  /**
   * @type {import('chart.js').ChartOptions}
   */
  const chartOptions = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    onClick: (event, elements) => {
      const index = elements[0].index;
      const data = getGradeDistribution().data[index];
      onViewChartData(data);
    },
  };

  return (
    <div class="bg-white border p-6 rounded-lg space-y-4">
      <h2 class="text-xl font-bold">Phân phối điểm</h2>
      <DefaultChart data={chartData()} options={chartOptions} height={150} />
    </div>
  );
};

export default GradeDistributionChart;
