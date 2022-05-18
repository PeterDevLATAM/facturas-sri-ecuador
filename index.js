const fs = require("fs");
var parseString = require("xml2js").parseString;
var json2xls = require("json2xls");
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
      try {
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
          sinIva = Number(
            result.factura.infoFactura[0].totalConImpuestos[0].totalImpuesto[1]
              .baseImponible[0]
          );
        }
        conIva = Number(
          result.factura.infoFactura[0].totalConImpuestos[0].totalImpuesto[0]
            .baseImponible[0]
        );
        const data = { fechaEmision, dirEstablecimiento, conIva, sinIva };
        resultData.push(data);
      });  
      } catch (error) {
          console.log(`File ${file} not recognized`)
      }
      
    });
  });
});
setTimeout(() => {
    console.table(resultData)
  fs.writeFileSync("data.xlsx", json2xls(resultData), "binary");
}, 1000);
