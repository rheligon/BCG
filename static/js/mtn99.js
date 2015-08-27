var csrftoken = $.cookie('csrftoken');
var fechaDesde = "";
var fechaHasta = "";
var narrativas = []; //Para almacenar las narrativas
var largo = 0; //Para almacenar el largo de los mensajes filtrados
var botonNarrativa = "" //Para almacenar el id de cada boton de ver narrativa
var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es";
} else {
    idiomaAux = "en";
}

var tabla_det = iniciar_tabla_detalle(idiomaAux);

//inicializar la tabla de detalles
function iniciar_tabla_detalle(idioma){

    if (idioma==="es"){

        return $('#table-detalle').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "scrollY": "190px",
            "dom": "frtiS",
            "scrollCollapse": true,
            //"pageLength": 5,
            //"lengthMenu": [5, 10, 25, 50, 75, 100 ],
            //"paging": true,
            "autoWidth": true,
            "columns": [
                { "width": "5%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "5%" },
                { "width": "23%" },
                { "width": "23%" },
                { "width": "9%" },
              ],
        })

    }else if (idioma==="en"){

        return $('#table-detalle').DataTable({
            language: {
                url: '/static/json/English-tables.json'
            },
            "scrollY": "190px",
            "dom": "frtiS",
            "scrollCollapse": true,
            //"pageLength": 5,
            //"lengthMenu": [5, 10, 25, 50, 75, 100 ],
            //"paging": true,
            "autoWidth": false,
            "columns": [
                { "width": "5%" },
                { "width": "10%" },
                { "width": "25%" },
                { "width": "5%" },
                { "width": "23%" },
                { "width": "23%" },
                { "width": "9%" },
              ],
        })
    };
}


//Boton para buscar MTx99
$('#confButton').on('click', function () {
    var banco = $('#mtx99_banco').val()
    var tipo = $('#mtx99_tipo').val()
    
    if (banco===("-1")){
        if (idioma === 0){
            swal("Ups!","Debe seleccionar un banco.","error");        
        } else {
            swal("Ups!","You must select a bank.","error");  
        }
    }else if (tipo===("-1")){
        if (idioma === 0){
            swal("Ups!","Debe seleccionar una categoría.","error");        
        } else {
            swal("Ups!","You must select a category.","error");  
        }
    } else if( ($('#f-desde').val() === "") && ($('#f-hasta').val() === "") ){
        var auxdate = new Date();
        var dd = auxdate.getDate();
        var mm = auxdate.getMonth()+1; //January is 0!
        var yyyy = auxdate.getFullYear()-30;
        var today = new Date();
        var dd1 = today.getDate()+1;
        var mm1 = today.getMonth()+1; //January is 0!
        var yyyy1 = today.getFullYear();

        if(dd1<10) {
            dd1='0'+dd1
        } 

        if(mm1<10) {
            mm1='0'+mm1
        } 

        today = dd1+'/'+mm1+'/'+yyyy1;
        fh = today;

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        auxdate = dd+'/'+mm+'/'+yyyy;
        fd = auxdate;

        //Llamar funcion de busqueda
        $('#processing-modal').modal('toggle');
        buscarmtx99(banco,tipo,fd,fh);

    }else {
        //Checkear los filtros
        $('.cbfilter:checked').each(function(){
            var idaux = $(this).attr('id').split('-')[0];
            var id = '#filter-'+idaux;

            if (idaux==='fecha'){
                var fd = "";
                var fh = "";

                //si se escogió una fecha limite inferior
                if ($('#f-desde').val() != ""){
                    fd = $('#f-desde').val();    
                }
                // en caso contrario se toma la fecha actual menos 30 años
                else {
                    var auxdate = new Date();
                    var dd = auxdate.getDate();
                    var mm = auxdate.getMonth()+1; //January is 0!
                    var yyyy = auxdate.getFullYear()-30;

                    if(dd<10) {
                        dd='0'+dd
                    } 

                    if(mm<10) {
                        mm='0'+mm
                    } 

                    auxdate = dd+'/'+mm+'/'+yyyy;
                    fd = auxdate;    
                }

                //si se escogió una fecha limite superior
                if ($('#f-hasta').val() != ""){
                    fh = $('#f-hasta').val();
                    var aux = fh.substring(0,2);
                    aux = parseInt(aux);
                    aux = aux + 1;
                    aux = aux.toString();
                    var fechaAux = fh.split("/")
                    // Para que la consulta se haga hasta el dia que el usuario ingreso
                    // como fecha tope inclusive
                    fh = aux + '/' + fechaAux[1] + '/' + fechaAux[2];
                }
                // en caso contrario se toma la fecha actual 
                else {
                    var today = new Date();
                    var dd1 = today.getDate()+1;
                    var mm1 = today.getMonth()+1; //January is 0!
                    var yyyy1 = today.getFullYear();

                    if(dd1<10) {
                        dd1='0'+dd1
                    } 

                    if(mm1<10) {
                        mm1='0'+mm1
                    } 

                    today = dd1+'/'+mm1+'/'+yyyy1;
                    fh = today;    
                }

                var aux_fd = fd.split("/");
                var aux_fh = fh.split("/");
                var result_fd = aux_fd[2] +"/"+ aux_fd[1] +"/"+aux_fd[0]
                var result_fh = aux_fh[2] +"/"+ aux_fh[1] +"/"+aux_fh[0]
                fechaDesde = new Date (result_fd);
                fechaHasta = new Date (result_fh);
                console.log(fechaDesde);
                console.log(fechaHasta);
            }

            if (fechaDesde > fechaHasta){
                if (idioma === 0){
                    swal("Ups!","Error en las fechas.","error");        
                } else {
                    swal("Ups!","Error occurred: Date problem.","error");
                }
            } else {
                //Llamar funcion de busqueda
                $('#processing-modal').modal('toggle');
                buscarmtx99(banco,tipo,fd,fh);
            }

        });
    };
});

