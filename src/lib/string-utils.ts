export function dedent(str: string) {
  const removeNewLine = str.replace(/^\n/, '')
  const match = removeNewLine.match(/^\s+/)
  return match
    ? removeNewLine.replace(new RegExp('^' + match[0], 'gm'), '')
    : removeNewLine
}

export function parseStringToJson(str: string) {
  const removeSingleLineComment = str.replace(/\/\/.*/g, '')
  const formatted = removeSingleLineComment
    .replaceAll('\n', '')
    .replaceAll(' ', '')
  return eval('(' + formatted + ')')
}
