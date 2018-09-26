const fetch = require('node-fetch')
const fs = require('fs')
const yaml = require('js-yaml')

const json_uri = process.env['JSON_URI'] || 'https://script.google.com/macros/s/AKfycbxfJ4DluGcfuUyw0ed5FsU8Wvq-925l6R2HbeZ2hx7-5bOiPXOh/exec'

try {
  fs.mkdirSync('../dist')
} catch (e) {
}

function transformer (data) {
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

  return data
}

function semicolon_separated_list(str){
  if(!str) return str
  return str.split(';').filter(function(s){ return s }).map(function(s){ return s.trim() })
}

function readableDate(datetime) {
  if(!datetime) return datetime
  let d = new Date(datetime)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

fetch(json_uri)
  .then(res => res.json())
  .then(transformer)
  .then(data => { fs.writeFileSync('../dist/events.yml', yaml.dump(data)) } )
