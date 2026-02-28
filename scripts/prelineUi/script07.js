(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [78],
  {
    430: (e, t, i) => {
      "use strict";
      i.d(t, { t: () => r });
      let r = (0, i(2115).createContext)(null);
    },
    901: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "RouterContext", {
          enumerable: !0,
          get: function () {
            return r;
          },
        });
      let r = i(8229)._(i(2115)).default.createContext(null);
    },
    1193: (e, t) => {
      "use strict";
      function i(e) {
        var t;
        let { config: i, src: r, width: n, quality: s } = e,
          o =
            s ||
            (null == (t = i.qualities) ? void 0 : t.reduce((e, t) => (Math.abs(t - 75) < Math.abs(e - 75) ? t : e))) ||
            75;
        return (
          i.path +
          "?url=" +
          encodeURIComponent(r) +
          "&w=" +
          n +
          "&q=" +
          o +
          (r.startsWith("/_next/static/media/") && 1 ? "&dpl=dpl_A7awJ1LesiXz1LAKc8fMGD3u3gZE" : "")
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "default", {
          enumerable: !0,
          get: function () {
            return r;
          },
        }),
        (i.__next_img_default = !0);
      let r = i;
    },
    1362: (e, t, i) => {
      "use strict";
      i.d(t, { D: () => u, ThemeProvider: () => h });
      var r = i(2115),
        n = (e, t, i, r, n, s, o, a) => {
          let l = document.documentElement,
            u = ["light", "dark"];
          function h(t) {
            var i;
            (Array.isArray(e) ? e : [e]).forEach((e) => {
              let i = "class" === e,
                r = i && s ? n.map((e) => s[e] || e) : n;
              i ? (l.classList.remove(...r), l.classList.add(s && s[t] ? s[t] : t)) : l.setAttribute(e, t);
            }),
              (i = t),
              a && u.includes(i) && (l.style.colorScheme = i);
          }
          if (r) h(r);
          else
            try {
              let e = localStorage.getItem(t) || i,
                r =
                  o && "system" === e
                    ? window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "dark"
                      : "light"
                    : e;
              h(r);
            } catch (e) {}
        },
        s = ["light", "dark"],
        o = "(prefers-color-scheme: dark)",
        a = r.createContext(void 0),
        l = { setTheme: (e) => {}, themes: [] },
        u = () => {
          var e;
          return null != (e = r.useContext(a)) ? e : l;
        },
        h = (e) => (r.useContext(a) ? r.createElement(r.Fragment, null, e.children) : r.createElement(c, { ...e })),
        d = ["light", "dark"],
        c = (e) => {
          let {
              forcedTheme: t,
              disableTransitionOnChange: i = !1,
              enableSystem: n = !0,
              enableColorScheme: l = !0,
              storageKey: u = "theme",
              themes: h = d,
              defaultTheme: c = n ? "system" : "light",
              attribute: v = "data-theme",
              value: y,
              children: b,
              nonce: x,
              scriptProps: w,
            } = e,
            [S, P] = r.useState(() => m(u, c)),
            [T, A] = r.useState(() => ("system" === S ? g() : S)),
            C = y ? Object.values(y) : h,
            E = r.useCallback(
              (e) => {
                let t = e;
                if (!t) return;
                "system" === e && n && (t = g());
                let r = y ? y[t] : t,
                  o = i ? f(x) : null,
                  a = document.documentElement,
                  u = (e) => {
                    "class" === e
                      ? (a.classList.remove(...C), r && a.classList.add(r))
                      : e.startsWith("data-") && (r ? a.setAttribute(e, r) : a.removeAttribute(e));
                  };
                if ((Array.isArray(v) ? v.forEach(u) : u(v), l)) {
                  let e = s.includes(c) ? c : null,
                    i = s.includes(t) ? t : e;
                  a.style.colorScheme = i;
                }
                null == o || o();
              },
              [x]
            ),
            k = r.useCallback(
              (e) => {
                let t = "function" == typeof e ? e(S) : e;
                P(t);
                try {
                  localStorage.setItem(u, t);
                } catch (e) {}
              },
              [S]
            ),
            M = r.useCallback(
              (e) => {
                A(g(e)), "system" === S && n && !t && E("system");
              },
              [S, t]
            );
          r.useEffect(() => {
            let e = window.matchMedia(o);
            return e.addListener(M), M(e), () => e.removeListener(M);
          }, [M]),
            r.useEffect(() => {
              let e = (e) => {
                e.key === u && (e.newValue ? P(e.newValue) : k(c));
              };
              return window.addEventListener("storage", e), () => window.removeEventListener("storage", e);
            }, [k]),
            r.useEffect(() => {
              E(null != t ? t : S);
            }, [t, S]);
          let j = r.useMemo(
            () => ({
              theme: S,
              setTheme: k,
              forcedTheme: t,
              resolvedTheme: "system" === S ? T : S,
              themes: n ? [...h, "system"] : h,
              systemTheme: n ? T : void 0,
            }),
            [S, k, t, T, n, h]
          );
          return r.createElement(
            a.Provider,
            { value: j },
            r.createElement(p, {
              forcedTheme: t,
              storageKey: u,
              attribute: v,
              enableSystem: n,
              enableColorScheme: l,
              defaultTheme: c,
              value: y,
              themes: h,
              nonce: x,
              scriptProps: w,
            }),
            b
          );
        },
        p = r.memo((e) => {
          let {
              forcedTheme: t,
              storageKey: i,
              attribute: s,
              enableSystem: o,
              enableColorScheme: a,
              defaultTheme: l,
              value: u,
              themes: h,
              nonce: d,
              scriptProps: c,
            } = e,
            p = JSON.stringify([s, i, l, t, h, u, o, a]).slice(1, -1);
          return r.createElement("script", {
            ...c,
            suppressHydrationWarning: !0,
            nonce: "",
            dangerouslySetInnerHTML: { __html: "(".concat(n.toString(), ")(").concat(p, ")") },
          });
        }),
        m = (e, t) => {
          let i;
          try {
            i = localStorage.getItem(e) || void 0;
          } catch (e) {}
          return i || t;
        },
        f = (e) => {
          let t = document.createElement("style");
          return (
            e && t.setAttribute("nonce", e),
            t.appendChild(
              document.createTextNode(
                "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
              )
            ),
            document.head.appendChild(t),
            () => {
              window.getComputedStyle(document.body),
                setTimeout(() => {
                  document.head.removeChild(t);
                }, 1);
            }
          );
        },
        g = (e) => (e || (e = window.matchMedia(o)), e.matches ? "dark" : "light");
    },
    1469: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        !(function (e, t) {
          for (var i in t) Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
        })(t, {
          default: function () {
            return l;
          },
          getImageProps: function () {
            return a;
          },
        });
      let r = i(8229),
        n = i(8883),
        s = i(3063),
        o = r._(i(1193));
      function a(e) {
        let { props: t } = (0, n.getImgProps)(e, {
          defaultLoader: o.default,
          imgConf: {
            deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
            imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
            path: "/_next/image",
            loader: "default",
            dangerouslyAllowSVG: !1,
            unoptimized: !1,
          },
        });
        for (let [e, i] of Object.entries(t)) void 0 === i && delete t[e];
        return { props: t };
      }
      let l = s.Image;
    },
    2085: (e, t, i) => {
      "use strict";
      i.d(t, { F: () => o });
      var r = i(2596);
      let n = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
        s = r.$,
        o = (e, t) => (i) => {
          var r;
          if ((null == t ? void 0 : t.variants) == null)
            return s(e, null == i ? void 0 : i.class, null == i ? void 0 : i.className);
          let { variants: o, defaultVariants: a } = t,
            l = Object.keys(o).map((e) => {
              let t = null == i ? void 0 : i[e],
                r = null == a ? void 0 : a[e];
              if (null === t) return null;
              let s = n(t) || n(r);
              return o[e][s];
            }),
            u =
              i &&
              Object.entries(i).reduce((e, t) => {
                let [i, r] = t;
                return void 0 === r || (e[i] = r), e;
              }, {});
          return s(
            e,
            l,
            null == t || null == (r = t.compoundVariants)
              ? void 0
              : r.reduce((e, t) => {
                  let { class: i, className: r, ...n } = t;
                  return Object.entries(n).every((e) => {
                    let [t, i] = e;
                    return Array.isArray(i) ? i.includes({ ...a, ...u }[t]) : { ...a, ...u }[t] === i;
                  })
                    ? [...e, i, r]
                    : e;
                }, []),
            null == i ? void 0 : i.class,
            null == i ? void 0 : i.className
          );
        };
    },
    2098: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("sun", [
        ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
        ["path", { d: "M12 2v2", key: "tus03m" }],
        ["path", { d: "M12 20v2", key: "1lh1kg" }],
        ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
        ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
        ["path", { d: "M2 12h2", key: "1t8f8n" }],
        ["path", { d: "M20 12h2", key: "1q8mjw" }],
        ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
        ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
      ]);
    },
    2138: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("arrow-right", [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
      ]);
    },
    2269: (e, t, i) => {
      "use strict";
      var r = i(9509);
      i(8375);
      var n = i(2115),
        s = (function (e) {
          return e && "object" == typeof e && "default" in e ? e : { default: e };
        })(n),
        o = void 0 !== r && r.env && !0,
        a = function (e) {
          return "[object String]" === Object.prototype.toString.call(e);
        },
        l = (function () {
          function e(e) {
            var t = void 0 === e ? {} : e,
              i = t.name,
              r = void 0 === i ? "stylesheet" : i,
              n = t.optimizeForSpeed,
              s = void 0 === n ? o : n;
            u(a(r), "`name` must be a string"),
              (this._name = r),
              (this._deletedRulePlaceholder = "#" + r + "-deleted-rule____{}"),
              u("boolean" == typeof s, "`optimizeForSpeed` must be a boolean"),
              (this._optimizeForSpeed = s),
              (this._serverSheet = void 0),
              (this._tags = []),
              (this._injected = !1),
              (this._rulesCount = 0);
            var l = "undefined" != typeof window && document.querySelector('meta[property="csp-nonce"]');
            this._nonce = l ? l.getAttribute("content") : null;
          }
          var t,
            i = e.prototype;
          return (
            (i.setOptimizeForSpeed = function (e) {
              u("boolean" == typeof e, "`setOptimizeForSpeed` accepts a boolean"),
                u(0 === this._rulesCount, "optimizeForSpeed cannot be when rules have already been inserted"),
                this.flush(),
                (this._optimizeForSpeed = e),
                this.inject();
            }),
            (i.isOptimizeForSpeed = function () {
              return this._optimizeForSpeed;
            }),
            (i.inject = function () {
              var e = this;
              if (
                (u(!this._injected, "sheet already injected"),
                (this._injected = !0),
                "undefined" != typeof window && this._optimizeForSpeed)
              ) {
                (this._tags[0] = this.makeStyleTag(this._name)),
                  (this._optimizeForSpeed = "insertRule" in this.getSheet()),
                  this._optimizeForSpeed ||
                    (o ||
                      console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode."),
                    this.flush(),
                    (this._injected = !0));
                return;
              }
              this._serverSheet = {
                cssRules: [],
                insertRule: function (t, i) {
                  return (
                    "number" == typeof i
                      ? (e._serverSheet.cssRules[i] = { cssText: t })
                      : e._serverSheet.cssRules.push({ cssText: t }),
                    i
                  );
                },
                deleteRule: function (t) {
                  e._serverSheet.cssRules[t] = null;
                },
              };
            }),
            (i.getSheetForTag = function (e) {
              if (e.sheet) return e.sheet;
              for (var t = 0; t < document.styleSheets.length; t++)
                if (document.styleSheets[t].ownerNode === e) return document.styleSheets[t];
            }),
            (i.getSheet = function () {
              return this.getSheetForTag(this._tags[this._tags.length - 1]);
            }),
            (i.insertRule = function (e, t) {
              if ((u(a(e), "`insertRule` accepts only strings"), "undefined" == typeof window))
                return (
                  "number" != typeof t && (t = this._serverSheet.cssRules.length),
                  this._serverSheet.insertRule(e, t),
                  this._rulesCount++
                );
              if (this._optimizeForSpeed) {
                var i = this.getSheet();
                "number" != typeof t && (t = i.cssRules.length);
                try {
                  i.insertRule(e, t);
                } catch (t) {
                  return (
                    o ||
                      console.warn(
                        "StyleSheet: illegal rule: \n\n" +
                          e +
                          "\n\nSee https://stackoverflow.com/q/20007992 for more info"
                      ),
                    -1
                  );
                }
              } else {
                var r = this._tags[t];
                this._tags.push(this.makeStyleTag(this._name, e, r));
              }
              return this._rulesCount++;
            }),
            (i.replaceRule = function (e, t) {
              if (this._optimizeForSpeed || "undefined" == typeof window) {
                var i = "undefined" != typeof window ? this.getSheet() : this._serverSheet;
                if ((t.trim() || (t = this._deletedRulePlaceholder), !i.cssRules[e])) return e;
                i.deleteRule(e);
                try {
                  i.insertRule(t, e);
                } catch (r) {
                  o ||
                    console.warn(
                      "StyleSheet: illegal rule: \n\n" +
                        t +
                        "\n\nSee https://stackoverflow.com/q/20007992 for more info"
                    ),
                    i.insertRule(this._deletedRulePlaceholder, e);
                }
              } else {
                var r = this._tags[e];
                u(r, "old rule at index `" + e + "` not found"), (r.textContent = t);
              }
              return e;
            }),
            (i.deleteRule = function (e) {
              if ("undefined" == typeof window) return void this._serverSheet.deleteRule(e);
              if (this._optimizeForSpeed) this.replaceRule(e, "");
              else {
                var t = this._tags[e];
                u(t, "rule at index `" + e + "` not found"), t.parentNode.removeChild(t), (this._tags[e] = null);
              }
            }),
            (i.flush = function () {
              (this._injected = !1),
                (this._rulesCount = 0),
                "undefined" != typeof window
                  ? (this._tags.forEach(function (e) {
                      return e && e.parentNode.removeChild(e);
                    }),
                    (this._tags = []))
                  : (this._serverSheet.cssRules = []);
            }),
            (i.cssRules = function () {
              var e = this;
              return "undefined" == typeof window
                ? this._serverSheet.cssRules
                : this._tags.reduce(function (t, i) {
                    return (
                      i
                        ? (t = t.concat(
                            Array.prototype.map.call(e.getSheetForTag(i).cssRules, function (t) {
                              return t.cssText === e._deletedRulePlaceholder ? null : t;
                            })
                          ))
                        : t.push(null),
                      t
                    );
                  }, []);
            }),
            (i.makeStyleTag = function (e, t, i) {
              t && u(a(t), "makeStyleTag accepts only strings as second parameter");
              var r = document.createElement("style");
              this._nonce && r.setAttribute("nonce", this._nonce),
                (r.type = "text/css"),
                r.setAttribute("data-" + e, ""),
                t && r.appendChild(document.createTextNode(t));
              var n = document.head || document.getElementsByTagName("head")[0];
              return i ? n.insertBefore(r, i) : n.appendChild(r), r;
            }),
            (t = [
              {
                key: "length",
                get: function () {
                  return this._rulesCount;
                },
              },
            ]),
            (function (e, t) {
              for (var i = 0; i < t.length; i++) {
                var r = t[i];
                (r.enumerable = r.enumerable || !1),
                  (r.configurable = !0),
                  "value" in r && (r.writable = !0),
                  Object.defineProperty(e, r.key, r);
              }
            })(e.prototype, t),
            e
          );
        })();
      function u(e, t) {
        if (!e) throw Error("StyleSheet: " + t + ".");
      }
      var h = function (e) {
          for (var t = 5381, i = e.length; i; ) t = (33 * t) ^ e.charCodeAt(--i);
          return t >>> 0;
        },
        d = {};
      function c(e, t) {
        if (!t) return "jsx-" + e;
        var i = String(t),
          r = e + i;
        return d[r] || (d[r] = "jsx-" + h(e + "-" + i)), d[r];
      }
      function p(e, t) {
        "undefined" == typeof window && (t = t.replace(/\/style/gi, "\\/style"));
        var i = e + t;
        return d[i] || (d[i] = t.replace(/__jsx-style-dynamic-selector/g, e)), d[i];
      }
      var m = (function () {
          function e(e) {
            var t = void 0 === e ? {} : e,
              i = t.styleSheet,
              r = void 0 === i ? null : i,
              n = t.optimizeForSpeed,
              s = void 0 !== n && n;
            (this._sheet = r || new l({ name: "styled-jsx", optimizeForSpeed: s })),
              this._sheet.inject(),
              r &&
                "boolean" == typeof s &&
                (this._sheet.setOptimizeForSpeed(s), (this._optimizeForSpeed = this._sheet.isOptimizeForSpeed())),
              (this._fromServer = void 0),
              (this._indices = {}),
              (this._instancesCounts = {});
          }
          var t = e.prototype;
          return (
            (t.add = function (e) {
              var t = this;
              void 0 === this._optimizeForSpeed &&
                ((this._optimizeForSpeed = Array.isArray(e.children)),
                this._sheet.setOptimizeForSpeed(this._optimizeForSpeed),
                (this._optimizeForSpeed = this._sheet.isOptimizeForSpeed())),
                "undefined" == typeof window ||
                  this._fromServer ||
                  ((this._fromServer = this.selectFromServer()),
                  (this._instancesCounts = Object.keys(this._fromServer).reduce(function (e, t) {
                    return (e[t] = 0), e;
                  }, {})));
              var i = this.getIdAndRules(e),
                r = i.styleId,
                n = i.rules;
              if (r in this._instancesCounts) {
                this._instancesCounts[r] += 1;
                return;
              }
              var s = n
                .map(function (e) {
                  return t._sheet.insertRule(e);
                })
                .filter(function (e) {
                  return -1 !== e;
                });
              (this._indices[r] = s), (this._instancesCounts[r] = 1);
            }),
            (t.remove = function (e) {
              var t = this,
                i = this.getIdAndRules(e).styleId;
              if (
                ((function (e, t) {
                  if (!e) throw Error("StyleSheetRegistry: " + t + ".");
                })(i in this._instancesCounts, "styleId: `" + i + "` not found"),
                (this._instancesCounts[i] -= 1),
                this._instancesCounts[i] < 1)
              ) {
                var r = this._fromServer && this._fromServer[i];
                r
                  ? (r.parentNode.removeChild(r), delete this._fromServer[i])
                  : (this._indices[i].forEach(function (e) {
                      return t._sheet.deleteRule(e);
                    }),
                    delete this._indices[i]),
                  delete this._instancesCounts[i];
              }
            }),
            (t.update = function (e, t) {
              this.add(t), this.remove(e);
            }),
            (t.flush = function () {
              this._sheet.flush(),
                this._sheet.inject(),
                (this._fromServer = void 0),
                (this._indices = {}),
                (this._instancesCounts = {});
            }),
            (t.cssRules = function () {
              var e = this,
                t = this._fromServer
                  ? Object.keys(this._fromServer).map(function (t) {
                      return [t, e._fromServer[t]];
                    })
                  : [],
                i = this._sheet.cssRules();
              return t.concat(
                Object.keys(this._indices)
                  .map(function (t) {
                    return [
                      t,
                      e._indices[t]
                        .map(function (e) {
                          return i[e].cssText;
                        })
                        .join(e._optimizeForSpeed ? "" : "\n"),
                    ];
                  })
                  .filter(function (e) {
                    return !!e[1];
                  })
              );
            }),
            (t.styles = function (e) {
              var t, i;
              return (
                (t = this.cssRules()),
                void 0 === (i = e) && (i = {}),
                t.map(function (e) {
                  var t = e[0],
                    r = e[1];
                  return s.default.createElement("style", {
                    id: "__" + t,
                    key: "__" + t,
                    nonce: i.nonce ? i.nonce : void 0,
                    dangerouslySetInnerHTML: { __html: r },
                  });
                })
              );
            }),
            (t.getIdAndRules = function (e) {
              var t = e.children,
                i = e.dynamic,
                r = e.id;
              if (i) {
                var n = c(r, i);
                return {
                  styleId: n,
                  rules: Array.isArray(t)
                    ? t.map(function (e) {
                        return p(n, e);
                      })
                    : [p(n, t)],
                };
              }
              return { styleId: c(r), rules: Array.isArray(t) ? t : [t] };
            }),
            (t.selectFromServer = function () {
              return Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]')).reduce(function (e, t) {
                return (e[t.id.slice(2)] = t), e;
              }, {});
            }),
            e
          );
        })(),
        f = n.createContext(null);
      f.displayName = "StyleSheetContext";
      var g = s.default.useInsertionEffect || s.default.useLayoutEffect,
        v = "undefined" != typeof window ? new m() : void 0;
      function y(e) {
        var t = v || n.useContext(f);
        return (
          t &&
            ("undefined" == typeof window
              ? t.add(e)
              : g(
                  function () {
                    return (
                      t.add(e),
                      function () {
                        t.remove(e);
                      }
                    );
                  },
                  [e.id, String(e.dynamic)]
                )),
          null
        );
      }
      (y.dynamic = function (e) {
        return e
          .map(function (e) {
            return c(e[0], e[1]);
          })
          .join(" ");
      }),
        (t.style = y);
    },
    2464: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "AmpStateContext", {
          enumerable: !0,
          get: function () {
            return r;
          },
        });
      let r = i(8229)._(i(2115)).default.createContext({});
    },
    2596: (e, t, i) => {
      "use strict";
      function r() {
        for (var e, t, i = 0, r = "", n = arguments.length; i < n; i++)
          (e = arguments[i]) &&
            (t = (function e(t) {
              var i,
                r,
                n = "";
              if ("string" == typeof t || "number" == typeof t) n += t;
              else if ("object" == typeof t)
                if (Array.isArray(t)) {
                  var s = t.length;
                  for (i = 0; i < s; i++) t[i] && (r = e(t[i])) && (n && (n += " "), (n += r));
                } else for (r in t) t[r] && (n && (n += " "), (n += r));
              return n;
            })(e)) &&
            (r && (r += " "), (r += t));
        return r;
      }
      i.d(t, { $: () => r });
    },
    2801: (e, t, i) => {
      "use strict";
      i.d(t, { B: () => r });
      let r = "undefined" != typeof window;
    },
    3063: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "Image", {
          enumerable: !0,
          get: function () {
            return x;
          },
        });
      let r = i(8229),
        n = i(6966),
        s = i(5155),
        o = n._(i(2115)),
        a = r._(i(7650)),
        l = r._(i(5564)),
        u = i(8883),
        h = i(5840),
        d = i(6752);
      i(3230);
      let c = i(901),
        p = r._(i(1193)),
        m = i(6654),
        f = {
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
          path: "/_next/image",
          loader: "default",
          dangerouslyAllowSVG: !1,
          unoptimized: !1,
        };
      function g(e, t, i, r, n, s, o) {
        let a = null == e ? void 0 : e.src;
        e &&
          e["data-loaded-src"] !== a &&
          ((e["data-loaded-src"] = a),
          ("decode" in e ? e.decode() : Promise.resolve())
            .catch(() => {})
            .then(() => {
              if (e.parentElement && e.isConnected) {
                if (("empty" !== t && n(!0), null == i ? void 0 : i.current)) {
                  let t = new Event("load");
                  Object.defineProperty(t, "target", { writable: !1, value: e });
                  let r = !1,
                    n = !1;
                  i.current({
                    ...t,
                    nativeEvent: t,
                    currentTarget: e,
                    target: e,
                    isDefaultPrevented: () => r,
                    isPropagationStopped: () => n,
                    persist: () => {},
                    preventDefault: () => {
                      (r = !0), t.preventDefault();
                    },
                    stopPropagation: () => {
                      (n = !0), t.stopPropagation();
                    },
                  });
                }
                (null == r ? void 0 : r.current) && r.current(e);
              }
            }));
      }
      function v(e) {
        return o.use ? { fetchPriority: e } : { fetchpriority: e };
      }
      let y = (0, o.forwardRef)((e, t) => {
        let {
            src: i,
            srcSet: r,
            sizes: n,
            height: a,
            width: l,
            decoding: u,
            className: h,
            style: d,
            fetchPriority: c,
            placeholder: p,
            loading: f,
            unoptimized: y,
            fill: b,
            onLoadRef: x,
            onLoadingCompleteRef: w,
            setBlurComplete: S,
            setShowAltText: P,
            sizesInput: T,
            onLoad: A,
            onError: C,
            ...E
          } = e,
          k = (0, o.useCallback)(
            (e) => {
              e && (C && (e.src = e.src), e.complete && g(e, p, x, w, S, y, T));
            },
            [i, p, x, w, S, C, y, T]
          ),
          M = (0, m.useMergedRef)(t, k);
        return (0, s.jsx)("img", {
          ...E,
          ...v(c),
          loading: f,
          width: l,
          height: a,
          decoding: u,
          "data-nimg": b ? "fill" : "1",
          className: h,
          style: d,
          sizes: n,
          srcSet: r,
          src: i,
          ref: M,
          onLoad: (e) => {
            g(e.currentTarget, p, x, w, S, y, T);
          },
          onError: (e) => {
            P(!0), "empty" !== p && S(!0), C && C(e);
          },
        });
      });
      function b(e) {
        let { isAppRouter: t, imgAttributes: i } = e,
          r = {
            as: "image",
            imageSrcSet: i.srcSet,
            imageSizes: i.sizes,
            crossOrigin: i.crossOrigin,
            referrerPolicy: i.referrerPolicy,
            ...v(i.fetchPriority),
          };
        return t && a.default.preload
          ? (a.default.preload(i.src, r), null)
          : (0, s.jsx)(l.default, {
              children: (0, s.jsx)(
                "link",
                { rel: "preload", href: i.srcSet ? void 0 : i.src, ...r },
                "__nimg-" + i.src + i.srcSet + i.sizes
              ),
            });
      }
      let x = (0, o.forwardRef)((e, t) => {
        let i = (0, o.useContext)(c.RouterContext),
          r = (0, o.useContext)(d.ImageConfigContext),
          n = (0, o.useMemo)(() => {
            var e;
            let t = f || r || h.imageConfigDefault,
              i = [...t.deviceSizes, ...t.imageSizes].sort((e, t) => e - t),
              n = t.deviceSizes.sort((e, t) => e - t),
              s = null == (e = t.qualities) ? void 0 : e.sort((e, t) => e - t);
            return { ...t, allSizes: i, deviceSizes: n, qualities: s };
          }, [r]),
          { onLoad: a, onLoadingComplete: l } = e,
          m = (0, o.useRef)(a);
        (0, o.useEffect)(() => {
          m.current = a;
        }, [a]);
        let g = (0, o.useRef)(l);
        (0, o.useEffect)(() => {
          g.current = l;
        }, [l]);
        let [v, x] = (0, o.useState)(!1),
          [w, S] = (0, o.useState)(!1),
          { props: P, meta: T } = (0, u.getImgProps)(e, {
            defaultLoader: p.default,
            imgConf: n,
            blurComplete: v,
            showAltText: w,
          });
        return (0, s.jsxs)(s.Fragment, {
          children: [
            (0, s.jsx)(y, {
              ...P,
              unoptimized: T.unoptimized,
              placeholder: T.placeholder,
              fill: T.fill,
              onLoadRef: m,
              onLoadingCompleteRef: g,
              setBlurComplete: x,
              setShowAltText: S,
              sizesInput: e.sizes,
              ref: t,
            }),
            T.priority ? (0, s.jsx)(b, { isAppRouter: !i, imgAttributes: P }) : null,
          ],
        });
      });
      ("function" == typeof t.default || ("object" == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, "__esModule", { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    3234: (e) => {
      e.exports = {
        style: { fontFamily: "'Geist', 'Geist Fallback'", fontStyle: "normal" },
        className: "__className_0f0a25",
      };
    },
    3509: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("moon", [["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z", key: "a7tn18" }]]);
    },
    4416: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("x", [
        ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
        ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
      ]);
    },
    4616: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("plus", [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }],
      ]);
    },
    4624: (e, t, i) => {
      "use strict";
      i.d(t, { DX: () => o });
      var r = i(2115);
      function n(e, t) {
        if ("function" == typeof e) return e(t);
        null != e && (e.current = t);
      }
      var s = i(5155),
        o = r.forwardRef((e, t) => {
          let { children: i, ...n } = e,
            o = r.Children.toArray(i),
            l = o.find(u);
          if (l) {
            let e = l.props.children,
              i = o.map((t) =>
                t !== l
                  ? t
                  : r.Children.count(e) > 1
                    ? r.Children.only(null)
                    : r.isValidElement(e)
                      ? e.props.children
                      : null
              );
            return (0, s.jsx)(a, { ...n, ref: t, children: r.isValidElement(e) ? r.cloneElement(e, void 0, i) : null });
          }
          return (0, s.jsx)(a, { ...n, ref: t, children: i });
        });
      o.displayName = "Slot";
      var a = r.forwardRef((e, t) => {
        let { children: i, ...s } = e;
        if (r.isValidElement(i)) {
          let e = (function (e) {
            let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get,
              i = t && "isReactWarning" in t && t.isReactWarning;
            return i
              ? e.ref
              : (i = (t = Object.getOwnPropertyDescriptor(e, "ref")?.get) && "isReactWarning" in t && t.isReactWarning)
                ? e.props.ref
                : e.props.ref || e.ref;
          })(i);
          return r.cloneElement(i, {
            ...(function (e, t) {
              let i = { ...t };
              for (let r in t) {
                let n = e[r],
                  s = t[r];
                /^on[A-Z]/.test(r)
                  ? n && s
                    ? (i[r] = (...e) => {
                        s(...e), n(...e);
                      })
                    : n && (i[r] = n)
                  : "style" === r
                    ? (i[r] = { ...n, ...s })
                    : "className" === r && (i[r] = [n, s].filter(Boolean).join(" "));
              }
              return { ...e, ...i };
            })(s, i.props),
            ref: t
              ? (function (...e) {
                  return (t) => {
                    let i = !1,
                      r = e.map((e) => {
                        let r = n(e, t);
                        return i || "function" != typeof r || (i = !0), r;
                      });
                    if (i)
                      return () => {
                        for (let t = 0; t < r.length; t++) {
                          let i = r[t];
                          "function" == typeof i ? i() : n(e[t], null);
                        }
                      };
                  };
                })(t, e)
              : e,
          });
        }
        return r.Children.count(i) > 1 ? r.Children.only(null) : null;
      });
      a.displayName = "SlotClone";
      var l = ({ children: e }) => (0, s.jsx)(s.Fragment, { children: e });
      function u(e) {
        return r.isValidElement(e) && e.type === l;
      }
    },
    4783: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("menu", [
        ["path", { d: "M4 12h16", key: "1lakjw" }],
        ["path", { d: "M4 18h16", key: "19g7jn" }],
        ["path", { d: "M4 6h16", key: "1o0s65" }],
      ]);
    },
    4905: (e, t, i) => {
      "use strict";
      i.d(t, { xQ: () => s });
      var r = i(2115),
        n = i(430);
      function s(e = !0) {
        let t = (0, r.useContext)(n.t);
        if (null === t) return [!0, null];
        let { isPresent: i, onExitComplete: o, register: a } = t,
          l = (0, r.useId)();
        (0, r.useEffect)(() => {
          e && a(l);
        }, [e]);
        let u = (0, r.useCallback)(() => e && o && o(l), [l, o, e]);
        return !i && o ? [!1, u] : [!0];
      }
    },
    5029: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "default", {
          enumerable: !0,
          get: function () {
            return o;
          },
        });
      let r = i(2115),
        n = r.useLayoutEffect,
        s = r.useEffect;
      function o(e) {
        let { headManager: t, reduceComponentsToState: i } = e;
        function o() {
          if (t && t.mountedInstances) {
            let n = r.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));
            t.updateHead(i(n, e));
          }
        }
        return (
          n(() => {
            var i;
            return (
              null == t || null == (i = t.mountedInstances) || i.add(e.children),
              () => {
                var i;
                null == t || null == (i = t.mountedInstances) || i.delete(e.children);
              }
            );
          }),
          n(
            () => (
              t && (t._pendingUpdate = o),
              () => {
                t && (t._pendingUpdate = o);
              }
            )
          ),
          s(
            () => (
              t && t._pendingUpdate && (t._pendingUpdate(), (t._pendingUpdate = null)),
              () => {
                t && t._pendingUpdate && (t._pendingUpdate(), (t._pendingUpdate = null));
              }
            )
          ),
          null
        );
      }
    },
    5084: (e, t, i) => {
      "use strict";
      i.d(t, { N: () => v });
      var r = i(5155),
        n = i(2115),
        s = i(7728),
        o = i(6168),
        a = i(430),
        l = i(7471);
      class u extends n.Component {
        getSnapshotBeforeUpdate(e) {
          let t = this.props.childRef.current;
          if (t && e.isPresent && !this.props.isPresent) {
            let e = t.offsetParent,
              i = (e instanceof HTMLElement && e.offsetWidth) || 0,
              r = this.props.sizeRef.current;
            (r.height = t.offsetHeight || 0),
              (r.width = t.offsetWidth || 0),
              (r.top = t.offsetTop),
              (r.left = t.offsetLeft),
              (r.right = i - r.width - r.left);
          }
          return null;
        }
        componentDidUpdate() {}
        render() {
          return this.props.children;
        }
      }
      function h(e) {
        let { children: t, isPresent: i, anchorX: s } = e,
          o = (0, n.useId)(),
          a = (0, n.useRef)(null),
          h = (0, n.useRef)({ width: 0, height: 0, top: 0, left: 0, right: 0 }),
          { nonce: d } = (0, n.useContext)(l.Q);
        return (
          (0, n.useInsertionEffect)(() => {
            let { width: e, height: t, top: r, left: n, right: l } = h.current;
            if (i || !a.current || !e || !t) return;
            a.current.dataset.motionPopId = o;
            let u = document.createElement("style");
            return (
              d && (u.nonce = d),
              document.head.appendChild(u),
              u.sheet &&
                u.sheet.insertRule(
                  '\n          [data-motion-pop-id="'
                    .concat(o, '"] {\n            position: absolute !important;\n            width: ')
                    .concat(e, "px !important;\n            height: ")
                    .concat(t, "px !important;\n            ")
                    .concat(
                      "left" === s ? "left: ".concat(n) : "right: ".concat(l),
                      "px !important;\n            top: "
                    )
                    .concat(r, "px !important;\n          }\n        ")
                ),
              () => {
                document.head.removeChild(u);
              }
            );
          }, [i]),
          (0, r.jsx)(u, { isPresent: i, childRef: a, sizeRef: h, children: n.cloneElement(t, { ref: a }) })
        );
      }
      let d = (e) => {
        let {
            children: t,
            initial: i,
            isPresent: s,
            onExitComplete: l,
            custom: u,
            presenceAffectsLayout: d,
            mode: p,
            anchorX: m,
          } = e,
          f = (0, o.M)(c),
          g = (0, n.useId)(),
          v = (0, n.useCallback)(
            (e) => {
              for (let t of (f.set(e, !0), f.values())) if (!t) return;
              l && l();
            },
            [f, l]
          ),
          y = (0, n.useMemo)(
            () => ({
              id: g,
              initial: i,
              isPresent: s,
              custom: u,
              onExitComplete: v,
              register: (e) => (f.set(e, !1), () => f.delete(e)),
            }),
            d ? [Math.random(), v] : [s, v]
          );
        return (
          (0, n.useMemo)(() => {
            f.forEach((e, t) => f.set(t, !1));
          }, [s]),
          n.useEffect(() => {
            s || f.size || !l || l();
          }, [s]),
          "popLayout" === p && (t = (0, r.jsx)(h, { isPresent: s, anchorX: m, children: t })),
          (0, r.jsx)(a.t.Provider, { value: y, children: t })
        );
      };
      function c() {
        return new Map();
      }
      var p = i(4905);
      let m = (e) => e.key || "";
      function f(e) {
        let t = [];
        return (
          n.Children.forEach(e, (e) => {
            (0, n.isValidElement)(e) && t.push(e);
          }),
          t
        );
      }
      var g = i(9025);
      let v = (e) => {
        let {
            children: t,
            custom: i,
            initial: a = !0,
            onExitComplete: l,
            presenceAffectsLayout: u = !0,
            mode: h = "sync",
            propagate: c = !1,
            anchorX: v = "left",
          } = e,
          [y, b] = (0, p.xQ)(c),
          x = (0, n.useMemo)(() => f(t), [t]),
          w = c && !y ? [] : x.map(m),
          S = (0, n.useRef)(!0),
          P = (0, n.useRef)(x),
          T = (0, o.M)(() => new Map()),
          [A, C] = (0, n.useState)(x),
          [E, k] = (0, n.useState)(x);
        (0, g.E)(() => {
          (S.current = !1), (P.current = x);
          for (let e = 0; e < E.length; e++) {
            let t = m(E[e]);
            w.includes(t) ? T.delete(t) : !0 !== T.get(t) && T.set(t, !1);
          }
        }, [E, w.length, w.join("-")]);
        let M = [];
        if (x !== A) {
          let e = [...x];
          for (let t = 0; t < E.length; t++) {
            let i = E[t],
              r = m(i);
            w.includes(r) || (e.splice(t, 0, i), M.push(i));
          }
          "wait" === h && M.length && (e = M), k(f(e)), C(x);
          return;
        }
        let { forceRender: j } = (0, n.useContext)(s.L);
        return (0, r.jsx)(r.Fragment, {
          children: E.map((e) => {
            let t = m(e),
              n = (!c || !!y) && (x === E || w.includes(t));
            return (0, r.jsx)(
              d,
              {
                isPresent: n,
                initial: (!S.current || !!a) && void 0,
                custom: n ? void 0 : i,
                presenceAffectsLayout: u,
                mode: h,
                onExitComplete: n
                  ? void 0
                  : () => {
                      if (!T.has(t)) return;
                      T.set(t, !0);
                      let e = !0;
                      T.forEach((t) => {
                        t || (e = !1);
                      }),
                        e && (null == j || j(), k(P.current), c && (null == b || b()), l && l());
                    },
                anchorX: v,
                children: e,
              },
              t
            );
          }),
        });
      };
    },
    5100: (e, t) => {
      "use strict";
      function i(e) {
        let { widthInt: t, heightInt: i, blurWidth: r, blurHeight: n, blurDataURL: s, objectFit: o } = e,
          a = r ? 40 * r : t,
          l = n ? 40 * n : i,
          u = a && l ? "viewBox='0 0 " + a + " " + l + "'" : "";
        return (
          "%3Csvg xmlns='http://www.w3.org/2000/svg' " +
          u +
          "%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='" +
          (u ? "none" : "contain" === o ? "xMidYMid" : "cover" === o ? "xMidYMid slice" : "none") +
          "' style='filter: url(%23b);' href='" +
          s +
          "'/%3E%3C/svg%3E"
        );
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "getImageBlurSvg", {
          enumerable: !0,
          get: function () {
            return i;
          },
        });
    },
    5196: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
    },
    5564: (e, t, i) => {
      "use strict";
      var r = i(9509);
      Object.defineProperty(t, "__esModule", { value: !0 }),
        !(function (e, t) {
          for (var i in t) Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
        })(t, {
          default: function () {
            return g;
          },
          defaultHead: function () {
            return c;
          },
        });
      let n = i(8229),
        s = i(6966),
        o = i(5155),
        a = s._(i(2115)),
        l = n._(i(5029)),
        u = i(2464),
        h = i(2830),
        d = i(7544);
      function c(e) {
        void 0 === e && (e = !1);
        let t = [(0, o.jsx)("meta", { charSet: "utf-8" }, "charset")];
        return e || t.push((0, o.jsx)("meta", { name: "viewport", content: "width=device-width" }, "viewport")), t;
      }
      function p(e, t) {
        return "string" == typeof t || "number" == typeof t
          ? e
          : t.type === a.default.Fragment
            ? e.concat(
                a.default.Children.toArray(t.props.children).reduce(
                  (e, t) => ("string" == typeof t || "number" == typeof t ? e : e.concat(t)),
                  []
                )
              )
            : e.concat(t);
      }
      i(3230);
      let m = ["name", "httpEquiv", "charSet", "itemProp"];
      function f(e, t) {
        let { inAmpMode: i } = t;
        return e
          .reduce(p, [])
          .reverse()
          .concat(c(i).reverse())
          .filter(
            (function () {
              let e = new Set(),
                t = new Set(),
                i = new Set(),
                r = {};
              return (n) => {
                let s = !0,
                  o = !1;
                if (n.key && "number" != typeof n.key && n.key.indexOf("$") > 0) {
                  o = !0;
                  let t = n.key.slice(n.key.indexOf("$") + 1);
                  e.has(t) ? (s = !1) : e.add(t);
                }
                switch (n.type) {
                  case "title":
                  case "base":
                    t.has(n.type) ? (s = !1) : t.add(n.type);
                    break;
                  case "meta":
                    for (let e = 0, t = m.length; e < t; e++) {
                      let t = m[e];
                      if (n.props.hasOwnProperty(t))
                        if ("charSet" === t) i.has(t) ? (s = !1) : i.add(t);
                        else {
                          let e = n.props[t],
                            i = r[t] || new Set();
                          ("name" !== t || !o) && i.has(e) ? (s = !1) : (i.add(e), (r[t] = i));
                        }
                    }
                }
                return s;
              };
            })()
          )
          .reverse()
          .map((e, t) => {
            let n = e.key || t;
            if (
              r.env.__NEXT_OPTIMIZE_FONTS &&
              !i &&
              "link" === e.type &&
              e.props.href &&
              ["https://fonts.googleapis.com/css", "https://use.typekit.net/"].some((t) => e.props.href.startsWith(t))
            ) {
              let t = { ...(e.props || {}) };
              return (
                (t["data-href"] = t.href),
                (t.href = void 0),
                (t["data-optimized-fonts"] = !0),
                a.default.cloneElement(e, t)
              );
            }
            return a.default.cloneElement(e, { key: n });
          });
      }
      let g = function (e) {
        let { children: t } = e,
          i = (0, a.useContext)(u.AmpStateContext),
          r = (0, a.useContext)(h.HeadManagerContext);
        return (0, o.jsx)(l.default, {
          reduceComponentsToState: f,
          headManager: r,
          inAmpMode: (0, d.isInAmpMode)(i),
          children: t,
        });
      };
      ("function" == typeof t.default || ("object" == typeof t.default && null !== t.default)) &&
        void 0 === t.default.__esModule &&
        (Object.defineProperty(t.default, "__esModule", { value: !0 }),
        Object.assign(t.default, t),
        (e.exports = t.default));
    },
    5840: (e, t) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        !(function (e, t) {
          for (var i in t) Object.defineProperty(e, i, { enumerable: !0, get: t[i] });
        })(t, {
          VALID_LOADERS: function () {
            return i;
          },
          imageConfigDefault: function () {
            return r;
          },
        });
      let i = ["default", "imgix", "cloudinary", "akamai", "custom"],
        r = {
          deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
          imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
          path: "/_next/image",
          loader: "default",
          loaderFile: "",
          domains: [],
          disableStaticImages: !1,
          minimumCacheTTL: 60,
          formats: ["image/webp"],
          dangerouslyAllowSVG: !1,
          contentSecurityPolicy: "script-src 'none'; frame-src 'none'; sandbox;",
          contentDispositionType: "attachment",
          localPatterns: void 0,
          remotePatterns: [],
          qualities: void 0,
          unoptimized: !1,
        };
    },
    6168: (e, t, i) => {
      "use strict";
      i.d(t, { M: () => n });
      var r = i(2115);
      function n(e) {
        let t = (0, r.useRef)(null);
        return null === t.current && (t.current = e()), t.current;
      }
    },
    6752: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "ImageConfigContext", {
          enumerable: !0,
          get: function () {
            return s;
          },
        });
      let r = i(8229)._(i(2115)),
        n = i(5840),
        s = r.default.createContext(n.imageConfigDefault);
    },
    6766: (e, t, i) => {
      "use strict";
      i.d(t, { default: () => n.a });
      var r = i(1469),
        n = i.n(r);
    },
    7471: (e, t, i) => {
      "use strict";
      i.d(t, { Q: () => r });
      let r = (0, i(2115).createContext)({ transformPagePoint: (e) => e, isStatic: !1, reducedMotion: "never" });
    },
    7544: (e, t) => {
      "use strict";
      function i(e) {
        let { ampFirst: t = !1, hybrid: i = !1, hasQuery: r = !1 } = void 0 === e ? {} : e;
        return t || (i && r);
      }
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "isInAmpMode", {
          enumerable: !0,
          get: function () {
            return i;
          },
        });
    },
    7712: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("minus", [["path", { d: "M5 12h14", key: "1ays0h" }]]);
    },
    7728: (e, t, i) => {
      "use strict";
      i.d(t, { L: () => r });
      let r = (0, i(2115).createContext)({});
    },
    8192: (e, t, i) => {
      "use strict";
      let r;
      function n(e) {
        return null !== e && "object" == typeof e && "function" == typeof e.start;
      }
      i.d(t, { P: () => sf });
      let s = (e) => Array.isArray(e);
      function o(e, t) {
        if (!Array.isArray(t)) return !1;
        let i = t.length;
        if (i !== e.length) return !1;
        for (let r = 0; r < i; r++) if (t[r] !== e[r]) return !1;
        return !0;
      }
      function a(e) {
        return "string" == typeof e || Array.isArray(e);
      }
      function l(e) {
        let t = [{}, {}];
        return (
          null == e ||
            e.values.forEach((e, i) => {
              (t[0][i] = e.get()), (t[1][i] = e.getVelocity());
            }),
          t
        );
      }
      function u(e, t, i, r) {
        if ("function" == typeof t) {
          let [n, s] = l(r);
          t = t(void 0 !== i ? i : e.custom, n, s);
        }
        if (("string" == typeof t && (t = e.variants && e.variants[t]), "function" == typeof t)) {
          let [n, s] = l(r);
          t = t(void 0 !== i ? i : e.custom, n, s);
        }
        return t;
      }
      function h(e, t, i) {
        let r = e.getProps();
        return u(r, t, void 0 !== i ? i : r.custom, e);
      }
      let d = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
        c = ["initial", ...d];
      function p(e, t) {
        return e ? e[t] || e.default || e : void 0;
      }
      let m = [
          "transformPerspective",
          "x",
          "y",
          "z",
          "translateX",
          "translateY",
          "translateZ",
          "scale",
          "scaleX",
          "scaleY",
          "rotate",
          "rotateX",
          "rotateY",
          "rotateZ",
          "skew",
          "skewX",
          "skewY",
        ],
        f = new Set(m),
        g = new Set(["width", "height", "top", "left", "right", "bottom", ...m]),
        v = (e) => !!(e && "object" == typeof e && e.mix && e.toValue),
        y = (e) => (s(e) ? e[e.length - 1] || 0 : e),
        b = { skipAnimations: !1, useManualTiming: !1 },
        x = (e) => e,
        w = ["read", "resolveKeyframes", "update", "preRender", "render", "postRender"];
      function S(e, t) {
        let i = !1,
          r = !0,
          n = { delta: 0, timestamp: 0, isProcessing: !1 },
          s = () => (i = !0),
          o = w.reduce(
            (e, t) => (
              (e[t] = (function (e) {
                let t = new Set(),
                  i = new Set(),
                  r = !1,
                  n = !1,
                  s = new WeakSet(),
                  o = { delta: 0, timestamp: 0, isProcessing: !1 };
                function a(t) {
                  s.has(t) && (l.schedule(t), e()), t(o);
                }
                let l = {
                  schedule: (e, n = !1, o = !1) => {
                    let a = o && r ? t : i;
                    return n && s.add(e), a.has(e) || a.add(e), e;
                  },
                  cancel: (e) => {
                    i.delete(e), s.delete(e);
                  },
                  process: (e) => {
                    if (((o = e), r)) {
                      n = !0;
                      return;
                    }
                    (r = !0), ([t, i] = [i, t]), t.forEach(a), t.clear(), (r = !1), n && ((n = !1), l.process(e));
                  },
                };
                return l;
              })(s)),
              e
            ),
            {}
          ),
          { read: a, resolveKeyframes: l, update: u, preRender: h, render: d, postRender: c } = o,
          p = () => {
            let s = b.useManualTiming ? n.timestamp : performance.now();
            (i = !1),
              (n.delta = r ? 1e3 / 60 : Math.max(Math.min(s - n.timestamp, 40), 1)),
              (n.timestamp = s),
              (n.isProcessing = !0),
              a.process(n),
              l.process(n),
              u.process(n),
              h.process(n),
              d.process(n),
              c.process(n),
              (n.isProcessing = !1),
              i && t && ((r = !1), e(p));
          },
          m = () => {
            (i = !0), (r = !0), n.isProcessing || e(p);
          };
        return {
          schedule: w.reduce((e, t) => {
            let r = o[t];
            return (e[t] = (e, t = !1, n = !1) => (i || m(), r.schedule(e, t, n))), e;
          }, {}),
          cancel: (e) => {
            for (let t = 0; t < w.length; t++) o[w[t]].cancel(e);
          },
          state: n,
          steps: o,
        };
      }
      let {
        schedule: P,
        cancel: T,
        state: A,
        steps: C,
      } = S("undefined" != typeof requestAnimationFrame ? requestAnimationFrame : x, !0);
      function E() {
        r = void 0;
      }
      let k = {
        now: () => (void 0 === r && k.set(A.isProcessing || b.useManualTiming ? A.timestamp : performance.now()), r),
        set: (e) => {
          (r = e), queueMicrotask(E);
        },
      };
      function M(e, t) {
        -1 === e.indexOf(t) && e.push(t);
      }
      function j(e, t) {
        let i = e.indexOf(t);
        i > -1 && e.splice(i, 1);
      }
      class R {
        constructor() {
          this.subscriptions = [];
        }
        add(e) {
          return M(this.subscriptions, e), () => j(this.subscriptions, e);
        }
        notify(e, t, i) {
          let r = this.subscriptions.length;
          if (r)
            if (1 === r) this.subscriptions[0](e, t, i);
            else
              for (let n = 0; n < r; n++) {
                let r = this.subscriptions[n];
                r && r(e, t, i);
              }
        }
        getSize() {
          return this.subscriptions.length;
        }
        clear() {
          this.subscriptions.length = 0;
        }
      }
      let V = (e) => !isNaN(parseFloat(e)),
        _ = { current: void 0 };
      class D {
        constructor(e, t = {}) {
          (this.version = "12.0.5"),
            (this.canTrackVelocity = null),
            (this.events = {}),
            (this.updateAndNotify = (e, t = !0) => {
              let i = k.now();
              this.updatedAt !== i && this.setPrevFrameValue(),
                (this.prev = this.current),
                this.setCurrent(e),
                this.current !== this.prev && this.events.change && this.events.change.notify(this.current),
                t && this.events.renderRequest && this.events.renderRequest.notify(this.current);
            }),
            (this.hasAnimated = !1),
            this.setCurrent(e),
            (this.owner = t.owner);
        }
        setCurrent(e) {
          (this.current = e),
            (this.updatedAt = k.now()),
            null === this.canTrackVelocity && void 0 !== e && (this.canTrackVelocity = V(this.current));
        }
        setPrevFrameValue(e = this.current) {
          (this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt);
        }
        onChange(e) {
          return this.on("change", e);
        }
        on(e, t) {
          this.events[e] || (this.events[e] = new R());
          let i = this.events[e].add(t);
          return "change" === e
            ? () => {
                i(),
                  P.read(() => {
                    this.events.change.getSize() || this.stop();
                  });
              }
            : i;
        }
        clearListeners() {
          for (let e in this.events) this.events[e].clear();
        }
        attach(e, t) {
          (this.passiveEffect = e), (this.stopPassiveEffect = t);
        }
        set(e, t = !0) {
          t && this.passiveEffect ? this.passiveEffect(e, this.updateAndNotify) : this.updateAndNotify(e, t);
        }
        setWithVelocity(e, t, i) {
          this.set(t), (this.prev = void 0), (this.prevFrameValue = e), (this.prevUpdatedAt = this.updatedAt - i);
        }
        jump(e, t = !0) {
          this.updateAndNotify(e),
            (this.prev = e),
            (this.prevUpdatedAt = this.prevFrameValue = void 0),
            t && this.stop(),
            this.stopPassiveEffect && this.stopPassiveEffect();
        }
        get() {
          return _.current && _.current.push(this), this.current;
        }
        getPrevious() {
          return this.prev;
        }
        getVelocity() {
          var e;
          let t = k.now();
          if (!this.canTrackVelocity || void 0 === this.prevFrameValue || t - this.updatedAt > 30) return 0;
          let i = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
          return (e = parseFloat(this.current) - parseFloat(this.prevFrameValue)), i ? (1e3 / i) * e : 0;
        }
        start(e) {
          return (
            this.stop(),
            new Promise((t) => {
              (this.hasAnimated = !0),
                (this.animation = e(t)),
                this.events.animationStart && this.events.animationStart.notify();
            }).then(() => {
              this.events.animationComplete && this.events.animationComplete.notify(), this.clearAnimation();
            })
          );
        }
        stop() {
          this.animation &&
            (this.animation.stop(), this.events.animationCancel && this.events.animationCancel.notify()),
            this.clearAnimation();
        }
        isAnimating() {
          return !!this.animation;
        }
        clearAnimation() {
          delete this.animation;
        }
        destroy() {
          this.clearListeners(), this.stop(), this.stopPassiveEffect && this.stopPassiveEffect();
        }
      }
      function F(e, t) {
        return new D(e, t);
      }
      let L = (e) => !!(e && e.getVelocity);
      function O(e, t) {
        let i = e.getValue("willChange");
        if (L(i) && i.add) return i.add(t);
      }
      let z = (e) => e.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase(),
        I = "data-" + z("framerAppearId");
      function B(e) {
        let t;
        return () => (void 0 === t && (t = e()), t);
      }
      let N = B(() => void 0 !== window.ScrollTimeline);
      class U {
        constructor(e) {
          (this.stop = () => this.runAll("stop")), (this.animations = e.filter(Boolean));
        }
        get finished() {
          return Promise.all(this.animations.map((e) => ("finished" in e ? e.finished : e)));
        }
        getAll(e) {
          return this.animations[0][e];
        }
        setAll(e, t) {
          for (let i = 0; i < this.animations.length; i++) this.animations[i][e] = t;
        }
        attachTimeline(e, t) {
          let i = this.animations.map((i) =>
            N() && i.attachTimeline ? i.attachTimeline(e) : "function" == typeof t ? t(i) : void 0
          );
          return () => {
            i.forEach((e, t) => {
              e && e(), this.animations[t].stop();
            });
          };
        }
        get time() {
          return this.getAll("time");
        }
        set time(e) {
          this.setAll("time", e);
        }
        get speed() {
          return this.getAll("speed");
        }
        set speed(e) {
          this.setAll("speed", e);
        }
        get startTime() {
          return this.getAll("startTime");
        }
        get duration() {
          let e = 0;
          for (let t = 0; t < this.animations.length; t++) e = Math.max(e, this.animations[t].duration);
          return e;
        }
        runAll(e) {
          this.animations.forEach((t) => t[e]());
        }
        flatten() {
          this.runAll("flatten");
        }
        play() {
          this.runAll("play");
        }
        pause() {
          this.runAll("pause");
        }
        cancel() {
          this.runAll("cancel");
        }
        complete() {
          this.runAll("complete");
        }
      }
      class $ extends U {
        then(e, t) {
          return Promise.all(this.animations).then(e).catch(t);
        }
      }
      let W = (e) => 1e3 * e,
        G = (e) => e / 1e3,
        H = { current: !1 };
      function q(e) {
        return "function" == typeof e;
      }
      function X(e, t) {
        (e.timeline = t), (e.onfinish = null);
      }
      let Y = (e) => Array.isArray(e) && "number" == typeof e[0],
        K = { linearEasing: void 0 },
        Z = (function (e, t) {
          let i = B(e);
          return () => {
            var e;
            return null != (e = K[t]) ? e : i();
          };
        })(() => {
          try {
            document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
          } catch (e) {
            return !1;
          }
          return !0;
        }, "linearEasing"),
        Q = (e, t, i) => {
          let r = t - e;
          return 0 === r ? 1 : (i - e) / r;
        },
        J = (e, t, i = 10) => {
          let r = "",
            n = Math.max(Math.round(t / i), 2);
          for (let t = 0; t < n; t++) r += e(Q(0, n - 1, t)) + ", ";
          return `linear(${r.substring(0, r.length - 2)})`;
        },
        ee = ([e, t, i, r]) => `cubic-bezier(${e}, ${t}, ${i}, ${r})`,
        et = {
          linear: "linear",
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          circIn: ee([0, 0.65, 0.55, 1]),
          circOut: ee([0.55, 0, 1, 0.45]),
          backIn: ee([0.31, 0.01, 0.66, -0.59]),
          backOut: ee([0.33, 1.53, 0.69, 0.99]),
        },
        ei = (e, t, i) => (((1 - 3 * i + 3 * t) * e + (3 * i - 6 * t)) * e + 3 * t) * e;
      function er(e, t, i, r) {
        if (e === t && i === r) return x;
        let n = (t) =>
          (function (e, t, i, r, n) {
            let s,
              o,
              a = 0;
            do (s = ei((o = t + (i - t) / 2), r, n) - e) > 0 ? (i = o) : (t = o);
            while (Math.abs(s) > 1e-7 && ++a < 12);
            return o;
          })(t, 0, 1, e, i);
        return (e) => (0 === e || 1 === e ? e : ei(n(e), t, r));
      }
      let en = (e) => (t) => (t <= 0.5 ? e(2 * t) / 2 : (2 - e(2 * (1 - t))) / 2),
        es = (e) => (t) => 1 - e(1 - t),
        eo = er(0.33, 1.53, 0.69, 0.99),
        ea = es(eo),
        el = en(ea),
        eu = (e) => ((e *= 2) < 1 ? 0.5 * ea(e) : 0.5 * (2 - Math.pow(2, -10 * (e - 1)))),
        eh = (e) => 1 - Math.sin(Math.acos(e)),
        ed = es(eh),
        ec = en(eh),
        ep = (e) => /^0[^.\s]+$/u.test(e),
        em = (e, t, i) => (i > t ? t : i < e ? e : i),
        ef = { test: (e) => "number" == typeof e, parse: parseFloat, transform: (e) => e },
        eg = { ...ef, transform: (e) => em(0, 1, e) },
        ev = { ...ef, default: 1 },
        ey = (e) => Math.round(1e5 * e) / 1e5,
        eb = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu,
        ex =
          /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
        ew = (e, t) => (i) =>
          !!(
            ("string" == typeof i && ex.test(i) && i.startsWith(e)) ||
            (t && null != i && Object.prototype.hasOwnProperty.call(i, t))
          ),
        eS = (e, t, i) => (r) => {
          if ("string" != typeof r) return r;
          let [n, s, o, a] = r.match(eb);
          return {
            [e]: parseFloat(n),
            [t]: parseFloat(s),
            [i]: parseFloat(o),
            alpha: void 0 !== a ? parseFloat(a) : 1,
          };
        },
        eP = (e) => em(0, 255, e),
        eT = { ...ef, transform: (e) => Math.round(eP(e)) },
        eA = {
          test: ew("rgb", "red"),
          parse: eS("red", "green", "blue"),
          transform: ({ red: e, green: t, blue: i, alpha: r = 1 }) =>
            "rgba(" +
            eT.transform(e) +
            ", " +
            eT.transform(t) +
            ", " +
            eT.transform(i) +
            ", " +
            ey(eg.transform(r)) +
            ")",
        },
        eC = {
          test: ew("#"),
          parse: function (e) {
            let t = "",
              i = "",
              r = "",
              n = "";
            return (
              e.length > 5
                ? ((t = e.substring(1, 3)), (i = e.substring(3, 5)), (r = e.substring(5, 7)), (n = e.substring(7, 9)))
                : ((t = e.substring(1, 2)),
                  (i = e.substring(2, 3)),
                  (r = e.substring(3, 4)),
                  (n = e.substring(4, 5)),
                  (t += t),
                  (i += i),
                  (r += r),
                  (n += n)),
              {
                red: parseInt(t, 16),
                green: parseInt(i, 16),
                blue: parseInt(r, 16),
                alpha: n ? parseInt(n, 16) / 255 : 1,
              }
            );
          },
          transform: eA.transform,
        },
        eE = (e) => ({
          test: (t) => "string" == typeof t && t.endsWith(e) && 1 === t.split(" ").length,
          parse: parseFloat,
          transform: (t) => `${t}${e}`,
        }),
        ek = eE("deg"),
        eM = eE("%"),
        ej = eE("px"),
        eR = eE("vh"),
        eV = eE("vw"),
        e_ = { ...eM, parse: (e) => eM.parse(e) / 100, transform: (e) => eM.transform(100 * e) },
        eD = {
          test: ew("hsl", "hue"),
          parse: eS("hue", "saturation", "lightness"),
          transform: ({ hue: e, saturation: t, lightness: i, alpha: r = 1 }) =>
            "hsla(" +
            Math.round(e) +
            ", " +
            eM.transform(ey(t)) +
            ", " +
            eM.transform(ey(i)) +
            ", " +
            ey(eg.transform(r)) +
            ")",
        },
        eF = {
          test: (e) => eA.test(e) || eC.test(e) || eD.test(e),
          parse: (e) => (eA.test(e) ? eA.parse(e) : eD.test(e) ? eD.parse(e) : eC.parse(e)),
          transform: (e) => ("string" == typeof e ? e : e.hasOwnProperty("red") ? eA.transform(e) : eD.transform(e)),
        },
        eL =
          /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu,
        eO = "number",
        ez = "color",
        eI =
          /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
      function eB(e) {
        let t = e.toString(),
          i = [],
          r = { color: [], number: [], var: [] },
          n = [],
          s = 0,
          o = t
            .replace(
              eI,
              (e) => (
                eF.test(e)
                  ? (r.color.push(s), n.push(ez), i.push(eF.parse(e)))
                  : e.startsWith("var(")
                    ? (r.var.push(s), n.push("var"), i.push(e))
                    : (r.number.push(s), n.push(eO), i.push(parseFloat(e))),
                ++s,
                "${}"
              )
            )
            .split("${}");
        return { values: i, split: o, indexes: r, types: n };
      }
      function eN(e) {
        return eB(e).values;
      }
      function eU(e) {
        let { split: t, types: i } = eB(e),
          r = t.length;
        return (e) => {
          let n = "";
          for (let s = 0; s < r; s++)
            if (((n += t[s]), void 0 !== e[s])) {
              let t = i[s];
              t === eO ? (n += ey(e[s])) : t === ez ? (n += eF.transform(e[s])) : (n += e[s]);
            }
          return n;
        };
      }
      let e$ = (e) => ("number" == typeof e ? 0 : e),
        eW = {
          test: function (e) {
            var t, i;
            return (
              isNaN(e) &&
              "string" == typeof e &&
              ((null == (t = e.match(eb)) ? void 0 : t.length) || 0) +
                ((null == (i = e.match(eL)) ? void 0 : i.length) || 0) >
                0
            );
          },
          parse: eN,
          createTransformer: eU,
          getAnimatableNone: function (e) {
            let t = eN(e);
            return eU(e)(t.map(e$));
          },
        },
        eG = new Set(["brightness", "contrast", "saturate", "opacity"]);
      function eH(e) {
        let [t, i] = e.slice(0, -1).split("(");
        if ("drop-shadow" === t) return e;
        let [r] = i.match(eb) || [];
        if (!r) return e;
        let n = i.replace(r, ""),
          s = +!!eG.has(t);
        return r !== i && (s *= 100), t + "(" + s + n + ")";
      }
      let eq = /\b([a-z-]*)\(.*?\)/gu,
        eX = {
          ...eW,
          getAnimatableNone: (e) => {
            let t = e.match(eq);
            return t ? t.map(eH).join(" ") : e;
          },
        },
        eY = { ...ef, transform: Math.round },
        eK = {
          borderWidth: ej,
          borderTopWidth: ej,
          borderRightWidth: ej,
          borderBottomWidth: ej,
          borderLeftWidth: ej,
          borderRadius: ej,
          radius: ej,
          borderTopLeftRadius: ej,
          borderTopRightRadius: ej,
          borderBottomRightRadius: ej,
          borderBottomLeftRadius: ej,
          width: ej,
          maxWidth: ej,
          height: ej,
          maxHeight: ej,
          top: ej,
          right: ej,
          bottom: ej,
          left: ej,
          padding: ej,
          paddingTop: ej,
          paddingRight: ej,
          paddingBottom: ej,
          paddingLeft: ej,
          margin: ej,
          marginTop: ej,
          marginRight: ej,
          marginBottom: ej,
          marginLeft: ej,
          backgroundPositionX: ej,
          backgroundPositionY: ej,
          rotate: ek,
          rotateX: ek,
          rotateY: ek,
          rotateZ: ek,
          scale: ev,
          scaleX: ev,
          scaleY: ev,
          scaleZ: ev,
          skew: ek,
          skewX: ek,
          skewY: ek,
          distance: ej,
          translateX: ej,
          translateY: ej,
          translateZ: ej,
          x: ej,
          y: ej,
          z: ej,
          perspective: ej,
          transformPerspective: ej,
          opacity: eg,
          originX: e_,
          originY: e_,
          originZ: ej,
          zIndex: eY,
          size: ej,
          fillOpacity: eg,
          strokeOpacity: eg,
          numOctaves: eY,
        },
        eZ = {
          ...eK,
          color: eF,
          backgroundColor: eF,
          outlineColor: eF,
          fill: eF,
          stroke: eF,
          borderColor: eF,
          borderTopColor: eF,
          borderRightColor: eF,
          borderBottomColor: eF,
          borderLeftColor: eF,
          filter: eX,
          WebkitFilter: eX,
        },
        eQ = (e) => eZ[e];
      function eJ(e, t) {
        let i = eQ(e);
        return i !== eX && (i = eW), i.getAnimatableNone ? i.getAnimatableNone(t) : void 0;
      }
      let e0 = new Set(["auto", "none", "0"]),
        e1 = (e) => e === ef || e === ej,
        e2 = (e, t) => parseFloat(e.split(", ")[t]),
        e5 =
          (e, t) =>
          (i, { transform: r }) => {
            if ("none" === r || !r) return 0;
            let n = r.match(/^matrix3d\((.+)\)$/u);
            if (n) return e2(n[1], t);
            {
              let t = r.match(/^matrix\((.+)\)$/u);
              return t ? e2(t[1], e) : 0;
            }
          },
        e3 = new Set(["x", "y", "z"]),
        e9 = m.filter((e) => !e3.has(e)),
        e4 = {
          width: ({ x: e }, { paddingLeft: t = "0", paddingRight: i = "0" }) =>
            e.max - e.min - parseFloat(t) - parseFloat(i),
          height: ({ y: e }, { paddingTop: t = "0", paddingBottom: i = "0" }) =>
            e.max - e.min - parseFloat(t) - parseFloat(i),
          top: (e, { top: t }) => parseFloat(t),
          left: (e, { left: t }) => parseFloat(t),
          bottom: ({ y: e }, { top: t }) => parseFloat(t) + (e.max - e.min),
          right: ({ x: e }, { left: t }) => parseFloat(t) + (e.max - e.min),
          x: e5(4, 13),
          y: e5(5, 14),
        };
      (e4.translateX = e4.x), (e4.translateY = e4.y);
      let e6 = new Set(),
        e8 = !1,
        e7 = !1;
      function te() {
        if (e7) {
          let e = Array.from(e6).filter((e) => e.needsMeasurement),
            t = new Set(e.map((e) => e.element)),
            i = new Map();
          t.forEach((e) => {
            let t = (function (e) {
              let t = [];
              return (
                e9.forEach((i) => {
                  let r = e.getValue(i);
                  void 0 !== r && (t.push([i, r.get()]), r.set(+!!i.startsWith("scale")));
                }),
                t
              );
            })(e);
            t.length && (i.set(e, t), e.render());
          }),
            e.forEach((e) => e.measureInitialState()),
            t.forEach((e) => {
              e.render();
              let t = i.get(e);
              t &&
                t.forEach(([t, i]) => {
                  var r;
                  null == (r = e.getValue(t)) || r.set(i);
                });
            }),
            e.forEach((e) => e.measureEndState()),
            e.forEach((e) => {
              void 0 !== e.suspendedScrollY && window.scrollTo(0, e.suspendedScrollY);
            });
        }
        (e7 = !1), (e8 = !1), e6.forEach((e) => e.complete()), e6.clear();
      }
      function tt() {
        e6.forEach((e) => {
          e.readKeyframes(), e.needsMeasurement && (e7 = !0);
        });
      }
      class ti {
        constructor(e, t, i, r, n, s = !1) {
          (this.isComplete = !1),
            (this.isAsync = !1),
            (this.needsMeasurement = !1),
            (this.isScheduled = !1),
            (this.unresolvedKeyframes = [...e]),
            (this.onComplete = t),
            (this.name = i),
            (this.motionValue = r),
            (this.element = n),
            (this.isAsync = s);
        }
        scheduleResolve() {
          (this.isScheduled = !0),
            this.isAsync
              ? (e6.add(this), e8 || ((e8 = !0), P.read(tt), P.resolveKeyframes(te)))
              : (this.readKeyframes(), this.complete());
        }
        readKeyframes() {
          let { unresolvedKeyframes: e, name: t, element: i, motionValue: r } = this;
          for (let n = 0; n < e.length; n++)
            if (null === e[n])
              if (0 === n) {
                let n = null == r ? void 0 : r.get(),
                  s = e[e.length - 1];
                if (void 0 !== n) e[0] = n;
                else if (i && t) {
                  let r = i.readValue(t, s);
                  null != r && (e[0] = r);
                }
                void 0 === e[0] && (e[0] = s), r && void 0 === n && r.set(e[0]);
              } else e[n] = e[n - 1];
        }
        setFinalKeyframe() {}
        measureInitialState() {}
        renderEndStyles() {}
        measureEndState() {}
        complete() {
          (this.isComplete = !0), this.onComplete(this.unresolvedKeyframes, this.finalKeyframe), e6.delete(this);
        }
        cancel() {
          this.isComplete || ((this.isScheduled = !1), e6.delete(this));
        }
        resume() {
          this.isComplete || this.scheduleResolve();
        }
      }
      let tr = (e) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),
        tn = (e) => (t) => "string" == typeof t && t.startsWith(e),
        ts = tn("--"),
        to = tn("var(--"),
        ta = (e) => !!to(e) && tl.test(e.split("/*")[0].trim()),
        tl = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,
        tu = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u,
        th = (e) => (t) => t.test(e),
        td = [ef, ej, eM, ek, eV, eR, { test: (e) => "auto" === e, parse: (e) => e }],
        tc = (e) => td.find(th(e));
      class tp extends ti {
        constructor(e, t, i, r, n) {
          super(e, t, i, r, n, !0);
        }
        readKeyframes() {
          let { unresolvedKeyframes: e, element: t, name: i } = this;
          if (!t || !t.current) return;
          super.readKeyframes();
          for (let i = 0; i < e.length; i++) {
            let r = e[i];
            if ("string" == typeof r && ta((r = r.trim()))) {
              let n = (function e(t, i, r = 1) {
                x(
                  r <= 4,
                  `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`
                );
                let [n, s] = (function (e) {
                  let t = tu.exec(e);
                  if (!t) return [,];
                  let [, i, r, n] = t;
                  return [`--${null != i ? i : r}`, n];
                })(t);
                if (!n) return;
                let o = window.getComputedStyle(i).getPropertyValue(n);
                if (o) {
                  let e = o.trim();
                  return tr(e) ? parseFloat(e) : e;
                }
                return ta(s) ? e(s, i, r + 1) : s;
              })(r, t.current);
              void 0 !== n && (e[i] = n), i === e.length - 1 && (this.finalKeyframe = r);
            }
          }
          if ((this.resolveNoneKeyframes(), !g.has(i) || 2 !== e.length)) return;
          let [r, n] = e,
            s = tc(r),
            o = tc(n);
          if (s !== o)
            if (e1(s) && e1(o))
              for (let t = 0; t < e.length; t++) {
                let i = e[t];
                "string" == typeof i && (e[t] = parseFloat(i));
              }
            else this.needsMeasurement = !0;
        }
        resolveNoneKeyframes() {
          let { unresolvedKeyframes: e, name: t } = this,
            i = [];
          for (let t = 0; t < e.length; t++) {
            var r;
            ("number" == typeof (r = e[t]) ? 0 === r : null === r || "none" === r || "0" === r || ep(r)) && i.push(t);
          }
          i.length &&
            (function (e, t, i) {
              let r,
                n = 0;
              for (; n < e.length && !r; ) {
                let t = e[n];
                "string" == typeof t && !e0.has(t) && eB(t).values.length && (r = e[n]), n++;
              }
              if (r && i) for (let n of t) e[n] = eJ(i, r);
            })(e, i, t);
        }
        measureInitialState() {
          let { element: e, unresolvedKeyframes: t, name: i } = this;
          if (!e || !e.current) return;
          "height" === i && (this.suspendedScrollY = window.pageYOffset),
            (this.measuredOrigin = e4[i](e.measureViewportBox(), window.getComputedStyle(e.current))),
            (t[0] = this.measuredOrigin);
          let r = t[t.length - 1];
          void 0 !== r && e.getValue(i, r).jump(r, !1);
        }
        measureEndState() {
          var e;
          let { element: t, name: i, unresolvedKeyframes: r } = this;
          if (!t || !t.current) return;
          let n = t.getValue(i);
          n && n.jump(this.measuredOrigin, !1);
          let s = r.length - 1,
            o = r[s];
          (r[s] = e4[i](t.measureViewportBox(), window.getComputedStyle(t.current))),
            null !== o && void 0 === this.finalKeyframe && (this.finalKeyframe = o),
            (null == (e = this.removedTransforms) ? void 0 : e.length) &&
              this.removedTransforms.forEach(([e, i]) => {
                t.getValue(e).set(i);
              }),
            this.resolveNoneKeyframes();
        }
      }
      let tm = (e, t) =>
          "zIndex" !== t &&
          !!(
            "number" == typeof e ||
            Array.isArray(e) ||
            ("string" == typeof e && (eW.test(e) || "0" === e) && !e.startsWith("url("))
          ),
        tf = (e) => null !== e;
      function tg(e, { repeat: t, repeatType: i = "loop" }, r) {
        let n = e.filter(tf),
          s = t && "loop" !== i && t % 2 == 1 ? 0 : n.length - 1;
        return s && void 0 !== r ? r : n[s];
      }
      class tv {
        constructor({
          autoplay: e = !0,
          delay: t = 0,
          type: i = "keyframes",
          repeat: r = 0,
          repeatDelay: n = 0,
          repeatType: s = "loop",
          ...o
        }) {
          (this.isStopped = !1),
            (this.hasAttemptedResolve = !1),
            (this.createdAt = k.now()),
            (this.options = { autoplay: e, delay: t, type: i, repeat: r, repeatDelay: n, repeatType: s, ...o }),
            this.updateFinishedPromise();
        }
        calcStartTime() {
          return this.resolvedAt && this.resolvedAt - this.createdAt > 40 ? this.resolvedAt : this.createdAt;
        }
        get resolved() {
          return this._resolved || this.hasAttemptedResolve || (tt(), te()), this._resolved;
        }
        onKeyframesResolved(e, t) {
          (this.resolvedAt = k.now()), (this.hasAttemptedResolve = !0);
          let { name: i, type: r, velocity: n, delay: s, onComplete: o, onUpdate: a, isGenerator: l } = this.options;
          if (
            !l &&
            !(function (e, t, i, r) {
              let n = e[0];
              if (null === n) return !1;
              if ("display" === t || "visibility" === t) return !0;
              let s = e[e.length - 1],
                o = tm(n, t),
                a = tm(s, t);
              return (
                x(
                  o === a,
                  `You are trying to animate ${t} from "${n}" to "${s}". ${n} is not an animatable value - to enable this animation set ${n} to a value animatable to ${s} via the \`style\` property.`
                ),
                !!o &&
                  !!a &&
                  ((function (e) {
                    let t = e[0];
                    if (1 === e.length) return !0;
                    for (let i = 0; i < e.length; i++) if (e[i] !== t) return !0;
                  })(e) ||
                    (("spring" === i || q(i)) && r))
              );
            })(e, i, r, n)
          )
            if (H.current || !s) {
              a && a(tg(e, this.options, t)), o && o(), this.resolveFinishedPromise();
              return;
            } else this.options.duration = 0;
          let u = this.initPlayback(e, t);
          !1 !== u && ((this._resolved = { keyframes: e, finalKeyframe: t, ...u }), this.onPostResolved());
        }
        onPostResolved() {}
        then(e, t) {
          return this.currentFinishedPromise.then(e, t);
        }
        flatten() {
          (this.options.type = "keyframes"), (this.options.ease = "linear");
        }
        updateFinishedPromise() {
          this.currentFinishedPromise = new Promise((e) => {
            this.resolveFinishedPromise = e;
          });
        }
      }
      function ty(e) {
        let t = 0,
          i = e.next(t);
        for (; !i.done && t < 2e4; ) (t += 50), (i = e.next(t));
        return t >= 2e4 ? 1 / 0 : t;
      }
      let tb = (e, t, i) => e + (t - e) * i;
      function tx(e, t, i) {
        return (i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6)
          ? e + (t - e) * 6 * i
          : i < 0.5
            ? t
            : i < 2 / 3
              ? e + (t - e) * (2 / 3 - i) * 6
              : e;
      }
      function tw(e, t) {
        return (i) => (i > 0 ? t : e);
      }
      let tS = (e, t, i) => {
          let r = e * e,
            n = i * (t * t - r) + r;
          return n < 0 ? 0 : Math.sqrt(n);
        },
        tP = [eC, eA, eD],
        tT = (e) => tP.find((t) => t.test(e));
      function tA(e) {
        let t = tT(e);
        if ((x(!!t, `'${e}' is not an animatable color. Use the equivalent color code instead.`), !t)) return !1;
        let i = t.parse(e);
        return (
          t === eD &&
            (i = (function ({ hue: e, saturation: t, lightness: i, alpha: r }) {
              (e /= 360), (i /= 100);
              let n = 0,
                s = 0,
                o = 0;
              if ((t /= 100)) {
                let r = i < 0.5 ? i * (1 + t) : i + t - i * t,
                  a = 2 * i - r;
                (n = tx(a, r, e + 1 / 3)), (s = tx(a, r, e)), (o = tx(a, r, e - 1 / 3));
              } else n = s = o = i;
              return { red: Math.round(255 * n), green: Math.round(255 * s), blue: Math.round(255 * o), alpha: r };
            })(i)),
          i
        );
      }
      let tC = (e, t) => {
          let i = tA(e),
            r = tA(t);
          if (!i || !r) return tw(e, t);
          let n = { ...i };
          return (e) => (
            (n.red = tS(i.red, r.red, e)),
            (n.green = tS(i.green, r.green, e)),
            (n.blue = tS(i.blue, r.blue, e)),
            (n.alpha = tb(i.alpha, r.alpha, e)),
            eA.transform(n)
          );
        },
        tE = (e, t) => (i) => t(e(i)),
        tk = (...e) => e.reduce(tE),
        tM = new Set(["none", "hidden"]);
      function tj(e, t) {
        return (i) => tb(e, t, i);
      }
      function tR(e) {
        return "number" == typeof e
          ? tj
          : "string" == typeof e
            ? ta(e)
              ? tw
              : eF.test(e)
                ? tC
                : tD
            : Array.isArray(e)
              ? tV
              : "object" == typeof e
                ? eF.test(e)
                  ? tC
                  : t_
                : tw;
      }
      function tV(e, t) {
        let i = [...e],
          r = i.length,
          n = e.map((e, i) => tR(e)(e, t[i]));
        return (e) => {
          for (let t = 0; t < r; t++) i[t] = n[t](e);
          return i;
        };
      }
      function t_(e, t) {
        let i = { ...e, ...t },
          r = {};
        for (let n in i) void 0 !== e[n] && void 0 !== t[n] && (r[n] = tR(e[n])(e[n], t[n]));
        return (e) => {
          for (let t in r) i[t] = r[t](e);
          return i;
        };
      }
      let tD = (e, t) => {
        let i = eW.createTransformer(t),
          r = eB(e),
          n = eB(t);
        return r.indexes.var.length === n.indexes.var.length &&
          r.indexes.color.length === n.indexes.color.length &&
          r.indexes.number.length >= n.indexes.number.length
          ? (tM.has(e) && !n.values.length) || (tM.has(t) && !r.values.length)
            ? (function (e, t) {
                return tM.has(e) ? (i) => (i <= 0 ? e : t) : (i) => (i >= 1 ? t : e);
              })(e, t)
            : tk(
                tV(
                  (function (e, t) {
                    var i;
                    let r = [],
                      n = { color: 0, var: 0, number: 0 };
                    for (let s = 0; s < t.values.length; s++) {
                      let o = t.types[s],
                        a = e.indexes[o][n[o]],
                        l = null != (i = e.values[a]) ? i : 0;
                      (r[s] = l), n[o]++;
                    }
                    return r;
                  })(r, n),
                  n.values
                ),
                i
              )
          : (x(
              !0,
              `Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`
            ),
            tw(e, t));
      };
      function tF(e, t, i) {
        return "number" == typeof e && "number" == typeof t && "number" == typeof i ? tb(e, t, i) : tR(e)(e, t);
      }
      function tL(e, t, i) {
        var r, n;
        let s = Math.max(t - 5, 0);
        return (r = i - e(s)), (n = t - s) ? (1e3 / n) * r : 0;
      }
      let tO = {
        stiffness: 100,
        damping: 10,
        mass: 1,
        velocity: 0,
        duration: 800,
        bounce: 0.3,
        visualDuration: 0.3,
        restSpeed: { granular: 0.01, default: 2 },
        restDelta: { granular: 0.005, default: 0.5 },
        minDuration: 0.01,
        maxDuration: 10,
        minDamping: 0.05,
        maxDamping: 1,
      };
      function tz(e, t) {
        return e * Math.sqrt(1 - t * t);
      }
      let tI = ["duration", "bounce"],
        tB = ["stiffness", "damping", "mass"];
      function tN(e, t) {
        return t.some((t) => void 0 !== e[t]);
      }
      function tU(e = tO.visualDuration, t = tO.bounce) {
        let i,
          r = "object" != typeof e ? { visualDuration: e, keyframes: [0, 1], bounce: t } : e,
          { restSpeed: n, restDelta: s } = r,
          o = r.keyframes[0],
          a = r.keyframes[r.keyframes.length - 1],
          l = { done: !1, value: o },
          {
            stiffness: u,
            damping: h,
            mass: d,
            duration: c,
            velocity: p,
            isResolvedFromDuration: m,
          } = (function (e) {
            let t = {
              velocity: tO.velocity,
              stiffness: tO.stiffness,
              damping: tO.damping,
              mass: tO.mass,
              isResolvedFromDuration: !1,
              ...e,
            };
            if (!tN(e, tB) && tN(e, tI))
              if (e.visualDuration) {
                let i = (2 * Math.PI) / (1.2 * e.visualDuration),
                  r = i * i,
                  n = 2 * em(0.05, 1, 1 - (e.bounce || 0)) * Math.sqrt(r);
                t = { ...t, mass: tO.mass, stiffness: r, damping: n };
              } else {
                let i = (function ({
                  duration: e = tO.duration,
                  bounce: t = tO.bounce,
                  velocity: i = tO.velocity,
                  mass: r = tO.mass,
                }) {
                  let n, s;
                  x(e <= W(tO.maxDuration), "Spring duration must be 10 seconds or less");
                  let o = 1 - t;
                  (o = em(tO.minDamping, tO.maxDamping, o)),
                    (e = em(tO.minDuration, tO.maxDuration, G(e))),
                    o < 1
                      ? ((n = (t) => {
                          let r = t * o,
                            n = r * e;
                          return 0.001 - ((r - i) / tz(t, o)) * Math.exp(-n);
                        }),
                        (s = (t) => {
                          let r = t * o * e,
                            s = Math.pow(o, 2) * Math.pow(t, 2) * e,
                            a = Math.exp(-r),
                            l = tz(Math.pow(t, 2), o);
                          return ((r * i + i - s) * a * (-n(t) + 0.001 > 0 ? -1 : 1)) / l;
                        }))
                      : ((n = (t) => -0.001 + Math.exp(-t * e) * ((t - i) * e + 1)),
                        (s = (t) => e * e * (i - t) * Math.exp(-t * e)));
                  let a = (function (e, t, i) {
                    let r = i;
                    for (let i = 1; i < 12; i++) r -= e(r) / t(r);
                    return r;
                  })(n, s, 5 / e);
                  if (((e = W(e)), isNaN(a))) return { stiffness: tO.stiffness, damping: tO.damping, duration: e };
                  {
                    let t = Math.pow(a, 2) * r;
                    return { stiffness: t, damping: 2 * o * Math.sqrt(r * t), duration: e };
                  }
                })(e);
                (t = { ...t, ...i, mass: tO.mass }).isResolvedFromDuration = !0;
              }
            return t;
          })({ ...r, velocity: -G(r.velocity || 0) }),
          f = p || 0,
          g = h / (2 * Math.sqrt(u * d)),
          v = a - o,
          y = G(Math.sqrt(u / d)),
          b = 5 > Math.abs(v);
        if (
          (n || (n = b ? tO.restSpeed.granular : tO.restSpeed.default),
          s || (s = b ? tO.restDelta.granular : tO.restDelta.default),
          g < 1)
        ) {
          let e = tz(y, g);
          i = (t) => a - Math.exp(-g * y * t) * (((f + g * y * v) / e) * Math.sin(e * t) + v * Math.cos(e * t));
        } else if (1 === g) i = (e) => a - Math.exp(-y * e) * (v + (f + y * v) * e);
        else {
          let e = y * Math.sqrt(g * g - 1);
          i = (t) => {
            let i = Math.exp(-g * y * t),
              r = Math.min(e * t, 300);
            return a - (i * ((f + g * y * v) * Math.sinh(r) + e * v * Math.cosh(r))) / e;
          };
        }
        let w = {
          calculatedDuration: (m && c) || null,
          next: (e) => {
            let t = i(e);
            if (m) l.done = e >= c;
            else {
              let r = 0;
              g < 1 && (r = 0 === e ? W(f) : tL(i, e, t));
              let o = Math.abs(a - t) <= s;
              l.done = Math.abs(r) <= n && o;
            }
            return (l.value = l.done ? a : t), l;
          },
          toString: () => {
            let e = Math.min(ty(w), 2e4),
              t = J((t) => w.next(e * t).value, e, 30);
            return e + "ms " + t;
          },
        };
        return w;
      }
      function t$({
        keyframes: e,
        velocity: t = 0,
        power: i = 0.8,
        timeConstant: r = 325,
        bounceDamping: n = 10,
        bounceStiffness: s = 500,
        modifyTarget: o,
        min: a,
        max: l,
        restDelta: u = 0.5,
        restSpeed: h,
      }) {
        let d,
          c,
          p = e[0],
          m = { done: !1, value: p },
          f = (e) => (void 0 !== a && e < a) || (void 0 !== l && e > l),
          g = (e) => (void 0 === a ? l : void 0 === l || Math.abs(a - e) < Math.abs(l - e) ? a : l),
          v = i * t,
          y = p + v,
          b = void 0 === o ? y : o(y);
        b !== y && (v = b - p);
        let x = (e) => -v * Math.exp(-e / r),
          w = (e) => b + x(e),
          S = (e) => {
            let t = x(e),
              i = w(e);
            (m.done = Math.abs(t) <= u), (m.value = m.done ? b : i);
          },
          P = (e) => {
            f(m.value) &&
              ((d = e),
              (c = tU({
                keyframes: [m.value, g(m.value)],
                velocity: tL(w, e, m.value),
                damping: n,
                stiffness: s,
                restDelta: u,
                restSpeed: h,
              })));
          };
        return (
          P(0),
          {
            calculatedDuration: null,
            next: (e) => {
              let t = !1;
              return (c || void 0 !== d || ((t = !0), S(e), P(e)), void 0 !== d && e >= d)
                ? c.next(e - d)
                : (t || S(e), m);
            },
          }
        );
      }
      let tW = er(0.42, 0, 1, 1),
        tG = er(0, 0, 0.58, 1),
        tH = er(0.42, 0, 0.58, 1),
        tq = (e) => Array.isArray(e) && "number" != typeof e[0],
        tX = {
          linear: x,
          easeIn: tW,
          easeInOut: tH,
          easeOut: tG,
          circIn: eh,
          circInOut: ec,
          circOut: ed,
          backIn: ea,
          backInOut: el,
          backOut: eo,
          anticipate: eu,
        },
        tY = (e) => {
          if (Y(e)) {
            x(4 === e.length, "Cubic bezier arrays must contain four numerical values.");
            let [t, i, r, n] = e;
            return er(t, i, r, n);
          }
          return "string" == typeof e ? (x(void 0 !== tX[e], `Invalid easing type '${e}'`), tX[e]) : e;
        };
      function tK({ duration: e = 300, keyframes: t, times: i, ease: r = "easeInOut" }) {
        var n;
        let s = tq(r) ? r.map(tY) : tY(r),
          o = { done: !1, value: t[0] },
          a = (function (e, t, { clamp: i = !0, ease: r, mixer: n } = {}) {
            let s = e.length;
            if ((x(s === t.length, "Both input and output ranges must be the same length"), 1 === s)) return () => t[0];
            if (2 === s && t[0] === t[1]) return () => t[1];
            let o = e[0] === e[1];
            e[0] > e[s - 1] && ((e = [...e].reverse()), (t = [...t].reverse()));
            let a = (function (e, t, i) {
                let r = [],
                  n = i || tF,
                  s = e.length - 1;
                for (let i = 0; i < s; i++) {
                  let s = n(e[i], e[i + 1]);
                  t && (s = tk(Array.isArray(t) ? t[i] || x : t, s)), r.push(s);
                }
                return r;
              })(t, r, n),
              l = a.length,
              u = (i) => {
                if (o && i < e[0]) return t[0];
                let r = 0;
                if (l > 1) for (; r < e.length - 2 && !(i < e[r + 1]); r++);
                let n = Q(e[r], e[r + 1], i);
                return a[r](n);
              };
            return i ? (t) => u(em(e[0], e[s - 1], t)) : u;
          })(
            ((n =
              i && i.length === t.length
                ? i
                : (function (e) {
                    let t = [0];
                    return (
                      !(function (e, t) {
                        let i = e[e.length - 1];
                        for (let r = 1; r <= t; r++) {
                          let n = Q(0, t, r);
                          e.push(tb(i, 1, n));
                        }
                      })(t, e.length - 1),
                      t
                    );
                  })(t)),
            n.map((t) => t * e)),
            t,
            { ease: Array.isArray(s) ? s : t.map(() => s || tH).splice(0, t.length - 1) }
          );
        return { calculatedDuration: e, next: (t) => ((o.value = a(t)), (o.done = t >= e), o) };
      }
      let tZ = (e) => {
          let t = ({ timestamp: t }) => e(t);
          return {
            start: () => P.update(t, !0),
            stop: () => T(t),
            now: () => (A.isProcessing ? A.timestamp : k.now()),
          };
        },
        tQ = { decay: t$, inertia: t$, tween: tK, keyframes: tK, spring: tU },
        tJ = (e) => e / 100;
      class t0 extends tv {
        constructor(e) {
          super(e),
            (this.holdTime = null),
            (this.cancelTime = null),
            (this.currentTime = 0),
            (this.playbackSpeed = 1),
            (this.pendingPlayState = "running"),
            (this.startTime = null),
            (this.state = "idle"),
            (this.stop = () => {
              if ((this.resolver.cancel(), (this.isStopped = !0), "idle" === this.state)) return;
              this.teardown();
              let { onStop: e } = this.options;
              e && e();
            });
          let { name: t, motionValue: i, element: r, keyframes: n } = this.options,
            s = (null == r ? void 0 : r.KeyframeResolver) || ti;
          (this.resolver = new s(n, (e, t) => this.onKeyframesResolved(e, t), t, i, r)),
            this.resolver.scheduleResolve();
        }
        flatten() {
          super.flatten(), this._resolved && Object.assign(this._resolved, this.initPlayback(this._resolved.keyframes));
        }
        initPlayback(e) {
          let t,
            i,
            { type: r = "keyframes", repeat: n = 0, repeatDelay: s = 0, repeatType: o, velocity: a = 0 } = this.options,
            l = q(r) ? r : tQ[r] || tK;
          l !== tK && "number" != typeof e[0] && ((t = tk(tJ, tF(e[0], e[1]))), (e = [0, 100]));
          let u = l({ ...this.options, keyframes: e });
          "mirror" === o && (i = l({ ...this.options, keyframes: [...e].reverse(), velocity: -a })),
            null === u.calculatedDuration && (u.calculatedDuration = ty(u));
          let { calculatedDuration: h } = u,
            d = h + s;
          return {
            generator: u,
            mirroredGenerator: i,
            mapPercentToKeyframes: t,
            calculatedDuration: h,
            resolvedDuration: d,
            totalDuration: d * (n + 1) - s,
          };
        }
        onPostResolved() {
          let { autoplay: e = !0 } = this.options;
          this.play(), "paused" !== this.pendingPlayState && e ? (this.state = this.pendingPlayState) : this.pause();
        }
        tick(e, t = !1) {
          let { resolved: i } = this;
          if (!i) {
            let { keyframes: e } = this.options;
            return { done: !0, value: e[e.length - 1] };
          }
          let {
            finalKeyframe: r,
            generator: n,
            mirroredGenerator: s,
            mapPercentToKeyframes: o,
            keyframes: a,
            calculatedDuration: l,
            totalDuration: u,
            resolvedDuration: h,
          } = i;
          if (null === this.startTime) return n.next(0);
          let { delay: d, repeat: c, repeatType: p, repeatDelay: m, onUpdate: f } = this.options;
          this.speed > 0
            ? (this.startTime = Math.min(this.startTime, e))
            : this.speed < 0 && (this.startTime = Math.min(e - u / this.speed, this.startTime)),
            t
              ? (this.currentTime = e)
              : null !== this.holdTime
                ? (this.currentTime = this.holdTime)
                : (this.currentTime = Math.round(e - this.startTime) * this.speed);
          let g = this.currentTime - d * (this.speed >= 0 ? 1 : -1),
            v = this.speed >= 0 ? g < 0 : g > u;
          (this.currentTime = Math.max(g, 0)),
            "finished" === this.state && null === this.holdTime && (this.currentTime = u);
          let y = this.currentTime,
            b = n;
          if (c) {
            let e = Math.min(this.currentTime, u) / h,
              t = Math.floor(e),
              i = e % 1;
            !i && e >= 1 && (i = 1),
              1 === i && t--,
              (t = Math.min(t, c + 1)) % 2 &&
                ("reverse" === p ? ((i = 1 - i), m && (i -= m / h)) : "mirror" === p && (b = s)),
              (y = em(0, 1, i) * h);
          }
          let x = v ? { done: !1, value: a[0] } : b.next(y);
          o && (x.value = o(x.value));
          let { done: w } = x;
          v || null === l || (w = this.speed >= 0 ? this.currentTime >= u : this.currentTime <= 0);
          let S = null === this.holdTime && ("finished" === this.state || ("running" === this.state && w));
          return S && void 0 !== r && (x.value = tg(a, this.options, r)), f && f(x.value), S && this.finish(), x;
        }
        get duration() {
          let { resolved: e } = this;
          return e ? G(e.calculatedDuration) : 0;
        }
        get time() {
          return G(this.currentTime);
        }
        set time(e) {
          (e = W(e)),
            (this.currentTime = e),
            null !== this.holdTime || 0 === this.speed
              ? (this.holdTime = e)
              : this.driver && (this.startTime = this.driver.now() - e / this.speed);
        }
        get speed() {
          return this.playbackSpeed;
        }
        set speed(e) {
          let t = this.playbackSpeed !== e;
          (this.playbackSpeed = e), t && (this.time = G(this.currentTime));
        }
        play() {
          if ((this.resolver.isScheduled || this.resolver.resume(), !this._resolved)) {
            this.pendingPlayState = "running";
            return;
          }
          if (this.isStopped) return;
          let { driver: e = tZ, onPlay: t, startTime: i } = this.options;
          this.driver || (this.driver = e((e) => this.tick(e))), t && t();
          let r = this.driver.now();
          null !== this.holdTime
            ? (this.startTime = r - this.holdTime)
            : this.startTime
              ? "finished" === this.state && (this.startTime = r)
              : (this.startTime = null != i ? i : this.calcStartTime()),
            "finished" === this.state && this.updateFinishedPromise(),
            (this.cancelTime = this.startTime),
            (this.holdTime = null),
            (this.state = "running"),
            this.driver.start();
        }
        pause() {
          var e;
          if (!this._resolved) {
            this.pendingPlayState = "paused";
            return;
          }
          (this.state = "paused"), (this.holdTime = null != (e = this.currentTime) ? e : 0);
        }
        complete() {
          "running" !== this.state && this.play(),
            (this.pendingPlayState = this.state = "finished"),
            (this.holdTime = null);
        }
        finish() {
          this.teardown(), (this.state = "finished");
          let { onComplete: e } = this.options;
          e && e();
        }
        cancel() {
          null !== this.cancelTime && this.tick(this.cancelTime), this.teardown(), this.updateFinishedPromise();
        }
        teardown() {
          (this.state = "idle"),
            this.stopDriver(),
            this.resolveFinishedPromise(),
            this.updateFinishedPromise(),
            (this.startTime = this.cancelTime = null),
            this.resolver.cancel();
        }
        stopDriver() {
          this.driver && (this.driver.stop(), (this.driver = void 0));
        }
        sample(e) {
          return (this.startTime = 0), this.tick(e, !0);
        }
      }
      let t1 = new Set(["opacity", "clipPath", "filter", "transform"]),
        t2 = B(() => Object.hasOwnProperty.call(Element.prototype, "animate")),
        t5 = { anticipate: eu, backInOut: el, circInOut: ec };
      class t3 extends tv {
        constructor(e) {
          super(e);
          let { name: t, motionValue: i, element: r, keyframes: n } = this.options;
          (this.resolver = new tp(n, (e, t) => this.onKeyframesResolved(e, t), t, i, r)),
            this.resolver.scheduleResolve();
        }
        initPlayback(e, t) {
          var i;
          let { duration: r = 300, times: n, ease: s, type: o, motionValue: a, name: l, startTime: u } = this.options;
          if (!a.owner || !a.owner.current) return !1;
          if (
            ("string" == typeof s && Z() && s in t5 && (s = t5[s]),
            q((i = this.options).type) ||
              "spring" === i.type ||
              !(function e(t) {
                return !!(
                  ("function" == typeof t && Z()) ||
                  !t ||
                  ("string" == typeof t && (t in et || Z())) ||
                  Y(t) ||
                  (Array.isArray(t) && t.every(e))
                );
              })(i.ease))
          ) {
            let { onComplete: t, onUpdate: i, motionValue: a, element: l, ...u } = this.options,
              h = (function (e, t) {
                let i = new t0({ ...t, keyframes: e, repeat: 0, delay: 0, isGenerator: !0 }),
                  r = { done: !1, value: e[0] },
                  n = [],
                  s = 0;
                for (; !r.done && s < 2e4; ) n.push((r = i.sample(s)).value), (s += 10);
                return { times: void 0, keyframes: n, duration: s - 10, ease: "linear" };
              })(e, u);
            1 === (e = h.keyframes).length && (e[1] = e[0]),
              (r = h.duration),
              (n = h.times),
              (s = h.ease),
              (o = "keyframes");
          }
          let h = (function (
            e,
            t,
            i,
            {
              delay: r = 0,
              duration: n = 300,
              repeat: s = 0,
              repeatType: o = "loop",
              ease: a = "easeInOut",
              times: l,
            } = {}
          ) {
            let u = { [t]: i };
            l && (u.offset = l);
            let h = (function e(t, i) {
              if (t)
                return "function" == typeof t && Z()
                  ? J(t, i)
                  : Y(t)
                    ? ee(t)
                    : Array.isArray(t)
                      ? t.map((t) => e(t, i) || et.easeOut)
                      : et[t];
            })(a, n);
            return (
              Array.isArray(h) && (u.easing = h),
              e.animate(u, {
                delay: r,
                duration: n,
                easing: Array.isArray(h) ? "linear" : h,
                fill: "both",
                iterations: s + 1,
                direction: "reverse" === o ? "alternate" : "normal",
              })
            );
          })(a.owner.current, l, e, { ...this.options, duration: r, times: n, ease: s });
          return (
            (h.startTime = null != u ? u : this.calcStartTime()),
            this.pendingTimeline
              ? (X(h, this.pendingTimeline), (this.pendingTimeline = void 0))
              : (h.onfinish = () => {
                  let { onComplete: i } = this.options;
                  a.set(tg(e, this.options, t)), i && i(), this.cancel(), this.resolveFinishedPromise();
                }),
            { animation: h, duration: r, times: n, type: o, ease: s, keyframes: e }
          );
        }
        get duration() {
          let { resolved: e } = this;
          if (!e) return 0;
          let { duration: t } = e;
          return G(t);
        }
        get time() {
          let { resolved: e } = this;
          if (!e) return 0;
          let { animation: t } = e;
          return G(t.currentTime || 0);
        }
        set time(e) {
          let { resolved: t } = this;
          if (!t) return;
          let { animation: i } = t;
          i.currentTime = W(e);
        }
        get speed() {
          let { resolved: e } = this;
          if (!e) return 1;
          let { animation: t } = e;
          return t.playbackRate;
        }
        set speed(e) {
          let { resolved: t } = this;
          if (!t) return;
          let { animation: i } = t;
          i.playbackRate = e;
        }
        get state() {
          let { resolved: e } = this;
          if (!e) return "idle";
          let { animation: t } = e;
          return t.playState;
        }
        get startTime() {
          let { resolved: e } = this;
          if (!e) return null;
          let { animation: t } = e;
          return t.startTime;
        }
        attachTimeline(e) {
          if (this._resolved) {
            let { resolved: t } = this;
            if (!t) return x;
            let { animation: i } = t;
            X(i, e);
          } else this.pendingTimeline = e;
          return x;
        }
        play() {
          if (this.isStopped) return;
          let { resolved: e } = this;
          if (!e) return;
          let { animation: t } = e;
          "finished" === t.playState && this.updateFinishedPromise(), t.play();
        }
        pause() {
          let { resolved: e } = this;
          if (!e) return;
          let { animation: t } = e;
          t.pause();
        }
        stop() {
          if ((this.resolver.cancel(), (this.isStopped = !0), "idle" === this.state)) return;
          this.resolveFinishedPromise(), this.updateFinishedPromise();
          let { resolved: e } = this;
          if (!e) return;
          let { animation: t, keyframes: i, duration: r, type: n, ease: s, times: o } = e;
          if ("idle" === t.playState || "finished" === t.playState) return;
          if (this.time) {
            let { motionValue: e, onUpdate: t, onComplete: a, element: l, ...u } = this.options,
              h = new t0({ ...u, keyframes: i, duration: r, type: n, ease: s, times: o, isGenerator: !0 }),
              d = W(this.time);
            e.setWithVelocity(h.sample(d - 10).value, h.sample(d).value, 10);
          }
          let { onStop: a } = this.options;
          a && a(), this.cancel();
        }
        complete() {
          let { resolved: e } = this;
          e && e.animation.finish();
        }
        cancel() {
          let { resolved: e } = this;
          e && e.animation.cancel();
        }
        static supports(e) {
          let { motionValue: t, name: i, repeatDelay: r, repeatType: n, damping: s, type: o } = e;
          if (!t || !t.owner || !(t.owner.current instanceof HTMLElement)) return !1;
          let { onUpdate: a, transformTemplate: l } = t.owner.getProps();
          return t2() && i && t1.has(i) && !a && !l && !r && "mirror" !== n && 0 !== s && "inertia" !== o;
        }
      }
      let t9 = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
        t4 = (e) => ({ type: "spring", stiffness: 550, damping: 0 === e ? 2 * Math.sqrt(550) : 30, restSpeed: 10 }),
        t6 = { type: "keyframes", duration: 0.8 },
        t8 = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
        t7 = (e, { keyframes: t }) => (t.length > 2 ? t6 : f.has(e) ? (e.startsWith("scale") ? t4(t[1]) : t9) : t8),
        ie =
          (e, t, i, r = {}, n, s) =>
          (o) => {
            let a = p(r, e) || {},
              l = a.delay || r.delay || 0,
              { elapsed: u = 0 } = r;
            u -= W(l);
            let h = {
              keyframes: Array.isArray(i) ? i : [null, i],
              ease: "easeOut",
              velocity: t.getVelocity(),
              ...a,
              delay: -u,
              onUpdate: (e) => {
                t.set(e), a.onUpdate && a.onUpdate(e);
              },
              onComplete: () => {
                o(), a.onComplete && a.onComplete();
              },
              name: e,
              motionValue: t,
              element: s ? void 0 : n,
            };
            !(function ({
              when: e,
              delay: t,
              delayChildren: i,
              staggerChildren: r,
              staggerDirection: n,
              repeat: s,
              repeatType: o,
              repeatDelay: a,
              from: l,
              elapsed: u,
              ...h
            }) {
              return !!Object.keys(h).length;
            })(a) && (h = { ...h, ...t7(e, h) }),
              h.duration && (h.duration = W(h.duration)),
              h.repeatDelay && (h.repeatDelay = W(h.repeatDelay)),
              void 0 !== h.from && (h.keyframes[0] = h.from);
            let d = !1;
            if (
              ((!1 !== h.type && (0 !== h.duration || h.repeatDelay)) || ((h.duration = 0), 0 === h.delay && (d = !0)),
              (H.current || b.skipAnimations) && ((d = !0), (h.duration = 0), (h.delay = 0)),
              d && !s && void 0 !== t.get())
            ) {
              let e = tg(h.keyframes, a);
              if (void 0 !== e)
                return (
                  P.update(() => {
                    h.onUpdate(e), h.onComplete();
                  }),
                  new $([])
                );
            }
            return !s && t3.supports(h) ? new t3(h) : new t0(h);
          };
      function it(e, t, { delay: i = 0, transitionOverride: r, type: n } = {}) {
        var s;
        let { transition: o = e.getDefaultTransition(), transitionEnd: a, ...l } = t;
        r && (o = r);
        let u = [],
          d = n && e.animationState && e.animationState.getState()[n];
        for (let t in l) {
          let r = e.getValue(t, null != (s = e.latestValues[t]) ? s : null),
            n = l[t];
          if (
            void 0 === n ||
            (d &&
              (function ({ protectedKeys: e, needsAnimating: t }, i) {
                let r = e.hasOwnProperty(i) && !0 !== t[i];
                return (t[i] = !1), r;
              })(d, t))
          )
            continue;
          let a = { delay: i, ...p(o || {}, t) },
            h = !1;
          if (window.MotionHandoffAnimation) {
            let i = e.props[I];
            if (i) {
              let e = window.MotionHandoffAnimation(i, t, P);
              null !== e && ((a.startTime = e), (h = !0));
            }
          }
          O(e, t), r.start(ie(t, r, n, e.shouldReduceMotion && g.has(t) ? { type: !1 } : a, e, h));
          let c = r.animation;
          c && u.push(c);
        }
        return (
          a &&
            Promise.all(u).then(() => {
              P.update(() => {
                a &&
                  (function (e, t) {
                    let { transitionEnd: i = {}, transition: r = {}, ...n } = h(e, t) || {};
                    for (let t in (n = { ...n, ...i })) {
                      let i = y(n[t]);
                      e.hasValue(t) ? e.getValue(t).set(i) : e.addValue(t, F(i));
                    }
                  })(e, a);
              });
            }),
          u
        );
      }
      function ii(e, t, i = {}) {
        var r;
        let n = h(e, t, "exit" === i.type ? (null == (r = e.presenceContext) ? void 0 : r.custom) : void 0),
          { transition: s = e.getDefaultTransition() || {} } = n || {};
        i.transitionOverride && (s = i.transitionOverride);
        let o = n ? () => Promise.all(it(e, n, i)) : () => Promise.resolve(),
          a =
            e.variantChildren && e.variantChildren.size
              ? (r = 0) => {
                  let { delayChildren: n = 0, staggerChildren: o, staggerDirection: a } = s;
                  return (function (e, t, i = 0, r = 0, n = 1, s) {
                    let o = [],
                      a = (e.variantChildren.size - 1) * r,
                      l = 1 === n ? (e = 0) => e * r : (e = 0) => a - e * r;
                    return (
                      Array.from(e.variantChildren)
                        .sort(ir)
                        .forEach((e, r) => {
                          e.notify("AnimationStart", t),
                            o.push(ii(e, t, { ...s, delay: i + l(r) }).then(() => e.notify("AnimationComplete", t)));
                        }),
                      Promise.all(o)
                    );
                  })(e, t, n + r, o, a, i);
                }
              : () => Promise.resolve(),
          { when: l } = s;
        if (!l) return Promise.all([o(), a(i.delay)]);
        {
          let [e, t] = "beforeChildren" === l ? [o, a] : [a, o];
          return e().then(() => t());
        }
      }
      function ir(e, t) {
        return e.sortNodePosition(t);
      }
      let is = c.length,
        io = [...d].reverse(),
        ia = d.length;
      function il(e = !1) {
        return { isActive: e, protectedKeys: {}, needsAnimating: {}, prevResolvedValues: {} };
      }
      function iu() {
        return {
          animate: il(!0),
          whileInView: il(),
          whileHover: il(),
          whileTap: il(),
          whileDrag: il(),
          whileFocus: il(),
          exit: il(),
        };
      }
      class ih {
        constructor(e) {
          (this.isMounted = !1), (this.node = e);
        }
        update() {}
      }
      class id extends ih {
        constructor(e) {
          super(e),
            e.animationState ||
              (e.animationState = (function (e) {
                let t = (t) =>
                    Promise.all(
                      t.map(({ animation: t, options: i }) =>
                        (function (e, t, i = {}) {
                          let r;
                          if ((e.notify("AnimationStart", t), Array.isArray(t)))
                            r = Promise.all(t.map((t) => ii(e, t, i)));
                          else if ("string" == typeof t) r = ii(e, t, i);
                          else {
                            let n = "function" == typeof t ? h(e, t, i.custom) : t;
                            r = Promise.all(it(e, n, i));
                          }
                          return r.then(() => {
                            e.notify("AnimationComplete", t);
                          });
                        })(e, t, i)
                      )
                    ),
                  i = iu(),
                  r = !0,
                  l = (t) => (i, r) => {
                    var n;
                    let s = h(e, r, "exit" === t ? (null == (n = e.presenceContext) ? void 0 : n.custom) : void 0);
                    if (s) {
                      let { transition: e, transitionEnd: t, ...r } = s;
                      i = { ...i, ...r, ...t };
                    }
                    return i;
                  };
                function u(u) {
                  let { props: h } = e,
                    d =
                      (function e(t) {
                        if (!t) return;
                        if (!t.isControllingVariants) {
                          let i = (t.parent && e(t.parent)) || {};
                          return void 0 !== t.props.initial && (i.initial = t.props.initial), i;
                        }
                        let i = {};
                        for (let e = 0; e < is; e++) {
                          let r = c[e],
                            n = t.props[r];
                          (a(n) || !1 === n) && (i[r] = n);
                        }
                        return i;
                      })(e.parent) || {},
                    p = [],
                    m = new Set(),
                    f = {},
                    g = 1 / 0;
                  for (let t = 0; t < ia; t++) {
                    var v, y;
                    let c = io[t],
                      b = i[c],
                      x = void 0 !== h[c] ? h[c] : d[c],
                      w = a(x),
                      S = c === u ? b.isActive : null;
                    !1 === S && (g = t);
                    let P = x === d[c] && x !== h[c] && w;
                    if (
                      (P && r && e.manuallyAnimateOnMount && (P = !1),
                      (b.protectedKeys = { ...f }),
                      (!b.isActive && null === S) || (!x && !b.prevProp) || n(x) || "boolean" == typeof x)
                    )
                      continue;
                    let T = ((v = b.prevProp), "string" == typeof (y = x) ? y !== v : !!Array.isArray(y) && !o(y, v)),
                      A = T || (c === u && b.isActive && !P && w) || (t > g && w),
                      C = !1,
                      E = Array.isArray(x) ? x : [x],
                      k = E.reduce(l(c), {});
                    !1 === S && (k = {});
                    let { prevResolvedValues: M = {} } = b,
                      j = { ...M, ...k },
                      R = (t) => {
                        (A = !0), m.has(t) && ((C = !0), m.delete(t)), (b.needsAnimating[t] = !0);
                        let i = e.getValue(t);
                        i && (i.liveStyle = !1);
                      };
                    for (let e in j) {
                      let t = k[e],
                        i = M[e];
                      if (f.hasOwnProperty(e)) continue;
                      let r = !1;
                      (s(t) && s(i) ? o(t, i) : t === i)
                        ? void 0 !== t && m.has(e)
                          ? R(e)
                          : (b.protectedKeys[e] = !0)
                        : null != t
                          ? R(e)
                          : m.add(e);
                    }
                    (b.prevProp = x),
                      (b.prevResolvedValues = k),
                      b.isActive && (f = { ...f, ...k }),
                      r && e.blockInitialAnimation && (A = !1);
                    let V = !(P && T) || C;
                    A && V && p.push(...E.map((e) => ({ animation: e, options: { type: c } })));
                  }
                  if (m.size) {
                    let t = {};
                    m.forEach((i) => {
                      let r = e.getBaseTarget(i),
                        n = e.getValue(i);
                      n && (n.liveStyle = !0), (t[i] = null != r ? r : null);
                    }),
                      p.push({ animation: t });
                  }
                  let b = !!p.length;
                  return (
                    r && (!1 === h.initial || h.initial === h.animate) && !e.manuallyAnimateOnMount && (b = !1),
                    (r = !1),
                    b ? t(p) : Promise.resolve()
                  );
                }
                return {
                  animateChanges: u,
                  setActive: function (t, r) {
                    var n;
                    if (i[t].isActive === r) return Promise.resolve();
                    null == (n = e.variantChildren) ||
                      n.forEach((e) => {
                        var i;
                        return null == (i = e.animationState) ? void 0 : i.setActive(t, r);
                      }),
                      (i[t].isActive = r);
                    let s = u(t);
                    for (let e in i) i[e].protectedKeys = {};
                    return s;
                  },
                  setAnimateFunction: function (i) {
                    t = i(e);
                  },
                  getState: () => i,
                  reset: () => {
                    (i = iu()), (r = !0);
                  },
                };
              })(e));
        }
        updateAnimationControlsSubscription() {
          let { animate: e } = this.node.getProps();
          n(e) && (this.unmountControls = e.subscribe(this.node));
        }
        mount() {
          this.updateAnimationControlsSubscription();
        }
        update() {
          let { animate: e } = this.node.getProps(),
            { animate: t } = this.node.prevProps || {};
          e !== t && this.updateAnimationControlsSubscription();
        }
        unmount() {
          var e;
          this.node.animationState.reset(), null == (e = this.unmountControls) || e.call(this);
        }
      }
      let ic = 0;
      class ip extends ih {
        constructor() {
          super(...arguments), (this.id = ic++);
        }
        update() {
          if (!this.node.presenceContext) return;
          let { isPresent: e, onExitComplete: t } = this.node.presenceContext,
            { isPresent: i } = this.node.prevPresenceContext || {};
          if (!this.node.animationState || e === i) return;
          let r = this.node.animationState.setActive("exit", !e);
          t && !e && r.then(() => t(this.id));
        }
        mount() {
          let { register: e } = this.node.presenceContext || {};
          e && (this.unmount = e(this.id));
        }
        unmount() {}
      }
      let im = { x: !1, y: !1 },
        ig = (e) => ("mouse" === e.pointerType ? "number" != typeof e.button || e.button <= 0 : !1 !== e.isPrimary);
      function iv(e, t, i, r = { passive: !0 }) {
        return e.addEventListener(t, i, r), () => e.removeEventListener(t, i);
      }
      function iy(e) {
        return { point: { x: e.pageX, y: e.pageY } };
      }
      let ib = (e) => (t) => ig(t) && e(t, iy(t));
      function ix(e, t, i, r) {
        return iv(e, t, ib(i), r);
      }
      let iw = (e, t) => Math.abs(e - t);
      class iS {
        constructor(e, t, { transformPagePoint: i, contextWindow: r, dragSnapToOrigin: n = !1 } = {}) {
          if (
            ((this.startEvent = null),
            (this.lastMoveEvent = null),
            (this.lastMoveEventInfo = null),
            (this.handlers = {}),
            (this.contextWindow = window),
            (this.updatePoint = () => {
              if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
              let e = iA(this.lastMoveEventInfo, this.history),
                t = null !== this.startEvent,
                i =
                  (function (e, t) {
                    return Math.sqrt(iw(e.x, t.x) ** 2 + iw(e.y, t.y) ** 2);
                  })(e.offset, { x: 0, y: 0 }) >= 3;
              if (!t && !i) return;
              let { point: r } = e,
                { timestamp: n } = A;
              this.history.push({ ...r, timestamp: n });
              let { onStart: s, onMove: o } = this.handlers;
              t || (s && s(this.lastMoveEvent, e), (this.startEvent = this.lastMoveEvent)),
                o && o(this.lastMoveEvent, e);
            }),
            (this.handlePointerMove = (e, t) => {
              (this.lastMoveEvent = e),
                (this.lastMoveEventInfo = iP(t, this.transformPagePoint)),
                P.update(this.updatePoint, !0);
            }),
            (this.handlePointerUp = (e, t) => {
              this.end();
              let { onEnd: i, onSessionEnd: r, resumeAnimation: n } = this.handlers;
              if ((this.dragSnapToOrigin && n && n(), !(this.lastMoveEvent && this.lastMoveEventInfo))) return;
              let s = iA(
                "pointercancel" === e.type ? this.lastMoveEventInfo : iP(t, this.transformPagePoint),
                this.history
              );
              this.startEvent && i && i(e, s), r && r(e, s);
            }),
            !ig(e))
          )
            return;
          (this.dragSnapToOrigin = n),
            (this.handlers = t),
            (this.transformPagePoint = i),
            (this.contextWindow = r || window);
          let s = iP(iy(e), this.transformPagePoint),
            { point: o } = s,
            { timestamp: a } = A;
          this.history = [{ ...o, timestamp: a }];
          let { onSessionStart: l } = t;
          l && l(e, iA(s, this.history)),
            (this.removeListeners = tk(
              ix(this.contextWindow, "pointermove", this.handlePointerMove),
              ix(this.contextWindow, "pointerup", this.handlePointerUp),
              ix(this.contextWindow, "pointercancel", this.handlePointerUp)
            ));
        }
        updateHandlers(e) {
          this.handlers = e;
        }
        end() {
          this.removeListeners && this.removeListeners(), T(this.updatePoint);
        }
      }
      function iP(e, t) {
        return t ? { point: t(e.point) } : e;
      }
      function iT(e, t) {
        return { x: e.x - t.x, y: e.y - t.y };
      }
      function iA({ point: e }, t) {
        return {
          point: e,
          delta: iT(e, iC(t)),
          offset: iT(e, t[0]),
          velocity: (function (e, t) {
            if (e.length < 2) return { x: 0, y: 0 };
            let i = e.length - 1,
              r = null,
              n = iC(e);
            for (; i >= 0 && ((r = e[i]), !(n.timestamp - r.timestamp > W(0.1))); ) i--;
            if (!r) return { x: 0, y: 0 };
            let s = G(n.timestamp - r.timestamp);
            if (0 === s) return { x: 0, y: 0 };
            let o = { x: (n.x - r.x) / s, y: (n.y - r.y) / s };
            return o.x === 1 / 0 && (o.x = 0), o.y === 1 / 0 && (o.y = 0), o;
          })(t, 0.1),
        };
      }
      function iC(e) {
        return e[e.length - 1];
      }
      function iE(e) {
        return e && "object" == typeof e && Object.prototype.hasOwnProperty.call(e, "current");
      }
      function ik(e) {
        return e.max - e.min;
      }
      function iM(e, t, i, r = 0.5) {
        (e.origin = r),
          (e.originPoint = tb(t.min, t.max, e.origin)),
          (e.scale = ik(i) / ik(t)),
          (e.translate = tb(i.min, i.max, e.origin) - e.originPoint),
          ((e.scale >= 0.9999 && e.scale <= 1.0001) || isNaN(e.scale)) && (e.scale = 1),
          ((e.translate >= -0.01 && e.translate <= 0.01) || isNaN(e.translate)) && (e.translate = 0);
      }
      function ij(e, t, i, r) {
        iM(e.x, t.x, i.x, r ? r.originX : void 0), iM(e.y, t.y, i.y, r ? r.originY : void 0);
      }
      function iR(e, t, i) {
        (e.min = i.min + t.min), (e.max = e.min + ik(t));
      }
      function iV(e, t, i) {
        (e.min = t.min - i.min), (e.max = e.min + ik(t));
      }
      function i_(e, t, i) {
        iV(e.x, t.x, i.x), iV(e.y, t.y, i.y);
      }
      function iD(e, t, i) {
        return { min: void 0 !== t ? e.min + t : void 0, max: void 0 !== i ? e.max + i - (e.max - e.min) : void 0 };
      }
      function iF(e, t) {
        let i = t.min - e.min,
          r = t.max - e.max;
        return t.max - t.min < e.max - e.min && ([i, r] = [r, i]), { min: i, max: r };
      }
      function iL(e, t, i) {
        return { min: iO(e, t), max: iO(e, i) };
      }
      function iO(e, t) {
        return "number" == typeof e ? e : e[t] || 0;
      }
      let iz = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
        iI = () => ({ x: iz(), y: iz() }),
        iB = () => ({ min: 0, max: 0 }),
        iN = () => ({ x: iB(), y: iB() });
      function iU(e) {
        return [e("x"), e("y")];
      }
      function i$({ top: e, left: t, right: i, bottom: r }) {
        return { x: { min: t, max: i }, y: { min: e, max: r } };
      }
      function iW(e) {
        return void 0 === e || 1 === e;
      }
      function iG({ scale: e, scaleX: t, scaleY: i }) {
        return !iW(e) || !iW(t) || !iW(i);
      }
      function iH(e) {
        return iG(e) || iq(e) || e.z || e.rotate || e.rotateX || e.rotateY || e.skewX || e.skewY;
      }
      function iq(e) {
        var t, i;
        return ((t = e.x) && "0%" !== t) || ((i = e.y) && "0%" !== i);
      }
      function iX(e, t, i, r, n) {
        return void 0 !== n && (e = r + n * (e - r)), r + i * (e - r) + t;
      }
      function iY(e, t = 0, i = 1, r, n) {
        (e.min = iX(e.min, t, i, r, n)), (e.max = iX(e.max, t, i, r, n));
      }
      function iK(e, { x: t, y: i }) {
        iY(e.x, t.translate, t.scale, t.originPoint), iY(e.y, i.translate, i.scale, i.originPoint);
      }
      function iZ(e, t) {
        (e.min = e.min + t), (e.max = e.max + t);
      }
      function iQ(e, t, i, r, n = 0.5) {
        let s = tb(e.min, e.max, n);
        iY(e, t, i, s, r);
      }
      function iJ(e, t) {
        iQ(e.x, t.x, t.scaleX, t.scale, t.originX), iQ(e.y, t.y, t.scaleY, t.scale, t.originY);
      }
      function i0(e, t) {
        return i$(
          (function (e, t) {
            if (!t) return e;
            let i = t({ x: e.left, y: e.top }),
              r = t({ x: e.right, y: e.bottom });
            return { top: i.y, left: i.x, bottom: r.y, right: r.x };
          })(e.getBoundingClientRect(), t)
        );
      }
      let i1 = ({ current: e }) => (e ? e.ownerDocument.defaultView : null),
        i2 = new WeakMap();
      class i5 {
        constructor(e) {
          (this.openDragLock = null),
            (this.isDragging = !1),
            (this.currentDirection = null),
            (this.originPoint = { x: 0, y: 0 }),
            (this.constraints = !1),
            (this.hasMutatedConstraints = !1),
            (this.elastic = iN()),
            (this.visualElement = e);
        }
        start(e, { snapToCursor: t = !1 } = {}) {
          let { presenceContext: i } = this.visualElement;
          if (i && !1 === i.isPresent) return;
          let { dragSnapToOrigin: r } = this.getProps();
          this.panSession = new iS(
            e,
            {
              onSessionStart: (e) => {
                let { dragSnapToOrigin: i } = this.getProps();
                i ? this.pauseAnimation() : this.stopAnimation(), t && this.snapToCursor(iy(e).point);
              },
              onStart: (e, t) => {
                let { drag: i, dragPropagation: r, onDragStart: n } = this.getProps();
                if (
                  i &&
                  !r &&
                  (this.openDragLock && this.openDragLock(),
                  (this.openDragLock = (function (e) {
                    if ("x" === e || "y" === e)
                      if (im[e]) return null;
                      else
                        return (
                          (im[e] = !0),
                          () => {
                            im[e] = !1;
                          }
                        );
                    return im.x || im.y
                      ? null
                      : ((im.x = im.y = !0),
                        () => {
                          im.x = im.y = !1;
                        });
                  })(i)),
                  !this.openDragLock)
                )
                  return;
                (this.isDragging = !0),
                  (this.currentDirection = null),
                  this.resolveConstraints(),
                  this.visualElement.projection &&
                    ((this.visualElement.projection.isAnimationBlocked = !0),
                    (this.visualElement.projection.target = void 0)),
                  iU((e) => {
                    let t = this.getAxisMotionValue(e).get() || 0;
                    if (eM.test(t)) {
                      let { projection: i } = this.visualElement;
                      if (i && i.layout) {
                        let r = i.layout.layoutBox[e];
                        r && (t = ik(r) * (parseFloat(t) / 100));
                      }
                    }
                    this.originPoint[e] = t;
                  }),
                  n && P.postRender(() => n(e, t)),
                  O(this.visualElement, "transform");
                let { animationState: s } = this.visualElement;
                s && s.setActive("whileDrag", !0);
              },
              onMove: (e, t) => {
                let { dragPropagation: i, dragDirectionLock: r, onDirectionLock: n, onDrag: s } = this.getProps();
                if (!i && !this.openDragLock) return;
                let { offset: o } = t;
                if (r && null === this.currentDirection) {
                  (this.currentDirection = (function (e, t = 10) {
                    let i = null;
                    return Math.abs(e.y) > t ? (i = "y") : Math.abs(e.x) > t && (i = "x"), i;
                  })(o)),
                    null !== this.currentDirection && n && n(this.currentDirection);
                  return;
                }
                this.updateAxis("x", t.point, o),
                  this.updateAxis("y", t.point, o),
                  this.visualElement.render(),
                  s && s(e, t);
              },
              onSessionEnd: (e, t) => this.stop(e, t),
              resumeAnimation: () =>
                iU((e) => {
                  var t;
                  return (
                    "paused" === this.getAnimationState(e) &&
                    (null == (t = this.getAxisMotionValue(e).animation) ? void 0 : t.play())
                  );
                }),
            },
            {
              transformPagePoint: this.visualElement.getTransformPagePoint(),
              dragSnapToOrigin: r,
              contextWindow: i1(this.visualElement),
            }
          );
        }
        stop(e, t) {
          let i = this.isDragging;
          if ((this.cancel(), !i)) return;
          let { velocity: r } = t;
          this.startAnimation(r);
          let { onDragEnd: n } = this.getProps();
          n && P.postRender(() => n(e, t));
        }
        cancel() {
          this.isDragging = !1;
          let { projection: e, animationState: t } = this.visualElement;
          e && (e.isAnimationBlocked = !1), this.panSession && this.panSession.end(), (this.panSession = void 0);
          let { dragPropagation: i } = this.getProps();
          !i && this.openDragLock && (this.openDragLock(), (this.openDragLock = null)),
            t && t.setActive("whileDrag", !1);
        }
        updateAxis(e, t, i) {
          let { drag: r } = this.getProps();
          if (!i || !i3(e, r, this.currentDirection)) return;
          let n = this.getAxisMotionValue(e),
            s = this.originPoint[e] + i[e];
          this.constraints &&
            this.constraints[e] &&
            (s = (function (e, { min: t, max: i }, r) {
              return (
                void 0 !== t && e < t
                  ? (e = r ? tb(t, e, r.min) : Math.max(e, t))
                  : void 0 !== i && e > i && (e = r ? tb(i, e, r.max) : Math.min(e, i)),
                e
              );
            })(s, this.constraints[e], this.elastic[e])),
            n.set(s);
        }
        resolveConstraints() {
          var e;
          let { dragConstraints: t, dragElastic: i } = this.getProps(),
            r =
              this.visualElement.projection && !this.visualElement.projection.layout
                ? this.visualElement.projection.measure(!1)
                : null == (e = this.visualElement.projection)
                  ? void 0
                  : e.layout,
            n = this.constraints;
          t && iE(t)
            ? this.constraints || (this.constraints = this.resolveRefConstraints())
            : t && r
              ? (this.constraints = (function (e, { top: t, left: i, bottom: r, right: n }) {
                  return { x: iD(e.x, i, n), y: iD(e.y, t, r) };
                })(r.layoutBox, t))
              : (this.constraints = !1),
            (this.elastic = (function (e = 0.35) {
              return (
                !1 === e ? (e = 0) : !0 === e && (e = 0.35), { x: iL(e, "left", "right"), y: iL(e, "top", "bottom") }
              );
            })(i)),
            n !== this.constraints &&
              r &&
              this.constraints &&
              !this.hasMutatedConstraints &&
              iU((e) => {
                !1 !== this.constraints &&
                  this.getAxisMotionValue(e) &&
                  (this.constraints[e] = (function (e, t) {
                    let i = {};
                    return void 0 !== t.min && (i.min = t.min - e.min), void 0 !== t.max && (i.max = t.max - e.min), i;
                  })(r.layoutBox[e], this.constraints[e]));
              });
        }
        resolveRefConstraints() {
          var e;
          let { dragConstraints: t, onMeasureDragConstraints: i } = this.getProps();
          if (!t || !iE(t)) return !1;
          let r = t.current;
          x(
            null !== r,
            "If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop."
          );
          let { projection: n } = this.visualElement;
          if (!n || !n.layout) return !1;
          let s = (function (e, t, i) {
              let r = i0(e, i),
                { scroll: n } = t;
              return n && (iZ(r.x, n.offset.x), iZ(r.y, n.offset.y)), r;
            })(r, n.root, this.visualElement.getTransformPagePoint()),
            o = ((e = n.layout.layoutBox), { x: iF(e.x, s.x), y: iF(e.y, s.y) });
          if (i) {
            let e = i(
              (function ({ x: e, y: t }) {
                return { top: t.min, right: e.max, bottom: t.max, left: e.min };
              })(o)
            );
            (this.hasMutatedConstraints = !!e), e && (o = i$(e));
          }
          return o;
        }
        startAnimation(e) {
          let {
              drag: t,
              dragMomentum: i,
              dragElastic: r,
              dragTransition: n,
              dragSnapToOrigin: s,
              onDragTransitionEnd: o,
            } = this.getProps(),
            a = this.constraints || {};
          return Promise.all(
            iU((o) => {
              if (!i3(o, t, this.currentDirection)) return;
              let l = (a && a[o]) || {};
              s && (l = { min: 0, max: 0 });
              let u = {
                type: "inertia",
                velocity: i ? e[o] : 0,
                bounceStiffness: r ? 200 : 1e6,
                bounceDamping: r ? 40 : 1e7,
                timeConstant: 750,
                restDelta: 1,
                restSpeed: 10,
                ...n,
                ...l,
              };
              return this.startAxisValueAnimation(o, u);
            })
          ).then(o);
        }
        startAxisValueAnimation(e, t) {
          let i = this.getAxisMotionValue(e);
          return O(this.visualElement, e), i.start(ie(e, i, 0, t, this.visualElement, !1));
        }
        stopAnimation() {
          iU((e) => this.getAxisMotionValue(e).stop());
        }
        pauseAnimation() {
          iU((e) => {
            var t;
            return null == (t = this.getAxisMotionValue(e).animation) ? void 0 : t.pause();
          });
        }
        getAnimationState(e) {
          var t;
          return null == (t = this.getAxisMotionValue(e).animation) ? void 0 : t.state;
        }
        getAxisMotionValue(e) {
          let t = `_drag${e.toUpperCase()}`,
            i = this.visualElement.getProps();
          return i[t] || this.visualElement.getValue(e, (i.initial ? i.initial[e] : void 0) || 0);
        }
        snapToCursor(e) {
          iU((t) => {
            let { drag: i } = this.getProps();
            if (!i3(t, i, this.currentDirection)) return;
            let { projection: r } = this.visualElement,
              n = this.getAxisMotionValue(t);
            if (r && r.layout) {
              let { min: i, max: s } = r.layout.layoutBox[t];
              n.set(e[t] - tb(i, s, 0.5));
            }
          });
        }
        scalePositionWithinConstraints() {
          if (!this.visualElement.current) return;
          let { drag: e, dragConstraints: t } = this.getProps(),
            { projection: i } = this.visualElement;
          if (!iE(t) || !i || !this.constraints) return;
          this.stopAnimation();
          let r = { x: 0, y: 0 };
          iU((e) => {
            let t = this.getAxisMotionValue(e);
            if (t && !1 !== this.constraints) {
              let i = t.get();
              r[e] = (function (e, t) {
                let i = 0.5,
                  r = ik(e),
                  n = ik(t);
                return (
                  n > r ? (i = Q(t.min, t.max - r, e.min)) : r > n && (i = Q(e.min, e.max - n, t.min)), em(0, 1, i)
                );
              })({ min: i, max: i }, this.constraints[e]);
            }
          });
          let { transformTemplate: n } = this.visualElement.getProps();
          (this.visualElement.current.style.transform = n ? n({}, "") : "none"),
            i.root && i.root.updateScroll(),
            i.updateLayout(),
            this.resolveConstraints(),
            iU((t) => {
              if (!i3(t, e, null)) return;
              let i = this.getAxisMotionValue(t),
                { min: n, max: s } = this.constraints[t];
              i.set(tb(n, s, r[t]));
            });
        }
        addListeners() {
          if (!this.visualElement.current) return;
          i2.set(this.visualElement, this);
          let e = ix(this.visualElement.current, "pointerdown", (e) => {
              let { drag: t, dragListener: i = !0 } = this.getProps();
              t && i && this.start(e);
            }),
            t = () => {
              let { dragConstraints: e } = this.getProps();
              iE(e) && e.current && (this.constraints = this.resolveRefConstraints());
            },
            { projection: i } = this.visualElement,
            r = i.addEventListener("measure", t);
          i && !i.layout && (i.root && i.root.updateScroll(), i.updateLayout()), P.read(t);
          let n = iv(window, "resize", () => this.scalePositionWithinConstraints()),
            s = i.addEventListener("didUpdate", ({ delta: e, hasLayoutChanged: t }) => {
              this.isDragging &&
                t &&
                (iU((t) => {
                  let i = this.getAxisMotionValue(t);
                  i && ((this.originPoint[t] += e[t].translate), i.set(i.get() + e[t].translate));
                }),
                this.visualElement.render());
            });
          return () => {
            n(), e(), r(), s && s();
          };
        }
        getProps() {
          let e = this.visualElement.getProps(),
            {
              drag: t = !1,
              dragDirectionLock: i = !1,
              dragPropagation: r = !1,
              dragConstraints: n = !1,
              dragElastic: s = 0.35,
              dragMomentum: o = !0,
            } = e;
          return {
            ...e,
            drag: t,
            dragDirectionLock: i,
            dragPropagation: r,
            dragConstraints: n,
            dragElastic: s,
            dragMomentum: o,
          };
        }
      }
      function i3(e, t, i) {
        return (!0 === t || t === e) && (null === i || i === e);
      }
      class i9 extends ih {
        constructor(e) {
          super(e), (this.removeGroupControls = x), (this.removeListeners = x), (this.controls = new i5(e));
        }
        mount() {
          let { dragControls: e } = this.node.getProps();
          e && (this.removeGroupControls = e.subscribe(this.controls)),
            (this.removeListeners = this.controls.addListeners() || x);
        }
        unmount() {
          this.removeGroupControls(), this.removeListeners();
        }
      }
      let i4 = (e) => (t, i) => {
        e && P.postRender(() => e(t, i));
      };
      class i6 extends ih {
        constructor() {
          super(...arguments), (this.removePointerDownListener = x);
        }
        onPointerDown(e) {
          this.session = new iS(e, this.createPanHandlers(), {
            transformPagePoint: this.node.getTransformPagePoint(),
            contextWindow: i1(this.node),
          });
        }
        createPanHandlers() {
          let { onPanSessionStart: e, onPanStart: t, onPan: i, onPanEnd: r } = this.node.getProps();
          return {
            onSessionStart: i4(e),
            onStart: i4(t),
            onMove: i,
            onEnd: (e, t) => {
              delete this.session, r && P.postRender(() => r(e, t));
            },
          };
        }
        mount() {
          this.removePointerDownListener = ix(this.node.current, "pointerdown", (e) => this.onPointerDown(e));
        }
        update() {
          this.session && this.session.updateHandlers(this.createPanHandlers());
        }
        unmount() {
          this.removePointerDownListener(), this.session && this.session.end();
        }
      }
      var i8,
        i7,
        re = i(5155),
        rt = i(2115),
        ri = i(4905),
        rr = i(7728);
      let rn = (0, rt.createContext)({}),
        rs = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
      function ro(e, t) {
        return t.max === t.min ? 0 : (e / (t.max - t.min)) * 100;
      }
      let ra = {
          correct: (e, t) => {
            if (!t.target) return e;
            if ("string" == typeof e)
              if (!ej.test(e)) return e;
              else e = parseFloat(e);
            let i = ro(e, t.target.x),
              r = ro(e, t.target.y);
            return `${i}% ${r}%`;
          },
        },
        rl = {},
        { schedule: ru, cancel: rh } = S(queueMicrotask, !1);
      class rd extends rt.Component {
        componentDidMount() {
          let { visualElement: e, layoutGroup: t, switchLayoutGroup: i, layoutId: r } = this.props,
            { projection: n } = e;
          for (let e in rp) (rl[e] = rp[e]), ts(e) && (rl[e].isCSSVariable = !0);
          n &&
            (t.group && t.group.add(n),
            i && i.register && r && i.register(n),
            n.root.didUpdate(),
            n.addEventListener("animationComplete", () => {
              this.safeToRemove();
            }),
            n.setOptions({ ...n.options, onExitComplete: () => this.safeToRemove() })),
            (rs.hasEverUpdated = !0);
        }
        getSnapshotBeforeUpdate(e) {
          let { layoutDependency: t, visualElement: i, drag: r, isPresent: n } = this.props,
            s = i.projection;
          return (
            s &&
              ((s.isPresent = n),
              r || e.layoutDependency !== t || void 0 === t ? s.willUpdate() : this.safeToRemove(),
              e.isPresent !== n &&
                (n
                  ? s.promote()
                  : s.relegate() ||
                    P.postRender(() => {
                      let e = s.getStack();
                      (e && e.members.length) || this.safeToRemove();
                    }))),
            null
          );
        }
        componentDidUpdate() {
          let { projection: e } = this.props.visualElement;
          e &&
            (e.root.didUpdate(),
            ru.postRender(() => {
              !e.currentAnimation && e.isLead() && this.safeToRemove();
            }));
        }
        componentWillUnmount() {
          let { visualElement: e, layoutGroup: t, switchLayoutGroup: i } = this.props,
            { projection: r } = e;
          r && (r.scheduleCheckAfterUnmount(), t && t.group && t.group.remove(r), i && i.deregister && i.deregister(r));
        }
        safeToRemove() {
          let { safeToRemove: e } = this.props;
          e && e();
        }
        render() {
          return null;
        }
      }
      function rc(e) {
        let [t, i] = (0, ri.xQ)(),
          r = (0, rt.useContext)(rr.L);
        return (0, re.jsx)(rd, {
          ...e,
          layoutGroup: r,
          switchLayoutGroup: (0, rt.useContext)(rn),
          isPresent: t,
          safeToRemove: i,
        });
      }
      let rp = {
          borderRadius: {
            ...ra,
            applyTo: [
              "borderTopLeftRadius",
              "borderTopRightRadius",
              "borderBottomLeftRadius",
              "borderBottomRightRadius",
            ],
          },
          borderTopLeftRadius: ra,
          borderTopRightRadius: ra,
          borderBottomLeftRadius: ra,
          borderBottomRightRadius: ra,
          boxShadow: {
            correct: (e, { treeScale: t, projectionDelta: i }) => {
              let r = eW.parse(e);
              if (r.length > 5) return e;
              let n = eW.createTransformer(e),
                s = +("number" != typeof r[0]),
                o = i.x.scale * t.x,
                a = i.y.scale * t.y;
              (r[0 + s] /= o), (r[1 + s] /= a);
              let l = tb(o, a, 0.5);
              return (
                "number" == typeof r[2 + s] && (r[2 + s] /= l), "number" == typeof r[3 + s] && (r[3 + s] /= l), n(r)
              );
            },
          },
        },
        rm = (e, t) => e.depth - t.depth;
      class rf {
        constructor() {
          (this.children = []), (this.isDirty = !1);
        }
        add(e) {
          M(this.children, e), (this.isDirty = !0);
        }
        remove(e) {
          j(this.children, e), (this.isDirty = !0);
        }
        forEach(e) {
          this.isDirty && this.children.sort(rm), (this.isDirty = !1), this.children.forEach(e);
        }
      }
      function rg(e) {
        let t = L(e) ? e.get() : e;
        return v(t) ? t.toValue() : t;
      }
      let rv = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
        ry = rv.length,
        rb = (e) => ("string" == typeof e ? parseFloat(e) : e),
        rx = (e) => "number" == typeof e || ej.test(e);
      function rw(e, t) {
        return void 0 !== e[t] ? e[t] : e.borderRadius;
      }
      let rS = rT(0, 0.5, ed),
        rP = rT(0.5, 0.95, x);
      function rT(e, t, i) {
        return (r) => (r < e ? 0 : r > t ? 1 : i(Q(e, t, r)));
      }
      function rA(e, t) {
        (e.min = t.min), (e.max = t.max);
      }
      function rC(e, t) {
        rA(e.x, t.x), rA(e.y, t.y);
      }
      function rE(e, t) {
        (e.translate = t.translate), (e.scale = t.scale), (e.originPoint = t.originPoint), (e.origin = t.origin);
      }
      function rk(e, t, i, r, n) {
        return (e -= t), (e = r + (1 / i) * (e - r)), void 0 !== n && (e = r + (1 / n) * (e - r)), e;
      }
      function rM(e, t, [i, r, n], s, o) {
        !(function (e, t = 0, i = 1, r = 0.5, n, s = e, o = e) {
          if ((eM.test(t) && ((t = parseFloat(t)), (t = tb(o.min, o.max, t / 100) - o.min)), "number" != typeof t))
            return;
          let a = tb(s.min, s.max, r);
          e === s && (a -= t), (e.min = rk(e.min, t, i, a, n)), (e.max = rk(e.max, t, i, a, n));
        })(e, t[i], t[r], t[n], t.scale, s, o);
      }
      let rj = ["x", "scaleX", "originX"],
        rR = ["y", "scaleY", "originY"];
      function rV(e, t, i, r) {
        rM(e.x, t, rj, i ? i.x : void 0, r ? r.x : void 0), rM(e.y, t, rR, i ? i.y : void 0, r ? r.y : void 0);
      }
      function r_(e) {
        return 0 === e.translate && 1 === e.scale;
      }
      function rD(e) {
        return r_(e.x) && r_(e.y);
      }
      function rF(e, t) {
        return e.min === t.min && e.max === t.max;
      }
      function rL(e, t) {
        return Math.round(e.min) === Math.round(t.min) && Math.round(e.max) === Math.round(t.max);
      }
      function rO(e, t) {
        return rL(e.x, t.x) && rL(e.y, t.y);
      }
      function rz(e) {
        return ik(e.x) / ik(e.y);
      }
      function rI(e, t) {
        return e.translate === t.translate && e.scale === t.scale && e.originPoint === t.originPoint;
      }
      class rB {
        constructor() {
          this.members = [];
        }
        add(e) {
          M(this.members, e), e.scheduleRender();
        }
        remove(e) {
          if ((j(this.members, e), e === this.prevLead && (this.prevLead = void 0), e === this.lead)) {
            let e = this.members[this.members.length - 1];
            e && this.promote(e);
          }
        }
        relegate(e) {
          let t,
            i = this.members.findIndex((t) => e === t);
          if (0 === i) return !1;
          for (let e = i; e >= 0; e--) {
            let i = this.members[e];
            if (!1 !== i.isPresent) {
              t = i;
              break;
            }
          }
          return !!t && (this.promote(t), !0);
        }
        promote(e, t) {
          let i = this.lead;
          if (e !== i && ((this.prevLead = i), (this.lead = e), e.show(), i)) {
            i.instance && i.scheduleRender(),
              e.scheduleRender(),
              (e.resumeFrom = i),
              t && (e.resumeFrom.preserveOpacity = !0),
              i.snapshot &&
                ((e.snapshot = i.snapshot), (e.snapshot.latestValues = i.animationValues || i.latestValues)),
              e.root && e.root.isUpdating && (e.isLayoutDirty = !0);
            let { crossfade: r } = e.options;
            !1 === r && i.hide();
          }
        }
        exitAnimationComplete() {
          this.members.forEach((e) => {
            let { options: t, resumingFrom: i } = e;
            t.onExitComplete && t.onExitComplete(), i && i.options.onExitComplete && i.options.onExitComplete();
          });
        }
        scheduleRender() {
          this.members.forEach((e) => {
            e.instance && e.scheduleRender(!1);
          });
        }
        removeLeadSnapshot() {
          this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
        }
      }
      let rN = { type: "projectionFrame", totalNodes: 0, resolvedTargetDeltas: 0, recalculatedProjection: 0 },
        rU = "undefined" != typeof window && void 0 !== window.MotionDebug,
        r$ = ["", "X", "Y", "Z"],
        rW = { visibility: "hidden" },
        rG = 0;
      function rH(e, t, i, r) {
        let { latestValues: n } = t;
        n[e] && ((i[e] = n[e]), t.setStaticValue(e, 0), r && (r[e] = 0));
      }
      function rq({
        attachResizeListener: e,
        defaultParent: t,
        measureScroll: i,
        checkIsScrollRoot: r,
        resetTransform: n,
      }) {
        return class {
          constructor(e = {}, i = null == t ? void 0 : t()) {
            (this.id = rG++),
              (this.animationId = 0),
              (this.children = new Set()),
              (this.options = {}),
              (this.isTreeAnimating = !1),
              (this.isAnimationBlocked = !1),
              (this.isLayoutDirty = !1),
              (this.isProjectionDirty = !1),
              (this.isSharedProjectionDirty = !1),
              (this.isTransformDirty = !1),
              (this.updateManuallyBlocked = !1),
              (this.updateBlockedByResize = !1),
              (this.isUpdating = !1),
              (this.isSVG = !1),
              (this.needsReset = !1),
              (this.shouldResetTransform = !1),
              (this.hasCheckedOptimisedAppear = !1),
              (this.treeScale = { x: 1, y: 1 }),
              (this.eventHandlers = new Map()),
              (this.hasTreeAnimated = !1),
              (this.updateScheduled = !1),
              (this.scheduleUpdate = () => this.update()),
              (this.projectionUpdateScheduled = !1),
              (this.checkUpdateFailed = () => {
                this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
              }),
              (this.updateProjection = () => {
                (this.projectionUpdateScheduled = !1),
                  rU && (rN.totalNodes = rN.resolvedTargetDeltas = rN.recalculatedProjection = 0),
                  this.nodes.forEach(rK),
                  this.nodes.forEach(r5),
                  this.nodes.forEach(r3),
                  this.nodes.forEach(rZ),
                  rU && window.MotionDebug.record(rN);
              }),
              (this.resolvedRelativeTargetAt = 0),
              (this.hasProjected = !1),
              (this.isVisible = !0),
              (this.animationProgress = 0),
              (this.sharedNodes = new Map()),
              (this.latestValues = e),
              (this.root = i ? i.root || i : this),
              (this.path = i ? [...i.path, i] : []),
              (this.parent = i),
              (this.depth = i ? i.depth + 1 : 0);
            for (let e = 0; e < this.path.length; e++) this.path[e].shouldResetTransform = !0;
            this.root === this && (this.nodes = new rf());
          }
          addEventListener(e, t) {
            return this.eventHandlers.has(e) || this.eventHandlers.set(e, new R()), this.eventHandlers.get(e).add(t);
          }
          notifyListeners(e, ...t) {
            let i = this.eventHandlers.get(e);
            i && i.notify(...t);
          }
          hasListeners(e) {
            return this.eventHandlers.has(e);
          }
          mount(t, i = this.root.hasTreeAnimated) {
            if (this.instance) return;
            (this.isSVG = t instanceof SVGElement && "svg" !== t.tagName), (this.instance = t);
            let { layoutId: r, layout: n, visualElement: s } = this.options;
            if (
              (s && !s.current && s.mount(t),
              this.root.nodes.add(this),
              this.parent && this.parent.children.add(this),
              i && (n || r) && (this.isLayoutDirty = !0),
              e)
            ) {
              let i,
                r = () => (this.root.updateBlockedByResize = !1);
              e(t, () => {
                (this.root.updateBlockedByResize = !0),
                  i && i(),
                  (i = (function (e, t) {
                    let i = k.now(),
                      r = ({ timestamp: n }) => {
                        let s = n - i;
                        s >= 250 && (T(r), e(s - t));
                      };
                    return P.read(r, !0), () => T(r);
                  })(r, 250)),
                  rs.hasAnimatedSinceResize && ((rs.hasAnimatedSinceResize = !1), this.nodes.forEach(r2));
              });
            }
            r && this.root.registerSharedNode(r, this),
              !1 !== this.options.animate &&
                s &&
                (r || n) &&
                this.addEventListener(
                  "didUpdate",
                  ({ delta: e, hasLayoutChanged: t, hasRelativeLayoutChanged: i, layout: r }) => {
                    if (this.isTreeAnimationBlocked()) {
                      (this.target = void 0), (this.relativeTarget = void 0);
                      return;
                    }
                    let n = this.options.transition || s.getDefaultTransition() || ne,
                      { onLayoutAnimationStart: o, onLayoutAnimationComplete: a } = s.getProps(),
                      l = !this.targetLayout || !rO(this.targetLayout, r),
                      u = !t && i;
                    if (this.options.layoutRoot || this.resumeFrom || u || (t && (l || !this.currentAnimation))) {
                      this.resumeFrom &&
                        ((this.resumingFrom = this.resumeFrom), (this.resumingFrom.resumingFrom = void 0)),
                        this.setAnimationOrigin(e, u);
                      let t = { ...p(n, "layout"), onPlay: o, onComplete: a };
                      (s.shouldReduceMotion || this.options.layoutRoot) && ((t.delay = 0), (t.type = !1)),
                        this.startAnimation(t);
                    } else t || r2(this), this.isLead() && this.options.onExitComplete && this.options.onExitComplete();
                    this.targetLayout = r;
                  }
                );
          }
          unmount() {
            this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this);
            let e = this.getStack();
            e && e.remove(this),
              this.parent && this.parent.children.delete(this),
              (this.instance = void 0),
              T(this.updateProjection);
          }
          blockUpdate() {
            this.updateManuallyBlocked = !0;
          }
          unblockUpdate() {
            this.updateManuallyBlocked = !1;
          }
          isUpdateBlocked() {
            return this.updateManuallyBlocked || this.updateBlockedByResize;
          }
          isTreeAnimationBlocked() {
            return this.isAnimationBlocked || (this.parent && this.parent.isTreeAnimationBlocked()) || !1;
          }
          startUpdate() {
            !this.isUpdateBlocked() &&
              ((this.isUpdating = !0), this.nodes && this.nodes.forEach(r9), this.animationId++);
          }
          getTransformTemplate() {
            let { visualElement: e } = this.options;
            return e && e.getProps().transformTemplate;
          }
          willUpdate(e = !0) {
            if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
              this.options.onExitComplete && this.options.onExitComplete();
              return;
            }
            if (
              (window.MotionCancelOptimisedAnimation &&
                !this.hasCheckedOptimisedAppear &&
                (function e(t) {
                  if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
                  let { visualElement: i } = t.options;
                  if (!i) return;
                  let r = i.props[I];
                  if (window.MotionHasOptimisedAnimation(r, "transform")) {
                    let { layout: e, layoutId: i } = t.options;
                    window.MotionCancelOptimisedAnimation(r, "transform", P, !(e || i));
                  }
                  let { parent: n } = t;
                  n && !n.hasCheckedOptimisedAppear && e(n);
                })(this),
              this.root.isUpdating || this.root.startUpdate(),
              this.isLayoutDirty)
            )
              return;
            this.isLayoutDirty = !0;
            for (let e = 0; e < this.path.length; e++) {
              let t = this.path[e];
              (t.shouldResetTransform = !0), t.updateScroll("snapshot"), t.options.layoutRoot && t.willUpdate(!1);
            }
            let { layoutId: t, layout: i } = this.options;
            if (void 0 === t && !i) return;
            let r = this.getTransformTemplate();
            (this.prevTransformTemplateValue = r ? r(this.latestValues, "") : void 0),
              this.updateSnapshot(),
              e && this.notifyListeners("willUpdate");
          }
          update() {
            if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
              this.unblockUpdate(), this.clearAllSnapshots(), this.nodes.forEach(rJ);
              return;
            }
            this.isUpdating || this.nodes.forEach(r0),
              (this.isUpdating = !1),
              this.nodes.forEach(r1),
              this.nodes.forEach(rX),
              this.nodes.forEach(rY),
              this.clearAllSnapshots();
            let e = k.now();
            (A.delta = em(0, 1e3 / 60, e - A.timestamp)),
              (A.timestamp = e),
              (A.isProcessing = !0),
              C.update.process(A),
              C.preRender.process(A),
              C.render.process(A),
              (A.isProcessing = !1);
          }
          didUpdate() {
            this.updateScheduled || ((this.updateScheduled = !0), ru.read(this.scheduleUpdate));
          }
          clearAllSnapshots() {
            this.nodes.forEach(rQ), this.sharedNodes.forEach(r4);
          }
          scheduleUpdateProjection() {
            this.projectionUpdateScheduled ||
              ((this.projectionUpdateScheduled = !0), P.preRender(this.updateProjection, !1, !0));
          }
          scheduleCheckAfterUnmount() {
            P.postRender(() => {
              this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed();
            });
          }
          updateSnapshot() {
            !this.snapshot && this.instance && (this.snapshot = this.measure());
          }
          updateLayout() {
            if (
              !this.instance ||
              (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)
            )
              return;
            if (this.resumeFrom && !this.resumeFrom.instance)
              for (let e = 0; e < this.path.length; e++) this.path[e].updateScroll();
            let e = this.layout;
            (this.layout = this.measure(!1)),
              (this.layoutCorrected = iN()),
              (this.isLayoutDirty = !1),
              (this.projectionDelta = void 0),
              this.notifyListeners("measure", this.layout.layoutBox);
            let { visualElement: t } = this.options;
            t && t.notify("LayoutMeasure", this.layout.layoutBox, e ? e.layoutBox : void 0);
          }
          updateScroll(e = "measure") {
            let t = !!(this.options.layoutScroll && this.instance);
            if (
              (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === e && (t = !1),
              t)
            ) {
              let t = r(this.instance);
              this.scroll = {
                animationId: this.root.animationId,
                phase: e,
                isRoot: t,
                offset: i(this.instance),
                wasRoot: this.scroll ? this.scroll.isRoot : t,
              };
            }
          }
          resetTransform() {
            if (!n) return;
            let e = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout,
              t = this.projectionDelta && !rD(this.projectionDelta),
              i = this.getTransformTemplate(),
              r = i ? i(this.latestValues, "") : void 0,
              s = r !== this.prevTransformTemplateValue;
            e &&
              (t || iH(this.latestValues) || s) &&
              (n(this.instance, r), (this.shouldResetTransform = !1), this.scheduleRender());
          }
          measure(e = !0) {
            var t;
            let i = this.measurePageBox(),
              r = this.removeElementScroll(i);
            return (
              e && (r = this.removeTransform(r)),
              nr((t = r).x),
              nr(t.y),
              { animationId: this.root.animationId, measuredBox: i, layoutBox: r, latestValues: {}, source: this.id }
            );
          }
          measurePageBox() {
            var e;
            let { visualElement: t } = this.options;
            if (!t) return iN();
            let i = t.measureViewportBox();
            if (!((null == (e = this.scroll) ? void 0 : e.wasRoot) || this.path.some(ns))) {
              let { scroll: e } = this.root;
              e && (iZ(i.x, e.offset.x), iZ(i.y, e.offset.y));
            }
            return i;
          }
          removeElementScroll(e) {
            var t;
            let i = iN();
            if ((rC(i, e), null == (t = this.scroll) ? void 0 : t.wasRoot)) return i;
            for (let t = 0; t < this.path.length; t++) {
              let r = this.path[t],
                { scroll: n, options: s } = r;
              r !== this.root &&
                n &&
                s.layoutScroll &&
                (n.wasRoot && rC(i, e), iZ(i.x, n.offset.x), iZ(i.y, n.offset.y));
            }
            return i;
          }
          applyTransform(e, t = !1) {
            let i = iN();
            rC(i, e);
            for (let e = 0; e < this.path.length; e++) {
              let r = this.path[e];
              !t &&
                r.options.layoutScroll &&
                r.scroll &&
                r !== r.root &&
                iJ(i, { x: -r.scroll.offset.x, y: -r.scroll.offset.y }),
                iH(r.latestValues) && iJ(i, r.latestValues);
            }
            return iH(this.latestValues) && iJ(i, this.latestValues), i;
          }
          removeTransform(e) {
            let t = iN();
            rC(t, e);
            for (let e = 0; e < this.path.length; e++) {
              let i = this.path[e];
              if (!i.instance || !iH(i.latestValues)) continue;
              iG(i.latestValues) && i.updateSnapshot();
              let r = iN();
              rC(r, i.measurePageBox()), rV(t, i.latestValues, i.snapshot ? i.snapshot.layoutBox : void 0, r);
            }
            return iH(this.latestValues) && rV(t, this.latestValues), t;
          }
          setTargetDelta(e) {
            (this.targetDelta = e), this.root.scheduleUpdateProjection(), (this.isProjectionDirty = !0);
          }
          setOptions(e) {
            this.options = { ...this.options, ...e, crossfade: void 0 === e.crossfade || e.crossfade };
          }
          clearMeasurements() {
            (this.scroll = void 0),
              (this.layout = void 0),
              (this.snapshot = void 0),
              (this.prevTransformTemplateValue = void 0),
              (this.targetDelta = void 0),
              (this.target = void 0),
              (this.isLayoutDirty = !1);
          }
          forceRelativeParentToResolveTarget() {
            this.relativeParent &&
              this.relativeParent.resolvedRelativeTargetAt !== A.timestamp &&
              this.relativeParent.resolveTargetDelta(!0);
          }
          resolveTargetDelta(e = !1) {
            var t, i, r, n;
            let s = this.getLead();
            this.isProjectionDirty || (this.isProjectionDirty = s.isProjectionDirty),
              this.isTransformDirty || (this.isTransformDirty = s.isTransformDirty),
              this.isSharedProjectionDirty || (this.isSharedProjectionDirty = s.isSharedProjectionDirty);
            let o = !!this.resumingFrom || this !== s;
            if (
              !(
                e ||
                (o && this.isSharedProjectionDirty) ||
                this.isProjectionDirty ||
                (null == (t = this.parent) ? void 0 : t.isProjectionDirty) ||
                this.attemptToResolveRelativeTarget ||
                this.root.updateBlockedByResize
              )
            )
              return;
            let { layout: a, layoutId: l } = this.options;
            if (this.layout && (a || l)) {
              if (((this.resolvedRelativeTargetAt = A.timestamp), !this.targetDelta && !this.relativeTarget)) {
                let e = this.getClosestProjectingParent();
                e && e.layout && 1 !== this.animationProgress
                  ? ((this.relativeParent = e),
                    this.forceRelativeParentToResolveTarget(),
                    (this.relativeTarget = iN()),
                    (this.relativeTargetOrigin = iN()),
                    i_(this.relativeTargetOrigin, this.layout.layoutBox, e.layout.layoutBox),
                    rC(this.relativeTarget, this.relativeTargetOrigin))
                  : (this.relativeParent = this.relativeTarget = void 0);
              }
              if (this.relativeTarget || this.targetDelta) {
                if (
                  ((this.target || ((this.target = iN()), (this.targetWithTransforms = iN())),
                  this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target)
                    ? (this.forceRelativeParentToResolveTarget(),
                      (i = this.target),
                      (r = this.relativeTarget),
                      (n = this.relativeParent.target),
                      iR(i.x, r.x, n.x),
                      iR(i.y, r.y, n.y))
                    : this.targetDelta
                      ? (this.resumingFrom
                          ? (this.target = this.applyTransform(this.layout.layoutBox))
                          : rC(this.target, this.layout.layoutBox),
                        iK(this.target, this.targetDelta))
                      : rC(this.target, this.layout.layoutBox),
                  this.attemptToResolveRelativeTarget)
                ) {
                  this.attemptToResolveRelativeTarget = !1;
                  let e = this.getClosestProjectingParent();
                  e &&
                  !!e.resumingFrom == !!this.resumingFrom &&
                  !e.options.layoutScroll &&
                  e.target &&
                  1 !== this.animationProgress
                    ? ((this.relativeParent = e),
                      this.forceRelativeParentToResolveTarget(),
                      (this.relativeTarget = iN()),
                      (this.relativeTargetOrigin = iN()),
                      i_(this.relativeTargetOrigin, this.target, e.target),
                      rC(this.relativeTarget, this.relativeTargetOrigin))
                    : (this.relativeParent = this.relativeTarget = void 0);
                }
                rU && rN.resolvedTargetDeltas++;
              }
            }
          }
          getClosestProjectingParent() {
            if (!(!this.parent || iG(this.parent.latestValues) || iq(this.parent.latestValues)))
              if (this.parent.isProjecting()) return this.parent;
              else return this.parent.getClosestProjectingParent();
          }
          isProjecting() {
            return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
          }
          calcProjection() {
            var e;
            let t = this.getLead(),
              i = !!this.resumingFrom || this !== t,
              r = !0;
            if (
              ((this.isProjectionDirty || (null == (e = this.parent) ? void 0 : e.isProjectionDirty)) && (r = !1),
              i && (this.isSharedProjectionDirty || this.isTransformDirty) && (r = !1),
              this.resolvedRelativeTargetAt === A.timestamp && (r = !1),
              r)
            )
              return;
            let { layout: n, layoutId: s } = this.options;
            if (
              ((this.isTreeAnimating = !!(
                (this.parent && this.parent.isTreeAnimating) ||
                this.currentAnimation ||
                this.pendingAnimation
              )),
              this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0),
              !this.layout || !(n || s))
            )
              return;
            rC(this.layoutCorrected, this.layout.layoutBox);
            let o = this.treeScale.x,
              a = this.treeScale.y;
            !(function (e, t, i, r = !1) {
              let n,
                s,
                o = i.length;
              if (o) {
                t.x = t.y = 1;
                for (let a = 0; a < o; a++) {
                  s = (n = i[a]).projectionDelta;
                  let { visualElement: o } = n.options;
                  (!o || !o.props.style || "contents" !== o.props.style.display) &&
                    (r &&
                      n.options.layoutScroll &&
                      n.scroll &&
                      n !== n.root &&
                      iJ(e, { x: -n.scroll.offset.x, y: -n.scroll.offset.y }),
                    s && ((t.x *= s.x.scale), (t.y *= s.y.scale), iK(e, s)),
                    r && iH(n.latestValues) && iJ(e, n.latestValues));
                }
                t.x < 1.0000000000001 && t.x > 0.999999999999 && (t.x = 1),
                  t.y < 1.0000000000001 && t.y > 0.999999999999 && (t.y = 1);
              }
            })(this.layoutCorrected, this.treeScale, this.path, i),
              t.layout &&
                !t.target &&
                (1 !== this.treeScale.x || 1 !== this.treeScale.y) &&
                ((t.target = t.layout.layoutBox), (t.targetWithTransforms = iN()));
            let { target: l } = t;
            if (!l) {
              this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
              return;
            }
            this.projectionDelta && this.prevProjectionDelta
              ? (rE(this.prevProjectionDelta.x, this.projectionDelta.x),
                rE(this.prevProjectionDelta.y, this.projectionDelta.y))
              : this.createProjectionDeltas(),
              ij(this.projectionDelta, this.layoutCorrected, l, this.latestValues),
              (this.treeScale.x === o &&
                this.treeScale.y === a &&
                rI(this.projectionDelta.x, this.prevProjectionDelta.x) &&
                rI(this.projectionDelta.y, this.prevProjectionDelta.y)) ||
                ((this.hasProjected = !0), this.scheduleRender(), this.notifyListeners("projectionUpdate", l)),
              rU && rN.recalculatedProjection++;
          }
          hide() {
            this.isVisible = !1;
          }
          show() {
            this.isVisible = !0;
          }
          scheduleRender(e = !0) {
            var t;
            if ((null == (t = this.options.visualElement) || t.scheduleRender(), e)) {
              let e = this.getStack();
              e && e.scheduleRender();
            }
            this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0);
          }
          createProjectionDeltas() {
            (this.prevProjectionDelta = iI()),
              (this.projectionDelta = iI()),
              (this.projectionDeltaWithTransform = iI());
          }
          setAnimationOrigin(e, t = !1) {
            let i,
              r = this.snapshot,
              n = r ? r.latestValues : {},
              s = { ...this.latestValues },
              o = iI();
            (this.relativeParent && this.relativeParent.options.layoutRoot) ||
              (this.relativeTarget = this.relativeTargetOrigin = void 0),
              (this.attemptToResolveRelativeTarget = !t);
            let a = iN(),
              l = (r ? r.source : void 0) !== (this.layout ? this.layout.source : void 0),
              u = this.getStack(),
              h = !u || u.members.length <= 1,
              d = !!(l && !h && !0 === this.options.crossfade && !this.path.some(r7));
            (this.animationProgress = 0),
              (this.mixTargetDelta = (t) => {
                let r = t / 1e3;
                if (
                  (r6(o.x, e.x, r),
                  r6(o.y, e.y, r),
                  this.setTargetDelta(o),
                  this.relativeTarget &&
                    this.relativeTargetOrigin &&
                    this.layout &&
                    this.relativeParent &&
                    this.relativeParent.layout)
                ) {
                  var u, c, p, m, f, g;
                  i_(a, this.layout.layoutBox, this.relativeParent.layout.layoutBox),
                    (p = this.relativeTarget),
                    (m = this.relativeTargetOrigin),
                    (f = a),
                    (g = r),
                    r8(p.x, m.x, f.x, g),
                    r8(p.y, m.y, f.y, g),
                    i &&
                      ((u = this.relativeTarget), (c = i), rF(u.x, c.x) && rF(u.y, c.y)) &&
                      (this.isProjectionDirty = !1),
                    i || (i = iN()),
                    rC(i, this.relativeTarget);
                }
                l &&
                  ((this.animationValues = s),
                  (function (e, t, i, r, n, s) {
                    n
                      ? ((e.opacity = tb(0, void 0 !== i.opacity ? i.opacity : 1, rS(r))),
                        (e.opacityExit = tb(void 0 !== t.opacity ? t.opacity : 1, 0, rP(r))))
                      : s &&
                        (e.opacity = tb(void 0 !== t.opacity ? t.opacity : 1, void 0 !== i.opacity ? i.opacity : 1, r));
                    for (let n = 0; n < ry; n++) {
                      let s = `border${rv[n]}Radius`,
                        o = rw(t, s),
                        a = rw(i, s);
                      (void 0 !== o || void 0 !== a) &&
                        (o || (o = 0),
                        a || (a = 0),
                        0 === o || 0 === a || rx(o) === rx(a)
                          ? ((e[s] = Math.max(tb(rb(o), rb(a), r), 0)), (eM.test(a) || eM.test(o)) && (e[s] += "%"))
                          : (e[s] = a));
                    }
                    (t.rotate || i.rotate) && (e.rotate = tb(t.rotate || 0, i.rotate || 0, r));
                  })(s, n, this.latestValues, r, d, h)),
                  this.root.scheduleUpdateProjection(),
                  this.scheduleRender(),
                  (this.animationProgress = r);
              }),
              this.mixTargetDelta(1e3 * !!this.options.layoutRoot);
          }
          startAnimation(e) {
            this.notifyListeners("animationStart"),
              this.currentAnimation && this.currentAnimation.stop(),
              this.resumingFrom && this.resumingFrom.currentAnimation && this.resumingFrom.currentAnimation.stop(),
              this.pendingAnimation && (T(this.pendingAnimation), (this.pendingAnimation = void 0)),
              (this.pendingAnimation = P.update(() => {
                (rs.hasAnimatedSinceResize = !0),
                  (this.currentAnimation = (function (e, t, i) {
                    let r = L(0) ? 0 : F(e);
                    return r.start(ie("", r, 1e3, i)), r.animation;
                  })(0, 0, {
                    ...e,
                    onUpdate: (t) => {
                      this.mixTargetDelta(t), e.onUpdate && e.onUpdate(t);
                    },
                    onComplete: () => {
                      e.onComplete && e.onComplete(), this.completeAnimation();
                    },
                  })),
                  this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation),
                  (this.pendingAnimation = void 0);
              }));
          }
          completeAnimation() {
            this.resumingFrom &&
              ((this.resumingFrom.currentAnimation = void 0), (this.resumingFrom.preserveOpacity = void 0));
            let e = this.getStack();
            e && e.exitAnimationComplete(),
              (this.resumingFrom = this.currentAnimation = this.animationValues = void 0),
              this.notifyListeners("animationComplete");
          }
          finishAnimation() {
            this.currentAnimation && (this.mixTargetDelta && this.mixTargetDelta(1e3), this.currentAnimation.stop()),
              this.completeAnimation();
          }
          applyTransformsToTarget() {
            let e = this.getLead(),
              { targetWithTransforms: t, target: i, layout: r, latestValues: n } = e;
            if (t && i && r) {
              if (
                this !== e &&
                this.layout &&
                r &&
                nn(this.options.animationType, this.layout.layoutBox, r.layoutBox)
              ) {
                i = this.target || iN();
                let t = ik(this.layout.layoutBox.x);
                (i.x.min = e.target.x.min), (i.x.max = i.x.min + t);
                let r = ik(this.layout.layoutBox.y);
                (i.y.min = e.target.y.min), (i.y.max = i.y.min + r);
              }
              rC(t, i), iJ(t, n), ij(this.projectionDeltaWithTransform, this.layoutCorrected, t, n);
            }
          }
          registerSharedNode(e, t) {
            this.sharedNodes.has(e) || this.sharedNodes.set(e, new rB()), this.sharedNodes.get(e).add(t);
            let i = t.options.initialPromotionConfig;
            t.promote({
              transition: i ? i.transition : void 0,
              preserveFollowOpacity: i && i.shouldPreserveFollowOpacity ? i.shouldPreserveFollowOpacity(t) : void 0,
            });
          }
          isLead() {
            let e = this.getStack();
            return !e || e.lead === this;
          }
          getLead() {
            var e;
            let { layoutId: t } = this.options;
            return (t && (null == (e = this.getStack()) ? void 0 : e.lead)) || this;
          }
          getPrevLead() {
            var e;
            let { layoutId: t } = this.options;
            return t ? (null == (e = this.getStack()) ? void 0 : e.prevLead) : void 0;
          }
          getStack() {
            let { layoutId: e } = this.options;
            if (e) return this.root.sharedNodes.get(e);
          }
          promote({ needsReset: e, transition: t, preserveFollowOpacity: i } = {}) {
            let r = this.getStack();
            r && r.promote(this, i),
              e && ((this.projectionDelta = void 0), (this.needsReset = !0)),
              t && this.setOptions({ transition: t });
          }
          relegate() {
            let e = this.getStack();
            return !!e && e.relegate(this);
          }
          resetSkewAndRotation() {
            let { visualElement: e } = this.options;
            if (!e) return;
            let t = !1,
              { latestValues: i } = e;
            if (((i.z || i.rotate || i.rotateX || i.rotateY || i.rotateZ || i.skewX || i.skewY) && (t = !0), !t))
              return;
            let r = {};
            i.z && rH("z", e, r, this.animationValues);
            for (let t = 0; t < r$.length; t++)
              rH(`rotate${r$[t]}`, e, r, this.animationValues), rH(`skew${r$[t]}`, e, r, this.animationValues);
            for (let t in (e.render(), r))
              e.setStaticValue(t, r[t]), this.animationValues && (this.animationValues[t] = r[t]);
            e.scheduleRender();
          }
          getProjectionStyles(e) {
            var t, i;
            if (!this.instance || this.isSVG) return;
            if (!this.isVisible) return rW;
            let r = { visibility: "" },
              n = this.getTransformTemplate();
            if (this.needsReset)
              return (
                (this.needsReset = !1),
                (r.opacity = ""),
                (r.pointerEvents = rg(null == e ? void 0 : e.pointerEvents) || ""),
                (r.transform = n ? n(this.latestValues, "") : "none"),
                r
              );
            let s = this.getLead();
            if (!this.projectionDelta || !this.layout || !s.target) {
              let t = {};
              return (
                this.options.layoutId &&
                  ((t.opacity = void 0 !== this.latestValues.opacity ? this.latestValues.opacity : 1),
                  (t.pointerEvents = rg(null == e ? void 0 : e.pointerEvents) || "")),
                this.hasProjected &&
                  !iH(this.latestValues) &&
                  ((t.transform = n ? n({}, "") : "none"), (this.hasProjected = !1)),
                t
              );
            }
            let o = s.animationValues || s.latestValues;
            this.applyTransformsToTarget(),
              (r.transform = (function (e, t, i) {
                let r = "",
                  n = e.x.translate / t.x,
                  s = e.y.translate / t.y,
                  o = (null == i ? void 0 : i.z) || 0;
                if (
                  ((n || s || o) && (r = `translate3d(${n}px, ${s}px, ${o}px) `),
                  (1 !== t.x || 1 !== t.y) && (r += `scale(${1 / t.x}, ${1 / t.y}) `),
                  i)
                ) {
                  let { transformPerspective: e, rotate: t, rotateX: n, rotateY: s, skewX: o, skewY: a } = i;
                  e && (r = `perspective(${e}px) ${r}`),
                    t && (r += `rotate(${t}deg) `),
                    n && (r += `rotateX(${n}deg) `),
                    s && (r += `rotateY(${s}deg) `),
                    o && (r += `skewX(${o}deg) `),
                    a && (r += `skewY(${a}deg) `);
                }
                let a = e.x.scale * t.x,
                  l = e.y.scale * t.y;
                return (1 !== a || 1 !== l) && (r += `scale(${a}, ${l})`), r || "none";
              })(this.projectionDeltaWithTransform, this.treeScale, o)),
              n && (r.transform = n(o, r.transform));
            let { x: a, y: l } = this.projectionDelta;
            for (let e in ((r.transformOrigin = `${100 * a.origin}% ${100 * l.origin}% 0`),
            s.animationValues
              ? (r.opacity =
                  s === this
                    ? null != (i = null != (t = o.opacity) ? t : this.latestValues.opacity)
                      ? i
                      : 1
                    : this.preserveOpacity
                      ? this.latestValues.opacity
                      : o.opacityExit)
              : (r.opacity =
                  s === this ? (void 0 !== o.opacity ? o.opacity : "") : void 0 !== o.opacityExit ? o.opacityExit : 0),
            rl)) {
              if (void 0 === o[e]) continue;
              let { correct: t, applyTo: i, isCSSVariable: n } = rl[e],
                a = "none" === r.transform ? o[e] : t(o[e], s);
              if (i) {
                let e = i.length;
                for (let t = 0; t < e; t++) r[i[t]] = a;
              } else n ? (this.options.visualElement.renderState.vars[e] = a) : (r[e] = a);
            }
            return (
              this.options.layoutId &&
                (r.pointerEvents = s === this ? rg(null == e ? void 0 : e.pointerEvents) || "" : "none"),
              r
            );
          }
          clearSnapshot() {
            this.resumeFrom = this.snapshot = void 0;
          }
          resetTree() {
            this.root.nodes.forEach((e) => {
              var t;
              return null == (t = e.currentAnimation) ? void 0 : t.stop();
            }),
              this.root.nodes.forEach(rJ),
              this.root.sharedNodes.clear();
          }
        };
      }
      function rX(e) {
        e.updateLayout();
      }
      function rY(e) {
        var t;
        let i = (null == (t = e.resumeFrom) ? void 0 : t.snapshot) || e.snapshot;
        if (e.isLead() && e.layout && i && e.hasListeners("didUpdate")) {
          let { layoutBox: t, measuredBox: r } = e.layout,
            { animationType: n } = e.options,
            s = i.source !== e.layout.source;
          "size" === n
            ? iU((e) => {
                let r = s ? i.measuredBox[e] : i.layoutBox[e],
                  n = ik(r);
                (r.min = t[e].min), (r.max = r.min + n);
              })
            : nn(n, i.layoutBox, t) &&
              iU((r) => {
                let n = s ? i.measuredBox[r] : i.layoutBox[r],
                  o = ik(t[r]);
                (n.max = n.min + o),
                  e.relativeTarget &&
                    !e.currentAnimation &&
                    ((e.isProjectionDirty = !0), (e.relativeTarget[r].max = e.relativeTarget[r].min + o));
              });
          let o = iI();
          ij(o, t, i.layoutBox);
          let a = iI();
          s ? ij(a, e.applyTransform(r, !0), i.measuredBox) : ij(a, t, i.layoutBox);
          let l = !rD(o),
            u = !1;
          if (!e.resumeFrom) {
            let r = e.getClosestProjectingParent();
            if (r && !r.resumeFrom) {
              let { snapshot: n, layout: s } = r;
              if (n && s) {
                let o = iN();
                i_(o, i.layoutBox, n.layoutBox);
                let a = iN();
                i_(a, t, s.layoutBox),
                  rO(o, a) || (u = !0),
                  r.options.layoutRoot &&
                    ((e.relativeTarget = a), (e.relativeTargetOrigin = o), (e.relativeParent = r));
              }
            }
          }
          e.notifyListeners("didUpdate", {
            layout: t,
            snapshot: i,
            delta: a,
            layoutDelta: o,
            hasLayoutChanged: l,
            hasRelativeLayoutChanged: u,
          });
        } else if (e.isLead()) {
          let { onExitComplete: t } = e.options;
          t && t();
        }
        e.options.transition = void 0;
      }
      function rK(e) {
        rU && rN.totalNodes++,
          e.parent &&
            (e.isProjecting() || (e.isProjectionDirty = e.parent.isProjectionDirty),
            e.isSharedProjectionDirty ||
              (e.isSharedProjectionDirty = !!(
                e.isProjectionDirty ||
                e.parent.isProjectionDirty ||
                e.parent.isSharedProjectionDirty
              )),
            e.isTransformDirty || (e.isTransformDirty = e.parent.isTransformDirty));
      }
      function rZ(e) {
        e.isProjectionDirty = e.isSharedProjectionDirty = e.isTransformDirty = !1;
      }
      function rQ(e) {
        e.clearSnapshot();
      }
      function rJ(e) {
        e.clearMeasurements();
      }
      function r0(e) {
        e.isLayoutDirty = !1;
      }
      function r1(e) {
        let { visualElement: t } = e.options;
        t && t.getProps().onBeforeLayoutMeasure && t.notify("BeforeLayoutMeasure"), e.resetTransform();
      }
      function r2(e) {
        e.finishAnimation(), (e.targetDelta = e.relativeTarget = e.target = void 0), (e.isProjectionDirty = !0);
      }
      function r5(e) {
        e.resolveTargetDelta();
      }
      function r3(e) {
        e.calcProjection();
      }
      function r9(e) {
        e.resetSkewAndRotation();
      }
      function r4(e) {
        e.removeLeadSnapshot();
      }
      function r6(e, t, i) {
        (e.translate = tb(t.translate, 0, i)),
          (e.scale = tb(t.scale, 1, i)),
          (e.origin = t.origin),
          (e.originPoint = t.originPoint);
      }
      function r8(e, t, i, r) {
        (e.min = tb(t.min, i.min, r)), (e.max = tb(t.max, i.max, r));
      }
      function r7(e) {
        return e.animationValues && void 0 !== e.animationValues.opacityExit;
      }
      let ne = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
        nt = (e) =>
          "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().includes(e),
        ni = nt("applewebkit/") && !nt("chrome/") ? Math.round : x;
      function nr(e) {
        (e.min = ni(e.min)), (e.max = ni(e.max));
      }
      function nn(e, t, i) {
        return "position" === e || ("preserve-aspect" === e && !(0.2 >= Math.abs(rz(t) - rz(i))));
      }
      function ns(e) {
        var t;
        return e !== e.root && (null == (t = e.scroll) ? void 0 : t.wasRoot);
      }
      let no = rq({
          attachResizeListener: (e, t) => iv(e, "resize", t),
          measureScroll: () => ({
            x: document.documentElement.scrollLeft || document.body.scrollLeft,
            y: document.documentElement.scrollTop || document.body.scrollTop,
          }),
          checkIsScrollRoot: () => !0,
        }),
        na = { current: void 0 },
        nl = rq({
          measureScroll: (e) => ({ x: e.scrollLeft, y: e.scrollTop }),
          defaultParent: () => {
            if (!na.current) {
              let e = new no({});
              e.mount(window), e.setOptions({ layoutScroll: !0 }), (na.current = e);
            }
            return na.current;
          },
          resetTransform: (e, t) => {
            e.style.transform = void 0 !== t ? t : "none";
          },
          checkIsScrollRoot: (e) => "fixed" === window.getComputedStyle(e).position,
        });
      function nu(e, t) {
        let i = (function (e, t, i) {
            if (e instanceof Element) return [e];
            if ("string" == typeof e) {
              let t = document.querySelectorAll(e);
              return t ? Array.from(t) : [];
            }
            return Array.from(e);
          })(e),
          r = new AbortController();
        return [i, { passive: !0, ...t, signal: r.signal }, () => r.abort()];
      }
      function nh(e) {
        return !("touch" === e.pointerType || im.x || im.y);
      }
      function nd(e, t, i) {
        let { props: r } = e;
        e.animationState && r.whileHover && e.animationState.setActive("whileHover", "Start" === i);
        let n = r["onHover" + i];
        n && P.postRender(() => n(t, iy(t)));
      }
      class nc extends ih {
        mount() {
          let { current: e } = this.node;
          e &&
            (this.unmount = (function (e, t, i = {}) {
              let [r, n, s] = nu(e, i),
                o = (e) => {
                  if (!nh(e)) return;
                  let { target: i } = e,
                    r = t(i, e);
                  if ("function" != typeof r || !i) return;
                  let s = (e) => {
                    nh(e) && (r(e), i.removeEventListener("pointerleave", s));
                  };
                  i.addEventListener("pointerleave", s, n);
                };
              return (
                r.forEach((e) => {
                  e.addEventListener("pointerenter", o, n);
                }),
                s
              );
            })(e, (e, t) => (nd(this.node, t, "Start"), (e) => nd(this.node, e, "End"))));
        }
        unmount() {}
      }
      class np extends ih {
        constructor() {
          super(...arguments), (this.isActive = !1);
        }
        onFocus() {
          let e = !1;
          try {
            e = this.node.current.matches(":focus-visible");
          } catch (t) {
            e = !0;
          }
          e && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0), (this.isActive = !0));
        }
        onBlur() {
          this.isActive &&
            this.node.animationState &&
            (this.node.animationState.setActive("whileFocus", !1), (this.isActive = !1));
        }
        mount() {
          this.unmount = tk(
            iv(this.node.current, "focus", () => this.onFocus()),
            iv(this.node.current, "blur", () => this.onBlur())
          );
        }
        unmount() {}
      }
      let nm = (e, t) => !!t && (e === t || nm(e, t.parentElement)),
        nf = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]),
        ng = new WeakSet();
      function nv(e) {
        return (t) => {
          "Enter" === t.key && e(t);
        };
      }
      function ny(e, t) {
        e.dispatchEvent(new PointerEvent("pointer" + t, { isPrimary: !0, bubbles: !0 }));
      }
      let nb = (e, t) => {
        let i = e.currentTarget;
        if (!i) return;
        let r = nv(() => {
          if (ng.has(i)) return;
          ny(i, "down");
          let e = nv(() => {
            ny(i, "up");
          });
          i.addEventListener("keyup", e, t), i.addEventListener("blur", () => ny(i, "cancel"), t);
        });
        i.addEventListener("keydown", r, t), i.addEventListener("blur", () => i.removeEventListener("keydown", r), t);
      };
      function nx(e) {
        return ig(e) && !(im.x || im.y);
      }
      function nw(e, t, i) {
        let { props: r } = e;
        e.animationState && r.whileTap && e.animationState.setActive("whileTap", "Start" === i);
        let n = r["onTap" + ("End" === i ? "" : i)];
        n && P.postRender(() => n(t, iy(t)));
      }
      class nS extends ih {
        mount() {
          let { current: e } = this.node;
          e &&
            (this.unmount = (function (e, t, i = {}) {
              let [r, n, s] = nu(e, i),
                o = (e) => {
                  let r = e.currentTarget;
                  if (!nx(e) || ng.has(r)) return;
                  ng.add(r);
                  let s = t(r, e),
                    o = (e, t) => {
                      window.removeEventListener("pointerup", a),
                        window.removeEventListener("pointercancel", l),
                        nx(e) && ng.has(r) && (ng.delete(r), "function" == typeof s && s(e, { success: t }));
                    },
                    a = (e) => {
                      o(e, i.useGlobalTarget || nm(r, e.target));
                    },
                    l = (e) => {
                      o(e, !1);
                    };
                  window.addEventListener("pointerup", a, n), window.addEventListener("pointercancel", l, n);
                };
              return (
                r.forEach((e) => {
                  nf.has(e.tagName) || -1 !== e.tabIndex || null !== e.getAttribute("tabindex") || (e.tabIndex = 0),
                    (i.useGlobalTarget ? window : e).addEventListener("pointerdown", o, n),
                    e.addEventListener("focus", (e) => nb(e, n), n);
                }),
                s
              );
            })(
              e,
              (e, t) => (nw(this.node, t, "Start"), (e, { success: t }) => nw(this.node, e, t ? "End" : "Cancel")),
              { useGlobalTarget: this.node.props.globalTapTarget }
            ));
        }
        unmount() {}
      }
      let nP = new WeakMap(),
        nT = new WeakMap(),
        nA = (e) => {
          let t = nP.get(e.target);
          t && t(e);
        },
        nC = (e) => {
          e.forEach(nA);
        },
        nE = { some: 0, all: 1 };
      class nk extends ih {
        constructor() {
          super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1);
        }
        startObserver() {
          this.unmount();
          let { viewport: e = {} } = this.node.getProps(),
            { root: t, margin: i, amount: r = "some", once: n } = e,
            s = { root: t ? t.current : void 0, rootMargin: i, threshold: "number" == typeof r ? r : nE[r] };
          return (function (e, t, i) {
            let r = (function ({ root: e, ...t }) {
              let i = e || document;
              nT.has(i) || nT.set(i, {});
              let r = nT.get(i),
                n = JSON.stringify(t);
              return r[n] || (r[n] = new IntersectionObserver(nC, { root: e, ...t })), r[n];
            })(t);
            return (
              nP.set(e, i),
              r.observe(e),
              () => {
                nP.delete(e), r.unobserve(e);
              }
            );
          })(this.node.current, s, (e) => {
            let { isIntersecting: t } = e;
            if (this.isInView === t || ((this.isInView = t), n && !t && this.hasEnteredView)) return;
            t && (this.hasEnteredView = !0),
              this.node.animationState && this.node.animationState.setActive("whileInView", t);
            let { onViewportEnter: i, onViewportLeave: r } = this.node.getProps(),
              s = t ? i : r;
            s && s(e);
          });
        }
        mount() {
          this.startObserver();
        }
        update() {
          if ("undefined" == typeof IntersectionObserver) return;
          let { props: e, prevProps: t } = this.node;
          ["amount", "margin", "root"].some(
            (function ({ viewport: e = {} }, { viewport: t = {} } = {}) {
              return (i) => e[i] !== t[i];
            })(e, t)
          ) && this.startObserver();
        }
        unmount() {}
      }
      let nM = (0, rt.createContext)({ strict: !1 });
      var nj = i(7471);
      let nR = (0, rt.createContext)({});
      function nV(e) {
        return n(e.animate) || c.some((t) => a(e[t]));
      }
      function n_(e) {
        return !!(nV(e) || e.variants);
      }
      function nD(e) {
        return Array.isArray(e) ? e.join(" ") : e;
      }
      var nF = i(2801);
      let nL = {
          animation: [
            "animate",
            "variants",
            "whileHover",
            "whileTap",
            "exit",
            "whileInView",
            "whileFocus",
            "whileDrag",
          ],
          exit: ["exit"],
          drag: ["drag", "dragControls"],
          focus: ["whileFocus"],
          hover: ["whileHover", "onHoverStart", "onHoverEnd"],
          tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
          pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
          inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
          layout: ["layout", "layoutId"],
        },
        nO = {};
      for (let e in nL) nO[e] = { isEnabled: (t) => nL[e].some((e) => !!t[e]) };
      let nz = Symbol.for("motionComponentSymbol");
      var nI = i(430),
        nB = i(9025);
      let nN = [
        "animate",
        "circle",
        "defs",
        "desc",
        "ellipse",
        "g",
        "image",
        "line",
        "filter",
        "marker",
        "mask",
        "metadata",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "rect",
        "stop",
        "switch",
        "symbol",
        "svg",
        "text",
        "tspan",
        "use",
        "view",
      ];
      function nU(e) {
        if ("string" != typeof e || e.includes("-"));
        else if (nN.indexOf(e) > -1 || /[A-Z]/u.test(e)) return !0;
        return !1;
      }
      var n$ = i(6168);
      let nW = (e) => (t, i) => {
          let r = (0, rt.useContext)(nR),
            s = (0, rt.useContext)(nI.t),
            o = () =>
              (function ({ scrapeMotionValuesFromProps: e, createRenderState: t, onUpdate: i }, r, s, o) {
                let a = {
                  latestValues: (function (e, t, i, r) {
                    let s = {},
                      o = r(e, {});
                    for (let e in o) s[e] = rg(o[e]);
                    let { initial: a, animate: l } = e,
                      h = nV(e),
                      d = n_(e);
                    t &&
                      d &&
                      !h &&
                      !1 !== e.inherit &&
                      (void 0 === a && (a = t.initial), void 0 === l && (l = t.animate));
                    let c = !!i && !1 === i.initial,
                      p = (c = c || !1 === a) ? l : a;
                    if (p && "boolean" != typeof p && !n(p)) {
                      let t = Array.isArray(p) ? p : [p];
                      for (let i = 0; i < t.length; i++) {
                        let r = u(e, t[i]);
                        if (r) {
                          let { transitionEnd: e, transition: t, ...i } = r;
                          for (let e in i) {
                            let t = i[e];
                            if (Array.isArray(t)) {
                              let e = c ? t.length - 1 : 0;
                              t = t[e];
                            }
                            null !== t && (s[e] = t);
                          }
                          for (let t in e) s[t] = e[t];
                        }
                      }
                    }
                    return s;
                  })(r, s, o, e),
                  renderState: t(),
                };
                return i && ((a.onMount = (e) => i({ props: r, current: e, ...a })), (a.onUpdate = (e) => i(e))), a;
              })(e, t, r, s);
          return i ? o() : (0, n$.M)(o);
        },
        nG = (e, t) => (t && "number" == typeof e ? t.transform(e) : e),
        nH = { x: "translateX", y: "translateY", z: "translateZ", transformPerspective: "perspective" },
        nq = m.length;
      function nX(e, t, i) {
        let { style: r, vars: n, transformOrigin: s } = e,
          o = !1,
          a = !1;
        for (let e in t) {
          let i = t[e];
          if (f.has(e)) {
            o = !0;
            continue;
          }
          if (ts(e)) {
            n[e] = i;
            continue;
          }
          {
            let t = nG(i, eK[e]);
            e.startsWith("origin") ? ((a = !0), (s[e] = t)) : (r[e] = t);
          }
        }
        if (
          (!t.transform &&
            (o || i
              ? (r.transform = (function (e, t, i) {
                  let r = "",
                    n = !0;
                  for (let s = 0; s < nq; s++) {
                    let o = m[s],
                      a = e[o];
                    if (void 0 === a) continue;
                    let l = !0;
                    if (!(l = "number" == typeof a ? a === +!!o.startsWith("scale") : 0 === parseFloat(a)) || i) {
                      let e = nG(a, eK[o]);
                      if (!l) {
                        n = !1;
                        let t = nH[o] || o;
                        r += `${t}(${e}) `;
                      }
                      i && (t[o] = e);
                    }
                  }
                  return (r = r.trim()), i ? (r = i(t, n ? "" : r)) : n && (r = "none"), r;
                })(t, e.transform, i))
              : r.transform && (r.transform = "none")),
          a)
        ) {
          let { originX: e = "50%", originY: t = "50%", originZ: i = 0 } = s;
          r.transformOrigin = `${e} ${t} ${i}`;
        }
      }
      let nY = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
        nK = { offset: "strokeDashoffset", array: "strokeDasharray" };
      function nZ(e, t, i) {
        return "string" == typeof e ? e : ej.transform(t + i * e);
      }
      function nQ(
        e,
        {
          attrX: t,
          attrY: i,
          attrScale: r,
          originX: n,
          originY: s,
          pathLength: o,
          pathSpacing: a = 1,
          pathOffset: l = 0,
          ...u
        },
        h,
        d
      ) {
        if ((nX(e, u, d), h)) {
          e.style.viewBox && (e.attrs.viewBox = e.style.viewBox);
          return;
        }
        (e.attrs = e.style), (e.style = {});
        let { attrs: c, style: p, dimensions: m } = e;
        c.transform && (m && (p.transform = c.transform), delete c.transform),
          m &&
            (void 0 !== n || void 0 !== s || p.transform) &&
            (p.transformOrigin = (function (e, t, i) {
              let r = nZ(t, e.x, e.width),
                n = nZ(i, e.y, e.height);
              return `${r} ${n}`;
            })(m, void 0 !== n ? n : 0.5, void 0 !== s ? s : 0.5)),
          void 0 !== t && (c.x = t),
          void 0 !== i && (c.y = i),
          void 0 !== r && (c.scale = r),
          void 0 !== o &&
            (function (e, t, i = 1, r = 0, n = !0) {
              e.pathLength = 1;
              let s = n ? nY : nK;
              e[s.offset] = ej.transform(-r);
              let o = ej.transform(t),
                a = ej.transform(i);
              e[s.array] = `${o} ${a}`;
            })(c, o, a, l, !1);
      }
      let nJ = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} }),
        n0 = () => ({ ...nJ(), attrs: {} }),
        n1 = (e) => "string" == typeof e && "svg" === e.toLowerCase();
      function n2(e, { style: t, vars: i }, r, n) {
        for (let s in (Object.assign(e.style, t, n && n.getProjectionStyles(r)), i)) e.style.setProperty(s, i[s]);
      }
      let n5 = new Set([
        "baseFrequency",
        "diffuseConstant",
        "kernelMatrix",
        "kernelUnitLength",
        "keySplines",
        "keyTimes",
        "limitingConeAngle",
        "markerHeight",
        "markerWidth",
        "numOctaves",
        "targetX",
        "targetY",
        "surfaceScale",
        "specularConstant",
        "specularExponent",
        "stdDeviation",
        "tableValues",
        "viewBox",
        "gradientTransform",
        "pathLength",
        "startOffset",
        "textLength",
        "lengthAdjust",
      ]);
      function n3(e, t, i, r) {
        for (let i in (n2(e, t, void 0, r), t.attrs)) e.setAttribute(n5.has(i) ? i : z(i), t.attrs[i]);
      }
      function n9(e, { layout: t, layoutId: i }) {
        return f.has(e) || e.startsWith("origin") || ((t || void 0 !== i) && (!!rl[e] || "opacity" === e));
      }
      function n4(e, t, i) {
        var r;
        let { style: n } = e,
          s = {};
        for (let o in n)
          (L(n[o]) ||
            (t.style && L(t.style[o])) ||
            n9(o, e) ||
            (null == (r = null == i ? void 0 : i.getValue(o)) ? void 0 : r.liveStyle) !== void 0) &&
            (s[o] = n[o]);
        return s;
      }
      function n6(e, t, i) {
        let r = n4(e, t, i);
        for (let i in e)
          (L(e[i]) || L(t[i])) &&
            (r[-1 !== m.indexOf(i) ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i] = e[i]);
        return r;
      }
      let n8 = ["x", "y", "width", "height", "cx", "cy", "r"],
        n7 = {
          useVisualState: nW({
            scrapeMotionValuesFromProps: n6,
            createRenderState: n0,
            onUpdate: ({ props: e, prevProps: t, current: i, renderState: r, latestValues: n }) => {
              if (!i) return;
              let s = !!e.drag;
              if (!s) {
                for (let e in n)
                  if (f.has(e)) {
                    s = !0;
                    break;
                  }
              }
              if (!s) return;
              let o = !t;
              if (t)
                for (let i = 0; i < n8.length; i++) {
                  let r = n8[i];
                  e[r] !== t[r] && (o = !0);
                }
              o &&
                P.read(() => {
                  !(function (e, t) {
                    try {
                      t.dimensions = "function" == typeof e.getBBox ? e.getBBox() : e.getBoundingClientRect();
                    } catch (e) {
                      t.dimensions = { x: 0, y: 0, width: 0, height: 0 };
                    }
                  })(i, r),
                    P.render(() => {
                      nQ(r, n, n1(i.tagName), e.transformTemplate), n3(i, r);
                    });
                });
            },
          }),
        },
        se = { useVisualState: nW({ scrapeMotionValuesFromProps: n4, createRenderState: nJ }) };
      function st(e, t, i) {
        for (let r in t) L(t[r]) || n9(r, i) || (e[r] = t[r]);
      }
      let si = new Set([
        "animate",
        "exit",
        "variants",
        "initial",
        "style",
        "values",
        "variants",
        "transition",
        "transformTemplate",
        "custom",
        "inherit",
        "onBeforeLayoutMeasure",
        "onAnimationStart",
        "onAnimationComplete",
        "onUpdate",
        "onDragStart",
        "onDrag",
        "onDragEnd",
        "onMeasureDragConstraints",
        "onDirectionLock",
        "onDragTransitionEnd",
        "_dragX",
        "_dragY",
        "onHoverStart",
        "onHoverEnd",
        "onViewportEnter",
        "onViewportLeave",
        "globalTapTarget",
        "ignoreStrict",
        "viewport",
      ]);
      function sr(e) {
        return (
          e.startsWith("while") ||
          (e.startsWith("drag") && "draggable" !== e) ||
          e.startsWith("layout") ||
          e.startsWith("onTap") ||
          e.startsWith("onPan") ||
          e.startsWith("onLayout") ||
          si.has(e)
        );
      }
      let sn = (e) => !sr(e);
      try {
        !(function (e) {
          e && (sn = (t) => (t.startsWith("on") ? !sr(t) : e(t)));
        })(require("@emotion/is-prop-valid").default);
      } catch (e) {}
      let ss = { current: null },
        so = { current: !1 },
        sa = [...td, eF, eW],
        sl = (e) => sa.find(th(e)),
        su = new WeakMap(),
        sh = [
          "AnimationStart",
          "AnimationComplete",
          "Update",
          "BeforeLayoutMeasure",
          "LayoutMeasure",
          "LayoutAnimationStart",
          "LayoutAnimationComplete",
        ];
      class sd {
        scrapeMotionValuesFromProps(e, t, i) {
          return {};
        }
        constructor(
          { parent: e, props: t, presenceContext: i, reducedMotionConfig: r, blockInitialAnimation: n, visualState: s },
          o = {}
        ) {
          (this.current = null),
            (this.children = new Set()),
            (this.isVariantNode = !1),
            (this.isControllingVariants = !1),
            (this.shouldReduceMotion = null),
            (this.values = new Map()),
            (this.KeyframeResolver = ti),
            (this.features = {}),
            (this.valueSubscriptions = new Map()),
            (this.prevMotionValues = {}),
            (this.events = {}),
            (this.propEventSubscriptions = {}),
            (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
            (this.render = () => {
              this.current &&
                (this.triggerBuild(),
                this.renderInstance(this.current, this.renderState, this.props.style, this.projection));
            }),
            (this.renderScheduledAt = 0),
            (this.scheduleRender = () => {
              let e = k.now();
              this.renderScheduledAt < e && ((this.renderScheduledAt = e), P.render(this.render, !1, !0));
            });
          let { latestValues: a, renderState: l, onUpdate: u } = s;
          (this.onUpdate = u),
            (this.latestValues = a),
            (this.baseTarget = { ...a }),
            (this.initialValues = t.initial ? { ...a } : {}),
            (this.renderState = l),
            (this.parent = e),
            (this.props = t),
            (this.presenceContext = i),
            (this.depth = e ? e.depth + 1 : 0),
            (this.reducedMotionConfig = r),
            (this.options = o),
            (this.blockInitialAnimation = !!n),
            (this.isControllingVariants = nV(t)),
            (this.isVariantNode = n_(t)),
            this.isVariantNode && (this.variantChildren = new Set()),
            (this.manuallyAnimateOnMount = !!(e && e.current));
          let { willChange: h, ...d } = this.scrapeMotionValuesFromProps(t, {}, this);
          for (let e in d) {
            let t = d[e];
            void 0 !== a[e] && L(t) && t.set(a[e], !1);
          }
        }
        mount(e) {
          (this.current = e),
            su.set(e, this),
            this.projection && !this.projection.instance && this.projection.mount(e),
            this.parent &&
              this.isVariantNode &&
              !this.isControllingVariants &&
              (this.removeFromVariantTree = this.parent.addVariantChild(this)),
            this.values.forEach((e, t) => this.bindToMotionValue(t, e)),
            so.current ||
              (function () {
                if (((so.current = !0), nF.B))
                  if (window.matchMedia) {
                    let e = window.matchMedia("(prefers-reduced-motion)"),
                      t = () => (ss.current = e.matches);
                    e.addListener(t), t();
                  } else ss.current = !1;
              })(),
            (this.shouldReduceMotion =
              "never" !== this.reducedMotionConfig && ("always" === this.reducedMotionConfig || ss.current)),
            this.parent && this.parent.children.add(this),
            this.update(this.props, this.presenceContext);
        }
        unmount() {
          for (let e in (su.delete(this.current),
          this.projection && this.projection.unmount(),
          T(this.notifyUpdate),
          T(this.render),
          this.valueSubscriptions.forEach((e) => e()),
          this.valueSubscriptions.clear(),
          this.removeFromVariantTree && this.removeFromVariantTree(),
          this.parent && this.parent.children.delete(this),
          this.events))
            this.events[e].clear();
          for (let e in this.features) {
            let t = this.features[e];
            t && (t.unmount(), (t.isMounted = !1));
          }
          this.current = null;
        }
        bindToMotionValue(e, t) {
          let i;
          this.valueSubscriptions.has(e) && this.valueSubscriptions.get(e)();
          let r = f.has(e),
            n = t.on("change", (t) => {
              (this.latestValues[e] = t),
                this.props.onUpdate && P.preRender(this.notifyUpdate),
                r && this.projection && (this.projection.isTransformDirty = !0);
            }),
            s = t.on("renderRequest", this.scheduleRender);
          window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, e, t)),
            this.valueSubscriptions.set(e, () => {
              n(), s(), i && i(), t.owner && t.stop();
            });
        }
        sortNodePosition(e) {
          return this.current && this.sortInstanceNodePosition && this.type === e.type
            ? this.sortInstanceNodePosition(this.current, e.current)
            : 0;
        }
        updateFeatures() {
          let e = "animation";
          for (e in nO) {
            let t = nO[e];
            if (!t) continue;
            let { isEnabled: i, Feature: r } = t;
            if ((!this.features[e] && r && i(this.props) && (this.features[e] = new r(this)), this.features[e])) {
              let t = this.features[e];
              t.isMounted ? t.update() : (t.mount(), (t.isMounted = !0));
            }
          }
        }
        triggerBuild() {
          this.build(this.renderState, this.latestValues, this.props);
        }
        measureViewportBox() {
          return this.current ? this.measureInstanceViewportBox(this.current, this.props) : iN();
        }
        getStaticValue(e) {
          return this.latestValues[e];
        }
        setStaticValue(e, t) {
          this.latestValues[e] = t;
        }
        update(e, t) {
          (e.transformTemplate || this.props.transformTemplate) && this.scheduleRender(),
            (this.prevProps = this.props),
            (this.props = e),
            (this.prevPresenceContext = this.presenceContext),
            (this.presenceContext = t);
          for (let t = 0; t < sh.length; t++) {
            let i = sh[t];
            this.propEventSubscriptions[i] && (this.propEventSubscriptions[i](), delete this.propEventSubscriptions[i]);
            let r = e["on" + i];
            r && (this.propEventSubscriptions[i] = this.on(i, r));
          }
          (this.prevMotionValues = (function (e, t, i) {
            for (let r in t) {
              let n = t[r],
                s = i[r];
              if (L(n)) e.addValue(r, n);
              else if (L(s)) e.addValue(r, F(n, { owner: e }));
              else if (s !== n)
                if (e.hasValue(r)) {
                  let t = e.getValue(r);
                  !0 === t.liveStyle ? t.jump(n) : t.hasAnimated || t.set(n);
                } else {
                  let t = e.getStaticValue(r);
                  e.addValue(r, F(void 0 !== t ? t : n, { owner: e }));
                }
            }
            for (let r in i) void 0 === t[r] && e.removeValue(r);
            return t;
          })(this, this.scrapeMotionValuesFromProps(e, this.prevProps, this), this.prevMotionValues)),
            this.handleChildMotionValue && this.handleChildMotionValue(),
            this.onUpdate && this.onUpdate(this);
        }
        getProps() {
          return this.props;
        }
        getVariant(e) {
          return this.props.variants ? this.props.variants[e] : void 0;
        }
        getDefaultTransition() {
          return this.props.transition;
        }
        getTransformPagePoint() {
          return this.props.transformPagePoint;
        }
        getClosestVariantNode() {
          return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
        }
        addVariantChild(e) {
          let t = this.getClosestVariantNode();
          if (t) return t.variantChildren && t.variantChildren.add(e), () => t.variantChildren.delete(e);
        }
        addValue(e, t) {
          let i = this.values.get(e);
          t !== i &&
            (i && this.removeValue(e),
            this.bindToMotionValue(e, t),
            this.values.set(e, t),
            (this.latestValues[e] = t.get()));
        }
        removeValue(e) {
          this.values.delete(e);
          let t = this.valueSubscriptions.get(e);
          t && (t(), this.valueSubscriptions.delete(e)),
            delete this.latestValues[e],
            this.removeValueFromRenderState(e, this.renderState);
        }
        hasValue(e) {
          return this.values.has(e);
        }
        getValue(e, t) {
          if (this.props.values && this.props.values[e]) return this.props.values[e];
          let i = this.values.get(e);
          return (
            void 0 === i && void 0 !== t && ((i = F(null === t ? void 0 : t, { owner: this })), this.addValue(e, i)), i
          );
        }
        readValue(e, t) {
          var i;
          let r =
            void 0 === this.latestValues[e] && this.current
              ? null != (i = this.getBaseTargetFromProps(this.props, e))
                ? i
                : this.readValueFromInstance(this.current, e, this.options)
              : this.latestValues[e];
          return (
            null != r &&
              ("string" == typeof r && (tr(r) || ep(r)) ? (r = parseFloat(r)) : !sl(r) && eW.test(t) && (r = eJ(e, t)),
              this.setBaseTarget(e, L(r) ? r.get() : r)),
            L(r) ? r.get() : r
          );
        }
        setBaseTarget(e, t) {
          this.baseTarget[e] = t;
        }
        getBaseTarget(e) {
          var t;
          let i,
            { initial: r } = this.props;
          if ("string" == typeof r || "object" == typeof r) {
            let n = u(this.props, r, null == (t = this.presenceContext) ? void 0 : t.custom);
            n && (i = n[e]);
          }
          if (r && void 0 !== i) return i;
          let n = this.getBaseTargetFromProps(this.props, e);
          return void 0 === n || L(n)
            ? void 0 !== this.initialValues[e] && void 0 === i
              ? void 0
              : this.baseTarget[e]
            : n;
        }
        on(e, t) {
          return this.events[e] || (this.events[e] = new R()), this.events[e].add(t);
        }
        notify(e, ...t) {
          this.events[e] && this.events[e].notify(...t);
        }
      }
      class sc extends sd {
        constructor() {
          super(...arguments), (this.KeyframeResolver = tp);
        }
        sortInstanceNodePosition(e, t) {
          return 2 & e.compareDocumentPosition(t) ? 1 : -1;
        }
        getBaseTargetFromProps(e, t) {
          return e.style ? e.style[t] : void 0;
        }
        removeValueFromRenderState(e, { vars: t, style: i }) {
          delete t[e], delete i[e];
        }
        handleChildMotionValue() {
          this.childSubscription && (this.childSubscription(), delete this.childSubscription);
          let { children: e } = this.props;
          L(e) &&
            (this.childSubscription = e.on("change", (e) => {
              this.current && (this.current.textContent = `${e}`);
            }));
        }
      }
      class sp extends sc {
        constructor() {
          super(...arguments), (this.type = "html"), (this.renderInstance = n2);
        }
        readValueFromInstance(e, t) {
          if (f.has(t)) {
            let e = eQ(t);
            return (e && e.default) || 0;
          }
          {
            let i = window.getComputedStyle(e),
              r = (ts(t) ? i.getPropertyValue(t) : i[t]) || 0;
            return "string" == typeof r ? r.trim() : r;
          }
        }
        measureInstanceViewportBox(e, { transformPagePoint: t }) {
          return i0(e, t);
        }
        build(e, t, i) {
          nX(e, t, i.transformTemplate);
        }
        scrapeMotionValuesFromProps(e, t, i) {
          return n4(e, t, i);
        }
      }
      class sm extends sc {
        constructor() {
          super(...arguments), (this.type = "svg"), (this.isSVGTag = !1), (this.measureInstanceViewportBox = iN);
        }
        getBaseTargetFromProps(e, t) {
          return e[t];
        }
        readValueFromInstance(e, t) {
          if (f.has(t)) {
            let e = eQ(t);
            return (e && e.default) || 0;
          }
          return (t = n5.has(t) ? t : z(t)), e.getAttribute(t);
        }
        scrapeMotionValuesFromProps(e, t, i) {
          return n6(e, t, i);
        }
        build(e, t, i) {
          nQ(e, t, this.isSVGTag, i.transformTemplate);
        }
        renderInstance(e, t, i, r) {
          n3(e, t, i, r);
        }
        mount(e) {
          (this.isSVGTag = n1(e.tagName)), super.mount(e);
        }
      }
      let sf = (function (e) {
        if ("undefined" == typeof Proxy) return e;
        let t = new Map();
        return new Proxy((...t) => e(...t), {
          get: (i, r) => ("create" === r ? e : (t.has(r) || t.set(r, e(r)), t.get(r))),
        });
      })(
        ((i8 = {
          animation: { Feature: id },
          exit: { Feature: ip },
          inView: { Feature: nk },
          tap: { Feature: nS },
          focus: { Feature: np },
          hover: { Feature: nc },
          pan: { Feature: i6 },
          drag: { Feature: i9, ProjectionNode: nl, MeasureLayout: rc },
          layout: { ProjectionNode: nl, MeasureLayout: rc },
        }),
        (i7 = (e, t) => (nU(e) ? new sm(t) : new sp(t, { allowProjection: e !== rt.Fragment }))),
        function (e, { forwardMotionProps: t } = { forwardMotionProps: !1 }) {
          return (function (e) {
            var t, i;
            let { preloadedFeatures: r, createVisualElement: n, useRender: s, useVisualState: o, Component: l } = e;
            function u(e, t) {
              var i, r, u;
              let h,
                d = {
                  ...(0, rt.useContext)(nj.Q),
                  ...e,
                  layoutId: (function (e) {
                    let { layoutId: t } = e,
                      i = (0, rt.useContext)(rr.L).id;
                    return i && void 0 !== t ? i + "-" + t : t;
                  })(e),
                },
                { isStatic: c } = d,
                p = (function (e) {
                  let { initial: t, animate: i } = (function (e, t) {
                    if (nV(e)) {
                      let { initial: t, animate: i } = e;
                      return { initial: !1 === t || a(t) ? t : void 0, animate: a(i) ? i : void 0 };
                    }
                    return !1 !== e.inherit ? t : {};
                  })(e, (0, rt.useContext)(nR));
                  return (0, rt.useMemo)(() => ({ initial: t, animate: i }), [nD(t), nD(i)]);
                })(e),
                m = o(e, c);
              if (!c && nF.B) {
                (r = 0), (u = 0), (0, rt.useContext)(nM).strict;
                let e = (function (e) {
                  let { drag: t, layout: i } = nO;
                  if (!t && !i) return {};
                  let r = { ...t, ...i };
                  return {
                    MeasureLayout:
                      (null == t ? void 0 : t.isEnabled(e)) || (null == i ? void 0 : i.isEnabled(e))
                        ? r.MeasureLayout
                        : void 0,
                    ProjectionNode: r.ProjectionNode,
                  };
                })(d);
                (h = e.MeasureLayout),
                  (p.visualElement = (function (e, t, i, r, n) {
                    var s, o;
                    let { visualElement: a } = (0, rt.useContext)(nR),
                      l = (0, rt.useContext)(nM),
                      u = (0, rt.useContext)(nI.t),
                      h = (0, rt.useContext)(nj.Q).reducedMotion,
                      d = (0, rt.useRef)(null);
                    (r = r || l.renderer),
                      !d.current &&
                        r &&
                        (d.current = r(e, {
                          visualState: t,
                          parent: a,
                          props: i,
                          presenceContext: u,
                          blockInitialAnimation: !!u && !1 === u.initial,
                          reducedMotionConfig: h,
                        }));
                    let c = d.current,
                      p = (0, rt.useContext)(rn);
                    c &&
                      !c.projection &&
                      n &&
                      ("html" === c.type || "svg" === c.type) &&
                      (function (e, t, i, r) {
                        let { layoutId: n, layout: s, drag: o, dragConstraints: a, layoutScroll: l, layoutRoot: u } = t;
                        (e.projection = new i(
                          e.latestValues,
                          t["data-framer-portal-id"]
                            ? void 0
                            : (function e(t) {
                                if (t) return !1 !== t.options.allowProjection ? t.projection : e(t.parent);
                              })(e.parent)
                        )),
                          e.projection.setOptions({
                            layoutId: n,
                            layout: s,
                            alwaysMeasureLayout: !!o || (a && iE(a)),
                            visualElement: e,
                            animationType: "string" == typeof s ? s : "both",
                            initialPromotionConfig: r,
                            layoutScroll: l,
                            layoutRoot: u,
                          });
                      })(d.current, i, n, p);
                    let m = (0, rt.useRef)(!1);
                    (0, rt.useInsertionEffect)(() => {
                      c && m.current && c.update(i, u);
                    });
                    let f = i[I],
                      g = (0, rt.useRef)(
                        !!f &&
                          !(null == (s = window.MotionHandoffIsComplete) ? void 0 : s.call(window, f)) &&
                          (null == (o = window.MotionHasOptimisedAnimation) ? void 0 : o.call(window, f))
                      );
                    return (
                      (0, nB.E)(() => {
                        c &&
                          ((m.current = !0),
                          (window.MotionIsMounted = !0),
                          c.updateFeatures(),
                          ru.render(c.render),
                          g.current && c.animationState && c.animationState.animateChanges());
                      }),
                      (0, rt.useEffect)(() => {
                        c &&
                          (!g.current && c.animationState && c.animationState.animateChanges(),
                          g.current &&
                            (queueMicrotask(() => {
                              var e;
                              null == (e = window.MotionHandoffMarkAsComplete) || e.call(window, f);
                            }),
                            (g.current = !1)));
                      }),
                      c
                    );
                  })(l, m, d, n, e.ProjectionNode));
              }
              return (0, re.jsxs)(nR.Provider, {
                value: p,
                children: [
                  h && p.visualElement ? (0, re.jsx)(h, { visualElement: p.visualElement, ...d }) : null,
                  s(
                    l,
                    e,
                    ((i = p.visualElement),
                    (0, rt.useCallback)(
                      (e) => {
                        e && m.onMount && m.onMount(e),
                          i && (e ? i.mount(e) : i.unmount()),
                          t && ("function" == typeof t ? t(e) : iE(t) && (t.current = e));
                      },
                      [i]
                    )),
                    m,
                    c,
                    p.visualElement
                  ),
                ],
              });
            }
            r &&
              (function (e) {
                for (let t in e) nO[t] = { ...nO[t], ...e[t] };
              })(r),
              (u.displayName = "motion.".concat(
                "string" == typeof l
                  ? l
                  : "create(".concat(null != (i = null != (t = l.displayName) ? t : l.name) ? i : "", ")")
              ));
            let h = (0, rt.forwardRef)(u);
            return (h[nz] = l), h;
          })({
            ...(nU(e) ? n7 : se),
            preloadedFeatures: i8,
            useRender: (function (e = !1) {
              return (t, i, r, { latestValues: n }, s) => {
                let o = (
                    nU(t)
                      ? function (e, t, i, r) {
                          let n = (0, rt.useMemo)(() => {
                            let i = n0();
                            return nQ(i, t, n1(r), e.transformTemplate), { ...i.attrs, style: { ...i.style } };
                          }, [t]);
                          if (e.style) {
                            let t = {};
                            st(t, e.style, e), (n.style = { ...t, ...n.style });
                          }
                          return n;
                        }
                      : function (e, t) {
                          let i = {},
                            r = (function (e, t) {
                              let i = e.style || {},
                                r = {};
                              return (
                                st(r, i, e),
                                Object.assign(
                                  r,
                                  (function ({ transformTemplate: e }, t) {
                                    return (0, rt.useMemo)(() => {
                                      let i = nJ();
                                      return nX(i, t, e), Object.assign({}, i.vars, i.style);
                                    }, [t]);
                                  })(e, t)
                                ),
                                r
                              );
                            })(e, t);
                          return (
                            e.drag &&
                              !1 !== e.dragListener &&
                              ((i.draggable = !1),
                              (r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none"),
                              (r.touchAction = !0 === e.drag ? "none" : `pan-${"x" === e.drag ? "y" : "x"}`)),
                            void 0 === e.tabIndex && (e.onTap || e.onTapStart || e.whileTap) && (i.tabIndex = 0),
                            (i.style = r),
                            i
                          );
                        }
                  )(i, n, s, t),
                  a = (function (e, t, i) {
                    let r = {};
                    for (let n in e)
                      ("values" !== n || "object" != typeof e.values) &&
                        (sn(n) || (!0 === i && sr(n)) || (!t && !sr(n)) || (e.draggable && n.startsWith("onDrag"))) &&
                        (r[n] = e[n]);
                    return r;
                  })(i, "string" == typeof t, e),
                  l = t !== rt.Fragment ? { ...a, ...o, ref: r } : {},
                  { children: u } = i,
                  h = (0, rt.useMemo)(() => (L(u) ? u.get() : u), [u]);
                return (0, rt.createElement)(t, { ...l, children: h });
              };
            })(t),
            createVisualElement: i7,
            Component: e,
          });
        })
      );
    },
    8375: () => {},
    8883: (e, t, i) => {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        Object.defineProperty(t, "getImgProps", {
          enumerable: !0,
          get: function () {
            return l;
          },
        }),
        i(3230);
      let r = i(5100),
        n = i(5840),
        s = ["-moz-initial", "fill", "none", "scale-down", void 0];
      function o(e) {
        return void 0 !== e.default;
      }
      function a(e) {
        return void 0 === e
          ? e
          : "number" == typeof e
            ? Number.isFinite(e)
              ? e
              : NaN
            : "string" == typeof e && /^[0-9]+$/.test(e)
              ? parseInt(e, 10)
              : NaN;
      }
      function l(e, t) {
        var i, l;
        let u,
          h,
          d,
          {
            src: c,
            sizes: p,
            unoptimized: m = !1,
            priority: f = !1,
            loading: g,
            className: v,
            quality: y,
            width: b,
            height: x,
            fill: w = !1,
            style: S,
            overrideSrc: P,
            onLoad: T,
            onLoadingComplete: A,
            placeholder: C = "empty",
            blurDataURL: E,
            fetchPriority: k,
            decoding: M = "async",
            layout: j,
            objectFit: R,
            objectPosition: V,
            lazyBoundary: _,
            lazyRoot: D,
            ...F
          } = e,
          { imgConf: L, showAltText: O, blurComplete: z, defaultLoader: I } = t,
          B = L || n.imageConfigDefault;
        if ("allSizes" in B) u = B;
        else {
          let e = [...B.deviceSizes, ...B.imageSizes].sort((e, t) => e - t),
            t = B.deviceSizes.sort((e, t) => e - t),
            r = null == (i = B.qualities) ? void 0 : i.sort((e, t) => e - t);
          u = { ...B, allSizes: e, deviceSizes: t, qualities: r };
        }
        if (void 0 === I)
          throw Object.defineProperty(
            Error(
              "images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"
            ),
            "__NEXT_ERROR_CODE",
            { value: "E163", enumerable: !1, configurable: !0 }
          );
        let N = F.loader || I;
        delete F.loader, delete F.srcSet;
        let U = "__next_img_default" in N;
        if (U) {
          if ("custom" === u.loader)
            throw Object.defineProperty(
              Error(
                'Image with src "' +
                  c +
                  '" is missing "loader" prop.\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader'
              ),
              "__NEXT_ERROR_CODE",
              { value: "E252", enumerable: !1, configurable: !0 }
            );
        } else {
          let e = N;
          N = (t) => {
            let { config: i, ...r } = t;
            return e(r);
          };
        }
        if (j) {
          "fill" === j && (w = !0);
          let e = { intrinsic: { maxWidth: "100%", height: "auto" }, responsive: { width: "100%", height: "auto" } }[j];
          e && (S = { ...S, ...e });
          let t = { responsive: "100vw", fill: "100vw" }[j];
          t && !p && (p = t);
        }
        let $ = "",
          W = a(b),
          G = a(x);
        if ((l = c) && "object" == typeof l && (o(l) || void 0 !== l.src)) {
          let e = o(c) ? c.default : c;
          if (!e.src)
            throw Object.defineProperty(
              Error(
                "An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received " +
                  JSON.stringify(e)
              ),
              "__NEXT_ERROR_CODE",
              { value: "E460", enumerable: !1, configurable: !0 }
            );
          if (!e.height || !e.width)
            throw Object.defineProperty(
              Error(
                "An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received " +
                  JSON.stringify(e)
              ),
              "__NEXT_ERROR_CODE",
              { value: "E48", enumerable: !1, configurable: !0 }
            );
          if (((h = e.blurWidth), (d = e.blurHeight), (E = E || e.blurDataURL), ($ = e.src), !w))
            if (W || G) {
              if (W && !G) {
                let t = W / e.width;
                G = Math.round(e.height * t);
              } else if (!W && G) {
                let t = G / e.height;
                W = Math.round(e.width * t);
              }
            } else (W = e.width), (G = e.height);
        }
        let H = !f && ("lazy" === g || void 0 === g);
        (!(c = "string" == typeof c ? c : $) || c.startsWith("data:") || c.startsWith("blob:")) && ((m = !0), (H = !1)),
          u.unoptimized && (m = !0),
          U && !u.dangerouslyAllowSVG && c.split("?", 1)[0].endsWith(".svg") && (m = !0);
        let q = a(y),
          X = Object.assign(
            w
              ? {
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  objectFit: R,
                  objectPosition: V,
                }
              : {},
            O ? {} : { color: "transparent" },
            S
          ),
          Y =
            z || "empty" === C
              ? null
              : "blur" === C
                ? 'url("data:image/svg+xml;charset=utf-8,' +
                  (0, r.getImageBlurSvg)({
                    widthInt: W,
                    heightInt: G,
                    blurWidth: h,
                    blurHeight: d,
                    blurDataURL: E || "",
                    objectFit: X.objectFit,
                  }) +
                  '")'
                : 'url("' + C + '")',
          K = s.includes(X.objectFit) ? ("fill" === X.objectFit ? "100% 100%" : "cover") : X.objectFit,
          Z = Y
            ? {
                backgroundSize: K,
                backgroundPosition: X.objectPosition || "50% 50%",
                backgroundRepeat: "no-repeat",
                backgroundImage: Y,
              }
            : {},
          Q = (function (e) {
            let { config: t, src: i, unoptimized: r, width: n, quality: s, sizes: o, loader: a } = e;
            if (r) return { src: i, srcSet: void 0, sizes: void 0 };
            let { widths: l, kind: u } = (function (e, t, i) {
                let { deviceSizes: r, allSizes: n } = e;
                if (i) {
                  let e = /(^|\s)(1?\d?\d)vw/g,
                    t = [];
                  for (let r; (r = e.exec(i)); ) t.push(parseInt(r[2]));
                  if (t.length) {
                    let e = 0.01 * Math.min(...t);
                    return { widths: n.filter((t) => t >= r[0] * e), kind: "w" };
                  }
                  return { widths: n, kind: "w" };
                }
                return "number" != typeof t
                  ? { widths: r, kind: "w" }
                  : {
                      widths: [...new Set([t, 2 * t].map((e) => n.find((t) => t >= e) || n[n.length - 1]))],
                      kind: "x",
                    };
              })(t, n, o),
              h = l.length - 1;
            return {
              sizes: o || "w" !== u ? o : "100vw",
              srcSet: l
                .map((e, r) => a({ config: t, src: i, quality: s, width: e }) + " " + ("w" === u ? e : r + 1) + u)
                .join(", "),
              src: a({ config: t, src: i, quality: s, width: l[h] }),
            };
          })({ config: u, src: c, unoptimized: m, width: W, quality: q, sizes: p, loader: N });
        return {
          props: {
            ...F,
            loading: H ? "lazy" : g,
            fetchPriority: k,
            width: W,
            height: G,
            decoding: M,
            className: v,
            style: { ...X, ...Z },
            sizes: Q.sizes,
            srcSet: Q.srcSet,
            src: P || Q.src,
          },
          meta: { unoptimized: m, priority: f, placeholder: C, fill: w },
        };
      }
    },
    9025: (e, t, i) => {
      "use strict";
      i.d(t, { E: () => n });
      var r = i(2115);
      let n = i(2801).B ? r.useLayoutEffect : r.useEffect;
    },
    9137: (e, t, i) => {
      "use strict";
      e.exports = i(2269).style;
    },
    9588: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => r });
      let r = (0, i(9946).A)("mic", [
        ["path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", key: "131961" }],
        ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
        ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
      ]);
    },
    9688: (e, t, i) => {
      "use strict";
      i.d(t, { QP: () => Y });
      let r = (e) => {
          let t = a(e),
            { conflictingClassGroups: i, conflictingClassGroupModifiers: r } = e;
          return {
            getClassGroupId: (e) => {
              let i = e.split("-");
              return "" === i[0] && 1 !== i.length && i.shift(), n(i, t) || o(e);
            },
            getConflictingClassGroupIds: (e, t) => {
              let n = i[e] || [];
              return t && r[e] ? [...n, ...r[e]] : n;
            },
          };
        },
        n = (e, t) => {
          if (0 === e.length) return t.classGroupId;
          let i = e[0],
            r = t.nextPart.get(i),
            s = r ? n(e.slice(1), r) : void 0;
          if (s) return s;
          if (0 === t.validators.length) return;
          let o = e.join("-");
          return t.validators.find(({ validator: e }) => e(o))?.classGroupId;
        },
        s = /^\[(.+)\]$/,
        o = (e) => {
          if (s.test(e)) {
            let t = s.exec(e)[1],
              i = t?.substring(0, t.indexOf(":"));
            if (i) return "arbitrary.." + i;
          }
        },
        a = (e) => {
          let { theme: t, prefix: i } = e,
            r = { nextPart: new Map(), validators: [] };
          return (
            d(Object.entries(e.classGroups), i).forEach(([e, i]) => {
              l(i, r, e, t);
            }),
            r
          );
        },
        l = (e, t, i, r) => {
          e.forEach((e) => {
            if ("string" == typeof e) {
              ("" === e ? t : u(t, e)).classGroupId = i;
              return;
            }
            if ("function" == typeof e)
              return h(e) ? void l(e(r), t, i, r) : void t.validators.push({ validator: e, classGroupId: i });
            Object.entries(e).forEach(([e, n]) => {
              l(n, u(t, e), i, r);
            });
          });
        },
        u = (e, t) => {
          let i = e;
          return (
            t.split("-").forEach((e) => {
              i.nextPart.has(e) || i.nextPart.set(e, { nextPart: new Map(), validators: [] }), (i = i.nextPart.get(e));
            }),
            i
          );
        },
        h = (e) => e.isThemeGetter,
        d = (e, t) =>
          t
            ? e.map(([e, i]) => [
                e,
                i.map((e) =>
                  "string" == typeof e
                    ? t + e
                    : "object" == typeof e
                      ? Object.fromEntries(Object.entries(e).map(([e, i]) => [t + e, i]))
                      : e
                ),
              ])
            : e,
        c = (e) => {
          if (e < 1) return { get: () => void 0, set: () => {} };
          let t = 0,
            i = new Map(),
            r = new Map(),
            n = (n, s) => {
              i.set(n, s), ++t > e && ((t = 0), (r = i), (i = new Map()));
            };
          return {
            get(e) {
              let t = i.get(e);
              return void 0 !== t ? t : void 0 !== (t = r.get(e)) ? (n(e, t), t) : void 0;
            },
            set(e, t) {
              i.has(e) ? i.set(e, t) : n(e, t);
            },
          };
        },
        p = (e) => {
          let { separator: t, experimentalParseClassName: i } = e,
            r = 1 === t.length,
            n = t[0],
            s = t.length,
            o = (e) => {
              let i,
                o = [],
                a = 0,
                l = 0;
              for (let u = 0; u < e.length; u++) {
                let h = e[u];
                if (0 === a) {
                  if (h === n && (r || e.slice(u, u + s) === t)) {
                    o.push(e.slice(l, u)), (l = u + s);
                    continue;
                  }
                  if ("/" === h) {
                    i = u;
                    continue;
                  }
                }
                "[" === h ? a++ : "]" === h && a--;
              }
              let u = 0 === o.length ? e : e.substring(l),
                h = u.startsWith("!"),
                d = h ? u.substring(1) : u;
              return {
                modifiers: o,
                hasImportantModifier: h,
                baseClassName: d,
                maybePostfixModifierPosition: i && i > l ? i - l : void 0,
              };
            };
          return i ? (e) => i({ className: e, parseClassName: o }) : o;
        },
        m = (e) => {
          if (e.length <= 1) return e;
          let t = [],
            i = [];
          return (
            e.forEach((e) => {
              "[" === e[0] ? (t.push(...i.sort(), e), (i = [])) : i.push(e);
            }),
            t.push(...i.sort()),
            t
          );
        },
        f = (e) => ({ cache: c(e.cacheSize), parseClassName: p(e), ...r(e) }),
        g = /\s+/,
        v = (e, t) => {
          let { parseClassName: i, getClassGroupId: r, getConflictingClassGroupIds: n } = t,
            s = [],
            o = e.trim().split(g),
            a = "";
          for (let e = o.length - 1; e >= 0; e -= 1) {
            let t = o[e],
              { modifiers: l, hasImportantModifier: u, baseClassName: h, maybePostfixModifierPosition: d } = i(t),
              c = !!d,
              p = r(c ? h.substring(0, d) : h);
            if (!p) {
              if (!c || !(p = r(h))) {
                a = t + (a.length > 0 ? " " + a : a);
                continue;
              }
              c = !1;
            }
            let f = m(l).join(":"),
              g = u ? f + "!" : f,
              v = g + p;
            if (s.includes(v)) continue;
            s.push(v);
            let y = n(p, c);
            for (let e = 0; e < y.length; ++e) {
              let t = y[e];
              s.push(g + t);
            }
            a = t + (a.length > 0 ? " " + a : a);
          }
          return a;
        };
      function y() {
        let e,
          t,
          i = 0,
          r = "";
        for (; i < arguments.length; ) (e = arguments[i++]) && (t = b(e)) && (r && (r += " "), (r += t));
        return r;
      }
      let b = (e) => {
          let t;
          if ("string" == typeof e) return e;
          let i = "";
          for (let r = 0; r < e.length; r++) e[r] && (t = b(e[r])) && (i && (i += " "), (i += t));
          return i;
        },
        x = (e) => {
          let t = (t) => t[e] || [];
          return (t.isThemeGetter = !0), t;
        },
        w = /^\[(?:([a-z-]+):)?(.+)\]$/i,
        S = /^\d+\/\d+$/,
        P = new Set(["px", "full", "screen"]),
        T = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
        A =
          /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
        C = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
        E = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
        k = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
        M = (e) => R(e) || P.has(e) || S.test(e),
        j = (e) => W(e, "length", G),
        R = (e) => !!e && !Number.isNaN(Number(e)),
        V = (e) => W(e, "number", R),
        _ = (e) => !!e && Number.isInteger(Number(e)),
        D = (e) => e.endsWith("%") && R(e.slice(0, -1)),
        F = (e) => w.test(e),
        L = (e) => T.test(e),
        O = new Set(["length", "size", "percentage"]),
        z = (e) => W(e, O, H),
        I = (e) => W(e, "position", H),
        B = new Set(["image", "url"]),
        N = (e) => W(e, B, X),
        U = (e) => W(e, "", q),
        $ = () => !0,
        W = (e, t, i) => {
          let r = w.exec(e);
          return !!r && (r[1] ? ("string" == typeof t ? r[1] === t : t.has(r[1])) : i(r[2]));
        },
        G = (e) => A.test(e) && !C.test(e),
        H = () => !1,
        q = (e) => E.test(e),
        X = (e) => k.test(e);
      Symbol.toStringTag;
      let Y = (function (e, ...t) {
        let i,
          r,
          n,
          s = function (a) {
            return (r = (i = f(t.reduce((e, t) => t(e), e()))).cache.get), (n = i.cache.set), (s = o), o(a);
          };
        function o(e) {
          let t = r(e);
          if (t) return t;
          let s = v(e, i);
          return n(e, s), s;
        }
        return function () {
          return s(y.apply(null, arguments));
        };
      })(() => {
        let e = x("colors"),
          t = x("spacing"),
          i = x("blur"),
          r = x("brightness"),
          n = x("borderColor"),
          s = x("borderRadius"),
          o = x("borderSpacing"),
          a = x("borderWidth"),
          l = x("contrast"),
          u = x("grayscale"),
          h = x("hueRotate"),
          d = x("invert"),
          c = x("gap"),
          p = x("gradientColorStops"),
          m = x("gradientColorStopPositions"),
          f = x("inset"),
          g = x("margin"),
          v = x("opacity"),
          y = x("padding"),
          b = x("saturate"),
          w = x("scale"),
          S = x("sepia"),
          P = x("skew"),
          T = x("space"),
          A = x("translate"),
          C = () => ["auto", "contain", "none"],
          E = () => ["auto", "hidden", "clip", "visible", "scroll"],
          k = () => ["auto", F, t],
          O = () => [F, t],
          B = () => ["", M, j],
          W = () => ["auto", R, F],
          G = () => [
            "bottom",
            "center",
            "left",
            "left-bottom",
            "left-top",
            "right",
            "right-bottom",
            "right-top",
            "top",
          ],
          H = () => ["solid", "dashed", "dotted", "double", "none"],
          q = () => [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-burn",
            "hard-light",
            "soft-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity",
          ],
          X = () => ["start", "end", "center", "between", "around", "evenly", "stretch"],
          Y = () => ["", "0", F],
          K = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
          Z = () => [R, F];
        return {
          cacheSize: 500,
          separator: ":",
          theme: {
            colors: [$],
            spacing: [M, j],
            blur: ["none", "", L, F],
            brightness: Z(),
            borderColor: [e],
            borderRadius: ["none", "", "full", L, F],
            borderSpacing: O(),
            borderWidth: B(),
            contrast: Z(),
            grayscale: Y(),
            hueRotate: Z(),
            invert: Y(),
            gap: O(),
            gradientColorStops: [e],
            gradientColorStopPositions: [D, j],
            inset: k(),
            margin: k(),
            opacity: Z(),
            padding: O(),
            saturate: Z(),
            scale: Z(),
            sepia: Y(),
            skew: Z(),
            space: O(),
            translate: O(),
          },
          classGroups: {
            aspect: [{ aspect: ["auto", "square", "video", F] }],
            container: ["container"],
            columns: [{ columns: [L] }],
            "break-after": [{ "break-after": K() }],
            "break-before": [{ "break-before": K() }],
            "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }],
            "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
            box: [{ box: ["border", "content"] }],
            display: [
              "block",
              "inline-block",
              "inline",
              "flex",
              "inline-flex",
              "table",
              "inline-table",
              "table-caption",
              "table-cell",
              "table-column",
              "table-column-group",
              "table-footer-group",
              "table-header-group",
              "table-row-group",
              "table-row",
              "flow-root",
              "grid",
              "inline-grid",
              "contents",
              "list-item",
              "hidden",
            ],
            float: [{ float: ["right", "left", "none", "start", "end"] }],
            clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
            isolation: ["isolate", "isolation-auto"],
            "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }],
            "object-position": [{ object: [...G(), F] }],
            overflow: [{ overflow: E() }],
            "overflow-x": [{ "overflow-x": E() }],
            "overflow-y": [{ "overflow-y": E() }],
            overscroll: [{ overscroll: C() }],
            "overscroll-x": [{ "overscroll-x": C() }],
            "overscroll-y": [{ "overscroll-y": C() }],
            position: ["static", "fixed", "absolute", "relative", "sticky"],
            inset: [{ inset: [f] }],
            "inset-x": [{ "inset-x": [f] }],
            "inset-y": [{ "inset-y": [f] }],
            start: [{ start: [f] }],
            end: [{ end: [f] }],
            top: [{ top: [f] }],
            right: [{ right: [f] }],
            bottom: [{ bottom: [f] }],
            left: [{ left: [f] }],
            visibility: ["visible", "invisible", "collapse"],
            z: [{ z: ["auto", _, F] }],
            basis: [{ basis: k() }],
            "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }],
            "flex-wrap": [{ flex: ["wrap", "wrap-reverse", "nowrap"] }],
            flex: [{ flex: ["1", "auto", "initial", "none", F] }],
            grow: [{ grow: Y() }],
            shrink: [{ shrink: Y() }],
            order: [{ order: ["first", "last", "none", _, F] }],
            "grid-cols": [{ "grid-cols": [$] }],
            "col-start-end": [{ col: ["auto", { span: ["full", _, F] }, F] }],
            "col-start": [{ "col-start": W() }],
            "col-end": [{ "col-end": W() }],
            "grid-rows": [{ "grid-rows": [$] }],
            "row-start-end": [{ row: ["auto", { span: [_, F] }, F] }],
            "row-start": [{ "row-start": W() }],
            "row-end": [{ "row-end": W() }],
            "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }],
            "auto-cols": [{ "auto-cols": ["auto", "min", "max", "fr", F] }],
            "auto-rows": [{ "auto-rows": ["auto", "min", "max", "fr", F] }],
            gap: [{ gap: [c] }],
            "gap-x": [{ "gap-x": [c] }],
            "gap-y": [{ "gap-y": [c] }],
            "justify-content": [{ justify: ["normal", ...X()] }],
            "justify-items": [{ "justify-items": ["start", "end", "center", "stretch"] }],
            "justify-self": [{ "justify-self": ["auto", "start", "end", "center", "stretch"] }],
            "align-content": [{ content: ["normal", ...X(), "baseline"] }],
            "align-items": [{ items: ["start", "end", "center", "baseline", "stretch"] }],
            "align-self": [{ self: ["auto", "start", "end", "center", "stretch", "baseline"] }],
            "place-content": [{ "place-content": [...X(), "baseline"] }],
            "place-items": [{ "place-items": ["start", "end", "center", "baseline", "stretch"] }],
            "place-self": [{ "place-self": ["auto", "start", "end", "center", "stretch"] }],
            p: [{ p: [y] }],
            px: [{ px: [y] }],
            py: [{ py: [y] }],
            ps: [{ ps: [y] }],
            pe: [{ pe: [y] }],
            pt: [{ pt: [y] }],
            pr: [{ pr: [y] }],
            pb: [{ pb: [y] }],
            pl: [{ pl: [y] }],
            m: [{ m: [g] }],
            mx: [{ mx: [g] }],
            my: [{ my: [g] }],
            ms: [{ ms: [g] }],
            me: [{ me: [g] }],
            mt: [{ mt: [g] }],
            mr: [{ mr: [g] }],
            mb: [{ mb: [g] }],
            ml: [{ ml: [g] }],
            "space-x": [{ "space-x": [T] }],
            "space-x-reverse": ["space-x-reverse"],
            "space-y": [{ "space-y": [T] }],
            "space-y-reverse": ["space-y-reverse"],
            w: [{ w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", F, t] }],
            "min-w": [{ "min-w": [F, t, "min", "max", "fit"] }],
            "max-w": [{ "max-w": [F, t, "none", "full", "min", "max", "fit", "prose", { screen: [L] }, L] }],
            h: [{ h: [F, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"] }],
            "min-h": [{ "min-h": [F, t, "min", "max", "fit", "svh", "lvh", "dvh"] }],
            "max-h": [{ "max-h": [F, t, "min", "max", "fit", "svh", "lvh", "dvh"] }],
            size: [{ size: [F, t, "auto", "min", "max", "fit"] }],
            "font-size": [{ text: ["base", L, j] }],
            "font-smoothing": ["antialiased", "subpixel-antialiased"],
            "font-style": ["italic", "not-italic"],
            "font-weight": [
              {
                font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", V],
              },
            ],
            "font-family": [{ font: [$] }],
            "fvn-normal": ["normal-nums"],
            "fvn-ordinal": ["ordinal"],
            "fvn-slashed-zero": ["slashed-zero"],
            "fvn-figure": ["lining-nums", "oldstyle-nums"],
            "fvn-spacing": ["proportional-nums", "tabular-nums"],
            "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
            tracking: [{ tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", F] }],
            "line-clamp": [{ "line-clamp": ["none", R, V] }],
            leading: [{ leading: ["none", "tight", "snug", "normal", "relaxed", "loose", M, F] }],
            "list-image": [{ "list-image": ["none", F] }],
            "list-style-type": [{ list: ["none", "disc", "decimal", F] }],
            "list-style-position": [{ list: ["inside", "outside"] }],
            "placeholder-color": [{ placeholder: [e] }],
            "placeholder-opacity": [{ "placeholder-opacity": [v] }],
            "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }],
            "text-color": [{ text: [e] }],
            "text-opacity": [{ "text-opacity": [v] }],
            "text-decoration": ["underline", "overline", "line-through", "no-underline"],
            "text-decoration-style": [{ decoration: [...H(), "wavy"] }],
            "text-decoration-thickness": [{ decoration: ["auto", "from-font", M, j] }],
            "underline-offset": [{ "underline-offset": ["auto", M, F] }],
            "text-decoration-color": [{ decoration: [e] }],
            "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
            "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
            "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
            indent: [{ indent: O() }],
            "vertical-align": [
              { align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", F] },
            ],
            whitespace: [{ whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] }],
            break: [{ break: ["normal", "words", "all", "keep"] }],
            hyphens: [{ hyphens: ["none", "manual", "auto"] }],
            content: [{ content: ["none", F] }],
            "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
            "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
            "bg-opacity": [{ "bg-opacity": [v] }],
            "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
            "bg-position": [{ bg: [...G(), I] }],
            "bg-repeat": [{ bg: ["no-repeat", { repeat: ["", "x", "y", "round", "space"] }] }],
            "bg-size": [{ bg: ["auto", "cover", "contain", z] }],
            "bg-image": [{ bg: ["none", { "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, N] }],
            "bg-color": [{ bg: [e] }],
            "gradient-from-pos": [{ from: [m] }],
            "gradient-via-pos": [{ via: [m] }],
            "gradient-to-pos": [{ to: [m] }],
            "gradient-from": [{ from: [p] }],
            "gradient-via": [{ via: [p] }],
            "gradient-to": [{ to: [p] }],
            rounded: [{ rounded: [s] }],
            "rounded-s": [{ "rounded-s": [s] }],
            "rounded-e": [{ "rounded-e": [s] }],
            "rounded-t": [{ "rounded-t": [s] }],
            "rounded-r": [{ "rounded-r": [s] }],
            "rounded-b": [{ "rounded-b": [s] }],
            "rounded-l": [{ "rounded-l": [s] }],
            "rounded-ss": [{ "rounded-ss": [s] }],
            "rounded-se": [{ "rounded-se": [s] }],
            "rounded-ee": [{ "rounded-ee": [s] }],
            "rounded-es": [{ "rounded-es": [s] }],
            "rounded-tl": [{ "rounded-tl": [s] }],
            "rounded-tr": [{ "rounded-tr": [s] }],
            "rounded-br": [{ "rounded-br": [s] }],
            "rounded-bl": [{ "rounded-bl": [s] }],
            "border-w": [{ border: [a] }],
            "border-w-x": [{ "border-x": [a] }],
            "border-w-y": [{ "border-y": [a] }],
            "border-w-s": [{ "border-s": [a] }],
            "border-w-e": [{ "border-e": [a] }],
            "border-w-t": [{ "border-t": [a] }],
            "border-w-r": [{ "border-r": [a] }],
            "border-w-b": [{ "border-b": [a] }],
            "border-w-l": [{ "border-l": [a] }],
            "border-opacity": [{ "border-opacity": [v] }],
            "border-style": [{ border: [...H(), "hidden"] }],
            "divide-x": [{ "divide-x": [a] }],
            "divide-x-reverse": ["divide-x-reverse"],
            "divide-y": [{ "divide-y": [a] }],
            "divide-y-reverse": ["divide-y-reverse"],
            "divide-opacity": [{ "divide-opacity": [v] }],
            "divide-style": [{ divide: H() }],
            "border-color": [{ border: [n] }],
            "border-color-x": [{ "border-x": [n] }],
            "border-color-y": [{ "border-y": [n] }],
            "border-color-s": [{ "border-s": [n] }],
            "border-color-e": [{ "border-e": [n] }],
            "border-color-t": [{ "border-t": [n] }],
            "border-color-r": [{ "border-r": [n] }],
            "border-color-b": [{ "border-b": [n] }],
            "border-color-l": [{ "border-l": [n] }],
            "divide-color": [{ divide: [n] }],
            "outline-style": [{ outline: ["", ...H()] }],
            "outline-offset": [{ "outline-offset": [M, F] }],
            "outline-w": [{ outline: [M, j] }],
            "outline-color": [{ outline: [e] }],
            "ring-w": [{ ring: B() }],
            "ring-w-inset": ["ring-inset"],
            "ring-color": [{ ring: [e] }],
            "ring-opacity": [{ "ring-opacity": [v] }],
            "ring-offset-w": [{ "ring-offset": [M, j] }],
            "ring-offset-color": [{ "ring-offset": [e] }],
            shadow: [{ shadow: ["", "inner", "none", L, U] }],
            "shadow-color": [{ shadow: [$] }],
            opacity: [{ opacity: [v] }],
            "mix-blend": [{ "mix-blend": [...q(), "plus-lighter", "plus-darker"] }],
            "bg-blend": [{ "bg-blend": q() }],
            filter: [{ filter: ["", "none"] }],
            blur: [{ blur: [i] }],
            brightness: [{ brightness: [r] }],
            contrast: [{ contrast: [l] }],
            "drop-shadow": [{ "drop-shadow": ["", "none", L, F] }],
            grayscale: [{ grayscale: [u] }],
            "hue-rotate": [{ "hue-rotate": [h] }],
            invert: [{ invert: [d] }],
            saturate: [{ saturate: [b] }],
            sepia: [{ sepia: [S] }],
            "backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
            "backdrop-blur": [{ "backdrop-blur": [i] }],
            "backdrop-brightness": [{ "backdrop-brightness": [r] }],
            "backdrop-contrast": [{ "backdrop-contrast": [l] }],
            "backdrop-grayscale": [{ "backdrop-grayscale": [u] }],
            "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [h] }],
            "backdrop-invert": [{ "backdrop-invert": [d] }],
            "backdrop-opacity": [{ "backdrop-opacity": [v] }],
            "backdrop-saturate": [{ "backdrop-saturate": [b] }],
            "backdrop-sepia": [{ "backdrop-sepia": [S] }],
            "border-collapse": [{ border: ["collapse", "separate"] }],
            "border-spacing": [{ "border-spacing": [o] }],
            "border-spacing-x": [{ "border-spacing-x": [o] }],
            "border-spacing-y": [{ "border-spacing-y": [o] }],
            "table-layout": [{ table: ["auto", "fixed"] }],
            caption: [{ caption: ["top", "bottom"] }],
            transition: [{ transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", F] }],
            duration: [{ duration: Z() }],
            ease: [{ ease: ["linear", "in", "out", "in-out", F] }],
            delay: [{ delay: Z() }],
            animate: [{ animate: ["none", "spin", "ping", "pulse", "bounce", F] }],
            transform: [{ transform: ["", "gpu", "none"] }],
            scale: [{ scale: [w] }],
            "scale-x": [{ "scale-x": [w] }],
            "scale-y": [{ "scale-y": [w] }],
            rotate: [{ rotate: [_, F] }],
            "translate-x": [{ "translate-x": [A] }],
            "translate-y": [{ "translate-y": [A] }],
            "skew-x": [{ "skew-x": [P] }],
            "skew-y": [{ "skew-y": [P] }],
            "transform-origin": [
              {
                origin: [
                  "center",
                  "top",
                  "top-right",
                  "right",
                  "bottom-right",
                  "bottom",
                  "bottom-left",
                  "left",
                  "top-left",
                  F,
                ],
              },
            ],
            accent: [{ accent: ["auto", e] }],
            appearance: [{ appearance: ["none", "auto"] }],
            cursor: [
              {
                cursor: [
                  "auto",
                  "default",
                  "pointer",
                  "wait",
                  "text",
                  "move",
                  "help",
                  "not-allowed",
                  "none",
                  "context-menu",
                  "progress",
                  "cell",
                  "crosshair",
                  "vertical-text",
                  "alias",
                  "copy",
                  "no-drop",
                  "grab",
                  "grabbing",
                  "all-scroll",
                  "col-resize",
                  "row-resize",
                  "n-resize",
                  "e-resize",
                  "s-resize",
                  "w-resize",
                  "ne-resize",
                  "nw-resize",
                  "se-resize",
                  "sw-resize",
                  "ew-resize",
                  "ns-resize",
                  "nesw-resize",
                  "nwse-resize",
                  "zoom-in",
                  "zoom-out",
                  F,
                ],
              },
            ],
            "caret-color": [{ caret: [e] }],
            "pointer-events": [{ "pointer-events": ["none", "auto"] }],
            resize: [{ resize: ["none", "y", "x", ""] }],
            "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
            "scroll-m": [{ "scroll-m": O() }],
            "scroll-mx": [{ "scroll-mx": O() }],
            "scroll-my": [{ "scroll-my": O() }],
            "scroll-ms": [{ "scroll-ms": O() }],
            "scroll-me": [{ "scroll-me": O() }],
            "scroll-mt": [{ "scroll-mt": O() }],
            "scroll-mr": [{ "scroll-mr": O() }],
            "scroll-mb": [{ "scroll-mb": O() }],
            "scroll-ml": [{ "scroll-ml": O() }],
            "scroll-p": [{ "scroll-p": O() }],
            "scroll-px": [{ "scroll-px": O() }],
            "scroll-py": [{ "scroll-py": O() }],
            "scroll-ps": [{ "scroll-ps": O() }],
            "scroll-pe": [{ "scroll-pe": O() }],
            "scroll-pt": [{ "scroll-pt": O() }],
            "scroll-pr": [{ "scroll-pr": O() }],
            "scroll-pb": [{ "scroll-pb": O() }],
            "scroll-pl": [{ "scroll-pl": O() }],
            "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
            "snap-stop": [{ snap: ["normal", "always"] }],
            "snap-type": [{ snap: ["none", "x", "y", "both"] }],
            "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
            touch: [{ touch: ["auto", "none", "manipulation"] }],
            "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
            "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
            "touch-pz": ["touch-pinch-zoom"],
            select: [{ select: ["none", "text", "all", "auto"] }],
            "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", F] }],
            fill: [{ fill: [e, "none"] }],
            "stroke-w": [{ stroke: [M, j, V] }],
            stroke: [{ stroke: [e, "none"] }],
            sr: ["sr-only", "not-sr-only"],
            "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
          },
          conflictingClassGroups: {
            overflow: ["overflow-x", "overflow-y"],
            overscroll: ["overscroll-x", "overscroll-y"],
            inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
            "inset-x": ["right", "left"],
            "inset-y": ["top", "bottom"],
            flex: ["basis", "grow", "shrink"],
            gap: ["gap-x", "gap-y"],
            p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
            px: ["pr", "pl"],
            py: ["pt", "pb"],
            m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
            mx: ["mr", "ml"],
            my: ["mt", "mb"],
            size: ["w", "h"],
            "font-size": ["leading"],
            "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
            "fvn-ordinal": ["fvn-normal"],
            "fvn-slashed-zero": ["fvn-normal"],
            "fvn-figure": ["fvn-normal"],
            "fvn-spacing": ["fvn-normal"],
            "fvn-fraction": ["fvn-normal"],
            "line-clamp": ["display", "overflow"],
            rounded: [
              "rounded-s",
              "rounded-e",
              "rounded-t",
              "rounded-r",
              "rounded-b",
              "rounded-l",
              "rounded-ss",
              "rounded-se",
              "rounded-ee",
              "rounded-es",
              "rounded-tl",
              "rounded-tr",
              "rounded-br",
              "rounded-bl",
            ],
            "rounded-s": ["rounded-ss", "rounded-es"],
            "rounded-e": ["rounded-se", "rounded-ee"],
            "rounded-t": ["rounded-tl", "rounded-tr"],
            "rounded-r": ["rounded-tr", "rounded-br"],
            "rounded-b": ["rounded-br", "rounded-bl"],
            "rounded-l": ["rounded-tl", "rounded-bl"],
            "border-spacing": ["border-spacing-x", "border-spacing-y"],
            "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
            "border-w-x": ["border-w-r", "border-w-l"],
            "border-w-y": ["border-w-t", "border-w-b"],
            "border-color": [
              "border-color-s",
              "border-color-e",
              "border-color-t",
              "border-color-r",
              "border-color-b",
              "border-color-l",
            ],
            "border-color-x": ["border-color-r", "border-color-l"],
            "border-color-y": ["border-color-t", "border-color-b"],
            "scroll-m": [
              "scroll-mx",
              "scroll-my",
              "scroll-ms",
              "scroll-me",
              "scroll-mt",
              "scroll-mr",
              "scroll-mb",
              "scroll-ml",
            ],
            "scroll-mx": ["scroll-mr", "scroll-ml"],
            "scroll-my": ["scroll-mt", "scroll-mb"],
            "scroll-p": [
              "scroll-px",
              "scroll-py",
              "scroll-ps",
              "scroll-pe",
              "scroll-pt",
              "scroll-pr",
              "scroll-pb",
              "scroll-pl",
            ],
            "scroll-px": ["scroll-pr", "scroll-pl"],
            "scroll-py": ["scroll-pt", "scroll-pb"],
            touch: ["touch-x", "touch-y", "touch-pz"],
            "touch-x": ["touch"],
            "touch-y": ["touch"],
            "touch-pz": ["touch"],
          },
          conflictingClassGroupModifiers: { "font-size": ["leading"] },
        };
      });
    },
    9946: (e, t, i) => {
      "use strict";
      i.d(t, { A: () => d });
      var r = i(2115);
      let n = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
        s = (e) => e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, i) => (i ? i.toUpperCase() : t.toLowerCase())),
        o = (e) => {
          let t = s(e);
          return t.charAt(0).toUpperCase() + t.slice(1);
        },
        a = function () {
          for (var e = arguments.length, t = Array(e), i = 0; i < e; i++) t[i] = arguments[i];
          return t
            .filter((e, t, i) => !!e && "" !== e.trim() && i.indexOf(e) === t)
            .join(" ")
            .trim();
        },
        l = (e) => {
          for (let t in e) if (t.startsWith("aria-") || "role" === t || "title" === t) return !0;
        };
      var u = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
      };
      let h = (0, r.forwardRef)((e, t) => {
          let {
            color: i = "currentColor",
            size: n = 24,
            strokeWidth: s = 2,
            absoluteStrokeWidth: o,
            className: h = "",
            children: d,
            iconNode: c,
            ...p
          } = e;
          return (0, r.createElement)(
            "svg",
            {
              ref: t,
              ...u,
              width: n,
              height: n,
              stroke: i,
              strokeWidth: o ? (24 * Number(s)) / Number(n) : s,
              className: a("lucide", h),
              ...(!d && !l(p) && { "aria-hidden": "true" }),
              ...p,
            },
            [
              ...c.map((e) => {
                let [t, i] = e;
                return (0, r.createElement)(t, i);
              }),
              ...(Array.isArray(d) ? d : [d]),
            ]
          );
        }),
        d = (e, t) => {
          let i = (0, r.forwardRef)((i, s) => {
            let { className: l, ...u } = i;
            return (0, r.createElement)(h, {
              ref: s,
              iconNode: t,
              className: a("lucide-".concat(n(o(e))), "lucide-".concat(e), l),
              ...u,
            });
          });
          return (i.displayName = o(e)), i;
        };
    },
  },
]);
