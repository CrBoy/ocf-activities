const fetch = require('node-fetch')
const fs = require('fs')
const yaml = require('js-yaml')

const json_uri = process.env['JSON_URI'] || 'https://script.google.com/macros/s/AKfycbw0k4DJv039QNOLGGFpE7i_6nDul3wtZHQK_whJTvaWF7Awqd3F/exec'

try {
  fs.mkdirSync('../dist')
} catch (e) {
}

fetch(json_uri)
  .then(res => res.json())
  .then(json => { fs.writeFileSync('../dist/events.yml', yaml.dump(json)) } )
