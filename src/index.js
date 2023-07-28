import { ApiRequest, METHODS } from './helpers/ApiRequest.js';


let d = document;
let refresh_token = '';
let dataCountries = [];
const URL_API = location.origin;

d.addEventListener('DOMContentLoaded', () => {
  if (location.search.split('=').length <= 1) {
    return (location.href = `${URL_API}/install`);
  }
  refresh_token = location.search.split('=')[1];
  let $cardContent = d.getElementById('card-content');
  d.addEventListener('click', async (e) => {
    if (e.target.matches('#continue-install')) {
      $cardContent.innerHTML = `
      <div class="col-6">
        <img src="./assets/img/loading.svg" alt="loading" />
      </div>
      <div class="col-6 info-install" id="info-install">
        
      </div>
      `;
      /* ✔️❌⚠️🆗*/
      let $infoInstall = d.getElementById('info-install');

      //autenticacion Auth 2.0 hubspot obtener token

      let urlToken = `${URL_API}/tokenHubspot`;

      let tokenHubSpot = new String();

      try {
        let data = await ApiRequest(urlToken, { method: METHODS.GET });
        tokenHubSpot = data.message;
        $infoInstall.insertAdjacentHTML('beforeend', `<p>Token Hubspot Validado y acceso a Hubspot ✔️</p>`);
      } catch (err) {
        let $p = d.createElement('p');
        $p.textContent = err.message + ' ' + err.statusText || '' + ' ❌';
        $infoInstall.insertAdjacentElement('beforeend', $p);
        $infoInstall.insertAdjacentHTML('beforeend', '<p>⚠️ Se redirigira a HubSpot para solicitar permisos</p>');
        setTimeout(() => {
          location.href = `${URL_API}/install`;
        }, 3000);
        return;
      }

      /******
       *
       *  guardar registro de Cliente
       *
       ******* */

      let urlSaveUser = `${URL_API}/api/v1/register/save`;
      try {
        let userRegister = await ApiRequest(urlSaveUser, {
          method: METHODS.POST,
          data: {
            refresh_token,
          },
          headers: {
            token: tokenHubSpot,
          },
        });

        $infoInstall.insertAdjacentHTML(
          'beforeend',
          `<p>Cuenta registrado con el portal ${userRegister.portal_id} ✔️</p>`
        );
      } catch (err) {
        if (err.code === 409) {
          $infoInstall.insertAdjacentHTML('beforeend', `<p>${err.message} 🆗</p>`);
        } else {
          let $p = d.createElement('p');
          $p.textContent = err.message + ' ' + err.statusText || '' + ' ❌';
          $infoInstall.insertAdjacentElement('beforeend', $p);
          $infoInstall.insertAdjacentHTML(
            'beforeend',
            '<p>⚠️ Hubo un inconveniente en Hubspot, se redirige a la pagina para solicitar nuevamente permisos</p>'
          );
          setTimeout(() => {
            location.href = `${URL_API}/install`;
          }, 5000);
          return;
        }
      }
      /******
       *
       *  obtener un contact Hubspot
       *
       ******* */

       let urlGetContact = `${URL_API}/api/v1/contact/get-contact-vid`;

       let configGetContact = {
         method: 'post',
         url: urlGetContact,
         headers: {
           'Content-Type': 'application/json',
           token: tokenHubSpot
         },
         data: {
          vid: 1
        }
       };
     
       try {
         await axios(configGetContact);
         let $h6 = d.createElement('h6');
         $h6.textContent = 'Obtener contacto Hubspot ✔️';
         $infoInstall.insertAdjacentElement('beforeend', $h6);
       } catch (err) {
         let $h6 = d.createElement('h6');
         console.log({message})
         $h6.textContent = 'No se pudo Obtener Data de Hubspot❌';
         $infoInstall.insertAdjacentElement('beforeend', $h6);
         $btnClose.classList.add('active');
         return;
       }

      $infoInstall.insertAdjacentHTML('beforeend', `<p>Finalizando... Espere un momento </p>`);
      setTimeout(() => {
        $cardContent.innerHTML = `
          <div class="col-8 info-success">
          <h2><span class="text-gradient">La Aplicación ha sido instalada con exito</span></h2>

          <div class="group__btns">
            <button class="detail-button">
              <a href="https://app.hubspot.com/"> Ir a Hubspot </a>
            </button>
          </div>
        </div>
      `;
      }, 5000);
    }
  });
});

