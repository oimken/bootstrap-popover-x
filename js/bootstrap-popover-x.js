/*!
 * @copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 1.4.1
 *
 * Bootstrap Popover Extended - Popover with modal behavior, styling enhancements and more.
 *
 * For more JQuery/Bootstrap plugins and demos visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
(function ($) {
    "use strict";
    var PopoverX = function (element, options) {
        var self = this;
        self.options = options;
        self.$element = $(element);
        self.$dialog = self.$element;
        self.init();
    }, addCss = function($el, css) {
        $el.removeClass(css).addClass(css);
    };

    PopoverX.prototype = $.extend({}, $.fn.modal.Constructor.prototype, {
        constructor: PopoverX,
        init: function () {
            var self = this, $dialog = self.$element;
            addCss($dialog, 'popover-x');
            self.$body = $(document.body);
            self.$target = self.options.$target;
            self.useOffsetForPos = self.options.useOffsetForPos === undefined ? false : self.options.useOffsetForPos;
            if ($dialog.find('.popover-footer').length) {
                addCss($dialog, 'has-footer');
            }
            if (self.options.remote) {
                $dialog.find('.popover-content').load(self.options.remote, function () {
                    $dialog.trigger('load.complete.popoverX');
                });
            }
            $dialog.on('click.dismiss.popoverX', '[data-dismiss="popover-x"]', $.proxy(self.hide, self));
            $dialog.on('shown.bs.modal', function() {
                if (self.options.closeOtherPopovers) {
                    $dialog.removeClass('popover-x');
                    $('.popover-x').each(function() {
                        $(this).popoverX('hide');
                    });
                    addCss($dialog, 'popover-x');
                }
            });
        },
        getPosition: function () {
            var self = this, $element = self.$target,
                pos = self.useOffsetForPos ? $element.offset() : $element.position();
            return $.extend({}, pos, {width: $element[0].offsetWidth, height: $element[0].offsetHeight});
        },
        getPlacement: function(pos){
          var placement = this.options.placement,
              de = document.documentElement,
              db = document.body,
              clientWidth = de.clientWidth,
              clientHeight = de.clientHeight,
              scrollTop = Math.max(db.scrollTop, de.scrollTop),
              scrollLeft = Math.max(db.scrollLeft, de.scrollLeft),
              pageX = Math.max(0, pos.left - scrollLeft),
              pageY = Math.max(0, pos.top - scrollTop);

          var isH = placement === 'horizontal';
          var isV = placement === 'vertical';
          var detect = placement === 'auto' || isH || isV;

          if (detect) {
              if (pageX < clientWidth / 3) {
                  if (pageY < clientHeight / 3) {
                      placement = isH ? 'right right-bottom' : 'bottom bottom-right';
                  } else if (pageY < clientHeight * 2 / 3) {
                      if (isV) {
                          placement = pageY <= clientHeight / 2 ? 'bottom bottom-right' : 'top top-right';
                      } else {
                          placement = 'right';
                      }
                  } else {
                      placement = isH ? 'right right-top' : 'top top-right';
                  }
                  //placement= pageY>targetHeight+arrowSize?'top-right':'bottom-right';
              } else if (pageX < clientWidth * 2 / 3) {
                  if (pageY < clientHeight / 3) {
                      if (isH) {
                          placement = pageX <= clientWidth / 2 ? 'right right-bottom' : 'left left-bottom';
                      } else {
                          placement = 'bottom';
                      }
                  } else if (pageY < clientHeight * 2 / 3) {
                      if (isH) {
                          placement = pageX <= clientWidth / 2 ? 'right' : 'left';
                      } else {
                          placement = pageY <= clientHeight / 2 ? 'bottom' : 'top';
                      }
                  } else {
                      if (isH) {
                          placement = pageX <= clientWidth / 2 ? 'right right-top' : 'left left-top';
                      } else {
                          placement = 'top';
                      }
                  }
              } else {
                  //placement = pageY>targetHeight+arrowSize?'top-left':'bottom-left';
                  if (pageY < clientHeight / 3) {
                      placement = isH ? 'left left-bottom' : 'bottom bottom-left';
                  } else if (pageY < clientHeight * 2 / 3) {
                      if (isV) {
                          placement = pageY <= clientHeight / 2 ? 'bottom-left' : 'top-left';
                      } else {
                          placement = 'left';
                      }
                  } else {
                      placement = isH ? 'left left-top' : 'top top-left';
                  }
              }
          } else if (placement === 'auto-top') {
              if (pageX < clientWidth / 3) {
                  placement = 'top top-right';
              } else if (pageX < clientWidth * 2 / 3) {
                  placement = 'top';
              } else {
                  placement = 'top top-left';
              }
          } else if (placement === 'auto-bottom') {
              if (pageX < clientWidth / 3) {
                  placement = 'bottom bottom-right';
              } else if (pageX < clientWidth * 2 / 3) {
                  placement = 'bottom';
              } else {
                  placement = 'bottom bottom-left';
              }
          } else if (placement === 'auto-left') {
              if (pageY < clientHeight / 3) {
                  placement = 'left left-top';
              } else if (pageY < clientHeight * 2 / 3) {
                  placement = 'left';
              } else {
                  placement = 'left left-bottom';
              }
          } else if (placement === 'auto-right') {
              if (pageY < clientHeight / 3) {
                  placement = 'right right-top';
              } else if (pageY < clientHeight * 2 / 3) {
                  placement = 'right';
              } else {
                  placement = 'right right-bottom';
              }
          }
          return placement;
        },
        getDialogPositin: function(elementPos, placement, targetWidth, targetHeight) {
            var pos = elementPos,
                de = document.documentElement,
                db = document.body,
                clientWidth = de.clientWidth,
                clientHeight = de.clientHeight,
                elementW = this.$target.outerWidth(),
                elementH = this.$target.outerHeight(),
                scrollTop = Math.max(db.scrollTop, de.scrollTop),
                scrollLeft = Math.max(db.scrollLeft, de.scrollLeft),
                position = {},
                arrowOffset = null,
                arrowSize = 20,
                padding = 10,
                fixedW = elementW < arrowSize + padding ? arrowSize : 0,
                fixedH = elementH < arrowSize + padding ? arrowSize : 0,
                refix = 0,
                pageH = clientHeight + scrollTop,
                pageW = clientWidth + scrollLeft;



            var validLeft = pos.left + pos.width / 2 - fixedW > 0;
            var validRight = pos.left + pos.width / 2 + fixedW < pageW;
            var validTop = pos.top + pos.height / 2 - fixedH > 0;
            var validBottom = pos.top + pos.height / 2 + fixedH < pageH;

            switch (placement) {
                case 'bottom':
                    position = {
                        top: pos.top + pos.height,
                        left: pos.left + pos.width / 2 - targetWidth / 2
                    };
                    break;
                case 'top':
                    position = {
                        top: pos.top - targetHeight,
                        left: pos.left + pos.width / 2 - targetWidth / 2
                    };
                    break;
                case 'left':
                    position = {
                        top: pos.top + pos.height / 2 - targetHeight / 2,
                        left: pos.left - targetWidth
                    };
                    break;
                case 'right':
                    position = {
                        top: pos.top + pos.height / 2 - targetHeight / 2,
                        left: pos.left + pos.width
                    };
                    break;
                case 'top top-right':
                    position = {
                        top: pos.top - targetHeight,
                        left: validLeft ? pos.left - fixedW : padding
                    };
                    arrowOffset = {
                        left: validLeft ? Math.min(elementW, targetWidth) / 2 + fixedW : _offsetOut
                    };
                    console.log($(this)[0]);
                    break;
                case 'top top-left':
                    refix = validRight ? fixedW : -padding;
                    position = {
                        top: pos.top - targetHeight,
                        left: pos.left - targetWidth + pos.width + refix
                    };
                    arrowOffset = {
                        left: validRight ? targetWidth - Math.min(elementW, targetWidth) / 2 - fixedW : _offsetOut
                    };
                    break;
                case 'bottom bottom-right':
                    position = {
                        top: pos.top + pos.height,
                        left: validLeft ? pos.left - fixedW : padding
                    };
                    arrowOffset = {
                        left: validLeft ? Math.min(elementW, targetWidth) / 2 + fixedW : _offsetOut
                    };
                    break;
                case 'bottom bottom-left':
                    refix = validRight ? fixedW : -padding;
                    position = {
                        top: pos.top + pos.height,
                        left: pos.left - targetWidth + pos.width + refix
                    };
                    arrowOffset = {
                        left: validRight ? targetWidth - Math.min(elementW, targetWidth) / 2 - fixedW : _offsetOut
                    };
                    break;
                case 'right right-top':
                    refix = validBottom ? fixedH : -padding;
                    position = {
                        top: pos.top - targetHeight + pos.height + refix,
                        left: pos.left + pos.width
                    };
                    arrowOffset = {
                        top: validBottom ? targetHeight - Math.min(elementH, targetHeight) / 2 - fixedH : _offsetOut
                    };
                    break;
                case 'right right-bottom':
                    position = {
                        top: validTop ? pos.top - fixedH : padding,
                        left: pos.left + pos.width
                    };
                    arrowOffset = {
                        top: validTop ? Math.min(elementH, targetHeight) / 2 + fixedH : _offsetOut
                    };
                    break;
                case 'left left-top':
                    refix = validBottom ? fixedH : -padding;
                    position = {
                        top: pos.top - targetHeight + pos.height + refix,
                        left: pos.left - targetWidth
                    };
                    arrowOffset = {
                        top: validBottom ? targetHeight - Math.min(elementH, targetHeight) / 2 - fixedH : _offsetOut
                    };
                    break;
                case 'left left-bottom':
                    position = {
                        top: validTop ? pos.top - fixedH : padding,
                        left: pos.left - targetWidth
                    };
                    arrowOffset = {
                        top: validTop ? Math.min(elementH, targetHeight) / 2 + fixedH : _offsetOut
                    };
                    break;

            }

            return {
                position: position,
                arrowOffset: arrowOffset
            };
        },
        refreshPosition: function () {
            var self = this,
                $dialog = self.$element,
                actualWidth = $dialog[0].offsetWidth,
                actualHeight = $dialog[0].offsetHeight,
                position,
                pos = self.getPosition();
            var placement = self.getPlacement(pos);
            var postionInfo = self.getDialogPositin(pos, placement, actualWidth, actualHeight);
                      // console.log(dialogPosition.position);

            $dialog.css(postionInfo.position);
            addCss($dialog, placement + ' in');

            var $arrow = $dialog.find('.arrow');
            if ($arrow.length) {
                var $arrow = $dialog.find('.arrow');
                $arrow.removeAttr('style');
                console.log(postionInfo.arrowOffset);
                //prevent arrow change by content size
                if (placement === 'left' || placement === 'right') {
                    $arrow.css({
                        top: $dialog.height() / 2
                    });
                } else if (placement === 'top' || placement === 'bottom') {
                    $arrow.css({
                        left: $dialog.width() / 2
                    });
                }

                if (postionInfo.arrowOffset) {
                    //hide the arrow if offset is negative
                    if (postionInfo.arrowOffset.left === -1 || postionInfo.arrowOffset.top === -1) {
                        $arrow.hide();
                    } else {
                        $arrow.css(postionInfo.arrowOffset);
                    }
                }

            }
        },
        show: function () {
            var self = this, $dialog = self.$element;
            $dialog.css({top: 0, left: 0, display: 'block', 'z-index': 1050});
            self.refreshPosition();
            $.fn.modal.Constructor.prototype.show.call(self, arguments);
            $dialog.css({'padding': 0});
        }
    });

    $.fn.popoverX = function (option) {
        var self = this;
        return self.each(function () {
            var $this = $(this);
            var data = $this.data('popover-x');
            var options = $.extend({}, $.fn.popoverX.defaults, $this.data(), typeof option === 'object' && option);
            if (!options.$target) {
                if (data && data.$target) {
                    options.$target = data.$target;
                } else {
                    options.$target = option.$target || $(option.target);
                }
            }
            if (!data) {
                $this.data('popover-x', (data = new PopoverX(this, options)));
            }

            if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.popoverX.defaults = $.extend({}, $.fn.modal.defaults, {
        placement: 'auto',
        keyboard: true,
        arrow: true,
        closeOtherPopovers: true
    });

    $.fn.popoverX.Constructor = PopoverX;

    $(document).ready(function () {
        $(document).on('click', '[data-toggle="popover-x"]', function (e) {
            var $this = $(this), href = $this.attr('href'),
                $dialog = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))), //strip for ie7
                option = $dialog.data('popover-x') ? 'toggle' : $.extend({remote: !/#/.test(href) && href},
                    $dialog.data(), $this.data());
            e.preventDefault();
            $dialog.trigger('click.target.popoverX');
            if (option !== 'toggle') {
                option.$target = $this;
                $dialog
                    .popoverX(option)
                    .popoverX('show')
                    .on('hide', function () {
                        $this.focus();
                    });
            }
            else {
                $dialog
                    .popoverX(option)
                    .on('hide', function () {
                        $this.focus();
                    });
            }
        });

        $(document).on('keyup', '[data-toggle="popover-x"]', function (e) {
            var $this = $(this), href = $this.attr('href'),
                $dialog = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))); //strip for ie7
            if ($dialog && e.which === 27) {
                $dialog.trigger('keyup.target.popoverX');
                $dialog.popoverX('hide');
            }
        });
    });
})(window.jQuery);
