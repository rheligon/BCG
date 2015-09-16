
var csrftoken = $.cookie('csrftoken');
$('#boton-graficar').attr("disabled", true);
var idioma = $('#idioma').val();
var fechaC = $('#fechaConciliacion').val();
var diaC = fechaC.substr(0,2)
var mesC = fechaC.substr(3,2)
var anioC = fechaC.substr(6,4)
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var t_conta = iniciar_tabla(idiomaAux);
var t_info = iniciar_tabla2(idiomaAux);
var t_impri = iniciar_tabla3(idiomaAux);


var tiempo = $('#tiempoAct').val();
tiempo = parseInt(tiempo)*30000

/*setInterval(function() {
	$('#processing-modal').modal('toggle');
	window.location.reload()
}, tiempo);*/	

function iniciar_tabla2(idioma){

    
    if (idioma==="es"){

        return $('#table-pa').DataTable({
            //poner if con idioma, el ingles es predeterminado
            
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "ordering":false,
            "columns": [
                { "width": "5%" },//Edo. Cuenta
                { "width": "5%" },//Num. Trans
                { "width": "12%" },//Fecha Valor
                { "width": "12%" },//Edo. Cuenta
                { "width": "16%" },//Num. Trans
                { "width": "10%" },//Fecha Valor
                { "width": "30%" },//Edo. Cuenta
              ]
        })

    }else if (idioma==="en"){

        return $('#table-pa').DataTable({
          
            language: {
                url: '/static/json/English-tables.json'
            },
             "ordering":false,
             "columns": [
                { "width": "5%" },//Edo. Cuenta
                { "width": "5%" },//Num. Trans
                { "width": "12%" },//Fecha Valor
                { "width": "12%" },//Edo. Cuenta
                { "width": "16%" },//Num. Trans
                { "width": "10%" },//Fecha Valor
                { "width": "30%" },//Edo. Cuenta
              ]
        })
    };
};

function iniciar_tabla3(idioma){

    
    if (idioma==="es"){

        return $('#table-impri').DataTable({
            //poner if con idioma, el ingles es predeterminado
            
            language: {
                url: '/static/json/Spanish-tables.json'
            },
            "ordering":false,
            "dom": 'Bfrtip',
            "buttons": ['excel','pdf'],
            "columns": [
                { "width": "5%" },//Edo. Cuenta
                { "width": "5%" },//Num. Trans
                { "width": "12%" },//Fecha Valor
                { "width": "12%" },//Edo. Cuenta
                { "width": "16%" },//Num. Trans
                { "width": "10%" },//Fecha Valor
                { "width": "30%" },//Edo. Cuenta
              ]
        })

    }else if (idioma==="en"){

        return $('#table-impri').DataTable({
          
            language: {
                url: '/static/json/English-tables.json'
            },
             "ordering":false,
             "dom": 'Bfrtip',
             "buttons": ['csv','excel','pdf'],
             "columns": [
                { "width": "5%" },//Edo. Cuenta
                { "width": "5%" },//Num. Trans
                { "width": "12%" },//Fecha Valor
                { "width": "12%" },//Edo. Cuenta
                { "width": "16%" },//Num. Trans
                { "width": "10%" },//Fecha Valor
                { "width": "30%" },//Edo. Cuenta
              ]
        })
    };
};

function iniciar_tabla(idioma){

    if (idioma==="es"){

        return $('#table-info').DataTable({
            //poner if con idioma, el ingles es predeterminado
            language: {
                url: '/static/json/No-Filter-Tables-Spanish.json'
            },
            "autoWidth": false,
            "scrollCollapse": false,
            "searching": false,
            "paging":false,
            "ordering":false,
            "bInfo" : false,
            "deferRender": true,
            "columns": [
                { "width": "10%" },//Edo. Cuenta
                { "width": "35%" },//Num. Trans
                { "width": "55%" },//Fecha Valor
              ]
            })

    }else if (idioma==="en"){

        return $('#table-info').DataTable({
            language: {
                url: '/static/json/No-Filter-Tables-English.json'
            },
            "autoWidth": false,
            "scrollCollapse":false,
            "searching": false,
            "paging":false,
            "ordering":false,
            "bInfo" : false,
            "deferRender": true,
            "columns": [
                { "width": "10%" },//Edo. Cuenta
                { "width": "35%" },//Num. Trans
                { "width": "55%" },//Fecha Valor
              ]
        })
    };
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
    if (idioma == 0){
        nueva = dia +"/" + mes + "/" +anio;
    } else {
        nueva = anio +"/" + mes + "/" +dia;
    }
    return nueva;
}

//dado un fecha en string la convierte en un objeto Date +1 y luego a string
function nuevaFecha(fecha){
    var arreglo= fecha.split("/");
    if (idioma == 0){
        dia = parseInt(arreglo[0]);
        mes = parseInt(arreglo[1])-1;
        anio = parseInt(arreglo[2]);
    } else {
        dia = parseInt(arreglo[2]);
        mes = parseInt(arreglo[1])-1;
        anio = parseInt(arreglo[0]);
    }
    var nueva = new Date(anio,mes,dia)
    nueva.setDate(nueva.getDate()-1);
    nueva = formatearFecha(nueva); 
    return nueva;
}

document.getElementById("btnPrint").onclick = function () {
    printElement(document.getElementById("printThis"));
    
    window.print();
}

var button = document.getElementById('btnDescarga');
button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
});

function printElement(elem) {
    var domClone = elem.cloneNode(true);
    
    var $printSection = document.getElementById("printSection");
    
    if (!$printSection) {
        var $printSection = document.createElement("div");
        $printSection.id = "printSection";
        document.body.appendChild($printSection);
    }
    
    $printSection.innerHTML = "";
    
    $printSection.appendChild(domClone);
}


//Inicializar el DatePicker
$('#fecha-valor').pickadate({
    format: 'dd/mm/yyyy',
    formatSubmit:'dd/mm/yyyy',
    selectYears: true,
    selectMonths: true,
    max: true,
    min: [anioC,mesC,diaC],
});

$("#myModal").on("hidden.bs.modal", function(){
    t_conta.clear().draw();
   	$("#myModalLabel").html("");
     
});  

$("#exampleModal").on("hidden.bs.modal", function(){
   
    $("#exampleModalLabel").html("");
    $(".modal-body1").html("");
    $(".modal-body1").append('<p>Monto</p><canvas id="canvas" width="950px" height="650px"></canvas><p>Hora</p>');
    $('#btnDescarga').attr("disabled", false);
});

