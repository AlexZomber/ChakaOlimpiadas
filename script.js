// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",  // Obtén tu API Key desde la consola de Firebase
  authDomain: "chakaolimpiadas.firebaseapp.com",  // El dominio de tu proyecto
  databaseURL: "https://chakaolimpiadas-default-rtdb.firebaseio.com/",  // La URL de tu base de datos
  projectId: "chakaolimpiadas",  // El ID de tu proyecto
  storageBucket: "chakaolimpiadas.appspot.com",  
  messagingSenderId: "TU_SENDER_ID",  
  appId: "TU_APP_ID"
};

// Inicializa Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Cargar datos desde Firebase
async function cargarDatos() {
    try {
        const snapshot = await database.ref('datos').once('value');
        const data = snapshot.val();  // Obtiene los datos como objeto
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
            labels: Object.keys(datos),  // Los meses como etiquetas
            datasets: [{
                label: 'Valores',
                data: Object.values(datos),  // Los valores de los meses
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y' // Cambiar la dirección de las barras a horizontal
        }
    });

    // Escuchar cambios en la base de datos y actualizar la gráfica en tiempo real
    database.ref('datos').on('value', snapshot => {
        const nuevosDatos = snapshot.val();
        if (nuevosDatos) {
            miGrafica.data.labels = Object.keys(nuevosDatos);
            miGrafica.data.datasets[0].data = Object.values(nuevosDatos);
            miGrafica.update();
        }
    });
}

crearGrafica();
