// Gráfico de barras para mostrar la asistencia de clientes

const ctx = document.getElementById('clientAttended');
new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm', '12am'],
        datasets: [{
            label: 'Asistencia de clientes',
            data: [100, 60, 75, 30, 40, 60, 90, 120, 80, 50],
            backgroundColor: '#9A6AFF',
            borderWidth: 0.5,
            borderColor: '#9A6AFF',
            borderRadius: 5,
            //borderSkipped: false // Asegúrate de que los bordes redondeados se apliquen a todas las esquinas (inferiores y superiores)
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: false
        }
    }
});
// Gráfico de líneas para mostrar las ganancias
const ctx2 = document.getElementById('Income');
new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Ganancias',
            data: [1200, 1900, 3000, 5000, 4000, 6000, 7000, 8000, 9000, 10000, 11000, 12000],
            backgroundColor: 'rgba(154, 106, 255, 0.2)',
            borderColor: '#3E71D2',
            borderWidth: 3,
            borderRadius: 15,
            fill: false, // Rellenar el área bajo la línea
            tension: 0.5
        }]
    },
    options: {
        responsive: true,
        // interaction: {
        //   mode: 'index',
        //   intersect: false
        // },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return '$' + tooltipItem.raw.toLocaleString(); // Formatear el valor con separador de miles
                    }
                }
            }
        }
    }
});