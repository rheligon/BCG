//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
var tencaje = iniciar_tabla_encaje(idioma_tr);
var csrftoken = $.cookie('csrftoken');

function EmptyNotNone(s){
    if (s==="None"){
        return ""
    }else{
        return s
    }
}

function iniciar_tabla(idioma){
    if (idioma==="es"){

        return $('#table-cuentas').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            }
        })

    }else if (idioma==="en"){

        return $('#table-cuentas').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            }
        })
    };
};

function iniciar_tabla_encaje(idioma){

    if (idioma==="es"){

        return $('#table-encaje').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "dom": 'rt'
        })

    }else if (idioma==="en"){

        return $('#table-encaje').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "dom": 'rt<"col-md-6"li><"col-md-6"fp>'
        })
    };
};

//Inicializar los Spinner
$("#spin1").TouchSpin({
    verticalbuttons: true,
    min: 0,
    max: 100,
    step: 1,
    boostat: 5,
    maxboostedstep: 10,
    postfix: '%'
});

$("#spin0, #spin2, #spin3").TouchSpin({
    verticalbuttons: true,
    min: 0,
    max: 100,
    step: 1,
    boostat: 5,
    maxboostedstep: 10,
    postfix: 'Días'
});

$("#dg-spin0").TouchSpin({
    verticalbuttons: true,
    min: 0,
    max: 100,
    step: 1,
    boostat: 5,
    maxboostedstep: 10,
    postfix: 'Meses'
});

$("#dg-spin1").TouchSpin({
    verticalbuttons: true,
    min: 0,
    max: 100,
    step: 1,
    boostat: 5,
    maxboostedstep: 10
});

//Habilitar los Spinner si se elige el checkbox
$('#Alertas-0').change(function () {
    $("#spin0").prop("disabled", !this.checked);
});
$('#Alertas-1').change(function () {
    $("#spin1").prop("disabled", !this.checked);
});
$('#Alertas-2').change(function () {
    $("#spin2").prop("disabled", !this.checked);
});
$('#Alertas-3').change(function () {
    $("#spin3").prop("disabled", !this.checked);
});

function clean_cta_form(){
    //Datos Generales
    $("#cuenta-codigo").val("");
    $("#Banco-sel").val(-1);
    $("#cuenta-desc").val("");
    $("#cuenta-nostro").val("");
    $("#cuenta-vostro").val("");
    $("#Moneda-sel").val(-1);

    //Alertas
    $('#a-mail').val("");
    var checkbalertas = $('input[name="Alertas"]');
    for (var i=0;i<7;i++){
        if (i<4){
          $('#spin'+i).val(0);
          $("#spin"+i).prop("disabled", true);
        };
        $(checkbalertas[i]).attr("checked",false);
    };

    //Formatos y procesos
    $("#TipoCuenta-sel").val(-1);
    $("#FormConta-sel").val(-1);
    $("#FormCorr-sel").val(-1);
    for (var i=1;i<5;i++){
      $("#Proc-"+i).prop("checked",false);
    };

    //Dg Parametros
    $("#dg-spin0").val(0);
    $("#dg-spin1").val(0);
    $("#tipoTransGiro").val("");
    $("#param-sel").val('Activa');

    //Dg criterios
    $("#crit-sel").val(-1);
    $('#Nom_criterio').val("");
    $('#Mon1_criterio').val("");
    $('#Mon2_criterio').val("");
    $('#Mon3_criterio').val("");
    $('#F1_criterio').val("");
    $('#F2_criterio').val("");
    $('#F3_criterio').val("");
    $('#F4_criterio').val("");
    $('#F5_criterio').val("");

    //Dg Reglas
    $('#sel-reglas > option').remove();
    $('#sel-reglas').append('<option value="-1">--------</option>');
    $('#Nom_regla').val("");
    $('#trans-conta').val("");
    $('#trans-corr').val("");
    $('#masc-conta').val("");
    $('#masc-corr').val("");
    $('#sel-ref-conta').val("");
    $('#sel-ref-corr').val("");
};

