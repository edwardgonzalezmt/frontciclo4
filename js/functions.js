const URL_BASE = "http://129.151.125.93:8080/api/";

function URL_GET_USERS() {
    return URL_BASE + "user/all";
}

function URL_POST() {
    return URL_BASE + "user/new";
}

function URL_GET_EMAIL(email) {
    return URL_BASE + "user/emailexist/" + email;
}

function URL_GET_USER(email, password) {
    return URL_BASE + "user/" + email + "/" + password;
}

function URL_GET_ID(id) {
    return URL_BASE + "user/" + id;
}

function getInputsLogin() {
    return {
        email: $("#email").val(),
        contrasena: $("#contrasena").val()
    };
}

function jqueryGET(url, funcion) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function (response) {
            funcion(response);
        }
    });
}

let checkUser = function(rta) {
    if (rta.id == null) {
            alert("Email y/o password inválidos");

        } else {
            alert("Bienvenido: "+rta.name);
            sessionStorage.setItem("idUser", rta.id);
            if(rta.type == "ADM"){ //Adminstrador
                location.href = "http://129.151.125.93/frontciclo4/usuarios.html";
            }else if(rta.type == "COORD"){ //Coordinador
                location.href = "http://129.151.125.93/frontciclo4/perfilCoord.html";
            }else if(rta.type == "ASE"){ //Asesor
                location.href = "http://129.151.125.93/frontciclo4/perfilAse.html";
            }
        }
}

$("#login").click(function () {
    if ($.trim($("#email").val()) == "" || $.trim($("#contrasena").val()) == "") {
        alert("Por favor ingrese el correo y la contraseña");
    } else {
        let datos = getInputsLogin();
        
        jqueryGET(URL_GET_USER(datos.email, datos.contrasena), checkUser);
        
    }
});

function validarUsuario(response) {
    if (response.id != null) {
        location.href = "http://129.151.125.93/frontciclo4/usuarios.html";
        alert("¡Bienvenido! " + response.name);
    } else {
        alert("Usuario no registrado :/");
    }
}


$("#guardar").click(function () {
    if ($.trim($("#emailRegistro").val()) == "" || $.trim($("#usuarioRegistro").val()) == "" || $.trim($("#contrasenaRegistro").val()) == "" || $.trim($("#contrasenaRegistro2").val()) == "") {
        alert("Por favor ingrese todos los campos");
    } else {
         if ($("#contrasenaRegistro").val() == $("#contrasenaRegistro2").val()) {
            let datos = jsonDatos();
            let url = "http://129.151.125.93:8080/api/user/emailexist/"+datos.email;
            getFuncion(url, emailExiste);
        } else {
            alert("Las contraseñas no coinciden :c");
            $("#contrasenaRegistro").val("");
            $("#contrasenaRegistro2").val("");
        }
    }
});

function getFuncion(url, funcion){
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success: function (response) {
            funcion(response);
        }
    });
}

function postFuncion(url, funcion){
    $.ajax({
        url: url,
        method: "POST",
        dataType: "JSON",
        data: JSON.stringify(jsonDatos()),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            registroUsuario();
        }
    });
}

let registroUsuario = function(){
    alert("Producto Registrado Correctamente");
}

let emailExiste = function(response){
    if(response){
        alert("El Email ya existe");
    }else{
        let url = "http://129.151.125.93:8080/api/user/new";
        postFuncion(url, registroUsuario);
    }
}

function jsonDatos(){
    return {
        id: $('#id').val(),
        identification: $('#id').val(),
        name: $("#usuarioRegistro").val(),
        address: "",
        cellPhone: "",
        email: $("#emailRegistro").val(),
        password: $("#contrasenaRegistro").val(),
        zone: "",
        type: ""
    }
}


function validarEmail() {
    let email = $("#emailRegistro").val();
    $.ajax({
        url: "http://129.151.125.93:8080/api/user/emailexist/" + email,
        method: "GET",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if(response){
                alert("Email ya existe");
            }
        }
    });
}

