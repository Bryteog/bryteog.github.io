var hljs = function() {
    "use strict";
    function m(e) {
        Object.freeze(e);
        var t = "function" == typeof e;
        return Object.getOwnPropertyNames(e).forEach(function(n) {
            !Object.hasOwnProperty.call(e, n) || null === e[n] || "object" != typeof e[n] && "function" != typeof e[n] || t && ("caller" === n || "callee" === n || "arguments" === n) || Object.isFrozen(e[n]) || m(e[n])
        }),
        e
    }
    class p {
        constructor(e) {
            void 0 === e.data && (e.data = {}),
            this.data = e.data
        }
        ignoreMatch() {
            this.ignore = !0
        }
    }
    function t(e) {
        return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
    }
    function e(t, ...n) {
        var e = {};
        for (const n in t)
            e[n] = t[n];
        return n.forEach(function(t) {
            for (const n in t)
                e[n] = t[n]
        }),
        e
    }
    function r(e) {
        return e.nodeName.toLowerCase()
    }
    v = Object.freeze({
        __proto__: null,
        escapeHTML: t,
        inherit: e,
        nodeStream: function(e) {
            var t = [];
            return function e(n, s) {
                for (var o = n.firstChild; o; o = o.nextSibling)
                    3 === o.nodeType ? s += o.nodeValue.length : 1 === o.nodeType && (t.push({
                        event: "start",
                        offset: s,
                        node: o
                    }),
                    s = e(o, s),
                    r(o).match(/br|hr|img|input/) || t.push({
                        event: "stop",
                        offset: s,
                        node: o
                    }));
                return s
            }(e, 0),
            t
        },
        mergeStreams: function(e, n, s) {
            var o, i = 0, a = "", c = [];
            function l() {
                return e.length && n.length ? e[0].offset !== n[0].offset ? e[0].offset < n[0].offset ? e : n : "start" === n[0].event ? e : n : e.length ? e : n
            }
            function d(e) {
                a += "<" + r(e) + [].map.call(e.attributes, function(e) {
                    return " " + e.nodeName + '="' + t(e.value) + '"'
                }).join("") + ">"
            }
            function u(e) {
                a += "</" + r(e) + ">"
            }
            function h(e) {
                ("start" === e.event ? d : u)(e.node)
            }
            for (; e.length || n.length; )
                if (o = l(),
                a += t(s.substring(i, o[0].offset)),
                i = o[0].offset,
                o === e) {
                    c.reverse().forEach(u);
                    do
                        h(o.splice(0, 1)[0]),
                        o = l();
                    while (o === e && o.length && o[0].offset === i)c.reverse().forEach(d)
                } else
                    "start" === o[0].event ? c.push(o[0].node) : c.pop(),
                    h(o.splice(0, 1)[0]);
            return a + t(s.substr(i))
        }
    });
    const _ = "</span>"
      , c = e=>!!e.kind;
    class A {
        constructor(e, t) {
            this.buffer = "",
            this.classPrefix = t.classPrefix,
            e.walk(this)
        }
        addText(e) {
            this.buffer += t(e)
        }
        openNode(e) {
            if (!c(e))
                return;
            let t = e.kind;
            e.sublanguage || (t = `${this.classPrefix}${t}`),
            this.span(t)
        }
        closeNode(e) {
            c(e) && (this.buffer += _)
        }
        value() {
            return this.buffer
        }
        span(e) {
            this.buffer += `<span class="${e}">`
        }
    }
    class l {
        constructor() {
            this.rootNode = {
                children: []
            },
            this.stack = [this.rootNode]
        }
        get top() {
            return this.stack[this.stack.length - 1]
        }
        get root() {
            return this.rootNode
        }
        add(e) {
            this.top.children.push(e)
        }
        openNode(e) {
            const t = {
                kind: e,
                children: []
            };
            this.add(t),
            this.stack.push(t)
        }
        closeNode() {
            if (this.stack.length > 1)
                return this.stack.pop()
        }
        closeAllNodes() {
            for (; this.closeNode(); )
                ;
        }
        toJSON() {
            return JSON.stringify(this.rootNode, null, 4)
        }
        walk(e) {
            return this.constructor._walk(e, this.rootNode)
        }
        static _walk(e, t) {
            return "string" == typeof t ? e.addText(t) : t.children && (e.openNode(t),
            t.children.forEach(t=>this._walk(e, t)),
            e.closeNode(t)),
            e
        }
        static _collapse(e) {
            "string" != typeof e && e.children && (e.children.every(e=>"string" == typeof e) ? e.children = [e.children.join("")] : e.children.forEach(e=>{
                l._collapse(e)
            }
            ))
        }
    }
    class M extends l {
        constructor(e) {
            super(),
            this.options = e
        }
        addKeyword(e, t) {
            "" !== e && (this.openNode(t),
            this.addText(e),
            this.closeNode())
        }
        addText(e) {
            "" !== e && this.add(e)
        }
        addSublanguage(e, t) {
            const n = e.root;
            n.kind = t,
            n.sublanguage = !0,
            this.add(n)
        }
        toHTML() {
            return new A(this,this.options).value()
        }
        finalize() {
            return !0
        }
    }
    function s(e) {
        return e ? "string" == typeof e ? e : e.source : null
    }
    const h = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)"
      , n = {
        begin: "\\\\[\\s\\S]",
        relevance: 0
    }
      , k = {
        className: "string",
        begin: "'",
        end: "'",
        illegal: `\\n`,
        contains: [n]
    }
      , E = {
        className: "string",
        begin: '"',
        end: '"',
        illegal: `\\n`,
        contains: [n]
    }
      , g = {
        begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
    }
      , i = function(t, n, s={}) {
        var o = e({
            className: "comment",
            begin: t,
            end: n,
            contains: []
        }, s);
        return o.contains.push(g),
        o.contains.push({
            className: "doctag",
            begin: "(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",
            relevance: 0
        }),
        o
    }
      , j = i("//", "$")
      , b = i("/\\*", "\\*/")
      , y = i("#", "$");
    var v, o = Object.freeze({
        __proto__: null,
        IDENT_RE: "[a-zA-Z]\\w*",
        UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
        NUMBER_RE: "\\b\\d+(\\.\\d+)?",
        C_NUMBER_RE: h,
        BINARY_NUMBER_RE: "\\b(0b[01]+)",
        RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
        SHEBANG: (t={})=>{
            const n = /^#![ ]*\//;
            return t.binary && (t.begin = function(...e) {
                return e.map(e=>s(e)).join("")
            }(n, /.*\b/, t.binary, /\b.*/)),
            e({
                className: "meta",
                begin: n,
                end: /$/,
                relevance: 0,
                "on:begin": (e,t)=>{
                    0 !== e.index && t.ignoreMatch()
                }
            }, t)
        }
        ,
        BACKSLASH_ESCAPE: n,
        APOS_STRING_MODE: k,
        QUOTE_STRING_MODE: E,
        PHRASAL_WORDS_MODE: g,
        COMMENT: i,
        C_LINE_COMMENT_MODE: j,
        C_BLOCK_COMMENT_MODE: b,
        HASH_COMMENT_MODE: y,
        NUMBER_MODE: {
            className: "number",
            begin: "\\b\\d+(\\.\\d+)?",
            relevance: 0
        },
        C_NUMBER_MODE: {
            className: "number",
            begin: h,
            relevance: 0
        },
        BINARY_NUMBER_MODE: {
            className: "number",
            begin: "\\b(0b[01]+)",
            relevance: 0
        },
        CSS_NUMBER_MODE: {
            className: "number",
            begin: "\\b\\d+(\\.\\d+)?(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
            relevance: 0
        },
        REGEXP_MODE: {
            begin: /(?=\/[^/\n]*\/)/,
            contains: [{
                className: "regexp",
                begin: /\//,
                end: /\/[gimuy]*/,
                illegal: /\n/,
                contains: [n, {
                    begin: /\[/,
                    end: /\]/,
                    relevance: 0,
                    contains: [n]
                }]
            }]
        },
        TITLE_MODE: {
            className: "title",
            begin: "[a-zA-Z]\\w*",
            relevance: 0
        },
        UNDERSCORE_TITLE_MODE: {
            className: "title",
            begin: "[a-zA-Z_]\\w*",
            relevance: 0
        },
        METHOD_GUARD: {
            begin: "\\.\\s*[a-zA-Z_]\\w*",
            relevance: 0
        },
        END_SAME_AS_BEGIN: function(e) {
            return Object.assign(e, {
                "on:begin": (e,t)=>{
                    t.data._beginMatch = e[1]
                }
                ,
                "on:end": (e,t)=>{
                    t.data._beginMatch !== e[1] && t.ignoreMatch()
                }
            })
        }
    }), w = "of and for in not or if then".split(" ");
    function O(e, t) {
        return t ? +t : function(e) {
            return w.includes(e.toLowerCase())
        }(e) ? 0 : 1
    }
    const x = {
        props: ["language", "code", "autodetect"],
        data: function() {
            return {
                detectedLanguage: "",
                unknownLanguage: !1
            }
        },
        computed: {
            className() {
                return this.unknownLanguage ? "" : "hljs " + this.detectedLanguage
            },
            highlighted() {
                if (!this.autoDetect && !hljs.getLanguage(this.language))
                    return console.warn(`The language "${this.language}" you specified could not be found.`),
                    this.unknownLanguage = !0,
                    t(this.code);
                let e;
                return this.autoDetect ? (e = hljs.highlightAuto(this.code),
                this.detectedLanguage = e.language) : (e = hljs.highlight(this.language, this.code, this.ignoreIllegals),
                this.detectectLanguage = this.language),
                e.value
            },
            autoDetect() {
                return !this.language || !(e = this.autodetect,
                !e && "" !== e);
                var e
            },
            ignoreIllegals: ()=>!0
        },
        render(e) {
            return e("pre", {}, [e("code", {
                class: this.className,
                domProps: {
                    innerHTML: this.highlighted
                }
            })])
        }
    }
      , C = {
        install(e) {
            e.component("highlightjs", x)
        }
    }
      , a = t
      , f = e
      , {nodeStream: u, mergeStreams: S} = v
      , d = Symbol("nomatch");
    return function(t) {
        var n, T = [], r = Object.create(null), v = Object.create(null), F = [], c = !0, z = /(^(<[^>]+>|\t|)+|\n)/gm, E = "Could not find the language '{}', did you forget to load/include a language module?";
        const _ = {
            disableAutodetect: !0,
            name: "Plain text",
            contains: []
        };
        n = {
            noHighlightRe: /^(no-?highlight)$/i,
            languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
            classPrefix: "hljs-",
            tabReplace: null,
            useBR: !1,
            languages: null,
            __emitter: M
        };
        function y(e) {
            return n.noHighlightRe.test(e)
        }
        function j(e, t, n, s) {
            var i, o = {
                code: t,
                language: e
            };
            return l("before:highlight", o),
            i = o.result ? o.result : g(o.language, o.code, n, s),
            i.code = o.code,
            l("after:highlight", i),
            i
        }
        function g(t, o, l, u) {
            v = o;
            function D(e, t) {
                var n = _.case_insensitive ? t[0].toLowerCase() : t[0];
                return Object.prototype.hasOwnProperty.call(e.keywords, n) && e.keywords[n]
            }
            function C() {
                null != h.subLanguage ? function() {
                    if ("" !== m) {
                        var e = null;
                        if ("string" == typeof h.subLanguage) {
                            if (!r[h.subLanguage])
                                return void f.addText(m);
                            e = g(h.subLanguage, m, !0, M[h.subLanguage]),
                            M[h.subLanguage] = e.top
                        } else
                            e = b(m, h.subLanguage.length ? h.subLanguage : null);
                        h.relevance > 0 && (w += e.relevance),
                        f.addSublanguage(e.emitter, e.language)
                    }
                }() : function() {
                    if (!h.keywords)
                        return void f.addText(m);
                    let n = 0;
                    h.keywordPatternRe.lastIndex = 0;
                    let e = h.keywordPatternRe.exec(m)
                      , t = "";
                    for (; e; ) {
                        t += m.substring(n, e.index);
                        const s = D(h, e);
                        if (s) {
                            const [n,o] = s;
                            f.addText(t),
                            t = "",
                            w += o,
                            f.addKeyword(e[0], n)
                        } else
                            t += e[0];
                        n = h.keywordPatternRe.lastIndex,
                        e = h.keywordPatternRe.exec(m)
                    }
                    t += m.substr(n),
                    f.addText(t)
                }(),
                m = ""
            }
            function S(e) {
                return e.className && f.openNode(e.className),
                h = Object.create(e, {
                    parent: {
                        value: h
                    }
                })
            }
            function T(e) {
                return 0 === h.matcher.regexIndex ? (m += e[0],
                1) : (x = !0,
                0)
            }
            y = {};
            function F(e, n) {
                var o, s = n && n[0];
                if (m += e,
                s == null)
                    return C(),
                    0;
                if ("begin" === y.type && "end" === n.type && y.index === n.index && "" === s) {
                    if (m += v.slice(n.index, n.index + 1),
                    !c) {
                        const e = Error("0 width match regex");
                        throw e.languageName = t,
                        e.badRule = y.rule,
                        e
                    }
                    return 1
                }
                if (y = n,
                "begin" === n.type)
                    return function(e) {
                        var n = e[0]
                          , t = e.rule;
                        const s = new p(t)
                          , o = [t.__beforeBegin, t["on:begin"]];
                        for (const t of o)
                            if (t && (t(e, s),
                            s.ignore))
                                return T(n);
                        return t && t.endSameAsBegin && (t.endRe = RegExp(n.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "m")),
                        t.skip ? m += n : (t.excludeBegin && (m += n),
                        C(),
                        t.returnBegin || t.excludeBegin || (m = n)),
                        S(t),
                        t.returnBegin ? 0 : n.length
                    }(n);
                if ("illegal" === n.type && !l) {
                    const e = Error('Illegal lexeme "' + s + '" for mode "' + (h.className || "<unnamed>") + '"');
                    throw e.mode = h,
                    e
                }
                if ("end" === n.type && (o = function(e) {
                    var n, s = e[0], o = v.substr(e.index), t = function e(t, n, s) {
                        let o = function(e, t) {
                            var n = e && e.exec(t);
                            return n && 0 === n.index
                        }(t.endRe, s);
                        if (o) {
                            if (t["on:end"]) {
                                const e = new p(t);
                                t["on:end"](n, e),
                                e.ignore && (o = !1)
                            }
                            if (o) {
                                for (; t.endsParent && t.parent; )
                                    t = t.parent;
                                return t
                            }
                        }
                        if (t.endsWithParent)
                            return e(t.parent, n, s)
                    }(h, e, o);
                    if (!t)
                        return d;
                    n = h,
                    n.skip ? m += s : (n.returnEnd || n.excludeEnd || (m += s),
                    C(),
                    n.excludeEnd && (m = s));
                    do
                        h.className && f.closeNode(),
                        h.skip || h.subLanguage || (w += h.relevance),
                        h = h.parent;
                    while (h !== t.parent)return t.starts && (t.endSameAsBegin && (t.starts.endRe = t.endRe),
                    S(t.starts)),
                    n.returnEnd ? 0 : s.length
                }(n),
                o !== d))
                    return o;
                if ("illegal" === n.type && "" === s)
                    return 1;
                if (k > 1e5 && k > 3 * n.index)
                    throw Error("potential infinite loop, way more iterations than matches");
                return m += s,
                s.length
            }
            if (_ = i(t),
            !_)
                throw console.error(E.replace("{}", t)),
                Error('Unknown language: "' + t + '"');
            var v, y, _, z = function(t) {
                function n(e, n) {
                    return RegExp(s(e), "m" + (t.case_insensitive ? "i" : "") + (n ? "g" : ""))
                }
                class o {
                    constructor() {
                        this.matchIndexes = {},
                        this.regexes = [],
                        this.matchAt = 1,
                        this.position = 0
                    }
                    addRule(e, t) {
                        t.position = this.position++,
                        this.matchIndexes[this.matchAt] = t,
                        this.regexes.push([t, e]),
                        this.matchAt += function(e) {
                            return RegExp(e.toString() + "|").exec("").length - 1
                        }(e) + 1
                    }
                    compile() {
                        0 === this.regexes.length && (this.exec = ()=>null);
                        const e = this.regexes.map(e=>e[1]);
                        this.matcherRe = n(function(e, t="|") {
                            for (var n, i, c, l = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./, r = 0, o = "", a = 0; a < e.length; a++) {
                                c = r += 1,
                                i = s(e[a]);
                                for (a > 0 && (o += t),
                                o += "("; i.length > 0; ) {
                                    if (n = l.exec(i),
                                    n == null) {
                                        o += i;
                                        break
                                    }
                                    o += i.substring(0, n.index),
                                    i = i.substring(n.index + n[0].length),
                                    "\\" === n[0][0] && n[1] ? o += "\\" + (+n[1] + c) : (o += n[0],
                                    "(" === n[0] && r++)
                                }
                                o += ")"
                            }
                            return o
                        }(e), !0),
                        this.lastIndex = 0
                    }
                    exec(e) {
                        this.matcherRe.lastIndex = this.lastIndex;
                        const t = this.matcherRe.exec(e);
                        if (!t)
                            return null;
                        const n = t.findIndex((e,t)=>t > 0 && void 0 !== e)
                          , s = this.matchIndexes[n];
                        return t.splice(0, n),
                        Object.assign(t, s)
                    }
                }
                class i {
                    constructor() {
                        this.rules = [],
                        this.multiRegexes = [],
                        this.count = 0,
                        this.lastIndex = 0,
                        this.regexIndex = 0
                    }
                    getMatcher(e) {
                        if (this.multiRegexes[e])
                            return this.multiRegexes[e];
                        const t = new o;
                        return this.rules.slice(e).forEach(([e,n])=>t.addRule(e, n)),
                        t.compile(),
                        this.multiRegexes[e] = t,
                        t
                    }
                    resumingScanAtSamePosition() {
                        return 0 !== this.regexIndex
                    }
                    considerAll() {
                        this.regexIndex = 0
                    }
                    addRule(e, t) {
                        this.rules.push([e, t]),
                        "begin" === t.type && this.count++
                    }
                    exec(e) {
                        const n = this.getMatcher(this.regexIndex);
                        n.lastIndex = this.lastIndex;
                        let t = n.exec(e);
                        if (this.resumingScanAtSamePosition())
                            if (t && t.index === this.lastIndex)
                                ;
                            else {
                                const n = this.getMatcher(0);
                                n.lastIndex = this.lastIndex + 1,
                                t = n.exec(e)
                            }
                        return t && (this.regexIndex += t.position + 1,
                        this.regexIndex === this.count && this.considerAll()),
                        t
                    }
                }
                function a(e, t) {
                    const n = e.input[e.index - 1]
                      , s = e.input[e.index + e[0].length];
                    "." !== n && "." !== s || t.ignoreMatch()
                }
                if (t.contains && t.contains.includes("self"))
                    throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
                return function o(r, c) {
                    const l = r;
                    if (r.compiled)
                        return l;
                    r.compiled = !0,
                    r.__beforeBegin = null,
                    r.keywords = r.keywords || r.beginKeywords;
                    let d = null;
                    if ("object" == typeof r.keywords && (d = r.keywords.$pattern,
                    delete r.keywords.$pattern),
                    r.keywords && (r.keywords = function(e, t) {
                        var n = {};
                        return "string" == typeof e ? s("keyword", e) : Object.keys(e).forEach(function(t) {
                            s(t, e[t])
                        }),
                        n;
                        function s(e, s) {
                            t && (s = s.toLowerCase()),
                            s.split(" ").forEach(function(t) {
                                var s = t.split("|");
                                n[s[0]] = [e, O(s[0], s[1])]
                            })
                        }
                    }(r.keywords, t.case_insensitive)),
                    r.lexemes && d)
                        throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ");
                    return l.keywordPatternRe = n(r.lexemes || d || /\w+/, !0),
                    c && (r.beginKeywords && (r.begin = "\\b(" + r.beginKeywords.split(" ").join("|") + ")(?=\\b|\\s)",
                    r.__beforeBegin = a),
                    r.begin || (r.begin = /\B|\b/),
                    l.beginRe = n(r.begin),
                    r.endSameAsBegin && (r.end = r.begin),
                    r.end || r.endsWithParent || (r.end = /\B|\b/),
                    r.end && (l.endRe = n(r.end)),
                    l.terminator_end = s(r.end) || "",
                    r.endsWithParent && c.terminator_end && (l.terminator_end += (r.end ? "|" : "") + c.terminator_end)),
                    r.illegal && (l.illegalRe = n(r.illegal)),
                    void 0 === r.relevance && (r.relevance = 1),
                    r.contains || (r.contains = []),
                    r.contains = [].concat(...r.contains.map(function(t) {
                        return function(t) {
                            return t.variants && !t.cached_variants && (t.cached_variants = t.variants.map(function(n) {
                                return e(t, {
                                    variants: null
                                }, n)
                            })),
                            t.cached_variants ? t.cached_variants : function e(t) {
                                return !!t && (t.endsWithParent || e(t.starts))
                            }(t) ? e(t, {
                                starts: t.starts ? e(t.starts) : null
                            }) : Object.isFrozen(t) ? e(t) : t
                        }("self" === t ? r : t)
                    })),
                    r.contains.forEach(function(e) {
                        o(e, l)
                    }),
                    r.starts && o(r.starts, c),
                    l.matcher = function(e) {
                        const t = new i;
                        return e.contains.forEach(e=>t.addRule(e.begin, {
                            rule: e,
                            type: "begin"
                        })),
                        e.terminator_end && t.addRule(e.terminator_end, {
                            type: "end"
                        }),
                        e.illegal && t.addRule(e.illegal, {
                            type: "illegal"
                        }),
                        t
                    }(l),
                    l
                }(t)
            }(_), A = "", h = u || z, M = {}, f = new n.__emitter(n);
            !function() {
                for (var t = [], e = h; e !== _; e = e.parent)
                    e.className && t.unshift(e.className);
                t.forEach(e=>f.openNode(e))
            }();
            var m = ""
              , w = 0
              , j = 0
              , k = 0
              , x = !1;
            try {
                for (h.matcher.considerAll(); ; ) {
                    k++,
                    x ? x = !1 : h.matcher.considerAll(),
                    h.matcher.lastIndex = j;
                    const e = h.matcher.exec(v);
                    if (!e)
                        break;
                    const t = F(v.substring(j, e.index), e);
                    j = e.index + t
                }
                return F(v.substr(j)),
                f.closeAllNodes(),
                f.finalize(),
                A = f.toHTML(),
                {
                    relevance: w,
                    value: A,
                    language: t,
                    illegal: !1,
                    emitter: f,
                    top: h
                }
            } catch (e) {
                if (e.message && e.message.includes("Illegal"))
                    return {
                        illegal: !0,
                        illegalBy: {
                            msg: e.message,
                            context: v.slice(j - 100, j + 100),
                            mode: e.mode
                        },
                        sofar: A,
                        relevance: 0,
                        value: a(v),
                        emitter: f
                    };
                if (c)
                    return {
                        illegal: !1,
                        relevance: 0,
                        value: a(v),
                        emitter: f,
                        language: t,
                        top: h,
                        errorRaised: e
                    };
                throw e
            }
        }
        function b(e, t) {
            t = t || n.languages || Object.keys(r);
            var s = function(e) {
                const t = {
                    relevance: 0,
                    emitter: new n.__emitter(n),
                    value: a(e),
                    illegal: !1,
                    top: _
                };
                return t.emitter.addText(e),
                t
            }(e)
              , o = s;
            return t.filter(i).filter(A).forEach(function(t) {
                var n = g(t, e, !1);
                n.language = t,
                n.relevance > o.relevance && (o = n),
                n.relevance > s.relevance && (o = s,
                s = n)
            }),
            o.language && (s.second_best = o),
            s
        }
        function w(e) {
            return n.tabReplace || n.useBR ? e.replace(z, e=>`
` === e ? n.useBR ? "<br>" : e : n.tabReplace ? e.replace(/\t/g, n.tabReplace) : e) : e
        }
        function x(e) {
            let o = null;
            const s = function(e) {
                var o, s = e.className + " ";
                s += e.parentNode ? e.parentNode.className : "";
                const t = n.languageDetectRe.exec(s);
                return t ? (o = i(t[1]),
                o || (console.warn(E.replace("{}", t[1])),
                console.warn("Falling back to no-highlight mode for this block.", e)),
                o ? t[1] : "no-highlight") : s.split(/\s+/).find(e=>y(e) || i(e))
            }(e);
            if (y(s))
                return;
            l("before:highlightBlock", {
                block: e,
                language: s
            }),
            n.useBR ? (o = document.createElement("div")).innerHTML = e.innerHTML.replace(/\n/g, "").replace(/<br[ /]*>/g, `
`) : o = e;
            const a = o.textContent
              , t = s ? j(s, a, !0) : b(a)
              , r = u(o);
            if (r.length) {
                const e = document.createElement("div");
                e.innerHTML = t.value,
                t.value = S(r, u(e), a)
            }
            t.value = w(t.value),
            l("after:highlightBlock", {
                block: e,
                result: t
            }),
            e.innerHTML = t.value,
            e.className = function(e, t, n) {
                var o = t ? v[t] : n
                  , s = [e.trim()];
                return e.match(/\bhljs\b/) || s.push("hljs"),
                e.includes(o) || s.push(o),
                s.join(" ").trim()
            }(e.className, s, t.language),
            e.result = {
                language: t.language,
                re: t.relevance,
                relavance: t.relevance
            },
            t.second_best && (e.second_best = {
                language: t.second_best.language,
                re: t.second_best.relevance,
                relavance: t.second_best.relevance
            })
        }
        const h = ()=>{
            if (!h.called) {
                h.called = !0;
                var e = document.querySelectorAll("pre code");
                T.forEach.call(e, x)
            }
        }
        ;
        function i(e) {
            return e = (e || "").toLowerCase(),
            r[e] || r[v[e]]
        }
        function k(e, {languageName: t}) {
            "string" == typeof e && (e = [e]),
            e.forEach(e=>{
                v[e] = t
            }
            )
        }
        function A(e) {
            var t = i(e);
            return t && !t.disableAutodetect
        }
        function l(e, t) {
            var n = e;
            F.forEach(function(e) {
                e[n] && e[n](t)
            })
        }
        Object.assign(t, {
            highlight: j,
            highlightAuto: b,
            fixMarkup: function(e) {
                return console.warn("fixMarkup is deprecated and will be removed entirely in v11.0"),
                console.warn("Please see https://github.com/highlightjs/highlight.js/issues/2534"),
                w(e)
            },
            highlightBlock: x,
            configure: function(e) {
                n = f(n, e)
            },
            initHighlighting: h,
            initHighlightingOnLoad: function() {
                window.addEventListener("DOMContentLoaded", h, !1)
            },
            registerLanguage: function(e, n) {
                var s = null;
                try {
                    s = n(t)
                } catch (t) {
                    if (console.error("Language definition for '{}' could not be registered.".replace("{}", e)),
                    !c)
                        throw t;
                    console.error(t),
                    s = _
                }
                s.name || (s.name = e),
                r[e] = s,
                s.rawDefinition = n.bind(null, t),
                s.aliases && k(s.aliases, {
                    languageName: e
                })
            },
            listLanguages: function() {
                return Object.keys(r)
            },
            getLanguage: i,
            registerAliases: k,
            requireLanguage: function(e) {
                var t = i(e);
                if (t)
                    return t;
                throw Error("The '{}' language is required, but not loaded.".replace("{}", e))
            },
            autoDetection: A,
            inherit: f,
            addPlugin: function(e) {
                F.push(e)
            },
            vuePlugin: C
        }),
        t.debugMode = function() {
            c = !1
        }
        ,
        t.safeMode = function() {
            c = !0
        }
        ,
        t.versionString = "10.2.1";
        for (const e in o)
            "object" == typeof o[e] && m(o[e]);
        return Object.assign(t, o),
        t
    }({})
}();
"object" == typeof exports && "undefined" != typeof module && (module.exports = hljs),
hljs.registerLanguage("apache", function() {
    "use strict";
    return function(e) {
        var t = {
            className: "number",
            begin: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?"
        };
        return {
            name: "Apache config",
            aliases: ["apacheconf"],
            case_insensitive: !0,
            contains: [e.HASH_COMMENT_MODE, {
                className: "section",
                begin: "</?",
                end: ">",
                contains: [t, {
                    className: "number",
                    begin: ":\\d{1,5}"
                }, e.inherit(e.QUOTE_STRING_MODE, {
                    relevance: 0
                })]
            }, {
                className: "attribute",
                begin: /\w+/,
                relevance: 0,
                keywords: {
                    nomarkup: "order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"
                },
                starts: {
                    end: /$/,
                    relevance: 0,
                    keywords: {
                        literal: "on off all deny allow"
                    },
                    contains: [{
                        className: "meta",
                        begin: "\\s\\[",
                        end: "\\]$"
                    }, {
                        className: "variable",
                        begin: "[\\$%]\\{",
                        end: "\\}",
                        contains: ["self", {
                            className: "number",
                            begin: "[\\$%]\\d+"
                        }]
                    }, t, {
                        className: "number",
                        begin: "\\d+"
                    }, e.QUOTE_STRING_MODE]
                }
            }],
            illegal: /\S/
        }
    }
}()),
hljs.registerLanguage("bash", function() {
    "use strict";
    return function(e) {
        const t = {};
        Object.assign(t, {
            className: "variable",
            variants: [{
                begin: /\$[\w\d#@][\w\d_]*/
            }, {
                begin: /\$\{/,
                end: /\}/,
                contains: [{
                    begin: /:-/,
                    contains: [t]
                }]
            }]
        });
        const n = {
            className: "subst",
            begin: /\$\(/,
            end: /\)/,
            contains: [e.BACKSLASH_ESCAPE]
        }
          , s = {
            className: "string",
            begin: /"/,
            end: /"/,
            contains: [e.BACKSLASH_ESCAPE, t, n]
        };
        n.contains.push(s);
        const o = {
            begin: /\$\(\(/,
            end: /\)\)/,
            contains: [{
                begin: /\d+#[0-9a-f]+/,
                className: "number"
            }, e.NUMBER_MODE, t]
        }
          , i = e.SHEBANG({
            binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
            relevance: 10
        })
          , a = {
            className: "function",
            begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
            returnBegin: !0,
            contains: [e.inherit(e.TITLE_MODE, {
                begin: /\w[\w\d_]*/
            })],
            relevance: 0
        };
        return {
            name: "Bash",
            aliases: ["sh", "zsh"],
            keywords: {
                $pattern: /\b-?[a-z._-]+\b/,
                keyword: "if then else elif fi for while in do done case esac function",
                literal: "true false",
                built_in: "break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp",
                _: "-ne -eq -lt -gt -f -d -e -s -l -a"
            },
            contains: [i, e.SHEBANG(), a, o, e.HASH_COMMENT_MODE, s, {
                className: "",
                begin: /\\"/
            }, {
                className: "string",
                begin: /'/,
                end: /'/
            }, t]
        }
    }
}()),
hljs.registerLanguage("c-like", function() {
    "use strict";
    return function(e) {
        function o(e) {
            return "(?:" + e + ")?"
        }
        var l = "(decltype\\(auto\\)|" + o("[a-zA-Z_]\\w*::") + "[a-zA-Z_]\\w*" + o("<.*?>") + ")"
          , n = {
            className: "keyword",
            begin: "\\b[a-z\\d_]*_t\\b"
        }
          , s = {
            className: "string",
            variants: [{
                begin: '(u8?|U|L)?"',
                end: '"',
                illegal: `\\n`,
                contains: [e.BACKSLASH_ESCAPE]
            }, {
                begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                end: "'",
                illegal: "."
            }, e.END_SAME_AS_BEGIN({
                begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,
                end: /\)([^()\\ ]{0,16})"/
            })]
        }
          , i = {
            className: "number",
            variants: [{
                begin: "\\b(0b[01']+)"
            }, {
                begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
            }, {
                begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
            }],
            relevance: 0
        }
          , a = {
            className: "meta",
            begin: /#\s*[a-z]+\b/,
            end: /$/,
            keywords: {
                "meta-keyword": "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
            },
            contains: [{
                begin: /\\\n/,
                relevance: 0
            }, e.inherit(s, {
                className: "meta-string"
            }), {
                className: "meta-string",
                begin: /<.*?>/,
                end: /$/,
                illegal: `\\n`
            }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
        }
          , d = {
            className: "title",
            begin: o("[a-zA-Z_]\\w*::") + e.IDENT_RE,
            relevance: 0
        }
          , c = o("[a-zA-Z_]\\w*::") + e.IDENT_RE + "\\s*\\("
          , t = {
            keyword: "int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
            built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
            literal: "true false nullptr NULL"
        }
          , r = [n, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, i, s]
          , u = {
            variants: [{
                begin: /=/,
                end: /;/
            }, {
                begin: /\(/,
                end: /\)/
            }, {
                beginKeywords: "new throw return else",
                end: /;/
            }],
            keywords: t,
            contains: r.concat([{
                begin: /\(/,
                end: /\)/,
                keywords: t,
                contains: r.concat(["self"]),
                relevance: 0
            }]),
            relevance: 0
        }
          , h = {
            className: "function",
            begin: "(" + l + "[\\*&\\s]+)+" + c,
            returnBegin: !0,
            end: /[{;=]/,
            excludeEnd: !0,
            keywords: t,
            illegal: /[^\w\s*&:<>]/,
            contains: [{
                begin: "decltype\\(auto\\)",
                keywords: t,
                relevance: 0
            }, {
                begin: c,
                returnBegin: !0,
                contains: [d],
                relevance: 0
            }, {
                className: "params",
                begin: /\(/,
                end: /\)/,
                keywords: t,
                relevance: 0,
                contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, s, i, n, {
                    begin: /\(/,
                    end: /\)/,
                    keywords: t,
                    relevance: 0,
                    contains: ["self", e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, s, i, n]
                }]
            }, n, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, a]
        };
        return {
            aliases: ["c", "cc", "h", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
            keywords: t,
            disableAutodetect: !0,
            illegal: "</",
            contains: [].concat(u, h, r, [a, {
                begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
                end: ">",
                keywords: t,
                contains: ["self", n]
            }, {
                begin: e.IDENT_RE + "::",
                keywords: t
            }, {
                className: "class",
                beginKeywords: "class struct",
                end: /[{;:]/,
                contains: [{
                    begin: /</,
                    end: />/,
                    contains: ["self"]
                }, e.TITLE_MODE]
            }]),
            exports: {
                preprocessor: a,
                strings: s,
                keywords: t
            }
        }
    }
}()),
hljs.registerLanguage("c", function() {
    "use strict";
    return function(e) {
        var t = e.requireLanguage("c-like").rawDefinition();
        return t.name = "C",
        t.aliases = ["c", "h"],
        t
    }
}()),
hljs.registerLanguage("coffeescript", function() {
    "use strict";
    const e = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"]
      , t = ["true", "false", "null", "undefined", "NaN", "Infinity"]
      , n = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);
    return function(s) {
        var a, l, r = {
            keyword: e.concat(["then", "unless", "until", "loop", "by", "when", "and", "or", "is", "isnt", "not"]).filter((e=>t=>!e.includes(t))(["var", "const", "let", "function", "static"])).join(" "),
            literal: t.concat(["yes", "no", "on", "off"]).join(" "),
            built_in: n.concat(["npm", "print"]).join(" ")
        }, o = "[A-Za-z$_][0-9A-Za-z$_]*", i = {
            className: "subst",
            begin: /#\{/,
            end: /}/,
            keywords: r
        }, c = [s.BINARY_NUMBER_MODE, s.inherit(s.C_NUMBER_MODE, {
            starts: {
                end: "(\\s*/)?",
                relevance: 0
            }
        }), {
            className: "string",
            variants: [{
                begin: /'''/,
                end: /'''/,
                contains: [s.BACKSLASH_ESCAPE]
            }, {
                begin: /'/,
                end: /'/,
                contains: [s.BACKSLASH_ESCAPE]
            }, {
                begin: /"""/,
                end: /"""/,
                contains: [s.BACKSLASH_ESCAPE, i]
            }, {
                begin: /"/,
                end: /"/,
                contains: [s.BACKSLASH_ESCAPE, i]
            }]
        }, {
            className: "regexp",
            variants: [{
                begin: "///",
                end: "///",
                contains: [i, s.HASH_COMMENT_MODE]
            }, {
                begin: "//[gim]{0,3}(?=\\W)",
                relevance: 0
            }, {
                begin: /\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/
            }]
        }, {
            begin: "@" + o
        }, {
            subLanguage: "javascript",
            excludeBegin: !0,
            excludeEnd: !0,
            variants: [{
                begin: "```",
                end: "```"
            }, {
                begin: "`",
                end: "`"
            }]
        }];
        return i.contains = c,
        a = s.inherit(s.TITLE_MODE, {
            begin: o
        }),
        l = {
            className: "params",
            begin: "\\([^\\(]",
            returnBegin: !0,
            contains: [{
                begin: /\(/,
                end: /\)/,
                keywords: r,
                contains: ["self"].concat(c)
            }]
        },
        {
            name: "CoffeeScript",
            aliases: ["coffee", "cson", "iced"],
            keywords: r,
            illegal: /\/\*/,
            contains: c.concat([s.COMMENT("###", "###"), s.HASH_COMMENT_MODE, {
                className: "function",
                begin: "^\\s*" + o + "\\s*=\\s*(\\(.*\\))?\\s*\\B[-=]>",
                end: "[-=]>",
                returnBegin: !0,
                contains: [a, l]
            }, {
                begin: /[:(,=]\s*/,
                relevance: 0,
                contains: [{
                    className: "function",
                    begin: "(\\(.*\\))?\\s*\\B[-=]>",
                    end: "[-=]>",
                    returnBegin: !0,
                    contains: [l]
                }]
            }, {
                className: "class",
                beginKeywords: "class",
                end: "$",
                illegal: /[:="[\]]/,
                contains: [{
                    beginKeywords: "extends",
                    endsWithParent: !0,
                    illegal: /[:="[\]]/,
                    contains: [a]
                }, a]
            }, {
                begin: o + ":",
                end: ":",
                returnBegin: !0,
                returnEnd: !0,
                relevance: 0
            }])
        }
    }
}()),
hljs.registerLanguage("cpp", function() {
    "use strict";
    return function(e) {
        var t = e.requireLanguage("c-like").rawDefinition();
        return t.disableAutodetect = !1,
        t.name = "C++",
        t.aliases = ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"],
        t
    }
}()),
hljs.registerLanguage("csharp", function() {
    "use strict";
    return function(e) {
        var t = {
            keyword: "abstract as base bool break byte case catch char checked const continue decimal default delegate do double enum event explicit extern finally fixed float for foreach goto if implicit in init int interface internal is lock long object operator out override params private protected public readonly ref sbyte sealed short sizeof stackalloc static string struct switch this try typeof uint ulong unchecked unsafe ushort using virtual void volatile while add alias ascending async await by descending dynamic equals from get global group into join let nameof on orderby partial remove select set value var when where yield",
            literal: "null false true"
        }
          , n = e.inherit(e.TITLE_MODE, {
            begin: "[a-zA-Z](\\.?\\w)*"
        })
          , s = {
            className: "number",
            variants: [{
                begin: "\\b(0b[01']+)"
            }, {
                begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"
            }, {
                begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
            }],
            relevance: 0
        }
          , a = {
            className: "string",
            begin: '@"',
            end: '"',
            contains: [{
                begin: '""'
            }]
        }
          , u = e.inherit(a, {
            illegal: /\n/
        })
          , i = {
            className: "subst",
            begin: "{",
            end: "}",
            keywords: t
        }
          , o = e.inherit(i, {
            illegal: /\n/
        })
          , r = {
            className: "string",
            begin: /\$"/,
            end: '"',
            illegal: /\n/,
            contains: [{
                begin: "{{"
            }, {
                begin: "}}"
            }, e.BACKSLASH_ESCAPE, o]
        }
          , c = {
            className: "string",
            begin: /\$@"/,
            end: '"',
            contains: [{
                begin: "{{"
            }, {
                begin: "}}"
            }, {
                begin: '""'
            }, i]
        }
          , h = e.inherit(c, {
            illegal: /\n/,
            contains: [{
                begin: "{{"
            }, {
                begin: "}}"
            }, {
                begin: '""'
            }, o]
        });
        i.contains = [c, r, a, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, s, e.C_BLOCK_COMMENT_MODE],
        o.contains = [h, r, u, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, s, e.inherit(e.C_BLOCK_COMMENT_MODE, {
            illegal: /\n/
        })];
        var d = {
            variants: [c, r, a, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
        }
          , l = {
            begin: "<",
            end: ">",
            contains: [{
                beginKeywords: "in out"
            }, n]
        }
          , m = e.IDENT_RE + "(<" + e.IDENT_RE + "(\\s*,\\s*" + e.IDENT_RE + ")*>)?(\\[\\])?"
          , f = {
            begin: "@" + e.IDENT_RE,
            relevance: 0
        };
        return {
            name: "C#",
            aliases: ["cs", "c#"],
            keywords: t,
            illegal: /::/,
            contains: [e.COMMENT("///", "$", {
                returnBegin: !0,
                contains: [{
                    className: "doctag",
                    variants: [{
                        begin: "///",
                        relevance: 0
                    }, {
                        begin: "<!--|-->"
                    }, {
                        begin: "</?",
                        end: ">"
                    }]
                }]
            }), e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                className: "meta",
                begin: "#",
                end: "$",
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line region endregion pragma checksum"
                }
            }, d, s, {
                beginKeywords: "class interface",
                end: /[{;=]/,
                illegal: /[^\s:,]/,
                contains: [{
                    beginKeywords: "where class"
                }, n, l, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "namespace",
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [n, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
            }, {
                beginKeywords: "record",
                end: /[{;=]/,
                illegal: /[^\s:]/,
                contains: [n, l, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
            }, {
                className: "meta",
                begin: "^\\s*\\[",
                excludeBegin: !0,
                end: "\\]",
                excludeEnd: !0,
                contains: [{
                    className: "meta-string",
                    begin: /"/,
                    end: /"/
                }]
            }, {
                beginKeywords: "new return throw await else",
                relevance: 0
            }, {
                className: "function",
                begin: "(" + m + "\\s+)+" + e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
                returnBegin: !0,
                end: /\s*[{;=]/,
                excludeEnd: !0,
                keywords: t,
                contains: [{
                    begin: e.IDENT_RE + "\\s*(\\<.+\\>)?\\s*\\(",
                    returnBegin: !0,
                    contains: [e.TITLE_MODE, l],
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: t,
                    relevance: 0,
                    contains: [d, s, e.C_BLOCK_COMMENT_MODE]
                }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
            }, f]
        }
    }
}()),
hljs.registerLanguage("css", function() {
    "use strict";
    return function(e) {
        var t = {
            begin: /(?:[A-Z_.-]+|--[a-zA-Z0-9_-]+)\s*:/,
            returnBegin: !0,
            end: ";",
            endsWithParent: !0,
            contains: [{
                className: "attribute",
                begin: /\S/,
                end: ":",
                excludeEnd: !0,
                starts: {
                    endsWithParent: !0,
                    excludeEnd: !0,
                    contains: [{
                        begin: /[\w-]+\(/,
                        returnBegin: !0,
                        contains: [{
                            className: "built_in",
                            begin: /[\w-]+/
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE]
                        }]
                    }, e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, e.C_BLOCK_COMMENT_MODE, {
                        className: "number",
                        begin: "#[0-9A-Fa-f]+"
                    }, {
                        className: "meta",
                        begin: "!important"
                    }]
                }
            }]
        };
        return {
            name: "CSS",
            case_insensitive: !0,
            illegal: /[=/|'$]/,
            contains: [e.C_BLOCK_COMMENT_MODE, {
                className: "selector-id",
                begin: /#[A-Za-z0-9_-]+/
            }, {
                className: "selector-class",
                begin: /\.[A-Za-z0-9_-]+/
            }, {
                className: "selector-attr",
                begin: /\[/,
                end: /\]/,
                illegal: "$",
                contains: [e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
            }, {
                className: "selector-pseudo",
                begin: /:(:)?[a-zA-Z0-9_\-+()"'.]+/
            }, {
                begin: "@(page|font-face)",
                lexemes: "@[a-z-]+",
                keywords: "@page @font-face"
            }, {
                begin: "@",
                end: "[{;]",
                illegal: /:/,
                returnBegin: !0,
                contains: [{
                    className: "keyword",
                    begin: /@-?\w[\w]*(-\w+)*/
                }, {
                    begin: /\s/,
                    endsWithParent: !0,
                    excludeEnd: !0,
                    relevance: 0,
                    keywords: "and or not only",
                    contains: [{
                        begin: /[a-z-]+:/,
                        className: "attribute"
                    }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, e.CSS_NUMBER_MODE]
                }]
            }, {
                className: "selector-tag",
                begin: "[a-zA-Z-][a-zA-Z0-9_-]*",
                relevance: 0
            }, {
                begin: "{",
                end: "}",
                illegal: /\S/,
                contains: [e.C_BLOCK_COMMENT_MODE, t]
            }]
        }
    }
}()),
hljs.registerLanguage("diff", function() {
    "use strict";
    return function() {
        return {
            name: "Diff",
            aliases: ["patch"],
            contains: [{
                className: "meta",
                relevance: 10,
                variants: [{
                    begin: /^@@ +-\d+,\d+ +\+\d+,\d+ +@@$/
                }, {
                    begin: /^\*\*\* +\d+,\d+ +\*\*\*\*$/
                }, {
                    begin: /^--- +\d+,\d+ +----$/
                }]
            }, {
                className: "comment",
                variants: [{
                    begin: /Index: /,
                    end: /$/
                }, {
                    begin: /={3,}/,
                    end: /$/
                }, {
                    begin: /^-{3}/,
                    end: /$/
                }, {
                    begin: /^\*{3} /,
                    end: /$/
                }, {
                    begin: /^\+{3}/,
                    end: /$/
                }, {
                    begin: /^\*{15}$/
                }]
            }, {
                className: "addition",
                begin: "^\\+",
                end: "$"
            }, {
                className: "deletion",
                begin: "^\\-",
                end: "$"
            }, {
                className: "addition",
                begin: "^\\!",
                end: "$"
            }]
        }
    }
}()),
hljs.registerLanguage("go", function() {
    "use strict";
    return function(e) {
        var t = {
            keyword: "break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",
            literal: "true false iota nil",
            built_in: "append cap close complex copy imag len make new panic print println real recover delete"
        };
        return {
            name: "Go",
            aliases: ["golang"],
            keywords: t,
            illegal: "</",
            contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                className: "string",
                variants: [e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
                    begin: "`",
                    end: "`"
                }]
            }, {
                className: "number",
                variants: [{
                    begin: e.C_NUMBER_RE + "[i]",
                    relevance: 1
                }, e.C_NUMBER_MODE]
            }, {
                begin: /:=/
            }, {
                className: "function",
                beginKeywords: "func",
                end: "\\s*(\\{|$)",
                excludeEnd: !0,
                contains: [e.TITLE_MODE, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: t,
                    illegal: /["']/
                }]
            }]
        }
    }
}()),
hljs.registerLanguage("http", function() {
    "use strict";
    return function() {
        var t = "HTTP/[0-9\\.]+";
        return {
            name: "HTTP",
            aliases: ["https"],
            illegal: "\\S",
            contains: [{
                begin: "^" + t,
                end: "$",
                contains: [{
                    className: "number",
                    begin: "\\b\\d{3}\\b"
                }]
            }, {
                begin: "^[A-Z]+ (.*?) " + t + "$",
                returnBegin: !0,
                end: "$",
                contains: [{
                    className: "string",
                    begin: " ",
                    end: " ",
                    excludeBegin: !0,
                    excludeEnd: !0
                }, {
                    begin: t
                }, {
                    className: "keyword",
                    begin: "[A-Z]+"
                }]
            }, {
                className: "attribute",
                begin: "^\\w",
                end: ": ",
                excludeEnd: !0,
                illegal: `\\n|\\s|=`,
                starts: {
                    end: "$",
                    relevance: 0
                }
            }, {
                begin: `\\n\\n`,
                starts: {
                    subLanguage: [],
                    endsWithParent: !0
                }
            }]
        }
    }
}()),
hljs.registerLanguage("ini", function() {
    "use strict";
    function e(e) {
        return e ? "string" == typeof e ? e : e.source : null
    }
    function t(...t) {
        return t.map(t=>e(t)).join("")
    }
    return function(n) {
        var o = {
            className: "number",
            relevance: 0,
            variants: [{
                begin: /([+-]+)?[\d]+_[\d_]+/
            }, {
                begin: n.NUMBER_RE
            }]
        }
          , s = n.COMMENT();
        s.variants = [{
            begin: /;/,
            end: /$/
        }, {
            begin: /#/,
            end: /$/
        }];
        var i = {
            className: "variable",
            variants: [{
                begin: /\$[\w\d"][\w\d_]*/
            }, {
                begin: /\$\{(.*?)}/
            }]
        }
          , a = {
            className: "literal",
            begin: /\bon|off|true|false|yes|no\b/
        }
          , r = {
            className: "string",
            contains: [n.BACKSLASH_ESCAPE],
            variants: [{
                begin: "'''",
                end: "'''",
                relevance: 10
            }, {
                begin: '"""',
                end: '"""',
                relevance: 10
            }, {
                begin: '"',
                end: '"'
            }, {
                begin: "'",
                end: "'"
            }]
        }
          , l = {
            begin: /\[/,
            end: /\]/,
            contains: [s, a, i, r, o, "self"],
            relevance: 0
        }
          , c = "(" + [/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/].map(t=>e(t)).join("|") + ")";
        return {
            name: "TOML, also INI",
            aliases: ["toml"],
            case_insensitive: !0,
            illegal: /\S/,
            contains: [s, {
                className: "section",
                begin: /\[+/,
                end: /\]+/
            }, {
                begin: t(c, "(\\s*\\.\\s*", c, ")*", t("(?=", /\s*=\s*[^#\s]/, ")")),
                className: "attr",
                starts: {
                    end: /$/,
                    contains: [s, l, a, i, r, o]
                }
            }]
        }
    }
}()),
hljs.registerLanguage("java", function() {
    "use strict";
    function t(e) {
        return e ? "string" == typeof e ? e : e.source : null
    }
    function n(t) {
        return e("(", t, ")?")
    }
    function e(...e) {
        return e.map(e=>t(e)).join("")
    }
    function s(...e) {
        return "(" + e.map(e=>t(e)).join("|") + ")"
    }
    return function(t) {
        var i = "false synchronized int abstract float private char boolean var static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do"
          , a = {
            className: "meta",
            begin: "@[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*",
            contains: [{
                begin: /\(/,
                end: /\)/,
                contains: ["self"]
            }]
        }
          , o = t=>e("[", t, "]+([", t, "_]*[", t, "]+)?")
          , r = {
            className: "number",
            variants: [{
                begin: `\\b(0[bB]${o("01")})[lL]?`
            }, {
                begin: `\\b(0${o("0-7")})[dDfFlL]?`
            }, {
                begin: e(/\b0[xX]/, s(e(o("a-fA-F0-9"), /\./, o("a-fA-F0-9")), e(o("a-fA-F0-9"), /\.?/), e(/\./, o("a-fA-F0-9"))), /([pP][+-]?(\d+))?/, /[fFdDlL]?/)
            }, {
                begin: e(/\b/, s(e(/\d*\./, o("\\d")), o("\\d")), /[eE][+-]?[\d]+[dDfF]?/)
            }, {
                begin: e(/\b/, o(/\d/), n(/\.?/), n(o(/\d/)), /[dDfFlL]?/)
            }],
            relevance: 0
        };
        return {
            name: "Java",
            aliases: ["jsp"],
            keywords: i,
            illegal: /<\/|#/,
            contains: [t.COMMENT("/\\*\\*", "\\*/", {
                relevance: 0,
                contains: [{
                    begin: /\w+@/,
                    relevance: 0
                }, {
                    className: "doctag",
                    begin: "@[A-Za-z]+"
                }]
            }), t.C_LINE_COMMENT_MODE, t.C_BLOCK_COMMENT_MODE, t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, {
                className: "class",
                beginKeywords: "class interface enum",
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: "class interface enum",
                illegal: /[:"[\]]/,
                contains: [{
                    beginKeywords: "extends implements"
                }, t.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "new throw return else",
                relevance: 0
            }, {
                className: "function",
                begin: "([À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(<[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*(\\s*,\\s*[À-ʸa-zA-Z_$][À-ʸa-zA-Z_$0-9]*)*>)?\\s+)+" + t.UNDERSCORE_IDENT_RE + "\\s*\\(",
                returnBegin: !0,
                end: /[{;=]/,
                excludeEnd: !0,
                keywords: i,
                contains: [{
                    begin: t.UNDERSCORE_IDENT_RE + "\\s*\\(",
                    returnBegin: !0,
                    relevance: 0,
                    contains: [t.UNDERSCORE_TITLE_MODE]
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    keywords: i,
                    relevance: 0,
                    contains: [a, t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, t.C_NUMBER_MODE, t.C_BLOCK_COMMENT_MODE]
                }, t.C_LINE_COMMENT_MODE, t.C_BLOCK_COMMENT_MODE]
            }, r, a]
        }
    }
}()),
hljs.registerLanguage("javascript", function() {
    "use strict";
    const n = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"]
      , s = ["true", "false", "null", "undefined", "NaN", "Infinity"]
      , o = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);
    function t(t) {
        return e("(?=", t, ")")
    }
    function e(...e) {
        return e.map(e=>function(e) {
            return e ? "string" == typeof e ? e : e.source : null
        }(e)).join("")
    }
    return function(i) {
        var d, u, a = "[A-Za-z$_][0-9A-Za-z$_]*", c = {
            begin: /<[A-Za-z0-9\\._:-]+/,
            end: /\/[A-Za-z0-9\\._:-]+>|\/>/
        }, l = {
            $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
            keyword: n.join(" "),
            literal: s.join(" "),
            built_in: o.join(" ")
        }, h = {
            className: "number",
            variants: [{
                begin: "\\b(0[bB][01]+)n?"
            }, {
                begin: "\\b(0[oO][0-7]+)n?"
            }, {
                begin: i.C_NUMBER_RE + "n?"
            }],
            relevance: 0
        }, r = {
            className: "subst",
            begin: "\\$\\{",
            end: "\\}",
            keywords: l,
            contains: []
        }, m = {
            begin: "html`",
            end: "",
            starts: {
                end: "`",
                returnEnd: !1,
                contains: [i.BACKSLASH_ESCAPE, r],
                subLanguage: "xml"
            }
        }, f = {
            begin: "css`",
            end: "",
            starts: {
                end: "`",
                returnEnd: !1,
                contains: [i.BACKSLASH_ESCAPE, r],
                subLanguage: "css"
            }
        }, p = {
            className: "string",
            begin: "`",
            end: "`",
            contains: [i.BACKSLASH_ESCAPE, r]
        };
        return r.contains = [i.APOS_STRING_MODE, i.QUOTE_STRING_MODE, m, f, p, h, i.REGEXP_MODE],
        d = r.contains.concat([{
            begin: /\(/,
            end: /\)/,
            contains: ["self"].concat(r.contains, [i.C_BLOCK_COMMENT_MODE, i.C_LINE_COMMENT_MODE])
        }, i.C_BLOCK_COMMENT_MODE, i.C_LINE_COMMENT_MODE]),
        u = {
            className: "params",
            begin: /\(/,
            end: /\)/,
            excludeBegin: !0,
            excludeEnd: !0,
            contains: d
        },
        {
            name: "JavaScript",
            aliases: ["js", "jsx", "mjs", "cjs"],
            keywords: l,
            contains: [i.SHEBANG({
                binary: "node",
                relevance: 5
            }), {
                className: "meta",
                relevance: 10,
                begin: /^\s*['"]use (strict|asm)['"]/
            }, i.APOS_STRING_MODE, i.QUOTE_STRING_MODE, m, f, p, i.C_LINE_COMMENT_MODE, i.COMMENT("/\\*\\*", "\\*/", {
                relevance: 0,
                contains: [{
                    className: "doctag",
                    begin: "@[A-Za-z]+",
                    contains: [{
                        className: "type",
                        begin: "\\{",
                        end: "\\}",
                        relevance: 0
                    }, {
                        className: "variable",
                        begin: a + "(?=\\s*(-)|$)",
                        endsParent: !0,
                        relevance: 0
                    }, {
                        begin: /(?=[^\n])\s/,
                        relevance: 0
                    }]
                }]
            }), i.C_BLOCK_COMMENT_MODE, h, {
                begin: e(/[{,\n]\s*/, t(e(/(((\/\/.*$)|(\/\*(.|\n)*\*\/))\s*)*/, a + "\\s*:"))),
                relevance: 0,
                contains: [{
                    className: "attr",
                    begin: a + t("\\s*:"),
                    relevance: 0
                }]
            }, {
                begin: "(" + i.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                keywords: "return throw case",
                contains: [i.C_LINE_COMMENT_MODE, i.C_BLOCK_COMMENT_MODE, i.REGEXP_MODE, {
                    className: "function",
                    begin: "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" + i.UNDERSCORE_IDENT_RE + ")\\s*=>",
                    returnBegin: !0,
                    end: "\\s*=>",
                    contains: [{
                        className: "params",
                        variants: [{
                            begin: i.UNDERSCORE_IDENT_RE
                        }, {
                            className: null,
                            begin: /\(\s*\)/,
                            skip: !0
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: l,
                            contains: d
                        }]
                    }]
                }, {
                    begin: /,/,
                    relevance: 0
                }, {
                    className: "",
                    begin: /\s/,
                    end: /\s*/,
                    skip: !0
                }, {
                    variants: [{
                        begin: "<>",
                        end: "</>"
                    }, {
                        begin: c.begin,
                        end: c.end
                    }],
                    subLanguage: "xml",
                    contains: [{
                        begin: c.begin,
                        end: c.end,
                        skip: !0,
                        contains: ["self"]
                    }]
                }],
                relevance: 0
            }, {
                className: "function",
                beginKeywords: "function",
                end: /\{/,
                excludeEnd: !0,
                contains: [i.inherit(i.TITLE_MODE, {
                    begin: a
                }), u],
                illegal: /\[|%/
            }, {
                begin: /\$[(.]/
            }, i.METHOD_GUARD, {
                className: "class",
                beginKeywords: "class",
                end: /[{;=]/,
                excludeEnd: !0,
                illegal: /[:"[\]]/,
                contains: [{
                    beginKeywords: "extends"
                }, i.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "constructor",
                end: /\{/,
                excludeEnd: !0
            }, {
                begin: "(get|set)\\s+(?=" + a + "\\()",
                end: /{/,
                keywords: "get set",
                contains: [i.inherit(i.TITLE_MODE, {
                    begin: a
                }), {
                    begin: /\(\)/
                }, u]
            }],
            illegal: /#(?!!)/
        }
    }
}()),
hljs.registerLanguage("json", function() {
    "use strict";
    return function(e) {
        var n = {
            literal: "true false null"
        }
          , s = [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
          , t = [e.QUOTE_STRING_MODE, e.C_NUMBER_MODE]
          , o = {
            end: ",",
            endsWithParent: !0,
            excludeEnd: !0,
            contains: t,
            keywords: n
        }
          , i = {
            begin: "{",
            end: "}",
            contains: [{
                className: "attr",
                begin: /"/,
                end: /"/,
                contains: [e.BACKSLASH_ESCAPE],
                illegal: `\\n`
            }, e.inherit(o, {
                begin: /:/
            })].concat(s),
            illegal: "\\S"
        }
          , a = {
            begin: "\\[",
            end: "\\]",
            contains: [e.inherit(o)],
            illegal: "\\S"
        };
        return t.push(i, a),
        s.forEach(function(e) {
            t.push(e)
        }),
        {
            name: "JSON",
            contains: t,
            keywords: n,
            illegal: "\\S"
        }
    }
}()),
hljs.registerLanguage("kotlin", function() {
    "use strict";
    return function(e) {
        var o = {
            keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
            built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
            literal: "true false null"
        }
          , d = {
            className: "symbol",
            begin: e.UNDERSCORE_IDENT_RE + "@"
        }
          , i = {
            className: "subst",
            begin: "\\${",
            end: "}",
            contains: [e.C_NUMBER_MODE]
        }
          , c = {
            className: "variable",
            begin: "\\$" + e.UNDERSCORE_IDENT_RE
        }
          , t = {
            className: "string",
            variants: [{
                begin: '"""',
                end: '"""(?=[^"])',
                contains: [c, i]
            }, {
                begin: "'",
                end: "'",
                illegal: /\n/,
                contains: [e.BACKSLASH_ESCAPE]
            }, {
                begin: '"',
                end: '"',
                illegal: /\n/,
                contains: [e.BACKSLASH_ESCAPE, c, i]
            }]
        };
        i.contains.push(t);
        var a = {
            className: "meta",
            begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e.UNDERSCORE_IDENT_RE + ")?"
        }
          , r = {
            className: "meta",
            begin: "@" + e.UNDERSCORE_IDENT_RE,
            contains: [{
                begin: /\(/,
                end: /\)/,
                contains: [e.inherit(t, {
                    className: "meta-string"
                })]
            }]
        }
          , n = e.COMMENT("/\\*", "\\*/", {
            contains: [e.C_BLOCK_COMMENT_MODE]
        })
          , s = {
            variants: [{
                className: "type",
                begin: e.UNDERSCORE_IDENT_RE
            }, {
                begin: /\(/,
                end: /\)/,
                contains: []
            }]
        }
          , l = s;
        return l.variants[1].contains = [s],
        s.variants[1].contains = [l],
        {
            name: "Kotlin",
            aliases: ["kt"],
            keywords: o,
            contains: [e.COMMENT("/\\*\\*", "\\*/", {
                relevance: 0,
                contains: [{
                    className: "doctag",
                    begin: "@[A-Za-z]+"
                }]
            }), e.C_LINE_COMMENT_MODE, n, {
                className: "keyword",
                begin: /\b(break|continue|return|this)\b/,
                starts: {
                    contains: [{
                        className: "symbol",
                        begin: /@\w+/
                    }]
                }
            }, d, a, r, {
                className: "function",
                beginKeywords: "fun",
                end: "[(]|$",
                returnBegin: !0,
                excludeEnd: !0,
                keywords: o,
                illegal: /fun\s+(<.*>)?[^\s(]+(\s+[^\s(]+)\s*=/,
                relevance: 5,
                contains: [{
                    begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(",
                    returnBegin: !0,
                    relevance: 0,
                    contains: [e.UNDERSCORE_TITLE_MODE]
                }, {
                    className: "type",
                    begin: /</,
                    end: />/,
                    keywords: "reified",
                    relevance: 0
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    endsParent: !0,
                    keywords: o,
                    relevance: 0,
                    contains: [{
                        begin: /:/,
                        end: /[=,/]/,
                        endsWithParent: !0,
                        contains: [s, e.C_LINE_COMMENT_MODE, n],
                        relevance: 0
                    }, e.C_LINE_COMMENT_MODE, n, a, r, t, e.C_NUMBER_MODE]
                }, n]
            }, {
                className: "class",
                beginKeywords: "class interface trait",
                end: /[:{(]|$/,
                excludeEnd: !0,
                illegal: "extends implements",
                contains: [{
                    beginKeywords: "public protected internal private constructor"
                }, e.UNDERSCORE_TITLE_MODE, {
                    className: "type",
                    begin: /</,
                    end: />/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    relevance: 0
                }, {
                    className: "type",
                    begin: /[,:]\s*/,
                    end: /[<(,]|$/,
                    excludeBegin: !0,
                    returnEnd: !0
                }, a, r]
            }, t, {
                className: "meta",
                begin: "^#!/usr/bin/env",
                end: "$",
                illegal: `
`
            }, {
                className: "number",
                begin: "\\b(0[bB]([01]+[01_]+[01]+|[01]+)|0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)|(([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?|\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))([eE][-+]?\\d+)?)[lLfF]?",
                relevance: 0
            }]
        }
    }
}()),
hljs.registerLanguage("less", function() {
    "use strict";
    return function(e) {
        var n = "([\\w-]+|@{[\\w-]+})"
          , o = []
          , s = []
          , i = function(e) {
            return {
                className: "string",
                begin: "~?" + e + ".*?" + e
            }
        }
          , t = function(e, t, n) {
            return {
                className: e,
                begin: t,
                relevance: n
            }
        }
          , r = {
            begin: "\\(",
            end: "\\)",
            contains: s,
            relevance: 0
        };
        s.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, i("'"), i('"'), e.CSS_NUMBER_MODE, {
            begin: "(url|data-uri)\\(",
            starts: {
                className: "string",
                end: `[\\)\\n]`,
                excludeEnd: !0
            }
        }, t("number", "#[0-9A-Fa-f]+\\b"), r, t("variable", "@@?[\\w-]+", 10), t("variable", "@{[\\w-]+}"), t("built_in", "~?`[^`]*?`"), {
            className: "attribute",
            begin: "[\\w-]+\\s*:",
            end: ":",
            returnBegin: !0,
            excludeEnd: !0
        }, {
            className: "meta",
            begin: "!important"
        });
        var a = s.concat({
            begin: "{",
            end: "}",
            contains: o
        })
          , c = {
            beginKeywords: "when",
            endsWithParent: !0,
            contains: [{
                beginKeywords: "and not"
            }].concat(s)
        }
          , l = {
            begin: n + "\\s*:",
            returnBegin: !0,
            end: "[;}]",
            relevance: 0,
            contains: [{
                className: "attribute",
                begin: n,
                end: ":",
                excludeEnd: !0,
                starts: {
                    endsWithParent: !0,
                    illegal: "[<=$]",
                    relevance: 0,
                    contains: s
                }
            }]
        }
          , d = {
            className: "keyword",
            begin: "@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
            starts: {
                end: "[;{}]",
                returnEnd: !0,
                contains: s,
                relevance: 0
            }
        }
          , u = {
            className: "variable",
            variants: [{
                begin: "@[\\w-]+\\s*:",
                relevance: 15
            }, {
                begin: "@[\\w-]+"
            }],
            starts: {
                end: "[;}]",
                returnEnd: !0,
                contains: a
            }
        }
          , h = {
            variants: [{
                begin: "[\\.#:&\\[>]",
                end: "[;{}]"
            }, {
                begin: n,
                end: "{"
            }],
            returnBegin: !0,
            returnEnd: !0,
            illegal: "[<='$\"]",
            relevance: 0,
            contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, c, t("keyword", "all\\b"), t("variable", "@{[\\w-]+}"), t("selector-tag", n + "%?", 0), t("selector-id", "#" + n), t("selector-class", "\\." + n, 0), t("selector-tag", "&", 0), {
                className: "selector-attr",
                begin: "\\[",
                end: "\\]"
            }, {
                className: "selector-pseudo",
                begin: /:(:)?[a-zA-Z0-9_\-+()"'.]+/
            }, {
                begin: "\\(",
                end: "\\)",
                contains: a
            }, {
                begin: "!important"
            }]
        };
        return o.push(e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, d, u, l, h),
        {
            name: "Less",
            case_insensitive: !0,
            illegal: "[=>'/<($\"]",
            contains: o
        }
    }
}()),
hljs.registerLanguage("lua", function() {
    "use strict";
    return function(e) {
        var n = {
            begin: "\\[=*\\[",
            end: "\\]=*\\]",
            contains: ["self"]
        }
          , t = [e.COMMENT("--(?!\\[=*\\[)", "$"), e.COMMENT("--\\[=*\\[", "\\]=*\\]", {
            contains: [n],
            relevance: 10
        })];
        return {
            name: "Lua",
            keywords: {
                $pattern: e.UNDERSCORE_IDENT_RE,
                literal: "true false nil",
                keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
                built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
            },
            contains: t.concat([{
                className: "function",
                beginKeywords: "function",
                end: "\\)",
                contains: [e.inherit(e.TITLE_MODE, {
                    begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
                }), {
                    className: "params",
                    begin: "\\(",
                    endsWithParent: !0,
                    contains: t
                }].concat(t)
            }, e.C_NUMBER_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
                className: "string",
                begin: "\\[=*\\[",
                end: "\\]=*\\]",
                contains: [n],
                relevance: 5
            }])
        }
    }
}()),
hljs.registerLanguage("makefile", function() {
    "use strict";
    return function(e) {
        var t = {
            className: "variable",
            variants: [{
                begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
                contains: [e.BACKSLASH_ESCAPE]
            }, {
                begin: /\$[@%<?^+*]/
            }]
        }
          , n = {
            className: "string",
            begin: /"/,
            end: /"/,
            contains: [e.BACKSLASH_ESCAPE, t]
        }
          , s = {
            className: "variable",
            begin: /\$\([\w-]+\s/,
            end: /\)/,
            keywords: {
                built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
            },
            contains: [t]
        }
          , o = {
            begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)"
        }
          , i = {
            className: "section",
            begin: /^[^\s]+:/,
            end: /$/,
            contains: [t]
        };
        return {
            name: "Makefile",
            aliases: ["mk", "mak"],
            keywords: {
                $pattern: /[\w-]+/,
                keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
            },
            contains: [e.HASH_COMMENT_MODE, t, n, s, o, {
                className: "meta",
                begin: /^\.PHONY:/,
                end: /$/,
                keywords: {
                    $pattern: /[.\w]+/,
                    "meta-keyword": ".PHONY"
                }
            }, i]
        }
    }
}()),
hljs.registerLanguage("xml", function() {
    "use strict";
    return function(e) {
        var t = {
            className: "symbol",
            begin: "&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;"
        }
          , n = {
            begin: "\\s",
            contains: [{
                className: "meta-keyword",
                begin: "#?[a-z_][a-z1-9_-]+",
                illegal: `\\n`
            }]
        }
          , o = e.inherit(n, {
            begin: "\\(",
            end: "\\)"
        })
          , i = e.inherit(e.APOS_STRING_MODE, {
            className: "meta-string"
        })
          , a = e.inherit(e.QUOTE_STRING_MODE, {
            className: "meta-string"
        })
          , s = {
            endsWithParent: !0,
            illegal: /</,
            relevance: 0,
            contains: [{
                className: "attr",
                begin: "[A-Za-z0-9\\._:-]+",
                relevance: 0
            }, {
                begin: /=\s*/,
                relevance: 0,
                contains: [{
                    className: "string",
                    endsParent: !0,
                    variants: [{
                        begin: /"/,
                        end: /"/,
                        contains: [t]
                    }, {
                        begin: /'/,
                        end: /'/,
                        contains: [t]
                    }, {
                        begin: /[^\s"'=<>`]+/
                    }]
                }]
            }]
        };
        return {
            name: "HTML, XML",
            aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
            case_insensitive: !0,
            contains: [{
                className: "meta",
                begin: "<![a-z]",
                end: ">",
                relevance: 10,
                contains: [n, a, i, o, {
                    begin: "\\[",
                    end: "\\]",
                    contains: [{
                        className: "meta",
                        begin: "<![a-z]",
                        end: ">",
                        contains: [n, o, a, i]
                    }]
                }]
            }, e.COMMENT("<!--", "-->", {
                relevance: 10
            }), {
                begin: "<\\!\\[CDATA\\[",
                end: "\\]\\]>",
                relevance: 10
            }, t, {
                className: "meta",
                begin: /<\?xml/,
                end: /\?>/,
                relevance: 10
            }, {
                className: "tag",
                begin: "<style(?=\\s|>)",
                end: ">",
                keywords: {
                    name: "style"
                },
                contains: [s],
                starts: {
                    end: "</style>",
                    returnEnd: !0,
                    subLanguage: ["css", "xml"]
                }
            }, {
                className: "tag",
                begin: "<script(?=\\s|>)",
                end: ">",
                keywords: {
                    name: "script"
                },
                contains: [s],
                starts: {
                    end: "<\/script>",
                    returnEnd: !0,
                    subLanguage: ["javascript", "handlebars", "xml"]
                }
            }, {
                className: "tag",
                begin: "</?",
                end: "/?>",
                contains: [{
                    className: "name",
                    begin: /[^/><\s]+/,
                    relevance: 0
                }, s]
            }]
        }
    }
}()),
hljs.registerLanguage("markdown", function() {
    "use strict";
    return function() {
        const o = {
            begin: "<",
            end: ">",
            subLanguage: "xml",
            relevance: 0
        }
          , i = {
            begin: "\\[.+?\\][\\(\\[].*?[\\)\\]]",
            returnBegin: !0,
            contains: [{
                className: "string",
                begin: "\\[",
                end: "\\]",
                excludeBegin: !0,
                returnEnd: !0,
                relevance: 0
            }, {
                className: "link",
                begin: "\\]\\(",
                end: "\\)",
                excludeBegin: !0,
                excludeEnd: !0
            }, {
                className: "symbol",
                begin: "\\]\\[",
                end: "\\]",
                excludeBegin: !0,
                excludeEnd: !0
            }],
            relevance: 10
        }
          , t = {
            className: "strong",
            contains: [],
            variants: [{
                begin: /_{2}/,
                end: /_{2}/
            }, {
                begin: /\*{2}/,
                end: /\*{2}/
            }]
        }
          , n = {
            className: "emphasis",
            contains: [],
            variants: [{
                begin: /\*(?!\*)/,
                end: /\*/
            }, {
                begin: /_(?!_)/,
                end: /_/,
                relevance: 0
            }]
        };
        t.contains.push(n),
        n.contains.push(t);
        var s = [o, i];
        return t.contains = t.contains.concat(s),
        n.contains = n.contains.concat(s),
        {
            name: "Markdown",
            aliases: ["md", "mkdown", "mkd"],
            contains: [{
                className: "section",
                variants: [{
                    begin: "^#{1,6}",
                    end: "$",
                    contains: s = s.concat(t, n)
                }, {
                    begin: "(?=^.+?\\n[=-]{2,}$)",
                    contains: [{
                        begin: "^[=-]*$"
                    }, {
                        begin: "^",
                        end: `\\n`,
                        contains: s
                    }]
                }]
            }, o, {
                className: "bullet",
                begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
                end: "\\s+",
                excludeEnd: !0
            }, t, n, {
                className: "quote",
                begin: "^>\\s+",
                contains: s,
                end: "$"
            }, {
                className: "code",
                variants: [{
                    begin: "(`{3,})(.|\\n)*?\\1`*[ ]*"
                }, {
                    begin: "(~{3,})(.|\\n)*?\\1~*[ ]*"
                }, {
                    begin: "```",
                    end: "```+[ ]*$"
                }, {
                    begin: "~~~",
                    end: "~~~+[ ]*$"
                }, {
                    begin: "`.+?`"
                }, {
                    begin: "(?=^( {4}|\\t))",
                    contains: [{
                        begin: "^( {4}|\\t)",
                        end: "(\\n)$"
                    }],
                    relevance: 0
                }]
            }, {
                begin: "^[-\\*]{3,}",
                end: "$"
            }, i, {
                begin: /^\[[^\n]+\]:/,
                returnBegin: !0,
                contains: [{
                    className: "symbol",
                    begin: /\[/,
                    end: /\]/,
                    excludeBegin: !0,
                    excludeEnd: !0
                }, {
                    className: "link",
                    begin: /:\s*/,
                    end: /$/,
                    excludeBegin: !0
                }]
            }]
        }
    }
}()),
hljs.registerLanguage("nginx", function() {
    "use strict";
    return function(e) {
        var t = {
            className: "variable",
            variants: [{
                begin: /\$\d+/
            }, {
                begin: /\$\{/,
                end: /}/
            }, {
                begin: "[\\$\\@]" + e.UNDERSCORE_IDENT_RE
            }]
        }
          , n = {
            endsWithParent: !0,
            keywords: {
                $pattern: "[a-z/_]+",
                literal: "on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"
            },
            relevance: 0,
            illegal: "=>",
            contains: [e.HASH_COMMENT_MODE, {
                className: "string",
                contains: [e.BACKSLASH_ESCAPE, t],
                variants: [{
                    begin: /"/,
                    end: /"/
                }, {
                    begin: /'/,
                    end: /'/
                }]
            }, {
                begin: "([a-z]+):/",
                end: "\\s",
                endsWithParent: !0,
                excludeEnd: !0,
                contains: [t]
            }, {
                className: "regexp",
                contains: [e.BACKSLASH_ESCAPE, t],
                variants: [{
                    begin: "\\s\\^",
                    end: "\\s|{|;",
                    returnEnd: !0
                }, {
                    begin: "~\\*?\\s+",
                    end: "\\s|{|;",
                    returnEnd: !0
                }, {
                    begin: "\\*(\\.[a-z\\-]+)+"
                }, {
                    begin: "([a-z\\-]+\\.)+\\*"
                }]
            }, {
                className: "number",
                begin: "\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"
            }, {
                className: "number",
                begin: "\\b\\d+[kKmMgGdshdwy]*\\b",
                relevance: 0
            }, t]
        };
        return {
            name: "Nginx config",
            aliases: ["nginxconf"],
            contains: [e.HASH_COMMENT_MODE, {
                begin: e.UNDERSCORE_IDENT_RE + "\\s+{",
                returnBegin: !0,
                end: "{",
                contains: [{
                    className: "section",
                    begin: e.UNDERSCORE_IDENT_RE
                }],
                relevance: 0
            }, {
                begin: e.UNDERSCORE_IDENT_RE + "\\s",
                end: ";|{",
                returnBegin: !0,
                contains: [{
                    className: "attribute",
                    begin: e.UNDERSCORE_IDENT_RE,
                    starts: n
                }],
                relevance: 0
            }],
            illegal: "[^\\s\\}]"
        }
    }
}()),
hljs.registerLanguage("objectivec", function() {
    "use strict";
    return function(e) {
        var t = /[a-zA-Z@][a-zA-Z0-9_]*/
          , n = {
            $pattern: t,
            keyword: "@interface @class @protocol @implementation"
        };
        return {
            name: "Objective-C",
            aliases: ["mm", "objc", "obj-c"],
            keywords: {
                $pattern: t,
                keyword: "int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required @encode @package @import @defs @compatibility_alias __bridge __bridge_transfer __bridge_retained __bridge_retain __covariant __contravariant __kindof _Nonnull _Nullable _Null_unspecified __FUNCTION__ __PRETTY_FUNCTION__ __attribute__ getter setter retain unsafe_unretained nonnull nullable null_unspecified null_resettable class instancetype NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",
                literal: "false true FALSE TRUE nil YES NO NULL",
                built_in: "BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"
            },
            illegal: "</",
            contains: [{
                className: "built_in",
                begin: "\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
            }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, e.C_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
                className: "string",
                variants: [{
                    begin: '@"',
                    end: '"',
                    illegal: `\\n`,
                    contains: [e.BACKSLASH_ESCAPE]
                }]
            }, {
                className: "meta",
                begin: /#\s*[a-z]+\b/,
                end: /$/,
                keywords: {
                    "meta-keyword": "if else elif endif define undef warning error line pragma ifdef ifndef include"
                },
                contains: [{
                    begin: /\\\n/,
                    relevance: 0
                }, e.inherit(e.QUOTE_STRING_MODE, {
                    className: "meta-string"
                }), {
                    className: "meta-string",
                    begin: /<.*?>/,
                    end: /$/,
                    illegal: `\\n`
                }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
            }, {
                className: "class",
                begin: "(" + n.keyword.split(" ").join("|") + ")\\b",
                end: "({|$)",
                excludeEnd: !0,
                keywords: n,
                contains: [e.UNDERSCORE_TITLE_MODE]
            }, {
                begin: "\\." + e.UNDERSCORE_IDENT_RE,
                relevance: 0
            }]
        }
    }
}()),
hljs.registerLanguage("perl", function() {
    "use strict";
    return function(e) {
        var n = {
            $pattern: /[\w.]+/,
            keyword: "getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmget sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when"
        }
          , s = {
            className: "subst",
            begin: "[$@]\\{",
            end: "\\}",
            keywords: n
        }
          , o = {
            begin: "->{",
            end: "}"
        }
          , i = {
            variants: [{
                begin: /\$\d/
            }, {
                begin: /[$%@](\^\w\b|#\w+(::\w+)*|{\w+}|\w+(::\w*)*)/
            }, {
                begin: /[$%@][^\s\w{]/,
                relevance: 0
            }]
        }
          , a = [e.BACKSLASH_ESCAPE, s, i]
          , t = [i, e.HASH_COMMENT_MODE, e.COMMENT("^\\=\\w", "\\=cut", {
            endsWithParent: !0
        }), o, {
            className: "string",
            contains: a,
            variants: [{
                begin: "q[qwxr]?\\s*\\(",
                end: "\\)",
                relevance: 5
            }, {
                begin: "q[qwxr]?\\s*\\[",
                end: "\\]",
                relevance: 5
            }, {
                begin: "q[qwxr]?\\s*\\{",
                end: "\\}",
                relevance: 5
            }, {
                begin: "q[qwxr]?\\s*\\|",
                end: "\\|",
                relevance: 5
            }, {
                begin: "q[qwxr]?\\s*\\<",
                end: "\\>",
                relevance: 5
            }, {
                begin: "qw\\s+q",
                end: "q",
                relevance: 5
            }, {
                begin: "'",
                end: "'",
                contains: [e.BACKSLASH_ESCAPE]
            }, {
                begin: '"',
                end: '"'
            }, {
                begin: "`",
                end: "`",
                contains: [e.BACKSLASH_ESCAPE]
            }, {
                begin: "{\\w+}",
                contains: [],
                relevance: 0
            }, {
                begin: "-?\\w+\\s*\\=\\>",
                contains: [],
                relevance: 0
            }]
        }, {
            className: "number",
            begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0
        }, {
            begin: "(\\/\\/|" + e.RE_STARTERS_RE + "|\\b(split|return|print|reverse|grep)\\b)\\s*",
            keywords: "split return print reverse grep",
            relevance: 0,
            contains: [e.HASH_COMMENT_MODE, {
                className: "regexp",
                begin: "(s|tr|y)/(\\\\.|[^/])*/(\\\\.|[^/])*/[a-z]*",
                relevance: 10
            }, {
                className: "regexp",
                begin: "(m|qr)?/",
                end: "/[a-z]*",
                contains: [e.BACKSLASH_ESCAPE],
                relevance: 0
            }]
        }, {
            className: "function",
            beginKeywords: "sub",
            end: "(\\s*\\(.*?\\))?[;{]",
            excludeEnd: !0,
            relevance: 5,
            contains: [e.TITLE_MODE]
        }, {
            begin: "-\\w\\b",
            relevance: 0
        }, {
            begin: "^__DATA__$",
            end: "^__END__$",
            subLanguage: "mojolicious",
            contains: [{
                begin: "^@@.*",
                end: "$",
                className: "comment"
            }]
        }];
        return s.contains = t,
        o.contains = t,
        {
            name: "Perl",
            aliases: ["pl", "pm"],
            keywords: n,
            contains: t
        }
    }
}()),
hljs.registerLanguage("php", function() {
    "use strict";
    return function(e) {
        var n = {
            begin: "\\$+[a-zA-Z_-ÿ][a-zA-Z0-9_-ÿ]*"
        }
          , t = {
            className: "meta",
            variants: [{
                begin: /<\?php/,
                relevance: 10
            }, {
                begin: /<\?[=]?/
            }, {
                begin: /\?>/
            }]
        }
          , s = {
            className: "subst",
            variants: [{
                begin: /\$\w+/
            }, {
                begin: /\{\$/,
                end: /\}/
            }]
        }
          , o = e.inherit(e.APOS_STRING_MODE, {
            illegal: null
        })
          , i = e.inherit(e.QUOTE_STRING_MODE, {
            illegal: null,
            contains: e.QUOTE_STRING_MODE.contains.concat(s)
        })
          , l = e.END_SAME_AS_BEGIN({
            begin: /<<<[ \t]*(\w+)\n/,
            end: /[ \t]*(\w+)\b/,
            contains: e.QUOTE_STRING_MODE.contains.concat(s)
        })
          , a = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE, t],
            variants: [e.inherit(o, {
                begin: "b'",
                end: "'"
            }), e.inherit(i, {
                begin: 'b"',
                end: '"'
            }), i, o, l]
        }
          , r = {
            variants: [e.BINARY_NUMBER_MODE, e.C_NUMBER_MODE]
        }
          , c = {
            keyword: "__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list new object or private protected public real return string switch throw trait try unset use var void while xor yield",
            literal: "false null true",
            built_in: "Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Throwable Traversable WeakReference Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass"
        };
        return {
            aliases: ["php", "php3", "php4", "php5", "php6", "php7"],
            case_insensitive: !0,
            keywords: c,
            contains: [e.HASH_COMMENT_MODE, e.COMMENT("//", "$", {
                contains: [t]
            }), e.COMMENT("/\\*", "\\*/", {
                contains: [{
                    className: "doctag",
                    begin: "@[A-Za-z]+"
                }]
            }), e.COMMENT("__halt_compiler.+?;", !1, {
                endsWithParent: !0,
                keywords: "__halt_compiler"
            }), t, {
                className: "keyword",
                begin: /\$this\b/
            }, n, {
                begin: /(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/
            }, {
                className: "function",
                beginKeywords: "fn function",
                end: /[;{]/,
                excludeEnd: !0,
                illegal: "[$%\\[]",
                contains: [e.UNDERSCORE_TITLE_MODE, {
                    className: "params",
                    begin: "\\(",
                    end: "\\)",
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: c,
                    contains: ["self", n, e.C_BLOCK_COMMENT_MODE, a, r]
                }]
            }, {
                className: "class",
                beginKeywords: "class interface",
                end: "{",
                excludeEnd: !0,
                illegal: /[:($"]/,
                contains: [{
                    beginKeywords: "extends implements"
                }, e.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "namespace",
                end: ";",
                illegal: /[.']/,
                contains: [e.UNDERSCORE_TITLE_MODE]
            }, {
                beginKeywords: "use",
                end: ";",
                contains: [e.UNDERSCORE_TITLE_MODE]
            }, {
                begin: "=>"
            }, a, r]
        }
    }
}()),
hljs.registerLanguage("php-template", function() {
    "use strict";
    return function(e) {
        return {
            name: "PHP template",
            subLanguage: "xml",
            contains: [{
                begin: /<\?(php|=)?/,
                end: /\?>/,
                subLanguage: "php",
                contains: [{
                    begin: "/\\*",
                    end: "\\*/",
                    skip: !0
                }, {
                    begin: 'b"',
                    end: '"',
                    skip: !0
                }, {
                    begin: "b'",
                    end: "'",
                    skip: !0
                }, e.inherit(e.APOS_STRING_MODE, {
                    illegal: null,
                    className: null,
                    contains: null,
                    skip: !0
                }), e.inherit(e.QUOTE_STRING_MODE, {
                    illegal: null,
                    className: null,
                    contains: null,
                    skip: !0
                })]
            }]
        }
    }
}()),
hljs.registerLanguage("plaintext", function() {
    "use strict";
    return function() {
        return {
            name: "Plain text",
            aliases: ["text", "txt"],
            disableAutodetect: !0
        }
    }
}()),
hljs.registerLanguage("properties", function() {
    "use strict";
    return function(e) {
        var t = "[ \\t\\f]*"
          , n = "(" + t + "[:=]" + t + "|[ \\t\\f]+)"
          , s = `([^\\\\:= \\t\\f\\n]|\\\\.)+`
          , o = {
            end: n,
            relevance: 0,
            starts: {
                className: "string",
                end: /$/,
                relevance: 0,
                contains: [{
                    begin: `\\\\\\n`
                }]
            }
        };
        return {
            name: ".properties",
            case_insensitive: !0,
            illegal: /\S/,
            contains: [e.COMMENT("^\\s*[!#]", "$"), {
                begin: `([^\\\\\\W:= \\t\\f\\n]|\\\\.)+` + n,
                returnBegin: !0,
                contains: [{
                    className: "attr",
                    begin: `([^\\\\\\W:= \\t\\f\\n]|\\\\.)+`,
                    endsParent: !0,
                    relevance: 0
                }],
                starts: o
            }, {
                begin: s + n,
                returnBegin: !0,
                relevance: 0,
                contains: [{
                    className: "meta",
                    begin: s,
                    endsParent: !0,
                    relevance: 0
                }],
                starts: o
            }, {
                className: "attr",
                relevance: 0,
                begin: s + t + "$"
            }]
        }
    }
}()),
hljs.registerLanguage("python", function() {
    "use strict";
    return function(e) {
        var a = {
            keyword: "and elif is global as in if from raise for except finally print import pass return exec else break not with class assert yield try while continue del or def lambda async await nonlocal|10",
            built_in: "Ellipsis NotImplemented",
            literal: "False None True"
        }
          , t = {
            className: "meta",
            begin: /^(>>>|\.\.\.) /
        }
          , n = {
            className: "subst",
            begin: /\{/,
            end: /\}/,
            keywords: a,
            illegal: /#/
        }
          , s = {
            begin: /\{\{/,
            relevance: 0
        }
          , o = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE],
            variants: [{
                begin: /(u|b)?r?'''/,
                end: /'''/,
                contains: [e.BACKSLASH_ESCAPE, t],
                relevance: 10
            }, {
                begin: /(u|b)?r?"""/,
                end: /"""/,
                contains: [e.BACKSLASH_ESCAPE, t],
                relevance: 10
            }, {
                begin: /(fr|rf|f)'''/,
                end: /'''/,
                contains: [e.BACKSLASH_ESCAPE, t, s, n]
            }, {
                begin: /(fr|rf|f)"""/,
                end: /"""/,
                contains: [e.BACKSLASH_ESCAPE, t, s, n]
            }, {
                begin: /(u|r|ur)'/,
                end: /'/,
                relevance: 10
            }, {
                begin: /(u|r|ur)"/,
                end: /"/,
                relevance: 10
            }, {
                begin: /(b|br)'/,
                end: /'/
            }, {
                begin: /(b|br)"/,
                end: /"/
            }, {
                begin: /(fr|rf|f)'/,
                end: /'/,
                contains: [e.BACKSLASH_ESCAPE, s, n]
            }, {
                begin: /(fr|rf|f)"/,
                end: /"/,
                contains: [e.BACKSLASH_ESCAPE, s, n]
            }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
        }
          , i = {
            className: "number",
            relevance: 0,
            variants: [{
                begin: e.BINARY_NUMBER_RE + "[lLjJ]?"
            }, {
                begin: "\\b(0o[0-7]+)[lLjJ]?"
            }, {
                begin: e.C_NUMBER_RE + "[lLjJ]?"
            }]
        }
          , r = {
            className: "params",
            variants: [{
                begin: /\(\s*\)/,
                skip: !0,
                className: null
            }, {
                begin: /\(/,
                end: /\)/,
                excludeBegin: !0,
                excludeEnd: !0,
                contains: ["self", t, i, o, e.HASH_COMMENT_MODE]
            }]
        };
        return n.contains = [o, i, t],
        {
            name: "Python",
            aliases: ["py", "gyp", "ipython"],
            keywords: a,
            illegal: /(<\/|->|\?)|=>/,
            contains: [t, i, {
                beginKeywords: "if",
                relevance: 0
            }, o, e.HASH_COMMENT_MODE, {
                variants: [{
                    className: "function",
                    beginKeywords: "def"
                }, {
                    className: "class",
                    beginKeywords: "class"
                }],
                end: /:/,
                illegal: /[${=;\n,]/,
                contains: [e.UNDERSCORE_TITLE_MODE, r, {
                    begin: /->/,
                    endsWithParent: !0,
                    keywords: "None"
                }]
            }, {
                className: "meta",
                begin: /^[\t ]*@/,
                end: /$/
            }, {
                begin: /\b(print|exec)\(/
            }]
        }
    }
}()),
hljs.registerLanguage("python-repl", function() {
    "use strict";
    return function() {
        return {
            aliases: ["pycon"],
            contains: [{
                className: "meta",
                starts: {
                    end: / |$/,
                    starts: {
                        end: "$",
                        subLanguage: "python"
                    }
                },
                variants: [{
                    begin: /^>>>(?=[ ]|$)/
                }, {
                    begin: /^\.\.\.(?=[ ]|$)/
                }]
            }]
        }
    }
}()),
hljs.registerLanguage("ruby", function() {
    "use strict";
    return function(e) {
        var d, i = "[a-zA-Z_]\\w*[!?=]?|[-+~]\\@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?", s = {
            keyword: "and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor",
            literal: "true false nil"
        }, a = {
            className: "doctag",
            begin: "@[A-Za-z]+"
        }, r = {
            begin: "#<",
            end: ">"
        }, t = [e.COMMENT("#", "$", {
            contains: [a]
        }), e.COMMENT("^\\=begin", "^\\=end", {
            contains: [a],
            relevance: 10
        }), e.COMMENT("^__END__", "\\n$")], o = {
            className: "subst",
            begin: "#\\{",
            end: "}",
            keywords: s
        }, c = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE, o],
            variants: [{
                begin: /'/,
                end: /'/
            }, {
                begin: /"/,
                end: /"/
            }, {
                begin: /`/,
                end: /`/
            }, {
                begin: "%[qQwWx]?\\(",
                end: "\\)"
            }, {
                begin: "%[qQwWx]?\\[",
                end: "\\]"
            }, {
                begin: "%[qQwWx]?{",
                end: "}"
            }, {
                begin: "%[qQwWx]?<",
                end: ">"
            }, {
                begin: "%[qQwWx]?/",
                end: "/"
            }, {
                begin: "%[qQwWx]?%",
                end: "%"
            }, {
                begin: "%[qQwWx]?-",
                end: "-"
            }, {
                begin: "%[qQwWx]?\\|",
                end: "\\|"
            }, {
                begin: /\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/
            }, {
                begin: /<<[-~]?'?(\w+)(?:.|\n)*?\n\s*\1\b/,
                returnBegin: !0,
                contains: [{
                    begin: /<<[-~]?'?/
                }, e.END_SAME_AS_BEGIN({
                    begin: /(\w+)/,
                    end: /(\w+)/,
                    contains: [e.BACKSLASH_ESCAPE, o]
                })]
            }]
        }, l = {
            className: "params",
            begin: "\\(",
            end: "\\)",
            endsParent: !0,
            keywords: s
        }, n = [c, r, {
            className: "class",
            beginKeywords: "class module",
            end: "$|;",
            illegal: /=/,
            contains: [e.inherit(e.TITLE_MODE, {
                begin: "[A-Za-z_]\\w*(::\\w+)*(\\?|\\!)?"
            }), {
                begin: "<\\s*",
                contains: [{
                    begin: "(" + e.IDENT_RE + "::)?" + e.IDENT_RE
                }]
            }].concat(t)
        }, {
            className: "function",
            beginKeywords: "def",
            end: "$|;",
            contains: [e.inherit(e.TITLE_MODE, {
                begin: i
            }), l].concat(t)
        }, {
            begin: e.IDENT_RE + "::"
        }, {
            className: "symbol",
            begin: e.UNDERSCORE_IDENT_RE + "(\\!|\\?)?:",
            relevance: 0
        }, {
            className: "symbol",
            begin: ":(?!\\s)",
            contains: [c, {
                begin: i
            }],
            relevance: 0
        }, {
            className: "number",
            begin: "(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
            relevance: 0
        }, {
            begin: "(\\$\\W)|((\\$|\\@\\@?)(\\w+))"
        }, {
            className: "params",
            begin: /\|/,
            end: /\|/,
            keywords: s
        }, {
            begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
            keywords: "unless",
            contains: [r, {
                className: "regexp",
                contains: [e.BACKSLASH_ESCAPE, o],
                illegal: /\n/,
                variants: [{
                    begin: "/",
                    end: "/[a-z]*"
                }, {
                    begin: "%r{",
                    end: "}[a-z]*"
                }, {
                    begin: "%r\\(",
                    end: "\\)[a-z]*"
                }, {
                    begin: "%r!",
                    end: "![a-z]*"
                }, {
                    begin: "%r\\[",
                    end: "\\][a-z]*"
                }]
            }].concat(t),
            relevance: 0
        }].concat(t);
        return o.contains = n,
        l.contains = n,
        d = [{
            begin: /^\s*=>/,
            starts: {
                end: "$",
                contains: n
            }
        }, {
            className: "meta",
            begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d(p\\d+)?[^>]+>)",
            starts: {
                end: "$",
                contains: n
            }
        }],
        {
            name: "Ruby",
            aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
            keywords: s,
            illegal: /\/\*/,
            contains: t.concat(d).concat(n)
        }
    }
}()),
hljs.registerLanguage("rust", function() {
    "use strict";
    return function(e) {
        var t = "([ui](8|16|32|64|128|size)|f(32|64))?"
          , n = "drop i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 str char bool Box Option Result String Vec Copy Send Sized Sync Drop Fn FnMut FnOnce ToOwned Clone Debug PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator Extend IntoIterator DoubleEndedIterator ExactSizeIterator SliceConcatExt ToString assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! debug_assert! debug_assert_eq! env! panic! file! format! format_args! include_bin! include_str! line! local_data_key! module_path! option_env! print! println! select! stringify! try! unimplemented! unreachable! vec! write! writeln! macro_rules! assert_ne! debug_assert_ne!";
        return {
            name: "Rust",
            aliases: ["rs"],
            keywords: {
                $pattern: e.IDENT_RE + "!?",
                keyword: "abstract as async await become box break const continue crate do dyn else enum extern false final fn for if impl in let loop macro match mod move mut override priv pub ref return self Self static struct super trait true try type typeof unsafe unsized use virtual where while yield",
                literal: "true false Some None Ok Err",
                built_in: n
            },
            illegal: "</",
            contains: [e.C_LINE_COMMENT_MODE, e.COMMENT("/\\*", "\\*/", {
                contains: ["self"]
            }), e.inherit(e.QUOTE_STRING_MODE, {
                begin: /b?"/,
                illegal: null
            }), {
                className: "string",
                variants: [{
                    begin: /r(#*)"(.|\n)*?"\1(?!#)/
                }, {
                    begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
                }]
            }, {
                className: "symbol",
                begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
            }, {
                className: "number",
                variants: [{
                    begin: "\\b0b([01_]+)" + t
                }, {
                    begin: "\\b0o([0-7_]+)" + t
                }, {
                    begin: "\\b0x([A-Fa-f0-9_]+)" + t
                }, {
                    begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + t
                }],
                relevance: 0
            }, {
                className: "function",
                beginKeywords: "fn",
                end: "(\\(|<)",
                excludeEnd: !0,
                contains: [e.UNDERSCORE_TITLE_MODE]
            }, {
                className: "meta",
                begin: "#\\!?\\[",
                end: "\\]",
                contains: [{
                    className: "meta-string",
                    begin: /"/,
                    end: /"/
                }]
            }, {
                className: "class",
                beginKeywords: "type",
                end: ";",
                contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, {
                    endsParent: !0
                })],
                illegal: "\\S"
            }, {
                className: "class",
                beginKeywords: "trait enum struct union",
                end: "{",
                contains: [e.inherit(e.UNDERSCORE_TITLE_MODE, {
                    endsParent: !0
                })],
                illegal: "[\\w\\d]"
            }, {
                begin: e.IDENT_RE + "::",
                keywords: {
                    built_in: n
                }
            }, {
                begin: "->"
            }]
        }
    }
}()),
hljs.registerLanguage("scss", function() {
    "use strict";
    return function(e) {
        var t = {
            className: "variable",
            begin: "(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b"
        }
          , n = {
            className: "number",
            begin: "#[0-9A-Fa-f]+"
        };
        return e.CSS_NUMBER_MODE,
        e.QUOTE_STRING_MODE,
        e.APOS_STRING_MODE,
        e.C_BLOCK_COMMENT_MODE,
        {
            name: "SCSS",
            case_insensitive: !0,
            illegal: "[=/|']",
            contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                className: "selector-id",
                begin: "\\#[A-Za-z0-9_-]+",
                relevance: 0
            }, {
                className: "selector-class",
                begin: "\\.[A-Za-z0-9_-]+",
                relevance: 0
            }, {
                className: "selector-attr",
                begin: "\\[",
                end: "\\]",
                illegal: "$"
            }, {
                className: "selector-tag",
                begin: "\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
                relevance: 0
            }, {
                className: "selector-pseudo",
                begin: ":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
            }, {
                className: "selector-pseudo",
                begin: "::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
            }, t, {
                className: "attribute",
                begin: "\\b(src|z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
                illegal: "[^\\s]"
            }, {
                begin: "\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
            }, {
                begin: ":",
                end: ";",
                contains: [t, n, e.CSS_NUMBER_MODE, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {
                    className: "meta",
                    begin: "!important"
                }]
            }, {
                begin: "@(page|font-face)",
                lexemes: "@[a-z-]+",
                keywords: "@page @font-face"
            }, {
                begin: "@",
                end: "[{;]",
                returnBegin: !0,
                keywords: "and or not only",
                contains: [{
                    begin: "@[a-z-]+",
                    className: "keyword"
                }, t, e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, n, e.CSS_NUMBER_MODE]
            }]
        }
    }
}()),
hljs.registerLanguage("shell", function() {
    "use strict";
    return function() {
        return {
            name: "Shell Session",
            aliases: ["console"],
            contains: [{
                className: "meta",
                begin: "^\\s{0,3}[/\\w\\d\\[\\]()@-]*[>%$#]",
                starts: {
                    end: "$",
                    subLanguage: "bash"
                }
            }]
        }
    }
}()),
hljs.registerLanguage("sql", function() {
    "use strict";
    return function(e) {
        var t = e.COMMENT("--", "$");
        return {
            name: "SQL",
            case_insensitive: !0,
            illegal: /[<>{}*]/,
            contains: [{
                beginKeywords: "begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment values with",
                end: /;/,
                endsWithParent: !0,
                keywords: {
                    $pattern: /[\w.]+/,
                    keyword: "as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select self semi sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
                    literal: "true false null unknown",
                    built_in: "array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text time timestamp tinyint varchar varchar2 varying void"
                },
                contains: [{
                    className: "string",
                    begin: "'",
                    end: "'",
                    contains: [{
                        begin: "''"
                    }]
                }, {
                    className: "string",
                    begin: '"',
                    end: '"',
                    contains: [{
                        begin: '""'
                    }]
                }, {
                    className: "string",
                    begin: "`",
                    end: "`"
                }, e.C_NUMBER_MODE, e.C_BLOCK_COMMENT_MODE, t, e.HASH_COMMENT_MODE]
            }, e.C_BLOCK_COMMENT_MODE, t, e.HASH_COMMENT_MODE]
        }
    }
}()),
hljs.registerLanguage("swift", function() {
    "use strict";
    return function(e) {
        var t = {
            keyword: "#available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector #sourceLocation _ __COLUMN__ __FILE__ __FUNCTION__ __LINE__ Any as as! as? associatedtype associativity break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard if import in indirect infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol Protocol public repeat required rethrows return right self Self set static struct subscript super switch throw throws true try try! try? Type typealias unowned var weak where while willSet",
            literal: "true false nil",
            built_in: "abs advance alignof alignofValue anyGenerator assert assertionFailure bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c compactMap contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal fatalError filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare map max maxElement min minElement numericCast overlaps partition posix precondition preconditionFailure print println quickSort readLine reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith stride strideof strideofValue swap toString transcode underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers withUnsafePointer withUnsafePointers withVaList zip"
        }
          , s = e.COMMENT("/\\*", "\\*/", {
            contains: ["self"]
        })
          , o = {
            className: "subst",
            begin: /\\\(/,
            end: "\\)",
            keywords: t,
            contains: []
        }
          , i = {
            className: "string",
            contains: [e.BACKSLASH_ESCAPE, o],
            variants: [{
                begin: /"""/,
                end: /"""/
            }, {
                begin: /"/,
                end: /"/
            }]
        }
          , n = {
            className: "number",
            begin: "\\b([\\d_]+(\\.[\\deE_]+)?|0x[a-fA-F0-9_]+(\\.[a-fA-F0-9p_]+)?|0b[01_]+|0o[0-7_]+)\\b",
            relevance: 0
        };
        return o.contains = [n],
        {
            name: "Swift",
            keywords: t,
            contains: [i, e.C_LINE_COMMENT_MODE, s, {
                className: "type",
                begin: "\\b[A-Z][\\wÀ-ʸ']*[!?]"
            }, {
                className: "type",
                begin: "\\b[A-Z][\\wÀ-ʸ']*",
                relevance: 0
            }, n, {
                className: "function",
                beginKeywords: "func",
                end: "{",
                excludeEnd: !0,
                contains: [e.inherit(e.TITLE_MODE, {
                    begin: /[A-Za-z$_][0-9A-Za-z$_]*/
                }), {
                    begin: /</,
                    end: />/
                }, {
                    className: "params",
                    begin: /\(/,
                    end: /\)/,
                    endsParent: !0,
                    keywords: t,
                    contains: ["self", n, i, e.C_BLOCK_COMMENT_MODE, {
                        begin: ":"
                    }],
                    illegal: /["']/
                }],
                illegal: /\[|%/
            }, {
                className: "class",
                beginKeywords: "struct protocol class extension enum",
                keywords: t,
                end: "\\{",
                excludeEnd: !0,
                contains: [e.inherit(e.TITLE_MODE, {
                    begin: /[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/
                })]
            }, {
                className: "meta",
                begin: "(@discardableResult|@warn_unused_result|@exported|@lazy|@noescape|@NSCopying|@NSManaged|@objc|@objcMembers|@convention|@required|@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|@infix|@prefix|@postfix|@autoclosure|@testable|@available|@nonobjc|@NSApplicationMain|@UIApplicationMain|@dynamicMemberLookup|@propertyWrapper)\\b"
            }, {
                beginKeywords: "import",
                end: /$/,
                contains: [e.C_LINE_COMMENT_MODE, s]
            }]
        }
    }
}()),
hljs.registerLanguage("typescript", function() {
    "use strict";
    const e = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"]
      , t = ["true", "false", "null", "undefined", "NaN", "Infinity"]
      , n = [].concat(["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"], ["Intl", "DataView", "Number", "Math", "Date", "String", "RegExp", "Object", "Function", "Boolean", "Error", "Symbol", "Set", "Map", "WeakSet", "WeakMap", "Proxy", "Reflect", "JSON", "Promise", "Float64Array", "Int16Array", "Int32Array", "Int8Array", "Uint16Array", "Uint32Array", "Float32Array", "Array", "Uint8Array", "Uint8ClampedArray", "ArrayBuffer"], ["EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"]);
    return function(s) {
        var a, r, o = {
            $pattern: "[A-Za-z$_][0-9A-Za-z$_]*",
            keyword: e.concat(["type", "namespace", "typedef", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly"]).join(" "),
            literal: t.join(" "),
            built_in: n.concat(["any", "void", "number", "boolean", "string", "object", "never", "enum"]).join(" ")
        }, c = {
            className: "meta",
            begin: "@[A-Za-z$_][0-9A-Za-z$_]*"
        }, l = {
            className: "number",
            variants: [{
                begin: "\\b(0[bB][01]+)n?"
            }, {
                begin: "\\b(0[oO][0-7]+)n?"
            }, {
                begin: s.C_NUMBER_RE + "n?"
            }],
            relevance: 0
        }, i = {
            className: "subst",
            begin: "\\$\\{",
            end: "\\}",
            keywords: o,
            contains: []
        }, d = {
            begin: "html`",
            end: "",
            starts: {
                end: "`",
                returnEnd: !1,
                contains: [s.BACKSLASH_ESCAPE, i],
                subLanguage: "xml"
            }
        }, u = {
            begin: "css`",
            end: "",
            starts: {
                end: "`",
                returnEnd: !1,
                contains: [s.BACKSLASH_ESCAPE, i],
                subLanguage: "css"
            }
        }, h = {
            className: "string",
            begin: "`",
            end: "`",
            contains: [s.BACKSLASH_ESCAPE, i]
        };
        return i.contains = [s.APOS_STRING_MODE, s.QUOTE_STRING_MODE, d, u, h, l, s.REGEXP_MODE],
        a = {
            begin: "\\(",
            end: /\)/,
            keywords: o,
            contains: ["self", s.QUOTE_STRING_MODE, s.APOS_STRING_MODE, s.NUMBER_MODE]
        },
        r = {
            className: "params",
            begin: /\(/,
            end: /\)/,
            excludeBegin: !0,
            excludeEnd: !0,
            keywords: o,
            contains: [s.C_LINE_COMMENT_MODE, s.C_BLOCK_COMMENT_MODE, c, a]
        },
        {
            name: "TypeScript",
            aliases: ["ts"],
            keywords: o,
            contains: [s.SHEBANG(), {
                className: "meta",
                begin: /^\s*['"]use strict['"]/
            }, s.APOS_STRING_MODE, s.QUOTE_STRING_MODE, d, u, h, s.C_LINE_COMMENT_MODE, s.C_BLOCK_COMMENT_MODE, l, {
                begin: "(" + s.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                keywords: "return throw case",
                contains: [s.C_LINE_COMMENT_MODE, s.C_BLOCK_COMMENT_MODE, s.REGEXP_MODE, {
                    className: "function",
                    begin: "(\\([^(]*(\\([^(]*(\\([^(]*\\))?\\))?\\)|" + s.UNDERSCORE_IDENT_RE + ")\\s*=>",
                    returnBegin: !0,
                    end: "\\s*=>",
                    contains: [{
                        className: "params",
                        variants: [{
                            begin: s.UNDERSCORE_IDENT_RE
                        }, {
                            className: null,
                            begin: /\(\s*\)/,
                            skip: !0
                        }, {
                            begin: /\(/,
                            end: /\)/,
                            excludeBegin: !0,
                            excludeEnd: !0,
                            keywords: o,
                            contains: a.contains
                        }]
                    }]
                }],
                relevance: 0
            }, {
                className: "function",
                beginKeywords: "function",
                end: /[{;]/,
                excludeEnd: !0,
                keywords: o,
                contains: ["self", s.inherit(s.TITLE_MODE, {
                    begin: "[A-Za-z$_][0-9A-Za-z$_]*"
                }), r],
                illegal: /%/,
                relevance: 0
            }, {
                beginKeywords: "constructor",
                end: /[{;]/,
                excludeEnd: !0,
                contains: ["self", r]
            }, {
                begin: /module\./,
                keywords: {
                    built_in: "module"
                },
                relevance: 0
            }, {
                beginKeywords: "module",
                end: /\{/,
                excludeEnd: !0
            }, {
                beginKeywords: "interface",
                end: /\{/,
                excludeEnd: !0,
                keywords: "interface extends"
            }, {
                begin: /\$[(.]/
            }, {
                begin: "\\." + s.IDENT_RE,
                relevance: 0
            }, c, a]
        }
    }
}()),
hljs.registerLanguage("yaml", function() {
    "use strict";
    return function(e) {
        var n = "true false yes no null"
          , t = "[\\w#;/?:@&=+$,.~*\\'()[\\]]+"
          , i = {
            className: "string",
            relevance: 0,
            variants: [{
                begin: /'/,
                end: /'/
            }, {
                begin: /"/,
                end: /"/
            }, {
                begin: /\S+/
            }],
            contains: [e.BACKSLASH_ESCAPE, {
                className: "template-variable",
                variants: [{
                    begin: "{{",
                    end: "}}"
                }, {
                    begin: "%{",
                    end: "}"
                }]
            }]
        }
          , r = e.inherit(i, {
            variants: [{
                begin: /'/,
                end: /'/
            }, {
                begin: /"/,
                end: /"/
            }, {
                begin: /[^\s,{}[\]]+/
            }]
        })
          , s = {
            end: ",",
            endsWithParent: !0,
            excludeEnd: !0,
            contains: [],
            keywords: n,
            relevance: 0
        }
          , c = {
            begin: "{",
            end: "}",
            contains: [s],
            illegal: `\\n`,
            relevance: 0
        }
          , l = {
            begin: "\\[",
            end: "\\]",
            contains: [s],
            illegal: `\\n`,
            relevance: 0
        }
          , a = [{
            className: "attr",
            variants: [{
                begin: "\\w[\\w :\\/.-]*:(?=[ 	]|$)"
            }, {
                begin: '"\\w[\\w :\\/.-]*":(?=[ 	]|$)'
            }, {
                begin: "'\\w[\\w :\\/.-]*':(?=[ 	]|$)"
            }]
        }, {
            className: "meta",
            begin: "^---s*$",
            relevance: 10
        }, {
            className: "string",
            begin: "[\\|>]([0-9]?[+-])?[ ]*\\n( *)[\\S ]+\\n(\\2[\\S ]+\\n?)*"
        }, {
            begin: "<%[%=-]?",
            end: "[%-]?%>",
            subLanguage: "ruby",
            excludeBegin: !0,
            excludeEnd: !0,
            relevance: 0
        }, {
            className: "type",
            begin: "!\\w+!" + t
        }, {
            className: "type",
            begin: "!<" + t + ">"
        }, {
            className: "type",
            begin: "!" + t
        }, {
            className: "type",
            begin: "!!" + t
        }, {
            className: "meta",
            begin: "&" + e.UNDERSCORE_IDENT_RE + "$"
        }, {
            className: "meta",
            begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
        }, {
            className: "bullet",
            begin: "\\-(?=[ ]|$)",
            relevance: 0
        }, e.HASH_COMMENT_MODE, {
            beginKeywords: n,
            keywords: {
                literal: n
            }
        }, {
            className: "number",
            begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
        }, {
            className: "number",
            begin: e.C_NUMBER_RE + "\\b"
        }, c, l, i]
          , o = [...a];
        return o.pop(),
        o.push(r),
        s.contains = o,
        {
            name: "YAML",
            case_insensitive: !0,
            aliases: ["yml", "YAML"],
            contains: a
        }
    }
}())


