import { parseStringToJson } from '../../src/lib/string-utils'

describe('parseStringToJson', () => {
  it('should work', () => {
    expect(6 * 7).toEqual(42)
  })

  const comment = '// comment here'
  const chartOptionJSONString = `{
    ${comment}
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

  it('should remove comment', () => {
    const result = parseStringToJson(chartOptionJSONString)

    expect(result.toString()).not.toContain(comment)
  })

  it('should remove semicolon', () => {
    const result = parseStringToJson(chartOptionJSONString)

    expect(result.toString()).not.toContain(';')
  })
})
