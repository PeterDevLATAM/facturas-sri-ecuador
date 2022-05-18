const fs = require("fs");
var parseString = require("xml2js").parseString;
var files = fs.readdirSync("data/");
const resultData = [];

files.map((file) => {
   fs.readFile(`data/${file}`, "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    //Parse data to JSON
    parseString(data, function (err, result) {
      // Extract inner XML data
      parseString(result.autorizacion.comprobante, function (err, result) {
        const fechaEmision = result.factura.infoFactura[0].fechaEmision[0];
        let dirEstablecimiento = "NO DIR";
        if (result.factura.infoFactura[0].dirEstablecimiento) {
          dirEstablecimiento =
            result.factura.infoFactura[0].dirEstablecimiento[0];
        }

        let conIva = 0;
        let sinIva = 0;
        if (
          result.factura.infoFactura[0].totalConImpuestos[0].totalImpuesto
            .length > 1
        ) {
          sinIva =
            result.factura.infoFactura[0].totalConImpuestos[0].totalImpuesto[1]
              .baseImponible[0];
        }
        conIva =
          result.factura.infoFactura[0].totalConImpuestos[0].totalImpuesto[0]
            .baseImponible[0];
        const data = { fechaEmision, dirEstablecimiento, conIva, sinIva };
        resultData.push(data);
      });
    });
  });
});
setTimeout(() => {
    console.table(resultData)
  }, 1000);



