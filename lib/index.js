let fs = require('fs'), path = require('path')

exports = module.exports = (paragraphs = 5, wrap) => {
  let output = Array.from(new Array(paragraphs))
    .map(() => paragraph(5 + Math.floor(Math.random() * 10)))
    .join('\n\n')
  if(wrap) {
    output = wordwrap(output, wrap)
  }
  return output
}

let getTxt = name => fs
  .readFileSync(path.resolve(__dirname, `../data/${name}.txt`), {encoding: 'utf8'})
  .split(/\n/)
  .map(str => str.trim())
  .filter(str => !!str)
let random = array => array[Math.floor(Math.random() * array.length)]
let capitalize = string => string.replace(/^./, match => match.toUpperCase())
let trimEnd = string => string.replace(/\s+$/, '')

function paragraph(sentences = 15) {
  return Array.from(new Array(sentences))
    .map(sentence)
    .join(' ')
}

let wordList = getTxt('words')
let endings = ['.', '.', '.', '.', '?', '?', '!']
function sentence(words = 5) {
  let output = Array.from(new Array(3 + Math.floor(Math.random() * 13)))
    .map(() => random(wordList))
    .join(' ')
  return capitalize(output) + random(endings)
}

function wordwrap(string, length, start = '', end = '') {
  // Strip color / format codes when measuring length
  let len = string => string.replace(/\u001b\[[;\d]*?m/g, '').length
  string = string.replace(/\t/g, '  ')
  let lines = string.split(/\n/)
  // \u00a0 - non-breaking space
  let capturingWords = /([\S\u00a0]+[^\S\u00a0]+)/
  lines = lines.map(line => {
    line = trimEnd(line)
    let words = line.split(capturingWords)
    return words.reduce((array, word) => {
      let i = array.length - 1, lineLength = len(array[i])
      if(lineLength && lineLength + len(word) > length) {
        let wordTrimmed = trimEnd(word)
        if(lineLength + len(wordTrimmed) > length) {
          array.push(word)
        } else {
          array[i] += wordTrimmed
          array.push('')
        }
      } else {
        array[i] += word
      }
      return array
    }, ['']).map(line => start + line + end).join('\n')
  })
  return lines.join('\n');
}
