/**!
 * draggable-number.js
 * Minimal numeric input widget
 *
 * @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * @author David Mignot - http://idflood.com
 * @version 0.4.3
 **/
!(function (a, b) {
  "object" == typeof exports
    ? (module.exports = b())
    : "function" == typeof define && define.amd
    ? define([], b)
    : (a.DraggableNumber = b());
})(this, function () {
  var a = function (a, b) {
    return function () {
      return a.apply(b, arguments)
    };
  };
  return (
    (DraggableNumber = function (a, b) {
      (this._options = void 0 !== b ? b : {}),
        (this._input = a),
        (this._span = document.createElement("span")),
        (this._isDragging = !1),
        (this._lastMousePosition = { x: 0, y: 0 }),
        (this._value = 0),
        (this._startValue = this._value),
        (this._step = 1),
        (this._dragThreshold = this._setOption("dragThreshold", 10)),
        (this._min = this._setOption("min", -1 / 0)),
        (this._max = this._setOption("max", 1 / 0)),
        (this._inputDisplayStyle = ""),
        (this._spanDisplayStyle = ""),
        this._init();
    }),
    (DraggableNumber.MODIFIER_NONE = 0),
    (DraggableNumber.MODIFIER_LARGE = 1),
    (DraggableNumber.MODIFIER_SMALL = 2),
    (DraggableNumber.prototype = {
      constructor: DraggableNumber,
      _init: function () {
        (this._value = parseFloat(this._input.value, 10)),
          this._addSpan(),
          (this._inputDisplayStyle = this._input.style.display),
          (this._spanDisplayStyle = this._span.style.display),
          (this._input.style.display = "none"),
          (this._onMouseUp = a(this._onMouseUp, this)),
          (this._onMouseMove = a(this._onMouseMove, this)),
          (this._onMouseDown = a(this._onMouseDown, this)),
          (this._onInputBlur = a(this._onInputBlur, this)),
          (this._onInputKeyDown = a(this._onInputKeyDown, this)),
          (this._onInputChange = a(this._onInputChange, this)),
          this._span.addEventListener("mousedown", this._onMouseDown, !1),
          this._input.addEventListener("blur", this._onInputBlur, !1),
          this._input.addEventListener("keypress", this._onInputKeyDown, !1),
          (this._input.onchange = this._onInputChange);
      },
      set: function (a) {
        (a = this._constraintValue(a)),
          this._value !== a &&
            ((this._value = a),
            (this._input.value = this._value),
            (this._span.innerHTML = this._value));
      },
      get: function () {
        return this._value;
      },
      setMin: function (a) {
        (this._min = a), this.set(this._value);
      },
      setMax: function (a) {
        (this._max = a), this.set(this._value);
      },
      destroy: function () {
        this._span.removeEventListener("mousedown", this._onMouseDown, !1),
          this._input.removeEventListener("blur", this._onInputBlur, !1),
          this._input.removeEventListener("keypress", this._onInputKeyDown, !1),
          document.removeEventListener("mouseup", this._onMouseUp, !1),
          document.removeEventListener("mousemove", this._onMouseMove, !1),
          this._span.parentNode &&
            this._span.parentNode.removeChild(this._span),
          delete this._input,
          delete this._span,
          delete this._inputDisplayStyle,
          delete this._spanDisplayStyle;
      },
      _setOption: function (a, b) {
        return void 0 !== this._options[a]
          ? this._options[a]
          : this._input.hasAttribute("data-" + a)
          ? parseFloat(this._input.getAttribute("data-" + a), 10)
          : b;
      },
      _preventSelection: function (a) {
        var b = "none";
        a === !1 && (b = "all"),
          (document.body.style["-moz-user-select"] = b),
          (document.body.style["-webkit-user-select"] = b),
          (document.body.style["-ms-user-select"] = b),
          (document.body.style["user-select"] = b);
      },
      _addSpan: function () {
        var a = this._input.parentNode;
        a.insertBefore(this._span, this._input),
          (this._span.innerHTML = this.get()),
          (this._span.style.cursor = "col-resize");
      },
      _showInput: function () {
        (this._startValue = this._value),
          (this._input.style.display = this._inputDisplayStyle),
          (this._span.style.display = "none"),
          this._input.focus();
      },
      _showSpan: function () {
        (this._input.style.display = "none"),
          (this._span.style.display = this._spanDisplayStyle);
      },
      _onInputBlur: function () {
        this._onInputChange(),
          this._showSpan(),
          "endCallback" in this._options &&
            this._value != this._startValue &&
            this._options.endCallback(this._value);
      },
      _onInputChange: function () {
        this.set(parseFloat(this._input.value, 10));
      },
      _onInputKeyDown: function (a) {
        var b = 13;
        a.charCode == b && this._input.blur();
      },
      _onMouseDown: function (a) {
        this._preventSelection(!0),
          (this._isDragging = !1),
          (this._lastMousePosition = { x: a.clientX, y: a.clientY }),
          (this._startValue = this._value),
          (this._step = this._getStep(this._value)),
          document.addEventListener("mouseup", this._onMouseUp, !1),
          document.addEventListener("mousemove", this._onMouseMove, !1);
      },
      _onMouseUp: function () {
        this._preventSelection(!1),
          this._isDragging === !1 && this._showInput(),
          (this._isDragging = !1),
          document.removeEventListener("mouseup", this._onMouseUp, !1),
          document.removeEventListener("mousemove", this._onMouseMove, !1),
          "endCallback" in this._options &&
            this._startValue != this._value &&
            this._options.endCallback(this._value),
          (this._startValue = this._value);
      },
      _hasMovedEnough: function (a, b) {
        return Math.abs(a.x - b.x) >= this._dragThreshold ||
          Math.abs(a.y - b.y) >= this._dragThreshold
          ? !0
          : !1;
      },
      _onMouseMove: function (a) {
        var b = { x: a.clientX, y: a.clientY };
        if (
          (this._hasMovedEnough(b, this._lastMousePosition) &&
            (this._isDragging = !0),
          this._isDragging !== !1)
        ) {
          var c = DraggableNumber.MODIFIER_NONE;
          a.shiftKey
            ? (c = DraggableNumber.MODIFIER_LARGE)
            : a.ctrlKey && (c = DraggableNumber.MODIFIER_SMALL);
          var d = this._getLargestDelta(b, this._lastMousePosition),
            e = this._getNumberOffset(d, c),
            f = this._step * e,
            g = this.get() + f;
          (g = parseFloat(g.toFixed(10))),
            this.set(g),
            "changeCallback" in this._options &&
              this._options.changeCallback(g),
            (this._lastMousePosition = b);
        }
      },
      _getStep: function (a) {
        var b = 1;
        return (
          0 !== a &&
            isNaN(a) === !1 &&
            (b =
              Math.pow(10, Math.floor(Math.log(Math.abs(a)) / Math.LN10)) / 10),
          b
        );
      },
      _getNumberOffset: function (a, b) {
        var c = 1;
        return (
          b == DraggableNumber.MODIFIER_SMALL
            ? (c *= 0.1)
            : b == DraggableNumber.MODIFIER_LARGE && (c *= 10),
          0 > a && (c *= -1),
          c
        );
      },
      _getLargestDelta: function (a, b) {
        var c = { x: a.x - b.x, y: a.y - b.y };
        return Math.abs(c.x) > Math.abs(c.y) ? c.x : -1 * c.y;
      },
      _constraintValue: function (a) {
        return (a = Math.min(a, this._max)), (a = Math.max(a, this._min));
      },
    }),
    DraggableNumber
  );
});
