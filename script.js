async function cargarDatos() {
    try {
        const response = await fetch('data.json'); 
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

    // Ordenar los datos de mayor a menor
    const datosOrdenados = datos.values
        .map((value, index) => ({ value, label: datos.labels[index] }))
        .sort((a, b) => b.value - a.value);

    // Actualizar las etiquetas y los valores ordenados
    const labelsOrdenadas = datosOrdenados.map(item => item.label);
    const valuesOrdenados = datosOrdenados.map(item => item.value);

    const ctx = document.getElementById('grafica').getContext('2d');
    
    const miGrafica = new Chart(ctx, {
        type: 'bar',  // Tipo de gráfico de barras
        data: {
            labels: labelsOrdenadas,
            datasets: [{
                label: 'Ventas',
                data: valuesOrdenados,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',  // Esto asegura que las barras sean horizontales
            responsive: true, // Asegura que la gráfica sea adaptable a diferentes tamaños de pantalla
            scales: {
                x: {
                    beginAtZero: true  // Esto asegura que el eje X comienza en cero
                },
                y: {
                    beginAtZero: true  // Esto asegura que el eje Y comienza en cero
                }
            }
        }
    });

    setInterval(async () => {
        const nuevosDatos = await cargarDatos();
        if (nuevosDatos) {
            // Repetir el mismo proceso de ordenamiento
            const nuevosDatosOrdenados = nuevosDatos.values
                .map((value, index) => ({ value, label: nuevosDatos.labels[index] }))
                .sort((a, b) => b.value - a.value);

            miGrafica.data.labels = nuevosDatosOrdenados.map(item => item.label);
            miGrafica.data.datasets[0].data = nuevosDatosOrdenados.map(item => item.value);
            miGrafica.update();
        }
    }, 5000); // Actualiza cada 5 segundos
}

crearGrafica();
