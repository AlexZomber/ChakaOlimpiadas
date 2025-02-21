// Inicializa Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDJkeGz-QYkUwC-w97l8y8qNhFq_JtqFcQ",
  authDomain: "chakaolimpiadas.firebaseapp.com",
  databaseURL: "https://chakaolimpiadas-default-rtdb.firebaseio.com",
  projectId: "chakaolimpiadas",
  storageBucket: "chakaolimpiadas.appspot.com",
  messagingSenderId: "953314053942",
  appId: "1:953314053942:web:7b5d8c4244e95dbb2a929e"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Función para obtener los datos desde Firebase
async function cargarDatos() {
  try {
    const snapshot = await database.ref('datos').once('value'); // Obtén los datos desde la referencia 'datos'
    const data = snapshot.val(); // Extrae los valores del snapshot
    return data;
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    return null;
  }
}

// Función para crear y actualizar la gráfica
async function crearGrafica() {
  const datos = await cargarDatos();
  if (!datos) return;

  const ctx = document.getElementById('grafica').getContext('2d');
  
  // Configuración de la gráfica
  const miGrafica = new Chart(ctx, {
    type: 'bar',  // Tipo de gráfica: 'bar' para barras
    data: {
      labels: Object.keys(datos),  // Extrae las claves (meses)
      datasets: [{
        label: 'Ventas',
        data: Object.values(datos),  // Extrae los valores (números de ventas)
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',  // Establece la orientación horizontal para las barras
      responsive: true, // Hacerla responsiva
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });

  // Actualiza la gráfica cada 5 segundos
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