$('#fecha-valor').change(function() { 
    $('#boton-graficar').attr("disabled", false);
});

$('a').on('click', function () {

	mensaje = $(this).attr("value")
	console.log(mensaje)
  	idMensaje = $('a[name="'+mensaje+'"]')
  	tipo = idMensaje.attr("tipo")

  	if(tipo=="103"){
  		if (idioma == 0){
    		$('#myModalLabel').append('Detalles MT '+tipo);
    	}else {
    		$('#myModalLabel').append('Details MT '+tipo);
    	}
  		

  		//Remitente- Receptor
  		remitente = idMensaje.attr("remitente");     
	  	receptor = idMensaje.attr("receptor");     
	  	var td1 = '<td ></td>';
	  	if (idioma == 0){
    		var td2 = '<td >Remitente/Receptor</td>';
    	}else {
    		var td2 = '<td >Sender/Receiver</td>';
    	}
	    var td3 = '<td >'+remitente+' '+receptor+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "remit_recept"></tr>');
	    var jRow = $("#remit_recept").append(td1,td2,td3);
	    t_conta.row.add(jRow);

  		//Campo 20: Obligatorio
  		refRemitente = idMensaje.attr("refRemitente");     
	  	var td1 = '<td >20</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia del Remitente</td>';
    	}else {
    		var td2 = '<td >Sender\'s Reference</td>';
    	}
	    var td3 = '<td >'+refRemitente+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRemit"></tr>');
	    var jRow = $("#refRemit").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 13C: Opcional + Ciclo
	    indHora = idMensaje.attr("indHora");
	    if(indHora.length > 0){
	    	var arreglo = indHora.split(";");
	    	for (var i = 0; i < arreglo.length-1; i++) {
	    		var td1 = '<td >13C</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Indicador Tiempo</td>';
		    	}else {
		    		var td2 = '<td >Time Indication</td>';
		    	}
		    	var td3 = '<td >'+arreglo[i]+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "indHora'+i+'"></tr>');
			    var jRow = $("#indHora"+i).append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	};
	    } 

	    //Campo 23B: Obligatorio
	    tipo_op_banco = idMensaje.attr("tipoOpBanco");
	    var td1 = '<td >23B</td>';
	    if (idioma == 0){
    		var td2 = '<td >Código de operación del Banco</td>';
    	}else {
    		var td2 = '<td >Bank Operation Code</td>';
    	}

	    var td3 = '<td >'+tipo_op_banco+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "tipoOpBanco"></tr>');
	    var jRow = $("#tipoOpBanco").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	   	//Campo 23E: Opcional + Ciclo
	    codInst = idMensaje.attr("codInst");
	    if(codInst.length > 0){
	    	var arreglo = codInst.split(";");
	    	for (var i = 0; i < arreglo.length-1; i++) {
	    		var td1 = '<td >23E</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Código de Instrucción</td>';
		    	}else {
		    		var td2 = '<td >Instruction Code</td>';
		    	}
		    	var td3 = '<td >'+arreglo[i]+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "codInst'+i+'"></tr>');
			    var jRow = $("#codInst"+i).append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	};
	    } 

	    //Campo 26T: Opcional
	    tipoTrans = idMensaje.attr("tipoTrans");
	    if(tipoTrans.length > 0){
    		var td1 = '<td >26T</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Tipo de Transacción</td>';
	    	}else {
	    		var td2 = '<td >Transaction Type Code</td>';
	    	}
	    	var td3 = '<td >'+tipoTrans+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "tipoTrans"></tr>');
		    var jRow = $("#tipoTrans").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 
	    
	    //Campo 32A: Obligatorio
	    fecha_valor = idMensaje.attr("fechaVal");
	    moneda = idMensaje.attr("moneda");
	    monto = idMensaje.attr("monto");
    	var td1 = '<td >32A</td>';
		if (idioma == 0){
    		var td2 = '<td >Fecha Valor<br>Moneda/Monto</td>';
    	}else {
    		var td2 = '<td >Value Date<br>Currency/Interbank Settled Amount</td>';
    	}
    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
	    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 33B: Opcional
	    moneda_monto = idMensaje.attr("monedaMonto");
	    if(moneda_monto.length > 0){
    		var td1 = '<td >33B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Moneda/Monto de Instrucción</td>';
	    	}else {
	    		var td2 = '<td >Currency/Instruction Amount</td>';
	    	}
	    	var td3 = '<td >'+moneda_monto+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "moneda_monto2"></tr>');
		    var jRow = $("#moneda_monto2").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 36: Opcional
	    tipoCambio = idMensaje.attr("tipoCambio");
	    if(tipoCambio.length > 0){
    		var td1 = '<td >36</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Tipo de Cambio</td>';
	    	}else {
	    		var td2 = '<td >Exchange Rate</td>';
	    	}
	    	var td3 = '<td >'+tipoCambio+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "tipoCambio"></tr>');
		    var jRow = $("#tipoCambio").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 50a: Obligatorio Con Opciones de varias lineas
	    clienteOrd = idMensaje.attr("clienteOrd")
	    tag = clienteOrd.substr(1,3);
		cliente = clienteOrd.substr(5).replace(/\n/g,"<br>");
	    var td1 = '<td >'+tag+'</td>';
	    if (idioma == 0){
    		var td2 = '<td >Cliente Ordenante</td>';
    	}else {
    		var td2 = '<td >Ordering Customer</td>';
    	}
	    var td3 = '<td >'+cliente+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "clienteOrd"></tr>');
	    var jRow = $("#clienteOrd").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 51A: Opcional varias lineas
	    instRemit = idMensaje.attr("instEmi");
	    if(instRemit.length > 0){
	    	institucion = instRemit.replace(/\n/g,"<br>");
    		var td1 = '<td >51A</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Institucion Remitente</td>';
	    	}else {
	    		var td2 = '<td >Sending Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "instRemit"></tr>');
		    var jRow = $("#instRemit").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 52a: Opcional con Opciones de varias lineas
	    instOrd = idMensaje.attr("instOrd");
	    if(instOrd.length > 0){
	    	tag = instOrd.substr(1,3);
		
	    	institucion = instOrd.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Institucion Ordenante</td>';
	    	}else {
	    		var td2 = '<td >Ordering Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "instOrd"></tr>');
		    var jRow = $("#instOrd").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }  

	    //Campo 53a: Opcional con Opciones de varias lineas
	    corrRemit = idMensaje.attr("corrRemit");
	    if(corrRemit.length > 0){
	    	tag = corrRemit.substr(1,3);
		
	    	corresponsal = corrRemit.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Remitente</td>';
	    	}else {
	    		var td2 = '<td >Sender\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+corresponsal+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRemit"></tr>');
		    var jRow = $("#corrRemit").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 54a: Opcional con Opciones de varias lineas
	    corrRecept = idMensaje.attr("corrRecept");
	    if(corrRecept.length > 0){
	    	tag = corrRecept.substr(1,3);
		
	    	receptor = corrRecept.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Receptor</td>';
	    	}else {
	    		var td2 = '<td >Receiver\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+receptor+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRecept"></tr>');
		    var jRow = $("#corrRecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 55a: Opcional con Opciones de varias lineas
	    instReemb = idMensaje.attr("instReemb");
	    if(instReemb.length > 0){
	    	tag = instReemb.substr(1,3);
		
	    	institucion = instReemb.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Institución de Reembolso</td>';
	    	}else {
	    		var td2 = '<td >Third Reimbursement Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "instReemb"></tr>');
		    var jRow = $("#instReemb").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 56a: Opcional con Opciones de varias lineas
	    instInter = idMensaje.attr("instInter");
	    if(instInter.length > 0){
	    	tag = instInter.substr(1,3);
		
	    	institucion = instInter.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Institución Intermediaria</td>';
	    	}else {
	    		var td2 = '<td >Intermediary Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "instInter"></tr>');
		    var jRow = $("#instInter").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 57a: Opcional con Opciones de varias lineas
	    ctaInst = idMensaje.attr("ctaInst");
	    if(ctaInst.length > 0){
	    	tag = ctaInst.substr(1,3);
		
	    	institucion = ctaInst.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cuenta Con Institución</td>';
	    	}else {
	    		var td2 = '<td >Account With Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "ctaInst"></tr>');
		    var jRow = $("#ctaInst").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 59a: Obligatorio Con Opciones de varias lineas
	    clienteBene = idMensaje.attr("clienteBene")
	    tag1 = clienteBene.substr(0,5);
	    tag2 = clienteBene.substr(0,4);
	    if(tag1 == "[59A]" || tag1 == "[59F]"){
	    	cliente = clienteBene.substr(5).replace(/\n/g,"<br>");
	    	tag1 = clienteBene.substr(1,3);
	    	var td1 = '<td >'+tag1+'</td>';
	    }else if(tag2=="[59]"){
	    	cliente = clienteBene.substr(4).replace(/\n/g,"<br>");
	    	tag2 = clienteBene.substr(1,2);
	    	var td1 = '<td >'+tag2+'</td>';
	    }
		
	    if (idioma == 0){
    		var td2 = '<td >Cliente Beneficiario</td>';
    	}else {
    		var td2 = '<td >Beneficiary Customer</td>';
    	}
	    var td3 = '<td >'+cliente+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "clienteBene"></tr>');
	    var jRow = $("#clienteBene").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 70: Opcional varias lineas
	    infoRemesa = idMensaje.attr("infoRemesa");
	    if(infoRemesa.length > 0){
	    	institucion = infoRemesa.replace(/\n/g,"<br>");
    		var td1 = '<td >70</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información de Remesas</td>';
	    	}else {
	    		var td2 = '<td >Remittance Information</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemesa"></tr>');
		    var jRow = $("#infoRemesa").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 71A: Obligatorio
	    detCargos = idMensaje.attr("detCargos");
	   	var td1 = '<td >71A</td>';
		if (idioma == 0){
    		var td2 = '<td >Detalles de Cargos</td>';
    	}else {
    		var td2 = '<td >Details of Charges</td>';
    	}
    	var td3 = '<td >'+detCargos+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "detCargos"></tr>');
	    var jRow = $("#detCargos").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 71F: Opcional + Ciclo
	    cargRemit = idMensaje.attr("cargRemit");
	    if(cargRemit.length > 0){
	    	var arreglo = cargRemit.split(";");
	    	for (var i = 0; i < arreglo.length-1; i++) {
	    		var td1 = '<td >71F</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Cargos Del Remitente</td>';
		    	}else {
		    		var td2 = '<td >Sender\'s Charges</td>';
		    	}
		    	var td3 = '<td >'+arreglo[i]+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "cargRemit'+i+'"></tr>');
			    var jRow = $("#cargRemit"+i).append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	};
	    } 

	    //Campo 71G: Opcional
	    cargRecept = idMensaje.attr("cargRecept");
	    if(cargRecept.length > 0){
    		var td1 = '<td >71G</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cargos Del Receptor</td>';
	    	}else {
	    		var td2 = '<td >Receiver\'s Charges</td>';
	    	}
	    	var td3 = '<td >'+cargRecept+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "cargRecept"></tr>');
		    var jRow = $("#cargRecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 72: Opcional
	    infoRemitARecept = idMensaje.attr("infoRemitARecept");
	    if(infoRemitARecept.length > 0){
	    	info = infoRemitARecept.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Sender to Receiver Information</td>';
	    	}
	    	var td3 = '<td >'+info+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemitARecept"></tr>');
		    var jRow = $("#infoRemitARecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 77B: Opcional
	    repReg = idMensaje.attr("repReg");
	    if(repReg.length > 0){
	    	info = repReg.replace(/\n/g,"<br>");
    		var td1 = '<td >77B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Reporte Regulatorio</td>';
	    	}else {
	    		var td2 = '<td >Regulatory Reporting</td>';
	    	}
	    	var td3 = '<td >'+info+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "repReg"></tr>');
		    var jRow = $("#repReg").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}

  	if(tipo=="202"){
  		if (idioma == 0){
    		$('#myModalLabel').append('Detalles MT '+tipo);
    	}else {
    		$('#myModalLabel').append('Details MT '+tipo);
    	}
  		

  		//Remitente- Receptor
  		remitente = idMensaje.attr("remitente");     
	  	receptor = idMensaje.attr("receptor");     
	  	var td1 = '<td ></td>';
	  	if (idioma == 0){
    		var td2 = '<td >Remitente/Receptor</td>';
    	}else {
    		var td2 = '<td >Sender/Receiver</td>';
    	}
	    var td3 = '<td >'+remitente+' '+receptor+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "remit_recept"></tr>');
	    var jRow = $("#remit_recept").append(td1,td2,td3);
	    t_conta.row.add(jRow);

  		//Campo 20: Obligatorio
  		refTrans = idMensaje.attr("refTrans");     
	  	var td1 = '<td >20</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia de la Transacción</td>';
    	}else {
    		var td2 = '<td >Transaction Reference Number</td>';
    	}
	    var td3 = '<td >'+refTrans+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refTrans"></tr>');
	    var jRow = $("#refTrans").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 21: Obligatorio
  		refRel = idMensaje.attr("refRel");     
	  	var td1 = '<td >21</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia Relacionada</td>';
    	}else {
    		var td2 = '<td >Related Reference</td>';
    	}
	    var td3 = '<td >'+refRel+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRel"></tr>');
	    var jRow = $("#refRel").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 13C: Opcional + Ciclo
	    indHora = idMensaje.attr("indHora");
	    if(indHora.length > 0){
	    	var arreglo = indHora.split(";");
	    	for (var i = 0; i < arreglo.length-1; i++) {
	    		var td1 = '<td >13C</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Indicador Tiempo</td>';
		    	}else {
		    		var td2 = '<td >Time Indication</td>';
		    	}
		    	var td3 = '<td >'+arreglo[i]+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "indHora'+i+'"></tr>');
			    var jRow = $("#indHora"+i).append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	};
	    } 
	    
	    //Campo 32A: Obligatorio
	    fecha_valor = idMensaje.attr("fechaVal");
	    moneda = idMensaje.attr("moneda");
	    monto = idMensaje.attr("monto");
    	var td1 = '<td >32A</td>';
		if (idioma == 0){
    		var td2 = '<td >Fecha Valor<br>Moneda/Monto</td>';
    	}else {
    		var td2 = '<td >Value Date<br>Currency/Interbank Settled Amount</td>';
    	}
    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
	    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 52a: Opcional con Opciones de varias lineas
	    instOrd = idMensaje.attr("instOrd");
	    if(instOrd.length > 0){
	    	tag = instOrd.substr(1,3);
		
	    	institucion = instOrd.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Institucion Ordenante</td>';
	    	}else {
	    		var td2 = '<td >Ordering Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "instOrd"></tr>');
		    var jRow = $("#instOrd").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }  

	    //Campo 53a: Opcional con Opciones de varias lineas
	    corrRemit = idMensaje.attr("corrRemit");
	    if(corrRemit.length > 0){
	    	tag = corrRemit.substr(1,3);
		
	    	corresponsal = corrRemit.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Remitente</td>';
	    	}else {
	    		var td2 = '<td >Sender\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+corresponsal+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRemit"></tr>');
		    var jRow = $("#corrRemit").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 54a: Opcional con Opciones de varias lineas
	    corrRecept = idMensaje.attr("corrRecept");
	    if(corrRecept.length > 0){
	    	tag = corrRecept.substr(1,3);
		
	    	receptor = corrRecept.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Receptor</td>';
	    	}else {
	    		var td2 = '<td >Receiver\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+receptor+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRecept"></tr>');
		    var jRow = $("#corrRecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 56a: Opcional con Opciones de varias lineas
	    instInter = idMensaje.attr("inter");
	    if(instInter.length > 0){
	    	tag = instInter.substr(1,3);
		
	    	institucion = instInter.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Intermediario</td>';
	    	}else {
	    		var td2 = '<td >Intermediary</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "instInter"></tr>');
		    var jRow = $("#instInter").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 57a: Opcional con Opciones de varias lineas
	    ctaInst = idMensaje.attr("ctaInst");
	    if(ctaInst.length > 0){
	    	tag = ctaInst.substr(1,3);
		
	    	institucion = ctaInst.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cuenta Con Institución</td>';
	    	}else {
	    		var td2 = '<td >Account With Institution</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "ctaInst"></tr>');
		    var jRow = $("#ctaInst").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 58a: Obligatorio Con Opciones de varias lineas
	    clienteBene = idMensaje.attr("instBene")
    	cliente = clienteBene.substr(5).replace(/\n/g,"<br>");
    	tag1 = clienteBene.substr(1,3);
    	var td1 = '<td >'+tag1+'</td>';
		
	    if (idioma == 0){
    		var td2 = '<td >Institución Beneficiaria</td>';
    	}else {
    		var td2 = '<td >Beneficiary Institution</td>';
    	}
	    var td3 = '<td >'+cliente+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "clienteBene"></tr>');
	    var jRow = $("#clienteBene").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 72: Opcional varias lineas
	    infoRemitARecept = idMensaje.attr("infoRemitARecept");
	    if(infoRemitARecept.length > 0){
	    	institucion = infoRemitARecept.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Sender to Receiver Information</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemitARecept"></tr>');
		    var jRow = $("#infoRemitARecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}

  	if(tipo=="752"){
  		if (idioma == 0){
    		$('#myModalLabel').append('Detalles MT '+tipo);
    	}else {
    		$('#myModalLabel').append('Details MT '+tipo);
    	}
  		

  		//Remitente- Receptor
  		remitente = idMensaje.attr("remitente");     
	  	receptor = idMensaje.attr("receptor");     
	  	var td1 = '<td ></td>';
	  	if (idioma == 0){
    		var td2 = '<td >Remitente/Receptor</td>';
    	}else {
    		var td2 = '<td >Sender/Receiver</td>';
    	}
	    var td3 = '<td >'+remitente+' '+receptor+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "remit_recept"></tr>');
	    var jRow = $("#remit_recept").append(td1,td2,td3);
	    t_conta.row.add(jRow);

  		//Campo 20: Obligatorio
  		numCredit = idMensaje.attr("numCredit");     
	  	var td1 = '<td >20</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Número de Credito Documental</td>';
    	}else {
    		var td2 = '<td >Documentary Credit Number</td>';
    	}
	    var td3 = '<td >'+numCredit+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "numCredit"></tr>');
	    var jRow = $("#numCredit").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 21: Obligatorio
  		refRel = idMensaje.attr("refBanPre");     
	  	var td1 = '<td >21</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia del Banco Presentante</td>';
    	}else {
    		var td2 = '<td >Presenting Bank\'s Reference</td>';
    	}
	    var td3 = '<td >'+refRel+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRel"></tr>');
	    var jRow = $("#refRel").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 23: Obligatorio
  		proposito = idMensaje.attr("proposito");     
	  	var td1 = '<td >23</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Identificador de Proposito</td>';
    	}else {
    		var td2 = '<td >Further Identification</td>';
    	}
	    var td3 = '<td >'+proposito+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "proposito"></tr>');
	    var jRow = $("#proposito").append(td1,td2,td3);
	    t_conta.row.add(jRow);
	    
	    //Campo 30: Obligatorio
  		fechaAviso = idMensaje.attr("fechaAviso");     
	  	var td1 = '<td >30</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Fecha de Aviso de Discrepancia o Correo</td>';
    	}else {
    		var td2 = '<td >Date of Advice of Discrepancy or Mailing</td>';
    	}
	    var td3 = '<td >'+fechaAviso+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "fechaAviso"></tr>');
	    var jRow = $("#fechaAviso").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 32B: Opcional
	    montoT = idMensaje.attr("montoT");
	    if(montoT.length > 0){
    		var td1 = '<td >32B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Monto Total Avisado</td>';
	    	}else {
	    		var td2 = '<td >Total Amount Advised</td>';
	    	}
	    	var td3 = '<td >'+montoT+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "montoT"></tr>');
		    var jRow = $("#montoT").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 71B: Opcional varias lineas
	    cargDed = idMensaje.attr("cargDed");
	    if(cargDed.length > 0){
	    	cargos = cargDed.replace(/\n/g,"<br>");
    		var td1 = '<td >71B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cargos Deducidos</td>';
	    	}else {
	    		var td2 = '<td >Charges Deducted</td>';
	    	}
	    	var td3 = '<td >'+cargos+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "cargDed"></tr>');
		    var jRow = $("#cargDed").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 53a: Opcional con Opciones de varias lineas
	    fecha_valor = idMensaje.attr("fechaVal");
	    moneda = idMensaje.attr("moneda");
	    monto = idMensaje.attr("monto");
	    if(moneda.length > 0){
	    	
	    	if(fecha_valor.length >0 ){
	    		var td1 = '<td >33A</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Fecha Valor<br>Moneda/Monto Neto</td>';
		    	}else {
		    		var td2 = '<td >Value Date<br>Currency/Net Amount</td>';
		    	}
		    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
			    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	}else{
	    		var td1 = '<td >33B</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Moneda/Monto Neto</td>';
		    	}else {
		    		var td2 = '<td >Currency/Net Amount</td>';
		    	}
		    	var td3 = '<td >'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
			    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	}
	    }

	    //Campo 53a: Opcional con Opciones de varias lineas
	    corrRemit = idMensaje.attr("corrRemit");
	    if(corrRemit.length > 0){
	    	tag = corrRemit.substr(1,3);
		
	    	corresponsal = corrRemit.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Remitente</td>';
	    	}else {
	    		var td2 = '<td >Sender\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+corresponsal+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRemit"></tr>');
		    var jRow = $("#corrRemit").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 54a: Opcional con Opciones de varias lineas
	    corrRecept = idMensaje.attr("corrRecept");
	    if(corrRecept.length > 0){
	    	tag = corrRecept.substr(1,3);
		
	    	receptor = corrRecept.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Receptor</td>';
	    	}else {
	    		var td2 = '<td >Receiver\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+receptor+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRecept"></tr>');
		    var jRow = $("#corrRecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 72: Opcional varias lineas
	    infoRemitARecept = idMensaje.attr("infoRemitARecept");
	    if(infoRemitARecept.length > 0){
	    	institucion = infoRemitARecept.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Sender to Receiver Information</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemitARecept"></tr>');
		    var jRow = $("#infoRemitARecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}

  	if(tipo=="754"){
  		if (idioma == 0){
    		$('#myModalLabel').append('Detalles MT '+tipo);
    	}else {
    		$('#myModalLabel').append('Details MT '+tipo);
    	}
  		

  		//Remitente- Receptor
  		remitente = idMensaje.attr("remitente");     
	  	receptor = idMensaje.attr("receptor");     
	  	var td1 = '<td ></td>';
	  	if (idioma == 0){
    		var td2 = '<td >Remitente/Receptor</td>';
    	}else {
    		var td2 = '<td >Sender/Receiver</td>';
    	}
	    var td3 = '<td >'+remitente+' '+receptor+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "remit_recept"></tr>');
	    var jRow = $("#remit_recept").append(td1,td2,td3);
	    t_conta.row.add(jRow);

  		//Campo 20: Obligatorio
  		refRemit = idMensaje.attr("refRemit");     
	  	var td1 = '<td >20</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia del Remitente</td>';
    	}else {
    		var td2 = '<td >Sender\'s Reference</td>';
    	}
	    var td3 = '<td >'+refRemit+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRemit"></tr>');
	    var jRow = $("#refRemit").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 21: Obligatorio
  		refRel = idMensaje.attr("refRel");     
	  	var td1 = '<td >21</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia de la Relación</td>';
    	}else {
    		var td2 = '<td >Related Reference</td>';
    	}
	    var td3 = '<td >'+refRel+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRel"></tr>');
	    var jRow = $("#refRel").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 32A: Obligatorio con Opciones de una linea
	    cargDed = idMensaje.attr("cargDed");
	    cargAgreg = idMensaje.attr("cargAgreg");
	    if(cargDed.length < 1  && cargAgreg.length < 1){
    		fecha_valor = idMensaje.attr("fechaVal");
		    moneda = idMensaje.attr("moneda");
		    monto = idMensaje.attr("monto");
		    	
	    	if(fecha_valor.length >0 ){
	    		var td1 = '<td >32A</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Fecha Valor<br>Moneda/Monto Principal Pagado/Aceptado/Negociado</td>';
		    	}else {
		    		var td2 = '<td >Value Date<br>Currency/Principal Amount Paid/Accepted/Negotiated</td>';
		    	}
		    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
			    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	}else{
	    		var td1 = '<td >32B</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Moneda/Monto Principal Pagado/Aceptado/Negociado</td>';
		    	}else {
		    		var td2 = '<td >Currency/Principal Amount Paid/Accepted/Negotiated</td>';
		    	}
		    	var td3 = '<td >'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
			    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	}
		    
    	}else{
    		montoTotal= idMensaje.attr("montoT");
    		tag = montoTotal.substr(1,3);
			if(tag = "32A"){
				var td1 = '<td>'+tag+'</td>';
				fecha_valor = montoTotal.substr(5,10);
				moneda = montoTotal.substr(15,3);
				monto = montoTotal.substr(18); 
				if (idioma == 0){
		    		var td2 = '<td >Fecha Valor<br>Moneda/Monto Principal Pagado/Aceptado/Negociado</td>';
		    	}else {
		    		var td2 = '<td >Value Date<br>Currency/Principal Amount Paid/Accepted/Negotiated</td>';
		    	}
		    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
			    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
			    t_conta.row.add(jRow);
			}else if(tag = "32B"){
				var td1 = '<td>'+tag+'</td>';
				moneda = montoTotal.substr(5,3);
				monto = montoTotal.substr(8);
				if (idioma == 0){
		    		var td2 = '<td >Moneda/Monto Principal Pagado/Aceptado/Negociado</td>';
		    	}else {
		    		var td2 = '<td >Currency/Principal Amount Paid/Accepted/Negotiated</td>';
		    	}
		    	var td3 = '<td >'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
			    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
			    t_conta.row.add(jRow);
			}
	    	
    	}
	    
	    //Campo 33B: Opcional
	    montoAdi = idMensaje.attr("montoAdi");
	    if(montoAdi.length > 0){
    		var td1 = '<td >33B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Montos Adicionales</td>';
	    	}else {
	    		var td2 = '<td >Additional Amounts</td>';
	    	}
	    	var td3 = '<td >'+montoAdi+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "montoAdi"></tr>');
		    var jRow = $("#montoAdi").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 71B: Opcional varias lineas
	    cargDed = idMensaje.attr("cargDed");
	    if(cargDed.length > 0){
	    	cargos = cargDed.replace(/\n/g,"<br>");
    		var td1 = '<td >71B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cargos Deducidos</td>';
	    	}else {
	    		var td2 = '<td >Charges Deducted</td>';
	    	}
	    	var td3 = '<td >'+cargos+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "cargDed"></tr>');
		    var jRow = $("#cargDed").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 73: Opcional varias lineas
	    cargAgreg = idMensaje.attr("cargAgreg");
	    if(cargAgreg.length > 0){
	    	cargosA = cargAgreg.replace(/\n/g,"<br>");
    		var td1 = '<td >73</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cargos Agregados</td>';
	    	}else {
	    		var td2 = '<td >Charges Added</td>';
	    	}
	    	var td3 = '<td >'+cargosA+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "cargAgreg"></tr>');
		    var jRow = $("#cargAgreg").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 34A: Obligatorio con Opciones de una linea
	    cargDed = idMensaje.attr("cargDed");
	    cargAgreg = idMensaje.attr("cargAgreg");
	    if(cargDed.length >0  || cargAgreg.length < 0){
    		fecha_valor = idMensaje.attr("fechaVal");
		    moneda = idMensaje.attr("moneda");
		    monto = idMensaje.attr("monto");
		    	
	    	if(fecha_valor.length >0 ){
	    		var td1 = '<td >34A</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Fecha Valor<br>Moneda/Monto Total Reclamado</td>';
		    	}else {
		    		var td2 = '<td >Value Date<br>Currency/Total Amount Claimed</td>';
		    	}
		    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "monto_total"></tr>');
			    var jRow = $("#monto_total").append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	}else{
	    		var td1 = '<td >34B</td>';
	    		if (idioma == 0){
		    		var td2 = '<td >Moneda/Monto Total Reclamado</td>';
		    	}else {
		    		var td2 = '<td >Currency/Total Amount Claimed</td>';
		    	}
		    	var td3 = '<td >'+moneda+monto+'</td>'; 
			    //creamos la fila con los elementos y la mostramos
			    $('#table-info > tbody').append('<tr id= "monto_total"></tr>');
			    var jRow = $("#monto_total").append(td1,td2,td3);
			    t_conta.row.add(jRow);
	    	}
		    
    	}


	    //Campo 53a: Opcional con Opciones de varias lineas
	    banReemb = idMensaje.attr("banReemb");
	    if(banReemb.length > 0){
	    	tag = banReemb.substr(1,3);
		
	    	banco = banReemb.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Banco Reembolso</td>';
	    	}else {
	    		var td2 = '<td >Reimbursing Bank</td>';
	    	}
	    	var td3 = '<td >'+banco+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "banReemb"></tr>');
		    var jRow = $("#banReemb").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 57a: Opcional con Opciones de varias lineas
	    ctaInsti = idMensaje.attr("ctaInsti");
	    if(ctaInsti.length > 0){
	    	tag = ctaInsti.substr(1,3);
		
	    	cuenta = ctaInsti.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cuenta con Banco</td>';
	    	}else {
	    		var td2 = '<td >Account With Bank</td>';
	    	}
	    	var td3 = '<td >'+cuenta+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "ctaInsti"></tr>');
		    var jRow = $("#ctaInsti").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 58a: Opcional con Opciones de varias lineas
	    banBene = idMensaje.attr("banBene");
	    if(banBene.length > 0){
	    	tag = banBene.substr(1,3);
		
	    	bancoB = banBene.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Banco Beneficiario</td>';
	    	}else {
	    		var td2 = '<td >Beneficiary Bank</td>';
	    	}
	    	var td3 = '<td >'+bancoB+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "banBene"></tr>');
		    var jRow = $("#banBene").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 72: Opcional varias lineas
	    infoRemitARecept = idMensaje.attr("infoRemitARecept");
	    if(infoRemitARecept.length > 0){
	    	institucion = infoRemitARecept.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Sender to Receiver Information</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemitARecept"></tr>');
		    var jRow = $("#infoRemitARecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 77A: Opcional varias lineas
	    narrativa = idMensaje.attr("narrativa");
	    if(narrativa.length > 0){
	    	narra = narrativa.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Narrativa</td>';
	    	}else {
	    		var td2 = '<td >Narrative</td>';
	    	}
	    	var td3 = '<td >'+narra+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "narrativa"></tr>');
		    var jRow = $("#narrativa").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}
  	
  	if(tipo=="756"){
  		if (idioma == 0){
    		$('#myModalLabel').append('Detalles MT '+tipo);
    	}else {
    		$('#myModalLabel').append('Details MT '+tipo);
    	}
  		

  		//Remitente- Receptor
  		remitente = idMensaje.attr("remitente");     
	  	receptor = idMensaje.attr("receptor");     
	  	var td1 = '<td ></td>';
	  	if (idioma == 0){
    		var td2 = '<td >Remitente/Receptor</td>';
    	}else {
    		var td2 = '<td >Sender/Receiver</td>';
    	}
	    var td3 = '<td >'+remitente+' '+receptor+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "remit_recept"></tr>');
	    var jRow = $("#remit_recept").append(td1,td2,td3);
	    t_conta.row.add(jRow);

  		//Campo 20: Obligatorio
  		refRemit = idMensaje.attr("refRemit");     
	  	var td1 = '<td >20</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia del Remitente</td>';
    	}else {
    		var td2 = '<td >Sender\'s Reference</td>';
    	}
	    var td3 = '<td >'+refRemit+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRemit"></tr>');
	    var jRow = $("#refRemit").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 21: Obligatorio
  		refRel = idMensaje.attr("refBanPre");     
	  	var td1 = '<td >21</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia del Banco Presentante</td>';
    	}else {
    		var td2 = '<td >Presenting Bank\'s Reference</td>';
    	}
	    var td3 = '<td >'+refRel+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRel"></tr>');
	    var jRow = $("#refRel").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	     //Campo 32B: Obligatorio
  		montoRec = idMensaje.attr("MonedaMonto");     
	  	var td1 = '<td >32B</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Monto Total Reclamado</td>';
    	}else {
    		var td2 = '<td >Total Amount Claimed</td>';
    	}
	    var td3 = '<td >'+montoRec+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "montoRec"></tr>');
	    var jRow = $("#montoRec").append(td1,td2,td3);
	    t_conta.row.add(jRow);
	    
	    //Campo 33A: Obligatorio
	    fecha_valor = idMensaje.attr("fechaVal");
	    moneda = idMensaje.attr("moneda");
	    monto = idMensaje.attr("monto");
    	var td1 = '<td >33A</td>';
		if (idioma == 0){
    		var td2 = '<td >Fecha Valor<br>Moneda/Monto</td>';
    	}else {
    		var td2 = '<td >Value Date<br>Currency/Amount Reimbursed or Paid</td>';
    	}
    	var td3 = '<td >'+fecha_valor+'<br>'+moneda+monto+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "fecha_valor_moneda_monto"></tr>');
	    var jRow = $("#fecha_valor_moneda_monto").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 53a: Opcional con Opciones de varias lineas
	    corrRemit = idMensaje.attr("corrRemit");
	    if(corrRemit.length > 0){
	    	tag = corrRemit.substr(1,3);
		
	    	corresponsal = corrRemit.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Remitente</td>';
	    	}else {
	    		var td2 = '<td >Sender\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+corresponsal+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRemit"></tr>');
		    var jRow = $("#corrRemit").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 54a: Opcional con Opciones de varias lineas
	    corrRecept = idMensaje.attr("corrRecept");
	    if(corrRecept.length > 0){
	    	tag = corrRecept.substr(1,3);
		
	    	receptor = corrRecept.substr(5).replace(/\n/g,"<br>");
    		var td1 = '<td >'+tag+'</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Corresponsal del Receptor</td>';
	    	}else {
	    		var td2 = '<td >Receiver\'s Correspondent</td>';
	    	}
	    	var td3 = '<td >'+receptor+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "corrRecept"></tr>');
		    var jRow = $("#corrRecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    }

	    //Campo 72: Opcional varias lineas
	    infoRemitARecept = idMensaje.attr("infoRemitARecept");
	    if(infoRemitARecept.length > 0){
	    	institucion = infoRemitARecept.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Sender to Receiver Information</td>';
	    	}
	    	var td3 = '<td >'+institucion+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemitARecept"></tr>');
		    var jRow = $("#infoRemitARecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}

  	if(tipo=="942"){
  		if (idioma == 0){
    		$('#myModalLabel').append('Detalles MT '+tipo);
    	}else {
    		$('#myModalLabel').append('Details MT '+tipo);
    	}
  		

  		//Remitente- Receptor
  		remitente = idMensaje.attr("remitente");     
	  	receptor = idMensaje.attr("receptor");     
	  	var td1 = '<td ></td>';
	  	if (idioma == 0){
    		var td2 = '<td >Remitente/Receptor</td>';
    	}else {
    		var td2 = '<td >Sender/Receiver</td>';
    	}
	    var td3 = '<td >'+remitente+' '+receptor+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "remit_recept"></tr>');
	    var jRow = $("#remit_recept").append(td1,td2,td3);
	    t_conta.row.add(jRow);

  		//Campo 20: Obligatorio
  		refTrans = idMensaje.attr("refTrans");     
	  	var td1 = '<td >20</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Número de Referencia de la Transacción</td>';
    	}else {
    		var td2 = '<td >Transaction Reference Number</td>';
    	}
	    var td3 = '<td >'+refTrans+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refTrans"></tr>');
	    var jRow = $("#refTrans").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 21: Obligatorio
  		refRel = idMensaje.attr("refRel");     
	  	var td1 = '<td >21</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Referencia de la Relación</td>';
    	}else {
    		var td2 = '<td >Related Reference</td>';
    	}
	    var td3 = '<td >'+refRel+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "refRel"></tr>');
	    var jRow = $("#refRel").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 25: Obligatorio
  		idCta = idMensaje.attr("idCta");     
	  	var td1 = '<td >25</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Identificación de la Cuenta</td>';
    	}else {
    		var td2 = '<td >Account Identification</td>';
    	}
	    var td3 = '<td >'+idCta+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "idCta"></tr>');
	    var jRow = $("#idCta").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 28C: Obligatorio
  		edoCtaSec = idMensaje.attr("edoCtaSec");     
	  	var td1 = '<td >28C</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Número de Estado de Cuenta/Número de Secuencia</td>';
    	}else {
    		var td2 = '<td >Statement Number/Sequence Number</td>';
    	}
	    var td3 = '<td >'+edoCtaSec+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "edoCtaSec"></tr>');
	    var jRow = $("#edoCtaSec").append(td1,td2,td3);
	    t_conta.row.add(jRow);
	    
	    //Campo 34F: Obligatorio
  		limiteCD = idMensaje.attr("limiteCD");     
	  	var td1 = '<td >34F</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Indicador Límite de Débito/(Débito y Crédito)</td>';
    	}else {
    		var td2 = '<td >Debit/(Debit and Credit) Floor Limit Indicator</td>';
    	}
	    var td3 = '<td >'+limiteCD+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "limiteCD"></tr>');
	    var jRow = $("#limiteCD").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 34F: Opcional
	    limiteCred = idMensaje.attr("limiteCred");
	    if(limiteCred.length > 0){
    		var td1 = '<td >34F</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Indicador Límite de Crédito</td>';
	    	}else {
	    		var td2 = '<td >Credit Floor Limit Indicator</td>';
	    	}
	    	var td3 = '<td >'+limiteCred+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "limiteCred"></tr>');
		    var jRow = $("#limiteCred").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    
	    //Campo 13D: Obligatorio
  		fechaHora = idMensaje.attr("fechaHora");     
	  	var td1 = '<td >13D</td>';
	  	if (idioma == 0){
    		var td2 = '<td >Indicador de Fecha/Hora</td>';
    	}else {
    		var td2 = '<td >Date/Time Indication</td>';
    	}
	    var td3 = '<td >'+fechaHora+'</td>'; 
	    //creamos la fila con los elementos y la mostramos
	    $('#table-info > tbody').append('<tr id= "fechaHora"></tr>');
	    var jRow = $("#fechaHora").append(td1,td2,td3);
	    t_conta.row.add(jRow);

	    //Campo 61 y 86: Opcionales dobles + Ciclo
	    infOwn = idMensaje.attr("infOwn");
	    if(infOwn.length > 0){
	    	var arreglo = infOwn.split(";");
	    	for (var i = 0; i < arreglo.length-1; i++) {
	    		var arreglo2 = arreglo[i].split("$");
	    		if(arreglo2.length > 1 ){
	    			infor = arreglo2[1].replace(/\n/g,"<br>");
	    			var td1 = '<td >61</td>';
		    		if (idioma == 0){
			    		var td2 = '<td >Linea de Estado de Cuenta</td>';
			    	}else {
			    		var td2 = '<td >Statement Line</td>';
			    	}
			    	var td3 = '<td >'+arreglo2[0]+'</td>'; 
				    //creamos la fila con los elementos y la mostramos
				    $('#table-info > tbody').append('<tr id= "infOwn'+i+'"></tr>');
				    var jRow = $("#infOwn"+i).append(td1,td2,td3);
				    t_conta.row.add(jRow);

				    var td1 = '<td >86</td>';
		    		if (idioma == 0){
			    		var td2 = '<td >Información para el dueño de la Cuenta</td>';
			    	}else {
			    		var td2 = '<td >Information to Account Owner</td>';
			    	}
			    	var td3 = '<td >'+infor+'</td>'; 
				    //creamos la fila con los elementos y la mostramos
				    $('#table-info > tbody').append('<tr id= "infor'+i+'"></tr>');
				    var jRow = $("#infor"+i).append(td1,td2,td3);
				    t_conta.row.add(jRow);
	    		}else{
		    		var td1 = '<td >61</td>';
		    		if (idioma == 0){
			    		var td2 = '<td >Linea de Estado de Cuenta</td>';
			    	}else {
			    		var td2 = '<td >Statement Line</td>';
			    	}
			    	var td3 = '<td >'+arreglo[i]+'</td>'; 
				    //creamos la fila con los elementos y la mostramos
				    $('#table-info > tbody').append('<tr id= "infOwn'+i+'"></tr>');
				    var jRow = $("#infOwn"+i).append(td1,td2,td3);
				    t_conta.row.add(jRow);
			    }
	    	};
	    } 

	    //Campo 90D: Opcional
	    totalDeb = idMensaje.attr("totalDeb");
	    if(totalDeb.length > 0){
    		var td1 = '<td >90D</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cantidad y Suma de Débitos </td>';
	    	}else {
	    		var td2 = '<td >Number and Sum of Debit Entries </td>';
	    	}
	    	var td3 = '<td >'+totalDeb+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "totalDeb"></tr>');
		    var jRow = $("#totalDeb").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	   //Campo 90C: Opcional
	    totalCred = idMensaje.attr("totalCred");
	    if(totalCred.length > 0){
    		var td1 = '<td >90C</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Cantidad y Suma de Créditos</td>';
	    	}else {
	    		var td2 = '<td >Number and Sum of Credit Entries</td>';
	    	}
	    	var td3 = '<td >'+totalCred+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "totalCred"></tr>');
		    var jRow = $("#totalCred").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 72: Opcional varias lineas
	    infOwnerFin = idMensaje.attr("infOwnerFin");
	    if(infOwnerFin.length > 0){
	    	info = infOwnerFin.replace(/\n/g,"<br>");
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Information to Account Owner</td>';
	    	}
	    	var td3 = '<td >'+info+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infOwnerFin"></tr>');
		    var jRow = $("#infOwnerFin").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}

    });