function postFuncionUsuario(url, funcion){
    $.ajax({
        url: url,
        method: "POST",
        dataType: "JSON",
        data: JSON.stringify(jsonDatosUsuario()),
        contentType: "application/json",
        success: function (response) {
            console.log(response);
            registroUsuario();
        }
    });
}

function getJSONnew (){
    return {
        id: $("#id").val(),
        identification: $("#identificacionRegistro").val(),
        name: $("#nombreRegistro").val(),
        address: $("#addressRegistro").val(),
        cellPhone: $("#cellphoneRegistro").val(),
        email: $("#emailRegistro").val(),
        password: $("#passwordRegistro").val(),
        zone: $("#zoneRegistro").val(),
        type: $("#typeRegistro").val()
    }
}

$("#guardarUsuario").click(function () {
    if ($.trim($("#identificacionRegistro").val()) == "" || $.trim($("#nombreRegistro").val()) == "" || $.trim($("#addressRegistro").val()) == "" || $.trim($("#cellphoneRegistro").val()) == "" || $.trim($("#emailRegistro").val()) == "" || $.trim($("#passwordRegistro").val()) == "" || $.trim($("#zoneRegistro").val()) == "" || $.trim($("#typeRegistro").val()) == "") {
        alert("Por favor ingrese todos los campos");
    }else {
        let url = URL_GET_EMAIL(getEmailNew());
        jqueryGET(url, verifyEmail);
    }
});

function jqueryPOST(url, funcion, json) {
    $.ajax({
        url: url,
        method: "POST",
        dataType: "JSON",
        data: JSON.stringify(json),
        contentType: "application/json",
        
        success: function (response) {
            //console.log(response);
            funcion();
        }
    });
}

let usuarioAgregado = function() {
    alert("Usuaria Registrado Correctamente");
    //mostrarTabla();
    $('#ventanaRegistrar').modal('hide');
    jqueryGET(URL_GET_USERS(), mostrarTabla);
}

let verifyEmail = function(rta) {
    if(rta) {
        alert("El email ingresado ya existe");
    } else {
        let json = getJSONnew();
        jqueryPOST(URL_POST(), usuarioAgregado, json);

    }

}


let verifyID = function(rta) {
    if (rta.id != null) {
        alert("El id ingresado ya existe");

    } else {
        let url = URL_GET_EMAIL(getEmailNew());
        jqueryGET(url, verifyEmail);

    }
} 

function getIdNew() {
    return $("#id").val();
}

function getEmailNew() {
    return $("#emailRegistro").val();
}

function consultarUsuario() {
    $.ajax({
        url: "http://129.151.125.93:8080/api/user/all",
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            $("#miTabla").empty();
            mostrarTabla(response);
            console.log(response);
        }
    });
}


let mostrarTabla = function(response) {
    $("#miTabla").empty();
    let rows = '<tr>';
    for (i = 0; i < response.length; i++) {

        let jsonDEL = {
            id: response[i].id
        };

        let URL_DEL = URL_GET_ID(response[i].id);

        rows += '<th scope="row">' + response[i].id + '</th>';
        rows += '<td>' + response[i].identification + '</td>';
        rows += '<td>' + response[i].name + '</td>';
        rows += '<td>' + response[i].address + '</td>';
        rows += '<td>' + response[i].cellPhone + '</td>';
        rows += '<td>' + response[i].email + '</td>';
        rows += '<td>' + response[i].password + '</td>';
        rows += '<td>' + response[i].zone + '</td>';
        rows += '<td>' + response[i].type + '</td>';
        rows += "<td> <button class='btn btn-primary fa fa-pencil' onclick='buscarPorIDUsuario(" + response[i].id + ")'></button><button style='margin-left:10px' class='btn btn-danger fa fa-trash' onclick='jqueryDEL(" + response[i].id + ")'></button></td>";
        rows += '</tr>';
    }

    $("#miTabla").append(rows);
}

