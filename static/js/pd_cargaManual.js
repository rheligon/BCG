//idioma_tr es una variable global definida en la pagina
var t_conta = iniciar_tabla(idioma_tr,'conta');
var t_corr = iniciar_tabla(idioma_tr, 'corr');
var csrftoken = $.cookie('csrftoken');

function commas (num) {
    var N = parseFloat(num).toFixed(2);
    return N.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

$('#Cuenta-sel').change(function() {

    $('#processing-modal').modal('toggle');
  
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId>=0){
    var sel = $('#opt-'+cuentaId);
    var moneda = sel.attr('moneda');

    $('#cta_nostro').val(sel.attr('cn'));
    $('#cta_vostro').val(sel.attr('cv'));
    $('#banco').val(sel.attr('banco'));
    
    t_conta.clear().draw();
    t_corr.clear().draw();
    document.getElementById('cont-radio').checked = true;

    $('#edo-cuenta-nuevo').val("");
    $('#paginas-nuevo').html("");
    
    $('#fecha-manual-nuevo1').val("");
    $('#fecha-manual-nuevo2').val("");
    
    $('#saldo-manual-cd-nuevo1').html("");
    $('#saldo-manual-cd-nuevo2').html("");
    
    $('#saldo-manual-moneda-nuevo1').html("");
    $('#saldo-manual-moneda-nuevo2').html("");
    
    $('#saldo-manual-nuevo1').val("");
    $('#saldo-manual-nuevo2').val("");
    
    $('#f-nuevo-ini').html("");
    $('#f-nuevo-fin').html("");

    buscarEstado('cont-radio',cuentaId,moneda);
  }else{

    t_conta.clear().draw();
    t_corr.clear().draw();

    $('#elim-data').attr('cod', "");
    $('#cta_nostro').val("");
    $('#cta_vostro').val("");
    $('#banco').val("");
    
    
    $('#saldo-manual-moneda').html("");
    $('#edo-cuenta').val("");
    $('#fecha-manual').val("");
    $('#saldo-manual-cd').html("");
    $('#saldo-manual').val("");
    $('#processing-modal').modal('toggle');
  }
});


//Mostrar Detalle al hacer click en código de banco
$('.table').on('click','a[type=edc]', function(event) {
    event.preventDefault();

    //Estilo de elemento elegido
    var a_id = $("#elim-data").attr("cod")
    $('#'+a_id).parent().css("background-color","")
    $('#'+a_id).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")

    //asignacion de elemento a eliminar
    var a_modo = $(this).attr("modo");
    var e_id = $(this).attr("id").split('-')[1];
    var a_cod = $(this).attr("cod");
    $("#elim-data").attr("modo", a_modo);
    $("#elim-data").attr("eid", e_id);
    $("#elim-data").attr("cod", a_cod);
});

//Monstar ultimo estado de cuenta filtrando si viene de contabilidad o corresponsal
$('input[name=radiocuenta]').change(function(){
    $('#processing-modal').modal('toggle');
        
    var tipo = $(this).attr('id');
    console.log(tipo+" idaux")

    var cuentaId = $('#Cuenta-sel').val();

    if (cuentaId>=0){
        var sel = $('#opt-'+cuentaId);
        var moneda = sel.attr('moneda');

        $('#edo-cuenta-nuevo').val("");
        $('#paginas-nuevo').html("");
        
        $('#fecha-manual-nuevo1').val("");
        $('#fecha-manual-nuevo2').val("");
        
        $('#saldo-manual-cd-nuevo1').html("");
        $('#saldo-manual-cd-nuevo2').html("");
        
        $('#saldo-manual-moneda-nuevo1').html("");
        $('#saldo-manual-moneda-nuevo2').html("");
        
        $('#saldo-manual-nuevo1').val("");
        $('#saldo-manual-nuevo2').val("");
        
        $('#f-nuevo-ini').html("");
        $('#f-nuevo-fin').html("");
        }else{

        $('#elim-data').attr('cod', "");
        $('#saldo-manual-moneda').html("");
        $('#edo-cuenta').val("");
        $('#fecha-manual').val("");
        $('#saldo-manual-cd').html("");
        $('#saldo-manual').val("");


       
    }

    buscarEstado(tipo,cuentaId,moneda);
     
});

