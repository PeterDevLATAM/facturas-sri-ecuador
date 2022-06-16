const fs = require("fs");
var parseString = require("xml2js").parseString;
var json2xls = require("json2xls");

const readFile = async (filePath, callback) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    return data;
  } catch (err) {
    console.log(err);
  }
};
const readDir = async (dir) => {
  try {
    const data = await fs.promises.readdir(dir);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const checkIfThere = (valueToCheck) => {
  if (valueToCheck) {
    return valueToCheck[0];
  } else {
    return "NO DATA";
  }
};

function parseXml(xml) {
  return new Promise((resolve, reject) => {
    try {
      parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    } catch (error) {
      console.log(`File ${file} not recognized`);
    }
  });
}

const exportData = async () => {
  var files = await readDir("data/");
  const resultData = [];

  await Promise.all(
    files.map(async (file) => {
      const xml = await readFile(`data/${file}`);
      //Parse xml to JSON
      let json = await parseXml(xml);
      // console.log(json)
      // Extract inner XML data
      const result = await parseXml(json.autorizacion.comprobante);
      const fechaEmision = result.factura.infoFactura[0].fechaEmision[0];
      let conIva = 0;
      let sinIva = 0;

      razonSocial = checkIfThere(result.factura.infoTributaria[0].razonSocial);
      nombreEstablecimiento = checkIfThere(
        result.factura.infoTributaria[0].nombreComercial
      );
      dirEstablecimiento = checkIfThere(
        result.factura.infoFactura[0].dirEstablecimiento
      );

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
      const data = {
        fechaEmision,
        nombreEstablecimiento,
        razonSocial,
        dirEstablecimiento,
        conIva,
        sinIva,
      };
      resultData.push(data);
      // console.log(data);
    })
  );
  return resultData;
};

exportData().then((result) => {
  console.table(result);
  fs.writeFileSync("data.xlsx", json2xls(result), "binary");
});
