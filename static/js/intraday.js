
var csrftoken = $.cookie('csrftoken');

/*
$( document ).ready(function() {
		setInterval(function() {
            console.log("hola")
        }, 2000);	
    
});*/


$( document ).ready(function() {
           
     $('#boton_go').attr("disabled", true);
});

$('#Cuenta-sel').change(function() {
    
    var cuentaId = $('#Cuenta-sel').val();
    console.log(cuentaId)
    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
        console.log(codigoCuenta)
        $('a[name="boton_trans"]').attr('href','/transIntraday/'+cuentaId);
        $('#processing-modal').modal('toggle');
        buscarUltimaConciliacion(cuentaId)
    
    }else{

        //borramos los campos
        $('#fecha_conci').html("");
        $('#fecha_tran').html("");
        $('#fecha_actual').html("");
                    
        $('#sald_fin_conta').val("");
        $('#cdFinConta').html("");
        
        $('#sald_fin_corr').val("");
        $('#cdFinCorr').html("");

        $('#sald_ini_conta').val("");
        $('#cdIniConta').html("");
        
        $('#sald_ini_corr').val("");
        $('#cdIniCorr').html("");
        
        $('#ced_corr_nodeb').val("");
        $('#deb_corr_noacr').val("");
        $('#ced_banco_nodeb').val("");
        $('#deb_banco_noacr').val("");

        $('#sald_tot_conta').val("");
        $('#cdTotalConta').html("");

        $('#sald_tot_corr').val("");  
        $('#cdTotalCorr').html("");

        $('#boton_go').attr("disabled", true);

    }
}); 

function addCommas(intNum) {
  return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
};

function intCommas(numero) {
    balance = Math.abs(numero).toString().split(".");
    entero = parseInt(balance[0]);
    conComa = addCommas(entero);
    if (balance.length > 1){
        balance = conComa + "." + balance[1]    
    }else{
        balance = conComa + ".00";
    }
    return balance;
};

//Dar formato a un Date a string dd/mm/yyyy
function formatearFecha(fecha){
    dia = fecha.getUTCDate();
    
    if (dia < 10){
        dia = "0"+ dia;
    }

    mes = fecha.getUTCMonth()+1;
    
    if (mes < 10){
        mes = "0"+ mes;
    }

    anio = fecha.getUTCFullYear();
    nueva = dia +"/" + mes + "/" +anio;
    return nueva;
}

function buscarUltimaConciliacion(cuenta){
        $.ajax({
            type:"POST",
            url: "/intraday/",
            data: {"cuenta":cuenta, "action": "buscarConci"},
            success: function(data){
                if (data.exito){
                    var json_data = jQuery.parseJSON(data.cons);
                    json_data = json_data[0].fields;
                    $('#fecha_conci').html(data.fecha);
                    
                    balanceFConta = json_data.balancefinalcontabilidad;
                    balanceFinalConta = intCommas(balanceFConta);
                    $('#sald_fin_conta').val(balanceFinalConta);
                    $('#sald_ini_conta').val(balanceFinalConta);
                    $('#cdFinConta').html(data.cod[0]);
                    $('#cdIniConta').html(data.cod[0]);
                    
                    
                    balanceFCorr = json_data.balancefinalcorresponsal;
                    balanceFinalCorr = intCommas(balanceFCorr);
                    $('#sald_fin_corr').val(balanceFinalCorr);
                    $('#sald_ini_corr').val(balanceFinalCorr);
                    $('#cdFinCorr').html(data.cod[1]);
                    $('#cdIniCorr').html(data.cod[1]);
                    
                    credCorrNoDeb = json_data.totalcreditoscorresponsal;
                    credCorrNoDebF = intCommas(credCorrNoDeb);
                    $('#ced_corr_nodeb').val(credCorrNoDebF);

                    debCorrNoAcr = json_data.totaldebitoscorresponsal;
                    debCorrNoAcrF = intCommas(debCorrNoAcr);
                    $('#deb_corr_noacr').val(debCorrNoAcrF);

                    credContaNoDeb = json_data.totalcreditoscontabilidad;
                    credContaNoDebF = intCommas(credContaNoDeb);
                    $('#ced_banco_nodeb').val(credContaNoDebF);

                    debContaNoAcr = json_data.totaldebitoscontabilidad;
                    debContaNoAcrF = intCommas(debContaNoAcr);
                    $('#deb_banco_noacr').val(debContaNoAcrF);

                    balanceTConta = json_data.saldocontabilidad;
                    balanceTotalConta = intCommas(balanceTConta);
                    $('#sald_tot_conta').val(balanceTotalConta);
                    $('#cdTotalConta').html(data.cod[2]);

                    balanceTCorr = json_data.saldocorresponsal;
                    balanceTotalCorr = intCommas(balanceTCorr);
                    $('#sald_tot_corr').val(balanceTotalCorr);  
                    $('#cdTotalCorr').html(data.cod[3]);

                    $('#fecha_tran').html(data.fecha);
                    $('#fecha_actual').html(data.fechaActual);
                    $('#boton_go').attr("disabled", false);
       
    
                }else{
                    //borramos los campos
                    $('#fecha_conci').html("");
                    $('#fecha_tran').html("");
                    $('#fecha_actual').html("");
       
                    
                    $('#sald_fin_conta').val("");
                    $('#cdFinConta').html("");
                    
                    $('#sald_fin_corr').val("");
                    $('#cdFinCorr').html("");
                    
                    $('#sald_ini_conta').val("");
                    $('#cdIniConta').html("");
                    
                    $('#sald_ini_corr').val("");
                    $('#cdIniCorr').html("");

                    $('#ced_corr_nodeb').val("");
                    $('#deb_corr_noacr').val("");
                    $('#ced_banco_nodeb').val("");
                    $('#deb_banco_noacr').val("");

                    $('#sald_tot_conta').val("");
                    $('#cdTotalConta').html("");

                    $('#sald_tot_corr').val("");  
                    $('#cdTotalCorr').html("");
                    $('#boton_go').attr("disabled", true);
                }
                $('#processing-modal').modal('toggle');
            },
            error: function(q,error){
                alert(q.responseText) //debug
                swal("Ups!", "Hubo un error consultando la Última Conciliación, intente de Nuevo.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};  
