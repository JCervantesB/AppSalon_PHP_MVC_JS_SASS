<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios, JSON_UNESCAPED_UNICODE);
    }
    public static function guardar() {

        // Almacena la cita y devuelve el id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();
        $id = $resultado['id'];

        // Almacen la cita y el servicio

        $idServicios = explode(",", $_POST['servicios']);

        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];

            $citaServicio = new CitaServicio($args);
<<<<<<< HEAD
           
=======
            
>>>>>>> e35cfa25c8b7b0d54a6117c14442fedba453d91f
            $citaServicio->guardar();
        }
        // Retornamos una respuesta
        $respuesta = [
            'servicios' => $resultado
        ];
<<<<<<< HEAD
        echo json_encode($respuesta);
=======
        

        echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
>>>>>>> e35cfa25c8b7b0d54a6117c14442fedba453d91f
    }

    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();            
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }
}
