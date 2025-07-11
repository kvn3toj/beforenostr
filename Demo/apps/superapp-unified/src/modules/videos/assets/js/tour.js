window.Tour = function(t) {
    t.prototype.init = function(t) {
        this.current = 0, w.call(this, m(), t)
    }, t.prototype.override = function(t, e) {
        var n = this[t];
        this[t] = e.bind(this, n.bind(this))
    }, t.prototype.start = function() {
        this.showOverlay(), this.showStep(this.steps[this.current = 0]);
        this.preventScroll();
    }, t.prototype.goToStep = function(t) {
        this.current = t, this.showStep(this.steps[this.current]);
        this.preventScroll();
    }, t.prototype.nextStep = function() {
        var t = this.steps[++this.current];
        t ? this.showStep(t) : this.end();
        this.preventScroll();
    }, t.prototype.prevStep = function() {
        var t = this.steps[Math.max(--this.current, 0)];
        this.showStep(t);
        this.preventScroll();
    }, t.prototype.showStep = function(t) {
        var n = v(t.element, this.container, this.padding),
            i = e(this, ".ttour-wrapper"),
            o = e(this, ".ttour-tip");
        o && i.removeChild(o), o = s.call(this, t, t.position || "bottom"), i.appendChild(o), r(e(this, ".ttour-overlay"), n);
        //this.preventScroll();
    }, t.prototype.showOverlay = function() {
        this.el = this.el || n.call(this), this.container.appendChild(this.el)
    }, t.prototype.end = function() {
        this.container.removeChild(this.el), this.el = null
    }, t.prototype.preventScroll = function() {
        //console.log("Prevent scrolling", this.preventScrolling);
        if(this.preventScrolling){
            setTimeout(() => {
                //console.log("Prevent Scroll");
                var fixed = document.querySelector('.ttour-shadow-'+this.random);
                if(fixed == null){
                    //console.log("No existe.");
                    return;
                }
                fixed.addEventListener('touchmove', function(e) {
                    //console.log("Scroll");
                    if (e.cancelable) {
                        e.preventDefault();
                    }
                }, false);
                
            }, 100);
        }
    };
    var e = function(t, e) {
            return t.el.querySelector(e)
        },
        n = function() {
            this.random = Math.floor((Math.random() * 1000) + 1);
            return y("div", {
                className: "ttour-shadow ttour-shadow-"+this.random,
                onclick: this.end.bind(this)
            }, [i()])
        },
        i = function() {
            var t = y("div", {
                className: "ttour-wrapper"
            });
            return y("div", {
                className: "ttour-overlay"
            }, [t])
        },
        r = function(t, e) {
            t.style.left = e.left + "px", t.style.top = e.top + "px", t.style.width = e.width + "px", t.style.height = e.height + "px"
        },
        o = function() {
            return y("div", {
                className: "ttour-arrow"
            })
        },
        s = function(t, e) {
            return y("div", {
                className: "ttour-tip tip-" + this.current + " " + e,
                style: {
                    position: "absolute"
                },
                onclick: function(t) {
                    t.stopPropagation()
                }
            }, [h(t.title), u(t.description), c.call(this), o()])
        },
        h = function(t) {
            return y("div", {
                className: "ttour-header"
            }, [f(t)])
        },
        u = function(t) {
            return y("div", {
                className: "ttour-body",
                innerHTML: t
            })
        },
        c = function() {
            var t = [l(this.steps.length, this.current), a.call(this, this.steps.length - 1 == this.current)];
            return this.current > 0 && t.push(d.call(this)), y("div", {
                className: "ttour-footer"
            }, t)
        },
        l = function(t, e) {
            for (var n = [], i = 0; i < t; i++) n.push(p(i == e));
            return y("div", {
                className: "ttour-bullets"
            }, n)
        },
        p = function(t) {
            return y("div", {
                className: "ttour-bullet " + (t ? "active" : "")
            })
        },
        a = function(t) {
            return y("button", {
                className: "next",
                innerText: t ? this.done : this.next,
                onclick: this.nextStep.bind(this)
            })
        },
        d = function() {
            return y("button", {
                className: "prev",
                innerText: this.prev,
                onclick: this.prevStep.bind(this)
            })
        },
        f = function(t) {
            return y("h1", {
                innerText: t
            })
        },
        v = function(t, e, n) {
            var i = (e.querySelector(t) || e).getBoundingClientRect();
            return {
                left: e.scrollLeft + i.left - n,
                /* top: e.scrollTop + i.top - n, */
                top: jQuery(t).offset().top - n,
                width: i.width + 2 * n,
                height: i.height + 2 * n
            }
        },
        y = function(t, e, n) {
            var i = document.createElement(t);
            w.call(i, e);
            for (var r = 0; r < (n || []).length; r++) i.appendChild(n[r]);
            return i
        },
        m = function() {
            return {
                steps: [],
                padding: 3,
                container: document.body,
                next: "Next",
                done: "Done",
                prev: "Prev",
                preventScrolling: false
            }
        },
        w = function() {
            for (var t = this, e = 0; e < arguments.length; e++)
                for (var n = Object.keys(arguments[e]), i = 0; i < n.length; i++) t[n[i]] = arguments[e][n[i]]
        };
    return t
}(window.Tour || function(t) {
    this.init(t || {})
});