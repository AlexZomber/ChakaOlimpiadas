async function cargarDatos() {
    try {
        const response = await fetch('data.json'); 
        const data = await response.json();

        return data.datos; // Se accede correctamente a los valores dentro del JSON
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return null;
    }
}

async function crearGrafica() {
    const datos = await cargarDatos();
    if (!datos) return;

    // Convertir los datos en un array ordenado de mayor a menor
    const datosOrdenados = Object.entries(datos)
        .sort((a, b) => b[1] - a[1]); // Ordena por valor numérico descendente

    const labels = datosOrdenados.map(item => item[0]); // Meses
    const values = datosOrdenados.map(item => item[1]); // Valores

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
            const datosActualizados = Object.entries(nuevosDatos)
                .sort((a, b) => b[1] - a[1]); 

            miGrafica.data.labels = datosActualizados.map(item => item[0]);
            miGrafica.data.datasets[0].data = datosActualizados.map(item => item[1]);
            miGrafica.update();
        }
    }, 5000); // Actualiza cada 5 segundos
}

crearGrafica();
