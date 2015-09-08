
var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var tiempo = $('#tiempoAct').val();
tiempo = parseInt(tiempo)*60000

/*setInterval(function() {
    $('#boton_go').attr("disabled", true);
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
}, tiempo);	
    
*/
$( document ).ready(function() {
    var url = window.location.href;
    var path = window.location.pathname;
    
    var arreglo = path.split("/");
    largo = arreglo.length;
    var cuentaIds = arreglo[largo-2];
    console.log(cuentaIds);
    
    if(cuentaIds == "intraday"){
        console.log("no hago nada");

    }else{
        ceuntaIds=parseInt(cuentaIds);
        console.log("tengo la cuenta " + cuentaIds)
        $("div.intra select").val(cuentaIds);
    }

           
     $('#boton_go').attr("disabled", true);
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
            url: "/intraday/"+cuenta+"/",
            data: {"action": "buscarConci"},
            success: function(data){
                if (data.exitoconci){
                    console.log("debitos: "+data.debitos)
                    console.log("creditos: "+data.creditos)
                    var json_data = jQuery.parseJSON(data.cons);
                    json_data = json_data[0].fields;
                    $('#fecha_conci').html(data.fecha);
                    console.log(idiomaAux)
                    balanceFConta = json_data.balancefinalcontabilidad;
                    balanceFinalConta = $.formatNumber(Math.abs(balanceFConta),{locale:idiomaAux});
                    $('#sald_fin_conta').val(balanceFinalConta);
                    $('#cdFinConta').html(data.cod[0]);
                    
                    
                    balanceFCorr = json_data.balancefinalcorresponsal;
                    balanceFinalCorr = $.formatNumber(Math.abs(balanceFCorr),{locale:idiomaAux});
                    $('#sald_fin_corr').val(balanceFinalCorr);
                    $('#cdFinCorr').html(data.cod[1]);
                    
                    credCorrNoDeb = json_data.totalcreditoscorresponsal;
                    credCorrNoDebF = $.formatNumber(Math.abs(credCorrNoDeb),{locale:idiomaAux});
                    $('#ced_corr_nodeb').val(credCorrNoDebF);

                    debCorrNoAcr = json_data.totaldebitoscorresponsal;
                    debCorrNoAcrF = $.formatNumber(Math.abs(debCorrNoAcr),{locale:idiomaAux});
                    $('#deb_corr_noacr').val(debCorrNoAcrF);

                    credContaNoDeb = json_data.totalcreditoscontabilidad;
                    credContaNoDebF = $.formatNumber(Math.abs(credContaNoDeb),{locale:idiomaAux});
                    $('#ced_banco_nodeb').val(credContaNoDebF);

                    debContaNoAcr = json_data.totaldebitoscontabilidad;
                    debContaNoAcrF = $.formatNumber(Math.abs(debContaNoAcr),{locale:idiomaAux});
                    $('#deb_banco_noacr').val(debContaNoAcrF);

                    balanceTConta = json_data.saldocontabilidad;
                    balanceTotalConta = $.formatNumber(Math.abs(balanceTConta),{locale:idiomaAux});
                    $('#sald_tot_conta').val(balanceTotalConta);
                    $('#sald_ini_conta').val(balanceTotalConta);
                    $('#cdTotalConta').html(data.cod[2]);
                    $('#cdIniConta').html(data.cod[2]);
                    

                    balanceTCorr = json_data.saldocorresponsal;
                    balanceTotalCorr = $.formatNumber(Math.abs(balanceTCorr),{locale:idiomaAux});
                    $('#sald_tot_corr').val(balanceTotalCorr);
                    $('#sald_ini_corr').val(balanceTotalCorr); 
                    $('#cdTotalCorr').html(data.cod[3]);
                    $('#cdIniCorr').html(data.cod[3]);
                    

                    $('#fecha_tran').html(data.fecha);
                    $('#fecha_actual').html(data.fechaActual);
                    $('#boton_go').attr("disabled", false);

                    debitos = $.formatNumber((data.debitos),{locale:idiomaAux});
                    $('#debitos').val(debitos);
                    
                    creditos = $.formatNumber((data.creditos),{locale:idiomaAux});
                    $('#creditos').val(creditos);
                    
    
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
                if(data.exito){

                }else{
                    swal("Ups!", data.msg, "error");
                    console.log("primnero");
                }
                if(data.exitoParseo){

                }else{
                    swal("Ups!", data.msgParseo, "error");
                    console.log("segundo");
                }


                $('#processing-modal').modal('toggle');
            },
            error: function(q,error){
                alert(q.responseText) //debug
                swal("Ups!", "Hubo un error consultando la Última Conciliación, intente de Nuevo.", "error");
                $('#processing-modal').modal('toggle');
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};  