$('#boton-nuevo').on('click', function () {

    var cuentaId = $('#edo-cuenta').val();
    cuentaId = parseInt(cuentaId);
    
    if (cuentaId>=0){
        

        var fecha = $('#fecha-manual').val();
        var cd = $('#saldo-manual-cd').html();
        var moneda = $('#saldo-manual-moneda').html();
        var saldo = $('#saldo-manual').val();
        var ffinal = $('#ffinal').html();
        cuentaId+=1;
        fecha = nuevaFecha(fecha);

        $('#edo-cuenta-nuevo').val(cuentaId);
        $('#paginas-nuevo').html(1);
        
        $('#fecha-manual-nuevo1').val(fecha);
        $('#fecha-manual-nuevo2').val(fecha);
        
        $('#saldo-manual-cd-nuevo1').html(cd);
        $('#saldo-manual-cd-nuevo2').html(cd);
        
        $('#saldo-manual-moneda-nuevo1').html(moneda);
        $('#saldo-manual-moneda-nuevo2').html(moneda);
        
        $('#saldo-manual-nuevo1').val(saldo);
        $('#saldo-manual-nuevo2').val(saldo);
        
        $('#f-nuevo-ini').html(ffinal);
        $('#f-nuevo-fin').html(ffinal);

    }
    
});

function reiniciar_tablas(){
    t_conta.clear().draw();
    t_corr.clear().draw();
    return true;
}

//Dar formato a un Date dd/mm/yyyy
function formatearFecha(fecha){
    dia = fecha.getUTCDate();
    
    if (dia < 10){
        dia = "0"+ dia
    }

    mes = fecha.getUTCMonth()+1;
    
    if (mes < 10){
        mes = "0"+ mes
    }

    anio = fecha.getUTCFullYear();
    nueva = dia +"/" + mes + "/" +anio
    return nueva;
}

function nuevaFecha(fecha){
    var arreglo= fecha.split("/");
    dia = parseInt(arreglo[0]);
    mes = parseInt(arreglo[1])-1;
    anio = parseInt(arreglo[2]);
    var nueva = new Date(anio,mes,dia);
    nueva.setDate(nueva.getDate()+1);
    nueva = formatearFecha(nueva);
    return nueva
}

function iniciar_tabla(idioma,origen){

    if (idioma==="es"){

        return $('#table-'+ origen).DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "autoWidth": false,
            "columns": [
                { "width": "16%" },
                { "width": "11%" },
                { "width": "13%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "25%" }
              ]
            })

    }else if (idioma==="en"){

        return $('#table-'+ origen).DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "columns": [
                { "width": "16%" },
                { "width": "11%" },
                { "width": "13%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "25%" }
              ]
        })
    };
};

