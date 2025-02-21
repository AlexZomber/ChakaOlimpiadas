async function cargarDatos() {
    try {
        const response = await fetch('data.json'); 
        const data = await response.json();

        return data.datos; // Accede correctamente a la estructura del JSON
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return null;
    }
}

async function crearGrafica() {
    const datos = await cargarDatos();
    if (!datos) return;

    // Extrae los datos en listas separadas
    const labels = Object.keys(datos);
    const values = Object.values(datos);

    const ctx = document.getElementById('grafica').getContext('2d');
    
    const miGrafica = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valores',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y' // Hace que las barras sean horizontales
        }
    });

    setInterval(async () => {
        const nuevosDatos = await cargarDatos();
        if (nuevosDatos) {
            miGrafica.data.labels = Object.keys(nuevosDatos);
            miGrafica.data.datasets[0].data = Object.values(nuevosDatos);
            miGrafica.update();
        }
    }, 2000); // Actualiza cada 5 segundos
}

crearGrafica();
