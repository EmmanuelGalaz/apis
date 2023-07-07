// Selección de elementos del DOM
const mensajesError = document.querySelectorAll(".error");
const btnBuscar = document.querySelector("#btn");
const resultado = document.querySelector("#resultado");
const chartDOM = document.getElementById("myChart");

// Evento click en el botón de búsqueda
btnBuscar.addEventListener("click", () => {
    let pesosClp = document.querySelector("#monedaNac").value;
    var monedaExtra = document.getElementById("monedaExtra").value;

    if (pesosClp !== "") {
        getMonedas(pesosClp, monedaExtra);

        // Destruir el gráfico existente si hay alguno
        let chartStatus = Chart.getChart("myChart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
    } else {
        // Mostrar mensaje de error si no se ingresó una cantidad
        alert("Favor ingrese una cantidad");
    }
});

// Función asincrónica para obtener datos de las monedas
async function getMonedas(pesosClp, monedaExtra) {
    try {
        // Obtener datos de la API
        const res = await fetch(`https://mindicador.cl/api/${monedaExtra}`);
        const monedas = await res.json();
        console.log(monedas);

         // Obtener el símbolo de la moneda
         const simboloMoneda = monedas.codigo === "USD" ? "$" : monedas.codigo === "EUR" ? "€" : "";

        // Mostrar resultado en el DOM
        resultado.innerHTML = `${(pesosClp / parseFloat(monedas.serie[0].valor)).toFixed(2)} ${simboloMoneda}${monedas.nombre}`;

        // Obtener los últimos valores de las monedas
        const monedasUltimosValores = monedas.serie.map((x) => x.valor);

        // Obtener los días de los últimos valores
        const diasMonedas = monedas.serie.map((e) => e.fecha.slice(5, 10));

        // Preparar configuración para la gráfica
        prepararConfiguracionParaLaGrafica(diasMonedas, monedasUltimosValores);

        return monedas;
    } catch (e) {
        // Mostrar mensaje de error en caso de fallo
        let error = "¡Algo salió mal! Error: " + (e.message);
        mensajeError.innerHTML = error;
    }
}

// Función para preparar la configuración de la gráfica
function prepararConfiguracionParaLaGrafica(diasMonedas, monedasUltimosValores) {
    // Configuración de la gráfica
    const tipoDeGrafica = "line";
    const titulo = "Valor de la moneda en los últimos días";
    const colorDeLinea = "#d32f2f";

    // Obtener los últimos 10 días y valores de las monedas
    let dias = diasMonedas.slice(0, 10).reverse();
    console.log(dias);
    let valores = monedasUltimosValores.slice(0, 10).reverse();
    console.log(valores);

    // Configuración de los datos para la gráfica
    const configMonedas = {
        type: tipoDeGrafica,
        data: {
            labels: dias,
            datasets: [
                {
                    label: titulo,
                    borderColor: colorDeLinea,
                    data: valores,
                }
            ]
        }
    };

    const config = configMonedas;

    // Crear nueva instancia de la gráfica
    new Chart(chartDOM, config);
}