$('#exampleModal').on('shown.bs.modal', function (event) {
	var fechaGrafica = $('#fecha-valor').val();
    $('#exampleModalLabel').append('Histórico del día : ' + fechaGrafica);
	var debito = false
	var bandera = false
	var primera = false
	var datos = []
    var etiquetas = []
    var balance = $('#balance').val();
    var balancedos = parseFloat(balance)
    console.log(debito)
    balance = parseFloat(balance)
    var data2 = t_info.rows().data();
    
	if(data2.length > 0){
    	for(var i = 0; i < data2.length ; i++){ 
    		var myRe = /\d{3}/g;
			var myArray = myRe.exec(data2[i][1]);
    		if(data2[i][6] == "" && myArray[0] != "942"){
    			
    			if(data2[i][0] == "I" ){
    				if(idiomaAux == "es"){
                        saldo = data2[i][3].replace(/\./g,"");
                        saldo = saldo.replace(",",".");
                    }else{
                        saldo = data2[i][3].replace(/,/g,"");
                    }

                    saldoFloatPuro = parseFloat(saldo);
                    balanceAntes = balancedos.toFixed(2)
                    balancedos += saldoFloatPuro	
                   	balanceOri = balancedos.toFixed(2)
    				
    			}
    			if(data2[i][0] == "O" ){
    				if(idiomaAux == "es"){
                        saldo = data2[i][2].replace(/\./g,"");
                        saldo = saldo.replace(",",".");
                    }else{
                        saldo = data2[i][2].replace(/,/g,"");
                    }
                    saldoFloatPuro = parseFloat(saldo);
                    balanceAntes = balancedos.toFixed(2)
                    balancedos -= saldoFloatPuro
                    balanceOri = balancedos.toFixed(2)
    				
    			}
    			if(data2[i][4].substr(0,10) == fechaGrafica){
    				if(!primera){
    					fechaAnterior = nuevaFecha(fechaGrafica);
    					etiquetas.push(fechaAnterior);
    					datos.push(balanceAntes);	
    					primera = true
    				}
    					etiquetas.push(data2[i][4].substr(11));
    					datos.push(balanceOri);	
    					bandera = true
    				}
    				
    		}
    	}
    	
    }
    	if(bandera){
    		var cuenta = $('#cuenta').val();

    		$( "#btnDescarga" ).attr( "download", "Historico_"+cuenta+"_" + fechaGrafica);
    		var lineChartData = {
				labels : etiquetas,
				datasets : [
					{
	            label: "My Second dataset",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: datos,
	        		}
				]

			}
			var ctx = document.getElementById("canvas").getContext("2d");
			window.myLine = new Chart(ctx).Line(lineChartData, {
				responsive: false
			});
    	}else{
    		$(".modal-body1").html("");
    		$(".modal-body1").append('<div ><h2 class="alert"align="center">No existen Transacciones para el día seleccionado.</h2></div>')
    		$('#btnDescarga').attr("disabled", true);
    	}
		



	
});