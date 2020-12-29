//db sheets
const { GoogleSpreadsheet } = require("google-spreadsheet");
const loadSheet = async () => {
  const doc = new GoogleSpreadsheet(
    "1YoNHkBEUHK-8jsLuQO5WeJrbh-e9-2ZseLkDM6Qdcp0"
  );
  doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
  });
  await doc.loadInfo();
  console.log(doc.title);
  return doc.sheetsByIndex[0];
};

async function handle(text) {
  if (text.indexOf("抽") > -1) {
    let sheet = await loadSheet();
    await sheet.loadCells(`A1:A4`);
    let c = sheet.getCell(Math.floor(Math.random() * 3) + 1, 0);
    // console.log(c.value);
    return {
      type: "image",
      originalContentUrl: c.value,
      previewImageUrl: c.value
    };
  }
  return { type: "text", text: "不清楚" };
}

module.exports = handle;
