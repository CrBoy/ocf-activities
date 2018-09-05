var sheetName = '2018 活動紀錄'

function doGet (e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = spreadsheet.getSheetByName(sheetName)
  var data = jsonifySheet(sheet)

  data = data.filter(function(row){
    return row.info_check
  }).reduce(function(acc, row){
    acc[row.event_id] = row
    delete row['event_id']
    delete row['upload']
    delete row['info_check']
    Object.keys(row).forEach(function(key){
      if(!row[key]) row[key] = null
      if(key.match(/_id$/)) row[key] = semicolon_separated_list(row[key])
      if(key === 'start' || key === 'end') row[key] = readableDate(row[key])
    })
    return acc
  }, {})

  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

function semicolon_separated_list(str){
  if(!str) return str
  return str.split(';').filter(function(s){ return s }).map(function(s){ return s.trim() })
}

function readableDate(datetime) {
  if(!datetime) return datetime
  return Utilities.formatDate(datetime, "GMT", "yyyy/MM/dd")
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
