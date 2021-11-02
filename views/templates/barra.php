<div class="barra">
    <div class="avatar">
        <p class="inicial"><?php echo substr($nombre, 0, 1);?></p>
    </div>
    <p><?php echo $nombre ?? '';?></p>
    <a class="boton" href="/logout">Cerrar Sessión</a>
</div>