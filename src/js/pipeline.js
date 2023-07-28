export const dataPipeline = {
  label: 'Sector Inmobiliario',
  displayOrder: 1,
  stages: [
    {
      label: 'Cotización Inicial',
      displayOrder: 0,
      metadata: {
        probability: '0.3',
      },
    },
    {
      label: 'Contraoferta Cliente',
      displayOrder: 1,
      metadata: {
        probability: '0.5',
      },
    },
    {
      label: 'Rechazado',
      displayOrder: 3,
      metadata: {
        probability: '0',
      },
    },
    {
      label: 'Acuerdo Cotizacion',
      displayOrder: 2,
      metadata: {
        probability: '1',
      },
    },
  ],
};