$("#editarUsuario").click(function() {
    let datos = {
        id: $("#id").val(),
        identification: $("#identificacionRegistro").val(),
        name: $("#nombreRegistro").val(),
        address: $("#addressRegistro").val(),
        cellPhone: $("#cellphoneRegistro").val(),
        email: $("#emailRegistro").val(),
        password: $("#passwordRegistro").val(),
        zone: $("#zoneRegistro").val(),
        type: $("#typeRegistro").val()
    }

    var dataToSend = JSON.stringify(datos);
    $.ajax({
        dataType: 'json',
        data: dataToSend,
        contentType: 'application/json',
        url: "http://129.151.125.93:8080/api/user/update",
        type: 'PUT',
        success: function (response) {
            console.log(response);
            alert("Usuario Actualizado Correctamente");
            $("#ventanaRegistrar").modal("hide");
            $("#miTabla").empty();
            consultarUsuario();
        },
    });
});

function buscarPorIDUsuario(idItem) {
    $.ajax({
        url: "http://129.151.125.93:8080/api/user/"+idItem,
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            console.log(response)
            $("#ventanaRegistrar").modal("show");
            $("#id").val(response.id);
            $("#identificacionRegistro").val(response.identification);
            $("#nombreRegistro").val(response.name);
            $("#addressRegistro").val(response.address);
            $("#cellphoneRegistro").val(response.cellPhone);
            $("#emailRegistro").val(response.email);
            $("#passwordRegistro").val(response.password);
            $("#zoneRegistro").val(response.zone);
            $("#typeRegistro").val(response.type);
        }
    });
}

let usuarioEliminado = function() {
    alert("Usuario Eliminado Correctamente");
    jqueryGET(URL_GET_USERS(), mostrarTabla);

}

function jqueryDEL(id) {
    let json = {
        id: id
    };
    $.ajax({
        url: URL_GET_ID(id),
        type: "DELETE",
        data: JSON.stringify(json),
        datatype: "json",
        contentType: 'application/json',
        success: function (respuesta) {
            usuarioEliminado();
        }
    });

}


function eliminarUsuario(idElemento) {
    let elemento = {
      id: idElemento,
    }
    let datoEnvio = JSON.stringify(elemento);
    console.log(datoEnvio);
    $.ajax({
      url: "http://129.151.125.93:8080/api/user/" + idElemento,
      type: "DELETE",
      data: datoEnvio,
      datatype: "json",
      contentType: 'application/json',
      success: function (respuesta) {
        alert("Usuario Eliminado Correctamente :)");
        $("#miTabla").empty();
        consultarUsuario();
      }
    });
  }



// CLOTHES

$("#guardarInventario").click(function () {
    if ( $("#referenceRegistro").val() === '' ||  $("#categoryRegistro").val() === ''
    ||  $("#sizeRegistro").val() === '' ||  $("#descriptionRegistro").val() === ''
    ||  $("#availabilityRegistro").val().length == 0 ||  $("#priceRegistro").val() === ''
    ||  $("#quantityRegistro").val() === '' ||  $("#photographyRegistro").val() === '') {
        alert("Todos los campos son obligatorios");
    } else {
        let datos = {
            reference: $("#referenceInventario").val(),
            category: $("#categoryRegistro").val(),
            size: $("#sizeRegistro").val(),
            description: $("#descriptionRegistro").val(),
            availability: $("#availabilityRegistro").val(),
            price: $("#priceRegistro").val(),
            quantity: $("#quantityRegistro").val(),
            photography: $("#photographyRegistro").val()
        }
        $.ajax({
            url: "http://129.151.125.93:8080/api/clothe/new",
            method: "POST",
            dataType: "JSON",
            data: JSON.stringify(datos),
            contentType: "application/json",
            Headers: {
                "Content-Type": "application/json"
            },
            statusCode: {
                201: function (response) {
                    console.log(response);
                    alert("Producto Registrado Correctamente");
                    $("#miTablaInventario").empty();
                    $("#referenceRegistro").empty();
                    $("#categoryRegistro").empty();
                    $("#sizeRegistro").empty();
                    $("#availabilityRegistro").empty();
                    $("#priceRegistro").empty();
                    $("#quantityRegistro").empty();
                    $("#photographyRegistro").empty();
                    consultarInventario();
                    $('#ventanaRegistrarInventario').modal('hide');
                }
            }
        });
    }
});

