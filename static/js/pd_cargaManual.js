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
    $('#processing-modal').modal('toggle');
  }else{

    t_conta.clear().draw();
    t_corr.clear().draw();

    $('#elim-data').attr('cod', "");

    $('#cta_nostro').val("");
    $('#cta_vostro').val("");
    $('#banco').val("");
    
    
    $('#sf-ccon-mon').html("");
    $('#sf-ccor-mon').html("");
    $('#sf-pcon-mon').html("");
    $('#sf-pcor-mon').html("");

    $('#edc-ccon').val("");
    $('#f-ccon').val("");
    $('#sf-ccon-cd').html("");
    $('#sf-ccon').val("");

    $('#edc-pcon').val("");
    $('#f-pcon').val("");
    $('#sf-pcon-cd').html("");
    $('#sf-pcon').val("");
    $('#edc-ccor').val("");
    $('#f-ccor').val("");
    $('#sf-ccor-cd').html("");
    $('#sf-ccor').val("");

    $('#edc-pcor').val("");
    $('#f-pcor').val("");
    $('#sf-pcor-cd').html("");
    $('#sf-pcor').val("");
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

$('input[name=radiocuenta]').change(function(){
    $('#processing-modal').modal('toggle');
        
    var tipo = $(this).attr('id');
    console.log(tipo+" idaux")

    var cuentaId = $('#Cuenta-sel').val();

    if (cuentaId>=0){
        var sel = $('#opt-'+cuentaId);
        var moneda = sel.attr('moneda');
        
        $('#sf-ccon-mon').html(moneda);
        $('#sf-ccor-mon').html(moneda);
        $('#sf-pcon-mon').html(moneda);
        $('#sf-pcor-mon').html(moneda);

        }else{

        $('#elim-data').attr('cod', "");

        $('#sf-ccon-mon').html("");
        $('#sf-ccor-mon').html("");
        $('#sf-pcon-mon').html("");
        $('#sf-pcor-mon').html("");

        $('#edc-ccon').val("");
        $('#f-ccon').val("");
        $('#sf-ccon-cd').html("");
        $('#sf-ccon').val("");

        $('#edc-pcon').val("");
        $('#f-pcon').val("");
        $('#sf-pcon-cd').html("");
        $('#sf-pcon').val("");
        $('#edc-ccor').val("");
        $('#f-ccor').val("");
        $('#sf-ccor-cd').html("");
        $('#sf-ccor').val("");

        $('#edc-pcor').val("");
        $('#f-pcor').val("");
        $('#sf-pcor-cd').html("");
        $('#sf-pcor').val("");
        
    }

    buscarEstado(tipo,cuentaId)
     
});

function reiniciar_tablas(){
    t_conta.clear().draw();
    t_corr.clear().draw();
    return true;
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
function buscarEstado(tipo,cuentaid){
    $.ajax({
        type:"POST",
        url: "/procd/cargMan/",
        data: {'tipo':tipo,'cuentaid':cuentaid ,'action':'buscar'},
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
            console.log(data.tipo)
            var json_data = jQuery.parseJSON(data.query)
            console.log(json_data)

            if (json_data[carg].length>=1){
            console.log("entre")
                  
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
                console.log("entre")
            
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
                console.log("entre3"+tipo+" "+json_data[carg][ult_edc_conc].fields.codigo)
            
                var fecha_conc = new Date(json_data[carg][ult_edc_conc].fields.fecha_final)
                $('#edc-ccon').val(json_data[carg][ult_edc_conc].fields.codigo);
                $('#f-ccon').val(fecha_conc.toLocaleDateString());
                $('#sf-ccon-cd').html(json_data[carg][ult_edc_conc].fields.c_dfinal);
                $('#sf-ccon').val(commas(json_data[carg][ult_edc_conc].fields.balance_final));
            }else{
                $('#edc-ccon').val("");
                $('#f-ccon').val("");
                $('#sf-ccon-cd').html("");
                $('#sf-ccon').val("");
            }

            if (ult_conp_existe && !ult_conc_existe && tipo =="cont-radio"){
                console.log("entre4"+tipo+" "+json_data[proc][ult_edc_conp].fields.codigo)
            
                var fecha_conp = new Date(json_data[proc][ult_edc_conp].fields.fecha_final)
                $('#edc-ccon').val(json_data[proc][ult_edc_conp].fields.codigo);
                $('#f-ccon').val(fecha_conp.toLocaleDateString());
                $('#sf-ccon-cd').html(json_data[proc][ult_edc_conp].fields.c_dfinal);
                $('#sf-ccon').val(commas(json_data[proc][ult_edc_conp].fields.balance_final));
            
            }else{
                $('#edc-ccon').val("");
                $('#f-ccon').val("");
                $('#sf-ccon-cd').html("");
                $('#sf-ccon').val("");
            }

            if (ult_corc_existe && tipo =="corr-radio"){
                console.log("entre5"+tipo+" "+json_data[carg][ult_edc_corc].fields.codigo)
            
                var fecha_corc = new Date(json_data[carg][ult_edc_corc].fields.fecha_final)
                $('#edc-ccon').val(json_data[carg][ult_edc_corc].fields.codigo);
                $('#f-ccon').val(fecha_corc.toLocaleDateString());
                $('#sf-ccon-cd').html(json_data[carg][ult_edc_corc].fields.c_dfinal);
                $('#sf-ccon').val(commas(json_data[carg][ult_edc_corc].fields.balance_final));
            }else{
                $('#edc-ccon').val("");
                $('#f-ccon').val("");
                $('#sf-ccon-cd').html("");
                $('#sf-ccon').val("");
            }

            if (ult_corp_existe && !ult_corc_existe && tipo =="corr-radio"){
                console.log("entre6"+tipo+" "+json_data[proc][ult_edc_corp].fields.codigo)
            
                var fecha_corp = new Date(json_data[proc][ult_edc_corp].fields.fecha_final)
                $('#edc-ccon').val(json_data[proc][ult_edc_corp].fields.codigo);
                $('#f-ccon').val(fecha_corp.toLocaleDateString());
                $('#sf-ccon-cd').html(json_data[proc][ult_edc_corp].fields.c_dfinal);
                $('#sf-ccon').val(commas(json_data[proc][ult_edc_corp].fields.balance_final));
            
            }else{
                $('#edc-ccon').val("");
                $('#f-ccon').val("");
                $('#sf-ccon-cd').html("");
                $('#sf-ccon').val("");
            }

            /*edcArray = data.r_edcn;

            $('#pbardiv').prop('hidden', false);
            $('#pbar').attr('max', json_corr.length+json_conta.length);

            // Initalize and start iterating
            var contaIter = new heavyLifter(json_conta,'conta');
            contaIter.startCalculation();

            // Initalize and start iterating
            var corrIter = new heavyLifter(json_corr,'corr');
            corrIter.startCalculation();*/

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