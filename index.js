var $i = Object.defineProperty;
var Mi = Object.getOwnPropertyDescriptor;
var w = (o, e, t, n) => {
  for (var a = n > 1 ? void 0 : n ? Mi(e, t) : e, d = o.length - 1, u; d >= 0; d--)
    (u = o[d]) && (a = (n ? u(e, t, a) : u(a)) || a);
  return n && a && $i(e, t, a), a;
};
import { hookErrorReporting as td } from "edge://resources/js/edge-error-reporting.js";
var ar,
  Yn = "fast-kernel";
try {
  if (document.currentScript) ar = document.currentScript.getAttribute(Yn);
  else {
    let o = document.getElementsByTagName("script");
    ar = o[o.length - 1].getAttribute(Yn);
  }
} catch {
  ar = "isolate";
}
var rt;
switch (ar) {
  case "share":
    rt = Object.freeze({ updateQueue: 1, observable: 2, contextEvent: 3, elementRegistry: 4 });
    break;
  case "share-v2":
    rt = Object.freeze({ updateQueue: 1.2, observable: 2.2, contextEvent: 3.2, elementRegistry: 4.2 });
    break;
  default:
    let o = `-${Math.random().toString(36).substring(2, 8)}`;
    rt = Object.freeze({
      updateQueue: `1.2${o}`,
      observable: `2.2${o}`,
      contextEvent: `3.2${o}`,
      elementRegistry: `4.2${o}`,
    });
    break;
}
var be = (o) => typeof o == "function",
  ye = (o) => typeof o == "string",
  Qn = () => {};
(function () {
  if (!(typeof globalThis < "u"))
    if (typeof global < "u") global.globalThis = global;
    else if (typeof self < "u") self.globalThis = self;
    else if (typeof window < "u") window.globalThis = window;
    else {
      let e = new Function("return this")();
      e.globalThis = e;
    }
})();
(function () {
  "requestIdleCallback" in globalThis ||
    ((globalThis.requestIdleCallback = function (t, n) {
      let a = Date.now();
      return setTimeout(() => {
        t({ didTimeout: n?.timeout ? Date.now() - a >= n.timeout : !1, timeRemaining: () => 0 });
      }, 1);
    }),
    (globalThis.cancelIdleCallback = function (t) {
      clearTimeout(t);
    }));
})();
var Zn = { configurable: !1, enumerable: !1, writable: !1 };
globalThis.FAST === void 0 &&
  Reflect.defineProperty(globalThis, "FAST", Object.assign({ value: Object.create(null) }, Zn));
var oe = globalThis.FAST;
if (oe.getById === void 0) {
  let o = Object.create(null);
  Reflect.defineProperty(
    oe,
    "getById",
    Object.assign(
      {
        value(e, t) {
          let n = o[e];
          return n === void 0 && (n = t ? (o[e] = t()) : null), n;
        },
      },
      Zn
    )
  );
}
oe.error === void 0 &&
  Object.assign(oe, {
    warn() {},
    error(o) {
      return new Error(`Error ${o}`);
    },
    addMessages() {},
  });
var yt = Object.freeze([]);
function ao() {
  let o = new Map();
  return Object.freeze({
    register(e) {
      return o.has(e.type) ? !1 : (o.set(e.type, e), !0);
    },
    getByType(e) {
      return o.get(e);
    },
    getForInstance(e) {
      if (e != null) return o.get(e.constructor);
    },
  });
}
function sr() {
  let o = new WeakMap();
  return function (e) {
    let t = o.get(e);
    if (t === void 0) {
      let n = Reflect.getPrototypeOf(e);
      for (; t === void 0 && n !== null; ) (t = o.get(n)), (n = Reflect.getPrototypeOf(n));
      (t = t === void 0 ? [] : t.slice(0)), o.set(e, t);
    }
    return t;
  };
}
function Te(o) {
  o.prototype.toJSON = Qn;
}
var pe = Object.freeze({ none: 0, attribute: 1, booleanAttribute: 2, property: 3, content: 4, tokenList: 5, event: 6 }),
  Jn = (o) => o,
  Wi = globalThis.trustedTypes
    ? globalThis.trustedTypes.createPolicy("fast-html", { createHTML: Jn })
    : { createHTML: Jn },
  ir = Object.freeze({
    createHTML(o) {
      return Wi.createHTML(o);
    },
    protect(o, e, t, n) {
      return n;
    },
  }),
  zi = ir,
  Ye = Object.freeze({
    get policy() {
      return ir;
    },
    setPolicy(o) {
      if (ir !== zi) throw oe.error(1201);
      ir = o;
    },
    setAttribute(o, e, t) {
      t == null ? o.removeAttribute(e) : o.setAttribute(e, t);
    },
    setBooleanAttribute(o, e, t) {
      t ? o.setAttribute(e, "") : o.removeAttribute(e);
    },
  });
var nt = oe.getById(rt.updateQueue, () => {
  let o = [],
    e = [],
    t = globalThis.requestAnimationFrame,
    n = !0;
  function a() {
    if (e.length) throw e.shift();
  }
  function d(h) {
    try {
      h.call();
    } catch (r) {
      if (n) e.push(r), setTimeout(a, 0);
      else throw ((o.length = 0), r);
    }
  }
  function u() {
    let r = 0;
    for (; r < o.length; )
      if ((d(o[r]), r++, r > 1024)) {
        for (let i = 0, s = o.length - r; i < s; i++) o[i] = o[i + r];
        (o.length -= r), (r = 0);
      }
    o.length = 0;
  }
  function c(h) {
    o.push(h), o.length < 2 && (n ? t(u) : u());
  }
  return Object.freeze({ enqueue: c, next: () => new Promise(c), process: u, setMode: (h) => (n = h) });
});
var Bt = class {
    constructor(e, t) {
      (this.sub1 = void 0), (this.sub2 = void 0), (this.spillover = void 0), (this.subject = e), (this.sub1 = t);
    }
    has(e) {
      return this.spillover === void 0 ? this.sub1 === e || this.sub2 === e : this.spillover.indexOf(e) !== -1;
    }
    subscribe(e) {
      let t = this.spillover;
      if (t === void 0) {
        if (this.has(e)) return;
        if (this.sub1 === void 0) {
          this.sub1 = e;
          return;
        }
        if (this.sub2 === void 0) {
          this.sub2 = e;
          return;
        }
        (this.spillover = [this.sub1, this.sub2, e]), (this.sub1 = void 0), (this.sub2 = void 0);
      } else t.indexOf(e) === -1 && t.push(e);
    }
    unsubscribe(e) {
      let t = this.spillover;
      if (t === void 0) this.sub1 === e ? (this.sub1 = void 0) : this.sub2 === e && (this.sub2 = void 0);
      else {
        let n = t.indexOf(e);
        n !== -1 && t.splice(n, 1);
      }
    }
    notify(e) {
      let t = this.spillover,
        n = this.subject;
      if (t === void 0) {
        let a = this.sub1,
          d = this.sub2;
        a !== void 0 && a.handleChange(n, e), d !== void 0 && d.handleChange(n, e);
      } else for (let a = 0, d = t.length; a < d; ++a) t[a].handleChange(n, e);
    }
  },
  so = class {
    constructor(e) {
      (this.subscribers = {}), (this.subjectSubscribers = null), (this.subject = e);
    }
    notify(e) {
      var t, n;
      (t = this.subscribers[e]) === null || t === void 0 || t.notify(e),
        (n = this.subjectSubscribers) === null || n === void 0 || n.notify(e);
    }
    subscribe(e, t) {
      var n, a;
      let d;
      t
        ? (d = (n = this.subscribers[t]) !== null && n !== void 0 ? n : (this.subscribers[t] = new Bt(this.subject)))
        : (d =
            (a = this.subjectSubscribers) !== null && a !== void 0
              ? a
              : (this.subjectSubscribers = new Bt(this.subject))),
        d.subscribe(e);
    }
    unsubscribe(e, t) {
      var n, a;
      t
        ? (n = this.subscribers[t]) === null || n === void 0 || n.unsubscribe(e)
        : (a = this.subjectSubscribers) === null || a === void 0 || a.unsubscribe(e);
    }
  };
var zt = Object.freeze({ unknown: void 0, coupled: 1 }),
  U = oe.getById(rt.observable, () => {
    let o = nt.enqueue,
      e = /(:|&&|\|\||if|\?\.)/,
      t = new WeakMap(),
      n,
      a = (r) => {
        throw oe.error(1101);
      };
    function d(r) {
      var i;
      let s = (i = r.$fastController) !== null && i !== void 0 ? i : t.get(r);
      return s === void 0 && (Array.isArray(r) ? (s = a(r)) : t.set(r, (s = new so(r)))), s;
    }
    let u = sr();
    class c {
      constructor(i) {
        (this.name = i), (this.field = `_${i}`), (this.callback = `${i}Changed`);
      }
      getValue(i) {
        return n !== void 0 && n.watch(i, this.name), i[this.field];
      }
      setValue(i, s) {
        let l = this.field,
          p = i[l];
        if (p !== s) {
          i[l] = s;
          let v = i[this.callback];
          be(v) && v.call(i, p, s), d(i).notify(this.name);
        }
      }
    }
    class h extends Bt {
      constructor(i, s, l = !1) {
        super(i, s),
          (this.expression = i),
          (this.isVolatileBinding = l),
          (this.needsRefresh = !0),
          (this.needsQueue = !0),
          (this.isAsync = !0),
          (this.first = this),
          (this.last = null),
          (this.propertySource = void 0),
          (this.propertyName = void 0),
          (this.notifier = void 0),
          (this.next = void 0);
      }
      setMode(i) {
        this.isAsync = this.needsQueue = i;
      }
      bind(i) {
        this.controller = i;
        let s = this.observe(i.source, i.context);
        return !i.isBound && this.requiresUnbind(i) && i.onUnbind(this), s;
      }
      requiresUnbind(i) {
        return i.sourceLifetime !== zt.coupled || this.first !== this.last || this.first.propertySource !== i.source;
      }
      unbind(i) {
        this.dispose();
      }
      observe(i, s) {
        this.needsRefresh && this.last !== null && this.dispose();
        let l = n;
        (n = this.needsRefresh ? this : void 0), (this.needsRefresh = this.isVolatileBinding);
        let p;
        try {
          p = this.expression(i, s);
        } finally {
          n = l;
        }
        return p;
      }
      disconnect() {
        this.dispose();
      }
      dispose() {
        if (this.last !== null) {
          let i = this.first;
          for (; i !== void 0; ) i.notifier.unsubscribe(this, i.propertyName), (i = i.next);
          (this.last = null), (this.needsRefresh = this.needsQueue = this.isAsync);
        }
      }
      watch(i, s) {
        let l = this.last,
          p = d(i),
          v = l === null ? this.first : {};
        if (((v.propertySource = i), (v.propertyName = s), (v.notifier = p), p.subscribe(this, s), l !== null)) {
          if (!this.needsRefresh) {
            let b;
            (n = void 0), (b = l.propertySource[l.propertyName]), (n = this), i === b && (this.needsRefresh = !0);
          }
          l.next = v;
        }
        this.last = v;
      }
      handleChange() {
        this.needsQueue ? ((this.needsQueue = !1), o(this)) : this.isAsync || this.call();
      }
      call() {
        this.last !== null && ((this.needsQueue = this.isAsync), this.notify(this));
      }
      *records() {
        let i = this.first;
        for (; i !== void 0; ) yield i, (i = i.next);
      }
    }
    return (
      Te(h),
      Object.freeze({
        setArrayObserverFactory(r) {
          a = r;
        },
        getNotifier: d,
        track(r, i) {
          n && n.watch(r, i);
        },
        trackVolatile() {
          n && (n.needsRefresh = !0);
        },
        notify(r, i) {
          d(r).notify(i);
        },
        defineProperty(r, i) {
          ye(i) && (i = new c(i)),
            u(r).push(i),
            Reflect.defineProperty(r, i.name, {
              enumerable: !0,
              get() {
                return i.getValue(this);
              },
              set(s) {
                i.setValue(this, s);
              },
            });
        },
        getAccessors: u,
        binding(r, i, s = this.isVolatileBinding(r)) {
          return new h(r, i, s);
        },
        isVolatileBinding(r) {
          return e.test(r.toString());
        },
      })
    );
  });
function P(o, e) {
  U.defineProperty(o, e);
}
var ea = oe.getById(rt.contextEvent, () => {
    let o = null;
    return {
      get() {
        return o;
      },
      set(e) {
        o = e;
      },
    };
  }),
  Qe = Object.freeze({
    default: {
      index: 0,
      length: 0,
      get event() {
        return Qe.getEvent();
      },
      eventDetail() {
        return this.event.detail;
      },
      eventTarget() {
        return this.event.target;
      },
    },
    getEvent() {
      return ea.get();
    },
    setEvent(o) {
      ea.set(o);
    },
  });
var De = class {
    constructor(e, t, n) {
      (this.index = e), (this.removed = t), (this.addedCount = n);
    }
    adjustTo(e) {
      let t = this.index,
        n = e.length;
      return (
        t > n ? (t = n - this.addedCount) : t < 0 && (t = n + this.removed.length + t - this.addedCount),
        (this.index = t < 0 ? 0 : t),
        this
      );
    }
  },
  cr = class {
    constructor(e) {
      this.sorted = e;
    }
  },
  _i = Object.freeze({ reset: 1, splice: 2, optimized: 3 }),
  oa = new De(0, yt, 0);
oa.reset = !0;
var ra = [oa];
function ji(o, e, t, n, a, d) {
  let u = d - a + 1,
    c = t - e + 1,
    h = new Array(u),
    r,
    i;
  for (let s = 0; s < u; ++s) (h[s] = new Array(c)), (h[s][0] = s);
  for (let s = 0; s < c; ++s) h[0][s] = s;
  for (let s = 1; s < u; ++s)
    for (let l = 1; l < c; ++l)
      o[e + l - 1] === n[a + s - 1]
        ? (h[s][l] = h[s - 1][l - 1])
        : ((r = h[s - 1][l] + 1), (i = h[s][l - 1] + 1), (h[s][l] = r < i ? r : i));
  return h;
}
function Gi(o) {
  let e = o.length - 1,
    t = o[0].length - 1,
    n = o[e][t],
    a = [];
  for (; e > 0 || t > 0; ) {
    if (e === 0) {
      a.push(2), t--;
      continue;
    }
    if (t === 0) {
      a.push(3), e--;
      continue;
    }
    let d = o[e - 1][t - 1],
      u = o[e - 1][t],
      c = o[e][t - 1],
      h;
    u < c ? (h = u < d ? u : d) : (h = c < d ? c : d),
      h === d
        ? (d === n ? a.push(0) : (a.push(1), (n = d)), e--, t--)
        : h === u
          ? (a.push(3), e--, (n = u))
          : (a.push(2), t--, (n = c));
  }
  return a.reverse();
}
function Vi(o, e, t) {
  for (let n = 0; n < t; ++n) if (o[n] !== e[n]) return n;
  return t;
}
function Xi(o, e, t) {
  let n = o.length,
    a = e.length,
    d = 0;
  for (; d < t && o[--n] === e[--a]; ) d++;
  return d;
}
function Ki(o, e, t, n) {
  return e < t || n < o ? -1 : e === t || n === o ? 0 : o < t ? (e < n ? e - t : n - t) : n < e ? n - o : e - o;
}
function Ui(o, e, t, n, a, d) {
  let u = 0,
    c = 0,
    h = Math.min(t - e, d - a);
  if (
    (e === 0 && a === 0 && (u = Vi(o, n, h)),
    t === o.length && d === n.length && (c = Xi(o, n, h - u)),
    (e += u),
    (a += u),
    (t -= c),
    (d -= c),
    t - e === 0 && d - a === 0)
  )
    return yt;
  if (e === t) {
    let v = new De(e, [], 0);
    for (; a < d; ) v.removed.push(n[a++]);
    return [v];
  } else if (a === d) return [new De(e, [], t - e)];
  let r = Gi(ji(o, e, t, n, a, d)),
    i = [],
    s,
    l = e,
    p = a;
  for (let v = 0; v < r.length; ++v)
    switch (r[v]) {
      case 0:
        s !== void 0 && (i.push(s), (s = void 0)), l++, p++;
        break;
      case 1:
        s === void 0 && (s = new De(l, [], 0)), s.addedCount++, l++, s.removed.push(n[p]), p++;
        break;
      case 2:
        s === void 0 && (s = new De(l, [], 0)), s.addedCount++, l++;
        break;
      case 3:
        s === void 0 && (s = new De(l, [], 0)), s.removed.push(n[p]), p++;
        break;
    }
  return s !== void 0 && i.push(s), i;
}
function qi(o, e) {
  let t = !1,
    n = 0;
  for (let a = 0; a < e.length; a++) {
    let d = e[a];
    if (((d.index += n), t)) continue;
    let u = Ki(o.index, o.index + o.removed.length, d.index, d.index + d.addedCount);
    if (u >= 0) {
      e.splice(a, 1), a--, (n -= d.addedCount - d.removed.length), (o.addedCount += d.addedCount - u);
      let c = o.removed.length + d.removed.length - u;
      if (!o.addedCount && !c) t = !0;
      else {
        let h = d.removed;
        if (o.index < d.index) {
          let r = o.removed.slice(0, d.index - o.index);
          r.push(...h), (h = r);
        }
        if (o.index + o.removed.length > d.index + d.addedCount) {
          let r = o.removed.slice(d.index + d.addedCount - o.index);
          h.push(...r);
        }
        (o.removed = h), d.index < o.index && (o.index = d.index);
      }
    } else if (o.index < d.index) {
      (t = !0), e.splice(a, 0, o), a++;
      let c = o.addedCount - o.removed.length;
      (d.index += c), (n += c);
    }
  }
  t || e.push(o);
}
function Yi(o, e) {
  let t = [],
    n = [];
  for (let a = 0, d = e.length; a < d; a++) qi(e[a], n);
  for (let a = 0, d = n.length; a < d; ++a) {
    let u = n[a];
    if (u.addedCount === 1 && u.removed.length === 1) {
      u.removed[0] !== o[u.index] && t.push(u);
      continue;
    }
    t = t.concat(Ui(o, u.index, u.index + u.addedCount, u.removed, 0, u.removed.length));
  }
  return t;
}
var hn = Object.freeze({
    support: _i.optimized,
    normalize(o, e, t) {
      return o === void 0 ? (t === void 0 ? yt : Yi(e, t)) : ra;
    },
    pop(o, e, t, n) {
      let a = o.length > 0,
        d = t.apply(o, n);
      return a && e.addSplice(new De(o.length, [d], 0)), d;
    },
    push(o, e, t, n) {
      let a = t.apply(o, n);
      return e.addSplice(new De(o.length - n.length, [], n.length).adjustTo(o)), a;
    },
    reverse(o, e, t, n) {
      let a = t.apply(o, n);
      o.sorted++;
      let d = [];
      for (let u = o.length - 1; u >= 0; u--) d.push(u);
      return e.addSort(new cr(d)), a;
    },
    shift(o, e, t, n) {
      let a = o.length > 0,
        d = t.apply(o, n);
      return a && e.addSplice(new De(0, [d], 0)), d;
    },
    sort(o, e, t, n) {
      let a = new Map();
      for (let c = 0, h = o.length; c < h; ++c) {
        let r = a.get(o[c]) || [];
        a.set(o[c], [...r, c]);
      }
      let d = t.apply(o, n);
      o.sorted++;
      let u = [];
      for (let c = 0, h = o.length; c < h; ++c) {
        let r = a.get(o[c]);
        u.push(r[0]), a.set(o[c], r.splice(1));
      }
      return e.addSort(new cr(u)), d;
    },
    splice(o, e, t, n) {
      let a = t.apply(o, n);
      return e.addSplice(new De(+n[0], a, n.length > 2 ? n.length - 2 : 0).adjustTo(o)), a;
    },
    unshift(o, e, t, n) {
      let a = t.apply(o, n);
      return e.addSplice(new De(0, [], n.length).adjustTo(o)), a;
    },
  }),
  Od = Object.freeze({
    reset: ra,
    setDefaultStrategy(o) {
      hn = o;
    },
  });
function un(o, e, t, n = !0) {
  Reflect.defineProperty(o, e, { value: t, enumerable: !1, writable: n });
}
var pn = class extends Bt {
    constructor(e) {
      super(e),
        (this.oldCollection = void 0),
        (this.splices = void 0),
        (this.sorts = void 0),
        (this.needsQueue = !0),
        (this._strategy = null),
        (this._lengthObserver = void 0),
        (this._sortObserver = void 0),
        (this.call = this.flush),
        un(e, "$fastController", this);
    }
    get strategy() {
      return this._strategy;
    }
    set strategy(e) {
      this._strategy = e;
    }
    get lengthObserver() {
      let e = this._lengthObserver;
      if (e === void 0) {
        let t = this.subject;
        (this._lengthObserver = e =
          {
            length: t.length,
            handleChange() {
              this.length !== t.length && ((this.length = t.length), U.notify(e, "length"));
            },
          }),
          this.subscribe(e);
      }
      return e;
    }
    get sortObserver() {
      let e = this._sortObserver;
      if (e === void 0) {
        let t = this.subject;
        (this._sortObserver = e =
          {
            sorted: t.sorted,
            handleChange() {
              this.sorted !== t.sorted && ((this.sorted = t.sorted), U.notify(e, "sorted"));
            },
          }),
          this.subscribe(e);
      }
      return e;
    }
    subscribe(e) {
      this.flush(), super.subscribe(e);
    }
    addSplice(e) {
      this.splices === void 0 ? (this.splices = [e]) : this.splices.push(e), this.enqueue();
    }
    addSort(e) {
      this.sorts === void 0 ? (this.sorts = [e]) : this.sorts.push(e), this.enqueue();
    }
    reset(e) {
      (this.oldCollection = e), this.enqueue();
    }
    flush() {
      var e;
      let t = this.splices,
        n = this.sorts,
        a = this.oldCollection;
      (t === void 0 && a === void 0 && n === void 0) ||
        ((this.needsQueue = !0),
        (this.splices = void 0),
        (this.sorts = void 0),
        (this.oldCollection = void 0),
        n !== void 0
          ? this.notify(n)
          : this.notify(((e = this._strategy) !== null && e !== void 0 ? e : hn).normalize(a, this.subject, t)));
    }
    enqueue() {
      this.needsQueue && ((this.needsQueue = !1), nt.enqueue(this));
    }
  },
  ta = !1,
  na = Object.freeze({
    sorted: 0,
    enable() {
      if (ta) return;
      (ta = !0), U.setArrayObserverFactory((e) => new pn(e));
      let o = Array.prototype;
      o.$fastPatch ||
        (un(o, "$fastPatch", 1),
        un(o, "sorted", 0),
        [o.pop, o.push, o.reverse, o.shift, o.sort, o.splice, o.unshift].forEach((e) => {
          o[e.name] = function (...t) {
            var n;
            let a = this.$fastController;
            return a === void 0
              ? e.apply(this, t)
              : ((n = a.strategy) !== null && n !== void 0 ? n : hn)[e.name](this, a, e, t);
          };
        }));
    },
  });
var $e = class {
  constructor(e, t, n = !1) {
    (this.evaluate = e), (this.policy = t), (this.isVolatile = n);
  }
};
var gn = class extends $e {
  createObserver(e) {
    return U.binding(this.evaluate, e, this.isVolatile);
  }
};
function wt(o, e, t = U.isVolatileBinding(o)) {
  return new gn(o, e, t);
}
var lr = class extends $e {
  createObserver() {
    return this;
  }
  bind(e) {
    return this.evaluate(e.source, e.context);
  }
};
Te(lr);
function io(o, e) {
  return new lr(o, e);
}
function vn(o) {
  return be(o) ? wt(o) : o instanceof $e ? o : io(() => o);
}
var aa;
function sa(o) {
  return o.map((e) => (e instanceof Ee ? sa(e.styles) : [e])).reduce((e, t) => e.concat(t), []);
}
var Ee = class o {
  constructor(e) {
    (this.styles = e),
      (this.targets = new WeakSet()),
      (this._strategy = null),
      (this.behaviors = e
        .map((t) => (t instanceof o ? t.behaviors : null))
        .reduce((t, n) => (n === null ? t : t === null ? n : t.concat(n)), null));
  }
  get strategy() {
    return this._strategy === null && this.withStrategy(aa), this._strategy;
  }
  addStylesTo(e) {
    this.strategy.addStylesTo(e), this.targets.add(e);
  }
  removeStylesFrom(e) {
    this.strategy.removeStylesFrom(e), this.targets.delete(e);
  }
  isAttachedTo(e) {
    return this.targets.has(e);
  }
  withBehaviors(...e) {
    return (this.behaviors = this.behaviors === null ? e : this.behaviors.concat(e)), this;
  }
  withStrategy(e) {
    return (this._strategy = new e(sa(this.styles))), this;
  }
  static setDefaultStrategy(e) {
    aa = e;
  }
  static normalize(e) {
    return e === void 0 ? void 0 : Array.isArray(e) ? new o(e) : e instanceof o ? e : new o([e]);
  }
};
Ee.supportsAdoptedStyleSheets = Array.isArray(document.adoptedStyleSheets) && "replace" in CSSStyleSheet.prototype;
var mn = ao(),
  No = Object.freeze({
    getForInstance: mn.getForInstance,
    getByType: mn.getByType,
    define(o) {
      return mn.register({ type: o }), o;
    },
  });
function fn(o, e, t) {
  e.source.style.setProperty(o.targetAspect, t.bind(e));
}
var co = class {
  constructor(e, t) {
    (this.dataBinding = e), (this.targetAspect = t);
  }
  createCSS(e) {
    return e(this), `var(${this.targetAspect})`;
  }
  addedCallback(e) {
    var t;
    let n = e.source;
    if (!n.$cssBindings) {
      n.$cssBindings = new Map();
      let d = n.setAttribute;
      n.setAttribute = (u, c) => {
        d.call(n, u, c), u === "style" && n.$cssBindings.forEach((h, r) => fn(r, h.controller, h.observer));
      };
    }
    let a =
      (t = e[this.targetAspect]) !== null && t !== void 0
        ? t
        : (e[this.targetAspect] = this.dataBinding.createObserver(this, this));
    (a.controller = e), e.source.$cssBindings.set(this, { controller: e, observer: a });
  }
  connectedCallback(e) {
    fn(this, e, e[this.targetAspect]);
  }
  removedCallback(e) {
    e.source.$cssBindings && e.source.$cssBindings.delete(this);
  }
  handleChange(e, t) {
    fn(this, t.controller, t);
  }
};
No.define(co);
var Qi = `${Math.random().toString(36).substring(2, 8)}`,
  Zi = 0,
  ia = () => `--v${Qi}${++Zi}`;
function ca(o, e) {
  let t = [],
    n = "",
    a = [],
    d = (u) => {
      a.push(u);
    };
  for (let u = 0, c = o.length - 1; u < c; ++u) {
    n += o[u];
    let h = e[u];
    be(h)
      ? (h = new co(wt(h), ia()).createCSS(d))
      : h instanceof $e
        ? (h = new co(h, ia()).createCSS(d))
        : No.getForInstance(h) !== void 0 && (h = h.createCSS(d)),
      h instanceof Ee || h instanceof CSSStyleSheet ? (n.trim() !== "" && (t.push(n), (n = "")), t.push(h)) : (n += h);
  }
  return (n += o[o.length - 1]), n.trim() !== "" && t.push(n), { styles: t, behaviors: a };
}
var R = (o, ...e) => {
    let { styles: t, behaviors: n } = ca(o, e),
      a = new Ee(t);
    return n.length ? a.withBehaviors(...n) : a;
  },
  dr = class {
    constructor(e, t) {
      (this.behaviors = t), (this.css = "");
      let n = e.reduce((a, d) => (ye(d) ? (this.css += d) : a.push(d), a), []);
      n.length && (this.styles = new Ee(n));
    }
    createCSS(e) {
      return this.behaviors.forEach(e), this.styles && e(this), this.css;
    }
    addedCallback(e) {
      e.addStyles(this.styles);
    }
    removedCallback(e) {
      e.removeStyles(this.styles);
    }
  };
No.define(dr);
R.partial = (o, ...e) => {
  let { styles: t, behaviors: n } = ca(o, e);
  return new dr(t, n);
};
var la = /fe-b\$\$start\$\$(\d+)\$\$(.+)\$\$fe-b/,
  da = /fe-b\$\$end\$\$(\d+)\$\$(.+)\$\$fe-b/,
  ua = /fe-repeat\$\$start\$\$(\d+)\$\$fe-repeat/,
  pa = /fe-repeat\$\$end\$\$(\d+)\$\$fe-repeat/,
  ha = /^(?:.{0,1000})fe-eb\$\$start\$\$(.+?)\$\$fe-eb/,
  ga = /fe-eb\$\$end\$\$(.{0,1000})\$\$fe-eb(?:.{0,1000})$/;
function va(o) {
  return o && o.nodeType === Node.COMMENT_NODE;
}
var he = Object.freeze({
  attributeMarkerName: "data-fe-b",
  compactAttributeMarkerName: "data-fe-c",
  attributeBindingSeparator: " ",
  contentBindingStartMarker(o, e) {
    return `fe-b$$start$$${o}$$${e}$$fe-b`;
  },
  contentBindingEndMarker(o, e) {
    return `fe-b$$end$$${o}$$${e}$$fe-b`;
  },
  repeatStartMarker(o) {
    return `fe-repeat$$start$$${o}$$fe-repeat`;
  },
  repeatEndMarker(o) {
    return `fe-repeat$$end$$${o}$$fe-repeat`;
  },
  isContentBindingStartMarker(o) {
    return la.test(o);
  },
  isContentBindingEndMarker(o) {
    return da.test(o);
  },
  isRepeatViewStartMarker(o) {
    return ua.test(o);
  },
  isRepeatViewEndMarker(o) {
    return pa.test(o);
  },
  isElementBoundaryStartMarker(o) {
    return va(o) && ha.test(o.data.trim());
  },
  isElementBoundaryEndMarker(o) {
    return va(o) && ga.test(o.data);
  },
  parseAttributeBinding(o) {
    let e = o.getAttribute(this.attributeMarkerName);
    return e === null ? e : e.split(this.attributeBindingSeparator).map((t) => parseInt(t));
  },
  parseEnumeratedAttributeBinding(o) {
    let e = [],
      t = this.attributeMarkerName.length + 1,
      n = `${this.attributeMarkerName}-`;
    for (let a of o.getAttributeNames())
      if (a.startsWith(n)) {
        let d = Number(a.slice(t));
        if (!Number.isNaN(d)) e.push(d);
        else throw oe.error(1601, { name: a, expectedFormat: `${n}<number>` });
      }
    return e.length === 0 ? null : e;
  },
  parseCompactAttributeBinding(o) {
    let e = `${this.compactAttributeMarkerName}-`,
      t = o.getAttributeNames().find((h) => h.startsWith(e));
    if (!t) return null;
    let a = t.slice(e.length).split("-"),
      d = parseInt(a[0], 10),
      u = parseInt(a[1], 10);
    if (a.length !== 2 || Number.isNaN(d) || Number.isNaN(u) || d < 0 || u < 1)
      throw oe.error(1604, { name: t, expectedFormat: `${this.compactAttributeMarkerName}-{index}-{count}` });
    let c = [];
    for (let h = 0; h < u; h++) c.push(d + h);
    return c;
  },
  parseContentBindingStartMarker(o) {
    return xa(la, o);
  },
  parseContentBindingEndMarker(o) {
    return xa(da, o);
  },
  parseRepeatStartMarker(o) {
    return ma(ua, o);
  },
  parseRepeatEndMarker(o) {
    return ma(pa, o);
  },
  parseElementBoundaryStartMarker(o) {
    return fa(ha, o.trim());
  },
  parseElementBoundaryEndMarker(o) {
    return fa(ga, o);
  },
});
function ma(o, e) {
  let t = o.exec(e);
  return t === null ? t : parseInt(t[1]);
}
function fa(o, e) {
  let t = o.exec(e);
  return t === null ? t : t[1];
}
function xa(o, e) {
  let t = o.exec(e);
  return t === null ? t : [parseInt(t[1]), t[2]];
}
var Eo = Symbol.for("fe-hydration");
function ht(o) {
  return o[Eo] === Eo;
}
var Lo = "defer-hydration";
var xn = `fast-${Math.random().toString(36).substring(2, 8)}`,
  ur = `${xn}{`,
  To = `}${xn}`,
  Ji = To.length,
  ec = 0,
  Ct = () => `${xn}-${++ec}`,
  lo = Object.freeze({
    interpolation: (o) => `${ur}${o}${To}`,
    attribute: (o) => `${Ct()}="${ur}${o}${To}"`,
    comment: (o) => `<!--${ur}${o}${To}-->`,
  }),
  Do = Object.freeze({
    parse(o, e) {
      let t = o.split(ur);
      if (t.length === 1) return null;
      let n = [];
      for (let a = 0, d = t.length; a < d; ++a) {
        let u = t[a],
          c = u.indexOf(To),
          h;
        if (c === -1) h = u;
        else {
          let r = u.substring(0, c);
          n.push(e[r]), (h = u.substring(c + Ji));
        }
        h !== "" && n.push(h);
      }
      return n;
    },
  });
var bn = ao(),
  ke = Object.freeze({
    getForInstance: bn.getForInstance,
    getByType: bn.getByType,
    define(o, e) {
      return (e = e || {}), (e.type = o), bn.register(e), o;
    },
    assignAspect(o, e) {
      if (!e) {
        o.aspectType = pe.content;
        return;
      }
      switch (((o.sourceAspect = e), e[0])) {
        case ":":
          (o.targetAspect = e.substring(1)),
            (o.aspectType = o.targetAspect === "classList" ? pe.tokenList : pe.property);
          break;
        case "?":
          (o.targetAspect = e.substring(1)), (o.aspectType = pe.booleanAttribute);
          break;
        case "@":
          (o.targetAspect = e.substring(1)), (o.aspectType = pe.event);
          break;
        default:
          (o.targetAspect = e), (o.aspectType = pe.attribute);
          break;
      }
    },
  });
var _t = class {
  constructor(e) {
    this.options = e;
  }
  createHTML(e) {
    return lo.attribute(e(this));
  }
  createBehavior() {
    return this;
  }
};
Te(_t);
var Ho = class extends Error {
  constructor(e, t, n) {
    super(e), (this.factories = t), (this.node = n);
  }
};
function kn(o) {
  return o.nodeType === Node.COMMENT_NODE;
}
function ba(o) {
  return o.nodeType === Node.TEXT_NODE;
}
function Sn(o, e) {
  let t = document.createRange();
  return t.setStart(o, 0), t.setEnd(e, kn(e) || ba(e) ? e.data.length : e.childNodes.length), t;
}
function tc(o) {
  return o instanceof DocumentFragment && "mode" in o;
}
function ka(o, e, t) {
  let n = Sn(o, e),
    a = n.commonAncestorContainer,
    d = ac(t),
    u = document.createTreeWalker(a, NodeFilter.SHOW_ELEMENT + NodeFilter.SHOW_COMMENT + NodeFilter.SHOW_TEXT, {
      acceptNode(i) {
        return n.comparePoint(i, 0) === 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    }),
    c = {},
    h = {},
    r = (u.currentNode = o);
  for (; r !== null; ) {
    switch (r.nodeType) {
      case Node.ELEMENT_NODE: {
        oc(r, t, c, d);
        break;
      }
      case Node.COMMENT_NODE: {
        rc(r, u, t, c, h, d);
        break;
      }
    }
    r = u.nextNode();
  }
  return n.detach(), { targets: c, boundaries: h };
}
function oc(o, e, t, n) {
  var a, d;
  let u =
    (d = (a = he.parseAttributeBinding(o)) !== null && a !== void 0 ? a : he.parseEnumeratedAttributeBinding(o)) !==
      null && d !== void 0
      ? d
      : he.parseCompactAttributeBinding(o);
  if (u !== null) {
    for (let c of u) {
      let h = e[c + n];
      if (!h)
        throw new Ho(
          `HydrationView was unable to successfully target factory on ${o.nodeName} inside ${o.getRootNode().host.nodeName}. This likely indicates a template mismatch between SSR rendering and hydration.`,
          e,
          o
        );
      Fo(h, o, t);
    }
    o.removeAttribute(he.attributeMarkerName);
  }
}
function rc(o, e, t, n, a, d) {
  if (he.isElementBoundaryStartMarker(o)) {
    nc(o, e);
    return;
  }
  if (he.isContentBindingStartMarker(o.data)) {
    let u = he.parseContentBindingStartMarker(o.data);
    if (u === null) return;
    let [c, h] = u,
      r = t[c + d],
      i = [],
      s = e.nextSibling();
    o.data = "";
    let l = s;
    for (; s !== null; ) {
      if (kn(s)) {
        let p = he.parseContentBindingEndMarker(s.data);
        if (p && p[1] === h) break;
      }
      i.push(s), (s = e.nextSibling());
    }
    if (s === null) {
      let p = o.getRootNode();
      throw new Error(`Error hydrating Comment node inside "${tc(p) ? p.host.nodeName : p.nodeName}".`);
    }
    if (((s.data = ""), i.length === 1 && ba(i[0]))) Fo(r, i[0], n);
    else {
      s !== l && s.previousSibling !== null && (a[r.targetNodeId] = { first: l, last: s.previousSibling });
      let p = s.parentNode.insertBefore(document.createTextNode(""), s);
      Fo(r, p, n);
    }
  }
}
function nc(o, e) {
  let t = he.parseElementBoundaryStartMarker(o.data),
    n = e.nextSibling();
  for (; n !== null; ) {
    if (kn(n)) {
      let a = he.parseElementBoundaryEndMarker(n.data);
      if (a && a === t) break;
    }
    n = e.nextSibling();
  }
}
function ac(o) {
  let e = 0;
  for (let t = 0, n = o.length; t < n && o[t].targetNodeId === "h"; ++t) e++;
  return e;
}
function Fo(o, e, t) {
  if (o.targetNodeId === void 0) throw new Error("Factory could not be target to the node");
  t[o.targetNodeId] = e;
}
var Sa;
function yn(o, e) {
  let t = o.parentNode,
    n = o,
    a;
  for (; n !== e; ) {
    if (((a = n.nextSibling), !a))
      throw new Error(`Unmatched first/last child inside "${e.getRootNode().host.nodeName}".`);
    t.removeChild(n), (n = a);
  }
  t.removeChild(e);
}
var pr = class {
    constructor() {
      (this.index = 0), (this.length = 0);
    }
    get event() {
      return Qe.getEvent();
    }
    get isEven() {
      return this.index % 2 === 0;
    }
    get isOdd() {
      return this.index % 2 !== 0;
    }
    get isFirst() {
      return this.index === 0;
    }
    get isInMiddle() {
      return !this.isFirst && !this.isLast;
    }
    get isLast() {
      return this.index === this.length - 1;
    }
    eventDetail() {
      return this.event.detail;
    }
    eventTarget() {
      return this.event.target;
    }
  },
  vt = class extends pr {
    constructor(e, t, n) {
      super(),
        (this.fragment = e),
        (this.factories = t),
        (this.targets = n),
        (this.behaviors = null),
        (this.unbindables = []),
        (this.source = null),
        (this.isBound = !1),
        (this.sourceLifetime = zt.unknown),
        (this.context = this),
        (this.firstChild = e.firstChild),
        (this.lastChild = e.lastChild);
    }
    appendTo(e) {
      e.appendChild(this.fragment);
    }
    insertBefore(e) {
      if (this.fragment.hasChildNodes()) e.parentNode.insertBefore(this.fragment, e);
      else {
        let t = this.lastChild;
        if (e.previousSibling === t) return;
        let n = e.parentNode,
          a = this.firstChild,
          d;
        for (; a !== t; ) (d = a.nextSibling), n.insertBefore(a, e), (a = d);
        n.insertBefore(t, e);
      }
    }
    remove() {
      let e = this.fragment,
        t = this.lastChild,
        n = this.firstChild,
        a;
      for (; n !== t; ) (a = n.nextSibling), e.appendChild(n), (n = a);
      e.appendChild(t);
    }
    dispose() {
      yn(this.firstChild, this.lastChild), this.unbind();
    }
    onUnbind(e) {
      this.unbindables.push(e);
    }
    bind(e, t = this) {
      if (this.source === e) return;
      let n = this.behaviors;
      if (n === null) {
        (this.source = e), (this.context = t), (this.behaviors = n = new Array(this.factories.length));
        let a = this.factories;
        for (let d = 0, u = a.length; d < u; ++d) {
          let c = a[d].createBehavior();
          c.bind(this), (n[d] = c);
        }
      } else {
        this.source !== null && this.evaluateUnbindables(), (this.isBound = !1), (this.source = e), (this.context = t);
        for (let a = 0, d = n.length; a < d; ++a) n[a].bind(this);
      }
      this.isBound = !0;
    }
    unbind() {
      !this.isBound ||
        this.source === null ||
        (this.evaluateUnbindables(), (this.source = null), (this.context = this), (this.isBound = !1));
    }
    evaluateUnbindables() {
      let e = this.unbindables;
      for (let t = 0, n = e.length; t < n; ++t) e[t].unbind(this);
      e.length = 0;
    }
    static disposeContiguousBatch(e) {
      if (e.length !== 0) {
        yn(e[0].firstChild, e[e.length - 1].lastChild);
        for (let t = 0, n = e.length; t < n; ++t) e[t].unbind();
      }
    }
  };
Te(vt);
U.defineProperty(vt.prototype, "index");
U.defineProperty(vt.prototype, "length");
var gt = { unhydrated: "unhydrated", hydrating: "hydrating", hydrated: "hydrated" },
  Bn = class extends Error {
    constructor(e, t, n, a) {
      super(e), (this.factory = t), (this.fragment = n), (this.templateString = a);
    }
  },
  wn = class extends pr {
    constructor(e, t, n, a) {
      super(),
        (this.firstChild = e),
        (this.lastChild = t),
        (this.sourceTemplate = n),
        (this.hostBindingTarget = a),
        (this[Sa] = Eo),
        (this.context = this),
        (this.source = null),
        (this.isBound = !1),
        (this.sourceLifetime = zt.unknown),
        (this.unbindables = []),
        (this.fragment = null),
        (this.behaviors = null),
        (this._hydrationStage = gt.unhydrated),
        (this._bindingViewBoundaries = {}),
        (this._targets = {}),
        (this.factories = n.compile().factories);
    }
    get hydrationStage() {
      return this._hydrationStage;
    }
    get targets() {
      return this._targets;
    }
    get bindingViewBoundaries() {
      return this._bindingViewBoundaries;
    }
    insertBefore(e) {
      if (this.fragment !== null)
        if (this.fragment.hasChildNodes()) e.parentNode.insertBefore(this.fragment, e);
        else {
          let t = this.lastChild;
          if (e.previousSibling === t) return;
          let n = e.parentNode,
            a = this.firstChild,
            d;
          for (; a !== t; ) (d = a.nextSibling), n.insertBefore(a, e), (a = d);
          n.insertBefore(t, e);
        }
    }
    appendTo(e) {
      this.fragment !== null && e.appendChild(this.fragment);
    }
    remove() {
      let e = this.fragment || (this.fragment = document.createDocumentFragment()),
        t = this.lastChild,
        n = this.firstChild,
        a;
      for (; n !== t; ) {
        if (((a = n.nextSibling), !a))
          throw new Error(`Unmatched first/last child inside "${t.getRootNode().host.nodeName}".`);
        e.appendChild(n), (n = a);
      }
      e.appendChild(t);
    }
    bind(e, t = this) {
      var n;
      if ((this.hydrationStage !== gt.hydrated && (this._hydrationStage = gt.hydrating), this.source === e)) return;
      let a = this.behaviors;
      if (a === null) {
        (this.source = e), (this.context = t);
        try {
          let { targets: u, boundaries: c } = ka(this.firstChild, this.lastChild, this.factories);
          (this._targets = u), (this._bindingViewBoundaries = c);
        } catch (u) {
          if (u instanceof Ho) {
            let c = this.sourceTemplate.html;
            typeof c != "string" && (c = c.innerHTML), (u.templateString = c);
          }
          throw u;
        }
        this.behaviors = a = new Array(this.factories.length);
        let d = this.factories;
        for (let u = 0, c = d.length; u < c; ++u) {
          let h = d[u];
          if (
            (h.targetNodeId === "h" && this.hostBindingTarget && Fo(h, this.hostBindingTarget, this._targets),
            h.targetNodeId in this.targets)
          ) {
            let r = h.createBehavior();
            r.bind(this), (a[u] = r);
          } else {
            let r = this.sourceTemplate.html;
            typeof r != "string" && (r = r.innerHTML);
            let i = ((n = this.firstChild) === null || n === void 0 ? void 0 : n.getRootNode()).host,
              s = i?.nodeName || "unknown",
              l = h,
              p = [
                `HydrationView was unable to successfully target bindings inside "<${s.toLowerCase()}>".`,
                `
Mismatch Details:`,
                `  - Expected target node ID: "${h.targetNodeId}"`,
                `  - Available target IDs: [${Object.keys(this.targets).join(", ") || "none"}]`,
              ];
            throw (
              (h.targetTagName && p.push(`  - Expected tag name: "${h.targetTagName}"`),
              l.sourceAspect && p.push(`  - Source aspect: "${l.sourceAspect}"`),
              l.aspectType !== void 0 && p.push(`  - Aspect type: ${l.aspectType}`),
              p.push(
                `
This usually means:`,
                "  1. The server-rendered HTML doesn't match the client template",
                "  2. The hydration markers are missing or corrupted",
                "  3. The DOM structure was modified before hydration",
                `
Template: ${r.slice(0, 200)}${r.length > 200 ? "..." : ""}`
              ),
              new Bn(
                p.join(`
`),
                h,
                Sn(this.firstChild, this.lastChild).cloneContents(),
                r
              ))
            );
          }
        }
      } else {
        this.source !== null && this.evaluateUnbindables(), (this.isBound = !1), (this.source = e), (this.context = t);
        for (let d = 0, u = a.length; d < u; ++d) a[d].bind(this);
      }
      (this.isBound = !0), (this._hydrationStage = gt.hydrated);
    }
    unbind() {
      !this.isBound ||
        this.source === null ||
        (this.evaluateUnbindables(), (this.source = null), (this.context = this), (this.isBound = !1));
    }
    dispose() {
      yn(this.firstChild, this.lastChild), this.unbind();
    }
    onUnbind(e) {
      this.unbindables.push(e);
    }
    evaluateUnbindables() {
      let e = this.unbindables;
      for (let t = 0, n = e.length; t < n; ++t) e[t].unbind(this);
      e.length = 0;
    }
  };
Sa = Eo;
Te(wn);
function sc(o) {
  return o.create !== void 0;
}
function ic(o, e, t, n) {
  if ((t == null && (t = ""), sc(t))) {
    o.textContent = "";
    let a = o.$fastView;
    if (a === void 0)
      if (ht(n) && ht(t) && n.bindingViewBoundaries[this.targetNodeId] !== void 0 && n.hydrationStage !== gt.hydrated) {
        let d = n.bindingViewBoundaries[this.targetNodeId];
        a = t.hydrate(d.first, d.last);
      } else a = t.create();
    else o.$fastTemplate !== t && (a.isComposed && (a.remove(), a.unbind()), (a = t.create()));
    a.isComposed
      ? a.needsBindOnly && ((a.needsBindOnly = !1), a.bind(n.source, n.context))
      : ((a.isComposed = !0), a.bind(n.source, n.context), a.insertBefore(o), (o.$fastView = a), (o.$fastTemplate = t));
  } else {
    let a = o.$fastView;
    a !== void 0 &&
      a.isComposed &&
      ((a.isComposed = !1), a.remove(), a.needsBindOnly ? (a.needsBindOnly = !1) : a.unbind()),
      (o.textContent = t);
  }
}
function cc(o, e, t) {
  var n;
  let a = `${this.id}-t`,
    d = (n = o[a]) !== null && n !== void 0 ? n : (o[a] = { v: 0, cv: Object.create(null) }),
    u = d.cv,
    c = d.v,
    h = o[e];
  if (t != null && t.length) {
    let r = t.split(/\s+/);
    for (let i = 0, s = r.length; i < s; ++i) {
      let l = r[i];
      l !== "" && ((u[l] = c), h.add(l));
    }
  }
  if (((d.v = c + 1), c !== 0)) {
    c -= 1;
    for (let r in u) u[r] === c && h.remove(r);
  }
}
var lc = {
    [pe.attribute]: Ye.setAttribute,
    [pe.booleanAttribute]: Ye.setBooleanAttribute,
    [pe.property]: (o, e, t) => (o[e] = t),
    [pe.content]: ic,
    [pe.tokenList]: cc,
    [pe.event]: () => {},
  },
  at = class {
    constructor(e) {
      (this.dataBinding = e), (this.updateTarget = null), (this.aspectType = pe.content);
    }
    createHTML(e) {
      return lo.interpolation(e(this));
    }
    createBehavior() {
      var e;
      if (this.updateTarget === null) {
        let t = lc[this.aspectType],
          n = (e = this.dataBinding.policy) !== null && e !== void 0 ? e : this.policy;
        if (!t) throw oe.error(1205);
        (this.data = `${this.id}-d`),
          (this.updateTarget = n.protect(this.targetTagName, this.aspectType, this.targetAspect, t));
      }
      return this;
    }
    bind(e) {
      var t;
      let n = e.targets[this.targetNodeId],
        a = ht(e) && e.hydrationStage && e.hydrationStage !== gt.hydrated;
      switch (this.aspectType) {
        case pe.event:
          (n[this.data] = e), n.addEventListener(this.targetAspect, this, this.dataBinding.options);
          break;
        case pe.content:
          e.onUnbind(this);
        default:
          let d =
            (t = n[this.data]) !== null && t !== void 0
              ? t
              : (n[this.data] = this.dataBinding.createObserver(this, this));
          if (
            ((d.target = n),
            (d.controller = e),
            a && (this.aspectType === pe.attribute || this.aspectType === pe.booleanAttribute))
          ) {
            d.bind(e);
            break;
          }
          this.updateTarget(n, this.targetAspect, d.bind(e), e);
          break;
      }
    }
    unbind(e) {
      let n = e.targets[this.targetNodeId].$fastView;
      n !== void 0 && n.isComposed && (n.unbind(), (n.needsBindOnly = !0));
    }
    handleEvent(e) {
      let t = e.currentTarget[this.data];
      if (t.isBound) {
        Qe.setEvent(e);
        let n = this.dataBinding.evaluate(t.source, t.context);
        Qe.setEvent(null), n !== !0 && e.preventDefault();
      }
    }
    handleChange(e, t) {
      let n = t.target,
        a = t.controller;
      this.updateTarget(n, this.targetAspect, t.bind(a), a);
    }
  };
ke.define(at, { aspected: !0 });
var Ca = (o, e) => `${o}.${e}`,
  ya = {},
  st = { index: 0, node: null };
function Ba(o) {
  o.startsWith("fast-") || oe.warn(1204, { name: o });
}
var dc = new Proxy(document.createElement("div"), {
    get(o, e) {
      Ba(e);
      let t = Reflect.get(o, e);
      return be(t) ? t.bind(o) : t;
    },
    set(o, e, t) {
      return Ba(e), Reflect.set(o, e, t);
    },
  }),
  Cn = class {
    constructor(e, t, n) {
      (this.fragment = e),
        (this.directives = t),
        (this.policy = n),
        (this.proto = null),
        (this.nodeIds = new Set()),
        (this.descriptors = {}),
        (this.factories = []);
    }
    addFactory(e, t, n, a, d) {
      var u, c;
      this.nodeIds.has(n) || (this.nodeIds.add(n), this.addTargetDescriptor(t, n, a)),
        (e.id = (u = e.id) !== null && u !== void 0 ? u : Ct()),
        (e.targetNodeId = n),
        (e.targetTagName = d),
        (e.policy = (c = e.policy) !== null && c !== void 0 ? c : this.policy),
        this.factories.push(e);
    }
    freeze() {
      return (this.proto = Object.create(null, this.descriptors)), this;
    }
    addTargetDescriptor(e, t, n) {
      let a = this.descriptors;
      if (t === "r" || t === "h" || a[t]) return;
      if (!a[e]) {
        let u = e.lastIndexOf("."),
          c = e.substring(0, u),
          h = parseInt(e.substring(u + 1));
        this.addTargetDescriptor(c, e, h);
      }
      let d = ya[t];
      if (!d) {
        let u = `_${t}`;
        ya[t] = d = {
          get() {
            var c;
            return (c = this[u]) !== null && c !== void 0 ? c : (this[u] = this[e].childNodes[n]);
          },
        };
      }
      a[t] = d;
    }
    createView(e) {
      let t = this.fragment.cloneNode(!0),
        n = Object.create(this.proto);
      (n.r = t), (n.h = e ?? dc);
      for (let a of this.nodeIds) n[a];
      return new vt(t, this.factories, n);
    }
  };
function Pa(o, e, t, n, a, d = !1) {
  let u = t.attributes,
    c = o.directives;
  for (let h = 0, r = u.length; h < r; ++h) {
    let i = u[h],
      s = i.value,
      l = Do.parse(s, c),
      p = null;
    l === null
      ? d && ((p = new at(io(() => s, o.policy))), ke.assignAspect(p, i.name))
      : (p = hr.aggregate(l, o.policy)),
      p !== null && (t.removeAttributeNode(i), h--, r--, o.addFactory(p, e, n, a, t.tagName));
  }
}
function uc(o, e, t, n, a) {
  let d = Do.parse(e.textContent, o.directives);
  if (d === null) return (st.node = e.nextSibling), (st.index = a + 1), st;
  let u,
    c = (u = e);
  for (let h = 0, r = d.length; h < r; ++h) {
    let i = d[h];
    h !== 0 && (a++, (n = Ca(t, a)), (u = c.parentNode.insertBefore(document.createTextNode(""), c.nextSibling))),
      ye(i) ? (u.textContent = i) : ((u.textContent = " "), ke.assignAspect(i), o.addFactory(i, t, n, a, null)),
      (c = u);
  }
  return (st.index = a + 1), (st.node = c.nextSibling), st;
}
function Na(o, e, t) {
  let n = 0,
    a = e.firstChild;
  for (; a; ) {
    let d = pc(o, t, a, n);
    (a = d.node), (n = d.index);
  }
}
function pc(o, e, t, n) {
  let a = Ca(e, n);
  switch (t.nodeType) {
    case 1:
      Pa(o, e, t, a, n), Na(o, t, a);
      break;
    case 3:
      return uc(o, t, e, a, n);
    case 8:
      let d = Do.parse(t.data, o.directives);
      d !== null && o.addFactory(hr.aggregate(d), e, a, n, null);
      break;
  }
  return (st.index = n + 1), (st.node = t.nextSibling), st;
}
function hc(o, e) {
  return o && o.nodeType == 8 && Do.parse(o.data, e) !== null;
}
var wa = "TEMPLATE",
  hr = {
    compile(o, e, t = Ye.policy) {
      let n;
      if (ye(o)) {
        (n = document.createElement(wa)), (n.innerHTML = t.createHTML(o));
        let u = n.content.firstElementChild;
        u !== null && u.tagName === wa && (n = u);
      } else n = o;
      !n.content.firstChild && !n.content.lastChild && n.content.appendChild(document.createComment(""));
      let a = document.adoptNode(n.content),
        d = new Cn(a, e, t);
      return (
        Pa(d, "", n, "h", 0, !0),
        (hc(a.firstChild, e) || (a.childNodes.length === 1 && Object.keys(e).length > 0)) &&
          a.insertBefore(document.createComment(""), a.firstChild),
        Na(d, a, "r"),
        (st.node = null),
        d.freeze()
      );
    },
    setDefaultStrategy(o) {
      this.compile = o;
    },
    aggregate(o, e = Ye.policy) {
      if (o.length === 1) return o[0];
      let t,
        n = !1,
        a,
        d = o.length,
        u = o.map((r) =>
          ye(r)
            ? () => r
            : ((t = r.sourceAspect || t),
              (n = n || r.dataBinding.isVolatile),
              (a = a || r.dataBinding.policy),
              r.dataBinding.evaluate)
        ),
        c = (r, i) => {
          let s = "";
          for (let l = 0; l < d; ++l) s += u[l](r, i);
          return s;
        },
        h = new at(wt(c, a ?? e, n));
      return ke.assignAspect(h, t), h;
    },
  };
var gc =
    /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/,
  vc = Object.create(null),
  Ze = class {
    constructor(e, t = vc) {
      (this.html = e), (this.factories = t);
    }
    createHTML(e) {
      let t = this.factories;
      for (let n in t) e(t[n]);
      return this.html;
    }
  };
Ze.empty = new Ze("");
ke.define(Ze);
function mc(o, e, t, n = ke.getForInstance(o)) {
  if (n.aspected) {
    let a = gc.exec(e);
    a !== null && ke.assignAspect(o, a[2]);
  }
  return o.createHTML(t);
}
var Io = class o {
  constructor(e, t = {}, n) {
    (this.policy = n), (this.result = null), (this.html = e), (this.factories = t);
  }
  compile() {
    return this.result === null && (this.result = hr.compile(this.html, this.factories, this.policy)), this.result;
  }
  create(e) {
    return this.compile().createView(e);
  }
  inline() {
    return new Ze(ye(this.html) ? this.html : this.html.innerHTML, this.factories);
  }
  withPolicy(e) {
    if (this.result) throw oe.error(1208);
    if (this.policy) throw oe.error(1207);
    return (this.policy = e), this;
  }
  render(e, t, n) {
    let a = this.create(n);
    return a.bind(e), a.appendTo(t), a;
  }
  static create(e, t, n) {
    let a = "",
      d = Object.create(null),
      u = (c) => {
        var h;
        let r = (h = c.id) !== null && h !== void 0 ? h : (c.id = Ct());
        return (d[r] = c), r;
      };
    for (let c = 0, h = e.length - 1; c < h; ++c) {
      let r = e[c],
        i = t[c],
        s;
      if (((a += r), be(i))) i = new at(wt(i));
      else if (i instanceof $e) i = new at(i);
      else if (!(s = ke.getForInstance(i))) {
        let l = i;
        i = new at(io(() => l));
      }
      a += mc(i, r, u, s);
    }
    return new o(a + e[e.length - 1], d, n);
  }
};
Te(Io);
var y = (o, ...e) => {
  if (Array.isArray(o) && Array.isArray(o.raw)) return Io.create(o, e);
  throw oe.error(1206);
};
y.partial = (o) => new Ze(o);
var Oo = class extends _t {
  bind(e) {
    e.source[this.options] = e.targets[this.targetNodeId];
  }
};
ke.define(Oo);
var we = (o) => new Oo(o);
var fc = () => null;
function Ea(o) {
  return o === void 0 ? fc : be(o) ? o : () => o;
}
function j(o, e, t) {
  let n = be(o) ? o : () => o,
    a = Ea(e),
    d = Ea(t);
  return (u, c) => (n(u, c) ? a(u, c) : d(u, c));
}
var La = Object.freeze({ positioning: !1, recycle: !0 });
function xc(o, e, t, n) {
  (o.context.parent = n.source), (o.context.parentContext = n.context), o.bind(e[t]);
}
function bc(o, e, t, n) {
  (o.context.parent = n.source),
    (o.context.parentContext = n.context),
    (o.context.length = e.length),
    (o.context.index = t),
    o.bind(e[t]);
}
function Ta(o) {
  return o.nodeType === Node.COMMENT_NODE;
}
var gr = class extends Error {
    constructor(e, t) {
      super(e), (this.propertyBag = t);
    }
  },
  vr = class {
    constructor(e) {
      (this.directive = e),
        (this.items = null),
        (this.itemsObserver = null),
        (this.bindView = xc),
        (this.views = []),
        (this.itemsBindingObserver = e.dataBinding.createObserver(this, e)),
        (this.templateBindingObserver = e.templateBinding.createObserver(this, e)),
        e.options.positioning && (this.bindView = bc);
    }
    bind(e) {
      (this.location = e.targets[this.directive.targetNodeId]),
        (this.controller = e),
        (this.items = this.itemsBindingObserver.bind(e)),
        (this.template = this.templateBindingObserver.bind(e)),
        this.observeItems(!0),
        ht(this.template) && ht(e) && e.hydrationStage !== gt.hydrated
          ? this.hydrateViews(this.template)
          : this.refreshAllViews(),
        e.onUnbind(this);
    }
    unbind() {
      this.itemsObserver !== null && this.itemsObserver.unsubscribe(this), this.unbindAllViews();
    }
    handleChange(e, t) {
      if (t === this.itemsBindingObserver)
        (this.items = this.itemsBindingObserver.bind(this.controller)), this.observeItems(), this.refreshAllViews();
      else if (t === this.templateBindingObserver)
        (this.template = this.templateBindingObserver.bind(this.controller)), this.refreshAllViews(!0);
      else if (t[0])
        t[0].reset ? this.refreshAllViews() : t[0].sorted ? this.updateSortedViews(t) : this.updateSplicedViews(t);
      else return;
    }
    observeItems(e = !1) {
      if (!this.items) {
        this.items = yt;
        return;
      }
      let t = this.itemsObserver,
        n = (this.itemsObserver = U.getNotifier(this.items)),
        a = t !== n;
      a && t !== null && t.unsubscribe(this), (a || e) && n.subscribe(this);
    }
    updateSortedViews(e) {
      let t = this.views;
      for (let n = 0, a = e.length; n < a; ++n) {
        let d = e[n].sorted.slice(),
          u = d.slice().sort();
        for (let c = 0, h = d.length; c < h; ++c) {
          let r = d.find((i) => d[c] === u[i]);
          if (r !== c) {
            let i = u.splice(r, 1);
            u.splice(c, 0, ...i);
            let s = t[c],
              l = s ? s.firstChild : this.location;
            t[r].remove(), t[r].insertBefore(l);
            let p = t.splice(r, 1);
            t.splice(c, 0, ...p);
          }
        }
      }
    }
    updateSplicedViews(e) {
      let t = this.views,
        n = this.bindView,
        a = this.items,
        d = this.template,
        u = this.controller,
        c = this.directive.options.recycle,
        h = [],
        r = 0,
        i = 0;
      for (let s = 0, l = e.length; s < l; ++s) {
        let p = e[s],
          v = p.removed,
          b = 0,
          E = p.index,
          M = E + p.addedCount,
          V = t.splice(p.index, v.length),
          te = (i = h.length + V.length);
        for (; E < M; ++E) {
          let re = t[E],
            le = re ? re.firstChild : this.location,
            ae;
          c && i > 0 ? (b <= te && V.length > 0 ? ((ae = V[b]), b++) : ((ae = h[r]), r++), i--) : (ae = d.create()),
            t.splice(E, 0, ae),
            n(ae, a, E, u),
            ae.insertBefore(le);
        }
        V[b] && h.push(...V.slice(b));
      }
      for (let s = r, l = h.length; s < l; ++s) h[s].dispose();
      if (this.directive.options.positioning)
        for (let s = 0, l = t.length; s < l; ++s) {
          let p = t[s].context;
          (p.length = l), (p.index = s);
        }
    }
    refreshAllViews(e = !1) {
      let t = this.items,
        n = this.template,
        a = this.location,
        d = this.bindView,
        u = this.controller,
        c = t.length,
        h = this.views,
        r = h.length;
      if (((c === 0 || e || !this.directive.options.recycle) && (vt.disposeContiguousBatch(h), (r = 0)), r === 0)) {
        this.views = h = new Array(c);
        for (let i = 0; i < c; ++i) {
          let s = n.create();
          d(s, t, i, u), (h[i] = s), s.insertBefore(a);
        }
      } else {
        let i = 0;
        for (; i < c; ++i)
          if (i < r) {
            let l = h[i];
            if (!l) {
              let p = new XMLSerializer();
              throw new gr(`View is null or undefined inside "${this.location.getRootNode().host.nodeName}".`, {
                index: i,
                hydrationStage: this.controller.hydrationStage,
                itemsLength: c,
                viewsState: h.map((v) => (v ? "hydrated" : "empty")),
                viewTemplateString: p.serializeToString(n.create().fragment),
                rootNodeContent: p.serializeToString(this.location.getRootNode()),
              });
            }
            d(l, t, i, u);
          } else {
            let l = n.create();
            d(l, t, i, u), h.push(l), l.insertBefore(a);
          }
        let s = h.splice(i, r - i);
        for (i = 0, c = s.length; i < c; ++i) s[i].dispose();
      }
    }
    unbindAllViews() {
      let e = this.views;
      for (let t = 0, n = e.length; t < n; ++t) {
        let a = e[t];
        if (!a) {
          let d = new XMLSerializer();
          throw new gr(`View is null or undefined inside "${this.location.getRootNode().host.nodeName}".`, {
            index: t,
            hydrationStage: this.controller.hydrationStage,
            viewsState: e.map((u) => (u ? "hydrated" : "empty")),
            rootNodeContent: d.serializeToString(this.location.getRootNode()),
          });
        }
        a.unbind();
      }
    }
    hydrateViews(e) {
      if (!this.items) return;
      this.views = new Array(this.items.length);
      let t = this.location.previousSibling;
      for (; t !== null; ) {
        if (!Ta(t)) {
          t = t.previousSibling;
          continue;
        }
        let n = he.parseRepeatEndMarker(t.data);
        if (n === null) {
          t = t.previousSibling;
          continue;
        }
        t.data = "";
        let a = t.previousSibling;
        if (!a)
          throw new Error(
            `Error when hydrating inside "${this.location.getRootNode().host.nodeName}": end should never be null.`
          );
        let d = a,
          u = 0;
        for (; d !== null; ) {
          if (Ta(d)) {
            if (he.isRepeatViewEndMarker(d.data)) u++;
            else if (he.isRepeatViewStartMarker(d.data))
              if (u) u--;
              else {
                if (he.parseRepeatStartMarker(d.data) !== n)
                  throw new Error(
                    `Error when hydrating inside "${this.location.getRootNode().host.nodeName}": Mismatched start and end markers.`
                  );
                (d.data = ""), (t = d.previousSibling), (d = d.nextSibling);
                let c = e.hydrate(d, a);
                (this.views[n] = c), this.bindView(c, this.items, n, this.controller);
                break;
              }
          }
          d = d.previousSibling;
        }
        if (!d)
          throw new Error(
            `Error when hydrating inside "${this.location.getRootNode().host.nodeName}": start should never be null.`
          );
      }
    }
  },
  Ao = class {
    constructor(e, t, n) {
      (this.dataBinding = e), (this.templateBinding = t), (this.options = n), na.enable();
    }
    createHTML(e) {
      return lo.comment(e(this));
    }
    createBehavior() {
      return new vr(this);
    }
  };
ke.define(Ao);
function it(o, e, t = La) {
  let n = vn(o),
    a = vn(e);
  return new Ao(n, a, Object.assign(Object.assign({}, La), t));
}
var kc = (o) => o.nodeType === 1,
  mr = (o) => (o ? (e) => e.nodeType === 1 && e.matches(o) : kc),
  Ro = class extends _t {
    get id() {
      return this._id;
    }
    set id(e) {
      (this._id = e), (this._controllerProperty = `${e}-c`);
    }
    bind(e) {
      let t = e.targets[this.targetNodeId];
      (t[this._controllerProperty] = e),
        this.updateTarget(e.source, this.computeNodes(t)),
        this.observe(t),
        e.onUnbind(this);
    }
    unbind(e) {
      let t = e.targets[this.targetNodeId];
      this.updateTarget(e.source, yt), this.disconnect(t), (t[this._controllerProperty] = null);
    }
    getSource(e) {
      return e[this._controllerProperty].source;
    }
    updateTarget(e, t) {
      e[this.options.property] = t;
    }
    computeNodes(e) {
      let t = this.getNodes(e);
      return "filter" in this.options && (t = t.filter(this.options.filter)), t;
    }
  };
var Da = "slotchange",
  $o = class extends Ro {
    observe(e) {
      e.addEventListener(Da, this);
    }
    disconnect(e) {
      e.removeEventListener(Da, this);
    }
    getNodes(e) {
      return e.assignedNodes(this.options);
    }
    handleEvent(e) {
      let t = e.currentTarget;
      this.updateTarget(this.getSource(t), this.computeNodes(t));
    }
  };
ke.define($o);
function Pt(o) {
  return ye(o) && (o = { property: o }), new $o(o);
}
var Ha = "boolean",
  Fa = "reflect",
  uo = Object.freeze({ locate: sr() }),
  Ia = {
    toView(o) {
      return o ? "true" : "false";
    },
    fromView(o) {
      return !(o == null || o === "false" || o === !1 || o === 0);
    },
  };
var Mo = class o {
  constructor(e, t, n = t.toLowerCase(), a = Fa, d) {
    (this.guards = new Set()),
      (this.Owner = e),
      (this.name = t),
      (this.attribute = n),
      (this.mode = a),
      (this.converter = d),
      (this.fieldName = `_${t}`),
      (this.callbackName = `${t}Changed`),
      (this.hasCallback = this.callbackName in e.prototype),
      a === Ha && d === void 0 && (this.converter = Ia);
  }
  setValue(e, t) {
    let n = e[this.fieldName],
      a = this.converter;
    a !== void 0 && (t = a.fromView(t)),
      n !== t &&
        ((e[this.fieldName] = t),
        this.tryReflectToAttribute(e),
        this.hasCallback && e[this.callbackName](n, t),
        e.$fastController.notify(this.name));
  }
  getValue(e) {
    return U.track(e, this.name), e[this.fieldName];
  }
  onAttributeChangedCallback(e, t) {
    this.guards.has(e) || (this.guards.add(e), this.setValue(e, t), this.guards.delete(e));
  }
  tryReflectToAttribute(e) {
    let t = this.mode,
      n = this.guards;
    n.has(e) ||
      t === "fromView" ||
      nt.enqueue(() => {
        n.add(e);
        let a = e[this.fieldName];
        switch (t) {
          case Fa:
            let d = this.converter;
            Ye.setAttribute(e, this.attribute, d !== void 0 ? d.toView(a) : a);
            break;
          case Ha:
            Ye.setBooleanAttribute(e, this.attribute, a);
            break;
        }
        n.delete(e);
      });
  }
  static collect(e, ...t) {
    let n = [];
    t.push(uo.locate(e));
    for (let a = 0, d = t.length; a < d; ++a) {
      let u = t[a];
      if (u !== void 0)
        for (let c = 0, h = u.length; c < h; ++c) {
          let r = u[c];
          ye(r) ? n.push(new o(e, r)) : n.push(new o(e, r.property, r.attribute, r.mode, r.converter));
        }
    }
    return n;
  }
};
function W(o, e) {
  let t;
  function n(a, d) {
    arguments.length > 1 && (t.property = d), uo.locate(a.constructor).push(t);
  }
  if (arguments.length > 1) {
    (t = {}), n(o, e);
    return;
  }
  return (t = o === void 0 ? {} : o), n;
}
var Sc = function (o, e, t, n) {
    function a(d) {
      return d instanceof t
        ? d
        : new t(function (u) {
            u(d);
          });
    }
    return new (t || (t = Promise))(function (d, u) {
      function c(i) {
        try {
          r(n.next(i));
        } catch (s) {
          u(s);
        }
      }
      function h(i) {
        try {
          r(n.throw(i));
        } catch (s) {
          u(s);
        }
      }
      function r(i) {
        i.done ? d(i.value) : a(i.value).then(c, h);
      }
      r((n = n.apply(o, e || [])).next());
    });
  },
  yc,
  Oa = { mode: "open" },
  Aa = {},
  Pn = new Set(),
  Wo = oe.getById(rt.elementRegistry, () => ao()),
  Ra = { deferAndHydrate: "defer-and-hydrate" },
  ce = class o {
    constructor(e, t = e.definition) {
      var n;
      (this.platformDefined = !1),
        ye(t) && (t = { name: t }),
        (this.type = e),
        (this.name = t.name),
        (this.template = t.template),
        (this.templateOptions = t.templateOptions),
        (this.registry = (n = t.registry) !== null && n !== void 0 ? n : customElements);
      let a = e.prototype,
        d = Mo.collect(e, t.attributes),
        u = new Array(d.length),
        c = {},
        h = {};
      for (let r = 0, i = d.length; r < i; ++r) {
        let s = d[r];
        (u[r] = s.attribute), (c[s.name] = s), (h[s.attribute] = s), U.defineProperty(a, s);
      }
      Reflect.defineProperty(e, "observedAttributes", { value: u, enumerable: !0 }),
        (this.attributes = d),
        (this.propertyLookup = c),
        (this.attributeLookup = h),
        (this.shadowOptions =
          t.shadowOptions === void 0
            ? Oa
            : t.shadowOptions === null
              ? void 0
              : Object.assign(Object.assign({}, Oa), t.shadowOptions)),
        (this.elementOptions =
          t.elementOptions === void 0 ? Aa : Object.assign(Object.assign({}, Aa), t.elementOptions)),
        (this.styles = Ee.normalize(t.styles)),
        Wo.register(this),
        U.defineProperty(o.isRegistered, this.name),
        (o.isRegistered[this.name] = this.type);
    }
    get isDefined() {
      return this.platformDefined;
    }
    define(e = this.registry) {
      var t, n;
      let a = this.type;
      return (
        e.get(this.name) ||
          ((this.platformDefined = !0),
          e.define(this.name, a, this.elementOptions),
          (n = (t = this.lifecycleCallbacks) === null || t === void 0 ? void 0 : t.elementDidDefine) === null ||
            n === void 0 ||
            n.call(t, this.name)),
        this
      );
    }
    static compose(e, t) {
      return Pn.has(e) || Wo.getByType(e) ? new o(class extends e {}, t) : new o(e, t);
    }
    static registerBaseType(e) {
      Pn.add(e);
    }
    static composeAsync(e, t) {
      return new Promise((n) => {
        (Pn.has(e) || Wo.getByType(e)) && n(new o(class extends e {}, t));
        let a = new o(e, t);
        U.getNotifier(a).subscribe(
          {
            handleChange: () => {
              var d, u;
              (u = (d = a.lifecycleCallbacks) === null || d === void 0 ? void 0 : d.templateDidUpdate) === null ||
                u === void 0 ||
                u.call(d, a.name),
                n(a);
            },
          },
          "template"
        );
      });
    }
  };
yc = ce;
ce.isRegistered = {};
ce.getByType = Wo.getByType;
ce.getForInstance = Wo.getForInstance;
ce.registerAsync = (o) =>
  Sc(void 0, void 0, void 0, function* () {
    return new Promise((e) => {
      ce.isRegistered[o] && e(ce.isRegistered[o]),
        U.getNotifier(ce.isRegistered).subscribe({ handleChange: () => e(ce.isRegistered[o]) }, o);
    });
  });
U.defineProperty(ce.prototype, "template");
var fr = class extends MutationObserver {
    constructor(e) {
      function t(n) {
        this.callback.call(
          null,
          n.filter((a) => this.observedNodes.has(a.target))
        );
      }
      super(t), (this.callback = e), (this.observedNodes = new Set());
    }
    observe(e, t) {
      this.observedNodes.add(e), super.observe(e, t);
    }
    unobserve(e) {
      this.observedNodes.delete(e), this.observedNodes.size < 1 && this.disconnect();
    }
  },
  Fp = Object.freeze({
    create(o) {
      let e = [],
        t = {},
        n = null,
        a = !1;
      return {
        source: o,
        context: Qe.default,
        targets: t,
        get isBound() {
          return a;
        },
        addBehaviorFactory(d, u) {
          var c, h, r, i;
          let s = d;
          (s.id = (c = s.id) !== null && c !== void 0 ? c : Ct()),
            (s.targetNodeId = (h = s.targetNodeId) !== null && h !== void 0 ? h : Ct()),
            (s.targetTagName = (r = u.tagName) !== null && r !== void 0 ? r : null),
            (s.policy = (i = s.policy) !== null && i !== void 0 ? i : Ye.policy),
            this.addTarget(s.targetNodeId, u),
            this.addBehavior(s.createBehavior());
        },
        addTarget(d, u) {
          t[d] = u;
        },
        addBehavior(d) {
          e.push(d), a && d.bind(this);
        },
        onUnbind(d) {
          n === null && (n = []), n.push(d);
        },
        connectedCallback(d) {
          a || ((a = !0), e.forEach((u) => u.bind(this)));
        },
        disconnectedCallback(d) {
          a && ((a = !1), n !== null && n.forEach((u) => u.unbind(this)));
        },
      };
    },
  });
var Bc = { bubbles: !0, composed: !0, cancelable: !0 },
  xr = "isConnected",
  Wa = new WeakMap();
function zo(o) {
  var e, t;
  return (t = (e = o.shadowRoot) !== null && e !== void 0 ? e : Wa.get(o)) !== null && t !== void 0 ? t : null;
}
var $a,
  Je = class o extends so {
    constructor(e, t) {
      super(e),
        (this.boundObservables = null),
        (this.needsInitialization = !0),
        (this.hasExistingShadowRoot = !1),
        (this._template = null),
        (this.stage = 3),
        (this.guardBehaviorConnection = !1),
        (this.behaviors = null),
        (this.behaviorsConnected = !1),
        (this._mainStyles = null),
        (this.$fastController = this),
        (this.view = null),
        (this.source = e),
        (this.definition = t),
        (this.shadowOptions = t.shadowOptions);
      let n = U.getAccessors(e);
      if (n.length > 0) {
        let a = (this.boundObservables = Object.create(null));
        for (let d = 0, u = n.length; d < u; ++d) {
          let c = n[d].name,
            h = e[c];
          h !== void 0 && (delete e[c], (a[c] = h));
        }
      }
    }
    get isConnected() {
      return U.track(this, xr), this.stage === 1;
    }
    get context() {
      var e, t;
      return (t = (e = this.view) === null || e === void 0 ? void 0 : e.context) !== null && t !== void 0
        ? t
        : Qe.default;
    }
    get isBound() {
      var e, t;
      return (t = (e = this.view) === null || e === void 0 ? void 0 : e.isBound) !== null && t !== void 0 ? t : !1;
    }
    get sourceLifetime() {
      var e;
      return (e = this.view) === null || e === void 0 ? void 0 : e.sourceLifetime;
    }
    get template() {
      var e;
      if (this._template === null) {
        let t = this.definition;
        this.source.resolveTemplate
          ? (this._template = this.source.resolveTemplate())
          : t.template && (this._template = (e = t.template) !== null && e !== void 0 ? e : null);
      }
      return this._template;
    }
    set template(e) {
      this._template !== e && ((this._template = e), this.needsInitialization || this.renderTemplate(e));
    }
    get shadowOptions() {
      return this._shadowRootOptions;
    }
    set shadowOptions(e) {
      if (this._shadowRootOptions === void 0 && e !== void 0) {
        this._shadowRootOptions = e;
        let t = this.source.shadowRoot;
        t
          ? (this.hasExistingShadowRoot = !0)
          : ((t = this.source.attachShadow(e)), e.mode === "closed" && Wa.set(this.source, t));
      }
    }
    get mainStyles() {
      var e;
      if (this._mainStyles === null) {
        let t = this.definition;
        this.source.resolveStyles
          ? (this._mainStyles = this.source.resolveStyles())
          : t.styles && (this._mainStyles = (e = t.styles) !== null && e !== void 0 ? e : null);
      }
      return this._mainStyles;
    }
    set mainStyles(e) {
      this._mainStyles !== e &&
        (this._mainStyles !== null && this.removeStyles(this._mainStyles),
        (this._mainStyles = e),
        this.needsInitialization || this.addStyles(e));
    }
    onUnbind(e) {
      var t;
      (t = this.view) === null || t === void 0 || t.onUnbind(e);
    }
    addBehavior(e) {
      var t, n;
      let a = (t = this.behaviors) !== null && t !== void 0 ? t : (this.behaviors = new Map()),
        d = (n = a.get(e)) !== null && n !== void 0 ? n : 0;
      d === 0
        ? (a.set(e, 1),
          e.addedCallback && e.addedCallback(this),
          e.connectedCallback &&
            !this.guardBehaviorConnection &&
            (this.stage === 1 || this.stage === 0) &&
            e.connectedCallback(this))
        : a.set(e, d + 1);
    }
    removeBehavior(e, t = !1) {
      let n = this.behaviors;
      if (n === null) return;
      let a = n.get(e);
      a !== void 0 &&
        (a === 1 || t
          ? (n.delete(e),
            e.disconnectedCallback && this.stage !== 3 && e.disconnectedCallback(this),
            e.removedCallback && e.removedCallback(this))
          : n.set(e, a - 1));
    }
    addStyles(e) {
      var t;
      if (!e) return;
      let n = this.source;
      if (e instanceof HTMLElement) ((t = zo(n)) !== null && t !== void 0 ? t : this.source).append(e);
      else if (!e.isAttachedTo(n)) {
        let a = e.behaviors;
        if ((e.addStylesTo(n), a !== null)) for (let d = 0, u = a.length; d < u; ++d) this.addBehavior(a[d]);
      }
    }
    removeStyles(e) {
      var t;
      if (!e) return;
      let n = this.source;
      if (e instanceof HTMLElement) ((t = zo(n)) !== null && t !== void 0 ? t : n).removeChild(e);
      else if (e.isAttachedTo(n)) {
        let a = e.behaviors;
        if ((e.removeStylesFrom(n), a !== null)) for (let d = 0, u = a.length; d < u; ++d) this.removeBehavior(a[d]);
      }
    }
    connect() {
      this.stage === 3 &&
        ((this.stage = 0),
        this.bindObservables(),
        this.connectBehaviors(),
        this.needsInitialization
          ? (this.renderTemplate(this.template), this.addStyles(this.mainStyles), (this.needsInitialization = !1))
          : this.view !== null && this.view.bind(this.source),
        (this.stage = 1),
        U.notify(this, xr));
    }
    bindObservables() {
      if (this.boundObservables !== null) {
        let e = this.source,
          t = this.boundObservables,
          n = Object.keys(t);
        for (let a = 0, d = n.length; a < d; ++a) {
          let u = n[a];
          e[u] = t[u];
        }
        this.boundObservables = null;
      }
    }
    connectBehaviors() {
      if (this.behaviorsConnected === !1) {
        let e = this.behaviors;
        if (e !== null) {
          this.guardBehaviorConnection = !0;
          for (let t of e.keys()) t.connectedCallback && t.connectedCallback(this);
          this.guardBehaviorConnection = !1;
        }
        this.behaviorsConnected = !0;
      }
    }
    disconnectBehaviors() {
      if (this.behaviorsConnected === !0) {
        let e = this.behaviors;
        if (e !== null) for (let t of e.keys()) t.disconnectedCallback && t.disconnectedCallback(this);
        this.behaviorsConnected = !1;
      }
    }
    disconnect() {
      this.stage === 1 &&
        ((this.stage = 2),
        U.notify(this, xr),
        this.view !== null && this.view.unbind(),
        this.disconnectBehaviors(),
        (this.stage = 3));
    }
    onAttributeChangedCallback(e, t, n) {
      let a = this.definition.attributeLookup[e];
      a !== void 0 && a.onAttributeChangedCallback(this.source, n);
    }
    emit(e, t, n) {
      return this.stage === 1
        ? this.source.dispatchEvent(new CustomEvent(e, Object.assign(Object.assign({ detail: t }, Bc), n)))
        : !1;
    }
    renderTemplate(e) {
      var t;
      let n = this.source,
        a = (t = zo(n)) !== null && t !== void 0 ? t : n;
      if (this.view !== null) this.view.dispose(), (this.view = null);
      else if (!this.needsInitialization || this.hasExistingShadowRoot) {
        this.hasExistingShadowRoot = !1;
        for (let d = a.firstChild; d !== null; d = a.firstChild) a.removeChild(d);
      }
      e && ((this.view = e.render(n, a, n)), (this.view.sourceLifetime = zt.coupled));
    }
    static forCustomElement(e, t = !1) {
      let n = e.$fastController;
      if (n !== void 0 && !t) return n;
      let a = ce.getForInstance(e);
      if (a === void 0) throw oe.error(1401);
      return (
        U.getNotifier(a).subscribe(
          {
            handleChange: () => {
              o.forCustomElement(e, !0), e.$fastController.connect();
            },
          },
          "template"
        ),
        U.getNotifier(a).subscribe(
          {
            handleChange: () => {
              o.forCustomElement(e, !0), e.$fastController.connect();
            },
          },
          "shadowOptions"
        ),
        (e.$fastController = new $a(e, a))
      );
    }
    static setStrategy(e) {
      $a = e;
    }
  };
Te(Je);
Je.setStrategy(Je);
function br(o) {
  var e;
  return "adoptedStyleSheets" in o ? o : (e = zo(o)) !== null && e !== void 0 ? e : o.getRootNode();
}
var kr = class o {
  constructor(e) {
    let t = o.styleSheetCache;
    this.sheets = e.map((n) => {
      if (n instanceof CSSStyleSheet) return n;
      let a = t.get(n);
      return a === void 0 && ((a = new CSSStyleSheet()), a.replaceSync(n), t.set(n, a)), a;
    });
  }
  addStylesTo(e) {
    za(br(e), this.sheets);
  }
  removeStylesFrom(e) {
    _a(br(e), this.sheets);
  }
};
kr.styleSheetCache = new Map();
var wc = 0,
  Cc = () => `fast-${++wc}`;
function Ma(o) {
  return o === document ? document.body : o;
}
var En = class {
    constructor(e) {
      (this.styles = e), (this.styleClass = Cc());
    }
    addStylesTo(e) {
      e = Ma(br(e));
      let t = this.styles,
        n = this.styleClass;
      for (let a = 0; a < t.length; a++) {
        let d = document.createElement("style");
        (d.innerHTML = t[a]), (d.className = n), e.append(d);
      }
    }
    removeStylesFrom(e) {
      e = Ma(br(e));
      let t = e.querySelectorAll(`.${this.styleClass}`);
      for (let n = 0, a = t.length; n < a; ++n) e.removeChild(t[n]);
    }
  },
  za = (o, e) => {
    o.adoptedStyleSheets = [...o.adoptedStyleSheets, ...e];
  },
  _a = (o, e) => {
    o.adoptedStyleSheets = o.adoptedStyleSheets.filter((t) => e.indexOf(t) === -1);
  };
if (Ee.supportsAdoptedStyleSheets) {
  try {
    document.adoptedStyleSheets.push(),
      document.adoptedStyleSheets.splice(),
      (za = (o, e) => {
        o.adoptedStyleSheets.push(...e);
      }),
      (_a = (o, e) => {
        for (let t of e) {
          let n = o.adoptedStyleSheets.indexOf(t);
          n !== -1 && o.adoptedStyleSheets.splice(n, 1);
        }
      });
  } catch {}
  Ee.setDefaultStrategy(kr);
} else Ee.setDefaultStrategy(En);
var Nn = "needs-hydration",
  po = class o extends Je {
    get shadowOptions() {
      return super.shadowOptions;
    }
    set shadowOptions(e) {
      (super.shadowOptions = e),
        (this.hasExistingShadowRoot || (e !== void 0 && !this.template)) &&
          this.definition.templateOptions === Ra.deferAndHydrate &&
          (this.source.toggleAttribute(Lo, !0), this.source.toggleAttribute(Nn, !0));
    }
    addHydratingInstance() {
      if (!o.hydratingInstances) return;
      let e = this.definition.name,
        t = o.hydratingInstances.get(e);
      t || ((t = new Set()), o.hydratingInstances.set(e, t)), t.add(this.source);
    }
    static config(e) {
      return (o.lifecycleCallbacks = e), this;
    }
    static hydrationObserverHandler(e) {
      for (let t of e)
        t.target.hasAttribute(Lo) || (o.hydrationObserver.unobserve(t.target), t.target.$fastController.connect());
    }
    static checkHydrationComplete(e) {
      var t, n, a;
      if (e.didTimeout) {
        o.idleCallbackId = requestIdleCallback(o.checkHydrationComplete, { timeout: 50 });
        return;
      }
      ((t = o.hydratingInstances) === null || t === void 0 ? void 0 : t.size) === 0 &&
        ((a = (n = o.lifecycleCallbacks) === null || n === void 0 ? void 0 : n.hydrationComplete) === null ||
          a === void 0 ||
          a.call(n),
        Je.setStrategy(Je));
    }
    connect() {
      var e, t, n, a, d;
      if (
        ((this.needsHydration = (e = this.needsHydration) !== null && e !== void 0 ? e : this.source.hasAttribute(Nn)),
        this.source.hasAttribute(Lo))
      ) {
        this.addHydratingInstance(), o.hydrationObserver.observe(this.source, { attributeFilter: [Lo] });
        return;
      }
      if (!this.needsHydration) {
        super.connect(), this.removeHydratingInstance();
        return;
      }
      if (this.stage === 3) {
        if (
          ((n = (t = o.lifecycleCallbacks) === null || t === void 0 ? void 0 : t.elementWillHydrate) === null ||
            n === void 0 ||
            n.call(t, this.definition.name),
          (this.stage = 0),
          this.bindObservables(),
          this.connectBehaviors(),
          this.template)
        )
          if (ht(this.template)) {
            let u = this.source,
              c = (a = zo(u)) !== null && a !== void 0 ? a : u,
              h = c.firstChild,
              r = c.lastChild;
            u.shadowRoot === null &&
              (he.isElementBoundaryStartMarker(h) && ((h.data = ""), (h = h.nextSibling)),
              he.isElementBoundaryEndMarker(r) && ((r.data = ""), (r = r.previousSibling))),
              (this.view = this.template.hydrate(h, r, u)),
              (d = this.view) === null || d === void 0 || d.bind(this.source);
          } else this.renderTemplate(this.template);
        this.addStyles(this.mainStyles),
          (this.stage = 1),
          this.source.removeAttribute(Nn),
          (this.needsInitialization = this.needsHydration = !1),
          this.removeHydratingInstance(),
          U.notify(this, xr);
      }
    }
    removeHydratingInstance() {
      var e, t;
      if (!o.hydratingInstances) return;
      let n = this.definition.name,
        a = o.hydratingInstances.get(n);
      (t = (e = o.lifecycleCallbacks) === null || e === void 0 ? void 0 : e.elementDidHydrate) === null ||
        t === void 0 ||
        t.call(e, this.definition.name),
        a &&
          (a.delete(this.source),
          a.size || o.hydratingInstances.delete(n),
          o.idleCallbackId && cancelIdleCallback(o.idleCallbackId),
          (o.idleCallbackId = requestIdleCallback(o.checkHydrationComplete, { timeout: 50 })));
    }
    disconnect() {
      super.disconnect(), o.hydrationObserver.unobserve(this.source);
    }
    static install() {
      Je.setStrategy(o);
    }
  };
po.hydrationObserver = new fr(po.hydrationObserverHandler);
po.idleCallbackId = null;
po.hydratingInstances = new Map();
function ja(o) {
  let e = class extends o {
    constructor() {
      super(), Je.forCustomElement(this);
    }
    $emit(t, n, a) {
      return this.$fastController.emit(t, n, a);
    }
    connectedCallback() {
      this.$fastController.connect();
    }
    disconnectedCallback() {
      this.$fastController.disconnect();
    }
    attributeChangedCallback(t, n, a) {
      this.$fastController.onAttributeChangedCallback(t, n, a);
    }
  };
  return ce.registerBaseType(e), e;
}
function Pc(o, e) {
  return be(o) ? ce.compose(o, e) : ce.compose(this, o);
}
function Nc(o, e) {
  return be(o)
    ? new Promise((t) => {
        ce.composeAsync(o, e).then((n) => {
          t(n);
        });
      }).then((t) => t.define().type)
    : new Promise((t) => {
        ce.composeAsync(this, o).then((n) => {
          t(n);
        });
      }).then((t) => t.define().type);
}
function Ga(o, e) {
  return be(o) ? ce.compose(o, e).define().type : ce.compose(this, o).define().type;
}
function Ec(o) {
  return ja(o);
}
var G = Object.assign(ja(HTMLElement), { from: Ec, define: Ga, compose: Pc, defineAsync: Nc });
function q(o) {
  return function (e) {
    Ga(e, o);
  };
}
var Va = "var(--borderRadiusNone)",
  Xa = "var(--borderRadiusSmall)",
  _o = "var(--borderRadiusMedium)",
  Ka = "var(--borderRadiusLarge)";
var Sr = "var(--borderRadiusCircular)";
var ho = "var(--fontSizeBase200)",
  yr = "var(--fontSizeBase300)",
  Ua = "var(--fontSizeBase400)";
var Br = "var(--lineHeightBase200)",
  wr = "var(--lineHeightBase300)",
  qa = "var(--lineHeightBase400)";
var jt = "var(--fontFamilyBase)";
var Gt = "var(--fontWeightRegular)";
var Ya = "var(--fontWeightSemibold)";
var Nt = "var(--strokeWidthThin)",
  Cr = "var(--strokeWidthThick)";
var Qa = "var(--spacingHorizontalXXS)",
  Za = "var(--spacingHorizontalXS)",
  Ja = "var(--spacingHorizontalSNudge)",
  es = "var(--spacingHorizontalS)";
var ts = "var(--spacingHorizontalM)",
  os = "var(--spacingHorizontalL)";
var rs = "var(--durationFaster)";
var ns = "var(--durationNormal)";
var Pr = "var(--curveEasyEase)";
var Nr = "var(--colorNeutralForeground1)",
  as = "var(--colorNeutralForeground1Hover)",
  ss = "var(--colorNeutralForeground1Pressed)";
var Vt = "var(--colorNeutralForeground2)",
  Er = "var(--colorNeutralForeground2Hover)",
  Lr = "var(--colorNeutralForeground2Pressed)";
var Ln = "var(--colorNeutralForeground2BrandHover)",
  Tn = "var(--colorNeutralForeground2BrandPressed)";
var go = "var(--colorNeutralForeground3)",
  is = "var(--colorNeutralForeground3Hover)",
  cs = "var(--colorNeutralForeground3Pressed)";
var Et = "var(--colorNeutralForegroundDisabled)";
var ls = "var(--colorCompoundBrandForeground1Pressed)",
  ds = "var(--colorBrandForeground1)";
var us = "var(--colorNeutralForegroundInverted)",
  ps = "var(--colorNeutralForegroundInvertedHover)",
  hs = "var(--colorNeutralForegroundInvertedPressed)";
var Tr = "var(--colorNeutralForegroundOnBrand)";
var Dr = "var(--colorNeutralBackground1)",
  Hr = "var(--colorNeutralBackground1Hover)",
  gs = "var(--colorNeutralBackground1Pressed)",
  vs = "var(--colorNeutralBackground1Selected)";
var ms = "var(--colorSubtleBackground)",
  fs = "var(--colorSubtleBackgroundHover)",
  xs = "var(--colorSubtleBackgroundPressed)";
var Lt = "var(--colorTransparentBackground)",
  Dn = "var(--colorTransparentBackgroundHover)",
  Hn = "var(--colorTransparentBackgroundPressed)";
var vo = "var(--colorNeutralBackgroundDisabled)";
var bs = "var(--colorBrandBackground)",
  ks = "var(--colorBrandBackgroundHover)",
  Ss = "var(--colorBrandBackgroundPressed)";
var Fn = "var(--colorCompoundBrandBackground)",
  In = "var(--colorCompoundBrandBackgroundHover)",
  On = "var(--colorCompoundBrandBackgroundPressed)";
var ys = "var(--colorNeutralStrokeAccessible)",
  Bs = "var(--colorNeutralStrokeAccessibleHover)",
  ws = "var(--colorNeutralStrokeAccessiblePressed)";
var mo = "var(--colorNeutralStroke1)",
  Cs = "var(--colorNeutralStroke1Hover)",
  Ps = "var(--colorNeutralStroke1Pressed)";
var Ns = "var(--colorNeutralStroke2)",
  Es = "var(--colorNeutralStroke3)";
var Ls = "var(--colorBrandStroke1)";
var jo = "var(--colorNeutralStrokeDisabled)";
var fo = "var(--colorTransparentStroke)";
var Xt = "var(--colorStrokeFocus2)";
var Ts = "var(--shadow2)",
  Fr = "var(--shadow4)";
var Me = "var(--colorNeutralCardBackground)";
var Ir = "var(--colorBrandBackground)",
  Ce = "var(--colorNeutralBackgroundDisabled)";
var Ds = "var(--colorNeutralBackground1)";
var Hs = "var(--colorSubtleBackgroundHover)";
var Fs = "var(--colorNeutralBackground1Hover)",
  Is = "var(--colorNeutralBackground1Pressed)";
var An = "var(--colorBrandForegroundLink)";
var Os = "var(--colorBrandBackground)";
var As = "var(--shadow8Base)",
  Rs = "var(--shadow8Diffuse)",
  ct = "var(--colorBrandForeground1)",
  se = "var(--colorNeutralForeground1)",
  We = "var(--colorNeutralForegroundHint)";
var Or = "var(--colorBrandForeground1)",
  Kt = "var(--colorNeutralForegroundHint)";
var $s = "var(--colorNeutralForegroundDisabled)";
var xo = "var(--colorNeutralForegroundHint)";
var Ut = "var(--colorNeutralForegroundOnBrand)";
var Ms = "var(--spacingHorizontalL)";
var Tt = "var(--colorTransparentBackground)";
var Ws = "var(--spacingHorizontalXXS)";
var F = "var(--spacingHorizontalL)",
  ie = "var(--spacingHorizontalNone)",
  Be = "var(--spacingHorizontalM)",
  et = "var(--spacingHorizontalXXL)",
  X = "var(--spacingHorizontalS)",
  ze = "var(--spacingHorizontalXXXL)",
  mt = "var(--spacingHorizontalXS)";
var zs = "var(--shadow28Base)",
  _s = "var(--shadow28Diffuse)",
  Ar = "var(--shadow2Base)",
  Rr = "var(--shadow2Diffuse)";
var Rn = "var(--spacingHorizontalXXXL)";
var js = "var(--colorStatusDangerForeground3)";
var Gs = "var(--colorStatusDangerBackground1)";
var Vs = "var(--colorStatusSuccessBackground3)";
var Dt = "var(--colorNeutralStroke2)";
var Go = "var(--strokeWidthThin)";
var $n = "var(--strokeWidthThick)";
var _e = "var(--fontSizeBase400)",
  $r = "var(--lineHeightBase400)",
  je = "var(--fontSizeBase300)",
  Xs = "var(--lineHeightBase300)",
  ge = "var(--fontSizeBase200)",
  qt = "var(--lineHeightBase200)",
  Ks = "var(--fontSizeBase100)",
  Mr = "var(--lineHeightBase100)";
var Ht = "var(--fontSizeBase500)";
var bo = "var(--fontWeightMedium)";
var He = "var(--fontWeightSemibold)";
var fe = "var(--fontWeightRegular)";
var Wr = "var(--borderRadiusLayerCard)";
var Vo = "var(--spacingHorizontalXXS)";
import {
  EdgeExtensionsErrorType as od,
  EdgeExtensionsInstallPhase as rd,
  EdgeExtensionsPageType as pt,
} from "./edge_mobile_extension.mojom-webui.js";
var Lc =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function zr() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var Tc,
  _r,
  lt =
    ((function (o, e) {
      o.exports = (function () {
        function t(n, a, d) {
          function u(r, i) {
            if (!a[r]) {
              if (!n[r]) {
                if (!i && zr) return zr();
                if (c) return c(r, !0);
                var s = new Error("Cannot find module '" + r + "'");
                throw ((s.code = "MODULE_NOT_FOUND"), s);
              }
              var l = (a[r] = { exports: {} });
              n[r][0].call(
                l.exports,
                function (p) {
                  return u(n[r][1][p] || p);
                },
                l,
                l.exports,
                t,
                n,
                a,
                d
              );
            }
            return a[r].exports;
          }
          for (var c = zr, h = 0; h < d.length; h++) u(d[h]);
          return u;
        }
        return t;
      })()(
        {
          1: [
            function (t, n, a) {
              n.exports = t("./lib/chai");
            },
            { "./lib/chai": 2 },
          ],
          2: [
            function (t, n, a) {
              var d = [];
              (a.version = "4.3.3"), (a.AssertionError = t("assertion-error"));
              var u = t("./chai/utils");
              (a.use = function (p) {
                return ~d.indexOf(p) || (p(a, u), d.push(p)), a;
              }),
                (a.util = u);
              var c = t("./chai/config");
              a.config = c;
              var h = t("./chai/assertion");
              a.use(h);
              var r = t("./chai/core/assertions");
              a.use(r);
              var i = t("./chai/interface/expect");
              a.use(i);
              var s = t("./chai/interface/should");
              a.use(s);
              var l = t("./chai/interface/assert");
              a.use(l);
            },
            {
              "./chai/assertion": 3,
              "./chai/config": 4,
              "./chai/core/assertions": 5,
              "./chai/interface/assert": 6,
              "./chai/interface/expect": 7,
              "./chai/interface/should": 8,
              "./chai/utils": 23,
              "assertion-error": 34,
            },
          ],
          3: [
            function (t, n, a) {
              var d = t("./config");
              n.exports = function (u, c) {
                var h = u.AssertionError,
                  r = c.flag;
                function i(s, l, p, v) {
                  return (
                    r(this, "ssfi", p || i),
                    r(this, "lockSsfi", v),
                    r(this, "object", s),
                    r(this, "message", l),
                    c.proxify(this)
                  );
                }
                (u.Assertion = i),
                  Object.defineProperty(i, "includeStack", {
                    get: function () {
                      return (
                        console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead."),
                        d.includeStack
                      );
                    },
                    set: function (s) {
                      console.warn("Assertion.includeStack is deprecated, use chai.config.includeStack instead."),
                        (d.includeStack = s);
                    },
                  }),
                  Object.defineProperty(i, "showDiff", {
                    get: function () {
                      return (
                        console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead."), d.showDiff
                      );
                    },
                    set: function (s) {
                      console.warn("Assertion.showDiff is deprecated, use chai.config.showDiff instead."),
                        (d.showDiff = s);
                    },
                  }),
                  (i.addProperty = function (s, l) {
                    c.addProperty(this.prototype, s, l);
                  }),
                  (i.addMethod = function (s, l) {
                    c.addMethod(this.prototype, s, l);
                  }),
                  (i.addChainableMethod = function (s, l, p) {
                    c.addChainableMethod(this.prototype, s, l, p);
                  }),
                  (i.overwriteProperty = function (s, l) {
                    c.overwriteProperty(this.prototype, s, l);
                  }),
                  (i.overwriteMethod = function (s, l) {
                    c.overwriteMethod(this.prototype, s, l);
                  }),
                  (i.overwriteChainableMethod = function (s, l, p) {
                    c.overwriteChainableMethod(this.prototype, s, l, p);
                  }),
                  (i.prototype.assert = function (s, l, p, v, b, E) {
                    var M = c.test(this, arguments);
                    if (
                      (E !== !1 && (E = !0),
                      v === void 0 && b === void 0 && (E = !1),
                      d.showDiff !== !0 && (E = !1),
                      !M)
                    ) {
                      l = c.getMessage(this, arguments);
                      var V = { actual: c.getActual(this, arguments), expected: v, showDiff: E },
                        te = c.getOperator(this, arguments);
                      throw (te && (V.operator = te), new h(l, V, d.includeStack ? this.assert : r(this, "ssfi")));
                    }
                  }),
                  Object.defineProperty(i.prototype, "_obj", {
                    get: function () {
                      return r(this, "object");
                    },
                    set: function (s) {
                      r(this, "object", s);
                    },
                  });
              };
            },
            { "./config": 4 },
          ],
          4: [
            function (t, n, a) {
              n.exports = {
                includeStack: !1,
                showDiff: !0,
                truncateThreshold: 40,
                useProxy: !0,
                proxyExcludedKeys: ["then", "catch", "inspect", "toJSON"],
              };
            },
            {},
          ],
          5: [
            function (t, n, a) {
              n.exports = function (d, u) {
                var c = d.Assertion,
                  h = d.AssertionError,
                  r = u.flag;
                function i(g, f) {
                  f && r(this, "message", f), (g = g.toLowerCase());
                  var S = r(this, "object"),
                    x = ~["a", "e", "i", "o", "u"].indexOf(g.charAt(0)) ? "an " : "a ";
                  this.assert(
                    g === u.type(S).toLowerCase(),
                    "expected #{this} to be " + x + g,
                    "expected #{this} not to be " + x + g
                  );
                }
                function s(g, f) {
                  return (u.isNaN(g) && u.isNaN(f)) || g === f;
                }
                function l() {
                  r(this, "contains", !0);
                }
                function p(g, f) {
                  f && r(this, "message", f);
                  var S = r(this, "object"),
                    x = u.type(S).toLowerCase(),
                    B = r(this, "message"),
                    T = r(this, "negate"),
                    D = r(this, "ssfi"),
                    N = r(this, "deep"),
                    L = N ? "deep " : "";
                  B = B ? B + ": " : "";
                  var A = !1;
                  switch (x) {
                    case "string":
                      A = S.indexOf(g) !== -1;
                      break;
                    case "weakset":
                      if (N) throw new h(B + "unable to use .deep.include with WeakSet", void 0, D);
                      A = S.has(g);
                      break;
                    case "map":
                      var Z = N ? u.eql : s;
                      S.forEach(function (J) {
                        A = A || Z(J, g);
                      });
                      break;
                    case "set":
                      N
                        ? S.forEach(function (J) {
                            A = A || u.eql(J, g);
                          })
                        : (A = S.has(g));
                      break;
                    case "array":
                      A = N
                        ? S.some(function (J) {
                            return u.eql(J, g);
                          })
                        : S.indexOf(g) !== -1;
                      break;
                    default:
                      if (g !== Object(g))
                        throw new h(
                          B +
                            "the given combination of arguments (" +
                            x +
                            " and " +
                            u.type(g).toLowerCase() +
                            ") is invalid for this assertion. You can use an array, a map, an object, a set, a string, or a weakset instead of a " +
                            u.type(g).toLowerCase(),
                          void 0,
                          D
                        );
                      var K = Object.keys(g),
                        Y = null,
                        de = 0;
                      if (
                        (K.forEach(function (J) {
                          var Ae = new c(S);
                          if ((u.transferFlags(this, Ae, !0), r(Ae, "lockSsfi", !0), T && K.length !== 1))
                            try {
                              Ae.property(J, g[J]);
                            } catch (no) {
                              if (!u.checkError.compatibleConstructor(no, h)) throw no;
                              Y === null && (Y = no), de++;
                            }
                          else Ae.property(J, g[J]);
                        }, this),
                        T && K.length > 1 && de === K.length)
                      )
                        throw Y;
                      return;
                  }
                  this.assert(
                    A,
                    "expected #{this} to " + L + "include " + u.inspect(g),
                    "expected #{this} to not " + L + "include " + u.inspect(g)
                  );
                }
                function v() {
                  var g = r(this, "object");
                  this.assert(g != null, "expected #{this} to exist", "expected #{this} to not exist");
                }
                function b() {
                  var g = r(this, "object"),
                    f = u.type(g);
                  this.assert(
                    f === "Arguments",
                    "expected #{this} to be arguments but got " + f,
                    "expected #{this} to not be arguments"
                  );
                }
                function E(g, f) {
                  f && r(this, "message", f);
                  var S = r(this, "object");
                  if (r(this, "deep")) {
                    var x = r(this, "lockSsfi");
                    r(this, "lockSsfi", !0), this.eql(g), r(this, "lockSsfi", x);
                  } else
                    this.assert(
                      g === S,
                      "expected #{this} to equal #{exp}",
                      "expected #{this} to not equal #{exp}",
                      g,
                      this._obj,
                      !0
                    );
                }
                function M(g, f) {
                  f && r(this, "message", f),
                    this.assert(
                      u.eql(g, r(this, "object")),
                      "expected #{this} to deeply equal #{exp}",
                      "expected #{this} to not deeply equal #{exp}",
                      g,
                      this._obj,
                      !0
                    );
                }
                function V(g, f) {
                  f && r(this, "message", f);
                  var S,
                    x = r(this, "object"),
                    B = r(this, "doLength"),
                    T = r(this, "message"),
                    D = T ? T + ": " : "",
                    N = r(this, "ssfi"),
                    L = u.type(x).toLowerCase(),
                    A = u.type(g).toLowerCase(),
                    Z = !0;
                  if (
                    (B && L !== "map" && L !== "set" && new c(x, T, N, !0).to.have.property("length"),
                    B || L !== "date" || A === "date"
                      ? A === "number" || (!B && L !== "number")
                        ? B || L === "date" || L === "number"
                          ? (Z = !1)
                          : (S = D + "expected " + (L === "string" ? "'" + x + "'" : x) + " to be a number or a date")
                        : (S = D + "the argument to above must be a number")
                      : (S = D + "the argument to above must be a date"),
                    Z)
                  )
                    throw new h(S, void 0, N);
                  if (B) {
                    var K,
                      Y = "length";
                    L === "map" || L === "set" ? ((Y = "size"), (K = x.size)) : (K = x.length),
                      this.assert(
                        K > g,
                        "expected #{this} to have a " + Y + " above #{exp} but got #{act}",
                        "expected #{this} to not have a " + Y + " above #{exp}",
                        g,
                        K
                      );
                  } else
                    this.assert(
                      x > g,
                      "expected #{this} to be above #{exp}",
                      "expected #{this} to be at most #{exp}",
                      g
                    );
                }
                function te(g, f) {
                  f && r(this, "message", f);
                  var S,
                    x = r(this, "object"),
                    B = r(this, "doLength"),
                    T = r(this, "message"),
                    D = T ? T + ": " : "",
                    N = r(this, "ssfi"),
                    L = u.type(x).toLowerCase(),
                    A = u.type(g).toLowerCase(),
                    Z = !0;
                  if (
                    (B && L !== "map" && L !== "set" && new c(x, T, N, !0).to.have.property("length"),
                    B || L !== "date" || A === "date"
                      ? A === "number" || (!B && L !== "number")
                        ? B || L === "date" || L === "number"
                          ? (Z = !1)
                          : (S = D + "expected " + (L === "string" ? "'" + x + "'" : x) + " to be a number or a date")
                        : (S = D + "the argument to least must be a number")
                      : (S = D + "the argument to least must be a date"),
                    Z)
                  )
                    throw new h(S, void 0, N);
                  if (B) {
                    var K,
                      Y = "length";
                    L === "map" || L === "set" ? ((Y = "size"), (K = x.size)) : (K = x.length),
                      this.assert(
                        K >= g,
                        "expected #{this} to have a " + Y + " at least #{exp} but got #{act}",
                        "expected #{this} to have a " + Y + " below #{exp}",
                        g,
                        K
                      );
                  } else
                    this.assert(
                      x >= g,
                      "expected #{this} to be at least #{exp}",
                      "expected #{this} to be below #{exp}",
                      g
                    );
                }
                function re(g, f) {
                  f && r(this, "message", f);
                  var S,
                    x = r(this, "object"),
                    B = r(this, "doLength"),
                    T = r(this, "message"),
                    D = T ? T + ": " : "",
                    N = r(this, "ssfi"),
                    L = u.type(x).toLowerCase(),
                    A = u.type(g).toLowerCase(),
                    Z = !0;
                  if (
                    (B && L !== "map" && L !== "set" && new c(x, T, N, !0).to.have.property("length"),
                    B || L !== "date" || A === "date"
                      ? A === "number" || (!B && L !== "number")
                        ? B || L === "date" || L === "number"
                          ? (Z = !1)
                          : (S = D + "expected " + (L === "string" ? "'" + x + "'" : x) + " to be a number or a date")
                        : (S = D + "the argument to below must be a number")
                      : (S = D + "the argument to below must be a date"),
                    Z)
                  )
                    throw new h(S, void 0, N);
                  if (B) {
                    var K,
                      Y = "length";
                    L === "map" || L === "set" ? ((Y = "size"), (K = x.size)) : (K = x.length),
                      this.assert(
                        K < g,
                        "expected #{this} to have a " + Y + " below #{exp} but got #{act}",
                        "expected #{this} to not have a " + Y + " below #{exp}",
                        g,
                        K
                      );
                  } else
                    this.assert(
                      x < g,
                      "expected #{this} to be below #{exp}",
                      "expected #{this} to be at least #{exp}",
                      g
                    );
                }
                function le(g, f) {
                  f && r(this, "message", f);
                  var S,
                    x = r(this, "object"),
                    B = r(this, "doLength"),
                    T = r(this, "message"),
                    D = T ? T + ": " : "",
                    N = r(this, "ssfi"),
                    L = u.type(x).toLowerCase(),
                    A = u.type(g).toLowerCase(),
                    Z = !0;
                  if (
                    (B && L !== "map" && L !== "set" && new c(x, T, N, !0).to.have.property("length"),
                    B || L !== "date" || A === "date"
                      ? A === "number" || (!B && L !== "number")
                        ? B || L === "date" || L === "number"
                          ? (Z = !1)
                          : (S = D + "expected " + (L === "string" ? "'" + x + "'" : x) + " to be a number or a date")
                        : (S = D + "the argument to most must be a number")
                      : (S = D + "the argument to most must be a date"),
                    Z)
                  )
                    throw new h(S, void 0, N);
                  if (B) {
                    var K,
                      Y = "length";
                    L === "map" || L === "set" ? ((Y = "size"), (K = x.size)) : (K = x.length),
                      this.assert(
                        K <= g,
                        "expected #{this} to have a " + Y + " at most #{exp} but got #{act}",
                        "expected #{this} to have a " + Y + " above #{exp}",
                        g,
                        K
                      );
                  } else
                    this.assert(
                      x <= g,
                      "expected #{this} to be at most #{exp}",
                      "expected #{this} to be above #{exp}",
                      g
                    );
                }
                function ae(g, f) {
                  f && r(this, "message", f);
                  var S = r(this, "object"),
                    x = r(this, "ssfi"),
                    B = r(this, "message");
                  try {
                    var T = S instanceof g;
                  } catch (N) {
                    throw N instanceof TypeError
                      ? new h(
                          (B = B ? B + ": " : "") +
                            "The instanceof assertion needs a constructor but " +
                            u.type(g) +
                            " was given.",
                          void 0,
                          x
                        )
                      : N;
                  }
                  var D = u.getName(g);
                  D === null && (D = "an unnamed constructor"),
                    this.assert(
                      T,
                      "expected #{this} to be an instance of " + D,
                      "expected #{this} to not be an instance of " + D
                    );
                }
                function xe(g, f, S) {
                  S && r(this, "message", S);
                  var x = r(this, "nested"),
                    B = r(this, "own"),
                    T = r(this, "message"),
                    D = r(this, "object"),
                    N = r(this, "ssfi"),
                    L = typeof g;
                  if (((T = T ? T + ": " : ""), x)) {
                    if (L !== "string")
                      throw new h(T + "the argument to property must be a string when using nested syntax", void 0, N);
                  } else if (L !== "string" && L !== "number" && L !== "symbol")
                    throw new h(T + "the argument to property must be a string, number, or symbol", void 0, N);
                  if (x && B) throw new h(T + 'The "nested" and "own" flags cannot be combined.', void 0, N);
                  if (D == null) throw new h(T + "Target cannot be null or undefined.", void 0, N);
                  var A,
                    Z = r(this, "deep"),
                    K = r(this, "negate"),
                    Y = x ? u.getPathInfo(D, g) : null,
                    de = x ? Y.value : D[g],
                    J = "";
                  Z && (J += "deep "),
                    B && (J += "own "),
                    x && (J += "nested "),
                    (J += "property "),
                    (A = B ? Object.prototype.hasOwnProperty.call(D, g) : x ? Y.exists : u.hasProperty(D, g)),
                    (K && arguments.length !== 1) ||
                      this.assert(
                        A,
                        "expected #{this} to have " + J + u.inspect(g),
                        "expected #{this} to not have " + J + u.inspect(g)
                      ),
                    arguments.length > 1 &&
                      this.assert(
                        A && (Z ? u.eql(f, de) : f === de),
                        "expected #{this} to have " + J + u.inspect(g) + " of #{exp}, but got #{act}",
                        "expected #{this} to not have " + J + u.inspect(g) + " of #{act}",
                        f,
                        de
                      ),
                    r(this, "object", de);
                }
                function C(g, f, S) {
                  r(this, "own", !0), xe.apply(this, arguments);
                }
                function m(g, f, S) {
                  typeof f == "string" && ((S = f), (f = null)), S && r(this, "message", S);
                  var x = r(this, "object"),
                    B = Object.getOwnPropertyDescriptor(Object(x), g);
                  B && f
                    ? this.assert(
                        u.eql(f, B),
                        "expected the own property descriptor for " +
                          u.inspect(g) +
                          " on #{this} to match " +
                          u.inspect(f) +
                          ", got " +
                          u.inspect(B),
                        "expected the own property descriptor for " +
                          u.inspect(g) +
                          " on #{this} to not match " +
                          u.inspect(f),
                        f,
                        B,
                        !0
                      )
                    : this.assert(
                        B,
                        "expected #{this} to have an own property descriptor for " + u.inspect(g),
                        "expected #{this} to not have an own property descriptor for " + u.inspect(g)
                      ),
                    r(this, "object", B);
                }
                function k() {
                  r(this, "doLength", !0);
                }
                function H(g, f) {
                  f && r(this, "message", f);
                  var S,
                    x = r(this, "object"),
                    B = u.type(x).toLowerCase(),
                    T = r(this, "message"),
                    D = r(this, "ssfi"),
                    N = "length";
                  switch (B) {
                    case "map":
                    case "set":
                      (N = "size"), (S = x.size);
                      break;
                    default:
                      new c(x, T, D, !0).to.have.property("length"), (S = x.length);
                  }
                  this.assert(
                    S == g,
                    "expected #{this} to have a " + N + " of #{exp} but got #{act}",
                    "expected #{this} to not have a " + N + " of #{act}",
                    g,
                    S
                  );
                }
                function I(g, f) {
                  f && r(this, "message", f);
                  var S = r(this, "object");
                  this.assert(g.exec(S), "expected #{this} to match " + g, "expected #{this} not to match " + g);
                }
                function O(g) {
                  var f,
                    S,
                    x = r(this, "object"),
                    B = u.type(x),
                    T = u.type(g),
                    D = r(this, "ssfi"),
                    N = r(this, "deep"),
                    L = "",
                    A = !0,
                    Z = r(this, "message"),
                    K =
                      (Z = Z ? Z + ": " : "") +
                      "when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments";
                  if (B === "Map" || B === "Set")
                    (L = N ? "deeply " : ""),
                      (S = []),
                      x.forEach(function (Re, Wt) {
                        S.push(Wt);
                      }),
                      T !== "Array" && (g = Array.prototype.slice.call(arguments));
                  else {
                    switch (((S = u.getOwnEnumerableProperties(x)), T)) {
                      case "Array":
                        if (arguments.length > 1) throw new h(K, void 0, D);
                        break;
                      case "Object":
                        if (arguments.length > 1) throw new h(K, void 0, D);
                        g = Object.keys(g);
                        break;
                      default:
                        g = Array.prototype.slice.call(arguments);
                    }
                    g = g.map(function (Re) {
                      return typeof Re == "symbol" ? Re : String(Re);
                    });
                  }
                  if (!g.length) throw new h(Z + "keys required", void 0, D);
                  var Y = g.length,
                    de = r(this, "any"),
                    J = r(this, "all"),
                    Ae = g;
                  if (
                    (de || J || (J = !0),
                    de &&
                      (A = Ae.some(function (Re) {
                        return S.some(function (Wt) {
                          return N ? u.eql(Re, Wt) : Re === Wt;
                        });
                      })),
                    J &&
                      ((A = Ae.every(function (Re) {
                        return S.some(function (Wt) {
                          return N ? u.eql(Re, Wt) : Re === Wt;
                        });
                      })),
                      r(this, "contains") || (A = A && g.length == S.length)),
                    Y > 1)
                  ) {
                    var no = (g = g.map(function (Re) {
                      return u.inspect(Re);
                    })).pop();
                    J && (f = g.join(", ") + ", and " + no), de && (f = g.join(", ") + ", or " + no);
                  } else f = u.inspect(g[0]);
                  (f = (Y > 1 ? "keys " : "key ") + f),
                    (f = (r(this, "contains") ? "contain " : "have ") + f),
                    this.assert(
                      A,
                      "expected #{this} to " + L + f,
                      "expected #{this} to not " + L + f,
                      Ae.slice(0).sort(u.compareByInspect),
                      S.sort(u.compareByInspect),
                      !0
                    );
                }
                function z(g, f, S) {
                  S && r(this, "message", S);
                  var x,
                    B = r(this, "object"),
                    T = r(this, "ssfi"),
                    D = r(this, "message"),
                    N = r(this, "negate") || !1;
                  new c(B, D, T, !0).is.a("function"),
                    (g instanceof RegExp || typeof g == "string") && ((f = g), (g = null));
                  try {
                    B();
                  } catch (J) {
                    x = J;
                  }
                  var L = g === void 0 && f === void 0,
                    A = !!(g && f),
                    Z = !1,
                    K = !1;
                  if (L || (!L && !N)) {
                    var Y = "an error";
                    g instanceof Error ? (Y = "#{exp}") : g && (Y = u.checkError.getConstructorName(g)),
                      this.assert(
                        x,
                        "expected #{this} to throw " + Y,
                        "expected #{this} to not throw an error but #{act} was thrown",
                        g && g.toString(),
                        x instanceof Error
                          ? x.toString()
                          : typeof x == "string"
                            ? x
                            : x && u.checkError.getConstructorName(x)
                      );
                  }
                  if (
                    (g &&
                      x &&
                      (g instanceof Error &&
                        u.checkError.compatibleInstance(x, g) === N &&
                        (A && N
                          ? (Z = !0)
                          : this.assert(
                              N,
                              "expected #{this} to throw #{exp} but #{act} was thrown",
                              "expected #{this} to not throw #{exp}" + (x && !N ? " but #{act} was thrown" : ""),
                              g.toString(),
                              x.toString()
                            )),
                      u.checkError.compatibleConstructor(x, g) === N &&
                        (A && N
                          ? (Z = !0)
                          : this.assert(
                              N,
                              "expected #{this} to throw #{exp} but #{act} was thrown",
                              "expected #{this} to not throw #{exp}" + (x ? " but #{act} was thrown" : ""),
                              g instanceof Error ? g.toString() : g && u.checkError.getConstructorName(g),
                              x instanceof Error ? x.toString() : x && u.checkError.getConstructorName(x)
                            ))),
                    x && f != null)
                  ) {
                    var de = "including";
                    f instanceof RegExp && (de = "matching"),
                      u.checkError.compatibleMessage(x, f) === N &&
                        (A && N
                          ? (K = !0)
                          : this.assert(
                              N,
                              "expected #{this} to throw error " + de + " #{exp} but got #{act}",
                              "expected #{this} to throw error not " + de + " #{exp}",
                              f,
                              u.checkError.getMessage(x)
                            ));
                  }
                  Z &&
                    K &&
                    this.assert(
                      N,
                      "expected #{this} to throw #{exp} but #{act} was thrown",
                      "expected #{this} to not throw #{exp}" + (x ? " but #{act} was thrown" : ""),
                      g instanceof Error ? g.toString() : g && u.checkError.getConstructorName(g),
                      x instanceof Error ? x.toString() : x && u.checkError.getConstructorName(x)
                    ),
                    r(this, "object", x);
                }
                function Q(g, f) {
                  f && r(this, "message", f);
                  var S = r(this, "object"),
                    x = r(this, "itself"),
                    B = typeof S != "function" || x ? S[g] : S.prototype[g];
                  this.assert(
                    typeof B == "function",
                    "expected #{this} to respond to " + u.inspect(g),
                    "expected #{this} to not respond to " + u.inspect(g)
                  );
                }
                function me(g, f) {
                  f && r(this, "message", f);
                  var S = g(r(this, "object"));
                  this.assert(
                    S,
                    "expected #{this} to satisfy " + u.objDisplay(g),
                    "expected #{this} to not satisfy" + u.objDisplay(g),
                    !r(this, "negate"),
                    S
                  );
                }
                function Le(g, f, S) {
                  S && r(this, "message", S);
                  var x = r(this, "object"),
                    B = r(this, "message"),
                    T = r(this, "ssfi");
                  if ((new c(x, B, T, !0).is.a("number"), typeof g != "number" || typeof f != "number"))
                    throw new h(
                      (B = B ? B + ": " : "") +
                        "the arguments to closeTo or approximately must be numbers" +
                        (f === void 0 ? ", and a delta is required" : ""),
                      void 0,
                      T
                    );
                  this.assert(
                    Math.abs(x - g) <= f,
                    "expected #{this} to be close to " + g + " +/- " + f,
                    "expected #{this} not to be close to " + g + " +/- " + f
                  );
                }
                function kt(g, f, S, x, B) {
                  if (!x) {
                    if (g.length !== f.length) return !1;
                    f = f.slice();
                  }
                  return g.every(function (T, D) {
                    if (B) return S ? S(T, f[D]) : T === f[D];
                    if (!S) {
                      var N = f.indexOf(T);
                      return N !== -1 && (x || f.splice(N, 1), !0);
                    }
                    return f.some(function (L, A) {
                      return !!S(T, L) && (x || f.splice(A, 1), !0);
                    });
                  });
                }
                function qe(g, f) {
                  f && r(this, "message", f);
                  var S = r(this, "object"),
                    x = r(this, "message"),
                    B = r(this, "ssfi"),
                    T = r(this, "contains"),
                    D = r(this, "deep");
                  new c(g, x, B, !0).to.be.an("array"),
                    T
                      ? this.assert(
                          g.some(function (N) {
                            return S.indexOf(N) > -1;
                          }),
                          "expected #{this} to contain one of #{exp}",
                          "expected #{this} to not contain one of #{exp}",
                          g,
                          S
                        )
                      : D
                        ? this.assert(
                            g.some(function (N) {
                              return u.eql(S, N);
                            }),
                            "expected #{this} to deeply equal one of #{exp}",
                            "expected #{this} to deeply equal one of #{exp}",
                            g,
                            S
                          )
                        : this.assert(
                            g.indexOf(S) > -1,
                            "expected #{this} to be one of #{exp}",
                            "expected #{this} to not be one of #{exp}",
                            g,
                            S
                          );
                }
                function ro(g, f, S) {
                  S && r(this, "message", S);
                  var x,
                    B = r(this, "object"),
                    T = r(this, "message"),
                    D = r(this, "ssfi");
                  new c(B, T, D, !0).is.a("function"),
                    f
                      ? (new c(g, T, D, !0).to.have.property(f), (x = g[f]))
                      : (new c(g, T, D, !0).is.a("function"), (x = g())),
                    B();
                  var N = f == null ? g() : g[f],
                    L = f == null ? x : "." + f;
                  r(this, "deltaMsgObj", L),
                    r(this, "initialDeltaValue", x),
                    r(this, "finalDeltaValue", N),
                    r(this, "deltaBehavior", "change"),
                    r(this, "realDelta", N !== x),
                    this.assert(x !== N, "expected " + L + " to change", "expected " + L + " to not change");
                }
                function St(g, f, S) {
                  S && r(this, "message", S);
                  var x,
                    B = r(this, "object"),
                    T = r(this, "message"),
                    D = r(this, "ssfi");
                  new c(B, T, D, !0).is.a("function"),
                    f
                      ? (new c(g, T, D, !0).to.have.property(f), (x = g[f]))
                      : (new c(g, T, D, !0).is.a("function"), (x = g())),
                    new c(x, T, D, !0).is.a("number"),
                    B();
                  var N = f == null ? g() : g[f],
                    L = f == null ? x : "." + f;
                  r(this, "deltaMsgObj", L),
                    r(this, "initialDeltaValue", x),
                    r(this, "finalDeltaValue", N),
                    r(this, "deltaBehavior", "increase"),
                    r(this, "realDelta", N - x),
                    this.assert(N - x > 0, "expected " + L + " to increase", "expected " + L + " to not increase");
                }
                function Mt(g, f, S) {
                  S && r(this, "message", S);
                  var x,
                    B = r(this, "object"),
                    T = r(this, "message"),
                    D = r(this, "ssfi");
                  new c(B, T, D, !0).is.a("function"),
                    f
                      ? (new c(g, T, D, !0).to.have.property(f), (x = g[f]))
                      : (new c(g, T, D, !0).is.a("function"), (x = g())),
                    new c(x, T, D, !0).is.a("number"),
                    B();
                  var N = f == null ? g() : g[f],
                    L = f == null ? x : "." + f;
                  r(this, "deltaMsgObj", L),
                    r(this, "initialDeltaValue", x),
                    r(this, "finalDeltaValue", N),
                    r(this, "deltaBehavior", "decrease"),
                    r(this, "realDelta", x - N),
                    this.assert(N - x < 0, "expected " + L + " to decrease", "expected " + L + " to not decrease");
                }
                function nr(g, f) {
                  f && r(this, "message", f);
                  var S,
                    x = r(this, "deltaMsgObj"),
                    B = r(this, "initialDeltaValue"),
                    T = r(this, "finalDeltaValue"),
                    D = r(this, "deltaBehavior"),
                    N = r(this, "realDelta");
                  (S = D === "change" ? Math.abs(T - B) === Math.abs(g) : N === Math.abs(g)),
                    this.assert(
                      S,
                      "expected " + x + " to " + D + " by " + g,
                      "expected " + x + " to not " + D + " by " + g
                    );
                }
                [
                  "to",
                  "be",
                  "been",
                  "is",
                  "and",
                  "has",
                  "have",
                  "with",
                  "that",
                  "which",
                  "at",
                  "of",
                  "same",
                  "but",
                  "does",
                  "still",
                  "also",
                ].forEach(function (g) {
                  c.addProperty(g);
                }),
                  c.addProperty("not", function () {
                    r(this, "negate", !0);
                  }),
                  c.addProperty("deep", function () {
                    r(this, "deep", !0);
                  }),
                  c.addProperty("nested", function () {
                    r(this, "nested", !0);
                  }),
                  c.addProperty("own", function () {
                    r(this, "own", !0);
                  }),
                  c.addProperty("ordered", function () {
                    r(this, "ordered", !0);
                  }),
                  c.addProperty("any", function () {
                    r(this, "any", !0), r(this, "all", !1);
                  }),
                  c.addProperty("all", function () {
                    r(this, "all", !0), r(this, "any", !1);
                  }),
                  c.addChainableMethod("an", i),
                  c.addChainableMethod("a", i),
                  c.addChainableMethod("include", p, l),
                  c.addChainableMethod("contain", p, l),
                  c.addChainableMethod("contains", p, l),
                  c.addChainableMethod("includes", p, l),
                  c.addProperty("ok", function () {
                    this.assert(r(this, "object"), "expected #{this} to be truthy", "expected #{this} to be falsy");
                  }),
                  c.addProperty("true", function () {
                    this.assert(
                      r(this, "object") === !0,
                      "expected #{this} to be true",
                      "expected #{this} to be false",
                      !r(this, "negate")
                    );
                  }),
                  c.addProperty("false", function () {
                    this.assert(
                      r(this, "object") === !1,
                      "expected #{this} to be false",
                      "expected #{this} to be true",
                      !!r(this, "negate")
                    );
                  }),
                  c.addProperty("null", function () {
                    this.assert(
                      r(this, "object") === null,
                      "expected #{this} to be null",
                      "expected #{this} not to be null"
                    );
                  }),
                  c.addProperty("undefined", function () {
                    this.assert(
                      r(this, "object") === void 0,
                      "expected #{this} to be undefined",
                      "expected #{this} not to be undefined"
                    );
                  }),
                  c.addProperty("NaN", function () {
                    this.assert(
                      u.isNaN(r(this, "object")),
                      "expected #{this} to be NaN",
                      "expected #{this} not to be NaN"
                    );
                  }),
                  c.addProperty("exist", v),
                  c.addProperty("exists", v),
                  c.addProperty("empty", function () {
                    var g,
                      f = r(this, "object"),
                      S = r(this, "ssfi"),
                      x = r(this, "message");
                    switch (((x = x ? x + ": " : ""), u.type(f).toLowerCase())) {
                      case "array":
                      case "string":
                        g = f.length;
                        break;
                      case "map":
                      case "set":
                        g = f.size;
                        break;
                      case "weakmap":
                      case "weakset":
                        throw new h(x + ".empty was passed a weak collection", void 0, S);
                      case "function":
                        var B = x + ".empty was passed a function " + u.getName(f);
                        throw new h(B.trim(), void 0, S);
                      default:
                        if (f !== Object(f))
                          throw new h(x + ".empty was passed non-string primitive " + u.inspect(f), void 0, S);
                        g = Object.keys(f).length;
                    }
                    this.assert(g === 0, "expected #{this} to be empty", "expected #{this} not to be empty");
                  }),
                  c.addProperty("arguments", b),
                  c.addProperty("Arguments", b),
                  c.addMethod("equal", E),
                  c.addMethod("equals", E),
                  c.addMethod("eq", E),
                  c.addMethod("eql", M),
                  c.addMethod("eqls", M),
                  c.addMethod("above", V),
                  c.addMethod("gt", V),
                  c.addMethod("greaterThan", V),
                  c.addMethod("least", te),
                  c.addMethod("gte", te),
                  c.addMethod("greaterThanOrEqual", te),
                  c.addMethod("below", re),
                  c.addMethod("lt", re),
                  c.addMethod("lessThan", re),
                  c.addMethod("most", le),
                  c.addMethod("lte", le),
                  c.addMethod("lessThanOrEqual", le),
                  c.addMethod("within", function (g, f, S) {
                    S && r(this, "message", S);
                    var x,
                      B = r(this, "object"),
                      T = r(this, "doLength"),
                      D = r(this, "message"),
                      N = D ? D + ": " : "",
                      L = r(this, "ssfi"),
                      A = u.type(B).toLowerCase(),
                      Z = u.type(g).toLowerCase(),
                      K = u.type(f).toLowerCase(),
                      Y = !0,
                      de = Z === "date" && K === "date" ? g.toUTCString() + ".." + f.toUTCString() : g + ".." + f;
                    if (
                      (T && A !== "map" && A !== "set" && new c(B, D, L, !0).to.have.property("length"),
                      T || A !== "date" || (Z === "date" && K === "date")
                        ? (Z === "number" && K === "number") || (!T && A !== "number")
                          ? T || A === "date" || A === "number"
                            ? (Y = !1)
                            : (x = N + "expected " + (A === "string" ? "'" + B + "'" : B) + " to be a number or a date")
                          : (x = N + "the arguments to within must be numbers")
                        : (x = N + "the arguments to within must be dates"),
                      Y)
                    )
                      throw new h(x, void 0, L);
                    if (T) {
                      var J,
                        Ae = "length";
                      A === "map" || A === "set" ? ((Ae = "size"), (J = B.size)) : (J = B.length),
                        this.assert(
                          J >= g && J <= f,
                          "expected #{this} to have a " + Ae + " within " + de,
                          "expected #{this} to not have a " + Ae + " within " + de
                        );
                    } else
                      this.assert(
                        B >= g && B <= f,
                        "expected #{this} to be within " + de,
                        "expected #{this} to not be within " + de
                      );
                  }),
                  c.addMethod("instanceof", ae),
                  c.addMethod("instanceOf", ae),
                  c.addMethod("property", xe),
                  c.addMethod("ownProperty", C),
                  c.addMethod("haveOwnProperty", C),
                  c.addMethod("ownPropertyDescriptor", m),
                  c.addMethod("haveOwnPropertyDescriptor", m),
                  c.addChainableMethod("length", H, k),
                  c.addChainableMethod("lengthOf", H, k),
                  c.addMethod("match", I),
                  c.addMethod("matches", I),
                  c.addMethod("string", function (g, f) {
                    f && r(this, "message", f);
                    var S = r(this, "object"),
                      x = r(this, "message"),
                      B = r(this, "ssfi");
                    new c(S, x, B, !0).is.a("string"),
                      this.assert(
                        ~S.indexOf(g),
                        "expected #{this} to contain " + u.inspect(g),
                        "expected #{this} to not contain " + u.inspect(g)
                      );
                  }),
                  c.addMethod("keys", O),
                  c.addMethod("key", O),
                  c.addMethod("throw", z),
                  c.addMethod("throws", z),
                  c.addMethod("Throw", z),
                  c.addMethod("respondTo", Q),
                  c.addMethod("respondsTo", Q),
                  c.addProperty("itself", function () {
                    r(this, "itself", !0);
                  }),
                  c.addMethod("satisfy", me),
                  c.addMethod("satisfies", me),
                  c.addMethod("closeTo", Le),
                  c.addMethod("approximately", Le),
                  c.addMethod("members", function (g, f) {
                    f && r(this, "message", f);
                    var S = r(this, "object"),
                      x = r(this, "message"),
                      B = r(this, "ssfi");
                    new c(S, x, B, !0).to.be.an("array"), new c(g, x, B, !0).to.be.an("array");
                    var T,
                      D,
                      N,
                      L = r(this, "contains"),
                      A = r(this, "ordered");
                    L
                      ? ((D =
                          "expected #{this} to be " + (T = A ? "an ordered superset" : "a superset") + " of #{exp}"),
                        (N = "expected #{this} to not be " + T + " of #{exp}"))
                      : ((D =
                          "expected #{this} to have the same " +
                          (T = A ? "ordered members" : "members") +
                          " as #{exp}"),
                        (N = "expected #{this} to not have the same " + T + " as #{exp}"));
                    var Z = r(this, "deep") ? u.eql : void 0;
                    this.assert(kt(g, S, Z, L, A), D, N, g, S, !0);
                  }),
                  c.addMethod("oneOf", qe),
                  c.addMethod("change", ro),
                  c.addMethod("changes", ro),
                  c.addMethod("increase", St),
                  c.addMethod("increases", St),
                  c.addMethod("decrease", Mt),
                  c.addMethod("decreases", Mt),
                  c.addMethod("by", nr),
                  c.addProperty("extensible", function () {
                    var g = r(this, "object"),
                      f = g === Object(g) && Object.isExtensible(g);
                    this.assert(f, "expected #{this} to be extensible", "expected #{this} to not be extensible");
                  }),
                  c.addProperty("sealed", function () {
                    var g = r(this, "object"),
                      f = g !== Object(g) || Object.isSealed(g);
                    this.assert(f, "expected #{this} to be sealed", "expected #{this} to not be sealed");
                  }),
                  c.addProperty("frozen", function () {
                    var g = r(this, "object"),
                      f = g !== Object(g) || Object.isFrozen(g);
                    this.assert(f, "expected #{this} to be frozen", "expected #{this} to not be frozen");
                  }),
                  c.addProperty("finite", function (g) {
                    var f = r(this, "object");
                    this.assert(
                      typeof f == "number" && isFinite(f),
                      "expected #{this} to be a finite number",
                      "expected #{this} to not be a finite number"
                    );
                  });
              };
            },
            {},
          ],
          6: [
            function (t, n, a) {
              n.exports = function (d, u) {
                var c = d.Assertion,
                  h = u.flag,
                  r = (d.assert = function (i, s) {
                    new c(null, null, d.assert, !0).assert(i, s, "[ negation message unavailable ]");
                  });
                (r.fail = function (i, s, l, p) {
                  throw (
                    (arguments.length < 2 && ((l = i), (i = void 0)),
                    (l = l || "assert.fail()"),
                    new d.AssertionError(l, { actual: i, expected: s, operator: p }, r.fail))
                  );
                }),
                  (r.isOk = function (i, s) {
                    new c(i, s, r.isOk, !0).is.ok;
                  }),
                  (r.isNotOk = function (i, s) {
                    new c(i, s, r.isNotOk, !0).is.not.ok;
                  }),
                  (r.equal = function (i, s, l) {
                    var p = new c(i, l, r.equal, !0);
                    p.assert(
                      s == h(p, "object"),
                      "expected #{this} to equal #{exp}",
                      "expected #{this} to not equal #{act}",
                      s,
                      i,
                      !0
                    );
                  }),
                  (r.notEqual = function (i, s, l) {
                    var p = new c(i, l, r.notEqual, !0);
                    p.assert(
                      s != h(p, "object"),
                      "expected #{this} to not equal #{exp}",
                      "expected #{this} to equal #{act}",
                      s,
                      i,
                      !0
                    );
                  }),
                  (r.strictEqual = function (i, s, l) {
                    new c(i, l, r.strictEqual, !0).to.equal(s);
                  }),
                  (r.notStrictEqual = function (i, s, l) {
                    new c(i, l, r.notStrictEqual, !0).to.not.equal(s);
                  }),
                  (r.deepEqual = r.deepStrictEqual =
                    function (i, s, l) {
                      new c(i, l, r.deepEqual, !0).to.eql(s);
                    }),
                  (r.notDeepEqual = function (i, s, l) {
                    new c(i, l, r.notDeepEqual, !0).to.not.eql(s);
                  }),
                  (r.isAbove = function (i, s, l) {
                    new c(i, l, r.isAbove, !0).to.be.above(s);
                  }),
                  (r.isAtLeast = function (i, s, l) {
                    new c(i, l, r.isAtLeast, !0).to.be.least(s);
                  }),
                  (r.isBelow = function (i, s, l) {
                    new c(i, l, r.isBelow, !0).to.be.below(s);
                  }),
                  (r.isAtMost = function (i, s, l) {
                    new c(i, l, r.isAtMost, !0).to.be.most(s);
                  }),
                  (r.isTrue = function (i, s) {
                    new c(i, s, r.isTrue, !0).is.true;
                  }),
                  (r.isNotTrue = function (i, s) {
                    new c(i, s, r.isNotTrue, !0).to.not.equal(!0);
                  }),
                  (r.isFalse = function (i, s) {
                    new c(i, s, r.isFalse, !0).is.false;
                  }),
                  (r.isNotFalse = function (i, s) {
                    new c(i, s, r.isNotFalse, !0).to.not.equal(!1);
                  }),
                  (r.isNull = function (i, s) {
                    new c(i, s, r.isNull, !0).to.equal(null);
                  }),
                  (r.isNotNull = function (i, s) {
                    new c(i, s, r.isNotNull, !0).to.not.equal(null);
                  }),
                  (r.isNaN = function (i, s) {
                    new c(i, s, r.isNaN, !0).to.be.NaN;
                  }),
                  (r.isNotNaN = function (i, s) {
                    new c(i, s, r.isNotNaN, !0).not.to.be.NaN;
                  }),
                  (r.exists = function (i, s) {
                    new c(i, s, r.exists, !0).to.exist;
                  }),
                  (r.notExists = function (i, s) {
                    new c(i, s, r.notExists, !0).to.not.exist;
                  }),
                  (r.isUndefined = function (i, s) {
                    new c(i, s, r.isUndefined, !0).to.equal(void 0);
                  }),
                  (r.isDefined = function (i, s) {
                    new c(i, s, r.isDefined, !0).to.not.equal(void 0);
                  }),
                  (r.isFunction = function (i, s) {
                    new c(i, s, r.isFunction, !0).to.be.a("function");
                  }),
                  (r.isNotFunction = function (i, s) {
                    new c(i, s, r.isNotFunction, !0).to.not.be.a("function");
                  }),
                  (r.isObject = function (i, s) {
                    new c(i, s, r.isObject, !0).to.be.a("object");
                  }),
                  (r.isNotObject = function (i, s) {
                    new c(i, s, r.isNotObject, !0).to.not.be.a("object");
                  }),
                  (r.isArray = function (i, s) {
                    new c(i, s, r.isArray, !0).to.be.an("array");
                  }),
                  (r.isNotArray = function (i, s) {
                    new c(i, s, r.isNotArray, !0).to.not.be.an("array");
                  }),
                  (r.isString = function (i, s) {
                    new c(i, s, r.isString, !0).to.be.a("string");
                  }),
                  (r.isNotString = function (i, s) {
                    new c(i, s, r.isNotString, !0).to.not.be.a("string");
                  }),
                  (r.isNumber = function (i, s) {
                    new c(i, s, r.isNumber, !0).to.be.a("number");
                  }),
                  (r.isNotNumber = function (i, s) {
                    new c(i, s, r.isNotNumber, !0).to.not.be.a("number");
                  }),
                  (r.isFinite = function (i, s) {
                    new c(i, s, r.isFinite, !0).to.be.finite;
                  }),
                  (r.isBoolean = function (i, s) {
                    new c(i, s, r.isBoolean, !0).to.be.a("boolean");
                  }),
                  (r.isNotBoolean = function (i, s) {
                    new c(i, s, r.isNotBoolean, !0).to.not.be.a("boolean");
                  }),
                  (r.typeOf = function (i, s, l) {
                    new c(i, l, r.typeOf, !0).to.be.a(s);
                  }),
                  (r.notTypeOf = function (i, s, l) {
                    new c(i, l, r.notTypeOf, !0).to.not.be.a(s);
                  }),
                  (r.instanceOf = function (i, s, l) {
                    new c(i, l, r.instanceOf, !0).to.be.instanceOf(s);
                  }),
                  (r.notInstanceOf = function (i, s, l) {
                    new c(i, l, r.notInstanceOf, !0).to.not.be.instanceOf(s);
                  }),
                  (r.include = function (i, s, l) {
                    new c(i, l, r.include, !0).include(s);
                  }),
                  (r.notInclude = function (i, s, l) {
                    new c(i, l, r.notInclude, !0).not.include(s);
                  }),
                  (r.deepInclude = function (i, s, l) {
                    new c(i, l, r.deepInclude, !0).deep.include(s);
                  }),
                  (r.notDeepInclude = function (i, s, l) {
                    new c(i, l, r.notDeepInclude, !0).not.deep.include(s);
                  }),
                  (r.nestedInclude = function (i, s, l) {
                    new c(i, l, r.nestedInclude, !0).nested.include(s);
                  }),
                  (r.notNestedInclude = function (i, s, l) {
                    new c(i, l, r.notNestedInclude, !0).not.nested.include(s);
                  }),
                  (r.deepNestedInclude = function (i, s, l) {
                    new c(i, l, r.deepNestedInclude, !0).deep.nested.include(s);
                  }),
                  (r.notDeepNestedInclude = function (i, s, l) {
                    new c(i, l, r.notDeepNestedInclude, !0).not.deep.nested.include(s);
                  }),
                  (r.ownInclude = function (i, s, l) {
                    new c(i, l, r.ownInclude, !0).own.include(s);
                  }),
                  (r.notOwnInclude = function (i, s, l) {
                    new c(i, l, r.notOwnInclude, !0).not.own.include(s);
                  }),
                  (r.deepOwnInclude = function (i, s, l) {
                    new c(i, l, r.deepOwnInclude, !0).deep.own.include(s);
                  }),
                  (r.notDeepOwnInclude = function (i, s, l) {
                    new c(i, l, r.notDeepOwnInclude, !0).not.deep.own.include(s);
                  }),
                  (r.match = function (i, s, l) {
                    new c(i, l, r.match, !0).to.match(s);
                  }),
                  (r.notMatch = function (i, s, l) {
                    new c(i, l, r.notMatch, !0).to.not.match(s);
                  }),
                  (r.property = function (i, s, l) {
                    new c(i, l, r.property, !0).to.have.property(s);
                  }),
                  (r.notProperty = function (i, s, l) {
                    new c(i, l, r.notProperty, !0).to.not.have.property(s);
                  }),
                  (r.propertyVal = function (i, s, l, p) {
                    new c(i, p, r.propertyVal, !0).to.have.property(s, l);
                  }),
                  (r.notPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.notPropertyVal, !0).to.not.have.property(s, l);
                  }),
                  (r.deepPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.deepPropertyVal, !0).to.have.deep.property(s, l);
                  }),
                  (r.notDeepPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.notDeepPropertyVal, !0).to.not.have.deep.property(s, l);
                  }),
                  (r.ownProperty = function (i, s, l) {
                    new c(i, l, r.ownProperty, !0).to.have.own.property(s);
                  }),
                  (r.notOwnProperty = function (i, s, l) {
                    new c(i, l, r.notOwnProperty, !0).to.not.have.own.property(s);
                  }),
                  (r.ownPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.ownPropertyVal, !0).to.have.own.property(s, l);
                  }),
                  (r.notOwnPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.notOwnPropertyVal, !0).to.not.have.own.property(s, l);
                  }),
                  (r.deepOwnPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.deepOwnPropertyVal, !0).to.have.deep.own.property(s, l);
                  }),
                  (r.notDeepOwnPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.notDeepOwnPropertyVal, !0).to.not.have.deep.own.property(s, l);
                  }),
                  (r.nestedProperty = function (i, s, l) {
                    new c(i, l, r.nestedProperty, !0).to.have.nested.property(s);
                  }),
                  (r.notNestedProperty = function (i, s, l) {
                    new c(i, l, r.notNestedProperty, !0).to.not.have.nested.property(s);
                  }),
                  (r.nestedPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.nestedPropertyVal, !0).to.have.nested.property(s, l);
                  }),
                  (r.notNestedPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.notNestedPropertyVal, !0).to.not.have.nested.property(s, l);
                  }),
                  (r.deepNestedPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.deepNestedPropertyVal, !0).to.have.deep.nested.property(s, l);
                  }),
                  (r.notDeepNestedPropertyVal = function (i, s, l, p) {
                    new c(i, p, r.notDeepNestedPropertyVal, !0).to.not.have.deep.nested.property(s, l);
                  }),
                  (r.lengthOf = function (i, s, l) {
                    new c(i, l, r.lengthOf, !0).to.have.lengthOf(s);
                  }),
                  (r.hasAnyKeys = function (i, s, l) {
                    new c(i, l, r.hasAnyKeys, !0).to.have.any.keys(s);
                  }),
                  (r.hasAllKeys = function (i, s, l) {
                    new c(i, l, r.hasAllKeys, !0).to.have.all.keys(s);
                  }),
                  (r.containsAllKeys = function (i, s, l) {
                    new c(i, l, r.containsAllKeys, !0).to.contain.all.keys(s);
                  }),
                  (r.doesNotHaveAnyKeys = function (i, s, l) {
                    new c(i, l, r.doesNotHaveAnyKeys, !0).to.not.have.any.keys(s);
                  }),
                  (r.doesNotHaveAllKeys = function (i, s, l) {
                    new c(i, l, r.doesNotHaveAllKeys, !0).to.not.have.all.keys(s);
                  }),
                  (r.hasAnyDeepKeys = function (i, s, l) {
                    new c(i, l, r.hasAnyDeepKeys, !0).to.have.any.deep.keys(s);
                  }),
                  (r.hasAllDeepKeys = function (i, s, l) {
                    new c(i, l, r.hasAllDeepKeys, !0).to.have.all.deep.keys(s);
                  }),
                  (r.containsAllDeepKeys = function (i, s, l) {
                    new c(i, l, r.containsAllDeepKeys, !0).to.contain.all.deep.keys(s);
                  }),
                  (r.doesNotHaveAnyDeepKeys = function (i, s, l) {
                    new c(i, l, r.doesNotHaveAnyDeepKeys, !0).to.not.have.any.deep.keys(s);
                  }),
                  (r.doesNotHaveAllDeepKeys = function (i, s, l) {
                    new c(i, l, r.doesNotHaveAllDeepKeys, !0).to.not.have.all.deep.keys(s);
                  }),
                  (r.throws = function (i, s, l, p) {
                    (typeof s == "string" || s instanceof RegExp) && ((l = s), (s = null));
                    var v = new c(i, p, r.throws, !0).to.throw(s, l);
                    return h(v, "object");
                  }),
                  (r.doesNotThrow = function (i, s, l, p) {
                    (typeof s == "string" || s instanceof RegExp) && ((l = s), (s = null)),
                      new c(i, p, r.doesNotThrow, !0).to.not.throw(s, l);
                  }),
                  (r.operator = function (i, s, l, p) {
                    var v;
                    switch (s) {
                      case "==":
                        v = i == l;
                        break;
                      case "===":
                        v = i === l;
                        break;
                      case ">":
                        v = i > l;
                        break;
                      case ">=":
                        v = i >= l;
                        break;
                      case "<":
                        v = i < l;
                        break;
                      case "<=":
                        v = i <= l;
                        break;
                      case "!=":
                        v = i != l;
                        break;
                      case "!==":
                        v = i !== l;
                        break;
                      default:
                        throw (
                          ((p = p && p + ": "),
                          new d.AssertionError(p + 'Invalid operator "' + s + '"', void 0, r.operator))
                        );
                    }
                    var b = new c(v, p, r.operator, !0);
                    b.assert(
                      h(b, "object") === !0,
                      "expected " + u.inspect(i) + " to be " + s + " " + u.inspect(l),
                      "expected " + u.inspect(i) + " to not be " + s + " " + u.inspect(l)
                    );
                  }),
                  (r.closeTo = function (i, s, l, p) {
                    new c(i, p, r.closeTo, !0).to.be.closeTo(s, l);
                  }),
                  (r.approximately = function (i, s, l, p) {
                    new c(i, p, r.approximately, !0).to.be.approximately(s, l);
                  }),
                  (r.sameMembers = function (i, s, l) {
                    new c(i, l, r.sameMembers, !0).to.have.same.members(s);
                  }),
                  (r.notSameMembers = function (i, s, l) {
                    new c(i, l, r.notSameMembers, !0).to.not.have.same.members(s);
                  }),
                  (r.sameDeepMembers = function (i, s, l) {
                    new c(i, l, r.sameDeepMembers, !0).to.have.same.deep.members(s);
                  }),
                  (r.notSameDeepMembers = function (i, s, l) {
                    new c(i, l, r.notSameDeepMembers, !0).to.not.have.same.deep.members(s);
                  }),
                  (r.sameOrderedMembers = function (i, s, l) {
                    new c(i, l, r.sameOrderedMembers, !0).to.have.same.ordered.members(s);
                  }),
                  (r.notSameOrderedMembers = function (i, s, l) {
                    new c(i, l, r.notSameOrderedMembers, !0).to.not.have.same.ordered.members(s);
                  }),
                  (r.sameDeepOrderedMembers = function (i, s, l) {
                    new c(i, l, r.sameDeepOrderedMembers, !0).to.have.same.deep.ordered.members(s);
                  }),
                  (r.notSameDeepOrderedMembers = function (i, s, l) {
                    new c(i, l, r.notSameDeepOrderedMembers, !0).to.not.have.same.deep.ordered.members(s);
                  }),
                  (r.includeMembers = function (i, s, l) {
                    new c(i, l, r.includeMembers, !0).to.include.members(s);
                  }),
                  (r.notIncludeMembers = function (i, s, l) {
                    new c(i, l, r.notIncludeMembers, !0).to.not.include.members(s);
                  }),
                  (r.includeDeepMembers = function (i, s, l) {
                    new c(i, l, r.includeDeepMembers, !0).to.include.deep.members(s);
                  }),
                  (r.notIncludeDeepMembers = function (i, s, l) {
                    new c(i, l, r.notIncludeDeepMembers, !0).to.not.include.deep.members(s);
                  }),
                  (r.includeOrderedMembers = function (i, s, l) {
                    new c(i, l, r.includeOrderedMembers, !0).to.include.ordered.members(s);
                  }),
                  (r.notIncludeOrderedMembers = function (i, s, l) {
                    new c(i, l, r.notIncludeOrderedMembers, !0).to.not.include.ordered.members(s);
                  }),
                  (r.includeDeepOrderedMembers = function (i, s, l) {
                    new c(i, l, r.includeDeepOrderedMembers, !0).to.include.deep.ordered.members(s);
                  }),
                  (r.notIncludeDeepOrderedMembers = function (i, s, l) {
                    new c(i, l, r.notIncludeDeepOrderedMembers, !0).to.not.include.deep.ordered.members(s);
                  }),
                  (r.oneOf = function (i, s, l) {
                    new c(i, l, r.oneOf, !0).to.be.oneOf(s);
                  }),
                  (r.changes = function (i, s, l, p) {
                    arguments.length === 3 && typeof s == "function" && ((p = l), (l = null)),
                      new c(i, p, r.changes, !0).to.change(s, l);
                  }),
                  (r.changesBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    new c(i, v, r.changesBy, !0).to.change(s, l).by(p);
                  }),
                  (r.doesNotChange = function (i, s, l, p) {
                    return (
                      arguments.length === 3 && typeof s == "function" && ((p = l), (l = null)),
                      new c(i, p, r.doesNotChange, !0).to.not.change(s, l)
                    );
                  }),
                  (r.changesButNotBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    new c(i, v, r.changesButNotBy, !0).to.change(s, l).but.not.by(p);
                  }),
                  (r.increases = function (i, s, l, p) {
                    return (
                      arguments.length === 3 && typeof s == "function" && ((p = l), (l = null)),
                      new c(i, p, r.increases, !0).to.increase(s, l)
                    );
                  }),
                  (r.increasesBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    new c(i, v, r.increasesBy, !0).to.increase(s, l).by(p);
                  }),
                  (r.doesNotIncrease = function (i, s, l, p) {
                    return (
                      arguments.length === 3 && typeof s == "function" && ((p = l), (l = null)),
                      new c(i, p, r.doesNotIncrease, !0).to.not.increase(s, l)
                    );
                  }),
                  (r.increasesButNotBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    new c(i, v, r.increasesButNotBy, !0).to.increase(s, l).but.not.by(p);
                  }),
                  (r.decreases = function (i, s, l, p) {
                    return (
                      arguments.length === 3 && typeof s == "function" && ((p = l), (l = null)),
                      new c(i, p, r.decreases, !0).to.decrease(s, l)
                    );
                  }),
                  (r.decreasesBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    new c(i, v, r.decreasesBy, !0).to.decrease(s, l).by(p);
                  }),
                  (r.doesNotDecrease = function (i, s, l, p) {
                    return (
                      arguments.length === 3 && typeof s == "function" && ((p = l), (l = null)),
                      new c(i, p, r.doesNotDecrease, !0).to.not.decrease(s, l)
                    );
                  }),
                  (r.doesNotDecreaseBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    return new c(i, v, r.doesNotDecreaseBy, !0).to.not.decrease(s, l).by(p);
                  }),
                  (r.decreasesButNotBy = function (i, s, l, p, v) {
                    if (arguments.length === 4 && typeof s == "function") {
                      var b = p;
                      (p = l), (v = b);
                    } else arguments.length === 3 && ((p = l), (l = null));
                    new c(i, v, r.decreasesButNotBy, !0).to.decrease(s, l).but.not.by(p);
                  }),
                  (r.ifError = function (i) {
                    if (i) throw i;
                  }),
                  (r.isExtensible = function (i, s) {
                    new c(i, s, r.isExtensible, !0).to.be.extensible;
                  }),
                  (r.isNotExtensible = function (i, s) {
                    new c(i, s, r.isNotExtensible, !0).to.not.be.extensible;
                  }),
                  (r.isSealed = function (i, s) {
                    new c(i, s, r.isSealed, !0).to.be.sealed;
                  }),
                  (r.isNotSealed = function (i, s) {
                    new c(i, s, r.isNotSealed, !0).to.not.be.sealed;
                  }),
                  (r.isFrozen = function (i, s) {
                    new c(i, s, r.isFrozen, !0).to.be.frozen;
                  }),
                  (r.isNotFrozen = function (i, s) {
                    new c(i, s, r.isNotFrozen, !0).to.not.be.frozen;
                  }),
                  (r.isEmpty = function (i, s) {
                    new c(i, s, r.isEmpty, !0).to.be.empty;
                  }),
                  (r.isNotEmpty = function (i, s) {
                    new c(i, s, r.isNotEmpty, !0).to.not.be.empty;
                  }),
                  (function i(s, l) {
                    return (r[l] = r[s]), i;
                  })("isOk", "ok")("isNotOk", "notOk")("throws", "throw")("throws", "Throw")(
                    "isExtensible",
                    "extensible"
                  )("isNotExtensible", "notExtensible")("isSealed", "sealed")("isNotSealed", "notSealed")(
                    "isFrozen",
                    "frozen"
                  )("isNotFrozen", "notFrozen")("isEmpty", "empty")("isNotEmpty", "notEmpty");
              };
            },
            {},
          ],
          7: [
            function (t, n, a) {
              n.exports = function (d, u) {
                (d.expect = function (c, h) {
                  return new d.Assertion(c, h);
                }),
                  (d.expect.fail = function (c, h, r, i) {
                    throw (
                      (arguments.length < 2 && ((r = c), (c = void 0)),
                      (r = r || "expect.fail()"),
                      new d.AssertionError(r, { actual: c, expected: h, operator: i }, d.expect.fail))
                    );
                  });
              };
            },
            {},
          ],
          8: [
            function (t, n, a) {
              n.exports = function (d, u) {
                var c = d.Assertion;
                function h() {
                  function r() {
                    return this instanceof String ||
                      this instanceof Number ||
                      this instanceof Boolean ||
                      (typeof Symbol == "function" && this instanceof Symbol) ||
                      (typeof BigInt == "function" && this instanceof BigInt)
                      ? new c(this.valueOf(), null, r)
                      : new c(this, null, r);
                  }
                  function i(l) {
                    Object.defineProperty(this, "should", { value: l, enumerable: !0, configurable: !0, writable: !0 });
                  }
                  Object.defineProperty(Object.prototype, "should", { set: i, get: r, configurable: !0 });
                  var s = {
                    fail: function (l, p, v, b) {
                      throw (
                        (arguments.length < 2 && ((v = l), (l = void 0)),
                        (v = v || "should.fail()"),
                        new d.AssertionError(v, { actual: l, expected: p, operator: b }, s.fail))
                      );
                    },
                    equal: function (l, p, v) {
                      new c(l, v).to.equal(p);
                    },
                    Throw: function (l, p, v, b) {
                      new c(l, b).to.Throw(p, v);
                    },
                    exist: function (l, p) {
                      new c(l, p).to.exist;
                    },
                    not: {},
                  };
                  return (
                    (s.not.equal = function (l, p, v) {
                      new c(l, v).to.not.equal(p);
                    }),
                    (s.not.Throw = function (l, p, v, b) {
                      new c(l, b).to.not.Throw(p, v);
                    }),
                    (s.not.exist = function (l, p) {
                      new c(l, p).to.not.exist;
                    }),
                    (s.throw = s.Throw),
                    (s.not.throw = s.not.Throw),
                    s
                  );
                }
                (d.should = h), (d.Should = h);
              };
            },
            {},
          ],
          9: [
            function (t, n, a) {
              var d = t("./addLengthGuard"),
                u = t("../../chai"),
                c = t("./flag"),
                h = t("./proxify"),
                r = t("./transferFlags"),
                i = typeof Object.setPrototypeOf == "function",
                s = function () {},
                l = Object.getOwnPropertyNames(s).filter(function (b) {
                  var E = Object.getOwnPropertyDescriptor(s, b);
                  return typeof E != "object" || !E.configurable;
                }),
                p = Function.prototype.call,
                v = Function.prototype.apply;
              n.exports = function (b, E, M, V) {
                typeof V != "function" && (V = function () {});
                var te = { method: M, chainingBehavior: V };
                b.__methods || (b.__methods = {}),
                  (b.__methods[E] = te),
                  Object.defineProperty(b, E, {
                    get: function () {
                      te.chainingBehavior.call(this);
                      var re = function () {
                        c(this, "lockSsfi") || c(this, "ssfi", re);
                        var ae = te.method.apply(this, arguments);
                        if (ae !== void 0) return ae;
                        var xe = new u.Assertion();
                        return r(this, xe), xe;
                      };
                      if ((d(re, E, !0), i)) {
                        var le = Object.create(this);
                        (le.call = p), (le.apply = v), Object.setPrototypeOf(re, le);
                      } else
                        Object.getOwnPropertyNames(b).forEach(function (ae) {
                          if (l.indexOf(ae) === -1) {
                            var xe = Object.getOwnPropertyDescriptor(b, ae);
                            Object.defineProperty(re, ae, xe);
                          }
                        });
                      return r(this, re), h(re);
                    },
                    configurable: !0,
                  });
              };
            },
            { "../../chai": 2, "./addLengthGuard": 10, "./flag": 15, "./proxify": 31, "./transferFlags": 33 },
          ],
          10: [
            function (t, n, a) {
              var d = Object.getOwnPropertyDescriptor(function () {}, "length");
              n.exports = function (u, c, h) {
                return (
                  d.configurable &&
                    Object.defineProperty(u, "length", {
                      get: function () {
                        throw Error(
                          h
                            ? "Invalid Chai property: " +
                                c +
                                '.length. Due to a compatibility issue, "length" cannot directly follow "' +
                                c +
                                '". Use "' +
                                c +
                                '.lengthOf" instead.'
                            : "Invalid Chai property: " + c + '.length. See docs for proper usage of "' + c + '".'
                        );
                      },
                    }),
                  u
                );
              };
            },
            {},
          ],
          11: [
            function (t, n, a) {
              var d = t("./addLengthGuard"),
                u = t("../../chai"),
                c = t("./flag"),
                h = t("./proxify"),
                r = t("./transferFlags");
              n.exports = function (i, s, l) {
                var p = function () {
                  c(this, "lockSsfi") || c(this, "ssfi", p);
                  var v = l.apply(this, arguments);
                  if (v !== void 0) return v;
                  var b = new u.Assertion();
                  return r(this, b), b;
                };
                d(p, s, !1), (i[s] = h(p, s));
              };
            },
            { "../../chai": 2, "./addLengthGuard": 10, "./flag": 15, "./proxify": 31, "./transferFlags": 33 },
          ],
          12: [
            function (t, n, a) {
              var d = t("../../chai"),
                u = t("./flag"),
                c = t("./isProxyEnabled"),
                h = t("./transferFlags");
              n.exports = function (r, i, s) {
                (s = s === void 0 ? function () {} : s),
                  Object.defineProperty(r, i, {
                    get: function l() {
                      c() || u(this, "lockSsfi") || u(this, "ssfi", l);
                      var p = s.call(this);
                      if (p !== void 0) return p;
                      var v = new d.Assertion();
                      return h(this, v), v;
                    },
                    configurable: !0,
                  });
              };
            },
            { "../../chai": 2, "./flag": 15, "./isProxyEnabled": 26, "./transferFlags": 33 },
          ],
          13: [
            function (t, n, a) {
              var d = t("./inspect");
              n.exports = function (u, c) {
                return d(u) < d(c) ? -1 : 1;
              };
            },
            { "./inspect": 24 },
          ],
          14: [
            function (t, n, a) {
              var d = t("assertion-error"),
                u = t("./flag"),
                c = t("type-detect");
              n.exports = function (h, r) {
                var i = u(h, "message"),
                  s = u(h, "ssfi");
                (i = i ? i + ": " : ""),
                  (h = u(h, "object")),
                  (r = r.map(function (v) {
                    return v.toLowerCase();
                  })).sort();
                var l = r
                    .map(function (v, b) {
                      var E = ~["a", "e", "i", "o", "u"].indexOf(v.charAt(0)) ? "an" : "a";
                      return (r.length > 1 && b === r.length - 1 ? "or " : "") + E + " " + v;
                    })
                    .join(", "),
                  p = c(h).toLowerCase();
                if (
                  !r.some(function (v) {
                    return p === v;
                  })
                )
                  throw new d(i + "object tested must be " + l + ", but " + p + " given", void 0, s);
              };
            },
            { "./flag": 15, "assertion-error": 34, "type-detect": 39 },
          ],
          15: [
            function (t, n, a) {
              n.exports = function (d, u, c) {
                var h = d.__flags || (d.__flags = Object.create(null));
                if (arguments.length !== 3) return h[u];
                h[u] = c;
              };
            },
            {},
          ],
          16: [
            function (t, n, a) {
              n.exports = function (d, u) {
                return u.length > 4 ? u[4] : d._obj;
              };
            },
            {},
          ],
          17: [
            function (t, n, a) {
              n.exports = function (d) {
                var u = [];
                for (var c in d) u.push(c);
                return u;
              };
            },
            {},
          ],
          18: [
            function (t, n, a) {
              var d = t("./flag"),
                u = t("./getActual"),
                c = t("./objDisplay");
              n.exports = function (h, r) {
                var i = d(h, "negate"),
                  s = d(h, "object"),
                  l = r[3],
                  p = u(h, r),
                  v = i ? r[2] : r[1],
                  b = d(h, "message");
                return (
                  typeof v == "function" && (v = v()),
                  (v = (v = v || "")
                    .replace(/#\{this\}/g, function () {
                      return c(s);
                    })
                    .replace(/#\{act\}/g, function () {
                      return c(p);
                    })
                    .replace(/#\{exp\}/g, function () {
                      return c(l);
                    })),
                  b ? b + ": " + v : v
                );
              };
            },
            { "./flag": 15, "./getActual": 16, "./objDisplay": 27 },
          ],
          19: [
            function (t, n, a) {
              var d = t("type-detect"),
                u = t("./flag");
              function c(h) {
                var r = d(h);
                return ["Array", "Object", "function"].indexOf(r) !== -1;
              }
              n.exports = function (h, r) {
                var i = u(h, "operator"),
                  s = u(h, "negate"),
                  l = r[3],
                  p = s ? r[2] : r[1];
                if (i) return i;
                if ((typeof p == "function" && (p = p()), (p = p || "") && !/\shave\s/.test(p))) {
                  var v = c(l);
                  return /\snot\s/.test(p)
                    ? v
                      ? "notDeepStrictEqual"
                      : "notStrictEqual"
                    : v
                      ? "deepStrictEqual"
                      : "strictEqual";
                }
              };
            },
            { "./flag": 15, "type-detect": 39 },
          ],
          20: [
            function (t, n, a) {
              var d = t("./getOwnEnumerablePropertySymbols");
              n.exports = function (u) {
                return Object.keys(u).concat(d(u));
              };
            },
            { "./getOwnEnumerablePropertySymbols": 21 },
          ],
          21: [
            function (t, n, a) {
              n.exports = function (d) {
                return typeof Object.getOwnPropertySymbols != "function"
                  ? []
                  : Object.getOwnPropertySymbols(d).filter(function (u) {
                      return Object.getOwnPropertyDescriptor(d, u).enumerable;
                    });
              };
            },
            {},
          ],
          22: [
            function (t, n, a) {
              n.exports = function (d) {
                var u = Object.getOwnPropertyNames(d);
                function c(r) {
                  u.indexOf(r) === -1 && u.push(r);
                }
                for (var h = Object.getPrototypeOf(d); h !== null; )
                  Object.getOwnPropertyNames(h).forEach(c), (h = Object.getPrototypeOf(h));
                return u;
              };
            },
            {},
          ],
          23: [
            function (t, n, a) {
              var d = t("pathval");
              (a.test = t("./test")),
                (a.type = t("type-detect")),
                (a.expectTypes = t("./expectTypes")),
                (a.getMessage = t("./getMessage")),
                (a.getActual = t("./getActual")),
                (a.inspect = t("./inspect")),
                (a.objDisplay = t("./objDisplay")),
                (a.flag = t("./flag")),
                (a.transferFlags = t("./transferFlags")),
                (a.eql = t("deep-eql")),
                (a.getPathInfo = d.getPathInfo),
                (a.hasProperty = d.hasProperty),
                (a.getName = t("get-func-name")),
                (a.addProperty = t("./addProperty")),
                (a.addMethod = t("./addMethod")),
                (a.overwriteProperty = t("./overwriteProperty")),
                (a.overwriteMethod = t("./overwriteMethod")),
                (a.addChainableMethod = t("./addChainableMethod")),
                (a.overwriteChainableMethod = t("./overwriteChainableMethod")),
                (a.compareByInspect = t("./compareByInspect")),
                (a.getOwnEnumerablePropertySymbols = t("./getOwnEnumerablePropertySymbols")),
                (a.getOwnEnumerableProperties = t("./getOwnEnumerableProperties")),
                (a.checkError = t("check-error")),
                (a.proxify = t("./proxify")),
                (a.addLengthGuard = t("./addLengthGuard")),
                (a.isProxyEnabled = t("./isProxyEnabled")),
                (a.isNaN = t("./isNaN")),
                (a.getOperator = t("./getOperator"));
            },
            {
              "./addChainableMethod": 9,
              "./addLengthGuard": 10,
              "./addMethod": 11,
              "./addProperty": 12,
              "./compareByInspect": 13,
              "./expectTypes": 14,
              "./flag": 15,
              "./getActual": 16,
              "./getMessage": 18,
              "./getOperator": 19,
              "./getOwnEnumerableProperties": 20,
              "./getOwnEnumerablePropertySymbols": 21,
              "./inspect": 24,
              "./isNaN": 25,
              "./isProxyEnabled": 26,
              "./objDisplay": 27,
              "./overwriteChainableMethod": 28,
              "./overwriteMethod": 29,
              "./overwriteProperty": 30,
              "./proxify": 31,
              "./test": 32,
              "./transferFlags": 33,
              "check-error": 35,
              "deep-eql": 36,
              "get-func-name": 37,
              pathval: 38,
              "type-detect": 39,
            },
          ],
          24: [
            function (t, n, a) {
              var d = t("get-func-name"),
                u = t("./getProperties"),
                c = t("./getEnumerableProperties"),
                h = t("../config");
              function r(C, m, k, H) {
                return s(
                  {
                    showHidden: m,
                    seen: [],
                    stylize: function (I) {
                      return I;
                    },
                  },
                  C,
                  k === void 0 ? 2 : k
                );
              }
              n.exports = r;
              var i = function (C) {
                return typeof HTMLElement == "object"
                  ? C instanceof HTMLElement
                  : C && typeof C == "object" && "nodeType" in C && C.nodeType === 1 && typeof C.nodeName == "string";
              };
              function s(C, m, k) {
                if (
                  m &&
                  typeof m.inspect == "function" &&
                  m.inspect !== a.inspect &&
                  (!m.constructor || m.constructor.prototype !== m)
                ) {
                  var H = m.inspect(k, C);
                  return typeof H != "string" && (H = s(C, H, k)), H;
                }
                var I = l(C, m);
                if (I) return I;
                if (i(m)) {
                  if ("outerHTML" in m) return m.outerHTML;
                  try {
                    if (document.xmlVersion) return new XMLSerializer().serializeToString(m);
                    var O = "http://www.w3.org/1999/xhtml",
                      z = document.createElementNS(O, "_");
                    z.appendChild(m.cloneNode(!1));
                    var Q = z.innerHTML.replace("><", ">" + m.innerHTML + "<");
                    return (z.innerHTML = ""), Q;
                  } catch {}
                }
                var me,
                  Le,
                  kt = c(m),
                  qe = C.showHidden ? u(m) : kt;
                if (
                  qe.length === 0 ||
                  (ae(m) &&
                    ((qe.length === 1 && qe[0] === "stack") ||
                      (qe.length === 2 && qe[0] === "description" && qe[1] === "stack")))
                ) {
                  if (typeof m == "function")
                    return (Le = (me = d(m)) ? ": " + me : ""), C.stylize("[Function" + Le + "]", "special");
                  if (re(m)) return C.stylize(RegExp.prototype.toString.call(m), "regexp");
                  if (le(m)) return C.stylize(Date.prototype.toUTCString.call(m), "date");
                  if (ae(m)) return p(m);
                }
                var ro,
                  St = "",
                  Mt = !1,
                  nr = !1,
                  g = ["{", "}"];
                if (
                  (V(m) && ((nr = !0), (g = ["[", "]"])),
                  te(m) && ((Mt = !0), (g = ["[", "]"])),
                  typeof m == "function" && (St = " [Function" + (Le = (me = d(m)) ? ": " + me : "") + "]"),
                  re(m) && (St = " " + RegExp.prototype.toString.call(m)),
                  le(m) && (St = " " + Date.prototype.toUTCString.call(m)),
                  ae(m))
                )
                  return p(m);
                if (qe.length === 0 && (!Mt || m.length == 0)) return g[0] + St + g[1];
                if (k < 0)
                  return re(m)
                    ? C.stylize(RegExp.prototype.toString.call(m), "regexp")
                    : C.stylize("[Object]", "special");
                if ((C.seen.push(m), Mt)) ro = v(C, m, k, kt, qe);
                else {
                  if (nr) return b(m);
                  ro = qe.map(function (f) {
                    return E(C, m, k, kt, f, Mt);
                  });
                }
                return C.seen.pop(), M(ro, St, g);
              }
              function l(C, m) {
                switch (typeof m) {
                  case "undefined":
                    return C.stylize("undefined", "undefined");
                  case "string":
                    var k =
                      "'" + JSON.stringify(m).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return C.stylize(k, "string");
                  case "number":
                    return m === 0 && 1 / m == -1 / 0 ? C.stylize("-0", "number") : C.stylize("" + m, "number");
                  case "boolean":
                    return C.stylize("" + m, "boolean");
                  case "symbol":
                    return C.stylize(m.toString(), "symbol");
                  case "bigint":
                    return C.stylize(m.toString() + "n", "bigint");
                }
                if (m === null) return C.stylize("null", "null");
              }
              function p(C) {
                return "[" + Error.prototype.toString.call(C) + "]";
              }
              function v(C, m, k, H, I) {
                for (var O = [], z = 0, Q = m.length; z < Q; ++z)
                  Object.prototype.hasOwnProperty.call(m, String(z))
                    ? O.push(E(C, m, k, H, String(z), !0))
                    : O.push("");
                return (
                  I.forEach(function (me) {
                    me.match(/^\d+$/) || O.push(E(C, m, k, H, me, !0));
                  }),
                  O
                );
              }
              function b(C) {
                for (var m = "[ ", k = 0; k < C.length; ++k) {
                  if (m.length >= h.truncateThreshold - 7) {
                    m += "...";
                    break;
                  }
                  m += C[k] + ", ";
                }
                return (m += " ]").indexOf(",  ]") !== -1 && (m = m.replace(",  ]", " ]")), m;
              }
              function E(C, m, k, H, I, O) {
                var z,
                  Q,
                  me = Object.getOwnPropertyDescriptor(m, I);
                if (
                  (me &&
                    (me.get
                      ? (Q = me.set ? C.stylize("[Getter/Setter]", "special") : C.stylize("[Getter]", "special"))
                      : me.set && (Q = C.stylize("[Setter]", "special"))),
                  H.indexOf(I) < 0 && (z = "[" + I + "]"),
                  Q ||
                    (C.seen.indexOf(m[I]) < 0
                      ? (Q = s(C, m[I], k === null ? null : k - 1)).indexOf(`
`) > -1 &&
                        (Q = O
                          ? Q.split(
                              `
`
                            )
                              .map(function (Le) {
                                return "  " + Le;
                              })
                              .join(
                                `
`
                              )
                              .substr(2)
                          : `
` +
                            Q.split(
                              `
`
                            ).map(function (Le) {
                              return "   " + Le;
                            }).join(`
`))
                      : (Q = C.stylize("[Circular]", "special"))),
                  z === void 0)
                ) {
                  if (O && I.match(/^\d+$/)) return Q;
                  (z = JSON.stringify("" + I)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
                    ? ((z = z.substr(1, z.length - 2)), (z = C.stylize(z, "name")))
                    : ((z = z
                        .replace(/'/g, "\\'")
                        .replace(/\\"/g, '"')
                        .replace(/(^"|"$)/g, "'")),
                      (z = C.stylize(z, "string")));
                }
                return z + ": " + Q;
              }
              function M(C, m, k) {
                return C.reduce(function (H, I) {
                  return H + I.length + 1;
                }, 0) > 60
                  ? k[0] +
                      (m === ""
                        ? ""
                        : m +
                          `
 `) +
                      " " +
                      C.join(`,
  `) +
                      " " +
                      k[1]
                  : k[0] + m + " " + C.join(", ") + " " + k[1];
              }
              function V(C) {
                return typeof C == "object" && /\w+Array]$/.test(xe(C));
              }
              function te(C) {
                return Array.isArray(C) || (typeof C == "object" && xe(C) === "[object Array]");
              }
              function re(C) {
                return typeof C == "object" && xe(C) === "[object RegExp]";
              }
              function le(C) {
                return typeof C == "object" && xe(C) === "[object Date]";
              }
              function ae(C) {
                return typeof C == "object" && xe(C) === "[object Error]";
              }
              function xe(C) {
                return Object.prototype.toString.call(C);
              }
            },
            { "../config": 4, "./getEnumerableProperties": 17, "./getProperties": 22, "get-func-name": 37 },
          ],
          25: [
            function (t, n, a) {
              function d(u) {
                return u != u;
              }
              n.exports = Number.isNaN || d;
            },
            {},
          ],
          26: [
            function (t, n, a) {
              var d = t("../config");
              n.exports = function () {
                return d.useProxy && typeof Proxy < "u" && typeof Reflect < "u";
              };
            },
            { "../config": 4 },
          ],
          27: [
            function (t, n, a) {
              var d = t("./inspect"),
                u = t("../config");
              n.exports = function (c) {
                var h = d(c),
                  r = Object.prototype.toString.call(c);
                if (u.truncateThreshold && h.length >= u.truncateThreshold) {
                  if (r === "[object Function]")
                    return c.name && c.name !== "" ? "[Function: " + c.name + "]" : "[Function]";
                  if (r === "[object Array]") return "[ Array(" + c.length + ") ]";
                  if (r === "[object Object]") {
                    var i = Object.keys(c);
                    return "{ Object (" + (i.length > 2 ? i.splice(0, 2).join(", ") + ", ..." : i.join(", ")) + ") }";
                  }
                  return h;
                }
                return h;
              };
            },
            { "../config": 4, "./inspect": 24 },
          ],
          28: [
            function (t, n, a) {
              var d = t("../../chai"),
                u = t("./transferFlags");
              n.exports = function (c, h, r, i) {
                var s = c.__methods[h],
                  l = s.chainingBehavior;
                s.chainingBehavior = function () {
                  var v = i(l).call(this);
                  if (v !== void 0) return v;
                  var b = new d.Assertion();
                  return u(this, b), b;
                };
                var p = s.method;
                s.method = function () {
                  var v = r(p).apply(this, arguments);
                  if (v !== void 0) return v;
                  var b = new d.Assertion();
                  return u(this, b), b;
                };
              };
            },
            { "../../chai": 2, "./transferFlags": 33 },
          ],
          29: [
            function (t, n, a) {
              var d = t("./addLengthGuard"),
                u = t("../../chai"),
                c = t("./flag"),
                h = t("./proxify"),
                r = t("./transferFlags");
              n.exports = function (i, s, l) {
                var p = i[s],
                  v = function () {
                    throw new Error(s + " is not a function");
                  };
                p && typeof p == "function" && (v = p);
                var b = function () {
                  c(this, "lockSsfi") || c(this, "ssfi", b);
                  var E = c(this, "lockSsfi");
                  c(this, "lockSsfi", !0);
                  var M = l(v).apply(this, arguments);
                  if ((c(this, "lockSsfi", E), M !== void 0)) return M;
                  var V = new u.Assertion();
                  return r(this, V), V;
                };
                d(b, s, !1), (i[s] = h(b, s));
              };
            },
            { "../../chai": 2, "./addLengthGuard": 10, "./flag": 15, "./proxify": 31, "./transferFlags": 33 },
          ],
          30: [
            function (t, n, a) {
              var d = t("../../chai"),
                u = t("./flag"),
                c = t("./isProxyEnabled"),
                h = t("./transferFlags");
              n.exports = function (r, i, s) {
                var l = Object.getOwnPropertyDescriptor(r, i),
                  p = function () {};
                l && typeof l.get == "function" && (p = l.get),
                  Object.defineProperty(r, i, {
                    get: function v() {
                      c() || u(this, "lockSsfi") || u(this, "ssfi", v);
                      var b = u(this, "lockSsfi");
                      u(this, "lockSsfi", !0);
                      var E = s(p).call(this);
                      if ((u(this, "lockSsfi", b), E !== void 0)) return E;
                      var M = new d.Assertion();
                      return h(this, M), M;
                    },
                    configurable: !0,
                  });
              };
            },
            { "../../chai": 2, "./flag": 15, "./isProxyEnabled": 26, "./transferFlags": 33 },
          ],
          31: [
            function (t, n, a) {
              var d = t("../config"),
                u = t("./flag"),
                c = t("./getProperties"),
                h = t("./isProxyEnabled"),
                r = ["__flags", "__methods", "_obj", "assert"];
              function i(s, l, p) {
                if (Math.abs(s.length - l.length) >= p) return p;
                for (var v = [], b = 0; b <= s.length; b++) (v[b] = Array(l.length + 1).fill(0)), (v[b][0] = b);
                for (var E = 0; E < l.length; E++) v[0][E] = E;
                for (b = 1; b <= s.length; b++) {
                  var M = s.charCodeAt(b - 1);
                  for (E = 1; E <= l.length; E++)
                    Math.abs(b - E) >= p
                      ? (v[b][E] = p)
                      : (v[b][E] = Math.min(
                          v[b - 1][E] + 1,
                          v[b][E - 1] + 1,
                          v[b - 1][E - 1] + (M === l.charCodeAt(E - 1) ? 0 : 1)
                        ));
                }
                return v[s.length][l.length];
              }
              n.exports = function (s, l) {
                return h()
                  ? new Proxy(s, {
                      get: function p(v, b) {
                        if (typeof b == "string" && d.proxyExcludedKeys.indexOf(b) === -1 && !Reflect.has(v, b)) {
                          if (l)
                            throw Error(
                              "Invalid Chai property: " + l + "." + b + '. See docs for proper usage of "' + l + '".'
                            );
                          var E = null,
                            M = 4;
                          throw (
                            (c(v).forEach(function (V) {
                              if (!Object.prototype.hasOwnProperty(V) && r.indexOf(V) === -1) {
                                var te = i(b, V, M);
                                te < M && ((E = V), (M = te));
                              }
                            }),
                            Error(
                              E !== null
                                ? "Invalid Chai property: " + b + '. Did you mean "' + E + '"?'
                                : "Invalid Chai property: " + b
                            ))
                          );
                        }
                        return r.indexOf(b) !== -1 || u(v, "lockSsfi") || u(v, "ssfi", p), Reflect.get(v, b);
                      },
                    })
                  : s;
              };
            },
            { "../config": 4, "./flag": 15, "./getProperties": 22, "./isProxyEnabled": 26 },
          ],
          32: [
            function (t, n, a) {
              var d = t("./flag");
              n.exports = function (u, c) {
                var h = d(u, "negate"),
                  r = c[0];
                return h ? !r : r;
              };
            },
            { "./flag": 15 },
          ],
          33: [
            function (t, n, a) {
              n.exports = function (d, u, c) {
                var h = d.__flags || (d.__flags = Object.create(null));
                for (var r in (u.__flags || (u.__flags = Object.create(null)), (c = arguments.length !== 3 || c), h))
                  (c || (r !== "object" && r !== "ssfi" && r !== "lockSsfi" && r != "message")) &&
                    (u.__flags[r] = h[r]);
              };
            },
            {},
          ],
          34: [
            function (t, n, a) {
              function d() {
                var c = [].slice.call(arguments);
                function h(r, i) {
                  Object.keys(i).forEach(function (s) {
                    ~c.indexOf(s) || (r[s] = i[s]);
                  });
                }
                return function () {
                  for (var r = [].slice.call(arguments), i = 0, s = {}; i < r.length; i++) h(s, r[i]);
                  return s;
                };
              }
              function u(c, h, r) {
                var i = d("name", "message", "stack", "constructor", "toJSON")(h || {});
                for (var s in ((this.message = c || "Unspecified AssertionError"), (this.showDiff = !1), i))
                  this[s] = i[s];
                if (((r = r || u), Error.captureStackTrace)) Error.captureStackTrace(this, r);
                else
                  try {
                    throw new Error();
                  } catch (l) {
                    this.stack = l.stack;
                  }
              }
              (n.exports = u),
                (u.prototype = Object.create(Error.prototype)),
                (u.prototype.name = "AssertionError"),
                (u.prototype.constructor = u),
                (u.prototype.toJSON = function (c) {
                  var h = d("constructor", "toJSON", "stack")({ name: this.name }, this);
                  return c !== !1 && this.stack && (h.stack = this.stack), h;
                });
            },
            {},
          ],
          35: [
            function (t, n, a) {
              function d(l, p) {
                return p instanceof Error && l === p;
              }
              function u(l, p) {
                return p instanceof Error
                  ? l.constructor === p.constructor || l instanceof p.constructor
                  : (p.prototype instanceof Error || p === Error) && (l.constructor === p || l instanceof p);
              }
              function c(l, p) {
                var v = typeof l == "string" ? l : l.message;
                return p instanceof RegExp ? p.test(v) : typeof p == "string" && v.indexOf(p) !== -1;
              }
              var h = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
              function r(l) {
                var p = "";
                if (l.name === void 0) {
                  var v = String(l).match(h);
                  v && (p = v[1]);
                } else p = l.name;
                return p;
              }
              function i(l) {
                var p = l;
                return (
                  l instanceof Error
                    ? (p = r(l.constructor))
                    : typeof l == "function" && (p = r(l).trim() || r(new l())),
                  p
                );
              }
              function s(l) {
                var p = "";
                return l && l.message ? (p = l.message) : typeof l == "string" && (p = l), p;
              }
              n.exports = {
                compatibleInstance: d,
                compatibleConstructor: u,
                compatibleMessage: c,
                getMessage: s,
                getConstructorName: i,
              };
            },
            {},
          ],
          36: [
            function (t, n, a) {
              var d = t("type-detect");
              function u() {
                this._key = "chai/deep-eql__" + Math.random() + Date.now();
              }
              u.prototype = {
                get: function (m) {
                  return m[this._key];
                },
                set: function (m, k) {
                  Object.isExtensible(m) && Object.defineProperty(m, this._key, { value: k, configurable: !0 });
                },
              };
              var c = typeof WeakMap == "function" ? WeakMap : u;
              function h(m, k, H) {
                if (!H || C(m) || C(k)) return null;
                var I = H.get(m);
                if (I) {
                  var O = I.get(k);
                  if (typeof O == "boolean") return O;
                }
                return null;
              }
              function r(m, k, H, I) {
                if (H && !C(m) && !C(k)) {
                  var O = H.get(m);
                  O ? O.set(k, I) : ((O = new c()).set(k, I), H.set(m, O));
                }
              }
              function i(m, k, H) {
                if (H && H.comparator) return l(m, k, H);
                var I = s(m, k);
                return I !== null ? I : l(m, k, H);
              }
              function s(m, k) {
                return m === k ? m !== 0 || 1 / m == 1 / k : (m != m && k != k) || (!C(m) && !C(k) && null);
              }
              function l(m, k, H) {
                (H = H || {}).memoize = H.memoize !== !1 && (H.memoize || new c());
                var I = H && H.comparator,
                  O = h(m, k, H.memoize);
                if (O !== null) return O;
                var z = h(k, m, H.memoize);
                if (z !== null) return z;
                if (I) {
                  var Q = I(m, k);
                  if (Q === !1 || Q === !0) return r(m, k, H.memoize, Q), Q;
                  var me = s(m, k);
                  if (me !== null) return me;
                }
                var Le = d(m);
                if (Le !== d(k)) return r(m, k, H.memoize, !1), !1;
                r(m, k, H.memoize, !0);
                var kt = p(m, k, Le, H);
                return r(m, k, H.memoize, kt), kt;
              }
              function p(m, k, H, I) {
                switch (H) {
                  case "String":
                  case "Number":
                  case "Boolean":
                  case "Date":
                    return i(m.valueOf(), k.valueOf());
                  case "Promise":
                  case "Symbol":
                  case "function":
                  case "WeakMap":
                  case "WeakSet":
                  case "Error":
                    return m === k;
                  case "Arguments":
                  case "Int8Array":
                  case "Uint8Array":
                  case "Uint8ClampedArray":
                  case "Int16Array":
                  case "Uint16Array":
                  case "Int32Array":
                  case "Uint32Array":
                  case "Float32Array":
                  case "Float64Array":
                  case "Array":
                    return E(m, k, I);
                  case "RegExp":
                    return v(m, k);
                  case "Generator":
                    return M(m, k, I);
                  case "DataView":
                    return E(new Uint8Array(m.buffer), new Uint8Array(k.buffer), I);
                  case "ArrayBuffer":
                    return E(new Uint8Array(m), new Uint8Array(k), I);
                  case "Set":
                  case "Map":
                    return b(m, k, I);
                  default:
                    return xe(m, k, I);
                }
              }
              function v(m, k) {
                return m.toString() === k.toString();
              }
              function b(m, k, H) {
                if (m.size !== k.size) return !1;
                if (m.size === 0) return !0;
                var I = [],
                  O = [];
                return (
                  m.forEach(function (z, Q) {
                    I.push([z, Q]);
                  }),
                  k.forEach(function (z, Q) {
                    O.push([z, Q]);
                  }),
                  E(I.sort(), O.sort(), H)
                );
              }
              function E(m, k, H) {
                var I = m.length;
                if (I !== k.length) return !1;
                if (I === 0) return !0;
                for (var O = -1; ++O < I; ) if (i(m[O], k[O], H) === !1) return !1;
                return !0;
              }
              function M(m, k, H) {
                return E(re(m), re(k), H);
              }
              function V(m) {
                return (
                  typeof Symbol < "u" &&
                  typeof m == "object" &&
                  Symbol.iterator !== void 0 &&
                  typeof m[Symbol.iterator] == "function"
                );
              }
              function te(m) {
                if (V(m))
                  try {
                    return re(m[Symbol.iterator]());
                  } catch {
                    return [];
                  }
                return [];
              }
              function re(m) {
                for (var k = m.next(), H = [k.value]; k.done === !1; ) (k = m.next()), H.push(k.value);
                return H;
              }
              function le(m) {
                var k = [];
                for (var H in m) k.push(H);
                return k;
              }
              function ae(m, k, H, I) {
                var O = H.length;
                if (O === 0) return !0;
                for (var z = 0; z < O; z += 1) if (i(m[H[z]], k[H[z]], I) === !1) return !1;
                return !0;
              }
              function xe(m, k, H) {
                var I = le(m),
                  O = le(k);
                if (I.length && I.length === O.length) return I.sort(), O.sort(), E(I, O) !== !1 && ae(m, k, I, H);
                var z = te(m),
                  Q = te(k);
                return z.length && z.length === Q.length
                  ? (z.sort(), Q.sort(), E(z, Q, H))
                  : I.length === 0 && z.length === 0 && O.length === 0 && Q.length === 0;
              }
              function C(m) {
                return m === null || typeof m != "object";
              }
              (n.exports = i), (n.exports.MemoizeMap = c);
            },
            { "type-detect": 39 },
          ],
          37: [
            function (t, n, a) {
              var d = Function.prototype.toString,
                u = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
              function c(h) {
                if (typeof h != "function") return null;
                var r = "";
                if (Function.prototype.name === void 0 && h.name === void 0) {
                  var i = d.call(h).match(u);
                  i && (r = i[1]);
                } else r = h.name;
                return r;
              }
              n.exports = c;
            },
            {},
          ],
          38: [
            function (t, n, a) {
              function d(l, p) {
                return l != null && p in Object(l);
              }
              function u(l) {
                return l
                  .replace(/([^\\])\[/g, "$1.[")
                  .match(/(\\\.|[^.]+?)+/g)
                  .map(function (p) {
                    if (p === "constructor" || p === "__proto__" || p === "prototype") return {};
                    var v = /^\[(\d+)\]$/.exec(p);
                    return v ? { i: parseFloat(v[1]) } : { p: p.replace(/\\([.[\]])/g, "$1") };
                  });
              }
              function c(l, p, v) {
                var b = l,
                  E = null;
                v = v === void 0 ? p.length : v;
                for (var M = 0; M < v; M++) {
                  var V = p[M];
                  b && ((b = V.p === void 0 ? b[V.i] : b[V.p]), M === v - 1 && (E = b));
                }
                return E;
              }
              function h(l, p, v) {
                for (var b = l, E = v.length, M = null, V = 0; V < E; V++) {
                  var te = null,
                    re = null;
                  if (((M = v[V]), V === E - 1)) b[(te = M.p === void 0 ? M.i : M.p)] = p;
                  else if (M.p !== void 0 && b[M.p]) b = b[M.p];
                  else if (M.i !== void 0 && b[M.i]) b = b[M.i];
                  else {
                    var le = v[V + 1];
                    (te = M.p === void 0 ? M.i : M.p), (re = le.p === void 0 ? [] : {}), (b[te] = re), (b = b[te]);
                  }
                }
              }
              function r(l, p) {
                var v = u(p),
                  b = v[v.length - 1],
                  E = { parent: v.length > 1 ? c(l, v, v.length - 1) : l, name: b.p || b.i, value: c(l, v) };
                return (E.exists = d(E.parent, E.name)), E;
              }
              function i(l, p) {
                return r(l, p).value;
              }
              function s(l, p, v) {
                return h(l, v, u(p)), l;
              }
              n.exports = { hasProperty: d, getPathInfo: r, getPathValue: i, setPathValue: s };
            },
            {},
          ],
          39: [
            function (t, n, a) {
              (function (d, u) {
                typeof a == "object" && n !== void 0 ? (n.exports = u()) : (d.typeDetect = u());
              })(this, function () {
                var d = typeof Promise == "function",
                  u = typeof self == "object" ? self : Lc,
                  c = typeof Symbol < "u",
                  h = typeof Map < "u",
                  r = typeof Set < "u",
                  i = typeof WeakMap < "u",
                  s = typeof WeakSet < "u",
                  l = typeof DataView < "u",
                  p = c && Symbol.iterator !== void 0,
                  v = c && Symbol.toStringTag !== void 0,
                  b = r && typeof Set.prototype.entries == "function",
                  E = h && typeof Map.prototype.entries == "function",
                  M = b && Object.getPrototypeOf(new Set().entries()),
                  V = E && Object.getPrototypeOf(new Map().entries()),
                  te = p && typeof Array.prototype[Symbol.iterator] == "function",
                  re = te && Object.getPrototypeOf([][Symbol.iterator]()),
                  le = p && typeof String.prototype[Symbol.iterator] == "function",
                  ae = le && Object.getPrototypeOf(""[Symbol.iterator]()),
                  xe = 8,
                  C = -1;
                function m(k) {
                  var H = typeof k;
                  if (H !== "object") return H;
                  if (k === null) return "null";
                  if (k === u) return "global";
                  if (Array.isArray(k) && (v === !1 || !(Symbol.toStringTag in k))) return "Array";
                  if (typeof window == "object" && window !== null) {
                    if (typeof window.location == "object" && k === window.location) return "Location";
                    if (typeof window.document == "object" && k === window.document) return "Document";
                    if (typeof window.navigator == "object") {
                      if (typeof window.navigator.mimeTypes == "object" && k === window.navigator.mimeTypes)
                        return "MimeTypeArray";
                      if (typeof window.navigator.plugins == "object" && k === window.navigator.plugins)
                        return "PluginArray";
                    }
                    if (
                      (typeof window.HTMLElement == "function" || typeof window.HTMLElement == "object") &&
                      k instanceof window.HTMLElement
                    ) {
                      if (k.tagName === "BLOCKQUOTE") return "HTMLQuoteElement";
                      if (k.tagName === "TD") return "HTMLTableDataCellElement";
                      if (k.tagName === "TH") return "HTMLTableHeaderCellElement";
                    }
                  }
                  var I = v && k[Symbol.toStringTag];
                  if (typeof I == "string") return I;
                  var O = Object.getPrototypeOf(k);
                  return O === RegExp.prototype
                    ? "RegExp"
                    : O === Date.prototype
                      ? "Date"
                      : d && O === Promise.prototype
                        ? "Promise"
                        : r && O === Set.prototype
                          ? "Set"
                          : h && O === Map.prototype
                            ? "Map"
                            : s && O === WeakSet.prototype
                              ? "WeakSet"
                              : i && O === WeakMap.prototype
                                ? "WeakMap"
                                : l && O === DataView.prototype
                                  ? "DataView"
                                  : h && O === V
                                    ? "Map Iterator"
                                    : r && O === M
                                      ? "Set Iterator"
                                      : te && O === re
                                        ? "Array Iterator"
                                        : le && O === ae
                                          ? "String Iterator"
                                          : O === null
                                            ? "Object"
                                            : Object.prototype.toString.call(k).slice(xe, C);
                }
                return m;
              });
            },
            {},
          ],
        },
        {},
        [1]
      )(1);
    })(
      (_r = {
        path: Tc,
        exports: {},
        require: function (o, e) {
          return zr(e == null && _r.path);
        },
      }),
      _r.exports
    ),
    _r.exports),
  uh = lt.version,
  ph = lt.AssertionError,
  hh = lt.use,
  gh = lt.util,
  vh = lt.config,
  mh = lt.Assertion,
  fh = lt.expect,
  xh = lt.should,
  bh = lt.Should,
  Fe = lt.assert;
var tt = "extension-data-loaded",
  ot = "install-progress",
  Ft = "extension-removed",
  Xo = "extension-enabled",
  Ko = "extension-in-private-enabled",
  Uo = "extension-user-scripts-enabled",
  Yt = "show-detail",
  jr = "back-to-home-page",
  qo = "back-pressed",
  Mn = "refresh-extensions",
  Yo = "context-menu-dismiss",
  Qo = "developer-state-changed",
  Gr = !1;
function Us() {
  Gr = !0;
}
function qs() {
  Gr = !1;
}
window.Extension = {
  popToHub() {
    document.dispatchEvent(new CustomEvent(jr));
  },
};
var Wn = class {
    #e;
    #o;
    #r = null;
    async getExtensionIds() {
      return await this.#t, Fe(this.#e), (await this.#e.getExtensionIds()).result;
    }
    async loadExtensionData(e) {
      await this.#t, Fe(this.#e), await this.#e.loadExtensionData(e);
    }
    async openUrl(e) {
      await this.#t, Fe(this.#e), await this.#e.openUrl(e);
    }
    async performHubAction(e, t, n) {
      if (!t.extensionId) {
        console.error("Invalid item for performHubAction:", t);
        return;
      }
      await this.#t, Fe(this.#e), await this.#e.performHubAction(e, t, n);
    }
    async onNavigateToDetailPage(e) {
      await this.#t, Fe(this.#e), await this.#e.onNavigateToDetailPage(e);
    }
    async showSnackBarWithMessage(e, t) {
      await this.#t, Fe(this.#e), await this.#e.showSnackBarWithMessage(e, t);
    }
    async loadCrxPackage() {
      await this.#t, Fe(this.#e), await this.#e.loadCrxPackage();
    }
    async onPageTypeChanged(e) {
      await this.#t, Fe(this.#e), await this.#e.onPageTypeChanged(e);
    }
    async getExtensionInstallPhase(e) {
      return await this.#t, Fe(this.#e), (await this.#e.getExtensionInstallPhase(e)).installPhase;
    }
    async isExtensionSearchSupported() {
      return await this.#t, Fe(this.#e), (await this.#e.isExtensionSearchSupported()).supported;
    }
    async searchExtensions(e, t) {
      return await this.#t, Fe(this.#e), (await this.#e.searchExtensions(e, t)).result;
    }
    recordSearchAction(e) {
      this.#t.then(() => {
        this.#e?.recordSearchAction(e);
      });
    }
    async convertToBase64(e) {
      return await this.#t, Fe(this.#e), (await this.#e.convertToBase64(e)).imageBase64;
    }
    get handler() {
      return this.#e;
    }
    get callbackRouter() {
      return this.#o;
    }
    async setupMojom() {
      let {
        EdgeMobileExtensionPageCallbackRouter: e,
        EdgeMobileExtensionPageHandlerFactory: t,
        EdgeMobileExtensionPageHandlerRemote: n,
      } = await this.importModule();
      (this.#o = new e()),
        (this.#e = new n()),
        t
          .getRemote()
          .createEdgeMobileExtensionPageHandler(
            this.#o.$.bindNewPipeAndPassRemote(),
            this.#e.$.bindNewPipeAndPassReceiver()
          ),
        this.#o.didUpdateExtensionEnableState.addListener(this.#n),
        this.#o.didUpdateExtensionInPrivateEnableState.addListener(this.#s),
        this.#o.didUpdateExtensionUserScriptsEnableState.addListener(this.#i),
        this.#o.didFinishRemoveForExtension.addListener(this.#c),
        this.#o.didUpdateInstallProgress.addListener(this.#l),
        this.#o.didLoadExtensionData.addListener(this.#d),
        this.#o.updateDeveloperState.addListener(this.#a),
        this.#o.onBackPressed.addListener(this.#u);
    }
    async importModule() {
      return await import("./edge_mobile_extension.mojom-webui.js");
    }
    get #t() {
      return this.#r || (this.#r = this.setupMojom());
    }
    #n = (e, t) => {
      document.dispatchEvent(new CustomEvent(Xo, { detail: { extensionId: e, enable: t } }));
    };
    #a = (e) => {
      document.dispatchEvent(new CustomEvent(Qo, { detail: { isEnable: e } }));
    };
    #s = (e, t) => {
      document.dispatchEvent(new CustomEvent(Ko, { detail: { extensionId: e, enable: t } }));
    };
    #i = (e, t) => {
      document.dispatchEvent(new CustomEvent(Uo, { detail: { extensionId: e, enable: t } }));
    };
    #c = (e) => {
      document.dispatchEvent(new CustomEvent(Ft, { detail: { extensionId: e } }));
    };
    #l = (e) => {
      document.dispatchEvent(new CustomEvent(ot, { detail: e }));
    };
    #d = (e) => {
      e.data.remoteInfo && this.#p(e.extensionId, e.data.remoteInfo),
        document.dispatchEvent(new CustomEvent(tt, { detail: e }));
    };
    #u = () => {
      document.dispatchEvent(new CustomEvent(qo));
    };
    #p(e, t) {
      localStorage.setItem(
        `${e}`,
        JSON.stringify(t, (n, a) => (typeof a == "bigint" ? a.toString() : a))
      );
    }
    async reset() {
      this.#r && (await this.#r), (this.#r = null), (this.#e = void 0), (this.#o = void 0);
    }
  },
  _ = new Wn();
var ue = Object.freeze({ prefix: "fluent", shadowRootMode: "open", registry: customElements });
function $(o, e, t, n) {
  var a = arguments.length,
    d = a < 3 ? e : n === null ? (n = Object.getOwnPropertyDescriptor(e, t)) : n,
    u;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") d = Reflect.decorate(o, e, t, n);
  else for (var c = o.length - 1; c >= 0; c--) (u = o[c]) && (d = (a < 3 ? u(d) : a > 3 ? u(e, t, d) : u(e, t)) || d);
  return a > 3 && d && Object.defineProperty(e, t, d), d;
}
var Nh = CSS.supports("anchor-name: --a"),
  Eh = "anchor" in HTMLElement.prototype,
  zn = CSS.supports("selector(:state(g))");
var Ys = new Map();
function ee(o) {
  return Ys.get(o) ?? Ys.set(o, zn ? `:state(${o})` : `[state--${o}]`).get(o);
}
function dt(o, e, t) {
  if (!(!e || !o)) {
    if (!zn) {
      o.shadowRoot.host.toggleAttribute(`state--${e}`, t);
      return;
    }
    if (t ?? !o.states.has(e)) {
      o.states.add(e);
      return;
    }
    o.states.delete(e);
  }
}
var _n = new WeakMap();
function Dc(o, e) {
  if (!o || !e) return !1;
  if (_n.has(o)) return _n.get(o).has(e);
  let t = new Set(Object.values(o));
  return _n.set(o, t), t.has(e);
}
function Qs(o, e = "", t = "", n, a = "") {
  dt(o, `${a}${e}`, !1), (!n || Dc(n, t)) && dt(o, `${a}${t}`, !0);
}
var Ge = class extends G {
  constructor() {
    super(...arguments),
      (this.initialValue = "on"),
      (this._keydownPressed = !1),
      (this.dirtyChecked = !1),
      (this.elementInternals = this.attachInternals()),
      (this._validationFallbackMessage = ""),
      (this._value = this.initialValue);
  }
  get checked() {
    return U.track(this, "checked"), !!this._checked;
  }
  set checked(e) {
    (this._checked = e),
      this.setFormValue(e ? this.value : null),
      this.setValidity(),
      this.setAriaChecked(),
      dt(this.elementInternals, "checked", e),
      U.notify(this, "checked");
  }
  disabledChanged(e, t) {
    this.disabled
      ? this.removeAttribute("tabindex")
      : (this.tabIndex = Number(this.getAttribute("tabindex") ?? 0) < 0 ? -1 : 0),
      (this.elementInternals.ariaDisabled = this.disabled ? "true" : "false"),
      dt(this.elementInternals, "disabled", this.disabled);
  }
  disabledAttributeChanged(e, t) {
    this.disabled = !!t;
  }
  initialCheckedChanged(e, t) {
    this.dirtyChecked || (this.checked = !!t);
  }
  initialValueChanged(e, t) {
    this._value = t;
  }
  requiredChanged(e, t) {
    this.$fastController.isConnected &&
      (this.setValidity(), (this.elementInternals.ariaRequired = this.required ? "true" : "false"));
  }
  get form() {
    return this.elementInternals.form;
  }
  static {
    this.formAssociated = !0;
  }
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  get validationMessage() {
    if (this.elementInternals.validationMessage) return this.elementInternals.validationMessage;
    if (!this._validationFallbackMessage) {
      let e = document.createElement("input");
      (e.type = "checkbox"),
        (e.required = !0),
        (e.checked = !1),
        (this._validationFallbackMessage = e.validationMessage);
    }
    return this._validationFallbackMessage;
  }
  get validity() {
    return this.elementInternals.validity;
  }
  get value() {
    return U.track(this, "value"), this._value;
  }
  set value(e) {
    (this._value = e),
      this.$fastController.isConnected && (this.setFormValue(e), this.setValidity(), U.notify(this, "value"));
  }
  get willValidate() {
    return this.elementInternals.willValidate;
  }
  checkValidity() {
    return this.elementInternals.checkValidity();
  }
  clickHandler(e) {
    if (this.disabled) return;
    this.dirtyChecked = !0;
    let t = this.checked;
    return this.toggleChecked(), t !== this.checked && (this.$emit("change"), this.$emit("input")), !0;
  }
  connectedCallback() {
    super.connectedCallback(), (this.disabled = !!this.disabledAttribute), this.setAriaChecked(), this.setValidity();
  }
  inputHandler(e) {
    return this.setFormValue(this.value), this.setValidity(), !0;
  }
  keydownHandler(e) {
    if (e.key !== " ") return !0;
    this._keydownPressed = !0;
  }
  keyupHandler(e) {
    if (!this._keydownPressed || e.key !== " ") return !0;
    (this._keydownPressed = !1), this.click();
  }
  formResetCallback() {
    (this.checked = this.initialChecked ?? !1), (this.dirtyChecked = !1), this.setValidity();
  }
  reportValidity() {
    return this.elementInternals.reportValidity();
  }
  setAriaChecked(e = this.checked) {
    this.elementInternals.ariaChecked = e ? "true" : "false";
  }
  setFormValue(e, t) {
    this.elementInternals.setFormValue(e, e ?? t);
  }
  setCustomValidity(e) {
    this.elementInternals.setValidity({ customError: !0 }, e), this.setValidity();
  }
  setValidity(e, t, n) {
    if (this.$fastController.isConnected) {
      if (this.disabled || !this.required) {
        this.elementInternals.setValidity({});
        return;
      }
      this.elementInternals.setValidity(
        { valueMissing: !!this.required && !this.checked, ...e },
        t ?? this.validationMessage,
        n
      );
    }
  }
  toggleChecked(e = !this.checked) {
    this.checked = e;
  }
};
$([W({ mode: "boolean" })], Ge.prototype, "autofocus", void 0);
$([P], Ge.prototype, "disabled", void 0);
$([W({ attribute: "disabled", mode: "boolean" })], Ge.prototype, "disabledAttribute", void 0);
$([W({ attribute: "form" })], Ge.prototype, "formAttribute", void 0);
$([W({ attribute: "checked", mode: "boolean" })], Ge.prototype, "initialChecked", void 0);
$([W({ attribute: "value", mode: "fromView" })], Ge.prototype, "initialValue", void 0);
$([W], Ge.prototype, "name", void 0);
$([W({ mode: "boolean" })], Ge.prototype, "required", void 0);
var Vr = class extends Ge {
  constructor() {
    super(), (this.elementInternals.role = "switch");
  }
};
var Zs = { horizontal: "horizontal", vertical: "vertical" };
var Js = "ArrowLeft",
  ei = "ArrowRight";
var ne = "Enter",
  Xr = "Escape";
function It(o) {
  return o ? (typeof o == "string" ? new Ze(o) : "inline" in o ? o.inline() : o) : Ze.empty;
}
var Hc = ":host([hidden]){display:none}";
function ut(o) {
  return `${Hc}:host{display:${o}}`;
}
var jn = class {
    constructor(e) {
      (this.listenerCache = new WeakMap()), (this.query = e);
    }
    connectedCallback(e) {
      let { query: t } = this,
        n = this.listenerCache.get(e);
      n || ((n = this.constructListener(e)), this.listenerCache.set(e, n)),
        n.bind(t)(),
        t.addEventListener("change", n);
    }
    disconnectedCallback(e) {
      let t = this.listenerCache.get(e);
      t && this.query.removeEventListener("change", t);
    }
  },
  Zo = class o extends jn {
    constructor(e, t) {
      super(e), (this.styles = t);
    }
    static with(e) {
      return (t) => new o(e, t);
    }
    constructListener(e) {
      let t = !1,
        n = this.styles;
      return function () {
        let { matches: d } = this;
        d && !t ? (e.addStyles(n), (t = d)) : !d && t && (e.removeStyles(n), (t = d));
      };
    }
    removedCallback(e) {
      e.removeStyles(this.styles);
    }
  },
  Ot = Zo.with(window.matchMedia("(forced-colors)")),
  jh = Zo.with(window.matchMedia("(prefers-color-scheme: dark)")),
  Gh = Zo.with(window.matchMedia("(prefers-color-scheme: light)"));
function Fc(o = {}) {
  return y`
    <template
      @click="${(e, t) => e.clickHandler(t.event)}"
      @input="${(e, t) => e.inputHandler(t.event)}"
      @keydown="${(e, t) => e.keydownHandler(t.event)}"
      @keyup="${(e, t) => e.keyupHandler(t.event)}"
    >
      <slot name="switch">${It(o.switch)}</slot>
    </template>
  `;
}
var ti = Fc({ switch: '<span class="checked-indicator" part="checked-indicator"></span>' });
var Yh = ee("active"),
  Qh = ee("bad-input"),
  ve = ee("checked"),
  Zh = ee("custom-error"),
  Jh = ee("description"),
  Qt = ee("disabled"),
  eg = ee("error"),
  tg = ee("flip-block"),
  og = ee("focus-visible"),
  rg = ee("has-message"),
  ng = ee("indeterminate"),
  ag = ee("multiple"),
  sg = ee("open"),
  ig = ee("pattern-mismatch"),
  cg = ee("placeholder-shown"),
  lg = ee("pressed"),
  dg = ee("range-overflow"),
  ug = ee("range-underflow"),
  pg = ee("required"),
  hg = ee("selected"),
  gg = ee("step-mismatch"),
  Jo = ee("submenu"),
  vg = ee("too-long"),
  mg = ee("too-short"),
  fg = ee("type-mismatch"),
  xg = ee("user-invalid"),
  bg = ee("valid"),
  kg = ee("value-missing");
var oi = R`
  ${ut("inline-flex")}

  :host {
    box-sizing: border-box;
    align-items: center;
    flex-direction: row;
    outline: none;
    user-select: none;
    contain: content;
    padding: 0 ${Qa};
    width: 40px;
    height: 20px;
    background-color: ${Lt};
    border: 1px solid ${ys};
    border-radius: ${Sr};
  }

  :host(:enabled) {
    cursor: pointer;
  }

  :host(:hover) {
    background: none;
    border-color: ${Bs};
  }
  :host(:active) {
    border-color: ${ws};
  }
  :host(:disabled),
  :host([readonly]) {
    border: 1px solid ${jo};
    background-color: none;
    pointer: default;
  }
  :host(${ve}) {
    background: ${Fn};
    border-color: ${Fn};
  }
  :host(${ve}:hover) {
    background: ${In};
    border-color: ${In};
  }
  :host(${ve}:active) {
    background: ${On};
    border-color: ${On};
  }
  :host(${ve}:disabled) {
    background: ${vo};
    border-color: ${jo};
  }
  .checked-indicator {
    height: 14px;
    width: 14px;
    border-radius: 50%;
    margin-inline-start: 0;
    background-color: ${go};
    transition-duration: ${ns};
    transition-timing-function: ${Pr};
    transition-property: margin-inline-start;
  }
  :host(${ve}) .checked-indicator {
    background-color: ${us};
    margin-inline-start: calc(100% - 14px);
  }
  :host(${ve}:hover) .checked-indicator {
    background: ${ps};
  }
  :host(${ve}:active) .checked-indicator {
    background: ${hs};
  }
  :host(:hover) .checked-indicator {
    background-color: ${is};
  }
  :host(:active) .checked-indicator {
    background-color: ${cs};
  }
  :host(:disabled) .checked-indicator,
  :host([readonly]) .checked-indicator {
    background: ${Et};
  }
  :host(${ve}:disabled) .checked-indicator {
    background: ${Et};
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:not([slot='input']):focus-visible) {
    border-color: ${fo};
    outline: ${Cr} solid ${fo};
    outline-offset: 1px;
    box-shadow: ${Fr}, 0 0 0 2px ${Xt};
  }
`.withBehaviors(
  Ot(R`
    :host {
      border-color: InactiveBorder;
    }
    :host(${ve}),
    :host(${ve}:active),
    :host(${ve}:hover) {
      background: Highlight;
      border-color: Highlight;
    }
    .checked-indicator,
    :host(:hover) .checked-indicator,
    :host(:active) .checked-indicator {
      background-color: ActiveCaption;
    }
    :host(${ve}) .checked-indicator,
    :host(${ve}:hover) .checked-indicator,
    :host(${ve}:active) .checked-indicator {
      background-color: ButtonFace;
    }
    :host(:disabled) .checked-indicator,
    :host(${ve}:disabled) .checked-indicator {
      background-color: GrayText;
    }
  `)
);
var ri = Vr.compose({ name: `${ue.prefix}-switch`, template: ti, styles: oi });
ri.define(ue.registry);
var ko = class {};
function Kr(o) {
  return y` <slot name="end" ${we("end")}>${It(o.end)}</slot> `.inline();
}
function Ur(o) {
  return y` <slot name="start" ${we("start")}>${It(o.start)}</slot> `.inline();
}
function qr(o, ...e) {
  let t = uo.locate(o);
  e.forEach((n) => {
    Object.getOwnPropertyNames(n.prototype).forEach((d) => {
      d !== "constructor" && Object.defineProperty(o.prototype, d, Object.getOwnPropertyDescriptor(n.prototype, d));
    }),
      uo.locate(n).forEach((d) => t.push(d));
  });
}
var Pe = { menuitem: "menuitem", menuitemcheckbox: "menuitemcheckbox", menuitemradio: "menuitemradio" },
  Ic = { [Pe.menuitem]: "menuitem", [Pe.menuitemcheckbox]: "menuitemcheckbox", [Pe.menuitemradio]: "menuitemradio" };
var Ie = class extends G {
  constructor() {
    super(...arguments),
      (this.elementInternals = this.attachInternals()),
      (this.role = Pe.menuitem),
      (this.checked = !1),
      (this.handleMenuItemKeyDown = (e) => {
        if (e.defaultPrevented) return !1;
        switch (e.key) {
          case ne:
          case " ":
            return this.invoke(), !1;
          case ei:
            return this.disabled || (this.submenu?.togglePopover(!0), this.submenu?.focus()), !1;
          case Js:
            return (
              this.parentElement?.hasAttribute("popover") &&
                (this.parentElement.togglePopover(!1), this.parentElement.parentElement?.focus()),
              !1
            );
        }
        return !0;
      }),
      (this.handleMenuItemClick = (e) => (e.defaultPrevented || this.disabled || this.invoke(), !1)),
      (this.handleMouseOver = (e) => (this.disabled || this.submenu?.togglePopover(!0), !1)),
      (this.handleMouseOut = (e) => (this.contains(document.activeElement) || this.submenu?.togglePopover(!1), !1)),
      (this.toggleHandler = (e) => {
        e instanceof ToggleEvent &&
          e.newState === "open" &&
          (this.setAttribute("tabindex", "-1"),
          (this.elementInternals.ariaExpanded = "true"),
          this.setSubmenuPosition()),
          e instanceof ToggleEvent &&
            e.newState === "closed" &&
            ((this.elementInternals.ariaExpanded = "false"), this.setAttribute("tabindex", "0"));
      }),
      (this.invoke = () => {
        if (!this.disabled)
          switch (this.role) {
            case Pe.menuitemcheckbox:
              this.checked = !this.checked;
              break;
            case Pe.menuitem:
              if (this.submenu) {
                this.submenu.togglePopover(!0), this.submenu.focus();
                break;
              }
              this.$emit("change");
              break;
            case Pe.menuitemradio:
              this.checked || (this.checked = !0);
              break;
          }
      }),
      (this.setSubmenuPosition = () => {
        if (!CSS.supports("anchor-name", "--anchor") && this.submenu) {
          let e = this.getBoundingClientRect(),
            t = this.submenu.getBoundingClientRect(),
            n = getComputedStyle(this).direction === "ltr" ? "right" : "left";
          if (e.width + t.width > window.innerWidth * 0.75) {
            this.submenu.style.translate = "0 -100%";
            return;
          }
          if (e[n] + t.width > window.innerWidth) {
            this.submenu.style.translate = "-100% 0";
            return;
          }
          this.submenu.style.translate = `${e.width - 8}px 0`;
        }
      });
  }
  disabledChanged(e, t) {
    (this.elementInternals.ariaDisabled = t ? `${t}` : null), dt(this.elementInternals, "disabled", t);
  }
  roleChanged(e, t) {
    this.elementInternals.role = t ?? Pe.menuitem;
  }
  checkedChanged(e, t) {
    let n = this.role !== Pe.menuitem;
    (this.elementInternals.ariaChecked = n ? `${!!t}` : null),
      dt(this.elementInternals, "checked", n ? t : !1),
      this.$fastController.isConnected && this.$emit("change", t, { bubbles: !0 });
  }
  slottedSubmenuChanged(e, t) {
    this.submenu?.removeEventListener("toggle", this.toggleHandler),
      t.length
        ? ((this.submenu = t[0]),
          this.submenu.toggleAttribute("popover", !0),
          this.submenu.addEventListener("toggle", this.toggleHandler),
          (this.elementInternals.ariaHasPopup = "menu"),
          dt(this.elementInternals, "submenu", !0))
        : ((this.elementInternals.ariaHasPopup = null), dt(this.elementInternals, "submenu", !1));
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.elementInternals.role = this.role ?? Pe.menuitem),
      (this.elementInternals.ariaChecked = this.role !== Pe.menuitem ? `${!!this.checked}` : null);
  }
};
$([W({ mode: "boolean" })], Ie.prototype, "disabled", void 0);
$([W], Ie.prototype, "role", void 0);
$([W({ mode: "boolean" })], Ie.prototype, "checked", void 0);
$([W({ mode: "boolean" })], Ie.prototype, "hidden", void 0);
$([P], Ie.prototype, "slottedSubmenu", void 0);
$([P], Ie.prototype, "submenu", void 0);
qr(Ie, ko);
var Ve = class extends G {
  constructor() {
    super(...arguments),
      (this.slottedMenuList = []),
      (this.slottedTriggers = []),
      (this._open = !1),
      (this.toggleMenu = () => {
        this._menuList?.togglePopover(!this._open);
      }),
      (this.closeMenu = (e) => {
        (e?.target instanceof Ie &&
          (e.target.getAttribute("role") === Pe.menuitemcheckbox ||
            e.target.getAttribute("role") === Pe.menuitemradio)) ||
          (this._menuList?.togglePopover(!1),
          this.closeOnScroll && document.removeEventListener("scroll", this.closeMenu));
      }),
      (this.openMenu = (e) => {
        this._menuList?.togglePopover(!0),
          e && this.openOnContext && e.preventDefault(),
          this.closeOnScroll && document.addEventListener("scroll", this.closeMenu);
      }),
      (this.toggleHandler = (e) => {
        if (e.type === "toggle" && e.newState) {
          let t = e.newState === "open";
          this._trigger?.setAttribute("aria-expanded", `${t}`), (this._open = t), this._open && this.focusMenuList();
        }
      }),
      (this.triggerKeydownHandler = (e) => {
        if (e.defaultPrevented) return;
        switch (e.key) {
          case " ":
          case ne:
            e.preventDefault(), this.toggleMenu();
            break;
          default:
            return !0;
        }
      }),
      (this.documentClickHandler = (e) => {
        e.composedPath().some((t) => t === this._trigger || t === this._menuList) || this.closeMenu();
      });
  }
  connectedCallback() {
    super.connectedCallback(),
      queueMicrotask(() => {
        this.setComponent();
      });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.removeListeners();
  }
  setComponent() {
    this.$fastController.isConnected &&
      this.slottedMenuList.length &&
      this.slottedTriggers.length &&
      ((this._trigger = this.slottedTriggers[0]),
      (this._menuList = this.slottedMenuList[0]),
      this._trigger.setAttribute("aria-haspopup", "true"),
      this._trigger.setAttribute("aria-expanded", `${this._open}`),
      this._menuList.setAttribute("popover", this.openOnContext ? "manual" : ""),
      this.addListeners());
  }
  focusMenuList() {
    nt.enqueue(() => {
      this._menuList.focus();
    });
  }
  focusTrigger() {
    nt.enqueue(() => {
      this._trigger.focus();
    });
  }
  openOnHoverChanged(e, t) {
    t
      ? this._trigger?.addEventListener("mouseover", this.openMenu)
      : this._trigger?.removeEventListener("mouseover", this.openMenu);
  }
  persistOnItemClickChanged(e, t) {
    t
      ? this._menuList?.removeEventListener("change", this.closeMenu)
      : this._menuList?.addEventListener("change", this.closeMenu);
  }
  openOnContextChanged(e, t) {
    t
      ? this._trigger?.addEventListener("contextmenu", this.openMenu)
      : this._trigger?.removeEventListener("contextmenu", this.openMenu);
  }
  closeOnScrollChanged(e, t) {
    t ? document.addEventListener("scroll", this.closeMenu) : document.removeEventListener("scroll", this.closeMenu);
  }
  addListeners() {
    this._menuList?.addEventListener("toggle", this.toggleHandler),
      this._trigger?.addEventListener("keydown", this.triggerKeydownHandler),
      this.persistOnItemClick || this._menuList?.addEventListener("change", this.closeMenu),
      this.openOnHover
        ? this._trigger?.addEventListener("mouseover", this.openMenu)
        : this.openOnContext
          ? (this._trigger?.addEventListener("contextmenu", this.openMenu),
            document.addEventListener("click", this.documentClickHandler))
          : this._trigger?.addEventListener("click", this.toggleMenu);
  }
  removeListeners() {
    this._menuList?.removeEventListener("toggle", this.toggleHandler),
      this._trigger?.removeEventListener("keydown", this.triggerKeydownHandler),
      this.persistOnItemClick || this._menuList?.removeEventListener("change", this.closeMenu),
      this.openOnHover && this._trigger?.removeEventListener("mouseover", this.openMenu),
      this.openOnContext
        ? (this._trigger?.removeEventListener("contextmenu", this.openMenu),
          document.removeEventListener("click", this.documentClickHandler))
        : this._trigger?.removeEventListener("click", this.toggleMenu);
  }
  menuKeydownHandler(e) {
    if (e.defaultPrevented) return;
    switch (e.key) {
      case Xr:
        e.preventDefault(), this._open && (this.closeMenu(), this.focusTrigger());
        break;
      case "Tab":
        if (
          (this._open && this.closeMenu(),
          e.shiftKey &&
            e.composedPath()[0] !== this._trigger &&
            e.composedPath()[0].assignedSlot !== this.primaryAction)
        )
          this.focusTrigger();
        else if (e.shiftKey) return !0;
      default:
        return !0;
    }
  }
};
$([W({ attribute: "open-on-hover", mode: "boolean" })], Ve.prototype, "openOnHover", void 0);
$([W({ attribute: "open-on-context", mode: "boolean" })], Ve.prototype, "openOnContext", void 0);
$([W({ attribute: "close-on-scroll", mode: "boolean" })], Ve.prototype, "closeOnScroll", void 0);
$([W({ attribute: "persist-on-item-click", mode: "boolean" })], Ve.prototype, "persistOnItemClick", void 0);
$([W({ mode: "boolean" })], Ve.prototype, "split", void 0);
$([P], Ve.prototype, "slottedMenuList", void 0);
$([P], Ve.prototype, "slottedTriggers", void 0);
$([P], Ve.prototype, "primaryAction", void 0);
var ni = R`
  ${ut("inline-block")}

  ::slotted([slot='trigger']) {
    anchor-name: --menu-trigger;
  }

  ::slotted([popover]) {
    margin: 0;
    max-height: var(--menu-max-height, auto);
    position-anchor: --menu-trigger;
    position-area: block-end span-inline-end;
    position-try-fallbacks: flip-block;
    position: absolute;
    z-index: 1;
  }

  :host([split]) ::slotted([popover]) {
    position-area: block-end span-inline-start;
  }

  ::slotted([popover]:popover-open) {
    inset: unset;
  }

  ::slotted([popover]:not(:popover-open)) {
    display: none;
  }

  :host([split]) {
    display: inline-flex;
  }

  :host([split]) ::slotted([slot='primary-action']) {
    border-inline-end: ${Nt} solid ${mo};
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  /* Keeps focus visible visuals above trigger slot*/
  :host([split]) ::slotted([slot='primary-action']:focus-visible) {
    z-index: 1;
  }

  :host([split]) ::slotted([slot='primary-action'][appearance='primary']) {
    border-inline-end: ${Nt} solid white;
  }

  :host([split]) ::slotted([slot='trigger']) {
    border-inline-start: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }
`;
function Ac() {
  return y`
    <template
      ?open-on-hover="${(o) => o.openOnHover}"
      ?open-on-context="${(o) => o.openOnContext}"
      ?close-on-scroll="${(o) => o.closeOnScroll}"
      ?persist-on-item-click="${(o) => o.persistOnItemClick}"
      @keydown="${(o, e) => o.menuKeydownHandler(e.event)}"
    >
      <slot name="primary-action" ${we("primaryAction")}></slot>
      <slot name="trigger" ${Pt({ property: "slottedTriggers", filter: mr() })}></slot>
      <slot ${Pt({ property: "slottedMenuList", filter: mr() })}></slot>
    </template>
  `;
}
var ai = Ac();
var si = Ve.compose({ name: `${ue.prefix}-menu`, template: ai, styles: ni });
si.define(ue.registry);
var ii = R`
  ${ut("grid")}

  :host {
    --indent: 0;
    align-items: center;
    background: ${Dr};
    border-radius: ${_o};
    color: ${Vt};
    contain: layout;
    cursor: pointer;
    /* Prevent shrinking of MenuItems when max-height is applied to MenuList */
    flex-shrink: 0;
    font: ${Gt} ${yr} / ${wr} ${jt};
    grid-gap: 4px;
    grid-template-columns: 20px 20px auto 20px;
    height: 32px;
    overflow: visible;
    padding: 0 10px;
  }

  :host(:hover) {
    background: ${Hr};
    color: ${Er};
  }

  :host(:active) {
    background-color: ${vs};
    color: ${Lr};
  }

  :host(:active) ::slotted([slot='start']) {
    color: ${ls};
  }

  :host(${Qt}) {
    background-color: ${vo};
    color: ${Et};
  }

  :host(${Qt}) ::slotted([slot='start']),
  :host(${Qt}) ::slotted([slot='end']) {
    color: ${Et};
  }

  :host(:focus-visible) {
    border-radius: ${_o};
    outline: 2px solid ${Xt};
  }

  .content {
    white-space: nowrap;
    flex-grow: 1;
    grid-column: auto / span 2;
    padding: 0 2px;
  }

  :host(:not(${ve})) .indicator,
  :host(:not(${ve})) ::slotted([slot='indicator']),
  :host(:not(${Jo})) .submenu-glyph,
  :host(:not(${Jo})) ::slotted([slot='submenu-glyph']) {
    display: none;
  }

  ::slotted([slot='end']) {
    color: ${go};
    font: ${Gt} ${ho} / ${Br} ${jt};
    white-space: nowrap;
  }

  :host([data-indent='1']) {
    --indent: 1;
  }

  :host([data-indent='2']) {
    --indent: 2;
    grid-template-columns: 20px 20px auto auto;
  }

  :host(${Jo}) {
    grid-template-columns: 20px auto auto 20px;
  }

  :host([data-indent='2']${Jo}) {
    grid-template-columns: 20px 20px auto auto 20px;
  }

  .indicator,
  ::slotted([slot='indicator']) {
    grid-column: 1 / span 1;
    width: 20px;
  }

  ::slotted([slot='start']) {
    display: inline-flex;
    grid-column: calc(var(--indent)) / span 1;
  }

  .content {
    grid-column: calc(var(--indent) + 1) / span 1;
  }

  ::slotted([slot='end']) {
    grid-column: calc(var(--indent) + 2) / span 1;
    justify-self: end;
  }

  .submenu-glyph,
  ::slotted([slot='submenu-glyph']) {
    grid-column: -2 / span 1;
    justify-self: end;
  }

  @layer popover {
    :host {
      anchor-name: --menu-trigger;
      position: relative;
    }

    ::slotted([popover]) {
      margin: 0;
      max-height: var(--menu-max-height, auto);
      position: absolute;
      position-anchor: --menu-trigger;
      position-area: inline-end span-block-end;
      position-try-fallbacks: flip-inline, block-start, block-end;
      z-index: 1;
    }

    ::slotted([popover]:not(:popover-open)) {
      display: none;
    }

    ::slotted([popover]:popover-open) {
      inset: unset;
    }

    /* Fallback for no anchor-positioning */
    @supports not (anchor-name: --menu-trigger) {
      ::slotted([popover]) {
        align-self: start;
      }
    }
  }
`.withBehaviors(
  Ot(R`
    :host(${Qt}),
    :host(${Qt}) ::slotted([slot='start']),
    :host(${Qt}) ::slotted([slot='end']) {
      color: GrayText;
    }
  `)
);
var Rc = y.partial(
    '<svg class="indicator" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.05 3.49c.28.3.27.77-.04 1.06l-7.93 7.47A.85.85 0 014.9 12L2.22 9.28a.75.75 0 111.06-1.06l2.24 2.27 7.47-7.04a.75.75 0 011.06.04z" fill="currentColor"></path></svg>'
  ),
  $c = y.partial(
    '<svg class="submenu-glyph" fill="currentColor" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.74 3.2a.75.75 0 00-.04 1.06L9.23 8 5.7 11.74a.75.75 0 101.1 1.02l4-4.25a.75.75 0 000-1.02l-4-4.25a.75.75 0 00-1.06-.04z" fill="currentColor"></path></svg>'
  );
function Mc(o = {}) {
  return y`
    <template
      @keydown="${(e, t) => e.handleMenuItemKeyDown(t.event)}"
      @click="${(e, t) => e.handleMenuItemClick(t.event)}"
      @mouseover="${(e, t) => e.handleMouseOver(t.event)}"
      @mouseout="${(e, t) => e.handleMouseOut(t.event)}"
      @toggle="${(e, t) => e.toggleHandler(t.event)}"
    >
      <slot name="indicator"> ${It(o.indicator)} </slot>
      ${Ur(o)}
      <div part="content" class="content">
        <slot></slot>
      </div>
      ${Kr(o)}
      <slot name="submenu-glyph"> ${It(o.submenuGlyph)} </slot>
      <slot name="submenu" ${Pt({ property: "slottedSubmenu" })}></slot>
    </template>
  `;
}
var ci = Mc({ indicator: Rc, submenuGlyph: $c });
var li = Ie.compose({ name: `${ue.prefix}-menu-item`, template: ci, styles: ii });
li.define(ue.registry);
var So = { separator: "separator", presentation: "presentation" },
  Gn = Zs;
var yo = class extends G {
  constructor() {
    super(...arguments), (this.elementInternals = this.attachInternals());
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.elementInternals.role = this.role ?? So.separator),
      this.role !== So.presentation && (this.elementInternals.ariaOrientation = this.orientation ?? Gn.horizontal);
  }
  roleChanged(e, t) {
    this.$fastController.isConnected && (this.elementInternals.role = `${t ?? So.separator}`),
      t === So.presentation && (this.elementInternals.ariaOrientation = null);
  }
  orientationChanged(e, t) {
    (this.elementInternals.ariaOrientation = this.role !== So.presentation ? (t ?? null) : null),
      Qs(this.elementInternals, e, t, Gn);
  }
};
$([W], yo.prototype, "role", void 0);
$([W], yo.prototype, "orientation", void 0);
var Zt = class extends yo {};
$([W({ attribute: "align-content" })], Zt.prototype, "alignContent", void 0);
$([W], Zt.prototype, "appearance", void 0);
$([W({ mode: "boolean" })], Zt.prototype, "inset", void 0);
function Wc() {
  return y`<slot></slot>`;
}
var di = Wc();
var ui = R`
  ${ut("flex")}

  :host {
    contain: content;
  }

  :host::after,
  :host::before {
    align-self: center;
    background: ${Ns};
    box-sizing: border-box;
    content: '';
    display: flex;
    flex-grow: 1;
    height: ${Nt};
  }

  :host([inset]) {
    padding: 0 12px;
  }

  :host ::slotted(*) {
    color: ${Vt};
    font-family: ${jt};
    font-size: ${ho};
    font-weight: ${Gt};
    margin: 0;
    padding: 0 12px;
  }

  :host([align-content='start'])::before,
  :host([align-content='end'])::after {
    flex-basis: 12px;
    flex-grow: 0;
    flex-shrink: 0;
  }

  :host([orientation='vertical']) {
    align-items: center;
    flex-direction: column;
    height: 100%;
    min-height: 84px;
  }

  :host([orientation='vertical']):empty {
    min-height: 20px;
  }

  :host([orientation='vertical'][inset])::before {
    margin-top: 12px;
  }
  :host([orientation='vertical'][inset])::after {
    margin-bottom: 12px;
  }

  :host([orientation='vertical']):empty::before,
  :host([orientation='vertical']):empty::after {
    height: 10px;
    min-height: 10px;
    flex-grow: 0;
  }

  :host([orientation='vertical'])::before,
  :host([orientation='vertical'])::after {
    width: ${Nt};
    min-height: 20px;
    height: 100%;
  }

  :host([orientation='vertical']) ::slotted(*) {
    display: flex;
    flex-direction: column;
    padding: 12px 0;
    line-height: 20px;
  }

  :host([orientation='vertical'][align-content='start'])::before {
    min-height: 8px;
  }
  :host([orientation='vertical'][align-content='end'])::after {
    min-height: 8px;
  }

  :host([appearance='strong'])::before,
  :host([appearance='strong'])::after {
    background: ${mo};
  }
  :host([appearance='strong']) ::slotted(*) {
    color: ${Nr};
  }
  :host([appearance='brand'])::before,
  :host([appearance='brand'])::after {
    background: ${Ls};
  }
  :host([appearance='brand']) ::slotted(*) {
    color: ${ds};
  }
  :host([appearance='subtle'])::before,
  :host([appearance='subtle'])::after {
    background: ${Es};
  }
  :host([appearance='subtle']) ::slotted(*) {
    color: ${go};
  }
`.withBehaviors(
  Ot(R`
    :host([appearance='strong'])::before,
    :host([appearance='strong'])::after,
    :host([appearance='brand'])::before,
    :host([appearance='brand'])::after,
    :host([appearance='subtle'])::before,
    :host([appearance='subtle'])::after,
    :host::after,
    :host::before {
      background: WindowText;
      color: WindowText;
    }
  `)
);
var pi = Zt.compose({ name: `${ue.prefix}-divider`, template: di, styles: ui });
pi.define(ue.registry);
import { loadTimeData as ft } from "edge://resources/js/load_time_data.js";
import {
  EdgeExtensionsDisableReason as At,
  EdgeExtensionsInPrivateState as Vn,
  EdgeExtensionsInstallSource as mi,
  EdgeExtensionsState as Qr,
  EdgeExtensionsUserScriptsState as Xn,
} from "../../edge_mobile_extension.mojom-webui.js";
import { assert as zc } from "edge://resources/js/assert.js";
function hi() {
  let o = document.documentElement,
    e = Number.parseFloat(getComputedStyle(o).zoom);
  return Number.isNaN(e) ? 1 : e;
}
function gi(o, e) {
  zc(o, e);
}
function Yr(o, e) {
  let t = 0;
  return function (...n) {
    let a = Date.now();
    a - t >= e && ((t = a), o(...n));
  };
}
function vi(o, e) {
  let t;
  return function (...n) {
    t !== void 0 && clearTimeout(t),
      (t = setTimeout(() => {
        o(...n);
      }, e));
  };
}
var jc = R`
  :host {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    contain: layout size;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${Tt};
  }

  .menu {
    position: fixed;
    /* The 2 CSS variables are passed in view model. */
    left: var(--menu-x);
    top: var(--menu-y);
    margin: ${X} max(${F}, env(safe-area-inset-right)) max(${X}, env(safe-area-inset-bottom)) max(${F}, env(safe-area-inset-left));
    background: ${Ut};
    border-radius:${Mr};
    box-shadow: ${_s}, ${zs};
    width: 254px;
    overflow: hidden;
    pointer-events: auto;
    will-change: transform;
    contain: layout;
  }

  fluent-menu-item {
    min-height: 48px;
    padding: ${ie} ${qt};
    font-size: ${_e};
    line-height: 1.29;
    letter-spacing: -0.43px;
    color: ${se};
    display: flex;
    align-items: center;
  }
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${Ws} ${F};
    min-height: 48px;
    box-sizing: border-box;
  }

  .menu-item.with-divider {
    border-top: 0.5px solid ${Dt};
  }

  @media (prefers-color-scheme: dark) {
    .menu {
      background: #3d3d3d;
    }
  }

  .user-scripts-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .question-mark-icon {
    width: 20px;
    height: 20px;
    filter: ${We};
    cursor: pointer;
  }
`,
  Gc = y`
<div ${we("overlay")}
  class="overlay"
  @click=${(o) => o.dismiss()}
  @keyup=${(o, e) => e.event.key === ne && o.dismiss()}>
</div>
<fluent-menu ${we("menu")} class="menu" @keyup=${(o, e) => e.event.key === Xr && o.dismiss()}>
<hint-icon :extensionDisableReason=${(o) => o.extensionDisableReason} :extensionStatus=${(o) => o.extensionStatus}></hint-icon>
${j(
  (o) => !o.isExtensionBlocked(),
  () => y`
  <fluent-menu-item tabindex="0" role="menuitem">
    ${ft.getString("action_enable")}
    <fluent-switch
      slot="end"
      checked=${(o) => o.extensionStatus === Qr.kEnabled}
      @change=${(o, e) => o.changeState(e.event)}>
    </fluent-switch>
  </fluent-menu-item>
  ${j(
    (o) => o.isSupportedUserScripts(),
    y`
  <fluent-menu-item tabindex="0" role="menuitem">
    <div class="user-scripts-container">
      ${ft.getString("allow_user_scripts")}
      <img src="extension_question_mark.svg" aria-hidden="true" class="question-mark-icon" @click=${(o) => {
        o.showUserScriptsExplanation(), o.dismiss();
      }} />
    </div>
    <fluent-switch
      slot="end"
      checked=${(o) => o.userScriptsState === Xn.kEnabled}
      @change=${(o, e) => o.changeUserScriptState(e.event)}>
    </fluent-switch>
  </fluent-menu-item>
  `
  )}
  ${j(
    (o) => o.isSupportedInPrivate(),
    y`
  <fluent-menu-item tabindex="0" role="menuitem">
    ${ft.getString("action_enable_in_private")}
    <fluent-switch
      slot="end"
      checked=${(o) => o.inPrivateState === Vn.kEnabled}
      @change=${(o, e) => o.changeInPrivateState(e.event)}>
    </fluent-switch>
  </fluent-menu-item>
  `
  )}
     ${j(
       (o) => o.installSource !== mi.kLocalCrx,
       y`
  <fluent-menu-item tabindex="0"
    @keyup=${(o, e) => e.event.key === "Enter" && o.openDetailPage()}
    @click=${(o) => o.openDetailPage()}>
    ${ft.getString("action_detail")}
  </fluent-menu-item>
    `
     )}
  <fluent-menu-item tabindex="0"
    @keyup=${(o, e) => e.event.key === "Enter" && o.showPermission()}
    @click=${(o) => o.showPermission()}>
    ${ft.getString("action_permissions")}
  </fluent-menu-item>`
)}
<fluent-divider></fluent-divider>
<fluent-menu-item tabindex="0"
  @keyup=${(o, e) => e.event.key === "Enter" && o.removeExtension()}
  @click=${(o) => o.removeExtension()}>
  ${ft.getString("action_remove")}
</fluent-menu-item>
</fluent-menu>
`,
  Oe = class extends G {
    constructor() {
      super(...arguments);
      this.anchorElement = null;
      this.extensionIndex = 0;
      this.extensionStatus = Qr.kDisabled;
      this.extensionDisableReason = [];
      this.inPrivateState = Vn.kNotSupported;
      this.userScriptsState = Xn.kNotSupported;
      this.installSource = mi.kWebStore;
      this.onContextMenuDismiss = () => {
        this.dismiss();
      };
      this.dismiss = () => {
        this.onMenuClick?.("dismiss", this.extension);
      };
    }
    isExtensionBlocked() {
      return this.extensionDisableReason.includes(At.kBanned) || this.extensionDisableReason.includes(At.kInBlockList);
    }
    isSupportedInPrivate() {
      return this.inPrivateState !== Vn.kNotSupported;
    }
    isSupportedUserScripts() {
      return this.userScriptsState !== Xn.kNotSupported;
    }
    connectedCallback() {
      super.connectedCallback(),
        this.setupPosition(),
        document.addEventListener(Yo, this.onContextMenuDismiss),
        this.updateSwitchState(),
        this.setFocusToFirstElement();
    }
    disconnectedCallback() {
      document.removeEventListener(Yo, this.onContextMenuDismiss);
    }
    extensionEnabledChanged() {
      this.$fastController.notify("extensionStatus"), this.updateSwitchState();
    }
    updateSwitchState() {
      let t = this.shadowRoot?.querySelector("fluent-switch");
      t && ((t.checked = this.extensionStatus === Qr.kEnabled), t.checkedChanged && t.checkedChanged());
    }
    setFocusToFirstElement() {
      setTimeout(() => {
        let t = this.shadowRoot?.querySelector('[tabindex="0"]');
        if (t) {
          t.focus();
          return;
        }
      }, 100);
    }
    setupPosition() {
      if (!this.anchorElement) return;
      this.anchorElement.clientHeight;
      let t = this.anchorElement.getBoundingClientRect(),
        n = t.left,
        a = t.bottom;
      this.style.setProperty("--menu-x", `${n}px`),
        this.style.setProperty("--menu-y", `${a}px`),
        this.style.setProperty("opacity", "0"),
        this.menu.clientHeight;
      let d = hi(),
        u = window.innerWidth / d,
        c = window.innerHeight / d,
        h = this.menu.getBoundingClientRect(),
        r = getComputedStyle(this.menu),
        i = n,
        s = a;
      h.right > u && (i = n - (h.right - u) - Number.parseFloat(r.marginRight)),
        h.bottom > c && (s = a - (h.bottom - c) - Number.parseFloat(r.marginBottom)),
        h.left < 0 && (i = 0),
        h.top < 0 && (s = 0),
        this.style.setProperty("--menu-x", `${i}px`),
        this.style.setProperty("--menu-y", `${s}px`),
        this.style.removeProperty("opacity");
    }
    changeState(t) {
      let a = t.target.checked;
      this.onMenuClick?.("enabled", this.extension, a);
    }
    changeInPrivateState(t) {
      let a = t.target.checked;
      this.onMenuClick?.("in-private-enabled", this.extension, a);
    }
    changeUserScriptState(t) {
      let a = t.target.checked;
      this.onMenuClick?.("user-script-enabled", this.extension, a);
    }
    showUserScriptsExplanation() {
      this.onMenuClick?.("show-user-scripts-explanation", this.extension);
    }
    openDetailPage() {
      this.onMenuClick?.("detail", this.extension);
    }
    showPermission() {
      this.onMenuClick?.("permission", this.extension);
    }
    removeExtension() {
      this.onMenuClick?.("remove", this.extension);
    }
  };
w([P], Oe.prototype, "anchorElement", 2),
  w([P], Oe.prototype, "extensionIndex", 2),
  w([P], Oe.prototype, "extensionStatus", 2),
  w([P], Oe.prototype, "extensionDisableReason", 2),
  w([P], Oe.prototype, "inPrivateState", 2),
  w([P], Oe.prototype, "userScriptsState", 2),
  w([P], Oe.prototype, "installSource", 2),
  w([P], Oe.prototype, "extension", 2),
  w([P], Oe.prototype, "onMenuClick", 2),
  (Oe = w([q({ name: "context-menu", template: Gc, styles: jc })], Oe));
var Vc = y`
  ${j(
    (o) => o.shouldShowHint(),
    () => y`
    <div class="content">
      <div class="icon">
        <img src="${(o) => o.getHintIcon()}" alt="hint icon" />
      </div>
      <div class="text">
        ${(o) => o.getHintMessage()}
      </div>
    </div>
  `
  )}
`,
  Xc = R`
  .content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    cursor: default;
    margin-top: 16px;
    background-color: ${Gs};
  }

  .text {
    font-size: ${_e};
    line-height: 1.29;
    letter-spacing: -0.43px;
    color: ${js};
  }

  .icon {
    width: 16px !important;
    height: 16px !important;
  }
`,
  Bo = class extends G {
    constructor() {
      super(...arguments);
      this.extensionDisableReason = [];
    }
    shouldShowHint() {
      return this.extensionStatus === Qr.kDisabled && this.getHintIcon() !== "";
    }
    getHintMessage() {
      return this.extensionDisableReason.includes(At.kBanned)
        ? ft.getString("banned_message")
        : this.extensionDisableReason.includes(At.kInBlockList)
          ? ft.getString("malware_message")
          : this.extensionDisableReason.includes(At.kTerminated)
            ? ft.getString("terminated_message")
            : "";
    }
    getHintIcon() {
      return this.extensionDisableReason.includes(At.kBanned) || this.extensionDisableReason.includes(At.kInBlockList)
        ? "extension_banned_icon.svg"
        : this.extensionDisableReason.includes(At.kTerminated)
          ? "extension_hint_icon.svg"
          : "";
    }
  };
w([P], Bo.prototype, "extensionDisableReason", 2),
  w([P], Bo.prototype, "extensionStatus", 2),
  (Bo = w([q({ name: "hint-icon", template: Vc, styles: Xc })], Bo));
import { loadTimeData as Kc } from "edge://resources/js/load_time_data.js";
var Uc = R`
  :host {
    display: block;
  }

  .debug-card {
    display: flex;
    background: ${Me};
    border-radius: ${Be};
    padding: ${F};
    box-shadow: ${Rs}, ${As};
    margin-bottom: ${Be};
    align-items: center;
    gap: ${F};
    min-width: 0;
    cursor: pointer;
  }

  @media (orientation: landscape) {
    .debug-card {
      margin-bottom: ${F};
      flex: 0 0 calc(50% - ${F});
    }
  }

  .left {
    display: flex;
    align-items: center;
    gap: ${Ms};
    min-width: 0;
    flex: 1;
  }

   .icon {
    flex: 0 0 auto;
    width: ${Rn};
    height: ${Rn};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${Ht};
    color: ${Or};
  }

  .icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    color: ${Or};
  }

  .extension-name {
    font-weight: ${He};
    font-size: ${je};
    line-height: 1.33;
    letter-spacing: -0.23px;
    color: ${Or};
  }
`,
  qc = y`
  <div class="debug-card"
    role="button"
    @click=${(o) => o.handleloadCrxPackage()}
    @keydown=${(o, e) => e.event.key === "Enter" && o.handleloadCrxPackage()}>
    <div class="left">
      <span class="icon">+</span>
      <span class="extension-name">${Kc.getString("load_crx_package")}</span>
    </div>
  </div>
`,
  Zr = class extends G {
    async handleloadCrxPackage() {
      try {
        await _.loadCrxPackage(), console.info("CRX package loaded successfully");
      } catch (e) {
        console.error("Failed to load CRX package:", e);
      }
    }
  };
Zr = w([q({ name: "debug-card", template: qc, styles: Uc })], Zr);
var Yc = R`
  :host {
    display: block;
    width: 100%;
  }

  .local-card {
    display: flex;
    justify-content: space-between;
    background: ${Me};
    border-radius: ${Be};
    padding: ${F};
    box-shadow: ${Rr} ${Ar};
    margin-bottom: ${X};
    align-items: center;
    gap: ${F};
    min-width: 0;
  }

  .left {
    display: flex;
    align-items: center;
    gap: ${F};
    min-width: 0;
    flex: 1;
  }

  .icon {
    flex: 0 0 auto;
    width: ${ze};
    height: ${ze};
    background: ${Ce};
    border-radius: 8px;
  }

  .extension-name {
    height: 18px;
    background: ${Ce};
    border-radius: 4px;
    width: 60%;
    flex: 1;
    min-width: 0;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  .more-button {
    width: 24px;
    height: 24px;
    background: ${Ce};
    border-radius: 50%;
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      ${Ce} 25%,
      rgba(255, 255, 255, 0.1) 50%,
      ${Ce} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (orientation: landscape) {
    .local-card {
      margin-bottom: ${F};
      flex: 0 0 calc(50% - ${F});
    }
  }
`,
  Qc = y`
  <div class="local-card">
    <div class="left">
      <div class="icon shimmer"></div>
      <div class="extension-name shimmer"></div>
    </div>
    <div class="right">
      <div class="more-button shimmer"></div>
    </div>
  </div>
`,
  Jr = class extends G {};
Jr = w([q({ name: "local-loading-skeleton", template: Qc, styles: Yc })], Jr);
import { loadTimeData as en } from "edge://resources/js/load_time_data.js";
import {
  EdgeExtensionsDisableReason as eo,
  EdgeExtensionsInPrivateState as fi,
  EdgeExtensionsState as tr,
  EdgeExtensionsUserScriptsState as xi,
} from "../../edge_mobile_extension.mojom-webui.js";
var Zc = y`
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12ZM18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14Z" fill="${ct}"/>
</svg>
`,
  Jc = y`
<local-loading-skeleton></local-loading-skeleton>
`,
  el = y`
<div class="card"
  tabindex="0"
  aria-label="${(o) => o.extension.localInfo?.name}"
  @click=${(o) => o.handleInstallCardClick()}
  @keyup=${(o, e) => o.onKeyUpInstallCard(e.event)}>
  <div class="left" aria-hidden="true">
    <div class="icon">
      <img src="${(o) => o.extension.localInfo?.imageBase64}" alt="" style="opacity: ${(o) => (o.extension.localInfo?.state === tr.kDisabled ? 0.2 : 1)}"/>
      ${(o) => {
        if (o.extension.localInfo?.state === tr.kDisabled) {
          if (
            o.extension.localInfo?.disableReasons?.includes(eo.kInBlockList) ||
            o.extension.localInfo?.disableReasons?.includes(eo.kBanned)
          )
            return y`<img class="icon-hint" src="extension_banned_icon.svg" alt=""/>`;
          if (o.extension.localInfo?.disableReasons?.includes(eo.kTerminated))
            return y`<img class="icon-hint" src="extension_hint_icon.svg" alt=""/>`;
        }
        return "";
      }}
    </div>
    <div class="extension-name" style="opacity: ${(o) => (o.extension.localInfo?.state === tr.kDisabled ? 0.2 : 1)}">${(o) => o.extension.localInfo?.name}</div>
  </div>
  <div class="right"
    tabindex="0"
    role="button"
    aria-label="${en.getString("accessibility_more_options")}"
    @click="${(o, e) => o.handleMoreButtonClick(e.event)}"
    @keyup="${(o, e) => o.onKeyUpMoreButton(e.event)}">
    ${Zc}
  </div>
</div>
`,
  tl = y`
${j((o) => o.extension.localInfo === void 0 || o.extension.localInfo === null, Jc, el)}
`,
  ol = R`
  .card {
    display: flex;
    justify-content: space-between;
    background: ${Me};
    border-radius: ${Be};
    padding: ${F};
    border: ${Go} solid ${Dt};
    margin-bottom: ${X};
    align-items: center;
    gap: ${F};
    min-width: 0;
  }

  @media (orientation: landscape) {
    .card {
      margin-bottom: ${F};
      flex: 0 0 calc(50% - ${F});
    }
  }

  @media (prefers-color-scheme: dark) {
    .card {
      border: none;
    }
  }

  .left {
    display: flex;
    align-items: center;
    gap: ${F};
    min-width: 0;
    flex: 1;
  }

  .icon {
    flex: 0 0 auto;
    width: ${ze};
    height: ${ze};
    position: relative;
  }

  .icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .icon .icon-hint {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 16px !important;
    height: 16px !important;
    z-index: 1;
  }

  .right {
    background: ${Tt};
    border: none;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .extension-name {
    font-weight: ${He};
    font-size: ${je};
    line-height: 1.33;
    letter-spacing: -0.23px;
    color: ${se};
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    min-width: 0;
  }
`,
  Jt = class extends G {
    constructor() {
      super(...arguments);
      this.onExtensionDataLoaded = (t) => {
        let n = t.detail;
        n.extensionId === this.extensionId &&
          (n.data.localInfo && (this.extension = { ...this.extension, localInfo: n.data.localInfo }),
          n.data.remoteInfo && (this.extension = { ...this.extension, remoteInfo: n.data.remoteInfo }));
      };
      this.onExtensionEnableStatusUpdated = (t) => {
        let n = t.detail;
        if (n.extensionId === this.extensionId && this.extension.localInfo) {
          let a = {
            ...this.extension.localInfo,
            state: n.enable ? tr.kEnabled : tr.kDisabled,
            disableReasons: n.enable ? [] : [eo.kUserAction],
          };
          this.extension = { ...this.extension, localInfo: a };
        }
      };
      this.onExtensionInPrivateEnableStatusUpdated = (t) => {
        let n = t.detail;
        if (n.extensionId === this.extensionId && this.extension.localInfo) {
          let a = { ...this.extension.localInfo, inPrivateState: n.enable ? fi.kEnabled : fi.kDisabled };
          this.extension = { ...this.extension, localInfo: a };
        }
      };
      this.onExtensionUserScriptsEnableStatusUpdated = (t) => {
        let n = t.detail;
        if (n.extensionId !== this.extensionId || !this.extension.localInfo) return;
        let a = { ...this.extension.localInfo, userScriptsState: n.enable ? xi.kEnabled : xi.kDisabled };
        this.extension = { ...this.extension, localInfo: a };
      };
    }
    connectedCallback() {
      super.connectedCallback(),
        document.addEventListener(tt, this.onExtensionDataLoaded),
        document.addEventListener(Xo, this.onExtensionEnableStatusUpdated),
        document.addEventListener(Ko, this.onExtensionInPrivateEnableStatusUpdated),
        document.addEventListener(Uo, this.onExtensionUserScriptsEnableStatusUpdated);
    }
    disconnectedCallback() {
      super.disconnectedCallback(),
        document.removeEventListener(tt, this.onExtensionDataLoaded),
        document.removeEventListener(Xo, this.onExtensionEnableStatusUpdated),
        document.removeEventListener(Ko, this.onExtensionInPrivateEnableStatusUpdated),
        document.removeEventListener(Uo, this.onExtensionUserScriptsEnableStatusUpdated);
    }
    extensionIdChanged(t, n) {
      this.extension || (this.extension = { extensionId: this.extensionId, localInfo: null, remoteInfo: null }),
        (this.extension = { ...this.extension, extensionId: this.extensionId }),
        _.loadExtensionData(this.extensionId);
    }
    handleMoreButtonClick(t) {
      this.extension && (t.stopPropagation(), this.showContextMenuCallback?.(t, this.extension));
    }
    onKeyUpMoreButton(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.handleMoreButtonClick(t));
    }
    handleInstallCardClick() {
      if (this.extension.localInfo?.disableReasons?.includes(eo.kBanned)) {
        _.showSnackBarWithMessage(en.getString("banned_message"), "");
        return;
      }
      if (this.extension.localInfo?.disableReasons?.includes(eo.kInBlockList)) {
        _.showSnackBarWithMessage(en.getString("malware_message"), "");
        return;
      }
      if (this.extension.localInfo?.disableReasons?.includes(eo.kTerminated)) {
        _.showSnackBarWithMessage(en.getString("terminated_message"), "");
        return;
      }
    }
    onKeyUpInstallCard(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.handleInstallCardClick());
    }
  };
w([P], Jt.prototype, "extension", 2),
  w([P], Jt.prototype, "extensionId", 2),
  w([P], Jt.prototype, "showContextMenuCallback", 2),
  (Jt = w([q({ name: "local-extension-card", template: tl, styles: ol })], Jt));
import { loadTimeData as rl } from "edge://resources/js/load_time_data.js";
import {
  EdgeExtensionsHubAction as Rt,
  EdgeExtensionsInPrivateState as nl,
  EdgeExtensionsInstallSource as al,
  EdgeExtensionsPageType as wo,
  EdgeExtensionsState as yi,
  EdgeExtensionsUserScriptsState as sl,
} from "../../edge_mobile_extension.mojom-webui.js";
import { EdgeExtensionsHubAction as bi, EdgeExtensionsPageType as ki } from "../edge_mobile_extension.mojom-webui.js";
function Si(o) {
  return _.openUrl({ url: `https://microsoftedge.microsoft.com/addons/report/${o}` });
}
function tn(o, e = ki.kHub) {
  _.performHubAction(bi.kRemove, o, e);
}
function on(o, e = ki.kHub) {
  _.performHubAction(bi.kInstall, o, e);
}
function rn(o) {
  let e = localStorage.getItem(`${o}`);
  return e ? JSON.parse(e) : null;
}
var il = R`
  :host {
    display: block;
    width: 100%;
  }

  .section-container {
    width: 100%;
    padding: ${X} ${ie} ${X} ${ie};
  }

  .section-header {
    font-weight: ${He};
    font-size: ${_e};
    line-height: 1.29;
    letter-spacing: -0.43px;
    color: ${se};
    margin-bottom: ${X};
  }
`,
  cl = y`
<context-menu
  :anchorElement=${(o) => o.contextMenuAnchorElement}
  :extensionStatus=${(o) => o.contextMenuExtensionStatus}
  :extensionDisableReason=${(o) => o.contextMenuExtensionDisableReason}
  :installSource=${(o) => o.contextMenuInstallSource}
  :inPrivateState=${(o) => o.contextMenuInPrivateState}
  :userScriptsState=${(o) => o.contextMenuUserScriptsState}
  :extensionIndex=${(o) => o.contextMenuExtensionIndex}
  :extension=${(o) => o.contextMenuExtension}
  :onMenuClick=${(o) => o.onMenuClick.bind(o)}>
</context-menu>`,
  ll = y`
<div class="section-container">
  <div class="section-header">${rl.getString("installed_title")}</div>
  ${j((o) => o.isDeveloperEnabled, y`<debug-card></debug-card>`)}
  ${it(
    (o) => o.extensionIds,
    y`
    <local-extension-card
      :extensionId=${(o) => o}
      :showContextMenuCallback=${(o, e) => e.parent.showContextMenu.bind(e.parent)}>>
    </local-extension-card>`
  )}
</div>
${j((o) => o.isContextMenuVisible, cl)}
`,
  Ne = class extends G {
    constructor() {
      super(...arguments);
      this.extensionIds = [];
      this.contextMenuAnchorElement = null;
      this.contextMenuExtensionIndex = 0;
      this.contextMenuExtensionStatus = yi.kDisabled;
      this.contextMenuInPrivateState = nl.kNotSupported;
      this.contextMenuUserScriptsState = sl.kNotSupported;
      this.contextMenuExtensionDisableReason = [];
      this.contextMenuInstallSource = al.kWebStore;
      this.isDeveloperEnabled = !1;
      this.isContextMenuVisible = !1;
    }
    onMenuClick(t, n, a) {
      switch (t) {
        case "enabled": {
          _.performHubAction(a ? Rt.kEnable : Rt.kDisable, n, wo.kHub);
          break;
        }
        case "in-private-enabled": {
          _.performHubAction(a ? Rt.kEnableInPrivate : Rt.kDisableInPrivate, n, wo.kHub);
          break;
        }
        case "user-script-enabled": {
          _.performHubAction(a ? Rt.kEnableUserScripts : Rt.kDisableUserScripts, n, wo.kHub);
          break;
        }
        case "show-user-scripts-explanation": {
          _.performHubAction(Rt.kShowUserScriptsExplanation, n, wo.kHub);
          break;
        }
        case "detail": {
          (this.isContextMenuVisible = !1), this.showDetail(n);
          break;
        }
        case "permission": {
          (this.isContextMenuVisible = !1), _.performHubAction(Rt.kPermissions, n, wo.kHub);
          break;
        }
        case "remove": {
          (this.isContextMenuVisible = !1), tn(n, wo.kHub);
          break;
        }
        case "dismiss": {
          this.isContextMenuVisible = !1;
          break;
        }
        default: {
          gi(!1, "Unhandled MenuAction");
          break;
        }
      }
    }
    showContextMenu(t, n) {
      t.stopPropagation(),
        t.currentTarget instanceof HTMLElement &&
          ((this.contextMenuAnchorElement = t.currentTarget),
          (this.contextMenuExtensionIndex = this.extensionIds.indexOf(n.extensionId)),
          (this.contextMenuExtension = n),
          n.localInfo &&
            ((this.contextMenuExtensionStatus = n.localInfo.state),
            (this.contextMenuInPrivateState = n.localInfo.inPrivateState),
            (this.contextMenuUserScriptsState = n.localInfo.userScriptsState),
            (this.contextMenuExtensionDisableReason = n.localInfo.disableReasons),
            (this.contextMenuInstallSource = n.localInfo.installSource)),
          Promise.resolve().then(() => {
            (this.isContextMenuVisible = !0),
              requestAnimationFrame(() => {
                let a = this.shadowRoot?.querySelector("context-menu");
                a &&
                  ((a.extensionEnabled = this.contextMenuExtensionStatus === yi.kEnabled),
                  a.extensionEnabledChanged && a.extensionEnabledChanged());
              });
          }));
    }
    showDetail(t) {
      document.dispatchEvent(new CustomEvent(Yt, { detail: t }));
    }
  };
w([P], Ne.prototype, "extensionIds", 2),
  w([P], Ne.prototype, "contextMenuAnchorElement", 2),
  w([P], Ne.prototype, "contextMenuExtensionIndex", 2),
  w([P], Ne.prototype, "contextMenuExtensionStatus", 2),
  w([P], Ne.prototype, "contextMenuInPrivateState", 2),
  w([P], Ne.prototype, "contextMenuUserScriptsState", 2),
  w([P], Ne.prototype, "contextMenuExtensionDisableReason", 2),
  w([P], Ne.prototype, "contextMenuInstallSource", 2),
  w([P], Ne.prototype, "contextMenuExtension", 2),
  w([P], Ne.prototype, "isDeveloperEnabled", 2),
  w([P], Ne.prototype, "isContextMenuVisible", 2),
  (Ne = w([q({ name: "installed-section", template: ll, styles: il })], Ne));
var dl = R`
  :host {
    display: block;
    width: 100%;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 54px;
    gap: ${F};
    border-radius: ${Be};
    padding: ${F};
    box-shadow: ${Rr} ${Ar};
    margin-bottom: ${X};
    background: ${Me};
  }

  .left {
    display: flex;
    gap: ${F};
    min-width: 0;
  }

  .icon {
    flex: 0 0 auto;
    width: ${ze};
    height: ${ze};
    background: ${Ce};
    border-radius: ${mt};
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: ${mt};
    flex: 1;
    min-width: 0;
  }

  .title {
    height: 18px;
    background: ${Ce};
    border-radius: 4px;
    width: 60%;
  }

  .paragraph {
    height: 14px;
    background: ${Ce};
    border-radius: 4px;
    margin-bottom: 2px;
  }

  .paragraph:first-of-type {
    width: 85%;
  }

  .paragraph:last-of-type {
    width: 70%;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: ${X};
    margin-top: ${mt};
  }

  .rating-skeleton {
    width: 60px;
    height: 12px;
    background: ${Ce};
    border-radius: 4px;
  }

  .text-skeleton {
    width: 40px;
    height: 12px;
    background: ${Ce};
    border-radius: 4px;
  }

  .right {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-width: 54px;
  }

  .button-skeleton {
    width: 54px;
    height: 28px;
    background: ${Ce};
    border-radius: ${X};
  }

  .shimmer {
    background: linear-gradient(
      90deg,
      ${Ce} 25%,
      rgba(255, 255, 255, 0.1) 50%,
      ${Ce} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @media (orientation: landscape) {
    .container {
      margin-bottom: ${F};
      flex: 0 0 calc(50% - ${F});
    }
  }
`,
  ul = y`
  <div class="container">
    <div class="left">
      <div class="icon shimmer"></div>
      <div class="content">
        <div class="title shimmer"></div>
        <div class="paragraph shimmer"></div>
        <div class="paragraph shimmer"></div>
        <div class="meta">
          <div class="rating-skeleton shimmer"></div>
          <div class="text-skeleton shimmer"></div>
          <div class="text-skeleton shimmer"></div>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="button-skeleton shimmer"></div>
    </div>
  </div>
`,
  nn = class extends G {};
nn = w([q({ name: "remote-loading-skeleton", template: ul, styles: dl })], nn);
var or = { submit: "submit", reset: "reset", button: "button" };
var Se = class extends G {
  disabledChanged() {
    this.$fastController.isConnected &&
      (this.disabled
        ? this.removeAttribute("tabindex")
        : (this.tabIndex = Number(this.getAttribute("tabindex") ?? 0) < 0 ? -1 : 0));
  }
  disabledFocusableChanged(e, t) {
    this.$fastController.isConnected && (this.elementInternals.ariaDisabled = `${!!t}`);
  }
  get form() {
    return this.elementInternals.form;
  }
  static {
    this.formAssociated = !0;
  }
  get labels() {
    return Object.freeze(Array.from(this.elementInternals.labels));
  }
  typeChanged(e, t) {
    t !== or.submit &&
      (this.formSubmissionFallbackControl?.remove(), this.shadowRoot?.querySelector('slot[name="internal"]')?.remove());
  }
  clickHandler(e) {
    if (e && this.disabledFocusable) {
      e.stopImmediatePropagation();
      return;
    }
    return this.press(), !0;
  }
  connectedCallback() {
    super.connectedCallback(),
      (this.elementInternals.ariaDisabled = `${!!this.disabledFocusable}`),
      this.disabledChanged();
  }
  constructor() {
    super(),
      (this.disabled = !1),
      (this.disabledFocusable = !1),
      (this.elementInternals = this.attachInternals()),
      (this.elementInternals.role = "button");
  }
  createAndInsertFormSubmissionFallbackControl() {
    let e = this.formSubmissionFallbackControlSlot ?? document.createElement("slot");
    e.setAttribute("name", "internal"), this.shadowRoot?.appendChild(e), (this.formSubmissionFallbackControlSlot = e);
    let t = this.formSubmissionFallbackControl ?? document.createElement("button");
    (t.style.display = "none"),
      t.setAttribute("type", "submit"),
      t.setAttribute("slot", "internal"),
      this.formNoValidate && t.toggleAttribute("formnovalidate", !0),
      this.elementInternals.form?.id && t.setAttribute("form", this.elementInternals.form.id),
      this.name && t.setAttribute("name", this.name),
      this.value && t.setAttribute("value", this.value),
      this.formAction && t.setAttribute("formaction", this.formAction ?? ""),
      this.formEnctype && t.setAttribute("formenctype", this.formEnctype ?? ""),
      this.formMethod && t.setAttribute("formmethod", this.formMethod ?? ""),
      this.formTarget && t.setAttribute("formtarget", this.formTarget ?? ""),
      this.append(t),
      (this.formSubmissionFallbackControl = t);
  }
  formDisabledCallback(e) {
    this.disabled = e;
  }
  keypressHandler(e) {
    if (e && this.disabledFocusable) {
      e.stopImmediatePropagation();
      return;
    }
    if (e.key === ne || e.key === " ") {
      this.click();
      return;
    }
    return !0;
  }
  press() {
    switch (this.type) {
      case or.reset: {
        this.resetForm();
        break;
      }
      case or.submit: {
        this.submitForm();
        break;
      }
    }
  }
  resetForm() {
    this.elementInternals.form?.reset();
  }
  submitForm() {
    if (!(!this.elementInternals.form || this.disabled || this.type !== or.submit)) {
      if (
        !this.name &&
        !this.formAction &&
        !this.formEnctype &&
        !this.formAttribute &&
        !this.formMethod &&
        !this.formNoValidate &&
        !this.formTarget
      ) {
        this.elementInternals.form.requestSubmit();
        return;
      }
      try {
        this.elementInternals.setFormValue(this.value ?? ""), this.elementInternals.form.requestSubmit(this);
      } catch {
        this.createAndInsertFormSubmissionFallbackControl(),
          this.elementInternals.setFormValue(null),
          this.elementInternals.form.requestSubmit(this.formSubmissionFallbackControl);
      }
    }
  }
};
$([W({ mode: "boolean" })], Se.prototype, "autofocus", void 0);
$([P], Se.prototype, "defaultSlottedContent", void 0);
$([W({ mode: "boolean" })], Se.prototype, "disabled", void 0);
$([W({ attribute: "disabled-focusable", mode: "boolean" })], Se.prototype, "disabledFocusable", void 0);
$([W({ attribute: "formaction" })], Se.prototype, "formAction", void 0);
$([W({ attribute: "form" })], Se.prototype, "formAttribute", void 0);
$([W({ attribute: "formenctype" })], Se.prototype, "formEnctype", void 0);
$([W({ attribute: "formmethod" })], Se.prototype, "formMethod", void 0);
$([W({ attribute: "formnovalidate", mode: "boolean" })], Se.prototype, "formNoValidate", void 0);
$([W({ attribute: "formtarget" })], Se.prototype, "formTarget", void 0);
$([W], Se.prototype, "name", void 0);
$([W], Se.prototype, "type", void 0);
$([W], Se.prototype, "value", void 0);
var xt = class extends Se {
  constructor() {
    super(...arguments), (this.iconOnly = !1);
  }
};
$([W], xt.prototype, "appearance", void 0);
$([W], xt.prototype, "shape", void 0);
$([W], xt.prototype, "size", void 0);
$([W({ attribute: "icon-only", mode: "boolean" })], xt.prototype, "iconOnly", void 0);
qr(xt, ko);
var pl = R`
  ${ut("inline-flex")}

  :host {
    --icon-spacing: ${Ja};
    position: relative;
    contain: layout style;
    vertical-align: middle;
    align-items: center;
    box-sizing: border-box;
    justify-content: center;
    text-align: center;
    text-decoration-line: none;
    margin: 0;
    min-height: 32px;
    outline-style: none;
    background-color: ${Dr};
    color: ${Nr};
    border: ${Nt} solid ${mo};
    padding: 0 ${ts};
    min-width: 96px;
    border-radius: ${_o};
    font-size: ${yr};
    font-family: ${jt};
    font-weight: ${Ya};
    line-height: ${wr};
    transition-duration: ${rs};
    transition-property: background, border, color;
    transition-timing-function: ${Pr};
    cursor: pointer;
    user-select: none;
  }

  .content {
    display: inherit;
  }

  :host(:hover) {
    background-color: ${Hr};
    color: ${as};
    border-color: ${Cs};
  }

  :host(:hover:active) {
    background-color: ${gs};
    border-color: ${Ps};
    color: ${ss};
    outline-style: none;
  }

  :host(:focus-visible) {
    border-color: ${fo};
    outline: ${Cr} solid ${fo};
    box-shadow: ${Fr}, 0 0 0 2px ${Xt};
  }

  @media screen and (prefers-reduced-motion: reduce) {
    :host {
      transition-duration: 0.01ms;
    }
  }

  ::slotted(svg) {
    font-size: 20px;
    height: 20px;
    width: 20px;
    fill: currentColor;
  }

  ::slotted([slot='start']) {
    margin-inline-end: var(--icon-spacing);
  }

  ::slotted([slot='end']),
  [slot='end'] {
    flex-shrink: 0;
    margin-inline-start: var(--icon-spacing);
  }

  :host([icon-only]) {
    min-width: 32px;
    max-width: 32px;
  }

  :host([size='small']) {
    --icon-spacing: ${Za};
    min-height: 24px;
    min-width: 64px;
    padding: 0 ${es};
    border-radius: ${Xa};
    font-size: ${ho};
    line-height: ${Br};
    font-weight: ${Gt};
  }

  :host([size='small'][icon-only]) {
    min-width: 24px;
    max-width: 24px;
  }

  :host([size='large']) {
    min-height: 40px;
    border-radius: ${Ka};
    padding: 0 ${os};
    font-size: ${Ua};
    line-height: ${qa};
  }

  :host([size='large'][icon-only]) {
    min-width: 40px;
    max-width: 40px;
  }

  :host([size='large']) ::slotted(svg) {
    font-size: 24px;
    height: 24px;
    width: 24px;
  }

  :host(:is([shape='circular'], [shape='circular']:focus-visible)) {
    border-radius: ${Sr};
  }

  :host(:is([shape='square'], [shape='square']:focus-visible)) {
    border-radius: ${Va};
  }

  :host([appearance='primary']) {
    background-color: ${bs};
    color: ${Tr};
    border-color: transparent;
  }

  :host([appearance='primary']:hover) {
    background-color: ${ks};
  }

  :host([appearance='primary']:is(:hover, :hover:active):not(:focus-visible)) {
    border-color: transparent;
  }

  :host([appearance='primary']:is(:hover, :hover:active)) {
    color: ${Tr};
  }

  :host([appearance='primary']:hover:active) {
    background-color: ${Ss};
  }

  :host([appearance='primary']:focus-visible) {
    border-color: ${Tr};
    box-shadow: ${Ts}, 0 0 0 2px ${Xt};
  }

  :host([appearance='outline']) {
    background-color: ${Lt};
  }

  :host([appearance='outline']:hover) {
    background-color: ${Dn};
  }

  :host([appearance='outline']:hover:active) {
    background-color: ${Hn};
  }

  :host([appearance='subtle']) {
    background-color: ${ms};
    color: ${Vt};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover) {
    background-color: ${fs};
    color: ${Er};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover:active) {
    background-color: ${xs};
    color: ${Lr};
    border-color: transparent;
  }

  :host([appearance='subtle']:hover) ::slotted(svg) {
    fill: ${Ln};
  }

  :host([appearance='subtle']:hover:active) ::slotted(svg) {
    fill: ${Tn};
  }

  :host([appearance='transparent']) {
    background-color: ${Lt};
    color: ${Vt};
  }

  :host([appearance='transparent']:hover) {
    background-color: ${Dn};
    color: ${Ln};
  }

  :host([appearance='transparent']:hover:active) {
    background-color: ${Hn};
    color: ${Tn};
  }

  :host(:is([appearance='transparent'], [appearance='transparent']:is(:hover, :active))) {
    border-color: transparent;
  }
`,
  Bi = R`
  ${pl}

  :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable])),
  :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable]):hover),
  :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable]):hover:active) {
    background-color: ${vo};
    border-color: ${jo};
    color: ${Et};
    cursor: not-allowed;
  }

  :host([appearance='primary']:is(:disabled, [disabled-focusable])),
  :host([appearance='primary']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    border-color: transparent;
  }

  :host([appearance='outline']:is(:disabled, [disabled-focusable])),
  :host([appearance='outline']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    background-color: ${Lt};
  }

  :host([appearance='subtle']:is(:disabled, [disabled-focusable])),
  :host([appearance='subtle']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    background-color: ${Lt};
    border-color: transparent;
  }

  :host([appearance='transparent']:is(:disabled, [disabled-focusable])),
  :host([appearance='transparent']:is(:disabled, [disabled-focusable]):is(:hover, :hover:active)) {
    border-color: transparent;
    background-color: ${Lt};
  }
`.withBehaviors(
    Ot(R`
    :host {
      background-color: ButtonFace;
      color: ButtonText;
    }

    :host(:is(:hover, :focus-visible)) {
      border-color: Highlight !important;
    }

    :host([appearance='primary']:not(:is(:hover, :focus-visible))) {
      background-color: Highlight;
      color: HighlightText;
      forced-color-adjust: none;
    }

    :host(:is(:disabled, [disabled-focusable], [appearance]:disabled, [appearance][disabled-focusable])) {
      background-color: ButtonFace;
      color: GrayText;
      border-color: ButtonText;
    }
  `)
  );
function hl(o = {}) {
  return y`
    <template
      @click="${(e, t) => e.clickHandler(t.event)}"
      @keypress="${(e, t) => e.keypressHandler(t.event)}"
    >
      ${Ur(o)}
      <span class="content" part="content">
        <slot ${Pt("defaultSlottedContent")}></slot>
      </span>
      ${Kr(o)}
    </template>
  `;
}
var wi = hl();
var Ci = xt.compose({ name: `${ue.prefix}-button`, template: wi, styles: Bi });
Ci.define(ue.registry);
var Pi = y`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.5 3C11.5376 3 14 5.46243 14 8.5C14 9.83879 13.5217 11.0659 12.7266 12.0196L16.8536 16.1464C17.0488 16.3417 17.0488 16.6583 16.8536 16.8536C16.68 17.0271 16.4106 17.0464 16.2157 16.9114L16.1464 16.8536L12.0196 12.7266C11.0659 13.5217 9.83879 14 8.5 14C5.46243 14 3 11.5376 3 8.5C3 5.46243 5.46243 3 8.5 3ZM8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4Z" fill="currentColor"/>
</svg>`,
  Ni = y`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM5.80943 5.11372C5.61456 4.97872 5.34514 4.99801 5.17157 5.17157L5.11372 5.24082C4.97872 5.43569 4.99801 5.70511 5.17157 5.87868L7.29289 8L5.17157 10.1213L5.11372 10.1906C4.97872 10.3854 4.99801 10.6549 5.17157 10.8284L5.24082 10.8863C5.43569 11.0213 5.70511 11.002 5.87868 10.8284L8 8.70711L10.1213 10.8284L10.1906 10.8863C10.3854 11.0213 10.6549 11.002 10.8284 10.8284L10.8863 10.7592C11.0213 10.5643 11.002 10.2949 10.8284 10.1213L8.70711 8L10.8284 5.87868L10.8863 5.80943C11.0213 5.61456 11.002 5.34514 10.8284 5.17157L10.7592 5.11372C10.5643 4.97872 10.2949 4.99801 10.1213 5.17157L8 7.29289L5.87868 5.17157L5.80943 5.11372Z" fill="currentColor"/>
</svg>`,
  Ei = y`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.35355 4.10355C7.54882 3.90829 7.54882 3.59171 7.35355 3.39645C7.15829 3.20118 6.84171 3.20118 6.64645 3.39645L4.5 5.54289L3.35355 4.39645C3.15829 4.20118 2.84171 4.20118 2.64645 4.39645C2.45118 4.59171 2.45118 4.90829 2.64645 5.10355L4.14645 6.60355C4.34171 6.79882 4.65829 6.79882 4.85355 6.60355L7.35355 4.10355ZM5 0C2.23858 0 0 2.23858 0 5C0 7.76142 2.23858 10 5 10C7.76142 10 10 7.76142 10 5C10 2.23858 7.76142 0 5 0ZM1 5C1 2.79086 2.79086 1 5 1C7.20914 1 9 2.79086 9 5C9 7.20914 7.20914 9 5 9C2.79086 9 1 7.20914 1 5Z" fill="currentColor"/>
</svg>`,
  Li = y`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.28347 0.546045C4.57692 -0.0485521 5.42479 -0.0485508 5.71825 0.546045L6.82997 2.79866L9.31588 3.15988C9.97205 3.25523 10.2341 4.0616 9.75925 4.52443L7.96043 6.27785L8.38507 8.7537C8.49716 9.40723 7.81122 9.9056 7.22431 9.59704L5.00086 8.4281L2.7774 9.59704C2.19049 9.9056 1.50455 9.40723 1.61664 8.7537L2.04128 6.27784L0.242465 4.52443C-0.232349 4.0616 0.0296599 3.25523 0.685836 3.15988L3.17174 2.79865L4.28347 0.546045Z" fill="currentColor"/>
</svg>`,
  Ti = y`<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.28347 0.546045C4.57692 -0.0485521 5.42479 -0.0485508 5.71825 0.546045L6.82997 2.79866L9.31588 3.15988C9.97205 3.25523 10.2341 4.0616 9.75925 4.52443L7.96043 6.27785L8.38507 8.7537C8.49716 9.40723 7.81122 9.9056 7.22431 9.59704L5.00086 8.4281L2.7774 9.59704C2.19049 9.9056 1.50455 9.40723 1.61664 8.7537L2.04128 6.27784L0.242465 4.52443C-0.232349 4.0616 0.0296599 3.25523 0.685836 3.15988L3.17174 2.79865L4.28347 0.546045ZM5.00086 1.35201L4.02194 3.33551C3.90541 3.57162 3.68016 3.73528 3.41959 3.77314L1.23067 4.09121L2.81459 5.63515C3.00313 5.81894 3.08917 6.08374 3.04466 6.34326L2.67075 8.52334L4.62858 7.49404C4.86164 7.37152 5.14007 7.37151 5.37313 7.49404L7.33096 8.52333L6.95705 6.34326C6.91254 6.08374 6.99858 5.81894 7.18713 5.63515L8.77105 4.09121L6.58212 3.77314C6.32156 3.73528 6.0963 3.57162 5.97977 3.33551L5.00086 1.35201Z" fill="currentColor"/>
</svg>`,
  Di = y`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.15898 16.8666C9.36292 17.0528 9.67918 17.0384 9.86536 16.8345C10.0515 16.6305 10.0371 16.3143 9.8332 16.1281L3.66535 10.4974H17.4961C17.7722 10.4974 17.9961 10.2735 17.9961 9.99736C17.9961 9.72122 17.7722 9.49736 17.4961 9.49736H3.66824L9.8332 3.86927C10.0371 3.68309 10.0515 3.36684 9.86536 3.16289C9.67918 2.95895 9.36292 2.94456 9.15898 3.13074L2.24263 9.44478C2.10268 9.57254 2.02285 9.74008 2.00314 9.91323C1.99851 9.94058 1.99609 9.96869 1.99609 9.99736C1.99609 10.0242 1.99821 10.0506 2.00229 10.0763C2.02047 10.2522 2.10058 10.4229 2.24263 10.5526L9.15898 16.8666Z" fill="currentColor"/>
</svg>`,
  Hi = y`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.0016 1.99902C17.5253 1.99902 22.0031 6.47687 22.0031 12.0006C22.0031 17.5243 17.5253 22.0021 12.0016 22.0021C6.47785 22.0021 2 17.5243 2 12.0006C2 6.47687 6.47785 1.99902 12.0016 1.99902ZM12.0016 3.49902C7.30627 3.49902 3.5 7.3053 3.5 12.0006C3.5 16.6959 7.30627 20.5021 12.0016 20.5021C16.6968 20.5021 20.5031 16.6959 20.5031 12.0006C20.5031 7.3053 16.6968 3.49902 12.0016 3.49902ZM12 10.5C12.4142 10.5 12.75 10.8358 12.75 11.25V16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25V11.25C11.25 10.8358 11.5858 10.5 12 10.5ZM12 9C12.5523 9 13 8.55229 13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8C11 8.55229 11.4477 9 12 9Z" fill="currentColor"/>
</svg>`,
  Fi = y`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 7C1 3.68629 3.68629 1 7 1C8.7766 1 10.3732 1.77191 11.4723 3H9.5C9.22386 3 9 3.22386 9 3.5C9 3.77614 9.22386 4 9.5 4H12.5C12.7761 4 13 3.77614 13 3.5V0.5C13 0.223858 12.7761 0 12.5 0C12.2239 0 12 0.223858 12 0.5V2.10109C10.7299 0.804992 8.95906 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 6.8191 13.9931 6.6397 13.9796 6.46207C13.9587 6.18673 13.7185 5.98049 13.4431 6.00144C13.1678 6.02239 12.9615 6.26258 12.9825 6.53793C12.9941 6.69034 13 6.84443 13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7Z" fill="currentColor"/>
</svg>`;
var Ii = 5,
  gl = R`
  :host {
    display: flex;
    align-items: center;
    gap: ${X};
    width: 100%;
    min-width: 0;
    line-height: ${qt};
    font-size: ${ge};
    font-weight: ${fe};
    color: ${xo};
  }

  .rating {
    display: flex;
    gap: ${Vo};
  }

  .divider {
    user-select: none;
  }

  .author {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 1;
  }
`,
  vl = y`
  <div class="rating">
    ${it(
      (o) => Array(Math.round(o.rating)),
      y`
      <div class="star-icon" aria-hidden="true">${Li}</div>
    `
    )}
    ${it(
      (o) => Array(Ii - Math.round(o.rating)),
      y`
      <div class="star-icon" aria-hidden="true">${Ti}</div>
    `
    )}
  </div>
  <div class="rating-count">
    ${(o) => o.getRatingCountString()}
  </div>
  ${j(
    (o) => o.author,
    y`
    <div class="divider">|</div>
    <div class="author">
      ${(o) => o.author}
    </div>
  `
  )}
`,
  to = class extends G {
    constructor() {
      super(...arguments);
      this.rating = Ii;
      this.ratingCount = 0;
    }
    getRatingCountString() {
      return this.ratingCount >= 1e6
        ? `(${(this.ratingCount / 1e6).toFixed(1)}M)`
        : this.ratingCount >= 1e3
          ? `(${(this.ratingCount / 1e3).toFixed(1)}K)`
          : `(${this.ratingCount})`;
    }
  };
w([P], to.prototype, "rating", 2),
  w([P], to.prototype, "ratingCount", 2),
  w([P], to.prototype, "author", 2),
  (to = w([q({ name: "meta-info", template: vl, styles: gl })], to));
import { loadTimeData as Un } from "edge://resources/js/load_time_data.js";
import {
  EdgeExtensionsInstallPhase as Kn,
  EdgeExtensionsPageType as ml,
  ExtensionSearchAction as fl,
} from "../../edge_mobile_extension.mojom-webui.js";
var xl = R`
  :host {
    display: block;
    width: 100%;
  }

  .card {
    display: flex;
    gap: ${F};
    align-items: flex-start;
    border-radius: ${Be};
    padding: ${F};
    border: ${Go} solid ${Dt};
    margin-bottom: ${X};
    background: ${Me};
  }

  @media (prefers-color-scheme: dark) {
    .card {
      border: none;
    }
  }

  @media (orientation: landscape) {
    .card {
      margin-bottom: ${F};
      flex: 0 0 calc(50% - ${F});
    }
  }

  .icon {
    flex: 0 0 auto;
    width: ${ze};
    height: ${ze};
    object-fit: contain;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: ${mt};
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }

  .name {
    font-weight: ${He};
    font-size: ${je};
    line-height: ${$r};
    color: ${se};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta-text {
    font-weight: ${fe};
    font-size: ${ge};
    line-height: ${qt};
    color: ${xo};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
  }

  .meta-text.description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    white-space: normal;
    min-height: calc(1.33em * 2);
  }

  .button-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${Vo};
    flex: 0 0 auto;
  }

  .get-button {
    color: ${ct};
    padding: ${ie} ${X};
    height: 28px;
    min-width: 54px;
    border: ${Go} solid ${ct};
    border-radius: ${X};
    text-align: center;
    font-size: ${je};
    font-style: normal;
  }

  .unverified-label {
    font-size: ${Ks};
    font-weight: ${fe};
    line-height: ${Mr};
    color: ${We};
    text-align: center;
    white-space: nowrap;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    min-width: 54px;
  }

  .loading::after {
    content: '';
    width: ${et};
    height: ${et};
    border: ${Vo} solid ${ct};
    border-top-color: ${Tt};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .installed-mark {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${mt};
    height: 28px;
    min-width: 64px;
    color: ${Vs};
    line-height: ${qt};
  }

  .installed-icon {
    flex-shrink: 0;
  }

  .installed-text {
    font-weight: ${fe};
    font-size: ${ge};
    white-space: nowrap;
  }

  @media (orientation: landscape) {
    .card {
      margin-bottom: ${F};
      flex: 0 0 calc(50% - ${F});
    }
  }
`,
  bl = y`
<div class="button-container">
  <fluent-button class="get-button"
    @keyup="${(o, e) => o.onKeyUpGetButton(e.event)}"
    @click=${(o, e) => o.onClickGetButton(e.event)}>
    ${Un.getString("action_get_button")}
  </fluent-button>
  ${j((o) => !o.isRecommended, y`<div class="unverified-label">${Un.getString("unverified_hint")}</div>`)}
</div>
`,
  kl = y`
<div class="installed-mark">
  <div class="installed-icon" aria-hidden="true">${Ei}</div>
  <span class="installed-text">${Un.getString("installed_title")}</span>
</div>`,
  Sl = y`<div class="loading"></div>`,
  yl = y`
<div class="card"
  tabindex="0"
  aria-label="${(o) => o.extension.remoteInfo?.name + ", " + o.extension.remoteInfo?.shortDescription}"
  @click=${(o) => o.showDetail()}
  @keyup="${(o, e) => o.onKeyUpCard(e.event)}">
  <img class="icon" src="${(o) => o.logo}" aria-hidden="true" />
  <div class="content">
    <div class="name">${(o) => o.extension.remoteInfo?.name}</div>
    <div class="meta-text description">${(o) => o.extension.remoteInfo?.shortDescription}</div>
    <meta-info
      :rating="${(o) => o.extension.remoteInfo?.rating}"
      :ratingCount="${(o) => o.extension.remoteInfo?.ratingCount}"
      :author="${(o) => o.extension.remoteInfo?.author}">
    </meta-info>
  </div>
  ${j((o) => o.isInstalling(), Sl, y`${j((o) => o.isInstalled, kl, bl)}`)}
</div>
`,
  Xe = class extends G {
    constructor() {
      super(...arguments);
      this.installPhase = Kn.kIdle;
      this.isInstalled = !1;
      this.isRecommended = !0;
      this.onExtensionInstallProgressUpdated = (t) => {
        let n = t.detail;
        n.progress?.extensionId === this.extensionId && (this.installPhase = n.progress.installPhase);
      };
    }
    connectedCallback() {
      super.connectedCallback(),
        document.addEventListener(ot, this.onExtensionInstallProgressUpdated),
        _.getExtensionInstallPhase(this.extensionId).then((t) => {
          this.installPhase = t;
        });
    }
    disconnectedCallback() {
      super.disconnectedCallback(), document.removeEventListener(ot, this.onExtensionInstallProgressUpdated);
    }
    extensionChanged(t, n) {
      this.extension &&
        this.extension.remoteInfo &&
        ((this.logo = this.extension.remoteInfo.imageBase64),
        !this.logo &&
          this.extension.remoteInfo.logoUrl &&
          _.convertToBase64(this.extension.remoteInfo.logoUrl).then((a) => {
            this.logo = a;
          }));
    }
    isInstalling() {
      return this.installPhase === Kn.kInstalling || this.installPhase === Kn.kChecking;
    }
    showDetail() {
      Us(), document.dispatchEvent(new CustomEvent(Yt, { detail: this.extension }));
    }
    onKeyUpCard(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.showDetail());
    }
    onKeyUpGetButton(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.handleInstall());
    }
    onClickGetButton(t) {
      t.stopPropagation(), this.handleInstall();
    }
    handleInstall() {
      _.recordSearchAction(fl.kClickGetButtonOnResultPage), on(this.extension, ml.kHub);
    }
  };
w([P], Xe.prototype, "extensionId", 2),
  w([P], Xe.prototype, "extension", 2),
  w([P], Xe.prototype, "installPhase", 2),
  w([P], Xe.prototype, "logo", 2),
  w([P], Xe.prototype, "isInstalled", 2),
  w([P], Xe.prototype, "isRecommended", 2),
  (Xe = w([q({ name: "remote-extension-card", template: yl, styles: xl })], Xe));
var Bl = y`
<remote-loading-skeleton></remote-loading-skeleton>
`,
  wl = y`
<remote-extension-card
  :extensionId="${(o) => o.extensionId}"
  :extension="${(o) => o.extension}"
  :installPhase="${(o) => o.installPhase}">
</remote-extension-card>
`,
  Cl = y`
${j((o) => o.extension?.remoteInfo === void 0 || o.extension?.remoteInfo === null, Bl, wl)}
`,
  an = class extends Xe {
    constructor() {
      super(...arguments);
      this.inView = !1;
      this.onExtensionDataLoaded = (t) => {
        let n = t.detail;
        n.extensionId === this.extensionId &&
          n.data.remoteInfo &&
          (this.extension = { ...this.extension, remoteInfo: n.data.remoteInfo });
      };
    }
    connectedCallback() {
      super.connectedCallback(),
        document.addEventListener(tt, this.onExtensionDataLoaded),
        this.setupIntersectionObserver();
    }
    disconnectedCallback() {
      super.disconnectedCallback(),
        document.removeEventListener(tt, this.onExtensionDataLoaded),
        this.cleanupObservers(),
        (this.inView = !1);
    }
    setupIntersectionObserver() {
      (this.intersectionObserver = new IntersectionObserver(
        (t) => {
          for (let n of t)
            n.target === this &&
              n.isIntersecting &&
              ((this.inView = !0), this.loadExtensionData(), this.intersectionObserver?.unobserve(this));
        },
        { root: null, threshold: 0.1 }
      )),
        this.intersectionObserver.observe(this);
    }
    cleanupObservers() {
      this.intersectionObserver && (this.intersectionObserver.disconnect(), (this.intersectionObserver = void 0));
    }
    loadExtensionData() {
      let t = rn(this.extensionId);
      (this.extension = { ...this.extension, remoteInfo: t }), _.loadExtensionData(this.extensionId);
    }
    extensionIdChanged(t, n) {
      this.extension || (this.extension = { extensionId: this.extensionId, localInfo: null, remoteInfo: null }),
        (this.extension = { ...this.extension, extensionId: this.extensionId }),
        this.inView &&
          (this.loadExtensionData(),
          _.getExtensionInstallPhase(this.extensionId).then((a) => {
            this.installPhase = a;
          }));
    }
  };
an = w([q({ name: "deferred-remote-extension-card", template: Cl })], an);
import { loadTimeData as Oi } from "edge://resources/js/load_time_data.js";
var Pl = R`
  :host {
    display: block;
    width: 100%;
  }

  .section-container {
    width: 100%;
    padding: ${ie} ${ie} ${X} ${ie};
  }

  .section-description {
    color:${We};
    font-size: ${ge};
    line-height: ${F};
    padding: ${ie} ${ie} ${F} ${ie};
  }

  .section-header {
    font-weight: ${He};
    font-size: ${_e};
    line-height: 1.29;
    letter-spacing: -0.43px;
    color: ${se};
    margin-bottom: ${X};
    margin-top: ${X};
  }

  .scroll-sentinel {
    height: 1px;
    background: transparent;
  }
`,
  Nl = y`
${j(
  (o) => o.extensionIds.length > 0,
  y`
  <div class="section-container">
    <div class="section-header">${Oi.getString("recommend_title")}</div>
    <div class="section-description">${Oi.getString("recommend_subtitle")}</div>
      ${it((o) => o.visibleExtensionIds, y`<deferred-remote-extension-card :extensionId=${(o) => o}></deferred-remote-extension-card>`)}
  </div>
  <div class="scroll-sentinel"></div>
    `,
  y``
)}
`,
  Co = class extends G {
    constructor() {
      super(...arguments);
      this.extensionIds = [];
      this.visibleExtensionIds = [];
      this.pageSize = 10;
    }
    connectedCallback() {
      super.connectedCallback(), this.setupScrollSentinelObserver(), this.updateVisibleExtensions();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.cleanupObservers();
    }
    setupScrollSentinelObserver() {
      this.cleanupObservers();
      let t = this.shadowRoot?.querySelector(".scroll-sentinel");
      t &&
        ((this.scrollSentinelObserver = new IntersectionObserver(
          (n) => {
            n[0].isIntersecting && this.updateVisibleExtensions();
          },
          { root: this.parentElement || null, rootMargin: "400px" }
        )),
        this.scrollSentinelObserver.observe(t));
    }
    extensionIdsChanged(t, n) {
      this.updateVisibleExtensions(),
        this.visibleExtensionIds.length < this.extensionIds.length && this.setupScrollSentinelObserver();
    }
    cleanupObservers() {
      this.scrollSentinelObserver && (this.scrollSentinelObserver.disconnect(), (this.scrollSentinelObserver = void 0));
    }
    updateVisibleExtensions() {
      if (!this.extensionIds || this.extensionIds.length === 0) {
        this.visibleExtensionIds = [];
        return;
      }
      let t = Math.min(this.visibleExtensionIds.length + this.pageSize, this.extensionIds.length);
      t !== this.visibleExtensionIds.length &&
        ((this.visibleExtensionIds = this.extensionIds.slice(0, t)),
        this.visibleExtensionIds.length === this.extensionIds.length && this.cleanupObservers());
    }
  };
w([P], Co.prototype, "extensionIds", 2),
  w([P], Co.prototype, "visibleExtensionIds", 2),
  (Co = w([q({ name: "recommended-section", template: Nl, styles: Pl })], Co));
var El = y`
  <div class="loading-container">
    <div class="spinner"></div>
  </div>
`,
  Ll = R`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--colorBackgroundApp);
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border: ${$n} solid ${Is};
    border-top: ${$n} solid ${Os};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`,
  sn = class extends G {};
sn = w([q({ name: "loading-page", template: El, styles: Ll })], sn);
var Tl = y`
  <div class="disable-container">
    <h2 class="disable-title">Extensions not available</h2>
  </div>
`,
  Dl = R`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--colorBackgroundApp);
  }

  .disable-container {
    text-align: center;
    padding: ${et};
  }

  .disable-title {
    font-size: ${Ht};
    color: #000000;
    margin: ${ie} ${ie} ${X};
    font-weight: ${bo};
  }

  @media (prefers-color-scheme: dark) {
    .disable-title {
      color: #FFFFFF;
    }
  }
`,
  cn = class extends G {};
cn = w([q({ name: "disable-page", template: Tl, styles: Dl })], cn);
import { loadTimeData as bt } from "edge://resources/js/load_time_data.js";
import {
  EdgeExtensionsErrorType as Fl,
  EdgeExtensionsInstallPhase as rr,
  EdgeExtensionsInstallSource as Il,
  EdgeExtensionsPageType as Ai,
  ExtensionSearchAction as Ol,
} from "../edge_mobile_extension.mojom-webui.js";
var Al = R`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 100vh;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${Me};
    border-radius: ${ge};
    padding:  ${F} ${F};
    margin: ${F} max(${F}, env(safe-area-inset-right)) max(${F}, env(safe-area-inset-bottom)) max(${F}, env(safe-area-inset-left));
    gap: ${F};
    box-sizing: border-box;
  }

  .header {
    display: flex;
    gap: ${F};
    width: 100%;
  }

  .icon-container {
    width: 48px;
    height: 48px;
    border-radius: 5.33px;
    background-color: transparent;
    overflow: hidden;
  }

  .icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: ${mt};
    justify-content: center;
    flex: 1;
    min-width: 0;
  }

  .extension-name {
    font-weight: ${bo};
    font-size: ${F};
    line-height: 1.5;
    color: ${se};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .publisher {
    font-weight: ${fe};
    font-size: ${ge};
    line-height: 1.33;
    color: ${An};
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .button {
    width: 100%;
  }

  .button.installing {
    opacity: 1;
    cursor: not-allowed;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .description-container {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    padding: ${X} 0 0;
    width: 100%;
  }

  .description {
    font-weight: ${fe};
    font-size: ${ge};
    line-height: 1.33;
    color: ${se};
    text-align: left;
    width: 100%;
    white-space: pre-line;
    overflow-wrap: break-word;
  }

  .divider {
    width: 100%;
    height: 0.5px;
    background-color: ${$s};
    margin: ${F} 0;
  }

  .info-section {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

  .info-column {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .info-column-hidden {
    visibility: hidden;
  }

  .info-label {
    font-weight: ${fe};
    font-size: ${ge};
    line-height: 1.33;
    color: ${Kt};
  }

  .info-value {
    font-weight: ${fe};
    font-size: ${ge};
    line-height: 1.33;
    color: ${se};
  }

  .privacy-policy {
    font-weight: ${fe};
    font-size: ${ge};
    line-height: 1.33;
    color: ${An};
    text-decoration: none;
    cursor: pointer;
  }

  .report-abuse {
    width: 100%;
    margin-top: ${F};
    padding: ${ge};
    background: ${Tt};
    border: none;
    color: ${se};
    font-size: ${ge};
    cursor: pointer;
    text-align: center;
  }

  .not-recommended-hint {
    width: 100%;
    height: 100%;
    background-color: ${Fs};
    border-radius: ${Wr};
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-sizing: border-box;
    margin-top: -8px;
  }

  .not-recommended-icon {
    flex-shrink: 0;
    color: ${We};
  }

  .not-recommended-text {
    font-weight: ${fe};
    font-size: ${ge};
    color: ${We};
    flex: 1;
  }

  @media (orientation: landscape) {
    .container {
      padding: ${et};
    }

    .description-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .description {
      max-width: 800px;
    }

    .info-section {
      justify-content: flex-start;
      gap: 64px;
    }
  }
`,
  Rl = y`
<fluent-button
  class=${(o) => o.getButtonClass()}
  appearance=${(o) => o.getButtonAppearance()}
  ?disabled=${(o) => o.isInstalling()}
  @click=${(o) => o.handleExtensionAction()}
  @keyup=${(o, e) => e.event.key === ne && o.handleExtensionAction()}>
  ${(o) => o.getButtonState()}
</fluent-button>
`,
  $l = y`
${j(
  (o) => !o.isRecommended,
  y`
  <div class="not-recommended-hint">
    <div class="not-recommended-icon" aria-hidden="true">${Hi}</div>
    <div class="not-recommended-text">
      ${bt.getString("unverified_detail_hint")}
    </div>
  </div>
`
)}
`,
  Ml = y`
${(o) =>
  o.extension.localInfo?.installSource !== Il.kLocalCrx
    ? y`
<fluent-button
  class="button"
  appearance="outline"
  @click=${(e) => e.handleReportAbuse()}
  @keyup=${(e, t) => t.event.key === ne && e.handleReportAbuse()}>
  ${bt.getString("report_abuse_title")}
</fluent-button>`
    : ""}
`,
  Wl = y`<loading-page></loading-page>`,
  zl = y`<disable-page></disable-page>`,
  _l = y`
<div class="container">
  <div class="header">
    <div class="icon-container">
      <img class="icon" src="${(o) => o.extension.localInfo?.imageBase64 || o.extension.remoteInfo?.imageBase64}" aria-hidden="true"/>
    </div>
    <div class="content">
      <div class="extension-name">${(o) => o.getName()}</div>
      <div class="publisher"
        @click="${(o) => o.handleAuthorClick()}"
        @keyup="${(o, e) => e.event.key === ne && o.handleAuthorClick()}">
        ${(o) => o.extension.remoteInfo?.author}
      </div>
      <meta-info
        :rating="${(o) => o.extension.remoteInfo?.rating}"
        :ratingCount="${(o) => o.extension.remoteInfo?.ratingCount}">
      </meta-info>
    </div>
  </div>
  ${Rl}
  ${$l}
  <div class="description-container">
    <div class="description">
      ${(o) => o.extension.remoteInfo?.detailedDescription}
    </div>
  </div>
  <div class="divider"></div>
  <div class="info-section">
    <div class="info-column">
      <div class="info-label">${bt.getString("metadata_version_title")}</div>
      <div class="info-value">${(o) => o.extension.localInfo?.version || o.extension.remoteInfo?.version}</div>
    </div>
    <div class="info-column">
      <div class="info-label">${bt.getString("metadata_updated_title")}</div>
      <div class="info-value">${(o) => o.formatDate(o.extension.remoteInfo?.lastUpdateDate)}</div>
    </div>
    <div class="info-column ${(o) => (o.extension.remoteInfo?.privacyUrl?.url?.length ? "" : "info-column-hidden")}">
      <div class="info-label">${bt.getString("metadata_terms_title")}</div>
      <a
        href="${(o) => o.extension.remoteInfo?.privacyUrl}"
        class="privacy-policy"
        @click="${(o) => o.handlePrivacyPolicyClick()}"
        @keyup="${(o, e) => e.event.key === ne && o.handlePrivacyPolicyClick()}"
        target="_blank"
        rel="noopener noreferrer">
        ${bt.getString("metadata_privacy_policy_title")}
      </a>
    </div>
  </div>
  ${Ml}
</div>
`,
  jl = y`
${j((o) => o?.loadState === "loading", Wl)}
${j((o) => o?.loadState === "disable", zl)}
${j((o) => o?.loadState === "success", _l)}
`,
  $t = class extends G {
    constructor() {
      super(...arguments);
      this.loadState = "loading";
      this.isRecommended = !1;
      this.installPhase = rr.kIdle;
      this.didLoadExtensionData = (t) => {
        let n = t.detail;
        if (this.extension.extensionId === n.extensionId) {
          if (n.data.error) {
            n.data.error === Fl.kUnavailable && (this.loadState = "disable");
            return;
          }
          if (
            (n.data.localInfo &&
              ((this.extension = { ...this.extension, localInfo: n.data.localInfo }), (this.installPhase = rr.kIdle)),
            n.data.remoteInfo)
          )
            this.extension = { ...this.extension, remoteInfo: n.data.remoteInfo };
          else {
            let a = rn(this.extension.extensionId);
            a && (this.extension = { ...this.extension, remoteInfo: a });
          }
        }
      };
      this.extensionRemoved = (t) => {
        let { extensionId: n } = t.detail;
        n === this.extension.extensionId && (this.extension = { ...this.extension, localInfo: null });
      };
      this.extensionStateUpdated = (t) => {
        let n = t.detail;
        n.progress?.extensionId === this.extension.extensionId &&
          (n.progress.installPhase === rr.kSuccess
            ? _.loadExtensionData(this.extension.extensionId)
            : (this.installPhase = n.progress.installPhase));
      };
    }
    connectedCallback() {
      super.connectedCallback(),
        document.addEventListener(Ft, this.extensionRemoved),
        document.addEventListener(ot, this.extensionStateUpdated),
        document.addEventListener(tt, this.didLoadExtensionData),
        _.getExtensionInstallPhase(this.extension.extensionId).then((t) => {
          this.installPhase = t;
        }),
        this.hasRequiredDisplayData() && (this.loadState = "success"),
        _.loadExtensionData(this.extension.extensionId);
    }
    disconnectedCallback() {
      super.disconnectedCallback(),
        document.removeEventListener(Ft, this.extensionRemoved),
        document.removeEventListener(ot, this.extensionStateUpdated),
        document.removeEventListener(tt, this.didLoadExtensionData),
        (this.loadState = "loading"),
        qs();
    }
    hasRequiredDisplayData() {
      return this.extension.remoteInfo?.lastUpdateDate;
    }
    extensionChanged(t, n) {
      this.hasRequiredDisplayData() ? (this.loadState = "success") : (this.loadState = "loading");
    }
    loadStateChanged(t, n) {
      this.loadState === "success" && _.onNavigateToDetailPage(this.getName());
    }
    getButtonClass() {
      return this.isInstalling() ? "button installing" : "button";
    }
    getButtonAppearance() {
      return !this.isInstalling() && this.extension.localInfo ? "outline" : "primary";
    }
    getButtonState() {
      return this.isInstalling()
        ? bt.getString("action_installing_button")
        : this.extension.localInfo
          ? bt.getString("action_remove")
          : bt.getString("action_get_button");
    }
    isInstalling() {
      return this.installPhase === rr.kInstalling || this.installPhase === rr.kChecking;
    }
    handleExtensionAction() {
      this.extension &&
        (this.extension.localInfo
          ? tn(this.extension, Ai.kDetail)
          : (Gr && _.recordSearchAction(Ol.kClickGetButtonOnDetailPage), on(this.extension, Ai.kDetail)));
    }
    handlePrivacyPolicyClick() {
      this.extension && this.extension?.remoteInfo?.privacyUrl && _.openUrl(this.extension.remoteInfo.privacyUrl);
    }
    handleReportAbuse() {
      this.extension && Si(this.extension.extensionId);
    }
    handleAuthorClick() {
      this.extension &&
        this.extension?.remoteInfo?.publisherWebsiteUri &&
        _.openUrl(this.extension.remoteInfo.publisherWebsiteUri);
    }
    getName() {
      return this.extension.localInfo ? this.extension.localInfo.name : this.extension.remoteInfo?.name || "";
    }
    formatDate(t) {
      if (!t || !t.internalValue) return "";
      let n = 116444736e5,
        a = BigInt(t.internalValue),
        u = Number(a / 1000n) - n;
      return new Date(u).toLocaleDateString();
    }
  };
w([P], $t.prototype, "loadState", 2),
  w([P], $t.prototype, "extension", 2),
  w([P], $t.prototype, "isRecommended", 2),
  w([P], $t.prototype, "installPhase", 2),
  ($t = w([q({ name: "extension-detail", template: jl, styles: Al })], $t));
import { loadTimeData as qn } from "edge://resources/js/load_time_data.js";
var Gl = y`
  <div class="error-container">
    <div class="error-icon">!</div>
    <h2 class="error-title">${qn.getString("generic_error")}</h2>
    <p class="error-message">${qn.getString("retry_prompt")}</p>
    <button class="refresh-button" @click=${(o) => o.handleRefresh()}>
      <span class="refresh-icon">â†»</span>
      ${qn.getString("refresh_button")}
    </button>
  </div>
`,
  Vl = R`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--colorBackgroundApp);
  }

  .error-container {
    text-align: center;
    padding: ${et};
  }

  .error-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${xo};
    color: ${Ut};
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    margin: ${ie} auto ${F};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-title {
    font-size: ${Ht};
    color: ${se};
    margin: ${ie} ${ie} ${X};
    font-weight: ${bo};
  }

  .error-message {
    font-size: ${je};
    color: ${Kt};
    margin: ${ie} ${ie} ${et};
  }

  .refresh-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${X} ${et};
    background-color: ${Ir};
    color: ${Ut};
    border: none;
    border-radius: ${X};
    font-size: ${je};
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .refresh-icon {
    margin-right: ${X};
    font-size: ${F};
  }
`,
  ln = class extends G {
    constructor() {
      super(...arguments);
      this.throttledRefresh = Yr(() => {
        document.dispatchEvent(new CustomEvent("refresh-extensions"));
      }, 500);
    }
    handleRefresh() {
      this.throttledRefresh();
    }
  };
ln = w([q({ name: "error-page", template: Gl, styles: Vl })], ln);
import { loadTimeData as oo } from "edge://resources/js/load_time_data.js";
import {
  ExtensionSearchAction as Po,
  ExtensionSearchErrorType as dn,
} from "../../edge_mobile_extension.mojom-webui.js";
var Xl = y`
<div class="error-container">
  <div class="error-title">
    ${oo.getString("no_search_result")} "${(o) => o.query}"
  </div>
  <div class="error-hint">
    ${oo.getString("no_search_result_hint")}
  </div>
</div>
`,
  Kl = y`
<div class="error-container">
  <div class="error-title">
    ${oo.getString("no_network_search")}
  </div>
  <div class="error-hint">
    ${oo.getString("no_network_search_hint")}
  </div>
  <div class="error-button"
       tabindex="0"
       role="button"
       aria-label="${oo.getString("refresh_button")}"
       @click=${(o, e) => o.onRefreshClick(e.event)}
       @keyup=${(o, e) => o.onRefreshKeyUp(e.event)}>
    ${Fi}
    ${oo.getString("refresh_button")}
  </div>
</div>
`,
  Ul = y`
${it(
  (o) => o.resultList || [],
  y`<remote-extension-card
          :extensionId=${(o) => o.extensionId}
          :extension=${(o) => o}
          :isInstalled=${(o, e) => e.parent.installedExtensionIds.includes(o.extensionId)}
          :isRecommended=${(o, e) => e.parent.recommendedExtensionIds.includes(o.extensionId)}>
        </remote-extension-card>`
)}
`,
  ql = y`
${j((o) => o.error === dn.kNoNetwork, Kl)}
${j((o) => o.error === dn.kNoResult, Xl)}
${j((o) => o.error === void 0, Ul)}
`,
  Yl = y`
<div class="search-bar-container">
  <div class="search-bar"
    tabindex="0"
    @click=${(o, e) => o.onSearchClick(e.event)}
    @keyup=${(o, e) => o.onSearchKeyUp(e.event)}>
    <div class="search-icon ${(o) => (o.isSearching ? "back" : "search")}"
        @click=${(o, e) => o.onBackClick(e.event)}
        @keyup=${(o, e) => o.onBackKeyUp(e.event)}
        tabindex="0"
        aria-hidden="${(o) => (o.isSearching ? "false" : "true")}">${(o) => (o.isSearching ? Di : Pi)}</div>
    <input ${we("input")} class="search-input-text"
        id="input" type="text"
        maxlength="50"
        @input=${(o, e) => o.onSearchInput(e.event)}
        placeholder="${oo.getString("search_hint")}"/>
    <div class="search-clear-icon ${(o) => (o.isSearching ? "visible" : "hidden")}"
        @click=${(o, e) => o.onClearClick(e.event)}
        @keyup=${(o, e) => o.onClearKeyUp(e.event)}
        tabindex="0">${Ni}</div>
  </div>
</div>
<div class="search-result-container ${(o) => (o.isSearching ? "visible" : "hidden")}">
${j((o) => o.query !== "", ql)}
<div class="scroll-sentinel"/>
</div>
`,
  Ql = R`
  .search-bar-container {
    padding-top: 16px;
    padding-bottom: 8px;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: var(--colorBackgroundApp);
  }

  .search-bar {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 38px;
    background: ${Ds};
    border: 0.5px solid ${Dt};
    border-radius: 9999px;
    color: ${Kt};
  }

  .search-bar > * {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .search-icon {
    padding-right: ${Be};
    padding-left: ${Be};
    flex-shrink: 0;
  }

  .search-icon.search {
    color: ${We};
  }

  .search-icon.back {
    color: ${se};
  }

  .search-input-text {
    flex: 1;
    min-width: 0;
    width: 100%;
    font-size: ${ge};
    border: none;
    background: none;
    outline: none;
    justify-content: flex-start;
    color: ${se};
    caret-color: ${ct};
  }

  .search-clear-icon {
    padding-right: ${Be};
    padding-left: ${Be};
    color: ${Kt};
    flex-shrink: 0;
  }

  .search-clear-icon.hidden {
    display: none;
  }

  .search-clear-icon.visible {
    display: flex;
  }
`,
  Zl = R`
  .search-result-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: var(--colorBackgroundApp);
    z-index: 999;
    overflow-y: auto;
    padding: 64px 16px 32px 16px;
    box-sizing: border-box;
    overscroll-behavior-x: none;
  }

  .search-result-container::-webkit-scrollbar {
    display: none;
  }

  .search-result-container.hidden {
    display: none;
  }

  .search-result-container.visible {
    display: block;
  }

  .scroll-sentinel {
    height: 1px;
    background: transparent;
  }
`,
  Jl = R`
  .error-container {
    height: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: ${X};
    padding: 0 ${F};
  }

  .error-title {
    font-weight: ${He};
    font-size: ${Ht};
    color: ${se};
    overflow-wrap: break-word;
    letter-spacing: -0.45px;
    line-height: 25px;
    max-width: calc(100vw - 48px);
  }

  .error-hint {
    font-size: ${_e};
    font-weight: ${fe};
    color: ${We};
    line-height: ${Xs};
    letter-spacing: -0.23px;
    overflow-wrap: break-word;
  }

  .error-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    width: 130px;
    height: 52px;
    background: ${Ir};
    border-radius: 12px;
    cursor: pointer;
    font-weight: ${He};
    font-size: ${_e};
    line-height: ${$r};
    letter-spacing: -0.43px;
    color: ${Ut};
    user-select: none;
    margin-top: ${X};
  }
`,
  ed = R`
${Ql}
${Zl}
${Jl}
`,
  Ke = class extends G {
    constructor() {
      super();
      this.isSearching = !1;
      this.query = "";
      this.resultList = [];
      this.installedExtensionIds = [];
      this.recommendedExtensionIds = [];
      this.hasRecordedTyping = !1;
      this.debouncedSearch = vi((t) => {
        this.performSearch(t, 1);
      }, 300);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this.cleanupObservers();
    }
    performSearch(t, n) {
      if (!t.trim() || !n) return;
      let a = this.generateUniqueRequestId();
      (this.currentSearchId = a),
        _.recordSearchAction(Po.kTriggerSearch),
        _.searchExtensions(t, n).then((d) => {
          this.currentSearchId === a &&
            ((this.query = t),
            (this.error = d.error),
            d.success?.extensionList && (this.resultList = [...this.resultList, ...d.success.extensionList]),
            (this.hasMorePages = d.success?.hasMorePages),
            (this.nextPage = d.success?.nextPage),
            d.error === dn.kNoNetwork
              ? _.recordSearchAction(Po.kResultPageWithNetworkError)
              : d.error === dn.kNoResult
                ? _.recordSearchAction(Po.kResultPageWithNoResult)
                : d.success?.extensionList &&
                  d.success.extensionList.length > 0 &&
                  n === 1 &&
                  _.recordSearchAction(Po.kResultPageWithExtensions));
        });
    }
    hasMorePagesChanged(t, n) {
      this.hasMorePages ? this.setupScrollSentinelObserver() : this.cleanupObservers();
    }
    onSearchClick(t) {
      this.isSearching || (_.recordSearchAction(Po.kClickSearchEntry), (this.isSearching = !0)), t.stopPropagation();
    }
    onClearClick(t) {
      (this.input.value = ""), (this.query = ""), this.cleanupSearchResult(), t.stopPropagation();
    }
    onBackClick(t) {
      (this.isSearching = !1),
        (this.input.value = ""),
        (this.query = ""),
        this.cleanupSearchResult(),
        this.cleanupObservers(),
        t.stopPropagation();
    }
    onSearchInput(t) {
      this.input.value.trim().length === 0
        ? ((this.query = ""), this.cleanupSearchResult())
        : (this.hasRecordedTyping || (_.recordSearchAction(Po.kTypeInSearchBar), (this.hasRecordedTyping = !0)),
          this.cleanupSearchResult(),
          this.debouncedSearch(this.input.value.trim()));
    }
    onSearchKeyUp(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.input.blur(), this.onSearchClick(t));
    }
    onBackKeyUp(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.onBackClick(t));
    }
    onClearKeyUp(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.onClearClick(t));
    }
    setupScrollSentinelObserver() {
      this.cleanupObservers();
      let t = this.shadowRoot?.querySelector(".scroll-sentinel");
      t &&
        ((this.scrollSentinelObserver = new IntersectionObserver(
          (n) => {
            n[0].isIntersecting && this.performSearch(this.query, this.nextPage);
          },
          { root: this.shadowRoot?.querySelector(".search-result-container") || null, rootMargin: "600px" }
        )),
        this.scrollSentinelObserver.observe(t));
    }
    cleanupObservers() {
      this.scrollSentinelObserver && (this.scrollSentinelObserver.disconnect(), (this.scrollSentinelObserver = void 0));
    }
    onRefreshClick(t) {
      this.performRefresh(), t.stopPropagation();
    }
    onRefreshKeyUp(t) {
      t instanceof KeyboardEvent && t.key === ne && (this.performRefresh(), t.stopPropagation());
    }
    performRefresh() {
      this.query.trim() && (this.cleanupSearchResult(), this.performSearch(this.query, 1));
    }
    cleanupSearchResult() {
      (this.currentSearchId = void 0),
        (this.resultList = []),
        (this.hasMorePages = !1),
        (this.nextPage = -1),
        (this.error = void 0);
    }
    generateUniqueRequestId() {
      return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
  };
w([P], Ke.prototype, "isSearching", 2),
  w([P], Ke.prototype, "query", 2),
  w([P], Ke.prototype, "resultList", 2),
  w([P], Ke.prototype, "hasMorePages", 2),
  w([P], Ke.prototype, "nextPage", 2),
  w([P], Ke.prototype, "error", 2),
  w([P], Ke.prototype, "installedExtensionIds", 2),
  w([P], Ke.prototype, "recommendedExtensionIds", 2),
  (Ke = w([q({ name: "search-section", template: Yl, styles: ed })], Ke));
import { loadTimeData as Ri } from "edge://resources/js/load_time_data.js";
td("mobile_extension");
var nd = R`
:host {
  display: block;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
}

:host::-webkit-scrollbar {
  display: none;
}

.extension-container {
  max-width: 100%;
  box-sizing: border-box;
}

.extension-list {
  left: 0 !important;
  padding-left: max(env(safe-area-inset-left), ${F});
  padding-right: max(env(safe-area-inset-right), ${F});
  padding-bottom: env(safe-area-inset-bottom);
}

.extension-detail {
  left: 100% !important;
  padding-bottom: env(safe-area-inset-bottom);
}

.page {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overscroll-behavior: contain;
  background-color: var(--colorBackgroundApp);
  box-sizing: border-box;
}

.page::-webkit-scrollbar {
  display: none;
}

.page.smooth-slide-in {
  left: 0 !important;
  opacity: 1!important;
  z-index: 2 !important;
}

.page.smooth-slide-out {
  left: -15% !important;
  opacity: 0.8!important;
  z-index: 1 !important;
}

.page.fade-transition {
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out;
  will-change: left, opacity;
}

.search-more-hint {
  width: 100%;
  background-color: ${Hs};
  border-radius: ${Wr};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${F};
  padding: 16px;
  box-sizing: border-box;
  margin-top: -8px;
  margin-bottom: ${F};
}

.search-more-title {
  font-size: ${_e};
  font-weight: ${fe};
  color: ${se};
  flex:1
}

.search-more-action {
  font-weight: ${fe};
  font-size: ${je};
  color: ${ct};
  flex: 1;
  user-select: none;
}


@media (orientation: portrait) {
  :host {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

@media (orientation: landscape) {
  :host {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
  .extension-container {
    max-width: 100%;
    margin: 0 auto;
  }
}
`,
  ad = y`
<installed-section
  :extensionIds=${(o) => o.installedExtensionIds}
  :isDeveloperEnabled=${(o) => o.isDeveloperEnabled}>
</installed-section>
`,
  sd = y`
<recommended-section
  :extensionIds=${(o) => o.recommendedExtensionIds.filter((e) => !o.installedExtensionIds.includes(e))}>
</recommended-section>
`,
  id = y`
<div class="search-more-hint">
  <div class="search-more-title">
    ${Ri.getString("search_more_title")}
  </div>
  <div class="search-more-action"
    @keyup=${(o, e) => o.onKeyUpSearchMoreHint(e.event)}
    @click=${(o, e) => o.focusSearchInput(e.event)}>
    ${Ri.getString("search_more_hint")}
  </div>
</div>
`,
  cd = y`
<extension-detail
  :extension=${(o) => o.extensionForDetail}
  :isRecommended=${(o) => (o.extensionForDetail ? o.recommendedExtensionIds.includes(o.extensionForDetail.extensionId) : !1)}></extension-detail>
`,
  ld = y`<loading-page></loading-page>`,
  dd = y`<error-page></error-page>`,
  ud = y`<disable-page></disable-page>`,
  pd = y`
<div ${we("extensionList")} class="extension-container page extension-list ${(o) => (o.currentPage === pt.kDetail ? "smooth-slide-out" : "")}" @scroll=${(o) => o.onExtensionListScroll()}>
  ${j(
    (o) => o.isSearchEnabled && o.hubDataLoaded,
    y`
    <search-section ${we("searchSection")}
      :installedExtensionIds="${(o) => o.installedExtensionIds}"
      :recommendedExtensionIds="${(o) => o.recommendedExtensionIds}">
    </search-section>`
  )}
  ${j((o) => o.currentPage === pt.kHub && !o.hubDataLoaded, y`<loading-page></loading-page>`)}
  ${j((o) => (o.hubDataLoaded && o.installedExtensionIds.length > 0) || o.isDeveloperEnabled, ad)}
  ${j((o) => o.hubDataLoaded && o.recommendedExtensionIds.length > 0, sd)}
  ${j((o) => o.isSearchEnabled && o.hubDataLoaded, id)}
</div>
<div ${we("extensionDetail")} class="page extension-detail ${(o) => (o.currentPage === pt.kDetail ? "smooth-slide-in" : "")}">
  ${j((o) => o.extensionForDetail !== null, cd)}
</div>
`,
  hd = y`
${j((o) => o.loadState === "loading", ld)}
${j((o) => o.loadState === "error", dd)}
${j((o) => o.loadState === "disable", ud)}
${j((o) => o.loadState === "success", pd)}
`,
  Ue = class extends G {
    constructor() {
      super();
      this.loadState = "loading";
      this.installedExtensionIds = [];
      this.recommendedExtensionIds = [];
      this.extensionForDetail = null;
      this.isDeveloperEnabled = !1;
      this.currentPage = pt.kHub;
      this.hubDataLoaded = !1;
      this.isSearchEnabled = !1;
      this.backPressed = () => {
        this.currentPage === pt.kDetail && this.backToHome();
      };
      this.developerStateChanged = (t) => {
        let n = t.detail;
        this.isDeveloperEnabled = n.isEnable;
      };
      this.refreshExtensions = () => {
        (this.loadState = "loading"),
          (this.hubDataLoaded = !1),
          setTimeout(() => {
            this.loadAllExtensions();
          }, 100);
      };
      this.onResize = () => {
        this.dispatchContextMenuDismissEventThrottled();
      };
      this.onPopState = () => {
        let n = new URLSearchParams(window.location.search).get("id");
        if (n?.length) {
          let a = { extensionId: n, localInfo: null, remoteInfo: null };
          this.pushToDetail(a);
        } else this.backToHome();
      };
      this.onExtensionListScroll = () => {
        this.dispatchContextMenuDismissEventThrottled();
      };
      this.dispatchContextMenuDismissEvent = () => {
        document.dispatchEvent(new Event(Yo));
      };
      this.showDetail = (t) => {
        let n = t.detail;
        if (n) {
          let a = new URL(window.location.href);
          a.searchParams.set("id", n.extensionId),
            window.history.pushState(null, "", a.toString()),
            this.pushToDetail(n);
        }
      };
      this.pushToDetail = (t) => {
        this.setCurrentPage(pt.kDetail),
          (this.extensionForDetail = t),
          this.extensionList &&
            this.extensionDetail &&
            (this.extensionList.classList.add("fade-transition"),
            this.extensionDetail.classList.add("fade-transition"),
            this.extensionList.classList.add("smooth-slide-out"),
            this.extensionDetail.classList.add("smooth-slide-in"));
      };
      this.backToHome = () => {
        if (!this.extensionList || !this.extensionDetail) {
          (this.extensionForDetail = null), this.setCurrentPage(pt.kHub);
          return;
        }
        this.extensionList.classList.remove("smooth-slide-out"),
          this.extensionDetail.classList.remove("smooth-slide-in"),
          this.extensionList.classList.remove("smooth-slide-out"),
          this.extensionDetail.classList.remove("smooth-slide-in");
        let t = () => {
          (this.extensionForDetail = null),
            this.extensionList &&
              this.extensionDetail &&
              (this.extensionList.classList.remove("fade-transition"),
              this.extensionDetail.classList.remove("fade-transition")),
            this.extensionDetail && this.extensionDetail.removeEventListener("transitionend", t),
            this.setCurrentPage(pt.kHub);
        };
        this.extensionDetail.addEventListener("transitionend", t);
      };
      this.extensionRemoved = (t) => {
        let { extensionId: n } = t.detail;
        this.installedExtensionIds = this.installedExtensionIds.filter((a) => a !== n);
      };
      this.webExtensionStateUpdated = (t) => {
        let n = t.detail;
        if (!n.error && n.progress?.installPhase === rd.kSuccess) {
          let a = n.progress.extensionId;
          if (this.installedExtensionIds.includes(a)) return;
          this.installedExtensionIds = [...this.installedExtensionIds, a];
        }
      };
      (this.dispatchContextMenuDismissEventThrottled = Yr(this.dispatchContextMenuDismissEvent, 250)),
        document.addEventListener("dblclick", (t) => {
          t.preventDefault();
        }),
        document.addEventListener("gesturestart", function (t) {
          t.preventDefault();
        });
    }
    connectedCallback() {
      super.connectedCallback(),
        this.initializeBasedOnCurrentPage(),
        this.addExtensionEventListener(),
        window.addEventListener("resize", this.onResize),
        window.addEventListener("popstate", this.onPopState);
    }
    disconnectedCallback() {
      super.disconnectedCallback(),
        this.removeExtensionEventListener(),
        window.removeEventListener("resize", this.onResize),
        window.removeEventListener("popstate", this.onPopState);
    }
    initializeBasedOnCurrentPage() {
      let n = new URLSearchParams(location.search).get("id");
      n?.length
        ? (this.setCurrentPage(pt.kDetail),
          (this.extensionForDetail = { extensionId: n, localInfo: null, remoteInfo: null }))
        : this.setCurrentPage(pt.kHub),
        this.loadAllExtensions(),
        _.isExtensionSearchSupported().then((a) => {
          this.isSearchEnabled = a;
        });
    }
    addExtensionEventListener() {
      document.addEventListener(jr, this.backToHome),
        document.addEventListener(Yt, this.showDetail),
        document.addEventListener(Ft, this.extensionRemoved),
        document.addEventListener(ot, this.webExtensionStateUpdated),
        document.addEventListener(Mn, this.refreshExtensions),
        document.addEventListener(qo, this.backPressed),
        document.addEventListener(Qo, this.developerStateChanged);
    }
    removeExtensionEventListener() {
      document.removeEventListener(jr, this.backToHome),
        document.removeEventListener(Yt, this.showDetail),
        document.removeEventListener(Ft, this.extensionRemoved),
        document.removeEventListener(ot, this.webExtensionStateUpdated),
        document.removeEventListener(Mn, this.refreshExtensions),
        document.removeEventListener(qo, this.backPressed),
        document.removeEventListener(Qo, this.developerStateChanged);
    }
    loadAllExtensions() {
      _.getExtensionIds().then((t) => {
        if (t.error !== void 0) {
          t.error === od.kUnavailable ? (this.loadState = "disable") : (this.loadState = "error");
          return;
        }
        (this.installedExtensionIds = t.ids?.installedIds || []),
          (this.recommendedExtensionIds = t.ids?.recommendIds || []),
          (this.loadState = "success"),
          (this.hubDataLoaded = !0);
      });
    }
    setCurrentPage(t) {
      (this.currentPage = t), _.onPageTypeChanged(t);
    }
    focusSearchInput(t) {
      this.searchSection && (this.searchSection.onSearchClick(t), this.searchSection.input?.focus());
    }
    onKeyUpSearchMoreHint(t) {
      t instanceof KeyboardEvent && t.key === ne && (t.stopPropagation(), this.focusSearchInput(t));
    }
  };
w([P], Ue.prototype, "loadState", 2),
  w([P], Ue.prototype, "installedExtensionIds", 2),
  w([P], Ue.prototype, "recommendedExtensionIds", 2),
  w([P], Ue.prototype, "extensionForDetail", 2),
  w([P], Ue.prototype, "isDeveloperEnabled", 2),
  w([P], Ue.prototype, "currentPage", 2),
  w([P], Ue.prototype, "hubDataLoaded", 2),
  w([P], Ue.prototype, "isSearchEnabled", 2),
  (Ue = w([q({ name: "mobile-extensions", template: hd, styles: nd })], Ue));
export { Ue as Extensions };
/*! Bundled license information:

@esm-bundle/chai/esm/chai.js:
  (*!
   * chai
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai version
   *)
  (*!
   * Utils for plugins (not exported)
   *)
  (*!
   * Configuration
   *)
  (*!
   * Primary `Assertion` prototype
   *)
  (*!
   * Core Assertions
   *)
  (*!
   * Expect interface
   *)
  (*!
   * Should interface
   *)
  (*!
   * Assert interface
   *)
  (*!
   * chai
   * http://chaijs.com
   * Copyright(c) 2011-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
     * Module dependencies.
     *)
  (*!
     * Module export.
     *)
  (*!
     * Assertion Constructor
     *
     * Creates object for chaining.
     *
     * `Assertion` objects contain metadata in the form of flags. Three flags can
     * be assigned during instantiation by passing arguments to this constructor:
     *
     * - `object`: This flag contains the target of the assertion. For example, in
     *   the assertion `expect(numKittens).to.equal(7);`, the `object` flag will
     *   contain `numKittens` so that the `equal` assertion can reference it when
     *   needed.
     *
     * - `message`: This flag contains an optional custom error message to be
     *   prepended to the error message that's generated by the assertion when it
     *   fails.
     *
     * - `ssfi`: This flag stands for "start stack function indicator". It
     *   contains a function reference that serves as the starting point for
     *   removing frames from the stack trace of the error that's created by the
     *   assertion when it fails. The goal is to provide a cleaner stack trace to
     *   end users by removing Chai's internal functions. Note that it only works
     *   in environments that support `Error.captureStackTrace`, and only when
     *   `Chai.config.includeStack` hasn't been set to `false`.
     *
     * - `lockSsfi`: This flag controls whether or not the given `ssfi` flag
     *   should retain its current value, even as assertions are chained off of
     *   this object. This is usually set to `true` when creating a new assertion
     *   from within another assertion. It's also temporarily set to `true` before
     *   an overwritten assertion gets called by the overwriting assertion.
     *
     * @param {Mixed} obj target of the assertion
     * @param {String} msg (optional) custom error message
     * @param {Function} ssfi (optional) starting point for removing stack frames
     * @param {Boolean} lockSsfi (optional) whether or not the ssfi flag is locked
     * @api private
     *)
  (*!
     * Chai dependencies.
     *)
  (*!
   * Chai - addChainingMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Module dependencies
   *)
  (*!
   * Chai - addLengthGuard utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - addMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - addProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - compareByInspect utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - expectTypes utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - flag utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getActual utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getEnumerableProperties utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - message composition utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getOwnEnumerableProperties utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getOwnEnumerablePropertySymbols utility
   * Copyright(c) 2011-2016 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - getProperties utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * chai
   * Copyright(c) 2011 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Dependencies that are used for multiple exports are required here only once
   *)
  (*!
   * test utility
   *)
  (*!
   * Chai - isNaN utility
   * Copyright(c) 2012-2015 Sakthipriyan Vairamani <thechargingvolcano@gmail.com>
   * MIT Licensed
   *)
  (*!
   * Chai - isProxyEnabled helper
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - overwriteChainableMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - overwriteMethod utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - overwriteProperty utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - test utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Chai - transferFlags utility
   * Copyright(c) 2012-2014 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * assertion-error
   * Copyright(c) 2013 Jake Luer <jake@qualiancy.com>
   * MIT Licensed
   *)
  (*!
   * Return a function that will copy properties from
   * one object to another excluding any originally
   * listed. Returned function will create a new `{}`.
   *
   * @param {String} excluded properties ...
   * @return {Function}
   *)
  (*!
   * Primary Exports
   *)
  (*!
   * Inherit from Error.prototype
   *)
  (*!
   * deep-eql
   * Copyright(c) 2013 Jake Luer <jake@alogicalparadox.com>
   * MIT Licensed
   *)
  (*!
   * Check to see if the MemoizeMap has recorded a result of the two operands
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {MemoizeMap} memoizeMap
   * @returns {Boolean|null} result
  *)
  (*!
   * Set the result of the equality into the MemoizeMap
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {MemoizeMap} memoizeMap
   * @param {Boolean} result
  *)
  (*!
   * Primary Export
   *)
  (*!
   * The main logic of the `deepEqual` function.
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Object} [options] (optional) Additional options
   * @param {Array} [options.comparator] (optional) Override default algorithm, determining custom equality.
   * @param {Array} [options.memoize] (optional) Provide a custom memoization object which will cache the results of
      complex objects for a speed boost. By passing `false` you can disable memoization, but this will cause circular
      references to blow the stack.
   * @return {Boolean} equal match
  *)
  (*!
   * Compare two Regular Expressions for equality.
   *
   * @param {RegExp} leftHandOperand
   * @param {RegExp} rightHandOperand
   * @return {Boolean} result
   *)
  (*!
   * Compare two Sets/Maps for equality. Faster than other equality functions.
   *
   * @param {Set} leftHandOperand
   * @param {Set} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Simple equality for flat iterable objects such as Arrays, TypedArrays or Node.js buffers.
   *
   * @param {Iterable} leftHandOperand
   * @param {Iterable} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Simple equality for generator objects such as those returned by generator functions.
   *
   * @param {Iterable} leftHandOperand
   * @param {Iterable} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Determine if the given object has an @@iterator function.
   *
   * @param {Object} target
   * @return {Boolean} `true` if the object has an @@iterator function.
   *)
  (*!
   * Gets all iterator entries from the given Object. If the Object has no @@iterator function, returns an empty array.
   * This will consume the iterator - which could have side effects depending on the @@iterator implementation.
   *
   * @param {Object} target
   * @returns {Array} an array of entries from the @@iterator function
   *)
  (*!
   * Gets all entries from a Generator. This will consume the generator - which could have side effects.
   *
   * @param {Generator} target
   * @returns {Array} an array of entries from the Generator.
   *)
  (*!
   * Gets all own and inherited enumerable keys from a target.
   *
   * @param {Object} target
   * @returns {Array} an array of own and inherited enumerable keys from the target.
   *)
  (*!
   * Determines if two objects have matching values, given a set of keys. Defers to deepEqual for the equality check of
   * each key. If any value of the given key is not equal, the function will return false (early).
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Array} keys An array of keys to compare the values of leftHandOperand and rightHandOperand against
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Recursively check the equality of two Objects. Once basic sameness has been established it will defer to `deepEqual`
   * for each enumerable key in the object.
   *
   * @param {Mixed} leftHandOperand
   * @param {Mixed} rightHandOperand
   * @param {Object} [options] (Optional)
   * @return {Boolean} result
   *)
  (*!
   * Returns true if the argument is a primitive.
   *
   * This intentionally returns true for all objects that can be compared by reference,
   * including functions and symbols.
   *
   * @param {Mixed} value
   * @return {Boolean} result
   *)
*/
