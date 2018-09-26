var sheetName = '2018 活動紀錄'

function doGet (e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getSheetByName(sheetName)
  var data = jsonifySheet(sheet)

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

function jsonifySheet(sheet) {
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues()

  return values.map(function (row) {
    return row.reduce(function(row_obj, col, n){
      var key = headers[n]
      row_obj[key] = col
      return row_obj
    }, {})
  })
}