//Mostrar Detalle al hacer click en código de cuenta
$('#table-cuentas').on('click','a[type=cuenta]', function(event) {
    event.preventDefault();
    var a_idaux = $("#Id_cuenta").val();

    var a_id = $(this).attr("id");
    var a_cod = $(this).attr("cod");
    var a_crit = $(this).attr("criterio");
    var a_desc = $(this).attr("desc");
    var a_banco = $(this).attr("banco");
    var a_moneda = $(this).attr("moneda");
    var a_nostro = $(this).attr("nostro");
    var a_vostro = $(this).attr("vostro");
    var a_estado = $(this).attr("estado");
    var a_nsaltos = $(this).attr("nsaltos");
    var a_tgiro = $(this).attr("tgiro");
    var a_retencion = $(this).attr("retencion");
    var a_correoa = $(this).attr("correoa");
    var a_intraday = $(this).attr("intraday");
    var a_tipocta = $(this).attr("tipocta");
    var a_tipoccont = $(this).attr("tipoccont");
    var a_tipoccorr = $(this).attr("tipoccorr");
    var a_proc = $(this).attr("proc");


    //Estilo de elemento elegido
    $('#'+a_idaux).parent().css("background-color","")
    $('#'+a_idaux).css("color","")
    $(this).parent().css("background-color","#337ab7")
    $(this).css("color","white")

    $("#Id_cuenta").val(a_id);

    //Limpiar elementos
    clean_cta_form();
    //Asignar elementos a los campos

    //Cargar reglas segun la cuenta
    $('#processing-modal').modal('toggle');
    reglasT(a_id);

    //Datos Generales
    $("#cuenta-codigo").val(a_cod);
    $("#Banco-sel").val(a_banco);
    $("#cuenta-desc").val(a_desc);
    $("#cuenta-nostro").val(a_nostro);
    $("#cuenta-vostro").val(a_vostro);
    $("#Moneda-sel").val(a_moneda);

    //Alertas
    $('#a-mail').val(a_correoa);

    //Formatos y procesos
    $("#TipoCuenta-sel").val(a_tipocta);
    $("#FormConta-sel").val(a_tipoccont);
    $("#FormCorr-sel").val(a_tipoccorr);
    for (var i=0;i<a_proc.length;i++){
      $("#Proc-"+a_proc[i]).prop("checked",true);
    };

    //Dg Parametros
    $("#dg-spin0").val(a_retencion);
    $("#dg-spin1").val(a_nsaltos);
    $("#tipoTransGiro").val(a_tgiro);
    $("#param-sel").val(a_estado);

    //Dg criterios
    $("#crit-sel").val(a_crit);
    var criterio = $('#optc-'+a_crit);
    $('#Nom_criterio').val(criterio.attr('nombre'));
    $('#Mon1_criterio').val(EmptyNotNone(criterio.attr('monto1')));
    $('#Mon2_criterio').val(EmptyNotNone(criterio.attr('monto2')));
    $('#Mon3_criterio').val(EmptyNotNone(criterio.attr('monto3')));
    $('#F1_criterio').val(EmptyNotNone(criterio.attr('fecha1')));
    $('#F2_criterio').val(EmptyNotNone(criterio.attr('fecha2')));
    $('#F3_criterio').val(EmptyNotNone(criterio.attr('fecha3')));
    $('#F4_criterio').val(EmptyNotNone(criterio.attr('fecha4')));
    $('#F5_criterio').val(EmptyNotNone(criterio.attr('fecha5')));

    //Encajes
    encaje_s(a_id);
});

//Al cambiar la regla se cambian los valores
$('#sel-reglas').change(function() {
  var reglaId = $('#sel-reglas').val();
  var regla = $('#optr-'+reglaId);

  //Los vacio primero
  $('#Nom_regla').val("");
  $('#trans-conta').val("");
  $('#trans-corr').val("");
  $('#masc-conta').val("");
  $('#masc-corr').val("");
  $('#sel-ref-conta').val("");
  $('#sel-ref-corr').val("");

  //Se rellenan los campos
  $('#Nom_regla').val(regla.attr("nombre"));
  $('#trans-conta').val(regla.attr("trans_conta"));
  $('#trans-corr').val(regla.attr("trans_corr"));
  $('#masc-conta').val(regla.attr("masc_conta"));
  $('#masc-corr').val(regla.attr("masc_corr"));
  $('#sel-ref-conta').val(regla.attr("ref_conta"));
  $('#sel-ref-corr').val(regla.attr("ref_corr"));
});

