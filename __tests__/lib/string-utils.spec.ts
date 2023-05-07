import { dedent, parseStringToJson } from '../../src/lib/string-utils'

describe('string-utils', () => {

  const comment = '// comment here'
  const whiteSpaceAtStart = `

  `
    const chartOptionJSONString = `{
      ${comment}\n
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    };`

    const chartOptionsStringWithWhiteSpace = `${whiteSpaceAtStart}${chartOptionJSONString}`


  describe('parseStringToJson', () => {
    it('should work', () => {
      expect(6 * 7).toEqual(42)
    })

    it('should remove comment', () => {
      const result = parseStringToJson(chartOptionJSONString)

      expect(result.toString()).not.toContain(comment)
    })

    it('should remove semicolon', () => {
      const result = parseStringToJson(chartOptionJSONString)

      expect(result.toString()).not.toContain(';')
    })
  })

  describe('dedent', ()=> {
    it('should remove new line', () => {
      const result = dedent(chartOptionJSONString)

      expect(result).not.toContain('\\n')
    })

    it('should remove white space at start', () => {
      const result = dedent(chartOptionsStringWithWhiteSpace)

      expect(result.length).toEqual(308)
    })

    it('should not process string', () => {
      const result = dedent(chartOptionJSONString)

      expect(result.length).toEqual(311)
    })
  })

})
