const fs = require("fs");
var files = fs.readdirSync("data/");

var xml2js = require("xml2js");
var parser = new xml2js.Parser();

const resultData = [];

files.map((file) => {
  fs.readFile(`data/${file}`, "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    //Parse data to JSON
    parser.parseStringPromise(data).then(function (result) {
      parser.parseStringPromise(result).then(function (result) {
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

  console.log(resultData);

