//idioma_tr es una variable global definida en la pagina
var tabla = iniciar_tabla(idioma_tr);
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


//Mostrar Detalle al hacer click en código de banco
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