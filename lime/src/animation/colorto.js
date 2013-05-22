goog.provide('lime.animation.ColorTo');


goog.require('lime.Sprite');
goog.require('lime.animation.Animation');

/**
 * Animation for changing element's fillcolor value
 * @param {mixed...} args Color definition.
 * @constructor
 * @extends lime.animation.Animation
 */
lime.animation.ColorTo = function(args) {
    lime.animation.Animation.call(this);

    this.rgb_ = null;

    var color = lime.fill.parse(goog.array.toArray(arguments));

    if (color instanceof lime.fill.Color) {
        this.rgba_ = color.getRgba();
    }
};
goog.inherits(lime.animation.ColorTo, lime.animation.Animation);

/** @inheritDoc */
lime.animation.ColorTo.prototype.scope = 'color';

/** @inheritDoc */
lime.animation.ColorTo.prototype.makeTargetProp = function(target) {
    var fill, oldrgb;

    if (target instanceof lime.Label) {
        oldrgb = goog.color.hexToRgb(target.getFontColor());
    } else {
        fill = target.getFill(),
        oldrgb = fill instanceof lime.fill.Color ? fill.getRgba() : [255, 255, 255, 0];
    }

    return {start: oldrgb,
         delta: [this.rgba_[0] - oldrgb[0], this.rgba_[1] - oldrgb[1],
            this.rgba_[2] - oldrgb[2], this.rgba_[3] - oldrgb[3]]};
};

/** @inheritDoc */
lime.animation.ColorTo.prototype.update = function(t, target) {
    if (this.status_ == 0) return;

    var prop = this.getTargetProp(target),
        red = Math.round(prop.start[0] + prop.delta[0] * t),
        green = Math.round(prop.start[1] + prop.delta[1] * t),
        blue = Math.round(prop.start[2] + prop.delta[2] * t),
        alpha;

    if ('start' in prop) {
        if (target instanceof lime.Label) {
            target.setFontColor(goog.color.rgbToHex(red, green, blue));
        } else {
            alpha = prop.start[3] + prop.delta[3] * t;
            target.setFill(red, green, blue, alpha);
        }
    }
};
