async function cargarDatos() {
    try {
        const response = await fetch('data.json'); 
        const data = await response.json();

        return data.datos; // Ahora accedemos a "datos"
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        return null;
    }
}

async function crearGrafica() {
    const datos = await cargarDatos();
    if (!datos) return;

    // Convertir objeto en listas para Chart.js
    const etiquetas = Object.keys(datos);
    const valores = Object.values(datos);

    // Ordenar de mayor a menor
    const ordenados = etiquetas.map((etiqueta, i) => ({ etiqueta, valor: valores[i] }))
                              .sort((a, b) => b.valor - a.valor);
    
    const ctx = document.getElementById('grafica').getContext('2d');

    const miGrafica = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ordenados.map(item => item.etiqueta),
            datasets: [{
                label: 'Valores',
                data: ordenados.map(item => item.valor),
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
            const etiquetasActualizadas = Object.keys(nuevosDatos);
            const valoresActualizados = Object.values(nuevosDatos);

            const ordenadosNuevos = etiquetasActualizadas.map((etiqueta, i) => ({ etiqueta, valor: valoresActualizados[i] }))
                                                         .sort((a, b) => b.valor - a.valor);

            miGrafica.data.labels = ordenadosNuevos.map(item => item.etiqueta);
            miGrafica.data.datasets[0].data = ordenadosNuevos.map(item => item.valor);
            miGrafica.update();
        }
    }, 5000);
}

crearGrafica();
