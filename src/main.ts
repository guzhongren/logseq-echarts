import '@logseq/libs'
import * as echarts from 'echarts'
import { BlockEntity } from '@logseq/libs/dist/LSPlugin'
import { findCode } from './lib/logseq-utils'
import { parseStringToJson } from './lib/string-utils'
import template from './template'

function main() {
  logseq.Editor.registerSlashCommand('Create an echart', async () => {
    const parentBlock = await logseq.Editor.getCurrentBlock()
    await createChartAsCodeBlock(parentBlock, template)
  })

  logseq.App.onMacroRendererSlotted(async ({ slot, payload }) => {
    const [type, width, height] = payload.arguments

    if (!type?.startsWith(':logseq-echarts')) return
    const code = await findCode(payload.uuid)
    if (!code) {
      return logseq.provideUI({
        key: payload.uuid,
        slot,
        reset: true,
        template: 'no chart data',
      })
    }
    await logseq.UI.showMsg('Loading chart...')
    const keepKey = `${logseq.baseInfo.id}-${slot}`
    const keepOrNot = () => logseq.App.queryElementById(keepKey)
    logseq.provideUI({
      key: payload.uuid,
      slot,
      reset: true,
      template: `<div id="${keepKey}" style="width: ${width};height: ${height}"></div>`,
    })

    Promise.resolve(keepOrNot()).then((res) => {
      if (res) {
        renderChart(top.document.getElementById(keepKey), code)
      }
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

function renderChart(el: HTMLElement, codeStr: string) {
  const chartInstance = echarts.init(el, null, {
    renderer: 'svg',
  })
  const defaultOptions = parseStringToJson(codeStr)
  chartInstance.setOption(defaultOptions)
}
