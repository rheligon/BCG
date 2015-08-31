var csrftoken = $.cookie('csrftoken');

var idioma = $('#idioma').val();
var idiomaAux = "";
var msj ="";

if (idioma == 0){
    idiomaAux = "es"
} else {
    idiomaAux = "en"
}

var t_conta = iniciar_tabla(idiomaAux);

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

$("#myModal").on("hidden.bs.modal", function(){
    t_conta.clear().draw();
   	$("#myModalLabel").html("");
     
});

$('#boton-regresar').on('click', function () {
	cuenta=$(this).attr("value");
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

	    //Campo 71G: Opcional
	    infoRemitARecept = idMensaje.attr("infoRemitARecept");
	    if(infoRemitARecept.length > 0){
    		var td1 = '<td >72</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Información del Remitente al Receptor</td>';
	    	}else {
	    		var td2 = '<td >Sender to Receiver Information</td>';
	    	}
	    	var td3 = '<td >'+infoRemitARecept+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "infoRemitARecept"></tr>');
		    var jRow = $("#infoRemitARecept").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    //Campo 71G: Opcional
	    repReg = idMensaje.attr("repReg");
	    if(repReg.length > 0){
    		var td1 = '<td >77B</td>';
    		if (idioma == 0){
	    		var td2 = '<td >Reporte Regulatorio</td>';
	    	}else {
	    		var td2 = '<td >Regulatory Reporting</td>';
	    	}
	    	var td3 = '<td >'+repReg+'</td>'; 
		    //creamos la fila con los elementos y la mostramos
		    $('#table-info > tbody').append('<tr id= "repReg"></tr>');
		    var jRow = $("#repReg").append(td1,td2,td3);
		    t_conta.row.add(jRow);
	    } 

	    t_conta.draw();
  	}
  	
  	
    });