async function cargarDatos() {
    try {
        const response = await fetch('data.json', { cache: "no-store" }); // Evita datos en caché
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
        type: 'bar',
        data: {
            labels: datos.labels,
            datasets: [{
                label: 'Ventas',
                data: datos.values,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        }
    });

    setInterval(async () => {
        const nuevosDatos = await cargarDatos();
        if (nuevosDatos) {
            miGrafica.data.labels = nuevosDatos.labels;
            miGrafica.data.datasets[0].data = nuevosDatos.values;
            miGrafica.update();
            console.log("Datos actualizados:", nuevosDatos); // Verifica en consola
        }
    }, 5000); // Actualiza cada 5 segundos
}

crearGrafica();