//Al cambiar el criterio se cambian los valores
$('#crit-sel').change(function() {
  var a_crit = $("#crit-sel").val();
  var criterio = $('#optc-'+a_crit);

  //Los vacio primero
  $('#Nom_criterio').val("");
  $('#Mon1_criterio').val("");
  $('#Mon2_criterio').val("");
  $('#Mon3_criterio').val("");
  $('#F1_criterio').val("");
  $('#F2_criterio').val("");
  $('#F3_criterio').val("");
  $('#F4_criterio').val("");
  $('#F5_criterio').val("");

  //Se rellenan los campos
  $('#Nom_criterio').val(criterio.attr('nombre'));
  $('#Mon1_criterio').val(EmptyNotNone(criterio.attr('monto1')));
  $('#Mon2_criterio').val(EmptyNotNone(criterio.attr('monto2')));
  $('#Mon3_criterio').val(EmptyNotNone(criterio.attr('monto3')));
  $('#F1_criterio').val(EmptyNotNone(criterio.attr('fecha1')));
  $('#F2_criterio').val(EmptyNotNone(criterio.attr('fecha2')));
  $('#F3_criterio').val(EmptyNotNone(criterio.attr('fecha3')));
  $('#F4_criterio').val(EmptyNotNone(criterio.attr('fecha4')));
  $('#F5_criterio').val(EmptyNotNone(criterio.attr('fecha5'))); 
});

