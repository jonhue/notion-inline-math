// ==UserScript==
// @name Inline Math for Notion
// @homepageURL https://github.com/jonhue/notion-inline-math
// @version 0.2.1
// @match https://www.notion.so/*
// @require https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.js
// ==/UserScript==

const holdKeyEpsilon = 50

let keyDownTimeStamp = null
const updatedBlocks = []

const initializeKatex = () => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css'
    document.head.appendChild(link)
    
    const css = '.notion-frame span .katex { padding-right: 0 !important; }'
    const style = document.createElement('style')
    style.type = 'text/css'
    style.appendChild(document.createTextNode(css))
    document.head.appendChild(style)
}

const render = span => {
    if (!span.textContent.startsWith('$$') || !span.textContent.endsWith('$$')) return

    span.style.color = null
    span.style.background = null
    katex.render(span.textContent.slice(2, -2).trim(), span, {
        throwOnError: false,
        font: 'mathit'
    })
}

const renderAll = (block = document) =>
    block.querySelectorAll('span[style*="monospace"]').forEach(render)

const rerender = (target, delay = 0) => {
    const block = target.closest('div[contenteditable=true]')
    const lastBlock = updatedBlocks.shift()
    setTimeout(() => {
        if (block !== null) {
            if (lastBlock !== undefined && lastBlock !== block)
                renderAll(lastBlock)
            updatedBlocks.push(block)
        } else if (lastBlock !== undefined)
            renderAll(lastBlock)
    }, delay)
}

const handleLoadEvent = () => {
    initializeKatex()
    setTimeout(renderAll, 1500)
}
const handleKeyUpEvent = e => {
    if (e.key == 'F2' && !e.ctrlKey && !e.shiftKey && !e.altKey)
        renderAll()
    else if (keyDownTimeStamp !== null && e.timeStamp - keyDownTimeStamp < holdKeyEpsilon)
        renderAll()
    else
        rerender(e.target)
}
const handleKeyDownEvent = e => keyDownTimeStamp = e.timeStamp
// Rerendering has to be delayed as Notion would otherwise immediately replace the rendered KaTex
const handleMouseEvent = e => rerender(e.target, 200)

window.addEventListener('load', handleLoadEvent, true)
document.addEventListener('keyup', handleKeyUpEvent, true)
document.addEventListener('keydown', handleKeyDownEvent, true)
document.addEventListener('mouseup', handleMouseEvent, true)
