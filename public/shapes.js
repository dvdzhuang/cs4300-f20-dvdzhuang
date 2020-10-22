const RED_HEX = "#FF0000"
const RED_RGB = webglUtils.hexToRgb(RED_HEX)
const BLUE_HEX = "#0000FF"
const BLUE_RGB = webglUtils.hexToRgb(BLUE_HEX)
const GREEN_HEX = "#00FF00"
const GREEN_RGB = webglUtils.hexToRgb(GREEN_HEX)
const RECTANGLE = "RECTANGLE"
const TRIANGLE = "TRIANGLE"
const LETTER_F = "LETTER_F"
const STAR = "STAR"
const CIRCLE = "CIRCLE"
const CUBE = "CUBE"
const origin = { x: 0, y: 0, z: 0 }
const sizeOne = { width: 1, height: 1, depth: 1 }

let camera = {
  translation: { x: -45, y: -35, z: 21 },
  rotation: { x: 40, y: 235, z: 0 }
}

let lightSource = [0.4, 0.3, 0.5]

let shapes = [
  {
    type: CUBE,
    position: origin,
    dimensions: sizeOne,
    color: BLUE_RGB,
    translation: { x: 0, y: 0, z: 0 },
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    type: CUBE,
    position: origin,
    dimensions: sizeOne,
    color: GREEN_RGB,
    translation: { x: 20, y: 0, z: 0 },
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    type: CUBE,
    position: origin,
    dimensions: sizeOne,
    color: RED_RGB,
    translation: { x: -20, y: 0, z: 0 },
    scale: { x: 0.5, y: 0.5, z: 0.5 },
    rotation: { x: 0, y: 0, z: 0 }
  },
  // {
  //   type: LETTER_F,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: BLUE_RGB,
  //   translation: {x: -150, y: 0, z: -360},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: m4.degToRad(190), y: m4.degToRad(40), z: m4.degToRad(320)},
  // },
  // {
  //   type: LETTER_F,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: RED_RGB,
  //   translation: {x: -100, y: 0, z: -400},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: m4.degToRad(190), y: m4.degToRad(40), z: m4.degToRad(320)},
  // },
  // {
  //   type: RECTANGLE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: BLUE_RGB,
  //   translation: {x: -15, y: 0, z: -20},
  //   scale: {x: 10, y: 10, z: 10},
  //   rotation: {x: 0, y: 0, z: 0}
  // },
  // {
  //   type: TRIANGLE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: RED_RGB,
  //   translation: {x: 15, y: 0, z: -20},
  //   scale: {x: 10, y: 10, z: 10},
  //   rotation: {x: 0, y: 0, z: 180}
  // },
  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: RED_RGB,
  //   translation: {x:   -20, y: 0, z: 0},
  //   scale:       {x:   0.5, y:   0.5, z:   0.5},
  //   rotation:    {x:   0, y:  0, z:   0},
  // },

  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: BLUE_RGB,
  //   translation: {x: -50, y: 0, z: -100},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: 45, y: 45, z: 45},
  // },
  // {
  //   type: CUBE,
  //   position: origin,
  //   dimensions: sizeOne,
  //   color: GREEN_RGB,
  //   translation: {x: 0, y: 0, z: -100},
  //   scale: {x: 1, y: 1, z: 1},
  //   rotation: {x: 45, y: 45, z: 45},
  // }
]
