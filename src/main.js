//db sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");
const loadSheet = async () => {
  const doc = new GoogleSpreadsheet(
    "1Btvfsa9lvftkiZBegAm3Nu9bCWMPtgPPDIqpAMI8dvc"
  );
  doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  });
  await doc.loadInfo();
  console.log(doc.title);
  return doc.sheetsByIndex[0];
};
loadSheet();
var query = async (q) => {
  let sheet = await loadSheet();
  await sheet.loadCells("C1:C2");
  let c = sheet.getCell(0, 2);
  c.formula = `=VLOOKUP("${q}",A:B,2,FALSE)`;
  await sheet.saveUpdatedCells();
  await sheet.loadCells("C1:C2");
  c = sheet.getCell(0, 2);
  console.log(c.value);
  return c.value;
};
var teach = async (text) => {
  let a = text.split("教");
  a = a[1].split("說");
  let input = a[0];
  let output = a[1];
  let sheet = await loadSheet();
  let c = await query(input);
  console.log(c);
  if (typeof c === "string") {
    //update
    await sheet.loadCells("C1:C2");
    let cell = sheet.getCell(0, 2);
    cell.formula = `=MATCH("${input}",A:A,0)`;
    await sheet.saveUpdatedCells();
    await sheet.loadCells("C1:C2");
    cell = sheet.getCell(0, 2);
    console.log(cell.value);
    await sheet.loadCells(`A1:B10`);
    let c2 = sheet.getCell(cell.value - 1, 1);
    c2.value = output;
    await sheet.saveUpdatedCells();
  } else {
    //insert
    await sheet.addRow({ input, output });
  }
};

async function handle(text) {
  if (text.indexOf("教") > -1 && text.indexOf("說") > -1) {
    teach(text);
    return "我會了";
  }
  let s = await query(text);
  if (s !== null) {
    return s;
  }
  return "不清楚";
}

module.exports = handle;
