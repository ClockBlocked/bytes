(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [177],
  {
    1362: (e, t, r) => {
      "use strict";
      r.d(t, { D: () => c, ThemeProvider: () => m });
      var a = r(2115),
        s = (e, t, r, a, s, n, l, o) => {
          let i = document.documentElement,
            c = ["light", "dark"];
          function m(t) {
            var r;
            (Array.isArray(e) ? e : [e]).forEach((e) => {
              let r = "class" === e,
                a = r && n ? s.map((e) => n[e] || e) : s;
              r ? (i.classList.remove(...a), i.classList.add(n && n[t] ? n[t] : t)) : i.setAttribute(e, t);
            }),
              (r = t),
              o && c.includes(r) && (i.style.colorScheme = r);
          }
          if (a) m(a);
          else
            try {
              let e = localStorage.getItem(t) || r,
                a =
                  l && "system" === e
                    ? window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "dark"
                      : "light"
                    : e;
              m(a);
            } catch (e) {}
        },
        n = ["light", "dark"],
        l = "(prefers-color-scheme: dark)",
        o = a.createContext(void 0),
        i = { setTheme: (e) => {}, themes: [] },
        c = () => {
          var e;
          return null != (e = a.useContext(o)) ? e : i;
        },
        m = (e) => (a.useContext(o) ? a.createElement(a.Fragment, null, e.children) : a.createElement(u, { ...e })),
        d = ["light", "dark"],
        u = (e) => {
          let {
              forcedTheme: t,
              disableTransitionOnChange: r = !1,
              enableSystem: s = !0,
              enableColorScheme: i = !0,
              storageKey: c = "theme",
              themes: m = d,
              defaultTheme: u = s ? "system" : "light",
              attribute: v = "data-theme",
              value: p,
              children: g,
              nonce: E,
              scriptProps: S,
            } = e,
            [k, w] = a.useState(() => y(c, u)),
            [C, T] = a.useState(() => ("system" === k ? b() : k)),
            _ = p ? Object.values(p) : m,
            L = a.useCallback(
              (e) => {
                let t = e;
                if (!t) return;
                "system" === e && s && (t = b());
                let a = p ? p[t] : t,
                  l = r ? f(E) : null,
                  o = document.documentElement,
                  c = (e) => {
                    "class" === e
                      ? (o.classList.remove(..._), a && o.classList.add(a))
                      : e.startsWith("data-") && (a ? o.setAttribute(e, a) : o.removeAttribute(e));
                  };
                if ((Array.isArray(v) ? v.forEach(c) : c(v), i)) {
                  let e = n.includes(u) ? u : null,
                    r = n.includes(t) ? t : e;
                  o.style.colorScheme = r;
                }
                null == l || l();
              },
              [E]
            ),
            A = a.useCallback(
              (e) => {
                let t = "function" == typeof e ? e(k) : e;
                w(t);
                try {
                  localStorage.setItem(c, t);
                } catch (e) {}
              },
              [k]
            ),
            P = a.useCallback(
              (e) => {
                T(b(e)), "system" === k && s && !t && L("system");
              },
              [k, t]
            );
          a.useEffect(() => {
            let e = window.matchMedia(l);
            return e.addListener(P), P(e), () => e.removeListener(P);
          }, [P]),
            a.useEffect(() => {
              let e = (e) => {
                e.key === c && (e.newValue ? w(e.newValue) : A(u));
              };
              return window.addEventListener("storage", e), () => window.removeEventListener("storage", e);
            }, [A]),
            a.useEffect(() => {
              L(null != t ? t : k);
            }, [t, k]);
          let N = a.useMemo(
            () => ({
              theme: k,
              setTheme: A,
              forcedTheme: t,
              resolvedTheme: "system" === k ? C : k,
              themes: s ? [...m, "system"] : m,
              systemTheme: s ? C : void 0,
            }),
            [k, A, t, C, s, m]
          );
          return a.createElement(
            o.Provider,
            { value: N },
            a.createElement(h, {
              forcedTheme: t,
              storageKey: c,
              attribute: v,
              enableSystem: s,
              enableColorScheme: i,
              defaultTheme: u,
              value: p,
              themes: m,
              nonce: E,
              scriptProps: S,
            }),
            g
          );
        },
        h = a.memo((e) => {
          let {
              forcedTheme: t,
              storageKey: r,
              attribute: n,
              enableSystem: l,
              enableColorScheme: o,
              defaultTheme: i,
              value: c,
              themes: m,
              nonce: d,
              scriptProps: u,
            } = e,
            h = JSON.stringify([n, r, i, t, m, c, l, o]).slice(1, -1);
          return a.createElement("script", {
            ...u,
            suppressHydrationWarning: !0,
            nonce: "",
            dangerouslySetInnerHTML: { __html: "(".concat(s.toString(), ")(").concat(h, ")") },
          });
        }),
        y = (e, t) => {
          let r;
          try {
            r = localStorage.getItem(e) || void 0;
          } catch (e) {}
          return r || t;
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
        b = (e) => (e || (e = window.matchMedia(l)), e.matches ? "dark" : "light");
    },
    3020: (e, t, r) => {
      Promise.resolve().then(r.bind(r, 1362)),
        Promise.resolve().then(r.t.bind(r, 5688, 23)),
        Promise.resolve().then(r.t.bind(r, 9324, 23));
    },
    5688: (e) => {
      e.exports = {
        style: { fontFamily: "'Geist', 'Geist Fallback'", fontStyle: "normal" },
        className: "__className_5cfdac",
        variable: "__variable_5cfdac",
      };
    },
    9324: () => {},
  },
  (e) => {
    var t = (t) => e((e.s = t));
    e.O(0, [921, 441, 684, 358], () => t(3020)), (_N_E = e.O());
  },
]);
