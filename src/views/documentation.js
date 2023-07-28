let d = document;
d.addEventListener('DOMContentLoaded', () => {
  d.addEventListener('click', (e) => {
    if (e.target.matches('#step-module')) {
      StepAlertV2([
        {
          title: 'Importar un módulo',
          html: html1,
        },
        {
          title: 'Configuración Modulo 1 / 2',
          html: html2,
        },
        {
          title: 'Configuración Modulo 2 / 2',
          html: html3,
        },
        {
          title: 'Finalización',
          html: html4,
        },
      ]);
    } else if (e.target.matches('#step-quote')) {
      StepAlertV2([
        {
          title: 'Importar una Plantilla de Cotización',
          html: html5,
        },
        {
          title: 'Configuración Modulo 1 / 3',
          html: html6,
        },
        {
          title: 'Configuración Modulo 2 / 3',
          html: html7,
        },
        {
          title: 'Configuración Modulo 3 / 3',
          html: html8,
        },
        {
          title: 'Resumen y Finalización',
          html: html9,
        },
      ]);
    } else if (e.target.matches('#step-products')) {
      console.log('products');
      e.preventDefault();
    }
  });
});

let html1 = `
  <h5>Importar un módulo del cotizador</h5>
  <p class="mb-3">Para la fácil implementación del Cotizador Inmobiliario dentro de un portal, 
    se utilizó un módulo que se agregan dentro de una página web y el usuario pueda interactuar con la Aplicación,
    debido a algunas limitaciones de Hubspot el módulo se carga al portal de forma manual.</p>
  <p class="mb-3">
    Se necesita permiso temporal del portal destino donde se realizó la instalación para exportar los módulos del portal origen.
  </p>
  <div class="mb-3">
    <img src="./assets/img/copiarModulo.PNG" alt="fotoHome" width="400">
  </div>
  <p class="mb-3">
   Al conceder los permisos, el modulo queda almacenado en tu cuenta.
  </p>
`;

let html2 = `
  <p class="mb-3">
    <b>Configuración Modulo en la pagina Web</b> 
  </p>
  <ol>
    <li>Ingresa a la Marketing > Sitios Web > Pagina  de sitio web</li>
    <li>Selecciona una pagina para editar o crear uno nuevo</li>
    <li>En la columna izquierda, busca el modulo <b> Nuclear Cotizador</b></li>
    <li>Lo arrastras en la seccion donde quieres visualizar el cotizador inmobiliario</li>
  </ol>
  <div>
    <img src="./assets/img/buscarModulo.PNG" alt="fotoHome" width="400">
  </div>

`;

let html3 = `
  <p class="mb-3">
    <b>Configuración Modulo en la pagina Web</b> 
  </p>
  <p class="mb-3">
    Una vez insertado el modulo, en la columna izquierda aparece una configuración del módulo, 
    debes seleccionar un formulario para capturar a los lead y clientes que utilicen el cotizador.
     Este formulario es personalizado por el usuario con la información que desea obtener del cliente.
  </p>
  <div>
    <img src="./assets/img/configModulo.PNG" alt="fotoHome" width="400">
  </div>

`;
let html4 = `
  <p class="mb-3">
    <b>Finalización modulo</b> 
  </p>

  <p class="mb-3">
    Con estos pasos haz finalizado, continua con la configuración de Plantillas de Cotizador
  </p>

`;

let html5 = `
  <p class="mb-3">
    <b>Importar una plantilla de cotización personalizada. </b> 
  </p>
  <p class="mb-3">
    La plantilla de cotización te permite visualizar la cotizacion realizada por el cliente en la aplicacion, 
    como los line items, los precios, descuentos, etc, debido algunas limitaciones se personalizo la plantilla 
    y se agregaron la seccion de Plan de Pagos y un link para actualizacion de plan de pagos. 
  </p>
  <p class="mb-3">
    Al igual al modulo se debe copiar una carpeta de un tema que interno esta la plantilla personalizada
    de la cotizacion  del portal origen al destino.
  </p>
  <div>
    <img src="./assets/img/copiarQuote.PNG" alt="fotoHome" width="400">
  </div>
`;

let html6 = `
  <p class="mb-3">
    <b>Acceso a Cotizaciones</b> 
  </p>
  <p class="mb-3">
    Luego de copiarlo, debes ingresar Ventas > Cotizaciones > Personalizar plantilla de Cotizacion
  </p>
  <div>
    <img src="./assets/img/quoteGeneral.PNG" alt="fotoHome" width="400">
  </div>
`;
let html7 = `
  <p class="mb-3">
    <b>Acceso a Plantilla Personalizada</b> 
  </p>
  <p class="mb-3">
    Luego abre una pagina con las plantillas, selecciona Personalizar plantilla de cotizacion
  </p>
  <div>
    <img src="./assets/img/quoteGeneral2.PNG" alt="fotoHome" width="400">
  </div>
`;
let html8 = `
  <p class="mb-3">
    <b>Insertar Plantilla Personalizada</b> 
  </p>
  <p class="mb-3">
    Se abre un popup con las plantillas debes seleccionar <b> cotizador inmobiliario</b>
  </p>
  <div>
    <img src="./assets/img/quoteGeneral3.PNG" alt="fotoHome" width="400">
  </div>
`;
let html9 = `
  <p class="mb-3">
    <b>Configuración Plantilla Personalizada</b> 
  </p>
  <p class="mb-3">
    Finalmente, guardar y en la lista aparece una nueva plantilla, <b>NOTA:</b> se recomienda NO cambiar 
    el nombre de la plantilla o debe contener la palabra <b>inmobiliario</b>
  </p>
  <div>
    <img src="./assets/img/quoteGeneral4.PNG" alt="fotoHome" width="400">
  </div>
`;