//Buscar todos los MTx99 del banco y tipo seleccionados
function buscarmtx99(banco,tipo,fechaDesde,fechaHasta){
    $.ajax({
        type:"POST",
        url: "/mtn99/",
        data: {"banco99":banco, "tipo99":tipo, "action":"buscar", "fechaDesde99":fechaDesde, "fechaHasta99":fechaHasta},
        success: function(data){
            narrativas = []; //Cada vez que se busque hay que inicializar el arreglo en vacio
            tabla_det.clear().draw();
            var json_data = jQuery.parseJSON(data.mens);
            largo = json_data.length;
            for (var i=0; i<json_data.length; i++){

                var aux = json_data[i].fields.fecha.substring(0,10);
                var res = aux.split("-");
                if (idioma === 0){
                    var fin = res[2].concat("/").concat(res[1]).concat("/").concat(res[0]);
                } else {
                    var fin = res[0].concat("/").concat(res[1]).concat("/").concat(res[2]);
                }
                var org="";

                //Para ver si son mensajes enviados o recibidos
                if (json_data[i].fields.origen === 0 || json_data[i].fields.origen === "0" ){
                    org = "E"
                } else {
                    org = "R"
                };
                
                //Se construyen las filas de la tabla con la información pertinente
                var td1 = '<td>' + org + '</td>';
                var td2 = '<td>' + json_data[i].fields.bic + '</td>';
                var td3 = '<td>' + fin + '</td>';
                var td4 = '<td>' + json_data[i].fields.tipo_mt + '</td>';
                var td5 = '<td>' + json_data[i].fields.codigo + '</td>';
                var td6 = '<td>' + json_data[i].fields.ref_relacion + '</td>';
                narrativas.push(json_data[i].fields.narrativa);
                var td7 = '<td>' + '<input type="radio" name="verN" class="cbfilter2" id='+i+'-verN">'
                

                $('#table-detalle > tbody').append('<tr class="text-center" id ="tr-'+json_data[i].pk+"-"+i+'"></tr>');
                var jRow = $("#tr-"+json_data[i].pk+"-"+i).append(td1,td2,td3,td4,td5,td6,td7);
                tabla_det.row.add(jRow);

            }
            tabla_det.draw();
            verDetalle();
            $('#processing-modal').modal('toggle');
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma ===0){
                swal("Ups!", "Hubo un error procesando la búsqueda", "error");
            } else {
                swal("Ups!", "Error ocurred trying to execute searching", "error");     
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Mostrar div de opciones dependiendo del filtro (buscar, crear o cargar MT)
function verDetalle(){
    $('.cbfilter2').on('click', function(){

        var idaux = $(this).attr('id').split('-')[0];
        for (var i=0; i<largo; i++){
            j = i.toString();
                
            if (idaux===j){

               
                document.getElementById("MT99-normal").style.display = "none";

                $("#narrativaValue").empty();
                $( ".value" ).html(narrativas[i]);

                document.getElementById("MT99-verDetalle").style.display = "block";

            }
        }

    });
}

//Para regresar desde la vista de las narrativas
$('#regresarMTButton').on('click', function () {

    document.getElementById("MT99-verDetalle").style.display = "none";
    document.getElementById("MT99-normal").style.display = "block";
    $("input:radio").attr("checked", false);

});    

//Cambiar el idioma del date picker a español si este es el seleccionado
if (idiomaAux==="es"){
    $.extend($.fn.pickadate.defaults, {
      monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      today: 'Hoy',
      clear: 'Limpiar',
      close: 'Cerrar',
    });
}

//Inicializar el DatePicker
$('#f-desde').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
  max:true
})

//Inicializar el DatePicker
$('#f-hasta').pickadate({
  format: 'd/m/yyyy',
  formatSubmit:'d/m/yyyy',
  selectYears: true,
  selectMonths: true,
  max:true
})

//Mostrar o esconder filtros elegidos
$('.cbfilter').on('click', function(){

    $('#filter-div').show();
    $('#filter-div > div').hide();

    var idaux = $(this).attr('id').split('-')[0];
    var id = '#filter-'+idaux;

    if (!this.checked){
        document.getElementById('f-desde').value = "";
        document.getElementById('f-hasta').value = "";
        fechaDesde = "";
        fechaHasta = "";
        $(id).hide();
        $('#filter-div').hide();

    }else{
        $(id).show();
    }
});


//Boton para crear MTx99
$('#crearMTButton').on('click', function () {
    var banco = $('#mtx99crear_banco').val()
    var tipo = $('#mtx99crear_tipo').val()
    var ref_mensaje = $('#refmensaje').val()
    var ref_mensaje_original = $('#refmensajeoriginal').val()
    var narrativa = $('#narrativa').val()
    
    if (banco===("-1")){
        if (idioma === 0){
            swal("Ups!","Debe seleccionar un banco.","error");        
        } else {
            swal("Ups!","You must select a bank.","error");
        }
    }else if (tipo===("-1")){
        if (idioma === 0){
            swal("Ups!","Debe seleccionar una categoría.","error");        
        } else {
            swal("Ups!","You must select a category.","error");
        }
    }else if (ref_mensaje.length===0){
        if (idioma === 0){
            swal("Ups!","Debe colocar la referencia.","error");        
        } else {
            swal("Ups!","You must introduce reference field.","error");
        }
    }else if(ref_mensaje_original.length===0){
       if (idioma === 0){
            swal("Ups!","Debe scolocar la referencia del mensaje original.","error");        
        } else {
            swal("Ups!","You must introduce original message reference field.","error");
        }
    }else if(narrativa.length===0 ){
        if (idioma === 0){
            swal("Ups!","Debe colocar la narrativa.","error");        
        } else {
            swal("Ups!","You must introduce narrative field.","error");
        }
    }else{

        if (idioma === 0){
            msj ="¿Seguro que desea crear el mensaje MT?";
        } else {
            msj= "Sure you want create the MTn99 message";
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                //Llamar funcion de creación del mensaje
                agregarmtx99(banco,tipo,ref_mensaje,ref_mensaje_original,narrativa);
            }
        ); 
    };
});

//Crear mensajes MT99
function agregarmtx99(banco,tipo,ref_mensaje,ref_mensaje_original, narrativa){
    $.ajax({
        type:"POST",
        url: "/mtn99/",
        data: {"banco99":banco, "tipo99":tipo, "action":"crear", "ref_mensaje99":ref_mensaje, "ref_mensaje_original99":ref_mensaje_original, "narrativa99":narrativa},
        success: function(data){
            $('#processing-modal').modal('toggle');
            if (idioma === 0){
                swal("OK", "Mensaje agregado exitosamente", "success");    
            } else {
                swal("OK", "Successful aggregated message", "success");
            }
            
            $('#mtx99crear_banco').val("--------------");
            $('#mtx99crear_tipo').val("---");
            $('#refmensaje').val("");
            $('#refmensajeoriginal').val("");
            $('#narrativa').val("");

        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma === 0){
                swal("Ups!", "Hubo un error al intertar crear el mensaje", "error");
            } else {
                swal("Ups!", "Error occurred trying to create MT message", "success");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

//Boton para cargar MTx99
$('#cargarMTButton').on('click', function () {
    var archivo = $('#mtx99_archivo').val()

    if (archivo===("-1")){
        if (idioma === 0){
            swal("Ups!","Debe seleccionar un archivo para cargar datos.","error");        
        } else {
            swal("Ups!","You must select a load file.","error"); 
        }
    } else {
        if (idioma === 0){
            msj = "¿Seguro que desea cargar los mensajes MT desde el archivo seleccionado?";       
        } else {
            msj = "Sure yo want load MT messages from selected file?";
        }
        swal({
            title: "",
            text: msj,
            type: "warning",
            showCancelButton: true,
            confirmButtonText: "Ok"},
            function(){
                $('#processing-modal').modal('toggle');
                 //Llamar funcion de cargar del mensaje
                cargarmtx99(archivo);
            }
        );   
    }
});

//Cargar mensajes desde archivo
function cargarmtx99(archivo){
    $.ajax({
        type:"POST",
        url: "/mtn99/",
        data: {"action":"cargar", "archivo99":archivo},
        success: function(data){
            var errorMensaje = data.mens.substring(0,8);
            var mensaje = data.mens;
            if (errorMensaje === "Caracter" || errorMensaje === "Unexpect"){

                $('#processing-modal').modal('toggle');
                swal("Ups", mensaje, "error");

            } else {
                $('#processing-modal').modal('toggle');
                if (idioma === 0){
                    swal("OK", "Archivo cargado exitosamente", "success");
                } else {
                    swal("OK", "Successful loaded file", "success");
                }
                window.location.reload();
            }
        },
        error: function(jqXHR, error){ 
            alert(jqXHR.responseText) //debug
            $('#processing-modal').modal('toggle');
            if (idioma === 0){
                swal("Ups!", "Hubo un error al cargar el archivo", "error");
            } else {
                 swal("Ups!", "Error occurred trying to load file", "error");
            }
        },
        dataType:'json',
        headers:{
            'X-CSRFToken':csrftoken
        }
    });
    return false;
}

 