//Rellenar pagina de acuerdo a la seleccion
function reglasT(cuentaId){
    $.ajax({
        type:"POST",
        url: "/admin/reglas_transf/",
        data: {"cuentaid": cuentaId, "action": 'sel'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);

            $('#sel-reglas > option').remove();
            $('#sel-reglas').append('<option value="-1">--------</option>');

            for (var i = 0; i < json_data.length; i++) {
                var a_id = json_data[i].pk
                var a_nom = json_data[i].fields.nombre
                var a_masc_conta = json_data[i].fields.mascara_contabilidad
                var a_masc_corr = json_data[i].fields.mascara_corresponsal
                var a_ref_conta = json_data[i].fields.ref_contabilidad
                var a_ref_corr = json_data[i].fields.ref_corresponsal
                var a_trans_conta = json_data[i].fields.transaccion_contabilidad
                var a_trans_corr = json_data[i].fields.transaccion_corresponsal
                var a_tipo = json_data[i].fields.tipo

                $('#sel-reglas').append('<option id="optr-'+ a_id +'" value="'+a_id+'" type="regla" masc_conta="'+ a_masc_conta + '" masc_corr="' + a_masc_corr + '" nombre="' + a_nom + '" ref_conta="' + a_ref_conta + '" ref_corr="'+ a_ref_corr + '" tipo="'+ a_tipo + '" trans_conta="'+ a_trans_conta + '" trans_corr="'+ a_trans_corr +'">'+a_nom+'</option>');
            };                                      
            $('#processing-modal').modal('toggle');
        },
        error: function(error){
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando las reglas de la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Rellenar pagina de acuerdo a la seleccion
function encaje_s(cuentaId){
    $.ajax({
        type:"POST",
        url: "/admin/cuentas/",
        data: {"cuentaid": cuentaId, "action": 'encaje_S'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            $('#table-encaje > tbody > tr').remove();
            
            for (var i = 0; i < json_data.length; i++) {
                var a_id = json_data[i].pk;
                var a_monto = json_data[i].fields.monto;
                var a_fecha = json_data[i].fields.fecha;
                $('#table-encaje > tbody').append('<tr id="tre-'+a_id+'"><tr>');
                var jRow = $("#tre-"+a_id).append('<td>'+a_fecha+'</td>'+'<td>'+a_monto+'</td>');
                tencaje.row.add(jRow).draw();
            };

            if (json_data.length>0){
              var i = json_data.length-1;
              var fecha = json_data[i].fields.fecha;
              var monto = json_data[i].fields.monto;
              $('#encaje-fecha').val(fecha);
              $('#encaje-monto').val(monto);
            };
        },
        error: function(error){
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando el encaje de la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Rellenar pagina de acuerdo a la seleccion
function encaje_add(cuentaId,monto,fecha){
    $.ajax({
        type:"POST",
        url: "/admin/cuentas/",
        data: {"cuentaid": cuentaId,"monto":monto,"fecha":fecha, "action": 'encaje_add'},
        success: function(data){
            var json_data = jQuery.parseJSON(data);
            var jsonl = json_data.length;
            $('#table-encaje > tbody > tr').remove();

            for (var i = 0; i < jsonl; i++) {
                var a_id = json_data[i].pk;
                var a_monto = json_data[i].fields.monto;
                var a_fecha = json_data[i].fields.fecha;
                $('#table-encaje > tbody').append('<tr id="tre-'+a_id+'"><tr>');
                var jRow = $("#tre-"+a_id).append('<td>'+a_fecha+'</td>'+'<td>'+a_monto+'</td>');
                tencaje.row.add(jRow).draw();
            };
        },
        error: function(error){
            $('#processing-modal').modal('toggle');
            swal("Ups!", "Hubo un error buscando el encaje de la cuenta especificada.", "error");
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
};

//Eliminar Cuenta
$('#delButton').on('click', function () {
    var $btn;
   
    function del_cta(cuentaId){
        $.ajax({
            type:"POST",
            url: "/admin/cuentas/",
            data: {"cuentaid": cuentaId, "action": "del"},
            success: function(data){

                if (data.elim){
                    tabla.row($('#tr-'+ data.cuentaid)).remove().draw();
                    clean_cta_form();
                    $('#Id_cuenta').val(-1);

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            error: function(jqXHR, error){
                $('#processing-modal').modal('toggle');
                swal("Ups!", "Hubo un error modificando la regla especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var idC = $("#Id_cuenta").val();
    var codC = $("#"+idC).attr("cod");
    if (idC>=0){
        swal({   title: "",
             text: "Seguro que desea eliminar la cuenta "+ codC +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                del_cta(idC);
             }
             );
    }else{
        swal("Ups!","Por favor seleccionar la cuenta a eliminar previamente.","error");
    }
})

//Cambiar botones a aceptar y cancelar
$('#addButton').on('click', function () {
    clean_cta_form();
    $(this).parent().toggle('hidden');
    $('#delButton').parent().toggle('hidden');
    $('#acptButton').parent().toggle('hidden');
    $('#cancelButton').parent().toggle('hidden');
});

//Cambiar botones a agregar y eliminar
$('#cancelButton').on('click', function () {

    $('#acptButton').parent().toggle('hidden');
    $(this).parent().toggle('hidden');
    $('#addButton').parent().toggle('hidden');
    $('#delButton').parent().toggle('hidden');
});

//Agregar Cuenta
$('#acptButton').on('click', function () {
    var $btn;
   
    function add_cta(criterioid,ctacod,bancoid,monedaid,ref_nostro,ref_vostro,desc,estado,tretencion,nsaltos,tgiro,intraday,amail,tipocta,tcargcont,tcargcorr,tproc){
        $.ajax({
            type:"POST",
            url: "/admin/cuentas/",
            data: {'criterioid':criterioid,'ctacod':ctacod,'bancoid':bancoid,'monedaid':monedaid,'ref_nostro':ref_nostro,'ref_vostro':ref_vostro,'desc':desc,'estado':estado,'tretencion':tretencion,'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'amail':amail,'tipocta':tipocta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc,"action": "add"},
            success: function(data){

                if (data.add){

                    clean_cta_form();

                    var cuentaid = data.cuentaid;
                    var codC = data.codigo;
                    var criterioid = data.criterioid;
                    var bancoid = data.bancoid;
                    var monedaid = data.monedaid;
                    var ref_nostro = data.ref_nostro;
                    var ref_vostro = data.ref_vostro;
                    var desc = data.desc;
                    var estado = data.estado;
                    var tretencion = data.tretencion;
                    var nsaltos = data.nsaltos;
                    var tgiro = data.tgiro;
                    var intraday = data.intraday;
                    var amail = data.mailalertas;
                    var tipocta = data.tipo_cta;
                    var tcargcont = data.tcargcont;
                    var tcargcorr = data.tcargcorr;
                    var procs = data.tproc;

                    $('#Id_cuenta').val(cuentaid);

                    //Datos Generales
                    $("#cuenta-codigo").val(codC);
                    $("#Banco-sel").val(bancoid);
                    $("#cuenta-desc").val(desc);
                    $("#cuenta-nostro").val(ref_nostro);
                    $("#cuenta-vostro").val(ref_vostro);
                    $("#Moneda-sel").val(monedaid);

                    //Alertas
                    $('#a-mail').val(amail);

                    //Formatos y procesos
                    $("#TipoCuenta-sel").val(tipocta);
                    $("#FormConta-sel").val(tcargcont);
                    $("#FormCorr-sel").val(tcargcorr);
                    for (var i=0;i<procs.length;i++){
                      $("#Proc-"+procs[i]).prop("checked",true);
                    };

                    //Dg Parametros
                    $("#dg-spin0").val(tretencion);
                    $("#dg-spin1").val(nsaltos);
                    $("#tipoTransGiro").val(tgiro);
                    $("#param-sel").val(estado);

                    //Dg criterios
                    $("#crit-sel").val(criterioid);
                    var criterio = $('#optc-'+criterioid);
                    $('#Nom_criterio').val(criterio.attr('nombre'));
                    $('#Mon1_criterio').val(EmptyNotNone(criterio.attr('monto1')));
                    $('#Mon2_criterio').val(EmptyNotNone(criterio.attr('monto2')));
                    $('#Mon3_criterio').val(EmptyNotNone(criterio.attr('monto3')));
                    $('#F1_criterio').val(EmptyNotNone(criterio.attr('fecha1')));
                    $('#F2_criterio').val(EmptyNotNone(criterio.attr('fecha2')));
                    $('#F3_criterio').val(EmptyNotNone(criterio.attr('fecha3')));
                    $('#F4_criterio').val(EmptyNotNone(criterio.attr('fecha4')));
                    $('#F5_criterio').val(EmptyNotNone(criterio.attr('fecha5')));

                    var td1 = '<td>'+ '<a cod="'+codC+'" id="'+cuentaid+'" criterio="'+criterioid+'" desc="'+desc+'" banco="'+bancoid+'" moneda="'+monedaid+'" nostro="'+ref_nostro+'" vostro="'+ref_vostro+'" estado="'+estado+'" nsaltos="'+nsaltos+'" tgiro="'+tgiro+'" retencion="'+tretencion+'" correoa="'+amail+'" intraday="'+intraday+'" tipocta="'+tipocta+'" tipoccont="'+tcargcont+'" tipoccorr="'+tcargcorr+'" proc="'+procs+'" type="cuenta">'+codC+'</a>';
                    var td2 = '<td>' + desc + '</td>';
                    var td3 = '<td>' + data.bancocod + '</td>';
                    var td4 = '<td>' + ref_nostro + '</td>';
                    var td5 = '<td>' + ref_vostro + '</td>';
                    var td6 = '<td>' + data.monedacod + '</td>';
                    var td7 = '<td>' + estado + '</td>';
                    var td8 = '<td>' + data.criterionom + '</td>';

                    $('#table-cuentas > tbody').append('<tr id ="tr-'+cuentaid+'"></tr>');

                    var jRow = $("#tr-"+cuentaid).append(td1,td2,td3,td4,td5,td6,td7,td8);

                    tabla.row.add(jRow).draw();

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                $('#acptButton').parent().toggle('hidden');
                $('#cancelButton').parent().toggle('hidden');
                $('#addButton').parent().toggle('hidden');
                $('#delButton').parent().toggle('hidden');
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            error: function(jqXHR, error){
                alert(jqXHR.responseText) //debug
                $('#processing-modal').modal('toggle');
                swal("Ups!", "Hubo un error creando la cuenta especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var codC = $("#cuenta-codigo").val();
    var criterioid = $('#crit-sel').val();
    var bancoid = $('#Banco-sel').val();
    var monedaid = $('#Moneda-sel').val();
    var ref_nostro = $('#cuenta-nostro').val();
    var ref_vostro = $('#cuenta-vostro').val();
    var desc = $('#cuenta-desc').val();
    var estado = $('#param-sel').val();
    var tretencion = $('#dg-spin0').val();
    var nsaltos = $('#dg-spin1').val();
    var tgiro = $('#tipoTransGiro').val();
    var intraday = 0;
    var amail = $('#a-mail').val();
    var tipocta = $('#TipoCuenta-sel').val();
    var tcargcont = $('#FormConta-sel').val();
    var tcargcorr = $('#FormCorr-sel').val();
    var procs = $('input[name="Proc"]:checked');
    var tproc = "";
    for (var i=0;i<procs.length;i++){
        tproc += $(procs[i]).val();
    }

    if (codC.length>0 && codC.length<11 && criterioid>0 && bancoid>0 && monedaid>0 && ref_nostro.length>0 && ref_vostro.length>0 && tipocta>=0 && tcargcont>=0 && tcargcorr>=0 && procs.length>0 && desc.length<=45 && ref_vostro.length<=35 && ref_nostro.length<=35 && tgiro.length<=20 && amail.length<=45 ){
        swal({   title: "",
             text: "Seguro que desea agregar la cuenta "+ codC +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                add_cta(criterioid,codC,bancoid,monedaid,ref_nostro,ref_vostro,desc,estado,tretencion,nsaltos,tgiro,intraday,amail,tipocta,tcargcont,tcargcorr,tproc);
             }
             );
    }else{
      if (codC.length===0){
        swal("Ups!","Por favor colocar un codigo para la cuenta.","error");
      }else if (codC.length>10){
        swal("Ups!","El codigo para la cuenta tiene un máximo de 10 caracteres.","error");
      }else if (criterioid<=0){
        swal("Ups!","Por favor elija un criterio para la cuenta.","error");
      }else if (bancoid<=0){
        swal("Ups!","Por favor elija un banco para la cuenta.","error");
      }else if (monedaid<=0){
        swal("Ups!","Por favor elija una moneda para la cuenta.","error");
      }else if (ref_nostro.length===0){
        swal("Ups!","Por favor indique un Nro. Cta. Nostro para la cuenta.","error");
      }else if (ref_vostro.length===0){
        swal("Ups!","Por favor indique un Nro. Cta. Vostro para la cuenta.","error");
      }else if (tipocta<0){
        swal("Ups!","Por favor elija un tipo de cuenta.","error");
      }else if (tcargcont<0){
        swal("Ups!","Por favor elija un tipo de archivo de carga para la contabilidad de la cuenta.","error");
      }else if (tcargcorr<0){
        swal("Ups!","Por favor elija un tipo de archivo de carga para el corresponsal de la cuenta.","error");
      }else if (procs.length<=0){
        swal("Ups!","Por favor elija al menos un proceso de match designado para esta cuenta.","error");
      }else if (desc.length>45){
        swal("Ups!","La descripcion para la cuenta no debe tener mas de 45 caracteres.","error");
      }else if (ref_nostro.length>35 || ref_vostro.length>35){
        swal("Ups!","El tamaño de la referencia nostro/vostro para la cuenta no debe tener mas de 35 caracteres.","error");
      }else if(tgiro.length>20){
        swal("Ups!","El tamaño del tipo transacción giro para la cuenta no debe tener mas de 20 caracteres.","error");
      }else if(amail.length>45){
        swal("Ups!","El tamaño del correo de alertas para la cuenta no debe tener mas de 45 caracteres.","error");
      };
    }
})

//Modificar Cuenta
$('#updButton').on('click', function () {
    var $btn;
   
    function upd_cta(cuentaid,criterioid,ctacod,bancoid,monedaid,ref_nostro,ref_vostro,desc,estado,tretencion,nsaltos,tgiro,intraday,amail,tipocta,tcargcont,tcargcorr,tproc){
        $.ajax({
            type:"POST",
            url: "/admin/cuentas/",
            data: {'cuentaid':cuentaid ,'criterioid':criterioid,'ctacod':ctacod,'bancoid':bancoid,'monedaid':monedaid,'ref_nostro':ref_nostro,'ref_vostro':ref_vostro,'desc':desc,'estado':estado,'tretencion':tretencion,'nsaltos':nsaltos,'tgiro':tgiro,'intraday':intraday,'amail':amail,'tipocta':tipocta,'tcargcont':tcargcont,'tcargcorr':tcargcorr,'tproc':tproc,"action": "upd"},
            success: function(data){

                if (data.modif){

                    clean_cta_form();
                    var cuentaid = data.cuentaid;
                    var codC = data.codigo;
                    var criterioid = data.criterioid;
                    var bancoid = data.bancoid;
                    var monedaid = data.monedaid;
                    var ref_nostro = data.ref_nostro;
                    var ref_vostro = data.ref_vostro;
                    var desc = data.desc;
                    var estado = data.estado;
                    var tretencion = data.tretencion;
                    var nsaltos = data.nsaltos;
                    var tgiro = data.tgiro;
                    var intraday = data.intraday;
                    var amail = data.mailalertas;
                    var tipocta = data.tipo_cta;
                    var tcargcont = data.tcargcont;
                    var tcargcorr = data.tcargcorr;
                    var procs = data.tproc;

                    tabla.row($('#tr-'+ cuentaid)).remove().draw();
                    $('#Id_cuenta').val(cuentaid);

                    //Datos Generales
                    $("#cuenta-codigo").val(codC);
                    $("#Banco-sel").val(bancoid);
                    $("#cuenta-desc").val(desc);
                    $("#cuenta-nostro").val(ref_nostro);
                    $("#cuenta-vostro").val(ref_vostro);
                    $("#Moneda-sel").val(monedaid);

                    //Alertas
                    $('#a-mail').val(amail);

                    //Formatos y procesos
                    $("#TipoCuenta-sel").val(tipocta);
                    $("#FormConta-sel").val(tcargcont);
                    $("#FormCorr-sel").val(tcargcorr);
                    for (var i=0;i<procs.length;i++){
                      $("#Proc-"+procs[i]).prop("checked",true);
                    };

                    //Dg Parametros
                    $("#dg-spin0").val(tretencion);
                    $("#dg-spin1").val(nsaltos);
                    $("#tipoTransGiro").val(tgiro);
                    $("#param-sel").val(estado);

                    //Dg criterios
                    $("#crit-sel").val(criterioid);
                    var criterio = $('#optc-'+criterioid);
                    $('#Nom_criterio').val(criterio.attr('nombre'));
                    $('#Mon1_criterio').val(EmptyNotNone(criterio.attr('monto1')));
                    $('#Mon2_criterio').val(EmptyNotNone(criterio.attr('monto2')));
                    $('#Mon3_criterio').val(EmptyNotNone(criterio.attr('monto3')));
                    $('#F1_criterio').val(EmptyNotNone(criterio.attr('fecha1')));
                    $('#F2_criterio').val(EmptyNotNone(criterio.attr('fecha2')));
                    $('#F3_criterio').val(EmptyNotNone(criterio.attr('fecha3')));
                    $('#F4_criterio').val(EmptyNotNone(criterio.attr('fecha4')));
                    $('#F5_criterio').val(EmptyNotNone(criterio.attr('fecha5')));

                    var td1 = '<td>'+ '<a cod="'+codC+'" id="'+cuentaid+'" criterio="'+criterioid+'" desc="'+desc+'" banco="'+bancoid+'" moneda="'+monedaid+'" nostro="'+ref_nostro+'" vostro="'+ref_vostro+'" estado="'+estado+'" nsaltos="'+nsaltos+'" tgiro="'+tgiro+'" retencion="'+tretencion+'" correoa="'+amail+'" intraday="'+intraday+'" tipocta="'+tipocta+'" tipoccont="'+tcargcont+'" tipoccorr="'+tcargcorr+'" proc="'+procs+'" type="cuenta">'+codC+'</a>';
                    var td2 = '<td>' + desc + '</td>';
                    var td3 = '<td>' + data.bancocod + '</td>';
                    var td4 = '<td>' + ref_nostro + '</td>';
                    var td5 = '<td>' + ref_vostro + '</td>';
                    var td6 = '<td>' + data.monedacod + '</td>';
                    var td7 = '<td>' + estado + '</td>';
                    var td8 = '<td>' + data.criterionom + '</td>';

                    $('#table-cuentas > tbody').append('<tr id ="tr-'+cuentaid+'"></tr>');

                    var jRow = $("#tr-"+cuentaid).append(td1,td2,td3,td4,td5,td6,td7,td8);

                    tabla.row.add(jRow).draw();

                    swal({   title: "",
                             text: data.msg,
                             type: "success",
                             confirmButtonText: "Ok" });
                }else{
                    swal({   title: "",
                             text: data.msg,
                             type: "error",
                             confirmButtonText: "Ok" });
                }
                $('#processing-modal').modal('toggle');
                $btn.button('reset')
            },
            error: function(jqXHR, error){
                alert(jqXHR.responseText) //debug
                $('#processing-modal').modal('toggle');
                swal("Ups!", "Hubo un error creando la cuenta especificada.", "error");
            },
            dataType:'json',
            headers:{
                'X-CSRFToken':csrftoken
            }
        });
        return false;
    }

    var cuentaid = $('#Id_cuenta').val();
    var codC = $("#cuenta-codigo").val();
    var criterioid = $('#crit-sel').val();
    var bancoid = $('#Banco-sel').val();
    var monedaid = $('#Moneda-sel').val();
    var ref_nostro = $('#cuenta-nostro').val();
    var ref_vostro = $('#cuenta-vostro').val();
    var desc = $('#cuenta-desc').val();
    var estado = $('#param-sel').val();
    var tretencion = $('#dg-spin0').val();
    var nsaltos = $('#dg-spin1').val();
    var tgiro = $('#tipoTransGiro').val();
    var intraday = 0;
    var amail = $('#a-mail').val();
    var tipocta = $('#TipoCuenta-sel').val();
    var tcargcont = $('#FormConta-sel').val();
    var tcargcorr = $('#FormCorr-sel').val();
    var procs = $('input[name="Proc"]:checked');
    var tproc = "";
    for (var i=0;i<procs.length;i++){
        tproc += $(procs[i]).val();
    }

    if (cuentaid>0 && codC.length>0 && codC.length<11 && criterioid>0 && bancoid>0 && monedaid>0 && ref_nostro.length>0 && ref_vostro.length>0 && tipocta>=0 && tcargcont>=0 && tcargcorr>=0 && procs.length>0 && desc.length<=45 && ref_vostro.length<=35 && ref_nostro.length<=35 && tgiro.length<=20 && amail.length<=45 ){
        swal({   title: "",
             text: "Seguro que desea modificar la cuenta "+ codC +" ?",
             type: "warning",
             showCancelButton: true,
             confirmButtonText: "Ok"},
             function(){
                $btn = $(this).button('loading')
                $('#processing-modal').modal('toggle');
                upd_cta(cuentaid,criterioid,codC,bancoid,monedaid,ref_nostro,ref_vostro,desc,estado,tretencion,nsaltos,tgiro,intraday,amail,tipocta,tcargcont,tcargcorr,tproc);
             }
             );
    }else{
      if (cuentaid<=0){
        swal("Ups!","Por favor seleccionar la cuenta a modificar.","error");
      }else if (codC.length===0){
        swal("Ups!","Por favor colocar un codigo para la cuenta.","error");
      }else if (codC.length>10){
        swal("Ups!","El codigo para la cuenta tiene un máximo de 10 caracteres.","error");
      }else if (criterioid<=0){
        swal("Ups!","Por favor elija un criterio para la cuenta.","error");
      }else if (bancoid<=0){
        swal("Ups!","Por favor elija un banco para la cuenta.","error");
      }else if (monedaid<=0){
        swal("Ups!","Por favor elija una moneda para la cuenta.","error");
      }else if (ref_nostro.length===0){
        swal("Ups!","Por favor indique un Nro. Cta. Nostro para la cuenta.","error");
      }else if (ref_vostro.length===0){
        swal("Ups!","Por favor indique un Nro. Cta. Vostro para la cuenta.","error");
      }else if (tipocta<0){
        swal("Ups!","Por favor elija un tipo de cuenta.","error");
      }else if (tcargcont<0){
        swal("Ups!","Por favor elija un tipo de archivo de carga para la contabilidad de la cuenta.","error");
      }else if (tcargcorr<0){
        swal("Ups!","Por favor elija un tipo de archivo de carga para el corresponsal de la cuenta.","error");
      }else if (procs.length<=0){
        swal("Ups!","Por favor elija al menos un proceso de match designado para esta cuenta.","error");
      }else if (desc.length>45){
        swal("Ups!","La descripcion para la cuenta no debe tener mas de 45 caracteres.","error");
      }else if (ref_nostro.length>35 || ref_vostro.length>35){
        swal("Ups!","El tamaño de la referencia nostro/vostro para la cuenta no debe tener mas de 35 caracteres.","error");
      }else if(tgiro.length>20){
        swal("Ups!","El tamaño del tipo transacción giro para la cuenta no debe tener mas de 20 caracteres.","error");
      }else if(amail.length>45){
        swal("Ups!","El tamaño del correo de alertas para la cuenta no debe tener mas de 45 caracteres.","error");
      };
    }
})

