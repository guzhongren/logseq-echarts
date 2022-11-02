import '@logseq/libs'
import * as echarts from 'echarts'
import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { findCode } from './lib/logseq-utils'
import { parseStringToJson } from './lib/string-utils'
import template from './template'

function main() {
  logseq.Editor.registerSlashCommand('Create a echart', async () => {
    const parentBlock = await logseq.Editor.getCurrentBlock()
    await createChartAsCodeBlock(parentBlock, template)
  })

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const [type, width, height] = payload.arguments

    if (!type?.startsWith(':logseq-echarts')) return
    const code = await findCode(payload.uuid)
    await logseq.App.showMsg('Loading chart...')
    return logseq.provideUI({
      key: payload.uuid,
      slot,
      reset: true,
      template: `<img src=${getImgData(
        code,
        width,
        height,
      )} style="width: 100%;height:100%;"></img>`,
    })
  })
}

async function createChartAsCodeBlock(
  parentBlock: BlockEntity,
  jsonTemplate: string,
) {
  const parentBlockContent = '{{renderer :logseq-echarts, 1400px, 600px}}'
  await logseq.Editor.insertAtEditingCursor(parentBlockContent)
  const codeBlockContent = `\`\`\`json\n${jsonTemplate}\n\`\`\``
  await logseq.Editor.insertBlock(parentBlock.uuid, codeBlockContent, {
    sibling: false,
    before: false,
  })
}

logseq.ready(main).catch(console.error)

function getImgData(codeStr: string, width: string, height: string) {
  const chartDiv = document.createElement('div')
  chartDiv.style.width = width
  chartDiv.style.height = height
  const chartInstance = echarts.init(chartDiv, null, {
    renderer: 'svg',
  })
  const defaultOptions = parseStringToJson(codeStr)
  chartInstance.setOption(defaultOptions)
  return chartInstance.getDataURL({
    type: 'svg',
  })
}
