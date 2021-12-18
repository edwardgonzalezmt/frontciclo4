// PERFIL ==============================================================================================

function consultarUsuarioPerfil() {
    var id = sessionStorage.getItem("idUser");
    $.ajax({
        url: "http://129.151.125.93:8080/api/user/"+id,
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            $("#miTablaPerfilAsesor").empty();
            mostrarTablaPerfil(response);
            console.log(response);
        }
    });
}

function mostrarTablaPerfil(response) {
    let rows = '<tr>';
        rows += '<th scope="row">' + response.identification + '</th>';
        rows += '<td>' + response.name + '</td>';
        rows += '<td>' + response.email + '</td>';
        switch(response.type){
            case 'COORD':
                rows += '<td>' + "Coordinador de zona" + '</td>';
                break;
            case 'ADM':
                rows += '<td>' + "Administrador" + '</td>';
                break;
            case 'ASE':
                rows += '<td>' + "Asesor Comercial" + '</td>';
                break;
            default:
                rows += '<td>' + "Perfil no definido" + '</td>';
                break;
        }
        rows += '<td>' + response.zone + '</td>';
        rows += '</tr>';

    $("#miTablaPerfilAsesor").append(rows);
}

function consultarOrdenesZona(){
    let datos = {
        zona: $("#zonaId").val()
    }
    $.ajax({
        url: "http://129.151.125.93:8080/api/order/zona/"+datos.zona,
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            if(response.length == 0){
                alert("Zona no encontrada o sin registros, intente nuevamente");
                $("#tablaAsesor").hide();
            }else{
                $("#miTablaAsesor").empty();
                mostrarTablaAsesor(response);
                console.log(response);
                $("#tablaAsesor").show();
            }
        }
    });
}

function mostrarTablaAsesor(response) {
    let rows = '<tr>';
    for(i = 0; i < response.length; i++){
        rows += '<th>' + response[i].salesMan.identification + '</th>';
        rows += '<td>' + response[i].salesMan.name + '</td>';
        rows += '<th>' + response[i].salesMan.email + '</th>';
        rows += '<th>' + response[i].registerDay + '</th>';
        rows += '<td>' + response[i].id + '</td>';
        rows += '<td>' + response[i].status + '</td>';
        rows += '<td>' + "<button class='btn btn-success' onclick='verPedido("+response[i].id+")'>Ver pedido</button>";
        rows += '</tr>';
    }
    $("#miTablaAsesor").append(rows);
}

function regresar() {
    $("#regresar").hide();
    $("#tablaPedido").hide();
    $("#tablaAsesor").show();
}

function verPedido(id){
    $.ajax({
        url: "http://129.151.125.93:8080/api/order/"+id,
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            console.log(response);
            $("#miTablaPedido").empty();
            $("#miTablaPedido2").empty();
            $("#tablaAsesor").hide();
            $("#tablaPedido").show();
            $("#regresar").show();
            mostrarTablaPedido(response);
        }
    });
}

function mostrarTablaPedido(response) {
    let rows = '<tr>';
        rows += '<th>' + response.registerDay + '</th>';
        rows += '<td>' + response.id + '</td>';
        rows += '<th>' + response.status + '</th>';
        rows += '<th>' + '<select class="form-select" id="seleccionarStatus">' + '<option value="Pendiente">Pendiente</option>' + '<option value="Aprobada">Aprobada</option>' + '<option value="Rechazada">Rechazada</option>'+'</select>'+ '</th>';
        rows += '<td>' + "<button class='btn btn-success' onclick='actualizarPedido("+response.id+")'>Guardar Estado</button>";
        rows += '</tr>';

    $("#miTablaPedido").append(rows);

    let productos=response.products;
    let cantidades=response.products;

    let catProducto = Object.keys(productos);
    let valProducto = Object.values(productos);
    let catQuantities = Object.keys(cantidades);
    let vatQuantities = Object.values(cantidades);



    for(let i=0;i<catProducto.length;i++){
        console.log("ENTRO  A HACER EL FOR X");
        console.log("Response.Productos= "+valProducto[i].reference);
        let rows2 = '<tr>';
                rows2 += '<td>' + "<img src='"+valProducto[i].photography+ "' width='50px' height='50px'>";
                rows2 += '<th>' + valProducto[i].reference + '</td>';
                rows2 += '<th>' + valProducto[i].category + '</th>';
                rows2 += '<th>' + valProducto[i].description + '</th>';
                rows2 += '<th>' + valProducto[i].price + '</th>';
                rows2 += '<th>' + vatQuantities[i] + '</th>';
                rows2 += '<th>' + valProducto[i].quantity + '</th>';
                rows2 += '</tr>';
    $("#miTablaPedido2").append(rows2);

    }
}

function actualizarPedido(idPedido){
    let datos = {
        id: idPedido,
        status: $("#seleccionarStatus").val()
    }
    var dataToSend = JSON.stringify(datos);
    $.ajax({
        dataType: 'json',
        data: dataToSend,
        contentType: 'application/json',
        url: "http://129.151.125.93:8080/api/order/update",
        type: 'PUT',
        success: function (response) {
            console.log(response);
            alert("Estado Guardado Correctamente :D");
            consultarOrdenesZona();
            $("#tablaPedido").hide();
            $("#regresar").hide();
        }
    });
}

$("#cerrarSesion").click(function(){
    sessionStorage.clear();
    location.href = "../index.html";
});

$(document).ready(function(){
    consultarUsuarioPerfil();
    $("#tablaAsesor").hide();
    $("#tablaPedido").hide();
    $("#regresar").hide();
});