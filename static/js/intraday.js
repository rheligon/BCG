
var csrftoken = $.cookie('csrftoken');

/*
$( document ).ready(function() {
		setInterval(function() {
            console.log("hola")
        }, 2000);	
    
});*/

$('#Cuenta-sel').change(function() {
    
    var cuentaId = $('#Cuenta-sel').val();

    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
        $('#minima_fecha').val("");
        $('#fecha-ejecutar').val("");
        $('#fecha-desde').val("");
        $('#fecha-hasta').val("");

        $('#divselec_archivo option[value!="-1"]').remove();
        t_conta.clear().draw();
                    
        $('#processing-modal').modal('toggle')
        buscarArchivos(codigoCuenta);
    }else{

        //borramos los campos
        $('#minima_fecha').val("");
        $('#fecha-ejecutar').val("");
        $('#fecha-desde').val("");
        $('#fecha-hasta').val("");
        $('#divselec_archivo option[value!="-1"]').remove();
        t_conta.clear().draw();
    }
});   
