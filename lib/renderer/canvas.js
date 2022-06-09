const Utils = require("./utils")
const PImage = require("pureimage")

function clearCanvas(ctx, canvas, size) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (!canvas.style) canvas.style = {}
  canvas.height = size
  canvas.width = size
  canvas.style.height = size + "px"
  canvas.style.width = size + "px"
}

function getCanvasElement(size, size) {
  try {
    return PImage.make(size, size)
  } catch (e) {
    throw new Error("You need to specify a canvas element")
  }
}

exports.render = function render(qrData, canvas, options) {
  let opts = options
  let canvasEl = canvas

  if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  opts = Utils.getOptions(opts)
  const size = Utils.getImageWidth(qrData.modules.size, opts)

  if (!canvas) {
    canvasEl = getCanvasElement(size, size)
  }

  const ctx = canvasEl.getContext("2d")
  const image = ctx.getImageData(0, 0, size, size)

  Utils.qrToImageData(image.data, qrData, opts)

  clearCanvas(ctx, canvasEl, size)
  ctx.putImageData(image, 0, 0)

  return canvasEl
}

exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
  let opts = options

  if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
    opts = canvas
    canvas = undefined
  }

  if (!opts) opts = {}

  const canvasEl = exports.render(qrData, canvas, opts)

  const type = opts.type || "image/png"
  const rendererOpts = opts.rendererOpts || {}

  return canvasEl.toDataURL(type, rendererOpts.quality)
}
