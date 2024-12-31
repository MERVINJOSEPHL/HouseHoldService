export default {
  props: ['dataval', 'type', 'labels', 'datasetlabel', 'backgroundColor'],
  template: `
    <div id="app">
      <canvas ref="myChart"></canvas>
    </div>
  `,
  data() {
    return {
      chart: null // Reference to the Chart instance
    };
  },
  mounted() {
    const ctx = this.$refs.myChart.getContext('2d');
    this.chart = new Chart(ctx, {
      type: this.type,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.datasetlabel,
          data: this.dataval,
          backgroundColor: this.backgroundColor, // Array of colors
          borderWidth: 1,
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
              display: false ,
               
            },
            
          },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  },
  watch: {
    dataval(newData) {
      this.chart.data.datasets[0].data = newData;
      this.chart.update();
    }
  }
};
