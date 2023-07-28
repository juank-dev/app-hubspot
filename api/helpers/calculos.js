const calculoSaldos = ( saldo, interes, meses  ) => {
    
    var interest = 0;
    
    if (interes != 0) {
        interest = parseFloat (interes) / 100/ ((meses !=0 ) ? meses : 1 ); // Convertir tasa de interés anual en tasa de interés mensual
    }
    var principal = parseFloat (saldo); // Convertir formato de porcentaje a formato decimal

    var payments = parseFloat ((meses !=0 ) ? meses : 1 ); // pagos mensuales

    // Ahora calcula los datos del pago mensual
    //var x = Math.pow (1 + ((interest !=0 ) ? interest : 1 ), payments); // Realizar exponenciación
    var x = Math.pow (1 + (interest), payments); // Realizar exponenciación
    var monthly = (principal * x * (( interest != 0 ) ? interest : 1 )) / (x - 1);
    const objSaldos = {};

    // La función isFinite () se usa para verificar si su parámetro es infinito.
    if (isFinite(monthly)) {
        // Datos rellenados a la posición del campo de salida, redondeados a dos dígitos después del punto decimal
        /*payment.innerHTML = monthly.toFixed (2); // El método toFixed () puede redondear el Número al número especificado de posiciones decimales.
        total.innerHTML = (monthly * payments).toFixed(2);
        totalinterset.innerHTML = ((monthly * payments) - principal).toFixed(2);*/

        objSaldos.cuota_mensual = parseFloat( monthly.toFixed(2));
        objSaldos.interes = parseFloat( ((monthly * payments) - principal).toFixed(2) );
        objSaldos.total_financiamiento = parseFloat( (monthly * payments).toFixed(2) );
        objSaldos.interes_anual = interes;
        objSaldos.interes_mensual = parseFloat((interest * 100).toFixed(4));
        objSaldos.cuotas = meses; // numero de cuotas

        return objSaldos;

    } else {

        monthly = principal / meses;
        // El resultado del cálculo no es una matriz ni es infinito, lo que significa que los datos de entrada son ilegales o están incompletos. Borrar los datos de salida anteriores
        objSaldos.cuota_mensual = parseFloat( monthly.toFixed(2));
        objSaldos.interes = parseFloat( ((monthly * payments) - principal).toFixed(2) );
        objSaldos.total_financiamiento = parseFloat( (monthly * payments).toFixed(2) );
        objSaldos.interes_anual = interes;
        objSaldos.interes_mensual = parseFloat((interest * 100).toFixed(4));
        objSaldos.cuotas = meses; // numero de cuotas

        return objSaldos;
    }
}

module.exports = {
    calculoSaldos
}