
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
tiempo = parseInt(tiempo)*30000

setInterval(function() {
    $('#boton_go').attr("disabled", true);
     var cuentaId = $('#Cuenta-sel').val();
    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
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

        $('#saldo_fin_conta').val("");
        $('#cdSaldoFinalConta').html("");
        $('#saldo_fin_corr').val("");
        $('#cdSaldoFinalCorr').html("");

        $('#debitos').val("");
        $('#creditos').val("");

        $('#boton_go').attr("disabled", true);

    }  
}, tiempo);	
    

$( document ).ready(function() {
    var url = window.location.href;
    var path = window.location.pathname;
    
    var arreglo = path.split("/");
    largo = arreglo.length;
    var cuentaIds = arreglo[largo-2];
    
    if(cuentaIds == "intraday"){
        console.log("no hago nada");

    }else{
        ceuntaIds=parseInt(cuentaIds);
        $("div.intra select").val(cuentaIds);
    }

           
     $('#boton_go').attr("disabled", true);
     var cuentaId = $('#Cuenta-sel').val();
    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
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

        $('#saldo_fin_conta').val("");
        $('#cdSaldoFinalConta').html("");
        $('#saldo_fin_corr').val("");
        $('#cdSaldoFinalCorr').html("");

        $('#debitos').val("");
        $('#creditos').val("");

        $('#boton_go').attr("disabled", true);

    }  
});

$('#Cuenta-sel').change(function() {
    
    var cuentaId = $('#Cuenta-sel').val();
    //si se selecciona una cuenta mostramos su info
    if (cuentaId>=0){
        var codigoCuenta = $('#opt-'+cuentaId).attr("codigo");
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

        $('#saldo_fin_conta').val("");
        $('#cdSaldoFinalConta').html("");
        $('#saldo_fin_corr').val("");
        $('#cdSaldoFinalCorr').html("");

        $('#debitos').val("");
        $('#creditos').val("");

        $('#boton_go').attr("disabled", true);

    }
}); 

//Dar formato a un Date a string dd/mm/yyyy
function formatearFecha(fecha){
    if (idioma != 0){
        aux = fecha.split("/")
        nueva = aux[2].substr(0,4) +"/" + aux[1] + "/" +aux[0] + " " + aux[2].substr(4);
        return nueva;
    } else{
        return fecha;
    }
}

function buscarUltimaConciliacion(cuenta){
        $.ajax({
            type:"POST",
            url: "/intraday/"+cuenta+"/",
            data: {"action": "buscarConci"},
            success: function(data){
                if (data.exitoconci){
                    var json_data = jQuery.parseJSON(data.cons);
                    json_data = json_data[0].fields;
                    $('#fecha_conci').html(formatearFecha(data.fecha));
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
                    

                    $('#fecha_tran').html(formatearFecha(data.fecha));
                    $('#fecha_actual').html(formatearFecha(data.fechaActual));

                    debitos = $.formatNumber((data.debitos),{locale:idiomaAux});
                    $('#debitos').val(debitos);
                    
                    creditos = $.formatNumber((data.creditos),{locale:idiomaAux});
                    $('#creditos').val(creditos);

                    totalConta = balanceTConta - data.debitos + data.creditos
                    if(totalConta < 0){
                        cd_conta = "D"
                        cd_corres = "C"
                    }else{
                        cd_conta = "C"
                        cd_corres = "D"
                    }
                    totalContaF = $.formatNumber(Math.abs(totalConta),{locale:idiomaAux});
                    $('#saldo_fin_conta').val(totalContaF);
                    $('#cdSaldoFinalConta').html(cd_conta);
                    $('#saldo_fin_corr').val(totalContaF);
                    $('#cdSaldoFinalCorr').html(cd_corres);
                    
                    if($('#sald_ini_conta').val() != $('#saldo_fin_conta').val()){
                        $('#boton_go').attr("disabled", false);
                    }
                    
    
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
                    
                    $('#saldo_fin_conta').val("");
                    $('#cdSaldoFinalConta').html("");
                    $('#saldo_fin_corr').val("");
                    $('#cdSaldoFinalCorr').html("");

                    $('#debitos').val("");
                    $('#creditos').val("");

                    $('#boton_go').attr("disabled", true);
                
                }
                if(data.exito){

                }else{
                    swal("Ups!", data.msg, "error");
                }
                if(data.exitoParseo){

                }else{
                    swal("Ups!", data.msgParseo, "error");
                }


                $('#processing-modal').modal('toggle');
            },
            error: function(q,error){
                alert(q.responseText) //debug
                if (idioma == 0){
                    swal("Ups!", "Hubo un error consultando la Última Conciliación, intente de Nuevo.", "error");
                } else {
                    swal("Ups!", "Error occurred consulting last reconciliation, try agains please.", "error");    
                }
                $('#processing-modal').modal('toggle');
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
};  