//Buscar partidas de acuerdo a la seleccion
function buscarEstado(tipo,cuentaid,moneda){
    $.ajax({
        type:"POST",
        url: "/procd/cargMan/",
        data: {'moneda':moneda,'tipo':tipo,'cuentaid':cuentaid ,'action':'buscar'},
        success: function(data){
            var carg = 0;
            var proc = 1;
            var ult_edc_conc = 0;
            var ult_edc_conp = 0;
            var ult_edc_corc = 0;
            var ult_edc_corp = 0;
            var ult_conc_existe = false;
            var ult_corc_existe = false;
            var ult_conp_existe = false;
            var ult_corp_existe = false;
            var tipo = data.tipo;
            var moneda = data.moneda;
            var json_data = jQuery.parseJSON(data.query);
            console.log(json_data);

            if (json_data[carg].length>=1){
            console.log("entre");
                  
                for (var i = 0; i < json_data[carg].length; i++) {

                    if (json_data[carg][i].fields.origen === "L"){
   
                        if (!ult_conc_existe){
                            ult_edc_conc = i;
                            ult_conc_existe = true;
                        }

                    }else{
   
                        if (!ult_corc_existe){
                            ult_edc_corc = i;
                            ult_corc_existe = true;
                        }
                    }
                }
            }

            if (json_data[proc].length>=1){
                console.log("entre");
            
                for (var i = 0; i < json_data[proc].length; i++) {

                    if (json_data[proc][i].fields.origen === "L"){
                        
                        if (!ult_conp_existe){
                            ult_edc_conp = i;
                            ult_conp_existe = true;
                        }

                    }else{

                        if (!ult_corp_existe){
                            ult_edc_corp = i;
                            ult_corp_existe = true;
                        }
                    }
                }
            }
            
            if (ult_conc_existe && tipo =="cont-radio"){
                console.log("entre3"+tipo+" "+json_data[carg][ult_edc_conc].fields.codigo);
            
                var fecha_conc = new Date(json_data[carg][ult_edc_conc].fields.fecha_final);
                fecha_conc = formatearFecha(fecha_conc);
                $('#edo-cuenta').val(json_data[carg][ult_edc_conc].fields.codigo);
                $('#fecha-manual').val(fecha_conc);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[carg][ult_edc_conc].fields.c_dfinal);
                $('#ffinal').html(json_data[carg][ult_edc_conc].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[carg][ult_edc_conc].fields.balance_final));
            }

            else if (ult_conp_existe && !ult_conc_existe && tipo =="cont-radio"){
                var fecha_conp = new Date(json_data[proc][ult_edc_conp].fields.fecha_final);
                fecha_conp = formatearFecha(fecha_conp);
                
                $('#edo-cuenta').val(json_data[proc][ult_edc_conp].fields.codigo);
                $('#fecha-manual').val(fecha_conp);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[proc][ult_edc_conp].fields.c_dfinal);
                $('#ffinal').html(json_data[proc][ult_edc_conp].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[proc][ult_edc_conp].fields.balance_final));
            
            }

            else if (ult_corc_existe && tipo =="corr-radio"){
                console.log("entre5"+tipo+" "+json_data[carg][ult_edc_corc].fields.codigo);
            
                var fecha_corc = new Date(json_data[carg][ult_edc_corc].fields.fecha_final)
                fecha_corc = formatearFecha(fecha_corc);
                $('#edo-cuenta').val(json_data[carg][ult_edc_corc].fields.codigo);
                $('#fecha-manual').val(fecha_corc);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[carg][ult_edc_corc].fields.c_dfinal);
                $('#ffinal').html(json_data[carg][ult_edc_corc].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[carg][ult_edc_corc].fields.balance_final));
            }

            else if (ult_corp_existe && !ult_corc_existe && tipo =="corr-radio"){
                console.log("entre6"+tipo+" "+json_data[proc][ult_edc_corp].fields.codigo);
            
                var fecha_corp = new Date(json_data[proc][ult_edc_corp].fields.fecha_final)
                fecha_corp = formatearFecha(fecha_corp);
                $('#edo-cuenta').val(json_data[proc][ult_edc_corp].fields.codigo);
                $('#fecha-manual').val(fecha_corp);
                $('#saldo-manual-moneda').html(moneda);
                $('#saldo-manual-cd').html(json_data[proc][ult_edc_corp].fields.c_dfinal);
                $('#ffinal').html(json_data[proc][ult_edc_corp].fields.m_ffinal);
                $('#saldo-manual').val(commas(json_data[proc][ult_edc_corp].fields.balance_final));
            
            }else{
                
                $('#edo-cuenta').val("");
                $('#fecha-manual').val("");
                $('#saldo-manual-moneda').html("");
                $('#saldo-manual-cd').html("");
                $('#ffinal').html("");
                $('#saldo-manual').val("");
            }

            $('#processing-modal').modal('toggle');
        },
        error: function(q,error){
            alert(q.responseText) //debug
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando las partidas para la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Eliminar Estado de Cuenta
$('#delButton').on('click', function (event) {
    event.preventDefault();
    var $btn;
   
    function del_edc(edcId, cop){
        $.ajax({
            type:"POST",
            url: "/cuentas/estado",
            data: {"cuentaid": -1, "edcid": edcId, "cop": cop},
            success: function(data){
                swal({   title: "",
                         text: data.msg,
                         type: "success",
                         confirmButtonText: "Ok" });
                $('#processing-modal').modal('toggle');

                $btn.button('reset');
                var origen, tabla;
                
                if (data.conocor === "L"){
                    origen = "con"
                    tabla = t_conta
                }else if (data.conocor === "S"){
                    origen = "cor"
                    tabla = t_corr
                }

                if (data.elim){
                    tabla.row($('#tr-'+ origen+'-'+data.codigo)).remove().draw();
                    $('#elim-data').attr("cod","-1");
                }
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var codEdc = $('#elim-data').attr('cod');
    var idEdc = $('#elim-data').attr('eid');

    if (codEdc!="-1"){
        swal({   title: "",
         text: "Seguro que desea eliminar el estado de cuenta "+codEdc+" ?",
         type: "warning",
         showCancelButton: true,
         confirmButtonText: "Ok"},
         function(){
            $btn = $(this).button('loading')
            $('#processing-modal').modal('toggle');
            del_edc(idEdc,$('#elim-data').attr('modo'));
         });
    }else{
        swal("Ups!","Por favor seleccionar un estado de cuenta a eliminar previamente.","error");
    }
})