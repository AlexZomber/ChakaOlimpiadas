const urlFirebase = 'https://chakaolimpiadas-default-rtdb.firebaseio.com/datos.json';

async function cargarDatos() {
    try {
        const response = await fetch(urlFirebase); 
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return null;
    }
}

async function crearGrafica() {
    const datos = await cargarDatos();
    if (!datos) return;

    const ctx = document.getElementById('grafica').getContext('2d');
    
    const miGrafica = new Chart(ctx, {
        type: 'bar', // Cambiado a 'bar' para barras horizontales
        data: {
            labels: Object.keys(datos), // Usamos las claves del objeto como etiquetas (por ejemplo, "Enero", "Febrero", etc.)
            datasets: [{
                label: 'Ventas',
                data: Object.values(datos), // Usamos los valores del objeto como los datos de la gráfica
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Esto cambia las barras a horizontales
            responsive: true, 
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });

    setInterval(async () => {
        const nuevosDatos = await cargarDatos();
        if (nuevosDatos) {
            miGrafica.data.labels = Object.keys(nuevosDatos);
            miGrafica.data.datasets[0].data = Object.values(nuevosDatos);
            miGrafica.update();
        }
    }, 5000); // Actualiza cada 5 segundos
}

crearGrafica();
