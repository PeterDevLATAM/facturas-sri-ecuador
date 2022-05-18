## About
Pequeño programa en javascript que genera un excel con el desglose de los componentntes que agraban iva y los que no de las facturas generadas en un determinado periodo. Funciona agregando los XML de las facturas individuales obtenidas en el sitio del SRI a la carpeta `data/`

Se requiere Node y NPM

## Pasos

1. Instalar Node y NPM.

2. Instalar dependencias.
```bash
$ npm install
```
3. Copiar los archivos XML generados al directorio `data/*`.

4. Ejecutar el archivo index.js.
```bash
node index.js
```
> La ejecucion genera un archivo excel que podra utilizarlo a su conveniencia para procesar los datos

