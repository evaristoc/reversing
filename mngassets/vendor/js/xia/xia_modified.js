//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//
//
// @author : pascal.fautrero@gmail.com

/*
 *
 * @param {object} params
 * @constructor create image active object
 */
function IaObject (params) {
    'use strict'
    this.parent = params.parent
    this.xiaDetail = []
    this.jsonSource = params.detail
    this.layer = params.layer
    this.background_layer = params.background_layer
    this.backgroundCache_layer = params.backgroundCache_layer
    this.imageObj = params.imageObj
    this.myhooks = params.myhooks
    this.idText = params.idText
    this.zoomLayer = params.zoomLayer
    this.iaScene = params.iaScene
    this.backgroundCache_layer.draw()
    this.agrandissement = 0
    this.zoomActive = 0
    this.index = params.index
    // Bounding Area is defined by details
    this.minX = null
    this.minY = null
    this.maxX = null
    this.maxY = null
    this.tween_group = 0
    this.group = 0
    // Create kineticElements and include them in a group
    this.group = new Konva.Group()
    this.layer.add(this.group)
    var allElementsCreated = new Promise(function (resolve) {
      this.resolve = resolve
      if ('group' in params.detail) {
        this.nbElements = params.detail.group.length
        for (let i in params.detail.group) {
          this.xiaDetail[i] = this.createXiaElement(params.detail.group[i], this.idText)
        }
        this.definePathBoxSize(params.detail, this)
      } else {
        this.nbElements = 1
        this.xiaDetail[0] = this.createXiaElement(params.detail, this.idText)
      }
    }.bind(this))
    allElementsCreated.then(function (value) {
      this.defineTweens(this, params.iaScene)
      if ('afterIaObjectConstructor' in this.myhooks) {
        this.myhooks.afterIaObjectConstructor(
          params.iaScene,
          params.idText,
          params.detail,
          this
        )
      }
    }.bind(this))
  }
  
  IaObject.prototype.createXiaElement = function (jsonDetail, idDOMElement) {
    var xiaDetail = null
    if ('path' in jsonDetail) {
      xiaDetail = this.includePath(jsonDetail, idDOMElement)
    } else if ('image' in jsonDetail) {
      var re = /sprite(.*)/i
      if (('id' in jsonDetail) && (jsonDetail.id.match(re))) {
        xiaDetail = this.includeSprite(jsonDetail, idDOMElement)
      } else {
        xiaDetail = this.includeImage(jsonDetail, idDOMElement)
      }
    }
    return xiaDetail
  }
  
  IaObject.prototype.includePath = function (detail, idDOMElement) {
    var xiaPath = new XiaPath(this, detail, idDOMElement)
    xiaPath.start()
    return xiaPath
  }
  
  IaObject.prototype.includeImage = function (detail, idDOMElement) {
    var xiaImage = new XiaImage(this, detail, idDOMElement)
    xiaImage.start()
    return xiaImage
  }
  
  IaObject.prototype.includeSprite = function (detail, idDOMElement) {
    var xiaSprite = new XiaSprite(this, detail, idDOMElement)
    xiaSprite.start()
    return xiaSprite
  }
  
  /*
   *
   * @param {type} index
   * @returns {undefined}
   */
  IaObject.prototype.definePathBoxSize = function (detail, that) {
    'use strict'
    if (
      (typeof detail.minX !== 'undefined') &&
      (typeof detail.minY !== 'undefined') &&
      (typeof detail.maxX !== 'undefined') &&
      (typeof detail.maxY !== 'undefined')) {
      that.minX = detail.minX
      that.minY = detail.minY
      that.maxX = detail.maxX
      that.maxY = detail.maxY
    } else {
      console.log('definePathBoxSize failure')
    }
  }
  
  /*
   * Define zoom rate and define tween effect for each group
   * @returns {undefined}
   */
  IaObject.prototype.defineTweens = function (that, iaScene) {
    that.minX = that.minX * iaScene.coeff
    that.minY = that.minY * iaScene.coeff
    that.maxX = that.maxX * iaScene.coeff
    that.maxY = that.maxY * iaScene.coeff
    var largeur = that.maxX - that.minX
    var hauteur = that.maxY - that.minY
    that.agrandissement1 = (iaScene.height - iaScene.y) / hauteur // beta
    that.agrandissement2 = iaScene.width / largeur // alpha
  
    if (hauteur * that.agrandissement2 > iaScene.height) {
      that.agrandissement = that.agrandissement1
      that.tweenX = (0 - (that.minX)) * that.agrandissement + (iaScene.width - largeur * that.agrandissement) / 2
      that.tweenY = (0 - iaScene.y - (that.minY)) * that.agrandissement + iaScene.y
    } else {
      that.agrandissement = that.agrandissement2
      that.tweenX = (0 - (that.minX)) * that.agrandissement
      that.tweenY = 1 * ((0 - iaScene.y - (that.minY)) * that.agrandissement + iaScene.y + (iaScene.height - hauteur * that.agrandissement) / 2)
    }
  }
  
  //   This program is free software: you can redistribute it and/or modify
  //   it under the terms of the GNU General Public License as published by
  //   the Free Software Foundation, either version 3 of the License, or
  //   (at your option) any later version.
  //   This program is distributed in the hope that it will be useful,
  //   but WITHOUT ANY WARRANTY; without even the implied warranty of
  //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //   GNU General Public License for more details.
  //   You should have received a copy of the GNU General Public License
  //   along with this program.  If not, see <http://www.gnu.org/licenses/>
  //
  //
  // @author : pascal.fautrero@gmail.com
  
  /**
   *
   * @param {type} originalWidth
   * @param {type} originalHeight
   * @constructor create image active scene
   */
  function IaScene (originalWidth, originalHeight, ratio, colorPersistent) {
    'use strict'
  
    //  canvas width
    this.width = 1000
  
    // canvas height
    this.height = 800
  
    // w2 = w1 * originalRatio
    this.originalRatio = ratio
  
    // default color used to fill shapes during mouseover
    var _colorOver = { red: 66, green: 133, blue: 244, opacity: 0.6 }
  
    // default color used to fill stroke around shapes during mouseover
    var _colorOverStroke = {red:0, green:153, blue:204, opacity:1};
  
    // default color used to fill shapes if defined as cache
    //this.colorPersistent = { red: 174, green: 154, blue: 174, opacity: 1 }
    //var _colorPersistent = { red: 174, green: 154, blue: 174, opacity: 1 }
    if(colorPersistent){
      this.colorPersistent = colorPersistent;
    }else{
      this.colorPersistent = { red: 174, green: 154, blue: 174, opacity: 1 };
    }
    
    //var _colorPersistent = this.colorPersistent;
  
    // color used over background image during focus
    var _colorCache = { red: 0, green: 0, blue: 0, opacity: 0.8 }
  
    // Image ratio on the scene
    // Warning : hack to suit css media-queries rules !!
    this.ratio = 1
    // padding-top in the canvas
    this.y = 0
  
    // internal
    this.fullScreen = 'off'
    this.backgroundCacheColor = this.getRGBAColor(_colorCache)
    //this.cacheColor = this.getRGBAColor(_colorPersistent)
    this.cacheColor = this.getRGBAColor(this.colorPersistent)
    this.overColor = this.getRGBAColor(_colorOver)
    this.overColorStroke = this.getRGBAColor(_colorOverStroke)
    this.scale = 1
    this.zoomActive = 0
    this.element = null
    this.originalWidth = originalWidth
    this.originalHeight = originalHeight
    this.coeff = (this.width * this.ratio) / parseFloat(originalWidth)
    this.cursorState = ''
    this.noPropagation = false
  }
  IaScene.prototype.getRGBAColor = function (jsonColor) {
    return 'rgba(RED, GREEN, BLUE, OPACITY)'
      .replace('RED', jsonColor.red)
      .replace('GREEN', jsonColor.green)
      .replace('BLUE', jsonColor.blue)
      .replace('OPACITY', jsonColor.opacity)
  }
  
  IaScene.prototype.scaleScene = function (xiaObject) {
    var mainScene = xiaObject.mainScene
    var viewportWidth = document.getElementById(xiaObject.params.targetID).offsetWidth
    var viewportHeight = document.getElementById(xiaObject.params.targetID).offsetHeight
  
    var coeffWidth = viewportWidth / mainScene.originalWidth
    var coeffHeight = viewportHeight / mainScene.originalHeight
    if ((parseFloat(viewportWidth.toFixed(5)) >= parseFloat((mainScene.originalWidth * coeffWidth).toFixed(5))) &&
      (parseFloat(viewportHeight.toFixed(5)) >= parseFloat((mainScene.originalHeight * coeffWidth).toFixed(5)))) {
      mainScene.width = viewportWidth
      mainScene.coeff = mainScene.width / mainScene.originalWidth
      mainScene.height = mainScene.originalHeight * mainScene.coeff
    } else if ((parseFloat(viewportWidth.toFixed(5)) >= parseFloat((mainScene.originalWidth * coeffHeight).toFixed(5))) &&
      (parseFloat(viewportHeight.toFixed(5)) >= parseFloat((mainScene.originalHeight * coeffHeight).toFixed(5)))) {
      mainScene.height = viewportHeight
      mainScene.coeff = mainScene.height / mainScene.originalHeight
      mainScene.width = mainScene.originalWidth * mainScene.coeff
    }
  }
  
  //   This program is free software: you can redistribute it and/or modify
  //   it under the terms of the GNU General Public License as published by
  //   the Free Software Foundation, either version 3 of the License, or
  //   (at your option) any later version.
  //   This program is distributed in the hope that it will be useful,
  //   but WITHOUT ANY WARRANTY; without even the implied warranty of
  //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //   GNU General Public License for more details.
  //   You should have received a copy of the GNU General Public License
  //   along with this program.  If not, see <http://www.gnu.org/licenses/>
  //
  //
  // @author : pascal.fautrero@gmail.com
  
  /*
   * Main
   * Initialization
   *
   * 1rst layer : div "detect" - if clicked, enable canvas events
   * 2nd layer : bootstrap accordion
   * 3rd layer : div "canvas" containing images and paths
   * 4th layer : div "disablearea" - if clicked, disable events canvas
   */
  
  function Xia (params) {
    'use strict'
    this.params = params
    if (!('hooks' in this.params)) { this.params.hooks = {} }
    if (this.params.hooks == null) { this.params.hooks = {} }
    if ('duringXiaInit' in this.params.hooks) { this.params.hooks.duringXiaInit(this) }
    this.initKonva()
    this.addDocumentUndoEvents()
    this.start()
  }
  
  Xia.prototype.initKonva = function () {
    // fix bug in retina and amoled screens
    Konva.pixelRatio = 1
    if (!('setXiaParent' in Konva.Shape.prototype)) {
      Konva.Shape.prototype.setXiaParent = function (xiaparent) {
        this.xiaparent = xiaparent
      }
    }
    if (!('getXiaParent' in Konva.Shape.prototype)) {
      Konva.Shape.prototype.getXiaParent = function () {
        return this.xiaparent
      }
    }
    if (!('setIaObject' in Konva.Shape.prototype)) {
      Konva.Shape.prototype.setIaObject = function (iaobject) {
        this.iaobject = iaobject
      }
    }
    if (!('getIaObject' in Konva.Shape.prototype)) {
      Konva.Shape.prototype.getIaObject = function () {
        return this.iaobject
      }
    }
  }
  
  Xia.prototype.start = function () {
    this.canvas = document.getElementById(this.params.targetID)
    this.iaObjects = []
    this.focusedObj = null
    var loadBackground = new Promise(function (resolve, reject) {
      if (('path' in this.params.scene) && (this.params.scene.path !== '')) {
        var tempCanvas = this.convertPath2Image(this.params.scene)
        this.params.scene.image = tempCanvas.toDataURL()
        resolve(0)
      } else if ('group' in this.params.scene) {
        this.convertGroup2Image(this.params.scene, resolve)
      } else {
        resolve(0)
      }
    }.bind(this))
  
    loadBackground.then(function (value) {
      this.buildScene()
    }.bind(this))
  }
  
  Xia.prototype.buildScene = function () {
    // Load XiaElements when Background Image is loaded
    this.imageObj = new Image()
    // allowing images coming from another server
    this.imageObj.crossOrigin = "Anonymous"
    this.imageObj.src = this.params.scene.image
    this.imageObj.onload = function () {
      if (!('width' in this.params.scene) || !('height' in this.params.scene)) {
        this.params.scene.width = this.imageObj.width
        this.params.scene.height = this.imageObj.height
        this.params.scene.ratio = 1
      }
  
      var mainScene = new IaScene(
        this.params.scene.width,
        this.params.scene.height,
        this.params.scene.ratio,
        this.params.colorPersistent
      )
  
      this.mainScene = mainScene
      if ('scaleScene' in this.params.hooks) {
        this.params.hooks.scaleScene(this)
      } else {
        this.mainScene.scaleScene(this)
      }
      var stage = new Konva.Stage({
        container: this.params.targetID,
        width: this.mainScene.width,
        height: this.mainScene.height
      })
      this.stage = stage
      // area containing image background
      var baseImage = new Konva.Image({
        x: 0,
        y: this.mainScene.y,
        width: this.params.scene.width,
        height: this.params.scene.height,
        scale: { x: this.mainScene.coeff, y: this.mainScene.coeff },
        image: this.imageObj
      })
      // cache used over background image
      // to darken it during detail focus
      var baseCache = new Konva.Rect({
        x: 0,
        y: this.mainScene.y,
        width: this.params.scene.width,
        height: this.params.scene.height,
        scale: { x: this.mainScene.coeff, y: this.mainScene.coeff },
        fill: this.mainScene.backgroundCacheColor
      })
      this.layers = {}
      this.layers.modalBackground = new Konva.Layer()
      this.layers.baseImage = new Konva.Layer()
      this.layers.mainLayer = new Konva.Layer()
      this.layers.modalBackground.setAttrs({ opacity: 0 })
      this.layers.modalBackground.add(baseCache)
      this.layers.baseImage.add(baseImage)
  
      stage.add(this.layers.modalBackground)
      stage.add(this.layers.baseImage)
      stage.add(this.layers.mainLayer)
  
      for (let i in this.params.details) {
        this.iaObjects[i] = new IaObject({
          parent: this,
          imageObj: this.imageObj,
          detail: this.params.details[i],
          layer: this.layers.mainLayer,
          idText: 'collapse' + i,
          baseImage: baseImage,
          iaScene: mainScene,
          background_layer: this.layers.baseImage,
          backgroundCache_layer: this.layers.modalBackground,
          myhooks: this.params.hooks,
          index: i
        })
      }
      this.addUndoEvents()
      if ('loaded' in this.params.hooks) this.params.hooks.loaded(this)
    }.bind(this)
  }
  
  Xia.prototype.reorderItems = function () {
    do {
      var swap = false
      for (let j = 0; j < this.iaObjects.length - 1; j++) {
        if (this.iaObjects[j].group.getZIndex() > this.iaObjects[j + 1].group.getZIndex()) {
          this.iaObjects[j].group.moveDown()
          swap = true
          break
        }
      }
    }
    while (swap)
  }
  
  Xia.prototype.addDocumentUndoEvents = function () {
    document.addEventListener('click', function () {
      var overBox = false
      var boxes = document.querySelectorAll(':hover')
      for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].className === 'konvajs-content') overBox = true
      }
      if (!overBox) {
        if (!('mainScene' in this)) return
        if (this.mainScene.element === null) return
        for (let j in this.mainScene.element.xiaDetail) {
          if (this.mainScene.element === null) break
          var xiaDetail = this.mainScene.element.xiaDetail[j]
          if (this.mainScene.zoomActive === 0) {
            this.mainScene.cursorState = 'default'
            xiaDetail.kineticElement.fire('mouseleave')
          } else {
            xiaDetail.kineticElement.fire('click')
          }
        }
        this.mainScene.element = null
      }
    }.bind(this), false)
  }
  
  Xia.prototype.addUndoEvents = function () {
  // Events applyed on stage and document
  // to unselect elements if user clicks out of scene
    this.stage.on('click touchstart', function (e) {
      if (!('event' in this)) this.event = null
      if (this.event !== null) {
        this.event.then(function (value) {
          this.manageStage()
        }.bind(this))
        this.event = null
      } else {
        this.manageStage()
      }
    }.bind(this))
  }
  
  Xia.prototype.manageStage = function () {
    var xiaDetail
    if (this.mainScene.zoomActive === 0) {
      var shape = this.layers.mainLayer.getIntersection(this.stage.getPointerPosition())
      if (this.mainScene.element === null) return
      if ((shape === null) && this.mainScene.element) {
        for (let j in this.mainScene.element.xiaDetail) {
          xiaDetail = this.mainScene.element.xiaDetail[j]
          this.mainScene.cursorState = 'default'
          xiaDetail.kineticElement.fire('mouseleave')
        }
      } else if (shape !== null) {
        if (shape.getXiaParent().parent !== this.mainScene.element) {
          for (let j in this.mainScene.element.xiaDetail) {
            xiaDetail = this.mainScene.element.xiaDetail[j]
            this.mainScene.cursorState = 'default'
            xiaDetail.kineticElement.fire('mouseleave')
          }
          this.mainScene.element = null
        }
      }
    } else {
      if (!this.mainScene.element) return
      if (this.mainScene.element.group.scaleX().toFixed(5) === (this.mainScene.element.agrandissement).toFixed(5)) {
        for (let j in this.mainScene.element.xiaDetail) {
          if (this.mainScene.element == null) break // used to stop firing events on grouped Konva shapes
          xiaDetail = this.mainScene.element.xiaDetail[j]
          xiaDetail.kineticElement.fire('click')
        }
      }
    }
  }
  
  Xia.prototype.stop = function () {
    var params = this.params
    // remove all Konva events
    for (let j in this.iaObjects) {
      for (let i in this.iaObjects[j].xiaDetail) {
        if (this.iaObjects[j].xiaDetail[i].kineticElement) {
          this.iaObjects[j].xiaDetail[i].kineticElement.off('mouseover')
          this.iaObjects[j].xiaDetail[i].kineticElement.off('mouseleave')
          this.iaObjects[j].xiaDetail[i].kineticElement.off('click touchstart')
        }
      }
    }
    // remove Konva objects
    if (typeof this.stage === 'object') this.stage.destroy()
    // remove iaScene objects
    delete this.mainScene.element
    // remove Xia objects
    Object.keys(this).forEach(function (key) {
      delete this[key]
    }.bind(this))
    this.params = params
  }
  
  Xia.prototype.restart = function () {
    this.stop()
    this.start()
  }
  
  /*
   * convert path to image if this path is used as background
   * transform scene.path to scene.image
   */
  Xia.prototype.convertPath2Image = function (scene) {
    var tempCanvas = document.createElement('canvas')
    tempCanvas.setAttribute('width', scene.width)
    tempCanvas.setAttribute('height', scene.height)
    var tempContext = tempCanvas.getContext('2d')
    // Arghh...forced to remove single quotes from scene.path...
    var currentPath = new Path2D(scene.path.replace(/'/g, ''))
    tempContext.beginPath()
    tempContext.fillStyle = scene.fill
    tempContext.fill(currentPath)
    tempContext.strokeStyle = scene.stroke
    tempContext.lineWidth = scene.strokewidth
    tempContext.stroke(currentPath)
    // scene.image = tempCanvas.toDataURL()
    return tempCanvas
  }
  
  Xia.prototype.convertGroup2Image = function (scene, resolve) {
    var nbImages = 0
    var nbImagesLoaded = 0
    var tempCanvas = document.createElement('canvas')
    tempCanvas.setAttribute('width', scene.width)
    tempCanvas.setAttribute('height', scene.height)
    var tempContext = tempCanvas.getContext('2d')
    tempContext.beginPath()
    for (let i in scene['group']) {
      if (typeof scene['group'][i].image !== 'undefined') {
        nbImages++
      }
    }
    for (let i in scene['group']) {
      if (typeof scene['group'][i].path !== 'undefined') {
        // Arghh...forced to remove single quotes from scene.path...
        var currentPath = new Path2D(scene['group'][i].path.replace(/'/g, ''))
        tempContext.fillStyle = scene['group'][i].fill
        tempContext.fill(currentPath)
        tempContext.strokeStyle = scene['group'][i].stroke
        tempContext.lineWidth = scene['group'][i].strokewidth
        tempContext.stroke(currentPath)
      } else if (typeof scene['group'][i].image !== 'undefined') {
        var tempImage = new Image()
        tempImage.onload = (function (main, imageItem) {
          tempContext.drawImage(
            this,
            0,
            0,
            this.width,
            this.height,
            imageItem.x,
            imageItem.y,
            this.width,
            this.height
          )
          nbImagesLoaded++
          if (nbImages === nbImagesLoaded) {
            scene.image = tempCanvas.toDataURL()
            resolve(0)
          }
        })(this, scene['group'][i])
  
        tempImage.src = scene['group'][i].image
      }
    }
    if (nbImages === 0) {
      scene.image = tempCanvas.toDataURL()
      resolve(0)
    }
  }
  
  //   This program is free software: you can redistribute it and/or modify
  //   it under the terms of the GNU General Public License as published by
  //   the Free Software Foundation, either version 3 of the License, or
  //   (at your option) any later version.
  //   This program is distributed in the hope that it will be useful,
  //   but WITHOUT ANY WARRANTY; without even the implied warranty of
  //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //   GNU General Public License for more details.
  //   You should have received a copy of the GNU General Public License
  //   along with this program.  If not, see <http://www.gnu.org/licenses/>
  //
  //
  // @author : pascal.fautrero@gmail.com
  
  /*
   *
   */
  class XiaDetail {
    constructor (parent, detail, idText) {
      this.parent = parent
      this.detail = detail
      if ('minX' in this.detail) {
        this.detail.minX = parseFloat(this.detail.minX)
        this.detail.maxX = parseFloat(this.detail.maxX)
        this.detail.minY = parseFloat(this.detail.minY)
        this.detail.maxY = parseFloat(this.detail.maxY)
      }
      if (!('id' in this.detail)) {
        this.detail.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
          .replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0
            var v = (c === 'x') ? r : (r & 0x3 | 0x8)
            return v.toString(16)
          })
      }
      this.detail.x = ('x' in this.detail) ? parseFloat(this.detail.x) : 0
      this.detail.y = ('y' in this.detail) ? parseFloat(this.detail.y) : 0
      if ('width' in this.detail) {
        this.detail.height = parseFloat(this.detail.height)
        this.detail.width = parseFloat(this.detail.width)
      }
      this.idText = idText
      this.title = this.parent.jsonSource.title
      this.desc = this.parent.jsonSource.desc
      this.path = ''
      this.kineticElement = null
      this.persistent = ''
      this.backgroundImage = null
      this.tooltip = null
      this.options = ('options' in this.parent.jsonSource) ? this.parent.jsonSource.options : ''
      this.click = (this.options.includes('disable-click')) ? 'off' : 'on'
      this.zoomable = ('fill' in this.parent.jsonSource) && (this.parent.jsonSource.fill !== '#000000') || !('fill' in this.parent.jsonSource)
      this.originalX = 0
      this.originalY = 0
      this.tween = null
      this.type= null
    }
  
    mouseover () {
      if ('mouseover' in this.parent.myhooks) {
        var result = this.parent.myhooks.mouseover(this)
        if ((typeof result !== 'undefined') && (result === false)) return
      }
  
      var zoomed = (this.parent.iaScene.cursorState.includes('ZoomOut.cur'))
      var focused_zoomable = (this.parent.iaScene.cursorState.includes('ZoomIn.cur'))
      var focused_unzoomable = (this.parent.iaScene.cursorState.includes('ZoomFocus.cur'))
      var overflown = (this.parent.iaScene.cursorState.includes('HandPointer.cur'))
  
      if (zoomed || focused_zoomable || focused_unzoomable || overflown) return
  
      document.body.style.cursor = 'pointer'
      this.parent.iaScene.cursorState = 'url(img/HandPointer.cur),auto'
  
      var cacheBackground = true
      for (let i in this.parent.xiaDetail) {
        var xiaDetail = this.parent.xiaDetail[i]
        var kineticElement = xiaDetail.kineticElement
        var objectType = kineticElement.getClassName()
        if (objectType === 'Sprite') {
          kineticElement.animation('idle')
          //kineticElement.frameIndex(0)
          kineticElement.setAttrs({ opacity: 0 })
          kineticElement.to({ opacity: 1 })
        } else if (objectType === 'Image') {
          if (xiaDetail.persistent === 'on') cacheBackground = false
          kineticElement.setImage(kineticElement.backgroundImage)
          kineticElement.setAttrs({ opacity: 0 })
          kineticElement.to({ opacity: 1 })
        } else {
          kineticElement.fillPriority('pattern')
          kineticElement.fillPatternScaleX(kineticElement.backgroundImageOwnScaleX)
          kineticElement.fillPatternScaleY(kineticElement.backgroundImageOwnScaleY)
          kineticElement.fillPatternImage(kineticElement.backgroundImage)
          kineticElement.stroke(xiaDetail.stroke)
          kineticElement.strokeWidth(xiaDetail.strokeWidth)
          kineticElement.setAttrs({ opacity: 0 })
          kineticElement.to({ opacity: 1 })
        }
      }
      if (cacheBackground === true) {
        this.parent.backgroundCache_layer.moveToTop()
        this.parent.backgroundCache_layer.to({ opacity: 1 })
      }
      this.parent.layer.moveToTop()
      this.parent.layer.draw()
      this.parent.parent.focusedObj = this.parent.index
    }
  
    zoom () {
      if ('zoom' in this.parent.myhooks) {
        var result = this.parent.myhooks.zoom(this)
        if ((typeof result !== 'undefined') && (result === false)) return
      }
      let delta = {"x": 0, "y":0}
      if (this.type == "sprite") {
        delta.x = (-1) * (this.kineticElement.x() - this.parent.minX) * (this.parent.agrandissement)
        delta.y = (-1) * (this.kineticElement.y() - this.parent.minY) * (this.parent.agrandissement)
        this.kineticElement.stop()
      }
      document.body.style.cursor = 'zoom-out'
      this.parent.iaScene.cursorState = 'url(img/ZoomOut.cur),auto'
      this.parent.iaScene.zoomActive = 1
      this.parent.group.zoomActive = 1
      this.parent.layer.moveToTop()
      this.parent.group.moveToTop()
      this.originalX = this.parent.group.x()
      this.originalY = this.parent.group.y()
      this.alpha = 0
      this.step = 0.1
      var newStrokeWidth = parseFloat(this.strokeWidth / this.parent.agrandissement)
      for (let i in this.parent.xiaDetail) {
        this.parent.xiaDetail[i].kineticElement.setStrokeWidth(newStrokeWidth)
      }
      this.parent.layer.draw()
      var currentDetail = this
      currentDetail.parent.group.to({
        x: currentDetail.parent.tweenX + delta.x,
        y: currentDetail.parent.tweenY + delta.y,
        scaleX: currentDetail.parent.agrandissement,
        scaleY: currentDetail.parent.agrandissement,
        easing: Konva.Easings.BackEaseOut,
        duration: 0.5
      })
    }
    unzoom () {
      if ('unzoom' in this.parent.myhooks) {
        var result = this.parent.myhooks.unzoom(this)
        if ((typeof result !== 'undefined') && (result === false)) return
      }
      if (this.type == "sprite") this.kineticElement.start()
      if ((this.parent.group.zoomActive === 1) &&
        (this.parent.group.scaleX().toFixed(5) === (this.parent.agrandissement).toFixed(5))) {
        this.parent.iaScene.zoomActive = 0
        this.parent.group.zoomActive = 0
        this.parent.group.scaleX(1)
        this.parent.group.scaleY(1)
        this.parent.group.x(this.originalX)
        this.parent.group.y(this.originalY)
        this.reset_state_all(this.parent.xiaDetail)
        this.parent.layer.draw()
        this.parent.backgroundCache_layer.to({ opacity: 0 })
        this.parent.iaScene.cursorState = 'default'
        this.parent.iaScene.element = null
        document.body.style.cursor = 'default'
        this.parent.parent.reorderItems()
      }
    }
  
    reset_state_all (arrayDetails) {
      for (let i in arrayDetails) {
        var xiaDetail = arrayDetails[i]
        var kineticElement = arrayDetails[i].kineticElement
        var objectType = kineticElement.getClassName()
        if (objectType === 'Image') {
          if (xiaDetail.persistent === 'on') {
            kineticElement.stroke('rgba(0, 0, 0, 0)')
            kineticElement.strokeWidth(0)
            kineticElement.setImage(kineticElement.backgroundImage)
          } else {
            kineticElement.setImage(null)
          }
        } else if (objectType === 'Sprite') {
          if (xiaDetail.persistent === 'off') {
            kineticElement.animation('hidden')
          }
          kineticElement.start()
        } else {
          kineticElement.fillPriority('color')
          kineticElement.fill('rgba(0,0,0,0)')
          kineticElement.setStroke('rgba(0, 0, 0, 0)')
          kineticElement.setStrokeWidth(0)
        }
      }
    }
  
    focus () {
      if ('focus' in this.parent.myhooks) {
        var result = this.parent.myhooks.focus(this)
        if ((typeof result !== 'undefined') && (result === false)) return
      }
      // first, reset state of previous selected elements
      if (this.parent.iaScene.element) {
        this.reset_state_all(this.parent.iaScene.element.xiaDetail)
        if ('layer' in this.parent.iaScene.element) this.parent.iaScene.element.layer.draw()
      }
      if (this.zoomable) {
        document.body.style.cursor = 'zoom-in'
        this.parent.iaScene.cursorState = 'url("img/ZoomIn.cur"),auto'
      } else {
        this.parent.iaScene.cursorState = 'url("img/ZoomFocus.cur"),auto'
      }
  
      // Next, paint all elements of current IaObject to show FOCUS state
      var cacheBackground = true
      for (let i in this.parent.xiaDetail) {
        var xiaDetail = this.parent.xiaDetail[i]
        var kineticElement = xiaDetail.kineticElement
        var objectType = kineticElement.getClassName()
        if (objectType === 'Sprite') {
          kineticElement.animation('idle')
          kineticElement.frameIndex(0)
        } else if (objectType === 'Image') {
          if (xiaDetail.persistent === 'on') cacheBackground = false
          kineticElement.setImage(kineticElement.backgroundImage)
        } else {
          kineticElement.fillPriority('pattern')
          kineticElement.fillPatternScaleX(kineticElement.backgroundImageOwnScaleX)
          kineticElement.fillPatternScaleY(kineticElement.backgroundImageOwnScaleY)
          kineticElement.fillPatternImage(kineticElement.backgroundImage)
          kineticElement.stroke(xiaDetail.stroke)
          kineticElement.strokeWidth(xiaDetail.strokeWidth)
        }
      }
      if (cacheBackground) {
        this.parent.backgroundCache_layer.moveToTop()
        this.parent.backgroundCache_layer.to({ opacity: 1 })
      }
      this.parent.layer.moveToTop()
      this.parent.layer.draw()
      this.parent.iaScene.element = this.parent
    }
  
    touchstart (evt) {
      if ((this.parent.iaScene.element) && (this.parent.iaScene.element.group !== this.parent.group)) {
        return
      }
      // promise catched in main.js Xia.prototype.addUndoEvents
      // We just want to chain stage events just after shape events
      this.parent.event = new Promise(function (resolve) {
        var zoomed = (this.parent.iaScene.cursorState.includes('ZoomOut.cur'))
        var focused_zoomable = (this.zoomable === true)
  
        if (this.options.includes('direct-link')) {
          location.href = this.title
        } else {
          this.parent.iaScene.noPropagation = true
          if (zoomed) {
            this.unzoom()
          } else if (focused_zoomable) {
            this.parent.iaScene.element = this.parent
            // emulate mouseover on mobile devices
            // to get all stuffs done during mouse over event
            //if (evt.type === 'touchstart') this.mouseover()
            this.mouseover()
            this.zoom()
            this.parent.parent.focusedObj = this.parent.index
          } else {
            if (this.parent.iaScene.zoomActive === 0) {
              this.focus()
              this.parent.parent.focusedObj = this.parent.index
            }
          }
        }
        resolve(0)
      }.bind(this))
    }
    mouseleave () {
      if ('mouseleave' in this.parent.myhooks) {
        var result = this.parent.myhooks.mouseleave(this)
        if ((typeof result !== 'undefined') && (result === false)) return
      }
      var zoomed = (this.parent.iaScene.cursorState.includes('ZoomOut.cur'))
      var focused_zoomable = (this.parent.iaScene.cursorState.includes('ZoomIn.cur'))
      var focused_unzoomable = (this.parent.iaScene.cursorState.includes('ZoomFocus.cur'))
  
      if (zoomed || focused_zoomable || focused_unzoomable) return
  
      document.body.style.cursor = 'default'
      this.parent.iaScene.cursorState = 'default'
      var mouseXY = this.parent.layer.getStage().getPointerPosition()
      if (typeof mouseXY === 'undefined') {
        mouseXY = { x: 0, y: 0 }
      }
      if ((this.parent.layer.getStage().getIntersection(mouseXY) !== this)) {
        this.parent.backgroundCache_layer.to({ opacity: 0 })
        for (let i in this.parent.xiaDetail) {
          var xiaDetail = this.parent.xiaDetail[i]
          var kineticElement = this.parent.xiaDetail[i].kineticElement
          var objectType = kineticElement.getClassName()
          if (objectType === 'Image') {
            if (xiaDetail.persistent === 'off') {
              kineticElement.setImage(null)
            } else {
              kineticElement.setImage(kineticElement.backgroundImage)
            }
          } else if (objectType === 'Sprite') {
            if (xiaDetail.persistent === 'off') kineticElement.animation('hidden')
          } else if (objectType === 'Path') {
            if (xiaDetail.persistent === 'off') {
              kineticElement.fillPriority('color')
              kineticElement.fill('rgba(0, 0, 0, 0)')
              kineticElement.stroke('rgba(0, 0, 0, 0)')
              kineticElement.strokeWidth(0)
            } else {
              kineticElement.fillPriority('color')
              kineticElement.fill(this.parent.iaScene.cacheColor)
              kineticElement.stroke('rgba(0, 0, 0, 0)')
              kineticElement.strokeWidth(0)
            }
          }
        }
        this.parent.layer.draw()
      }
    }
  
    addEventsManagement () {
      if (this.options.includes('disable-click')) return
      this.kineticElement.on('mouseover', this.mouseover.bind(this))
      this.kineticElement.on('click touchstart', this.touchstart.bind(this))
      this.kineticElement.on('mouseleave', this.mouseleave.bind(this))
    }
  }
  
  if (typeof module !== 'undefined' && module.exports != null) {
    exports.XiaDetail = XiaDetail
  }
  
  //   This program is free software: you can redistribute it and/or modify
  //   it under the terms of the GNU General Public License as published by
  //   the Free Software Foundation, either version 3 of the License, or
  //   (at your option) any later version.
  //   This program is distributed in the hope that it will be useful,
  //   but WITHOUT ANY WARRANTY; without even the implied warranty of
  //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //   GNU General Public License for more details.
  //   You should have received a copy of the GNU General Public License
  //   along with this program.  If not, see <http://www.gnu.org/licenses/>
  //
  //
  // @author : pascal.fautrero@gmail.com
  
  /*
   *
   */
  class XiaImage extends XiaDetail {
    constructor (parent, detail, idText) {
      super(parent, detail, idText)
      this.width = this.detail.width * this.parent.iaScene.scale
      this.height = this.detail.height * this.parent.iaScene.scale
      this.persistent = (('fill' in this.detail) && (this.detail.fill === '#ffffff')) ? 'on' : 'off'
      this.path = this.detail.path
      this.tooltip = ''
      this.stroke = (('stroke' in this.detail) && (this.detail.stroke !== 'none')) ? this.detail.stroke : 'rgba(0, 0, 0, 0)'
      this.strokeWidth = ('strokewidth' in this.detail) ? this.detail.strokewidth : '0'
      this.parent.group.zoomActive = 0
      this.type = "image"
    }
  
    defineImageBoxSize (rasterObj) {
      if (!('width' in this.detail)) {
        this.detail.width = rasterObj.width
        this.detail.height = rasterObj.height
      }
      if (!('minX' in this.detail)) {
        this.detail.minX = this.detail.x
        this.detail.minY = this.detail.y
        this.detail.maxX = this.detail.x + this.detail.width
        this.detail.maxY = this.detail.y + this.detail.height
      }
      this.parent.minX = (this.parent.minX) ? Math.min(this.detail.x, this.parent.minX) : this.detail.x
      this.parent.minY = (this.parent.minY) ? Math.min(this.detail.y, this.parent.minY) : this.detail.y
      this.parent.maxX = (this.parent.maxX) ? Math.max(this.detail.x + this.detail.width, this.parent.maxX) : this.detail.x + this.detail.width
      this.parent.maxY = (this.parent.maxY) ? Math.max(this.detail.y + this.detail.height, this.parent.maxY) : this.detail.y + this.detail.height
    }
  
    start () {
      var rasterObj = new Image()
      rasterObj.onload = function () {
        this.defineImageBoxSize(rasterObj)
        this.backgroundImage = rasterObj
        this.kineticElement = new Konva.Image({
          id: this.detail.id,
          name: this.title,
          x: this.detail.x * this.parent.iaScene.coeff,
          y: this.detail.y * this.parent.iaScene.coeff + this.parent.iaScene.y,
          width: this.detail.width,
          height: this.detail.height,
          scale: { x: this.parent.iaScene.coeff, y: this.parent.iaScene.coeff }
        })
        this.kineticElement.backgroundImage = this.backgroundImage
        this.kineticElement.backgroundImageOwnScaleX = this.detail.width / this.width
        this.kineticElement.backgroundImageOwnScaleY = this.detail.height / this.height
        if (this.persistent === 'on') {
          this.kineticElement.setImage(this.kineticElement.backgroundImage)
        }
        this.parent.group.add(this.kineticElement)
        this.addEventsManagement()
        this.defineHitArea()
        /* that.kineticElement[i].sceneFunc(function(context) {
            var yo = that.layer.getHitCanvas().getContext().getImageData(0,0,iaScene.width, iaScene.height);
            context.putImageData(yo, 0,0);
        }); */
        this.kineticElement.setXiaParent(this)
        this.kineticElement.setIaObject(this.parent)
        this.parent.group.draw()
        this.parent.nbElements--
        if (this.parent.nbElements === 0) this.parent.resolve('All elements created')
      }.bind(this)
      rasterObj.crossOrigin = "Anonymous"
      rasterObj.src = this.detail.image
    }
  
    defineHitArea () {
      // define hit area excluding transparent pixels
      // =============================================================
      var cropper = {
        'x': Math.max(this.detail.minX, 0),
        'y': Math.max(this.detail.minY, 0),
        'width': Math.min(
          this.detail.maxX - this.detail.minX,
          Math.floor(this.parent.iaScene.originalWidth)),
        'height': Math.min(
          this.detail.maxY - this.detail.minY,
          Math.floor(this.parent.iaScene.originalHeight))
      }
  
      if (cropper.x + cropper.width > this.parent.iaScene.originalWidth * 1) {
        cropper.width = Math.abs(this.parent.iaScene.originalWidth * 1 - cropper.x * 1)
      }
      if (cropper.y * 1 + cropper.height > this.parent.iaScene.originalHeight * 1) {
        cropper.height = Math.abs(this.parent.iaScene.originalHeight * 1 - cropper.y * 1)
      }
      var hitCanvas = this.parent.layer.getHitCanvas()
      this.parent.iaScene.completeImage = hitCanvas
        .getContext()
        .getImageData(
          0,
          0,
          Math.floor(hitCanvas.width),
          Math.floor(hitCanvas.height)
        )
  
      var canvas_source = document.createElement('canvas')
      canvas_source.setAttribute('width', cropper.width * this.parent.iaScene.coeff)
      canvas_source.setAttribute('height', cropper.height * this.parent.iaScene.coeff)
      var context_source = canvas_source.getContext('2d')
      context_source.drawImage(
        this.kineticElement.backgroundImage,
        0,
        0,
        cropper.width * this.parent.iaScene.coeff,
        cropper.height * this.parent.iaScene.coeff
      )
      var imageDataSource = context_source
        .getImageData(
          0,
          0,
          Math.floor(cropper.width * this.parent.iaScene.coeff),
          Math.floor(cropper.height * this.parent.iaScene.coeff)
        )
      var len = imageDataSource.data.length;
  
      (function (len, imageDataSource, currentDetail, cropper) {
        currentDetail.kineticElement.hitFunc(function (context) {
          if (currentDetail.parent.iaScene.zoomActive === 0) {
            var imageData = imageDataSource.data
            var imageDest = currentDetail.parent.iaScene.completeImage.data
            var position1 = 0
            var position2 = 0
            var maxWidth = Math.floor(cropper.width * currentDetail.parent.iaScene.coeff)
            var maxHeight = Math.floor(cropper.height * currentDetail.parent.iaScene.coeff)
            var startY = Math.floor(cropper.y * currentDetail.parent.iaScene.coeff)
            var startX = Math.floor(cropper.x * currentDetail.parent.iaScene.coeff)
            var hitCanvasWidth = Math.floor(currentDetail.parent.layer.getHitCanvas().width)
            var rgbColorKey = Konva.Util._hexToRgb(this.colorKey)
            for (var varx = 0; varx < maxWidth; varx += 1) {
              for (var vary = 0; vary < maxHeight; vary += 1) {
                position1 = 4 * (vary * maxWidth + varx)
                position2 = 4 * ((vary + startY) * hitCanvasWidth + varx + startX)
                if (imageData[position1 + 3] > 100) {
                  imageDest[position2 + 0] = rgbColorKey.r
                  imageDest[position2 + 1] = rgbColorKey.g
                  imageDest[position2 + 2] = rgbColorKey.b
                  imageDest[position2 + 3] = 255
                }
              }
            }
            context.putImageData(currentDetail.parent.iaScene.completeImage, 0, 0)
          } else {
            context.beginPath()
            context.rect(0, 0, this.width(), this.height())
            context.closePath()
            context.fillStrokeShape(this)
          }
        })
      })(len, imageDataSource, this, cropper)
    }
  }
  if (typeof module !== 'undefined' && module.exports != null) {
    exports.XiaImage = XiaImage
  }
  
  //   This program is free software: you can redistribute it and/or modify
  //   it under the terms of the GNU General Public License as published by
  //   the Free Software Foundation, either version 3 of the License, or
  //   (at your option) any later version.
  //   This program is distributed in the hope that it will be useful,
  //   but WITHOUT ANY WARRANTY; without even the implied warranty of
  //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //   GNU General Public License for more details.
  //   You should have received a copy of the GNU General Public License
  //   along with this program.  If not, see <http://www.gnu.org/licenses/>
  //
  //
  // @author : pascal.fautrero@gmail.com
  
  /*
   *
   */
  class XiaPath extends XiaDetail {
    constructor (parent, detail, idText) {
      super(parent, detail, idText)
      this.width = this.detail.width * this.parent.iaScene.scale
      this.height = this.detail.height * this.parent.iaScene.scale
      this.persistent = (('fill' in this.detail) && (this.detail.fill === '#ffffff')) ? 'on' : 'off'
      this.path = this.detail.path
      this.tooltip = ''
      this.stroke = (('stroke' in this.detail) && (this.detail.stroke !== 'none')) ? this.detail.stroke : 'rgba(0, 0, 0, 0)'
      this.strokeWidth = ('strokewidth' in this.detail) ? this.detail.strokewidth : '0'
      this.type = "path"
    }
  
    start () {
      if ((this.detail.maxX < 0) || (this.detail.maxY < 0)) return
      this.kineticElement = new Konva.Path({
        id: this.detail.id,
        name: this.parent.jsonSource.title,
        data: this.detail.path,
        x: this.detail.x * this.parent.iaScene.coeff,
        y: this.detail.y * this.parent.iaScene.coeff + this.parent.iaScene.y,
        scale: { x: this.parent.iaScene.coeff, y: this.parent.iaScene.coeff },
        fill: 'rgba(0, 0, 0, 0)'
      })
      if (!('minX' in this.detail)) {
        var boundingArea = this.kineticElement.getClientRect()
        this.detail.minX = boundingArea.x / this.parent.iaScene.coeff
        this.detail.minY = boundingArea.y / this.parent.iaScene.coeff
        this.detail.maxX = (boundingArea.x + boundingArea.width) / this.parent.iaScene.coeff
        this.detail.maxY = (boundingArea.y + boundingArea.height) / this.parent.iaScene.coeff
      }
      this.defineBoxSize()
      this.defineHitArea()
      this.cropBackgroundImage()
  
      if (this.persistent === 'on') {
        this.kineticElement.fill(this.parent.iaScene.cacheColor)
      }
      this.addEventsManagement()
      this.parent.group.add(this.kineticElement)
      this.parent.group.draw()
      this.kineticElement.setXiaParent(this)
      this.kineticElement.setIaObject(this.parent)
  
    }
  
    defineHitArea () {
      // create path in a standalone image
      // to manage hitArea if this detail is under sprite...
      var tempCanvas = document.createElement('canvas')
      tempCanvas.setAttribute('width', this.detail.width)
      tempCanvas.setAttribute('height', this.detail.height)
      var tempContext = tempCanvas.getContext('2d')
      // Arghh...forced to remove single quotes from scene.path...
      var currentPath = new Path2D(this.detail.path.replace(/'/g, ''))
      tempContext.translate((-1) * this.detail.minX, (-1) * this.detail.minY)
      tempContext.fillStyle = 'rgba(255, 255, 255, 255)'
      tempContext.fill(currentPath)
      this.imgData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    }
  
    defineBoxSize () {
      this.parent.minX = (this.parent.minX) ? Math.min(this.detail.minX, this.parent.minX) : this.detail.minX
      this.parent.minY = (this.parent.minY) ? Math.min(this.detail.minY, this.parent.minY) : this.detail.minY
      this.parent.maxX = (this.parent.maxX) ? Math.max(this.detail.maxX, this.parent.maxX) : this.detail.maxX
      this.parent.maxY = (this.parent.maxY) ? Math.max(this.detail.maxY, this.parent.maxY) : this.detail.maxY
    }
  
    cropBackgroundImage () {
      // crop background image to suit shape box
      var cropperCanvas = document.createElement('canvas')
      // cropperCanvas.setAttribute('width', (this.detail.maxX - Math.max(this.detail.minX, 0)) * this.parent.iaScene.coeff)
      // cropperCanvas.setAttribute('height', (this.detail.maxY - Math.max(this.detail.minY, 0)) * this.parent.iaScene.coeff)
      cropperCanvas.setAttribute('width', (this.detail.maxX - Math.max(this.detail.minX, 0))* this.parent.iaScene.originalRatio)
      cropperCanvas.setAttribute('height', (this.detail.maxY - Math.max(this.detail.minY, 0)) * this.parent.iaScene.originalRatio)
  
      var source = {
        'x': Math.max(this.detail.minX, 0) * this.parent.iaScene.originalRatio,
        'y': Math.max(this.detail.minY, 0) * this.parent.iaScene.originalRatio,
        'width': (this.detail.maxX - Math.max(this.detail.minX, 0)) * this.parent.iaScene.originalRatio,
        'height': (this.detail.maxY - Math.max(this.detail.minY, 0)) * this.parent.iaScene.originalRatio
      }
      var target = {
        'x': 0,
        'y': 0,
        // 'width' : (this.detail.maxX - Math.max(this.detail.minX, 0)) * this.parent.iaScene.coeff,
        // 'height' : (this.detail.maxY - Math.max(this.detail.minY, 0)) * this.parent.iaScene.coeff
        'width': (this.detail.maxX - Math.max(this.detail.minX, 0)) * this.parent.iaScene.originalRatio,
        'height': (this.detail.maxY - Math.max(this.detail.minY, 0)) * this.parent.iaScene.originalRatio
      }
      cropperCanvas.getContext('2d').drawImage(
        this.parent.imageObj,
        source.x,
        source.y,
        source.width,
        source.height,
        0,
        0,
        target.width,
        target.height
      )
      var cropedImage = new Image()
      cropedImage.src = cropperCanvas.toDataURL()
      cropedImage.onload = function () {
        this.kineticElement.backgroundImage = cropedImage
        // this.kineticElement.backgroundImageOwnScaleX = 1 / this.parent.iaScene.coeff
        // this.kineticElement.backgroundImageOwnScaleY = 1 / this.parent.iaScene.coeff
        this.kineticElement.backgroundImageOwnScaleX = 1 / this.parent.iaScene.originalRatio
        this.kineticElement.backgroundImageOwnScaleY = 1 / this.parent.iaScene.originalRatio
  
        this.kineticElement.fillPatternRepeat('no-repeat')
        this.kineticElement.fillPatternX(Math.max(this.detail.minX, 0))
        this.kineticElement.fillPatternY(Math.max(this.detail.minY, 0))
        this.parent.nbElements--
        if (this.parent.nbElements === 0) this.parent.resolve('All elements created')
      }.bind(this)
    }
  }
  if (typeof module !== 'undefined' && module.exports != null) {
    exports.XiaPath = XiaPath
  }
  
  //   This program is free software: you can redistribute it and/or modify
  //   it under the terms of the GNU General Public License as published by
  //   the Free Software Foundation, either version 3 of the License, or
  //   (at your option) any later version.
  //   This program is distributed in the hope that it will be useful,
  //   but WITHOUT ANY WARRANTY; without even the implied warranty of
  //   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  //   GNU General Public License for more details.
  //   You should have received a copy of the GNU General Public License
  //   along with this program.  If not, see <http://www.gnu.org/licenses/>
  //
  //
  // @author : pascal.fautrero@gmail.com
  
  /*
   *
   */
  class XiaSprite extends XiaDetail {
    constructor (parent, detail, idText) {
      super(parent, detail, idText)
      this.width = this.detail.width * this.parent.iaScene.scale
      this.height = this.detail.height * this.parent.iaScene.scale
      this.persistent = (('fill' in this.detail) && (this.detail.fill === '#ffffff')) ? 'on' : 'off'
      this.path = this.detail.path
      this.tooltip = ''
      this.stroke = (('stroke' in this.detail) && (this.detail.stroke !== 'none')) ? this.detail.stroke : 'rgba(0, 0, 0, 0)'
      this.strokeWidth = ('strokewidth' in this.detail) ? this.detail.strokewidth : '0'
      this.parent.group.zoomActive = 0
      this.type = "sprite"
    }
  
    defineImageBoxSize () {
      this.parent.minX = (this.parent.minX) ? Math.min(this.detail.x, this.parent.minX) : this.detail.x
      this.parent.minY = (this.parent.minY) ? Math.min(this.detail.y, this.parent.minY) : this.detail.y
      this.parent.maxX = (this.parent.maxX) ? Math.max(this.detail.x + this.detail.width, this.parent.maxX) : this.detail.x + this.detail.width
      this.parent.maxY = (this.parent.maxY) ? Math.max(this.detail.y + this.detail.height, this.parent.maxY) : this.detail.y + this.detail.height
    }
  
    frameChange () {
      this.kineticElement.x(this.frames[this.kineticElement.frameIndex()]['x'] *  this.parent.iaScene.coeff)
      this.kineticElement.y(this.frames[this.kineticElement.frameIndex()]['y'] *  this.parent.iaScene.coeff)
    }
  
    start () {
      this.defineImageBoxSize()
      var rasterObj = new Image()
  
      this.backgroundImage = rasterObj
      var timeLine = JSON.parse('[' + this.detail.timeline + ']')
      this.frames = JSON.parse(this.detail.frames.replace(/'/g, '"')) // replacement fixes xiapy weird json encoding 
      rasterObj.onload = function () {
  
        var ratioRaster = rasterObj.naturalHeight / this.detail.height
        var idle = []
        for (let k = 0; k < timeLine.length; k++) {
          idle.push(timeLine[k] * this.detail.width * ratioRaster, 0, this.detail.width * ratioRaster, this.detail.height * ratioRaster)
        }
        this.kineticElement = new Konva.Sprite({
          x: this.detail.x * this.parent.iaScene.coeff,
          y: this.detail.y * this.parent.iaScene.coeff + this.parent.iaScene.y,
          image: this.backgroundImage,
          animation: 'idle',
          animations: {
            idle: idle,
            hidden: [timeLine.length * this.detail.width * ratioRaster, 0, this.detail.width * ratioRaster, this.detail.height * ratioRaster]
          },
          frameRate: 5,
          frameIndex: 0,
          scale: { x: this.parent.iaScene.coeff / ratioRaster, y: this.parent.iaScene.coeff / ratioRaster}
        })
        this.parent.group.add(this.kineticElement)
        this.kineticElement.animation('hidden')
        this.kineticElement.start()
        if (this.persistent === 'on') { this.kineticElement.animation('idle') }
        this.addEventsManagement()
        this.kineticElement.on('frameIndexChange', this.frameChange.bind(this))
        this.kineticElement.setXiaParent(this)
        this.kineticElement.setIaObject(this.parent)
        this.parent.nbElements--
        if (this.parent.nbElements === 0) this.parent.resolve('All elements created')
      }.bind(this)
      rasterObj.crossOrigin = "Anonymous"
      rasterObj.src = this.detail.image
    }
  }
  if (typeof module !== 'undefined' && module.exports != null) {
    exports.XiaSprite = XiaSprite
  }
  
  // XORCipher - Super simple encryption using XOR and Base64
  // MODIFIED VERSION TO AVOID underscore dependancy
  // License : MIT
  //
  // As a warning, this is **not** a secure encryption algorythm. It uses a very
  // simplistic keystore and will be easy to crack.
  //
  // The Base64 algorythm is a modification of the one used in phpjs.org
  // * http://phpjs.org/functions/base64_encode/
  // * http://phpjs.org/functions/base64_decode/
  //
  // Examples
  // --------
  //
  // XORCipher.encode("test", "foobar"); // => "EgocFhUX"
  // XORCipher.decode("test", "EgocFhUX"); // => "foobar"
  //
  
  (function (exports) {
    'use strict'
  
    var XORCipher = {
      encode: function (key, data) {
        data = xor_encrypt(key, data)
        return b64_encode(data)
      },
      decode: function (key, data) {
        data = b64_decode(data)
        return xor_decrypt(key, data)
      }
    }
  
    var b64_table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  
    function b64_encode (data) {
      var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = ''
      if (!data) { return data }
      do {
        o1 = data[i++]
        o2 = data[i++]
        o3 = data[i++]
        bits = o1 << 16 | o2 << 8 | o3
        h1 = bits >> 18 & 0x3f
        h2 = bits >> 12 & 0x3f
        h3 = bits >> 6 & 0x3f
        h4 = bits & 0x3f
        enc += b64_table.charAt(h1) + b64_table.charAt(h2) + b64_table.charAt(h3) + b64_table.charAt(h4)
      } while (i < data.length)
      r = data.length % 3
      return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3)
    }
  
    function b64_decode (data) {
      var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = []
      if (!data) { return data }
      data += ''
      do {
        h1 = b64_table.indexOf(data.charAt(i++))
        h2 = b64_table.indexOf(data.charAt(i++))
        h3 = b64_table.indexOf(data.charAt(i++))
        h4 = b64_table.indexOf(data.charAt(i++))
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4
        o1 = bits >> 16 & 0xff
        o2 = bits >> 8 & 0xff
        o3 = bits & 0xff
        result.push(o1)
        if (h3 !== 64) {
          result.push(o2)
          if (h4 !== 64) {
            result.push(o3)
          }
        }
      } while (i < data.length)
      return result
    }
  
    function keyCharAt (key, i) {
      return key.charCodeAt(i % key.length)
    }
  
    function xor_encrypt (key, data) {
      var result = []
      for (var indice in data) {
        result[indice] = data[indice].charCodeAt(0) ^ keyCharAt(key, indice)
      }
      return result
    }
  
    function xor_decrypt (key, data) {
      var result = []
      for (var indice in data) {
        result[indice] = String.fromCharCode(data[indice] ^ keyCharAt(key, indice))
      }
      return result.join('')
    }
    exports.XORCipher = XORCipher
  })(this)
  
  String.prototype.decode = function (encoding) {
    var result = ''
  
    var index = 0
    var c = 0
    var c2 = 0
    var c3 = 0
  
    while (index < this.length) {
      c = this.charCodeAt(index)
  
      if (c < 128) {
        result += String.fromCharCode(c)
        index++
      } else if ((c > 191) && (c < 224)) {
        c2 = this.charCodeAt(index + 1)
        result += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        index += 2
      } else {
        c2 = this.charCodeAt(index + 1)
        c3 = this.charCodeAt(index + 2)
        result += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        index += 3
      }
    }
  
    return result
  }
  
  String.prototype.encode = function (encoding) {
    var result = ''
  
    var s = this.replace(/\r\n/g, '\n')
  
    for (var index = 0; index < s.length; index++) {
      var c = s.charCodeAt(index)
  
      if (c < 128) {
        result += String.fromCharCode(c)
      } else if ((c > 127) && (c < 2048)) {
        result += String.fromCharCode((c >> 6) | 192)
        result += String.fromCharCode((c & 63) | 128)
      } else {
        result += String.fromCharCode((c >> 12) | 224)
        result += String.fromCharCode(((c >> 6) & 63) | 128)
        result += String.fromCharCode((c & 63) | 128)
      }
    }
  
    return result
  }
  
  