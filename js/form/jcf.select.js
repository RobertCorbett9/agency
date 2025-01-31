/*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.2.0
 */
jcf.addModule(function(e, t) {
    "use strict";

    function s(t) {
        this.options = e.extend({
            wrapNative: !0,
            wrapNativeOnMobile: !0,
            fakeDropInBody: !0,
            useCustomScroll: !0,
            flipDropToFit: !0,
            maxVisibleItems: 10,
            fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
            fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
            optionClassPrefix: "jcf-option-",
            selectClassPrefix: "jcf-select-",
            dropContentSelector: ".jcf-select-drop-content",
            selectTextSelector: ".jcf-select-text",
            dropActiveClass: "jcf-drop-active",
            flipDropClass: "jcf-drop-flipped"
        }, t), this.init()
    }

    function i(t) {
        this.options = e.extend({
            wrapNative: !0,
            useCustomScroll: !0,
            fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
            selectClassPrefix: "jcf-select-",
            listHolder: ".jcf-list-wrapper"
        }, t), this.init()
    }

    function o(t) {
        this.options = e.extend({
            holder: null,
            maxVisibleItems: 10,
            selectOnClick: !0,
            useHoverClass: !1,
            useCustomScroll: !1,
            handleResize: !0,
            multipleSelectWithoutKey: !1,
            alwaysPreventMouseWheel: !1,
            indexAttribute: "data-index",
            cloneClassPrefix: "jcf-option-",
            containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
            containerSelector: ".jcf-list-content",
            captionClass: "jcf-optgroup-caption",
            disabledClass: "jcf-disabled",
            optionClass: "jcf-option",
            groupClass: "jcf-optgroup",
            hoverClass: "jcf-hover",
            selectedClass: "jcf-selected",
            scrollClass: "jcf-scroll-active"
        }, t), this.init()
    }
    var n = {
        name: "Select",
        selector: "select",
        options: {
            element: null,
            multipleCompactStyle: !1
        },
        plugins: {
            ListBox: i,
            ComboBox: s,
            SelectList: o
        },
        matchElement: function(e) {
            return e.is("select")
        },
        init: function() {
            this.element = e(this.options.element), this.createInstance()
        },
        isListBox: function() {
            return this.element.is("[size]:not([jcf-size]), [multiple]")
        },
        createInstance: function() {
            this.instance && this.instance.destroy(), this.isListBox() && !this.options.multipleCompactStyle ? this.instance = new i(this.options) : this.instance = new s(this.options)
        },
        refresh: function() {
            var e = this.isListBox() && this.instance instanceof s || !this.isListBox() && this.instance instanceof i;
            e ? this.createInstance() : this.instance.refresh()
        },
        destroy: function() {
            this.instance.destroy()
        }
    };
    e.extend(s.prototype, {
        init: function() {
            this.initStructure(), this.bindHandlers(), this.attachEvents(), this.refresh()
        },
        initStructure: function() {
            this.win = e(t), this.doc = e(document), this.realElement = e(this.options.element), this.fakeElement = e(this.options.fakeAreaStructure).insertAfter(this.realElement), this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector), this.selectText = e("<span></span>").appendTo(this.selectTextContainer), r(this.fakeElement), this.fakeElement.addClass(l(this.realElement.prop("className"), this.options.selectClassPrefix)), this.realElement.prop("multiple") && this.fakeElement.addClass("jcf-compact-multiple"), this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative && (this.options.wrapNative = !0), this.options.wrapNative ? this.realElement.prependTo(this.fakeElement).css({
                position: "absolute",
                height: "100%",
                width: "100%"
            }).addClass(this.options.resetAppearanceClass) : (this.realElement.addClass(this.options.hiddenClass), this.fakeElement.attr("title", this.realElement.attr("title")), this.fakeDropTarget = this.options.fakeDropInBody ? e("body") : this.fakeElement)
        },
        attachEvents: function() {
            var e = this;
            this.delayedRefresh = function() {
                setTimeout(function() {
                    e.refresh(), e.list && (e.list.refresh(), e.list.scrollToActiveOption())
                }, 1)
            }, this.options.wrapNative ? this.realElement.on({
                focus: this.onFocus,
                change: this.onChange,
                click: this.onChange,
                keydown: this.onChange
            }) : (this.realElement.on({
                focus: this.onFocus,
                change: this.onChange,
                keydown: this.onKeyDown
            }), this.fakeElement.on({
                "jcf-pointerdown": this.onSelectAreaPress
            }))
        },
        onKeyDown: function(e) {
            13 === e.which ? this.toggleDropdown() : this.dropActive && this.delayedRefresh()
        },
        onChange: function() {
            this.refresh()
        },
        onFocus: function() {
            this.pressedFlag && this.focusedFlag || (this.fakeElement.addClass(this.options.focusClass), this.realElement.on("blur", this.onBlur), this.toggleListMode(!0), this.focusedFlag = !0)
        },
        onBlur: function() {
            this.pressedFlag || (this.fakeElement.removeClass(this.options.focusClass), this.realElement.off("blur", this.onBlur), this.toggleListMode(!1), this.focusedFlag = !1)
        },
        onResize: function() {
            this.dropActive && this.hideDropdown()
        },
        onSelectDropPress: function() {
            this.pressedFlag = !0
        },
        onSelectDropRelease: function(e, t) {
            this.pressedFlag = !1, "mouse" === t.pointerType && this.realElement.focus()
        },
        onSelectAreaPress: function(t) {
            var s = !this.options.fakeDropInBody && e(t.target).closest(this.dropdown).length;
            s || t.button > 1 || this.realElement.is(":disabled") || (this.selectOpenedByEvent = t.pointerType, this.toggleDropdown(), this.focusedFlag || ("mouse" === t.pointerType ? this.realElement.focus() : this.onFocus(t)), this.pressedFlag = !0, this.fakeElement.addClass(this.options.pressedClass), this.doc.on("jcf-pointerup", this.onSelectAreaRelease))
        },
        onSelectAreaRelease: function(e) {
            this.focusedFlag && "mouse" === e.pointerType && this.realElement.focus(), this.pressedFlag = !1, this.fakeElement.removeClass(this.options.pressedClass), this.doc.off("jcf-pointerup", this.onSelectAreaRelease)
        },
        onOutsideClick: function(t) {
            var s = e(t.target),
                i = s.closest(this.fakeElement).length || s.closest(this.dropdown).length;
            i || this.hideDropdown()
        },
        onSelect: function() {
            this.refresh(), this.realElement.prop("multiple") ? this.repositionDropdown() : this.hideDropdown(), this.fireNativeEvent(this.realElement, "change")
        },
        toggleListMode: function(e) {
            this.options.wrapNative || (e ? this.realElement.attr({
                size: 4,
                "jcf-size": ""
            }) : this.options.wrapNative || this.realElement.removeAttr("size jcf-size"))
        },
        createDropdown: function() {
            this.dropdown && (this.list.destroy(), this.dropdown.remove()), this.dropdown = e(this.options.fakeDropStructure).appendTo(this.fakeDropTarget), this.dropdown.addClass(l(this.realElement.prop("className"), this.options.selectClassPrefix)), r(this.dropdown), this.realElement.prop("multiple") && this.dropdown.addClass("jcf-compact-multiple"), this.options.fakeDropInBody && this.dropdown.css({
                position: "absolute",
                top: -9999
            }), this.list = new o({
                useHoverClass: !0,
                handleResize: !1,
                alwaysPreventMouseWheel: !0,
                maxVisibleItems: this.options.maxVisibleItems,
                useCustomScroll: this.options.useCustomScroll,
                holder: this.dropdown.find(this.options.dropContentSelector),
                multipleSelectWithoutKey: this.realElement.prop("multiple"),
                element: this.realElement
            }), e(this.list).on({
                select: this.onSelect,
                press: this.onSelectDropPress,
                release: this.onSelectDropRelease
            })
        },
        repositionDropdown: function() {
            var e, t, s, i = this.fakeElement.offset(),
                o = this.fakeElement.outerWidth(),
                n = this.fakeElement.outerHeight(),
                l = this.dropdown.css("width", o).outerHeight(),
                r = this.win.scrollTop(),
                h = this.win.height(),
                a = !1;
            i.top + n + l > r + h && i.top - l > r && (a = !0), this.options.fakeDropInBody && (s = "static" !== this.fakeDropTarget.css("position") ? this.fakeDropTarget.offset().top : 0, this.options.flipDropToFit && a ? (t = i.left, e = i.top - l - s) : (t = i.left, e = i.top + n - s), this.dropdown.css({
                width: o,
                left: t,
                top: e
            })), this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && a)
        },
        showDropdown: function() {
            this.realElement.prop("options").length && (this.dropdown || this.createDropdown(), this.dropActive = !0, this.dropdown.appendTo(this.fakeDropTarget), this.fakeElement.addClass(this.options.dropActiveClass), this.refreshSelectedText(), this.repositionDropdown(), this.list.setScrollTop(this.savedScrollTop), this.list.refresh(), this.win.on("resize", this.onResize), this.doc.on("jcf-pointerdown", this.onOutsideClick))
        },
        hideDropdown: function() {
            this.dropdown && (this.savedScrollTop = this.list.getScrollTop(), this.fakeElement.removeClass(this.options.dropActiveClass + " " + this.options.flipDropClass), this.dropdown.removeClass(this.options.flipDropClass).detach(), this.doc.off("jcf-pointerdown", this.onOutsideClick), this.win.off("resize", this.onResize), this.dropActive = !1, "touch" === this.selectOpenedByEvent && this.onBlur())
        },
        toggleDropdown: function() {
            this.dropActive ? this.hideDropdown() : this.showDropdown()
        },
        refreshSelectedText: function() {
            var t, s = this.realElement.prop("selectedIndex"),
                i = this.realElement.prop("options")[s],
                o = i ? i.getAttribute("data-image") : null,
                n = "",
                r = this;
            this.realElement.prop("multiple") ? (e.each(this.realElement.prop("options"), function(e, t) {
                t.selected && (n += (n ? ", " : "") + t.innerHTML)
            }), n || (n = r.realElement.attr("placeholder") || ""), this.selectText.removeAttr("class").html(n)) : i ? (this.currentSelectedText !== i.innerHTML || this.currentSelectedImage !== o) && (t = l(i.className, this.options.optionClassPrefix), this.selectText.attr("class", t).html(i.innerHTML), o ? (this.selectImage || (this.selectImage = e("<img>").prependTo(this.selectTextContainer).hide()), this.selectImage.attr("src", o).show()) : this.selectImage && this.selectImage.hide(), this.currentSelectedText = i.innerHTML, this.currentSelectedImage = o) : (this.selectImage && this.selectImage.hide(), this.selectText.removeAttr("class").empty())
        },
        refresh: function() {
            "none" === this.realElement.prop("style").display ? this.fakeElement.hide() : this.fakeElement.show(), this.refreshSelectedText(), this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(":disabled"))
        },
        destroy: function() {
            this.options.wrapNative ? this.realElement.insertBefore(this.fakeElement).css({
                position: "",
                height: "",
                width: ""
            }).removeClass(this.options.resetAppearanceClass) : (this.realElement.removeClass(this.options.hiddenClass), this.realElement.is("[jcf-size]") && this.realElement.removeAttr("size jcf-size")), this.fakeElement.remove(), this.doc.off("jcf-pointerup", this.onSelectAreaRelease), this.realElement.off({
                focus: this.onFocus
            })
        }
    }), e.extend(i.prototype, {
        init: function() {
            this.bindHandlers(), this.initStructure(), this.attachEvents()
        },
        initStructure: function() {
            this.realElement = e(this.options.element), this.fakeElement = e(this.options.fakeStructure).insertAfter(this.realElement), this.listHolder = this.fakeElement.find(this.options.listHolder), r(this.fakeElement), this.fakeElement.addClass(l(this.realElement.prop("className"), this.options.selectClassPrefix)), this.realElement.addClass(this.options.hiddenClass), this.list = new o({
                useCustomScroll: this.options.useCustomScroll,
                holder: this.listHolder,
                selectOnClick: !1,
                element: this.realElement
            })
        },
        attachEvents: function() {
            var t = this;
            this.delayedRefresh = function(e) {
                e && 16 === e.which || (clearTimeout(t.refreshTimer), t.refreshTimer = setTimeout(function() {
                    t.refresh(), t.list.scrollToActiveOption()
                }, 1))
            }, this.realElement.on({
                focus: this.onFocus,
                click: this.delayedRefresh,
                keydown: this.delayedRefresh
            }), e(this.list).on({
                select: this.onSelect,
                press: this.onFakeOptionsPress,
                release: this.onFakeOptionsRelease
            })
        },
        onFakeOptionsPress: function(e, t) {
            this.pressedFlag = !0, "mouse" === t.pointerType && this.realElement.focus()
        },
        onFakeOptionsRelease: function(e, t) {
            this.pressedFlag = !1, "mouse" === t.pointerType && this.realElement.focus()
        },
        onSelect: function() {
            this.fireNativeEvent(this.realElement, "change"), this.fireNativeEvent(this.realElement, "click")
        },
        onFocus: function() {
            this.pressedFlag && this.focusedFlag || (this.fakeElement.addClass(this.options.focusClass), this.realElement.on("blur", this.onBlur), this.focusedFlag = !0)
        },
        onBlur: function() {
            this.pressedFlag || (this.fakeElement.removeClass(this.options.focusClass), this.realElement.off("blur", this.onBlur), this.focusedFlag = !1)
        },
        refresh: function() {
            this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(":disabled")), this.list.refresh()
        },
        destroy: function() {
            this.list.destroy(), this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass), this.fakeElement.remove()
        }
    }), e.extend(o.prototype, {
        init: function() {
            this.initStructure(), this.refreshSelectedClass(), this.attachEvents()
        },
        initStructure: function() {
            this.element = e(this.options.element), this.indexSelector = "[" + this.options.indexAttribute + "]", this.container = e(this.options.containerStructure).appendTo(this.options.holder), this.listHolder = this.container.find(this.options.containerSelector), this.lastClickedIndex = this.element.prop("selectedIndex"), this.rebuildList()
        },
        attachEvents: function() {
            this.bindHandlers(), this.listHolder.on("jcf-pointerdown", this.indexSelector, this.onItemPress), this.listHolder.on("jcf-pointerdown", this.onPress), this.options.useHoverClass && this.listHolder.on("jcf-pointerover", this.indexSelector, this.onHoverItem)
        },
        onPress: function(t) {
            e(this).trigger("press", t), this.listHolder.on("jcf-pointerup", this.onRelease)
        },
        onRelease: function(t) {
            e(this).trigger("release", t), this.listHolder.off("jcf-pointerup", this.onRelease)
        },
        onHoverItem: function(e) {
            var t = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
            this.fakeOptions.removeClass(this.options.hoverClass).eq(t).addClass(this.options.hoverClass)
        },
        onItemPress: function(e) {
            "touch" === e.pointerType || this.options.selectOnClick ? (this.tmpListOffsetTop = this.list.offset().top, this.listHolder.on("jcf-pointerup", this.indexSelector, this.onItemRelease)) : this.onSelectItem(e)
        },
        onItemRelease: function(e) {
            this.listHolder.off("jcf-pointerup", this.indexSelector, this.onItemRelease), this.tmpListOffsetTop === this.list.offset().top && this.listHolder.on("click", this.indexSelector, {
                savedPointerType: e.pointerType
            }, this.onSelectItem), delete this.tmpListOffsetTop
        },
        onSelectItem: function(t) {
            var s, i = parseFloat(t.currentTarget.getAttribute(this.options.indexAttribute)),
                o = t.data && t.data.savedPointerType || t.pointerType || "mouse";
            this.listHolder.off("click", this.indexSelector, this.onSelectItem), t.button > 1 || this.realOptions[i].disabled || (this.element.prop("multiple") ? t.metaKey || t.ctrlKey || "touch" === o || this.options.multipleSelectWithoutKey ? this.realOptions[i].selected = !this.realOptions[i].selected : t.shiftKey ? (s = [this.lastClickedIndex, i].sort(function(e, t) {
                return e - t
            }), this.realOptions.each(function(e, t) {
                t.selected = e >= s[0] && e <= s[1]
            })) : this.element.prop("selectedIndex", i) : this.element.prop("selectedIndex", i), t.shiftKey || (this.lastClickedIndex = i), this.refreshSelectedClass(), "mouse" === o && this.scrollToActiveOption(), e(this).trigger("select"))
        },
        rebuildList: function() {
            var t = this,
                s = this.element[0];
            this.storedSelectHTML = s.innerHTML, this.optionIndex = 0, this.list = e(this.createOptionsList(s)), this.listHolder.empty().append(this.list), this.realOptions = this.element.find("option"), this.fakeOptions = this.list.find(this.indexSelector), this.fakeListItems = this.list.find("." + this.options.captionClass + "," + this.indexSelector), delete this.optionIndex;
            var i = this.options.maxVisibleItems,
                o = this.element.prop("size");
            o > 1 && !this.element.is("[jcf-size]") && (i = o);
            var n = this.fakeOptions.length > i;
            return this.container.toggleClass(this.options.scrollClass, n), n && (this.listHolder.css({
                maxHeight: this.getOverflowHeight(i),
                overflow: "auto"
            }), this.options.useCustomScroll && jcf.modules.Scrollable) ? void jcf.replace(this.listHolder, "Scrollable", {
                handleResize: this.options.handleResize,
                alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
            }) : void(this.options.alwaysPreventMouseWheel && (this.preventWheelHandler = function(e) {
                var s = t.listHolder.scrollTop(),
                    i = t.listHolder.prop("scrollHeight") - t.listHolder.innerHeight();
                (0 >= s && e.deltaY < 0 || s >= i && e.deltaY > 0) && e.preventDefault()
            }, this.listHolder.on("jcf-mousewheel", this.preventWheelHandler)))
        },
        refreshSelectedClass: function() {
            var e, t = this,
                s = this.element.prop("multiple"),
                i = this.element.prop("selectedIndex");
            s ? this.realOptions.each(function(e, s) {
                t.fakeOptions.eq(e).toggleClass(t.options.selectedClass, !!s.selected)
            }) : (this.fakeOptions.removeClass(this.options.selectedClass + " " + this.options.hoverClass), e = this.fakeOptions.eq(i).addClass(this.options.selectedClass), this.options.useHoverClass && e.addClass(this.options.hoverClass))
        },
        scrollToActiveOption: function() {
            var e = this.getActiveOptionOffset();
            "number" == typeof e && this.listHolder.prop("scrollTop", e)
        },
        getSelectedIndexRange: function() {
            var e = -1,
                t = -1;
            return this.realOptions.each(function(s, i) {
                i.selected && (0 > e && (e = s), t = s)
            }), [e, t]
        },
        getChangedSelectedIndex: function() {
            var e, t = this.element.prop("selectedIndex");
            return this.element.prop("multiple") ? (this.previousRange || (this.previousRange = [t, t]), this.currentRange = this.getSelectedIndexRange(), e = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1], this.previousRange = this.currentRange, e) : t
        },
        getActiveOptionOffset: function() {
            var e = this.listHolder.height(),
                t = this.listHolder.prop("scrollTop"),
                s = this.getChangedSelectedIndex(),
                i = this.fakeOptions.eq(s),
                o = i.offset().top - this.list.offset().top,
                n = i.innerHeight();
            return o + n >= t + e ? o - e + n : t > o ? o : void 0
        },
        getOverflowHeight: function(e) {
            var t = this.fakeListItems.eq(e - 1),
                s = this.list.offset().top,
                i = t.offset().top,
                o = t.innerHeight();
            return i + o - s
        },
        getScrollTop: function() {
            return this.listHolder.scrollTop()
        },
        setScrollTop: function(e) {
            this.listHolder.scrollTop(e)
        },
        createOption: function(e) {
            var t = document.createElement("span");
            t.className = this.options.optionClass, t.innerHTML = e.innerHTML, t.setAttribute(this.options.indexAttribute, this.optionIndex++);
            var s, i = e.getAttribute("data-image");
            return i && (s = document.createElement("img"), s.src = i, t.insertBefore(s, t.childNodes[0])), e.disabled && (t.className += " " + this.options.disabledClass), e.className && (t.className += " " + l(e.className, this.options.cloneClassPrefix)), t
        },
        createOptGroup: function(e) {
            var t, s, i = document.createElement("span"),
                o = e.getAttribute("label");
            return t = document.createElement("span"), t.className = this.options.captionClass, t.innerHTML = o, i.appendChild(t), e.children.length && (s = this.createOptionsList(e), i.appendChild(s)), i.className = this.options.groupClass, i
        },
        createOptionContainer: function() {
            var e = document.createElement("li");
            return e
        },
        createOptionsList: function(t) {
            var s = this,
                i = document.createElement("ul");
            return e.each(t.children, function(e, t) {
                var o, n = s.createOptionContainer(t);
                switch (t.tagName.toLowerCase()) {
                    case "option":
                        o = s.createOption(t);
                        break;
                    case "optgroup":
                        o = s.createOptGroup(t)
                }
                i.appendChild(n).appendChild(o)
            }), i
        },
        refresh: function() {
            this.storedSelectHTML !== this.element.prop("innerHTML") && this.rebuildList();
            var e = jcf.getInstance(this.listHolder);
            e && e.refresh(), this.refreshSelectedClass()
        },
        destroy: function() {
            this.listHolder.off("jcf-mousewheel", this.preventWheelHandler), this.listHolder.off("jcf-pointerdown", this.indexSelector, this.onSelectItem), this.listHolder.off("jcf-pointerover", this.indexSelector, this.onHoverItem), this.listHolder.off("jcf-pointerdown", this.onPress)
        }
    });
    var l = function(e, t) {
            return e ? e.replace(/[\s]*([\S]+)+[\s]*/gi, t + "$1 ") : ""
        },
        r = function() {
            function e(e) {
                e.preventDefault()
            }
            var t = jcf.getOptions().unselectableClass;
            return function(s) {
                s.addClass(t).on("selectstart", e)
            }
        }();
    return n
});