function consultarInventario() {
    $.ajax({
        url: "http://129.151.125.93:8080/api/clothe/all",
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            $("#miTablaInventario").empty();
            mostrarTablaInventario(response);
            console.log(response);
        }
    });
}

function mostrarTablaInventario(response) {
    let rows = '<tr>';
    for (i = 0; i < response.length; i++) {
        console.log("Reference = "+response[i].reference)
        rows += '<th scope="row">' + response[i].reference + '</th>';
        rows += '<td>' + response[i].category + '</td>';
        rows += '<td>' + response[i].size + '</td>';
        rows += '<td>' + response[i].description + '</td>';
        rows += '<td>' + response[i].availability + '</td>';
        rows += '<td>' + response[i].price + '</td>';
        rows += '<td>' + response[i].quantity + '</td>';
        rows += '<td><img src=\''+response[i].photography+'\' width="50" height="50"></td>';
        rows += '<td> <button class="btn btn-primary fa fa-pencil" onclick="buscarPorIDInventario(\'' + response[i].reference + '\')"></button><button style="margin-left:10px"class="btn btn-danger fa fa-trash" onclick="eliminarInventario(\''+response[i].reference+'\')"></button></td>';
        rows += '</tr>';
    }

    $("#miTablaInventario").append(rows);
}

$("#editarInventario").click(function() {   
    let datos = {
        reference: $("#referenceInventario").val(),
        category: $("#categoryRegistro").val(),
        size: $("#sizeRegistro").val(),
        description: $("#descriptionRegistro").val(),
        availability: $("#availabilityRegistro").val(),
        price: $("#priceRegistro").val(),
        quantity: $("#quantityRegistro").val(),
        photography: $("#photographyRegistro").val()
    }

    var dataToSend = JSON.stringify(datos);
    $.ajax({
        dataType: 'json',
        data: dataToSend,
        contentType: 'application/json',
        url: "http://129.151.125.93:8080/api/clothe/update",
        type: 'PUT',
        success: function (response) {
            console.log(response);
            alert("Producto Actualizado Correctamente");
            $("#ventanaRegistrarInventario").modal("hide");
            $("#miTablaInventario").empty();
            consultarInventario();
        },
    });
});

function buscarPorIDInventario(referenceItem) {
    $.ajax({
        url: "http://129.151.125.93:8080/api/clothe/" + referenceItem,
        type: "GET",
        datatype: "JSON",
        success: function (response) {
            console.log(response)
            $("#ventanaRegistrarInventario").modal("show");
            $("#referenceInventario").val(response.reference);
            $("#categoryRegistro").val(response.category);
            $("#sizeRegistro").val(response.size);
            $("#descriptionRegistro").val(response.description);
            $("#availabilityRegistro").val(response.availability);
            $("#priceRegistro").val(response.price);
            $("#quantityRegistro").val(response.quantity);
            $("#photographyRegistro").val(response.photography);
        }
    });
}

function eliminarInventario(referenceItem) {
    console.log("Referencia a Borrar: "+referenceItem);
    $.ajax({
      url: "http://129.151.125.93:8080/api/clothe/" + referenceItem,
      type: "DELETE",
      datatype: "json",
      contentType: 'application/json',
      success: function (respuesta) {
        alert("Producto Eliminado correctamente :)");
        $("#miTablaInventario").empty();
        consultarInventario();
      }
    });
  }


window.onload = jqueryGET(URL_GET_USERS() , mostrarTabla);
window.onload = consultarInventario();

$("#cerrarSesion").click(function(){
    sessionStorage.clear();
    location.href = "http://129.151.125.93/frontciclo4/index.html";
});
