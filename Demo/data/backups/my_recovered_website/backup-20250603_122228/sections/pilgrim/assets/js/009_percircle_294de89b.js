! function(t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports && "object" == typeof module ? module.exports = t(require("jquery")) : t(jQuery)
}(function(t, e) {
    "use strict";
    t.fn.percircle = function(e) {
        var s = {
            animate: !0
        };
        e || (e = {}), t.extend(e, s);
        var o = 3.6;
        return this.each(function() {
            t(this).hasClass("gt50") && t(this).removeClass("gt50");
            var s = t(this),
                n = "",
                d = function(t, e) {
                    s.on("mouseover", function() {
                        t.children("span").css("color", e)
                    }), s.on("mouseleave", function() {
                        t.children("span").attr("style", "")
                    })
                };
            s.hasClass("percircle") || s.addClass("percircle"), "undefined" != typeof s.attr("data-animate") && (e.animate = "true" == s.attr("data-animate")), e.animate && s.addClass("animate-percircle"), "undefined" != typeof s.attr("data-progressBarColor") ? (e.progressBarColor = s.attr("data-progressBarColor"), n = "style='border-color: " + e.progressBarColor + "'", d(t(this), e.progressBarColor)) : "undefined" != typeof e.progressBarColor && (n = "style='border-color: " + e.progressBarColor + "'", d(t(this), e.progressBarColor));
            var i = s.attr("data-percent") || e.percent || 0,
                c = s.attr("data-perclock") || e.perclock || 0,
                l = s.attr("data-perdown") || e.perdown || 0;
            if (i > -1) {
                i > 50 && s.addClass("gt50");
                var f = s.attr("data-text") || e.text || i + "%";
                s.html("<span>" + f + "</span>"), t('<div class="slice"><div class="bar" ' + n + '></div><div class="fill" ' + n + "></div></div>").appendTo(s), i > 50 && t(".bar", s).css({
                    "-webkit-transform": "rotate(180deg)",
                    "-moz-transform": "rotate(180deg)",
                    "-ms-transform": "rotate(180deg)",
                    "-o-transform": "rotate(180deg)",
                    transform: "rotate(180deg)"
                });
                var m = o * i;
                setTimeout(function() {
                    t(".bar", s).css({
                        "-webkit-transform": "rotate(" + m + "deg)",
                        "-moz-transform": "rotate(" + m + "deg)",
                        "-ms-transform": "rotate(" + m + "deg)",
                        "-o-transform": "rotate(" + m + "deg)",
                        transform: "rotate(" + m + "deg)"
                    })
                }, 0)
            } else c ? (s.hasClass("perclock") || s.addClass("perclock"), setInterval(function() {
                var e = new Date,
                    r = a(e.getHours()) + ":" + a(e.getMinutes()) + ":" + a(e.getSeconds());
                s.html("<span>" + r + "</span>"), t('<div class="slice"><div class="bar" ' + n + '></div><div class="fill" ' + n + "></div></div>").appendTo(s);
                var o = e.getSeconds();
                0 === o && s.removeClass("gt50"), o > 30 && (s.addClass("gt50"), t(".bar", s).css({
                    "-webkit-transform": "rotate(180deg);scale(1,3)",
                    "-moz-transform": "rotate(180deg);scale(1,3)",
                    "-ms-transform": "rotate(180deg);scale(1,3)",
                    "-o-transform": "rotate(180deg);scale(1,3)",
                    transform: "rotate(180deg);scale(1,3)"
                }));
                var d = 6 * o;
                t(".bar", s).css({
                    "-webkit-transform": "rotate(" + d + "deg)",
                    "-moz-transform": "rotate(" + d + "deg)",
                    "-ms-transform": "rotate(" + d + "deg)",
                    "-o-transform": "rotate(" + d + "deg)",
                    transform: "rotate(" + d + "deg)"
                })
            }, 1e3)) : l && r(s, e, n)
        })
    };
    var r = function(e, r, a) {
            function s() {
                if (c -= 1, c > 30 && e.addClass("gt50"), c < 30 && e.removeClass("gt50"), i(), c <= 0) return n(), void e.html("<span>" + l + "</span>")
            }

            function o() {
                m = setInterval(s, 1e3)
            }

            function n() {
                clearInterval(m)
            }

            function d() {
                n(), c = r.secs, i(), o()
            }

            function i() {
                e.html("<span>" + c + "</span>"), t('<div class="slice"><div class="bar" ' + a + '></div><div class="fill" ' + a + "></div></div>").appendTo(e);
                var r = 6 * c;
                t(".bar", e).css({
                    "-webkit-transform": "rotate(" + r + "deg)",
                    "-moz-transform": "rotate(" + r + "deg)",
                    "-ms-transform": "rotate(" + r + "deg)",
                    "-o-transform": "rotate(" + r + "deg)",
                    transform: "rotate(" + r + "deg)"
                })
            }
            var c = e.attr("data-secs") || r.secs,
                l = e.attr("data-timeUpText") || r.timeUpText,
                f = e[0].hasAttribute("data-reset") || r.reset;
            l.length > 8 && (l = "the end");
            var m;
            f && e.on("click", d), o()
        },
        a = function(t) {
            return t < 10 ? "0" + t : t
        }
});