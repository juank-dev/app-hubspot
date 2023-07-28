export const dataMetodoPago = {
  name: 'pay_method',
  label: 'Metodo de Pago',
  description: 'La forma de pago que va a realizar el cliente',
  groupName: 'cotizador_inmobiliario',
  type: 'enumeration',
  fieldType: 'select',
  displayOrder: 6,
  options: [
    {
      description: null,
      label: 'Contado',
      displayOrder: 1,
      hidden: false,
      doubleData: null,
      readOnly: false,
      value: 'Contado',
    },
    {
      description: null,
      label: 'Credito',
      displayOrder: 2,
      hidden: false,
      doubleData: null,
      readOnly: false,
      value: 'Credito',
    },
  ],
};
