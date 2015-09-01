var csrftoken = $.cookie('csrftoken');
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var t_conta = iniciar_tabla(idiomaAux,'conta');
var t_corr = iniciar_tabla(idiomaAux, 'corr');

function commas (num) {
    var N = parseFloat(num).toFixed(2);
    return N.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

$('#Cuenta-sel').change(function() {
  var cuentaId = $('#Cuenta-sel').val();

  if (cuentaId>=0){
    var sel = $('#opt-'+cuentaId);
    var moneda = sel.attr('moneda');

    $('#cta_nostro').val(sel.attr('cn'));
    $('#cta_vostro').val(sel.attr('cv'));
    
    $('#sf-ccon-mon').html(moneda);
    $('#sf-ccor-mon').html(moneda);
    $('#sf-pcon-mon').html(moneda);
    $('#sf-pcor-mon').html(moneda);

    t_conta.clear().draw();
    t_corr.clear().draw();
    $('#processing-modal').modal('toggle');
    est_cuenta(cuentaId);
  }else{

    t_conta.clear().draw();
    t_corr.clear().draw();

    $('#elim-data').attr('cod', "");

    $('#cta_nostro').val("");
    $('#cta_vostro').val("");
    
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

//Rellenar pagina de acuerdo a la seleccion
function est_cuenta(cuentaId){
    $.ajax({
        type:"POST",
        url: "/cuentas/estado",
        data: {"cuentaid": cuentaId},
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
            var json_data = jQuery.parseJSON(data)

            console.log(json_data);

            $('#processing-modal').modal('toggle');

            if (json_data[carg].length>=1){

                var bank = json_data[carg][0].fields.cuenta_idcuenta;
                var bankcod = $('#opt-'+bank).html();

                for (var i = 0; i < json_data[carg].length; i++) {

                    var date_ini = new Date(json_data[carg][i].fields.fecha_inicial)
                    var date_fin = new Date(json_data[carg][i].fields.fecha_final)
                    var cod = json_data[carg][i].pk

                    var td1 = '<td>'+ '<a id="c-'+ cod +'" type="edc" cod="'+json_data[carg][i].fields.codigo+'" modo="carg">' + bankcod + '</a></td>';
                    if (idioma == 0){
                        var td2 = '<td> cargado </td>';    
                    } else {
                        var td2 = '<td> loaded </td>';
                    }
                    var td3 = '<td>' + json_data[carg][i].fields.codigo + '</td>';
                    var td4 = '<td>' + json_data[carg][i].fields.pagina + '</td>';
                    if (idioma == 0){
                        var f_aux = date_ini.toLocaleDateString();
                        var f_aux2 = date_fin.toLocaleDateString();
                    } else {
                        var f_aux1 = date_ini.toLocaleDateString().split("/");
                        var f_aux21 = date_fin.toLocaleDateString().split("/");
                        var f_aux = f_aux1[2] +"/" + f_aux1[1] + "/" + f_aux1[0];
                        var f_aux2 = f_aux21[2] +"/" + f_aux21[1] + "/" + f_aux21[0];
                    }
                    var td5 = '<td>' + json_data[carg][i].fields.m_finicial + ' '+ json_data[carg][i].fields.c_dinicial + ' '+ f_aux + ' ' + $.formatNumber((json_data[carg][i].fields.balance_inicial),{locale:idiomaAux}) +'</td>';
                    var td6 = '<td>' + json_data[carg][i].fields.m_ffinal + ' '+ json_data[carg][i].fields.c_dfinal + ' '+ f_aux2 + ' ' + $.formatNumber((json_data[carg][i].fields.balance_final),{locale:idiomaAux}) +'</td>';



                    if (json_data[carg][i].fields.origen === "L"){
                        $('#table-conta > tbody').append('<tr id ="tr-con-'+cod+'"></tr>');
                        var jRow = $("#tr-con-"+cod).append(td1,td2,td3,td4,td5,td6);
                        t_conta.row.add(jRow);
                        
                        if (!ult_conc_existe){
                            ult_edc_conc = i;
                            ult_conc_existe = true;
                        }

                    }else{
                        $('#table-corr > tbody').append('<tr id ="tr-cor-'+cod+'"></tr>');
                        var jRow = $("#tr-cor-"+cod).append(td1,td2,td3,td4,td5,td6);
                        t_corr.row.add(jRow);

                        if (!ult_corc_existe){
                            ult_edc_corc = i;
                            ult_corc_existe = true;
                        }
                    }
                }
            }

            if (json_data[proc].length>=1){

                var bank = json_data[proc][0].fields.cuenta_idcuenta;
                var bankcod = $('#opt-'+bank).html();

                for (var i = 0; i < json_data[proc].length; i++) {

                    var date_ini = new Date(json_data[proc][i].fields.fecha_inicial)
                    var date_fin = new Date(json_data[proc][i].fields.fecha_final)
                    var cod = json_data[proc][i].pk

                    var td1 = '<td>'+ '<a id="p-'+ cod +'" type="edc" cod="'+json_data[proc][i].fields.codigo+'" modo="proc">' + bankcod + '</a></td>';
                    if (idioma == 0){
                        var td2 = '<td> procesado </td>';    
                    } else {
                        var td2 = '<td> processed </td>';
                    }
                    var td3 = '<td>' + json_data[proc][i].fields.codigo + '</td>';
                    var td4 = '<td>' + json_data[proc][i].fields.pagina + '</td>';
                    if (idioma == 0){
                        var f_aux = date_ini.toLocaleDateString();
                        var f_aux2 = date_fin.toLocaleDateString();
                    } else {
                        var f_aux1 = date_ini.toLocaleDateString().split("/");
                        var f_aux21 = date_fin.toLocaleDateString().split("/");
                        var f_aux = f_aux1[2] +"/" + f_aux1[1] + "/" + f_aux1[0];
                        var f_aux2 = f_aux21[2] +"/" + f_aux21[1] + "/" + f_aux21[0];
                    }
                    var td5 = '<td>' + json_data[proc][i].fields.m_finicial + ' '+ json_data[proc][i].fields.c_dinicial + ' '+ f_aux + ' ' + $.formatNumber((json_data[proc][i].fields.balance_inicial),{locale:idiomaAux}) +'</td>';
                    var td6 = '<td>' + json_data[proc][i].fields.m_ffinal + ' '+ json_data[proc][i].fields.c_dfinal + ' '+ f_aux2 + ' ' + $.formatNumber((json_data[proc][i].fields.balance_final),{locale:idiomaAux}) +'</td>';



                    if (json_data[proc][i].fields.origen === "L"){
                        $('#table-conta > tbody').append('<tr id ="tr-con-'+cod+'"></tr>');
                        var jRow = $("#tr-con-"+cod).append(td1,td2,td3,td4,td5,td6);
                        t_conta.row.add(jRow);
                        
                        if (!ult_conp_existe){
                            ult_edc_conp = i;
                            ult_conp_existe = true;
                        }

                    }else{
                        $('#table-corr > tbody').append('<tr id ="tr-cor-'+cod+'"></tr>');
                        var jRow = $("#tr-cor-"+cod).append(td1,td2,td3,td4,td5,td6);
                        t_corr.row.add(jRow);

                        if (!ult_corp_existe){
                            ult_edc_corp = i;
                            ult_corp_existe = true;
                        }
                    }
                }
            }


            if (ult_conc_existe){
                var fecha_conc = new Date(json_data[carg][ult_edc_conc].fields.fecha_final);
                if (idioma != 0){
                    var fAux2 = String(fecha_conc.toLocaleDateString()).split("/");
                    var fAux = fAux2[2] + "/" + fAux2[1] + "/" + fAux2[0];
                } else {
                    var fAux = fecha_conc.toLocaleDateString();
                }
                $('#edc-ccon').val(json_data[carg][ult_edc_conc].fields.codigo);
                $('#f-ccon').val(fAux);
                $('#sf-ccon-cd').html(json_data[carg][ult_edc_conc].fields.c_dfinal);
                $('#sf-ccon').val($.formatNumber((json_data[carg][ult_edc_conc].fields.balance_final),{locale:idiomaAux}));
            }else{
                $('#edc-ccon').val("");
                $('#f-ccon').val("");
                $('#sf-ccon-cd').html("");
                $('#sf-ccon').val("");
            }

            if (ult_conp_existe){
                var fecha_conp = new Date(json_data[proc][ult_edc_conp].fields.fecha_final)
                if (idioma != 0){
                    var fAux2 = String(fecha_conp.toLocaleDateString()).split("/");
                    var fAux = fAux2[2] + "/" + fAux2[1] + "/" + fAux2[0];
                } else {
                    var fAux = fecha_conp.toLocaleDateString();
                }
                $('#edc-pcon').val(json_data[proc][ult_edc_conp].fields.codigo);
                $('#f-pcon').val(fAux);
                $('#sf-pcon-cd').html(json_data[proc][ult_edc_conp].fields.c_dfinal);
                $('#sf-pcon').val($.formatNumber((json_data[proc][ult_edc_conp].fields.balance_final),{locale:idiomaAux}));
            
                if (!ult_conc_existe){
                    $('#edc-ccon').val(json_data[proc][ult_edc_conp].fields.codigo);
                    $('#f-ccon').val(fecha_conp.toLocaleDateString());
                    $('#sf-ccon-cd').html(json_data[proc][ult_edc_conp].fields.c_dfinal);
                    $('#sf-ccon').val($.formatNumber((json_data[carg][ult_edc_conc].fields.balance_final),{locale:idiomaAux}));
            
                }


            }else{
                $('#edc-pcon').val("");
                $('#f-pcon').val("");
                $('#sf-pcon-cd').html("");
                $('#sf-pcon').val("");
            }

            if (ult_corc_existe){
                var fecha_corc = new Date(json_data[carg][ult_edc_corc].fields.fecha_final)
                if (idioma != 0){
                    var fAux2 = String(fecha_corc.toLocaleDateString()).split("/");
                    var fAux = fAux2[2] + "/" + fAux2[1] + "/" + fAux2[0];
                } else {
                    var fAux = fecha_corc.toLocaleDateString();
                }
                $('#edc-ccor').val(json_data[carg][ult_edc_corc].fields.codigo);
                $('#f-ccor').val(fAux);
                $('#sf-ccor-cd').html(json_data[carg][ult_edc_corc].fields.c_dfinal);
                $('#sf-ccor').val($.formatNumber((json_data[carg][ult_edc_corc].fields.balance_final),{locale:idiomaAux}));
            }else{
                $('#edc-ccor').val("");
                $('#f-ccor').val("");
                $('#sf-ccor-cd').html("");
                $('#sf-ccor').val("");
            }

            if (ult_corp_existe){
                var fecha_corp = new Date(json_data[proc][ult_edc_corp].fields.fecha_final)
                if (idioma != 0){
                    var fAux2 = String(fecha_corp.toLocaleDateString()).split("/");
                    var fAux = fAux2[2] + "/" + fAux2[1] + "/" + fAux2[0];
                } else {
                    var fAux = fecha_corp.toLocaleDateString();
                }
                $('#edc-pcor').val(json_data[proc][ult_edc_corp].fields.codigo);
                $('#f-pcor').val(fAux);
                $('#sf-pcor-cd').html(json_data[proc][ult_edc_corp].fields.c_dfinal);
                $('#sf-pcor').val($.formatNumber((json_data[proc][ult_edc_corp].fields.balance_final),{locale:idiomaAux}));
            
                if (!ult_corc_existe){
                    $('#edc-ccor').val(json_data[proc][ult_edc_corp].fields.codigo);
                    $('#f-ccor').val(fecha_corp.toLocaleDateString());
                    $('#sf-ccor-cd').html(json_data[proc][ult_edc_corp].fields.c_dfinal);
                    $('#sf-ccor').val(commas(json_data[proc][ult_edc_corp].fields.balance_final));
                }

            }else{
                $('#edc-pcor').val("");
                $('#f-pcor').val("");
                $('#sf-pcor-cd').html("");
                $('#sf-pcor').val("");
            }


            t_conta.draw();
            t_corr.draw();

        },
        error: function(error){
            $('#processing-modal').modal('toggle');
            if (idioma == 0) {
                swal("Ups!", "Hubo un error buscando la cuenta especificada.", "error");
            } else {
                swal("Ups!", "Error occurred searching the account.", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

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
        if (idioma == 0){
            msj = "Seguro que desea eliminar el estado de cuenta "+codEdc+" ?";
        } else {
            msj = "Sure you want to delete the account statement "+codEdc+" ?";
        }
        swal({   title: "",
         text: msj,
         type: "warning",
         showCancelButton: true,
         confirmButtonText: "Ok"},
         function(){
            $btn = $(this).button('loading')
            $('#processing-modal').modal('toggle');
            del_edc(idEdc,$('#elim-data').attr('modo'));
         });
    }else{
        if (idioma == 0){
            swal("Ups!","Por favor seleccionar un estado de cuenta a eliminar previamente.","error");
        } else {
            swal("Ups!","Select an account statement first please.","error");
        
        }
    }
})