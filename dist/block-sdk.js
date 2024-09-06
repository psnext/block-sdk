var h = Object.defineProperty;
var D = (t, e, a) => e in t ? h(t, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : t[e] = a;
var l = (t, e, a) => D(t, typeof e != "symbol" ? e + "" : e, a);
var s = [];
for (var b = 0; b < 256; ++b)
  s.push((b + 256).toString(16).slice(1));
function v(t, e = 0) {
  return (s[t[e + 0]] + s[t[e + 1]] + s[t[e + 2]] + s[t[e + 3]] + "-" + s[t[e + 4]] + s[t[e + 5]] + "-" + s[t[e + 6]] + s[t[e + 7]] + "-" + s[t[e + 8]] + s[t[e + 9]] + "-" + s[t[e + 10]] + s[t[e + 11]] + s[t[e + 12]] + s[t[e + 13]] + s[t[e + 14]] + s[t[e + 15]]).toLowerCase();
}
var i, I = new Uint8Array(16);
function y() {
  if (!i && (i = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !i))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return i(I);
}
var A = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const k = {
  randomUUID: A
};
function C(t, e, a) {
  if (k.randomUUID && !e && !t)
    return k.randomUUID();
  t = t || {};
  var n = t.random || (t.rng || y)();
  return n[6] = n[6] & 15 | 64, n[8] = n[8] & 63 | 128, v(n);
}
const o = {
  OUTPUT: "output-event",
  INCOME: "input-event",
  CONTROLLER: "controller-event",
  HOST_DATA: "host-data-event",
  ALX: "alx-event"
}, T = {
  BLOCK_ID: "block-id"
}, U = "ALX", g = {
  UPDATE_MESSAGE: "UPDATE_MESSAGE",
  DISPLAY_MESSAGE: "DISPLAY_MESSAGE"
}, m = {
  RESIZE: "resize",
  READY: "ready"
};
function w(t, e) {
  const a = new ResizeObserver(() => {
    if (t) {
      const { width: n, height: c } = t.getBoundingClientRect();
      e.sendControllerMessage(
        {
          data: {
            width: n,
            height: c
          }
        },
        m.RESIZE
      );
    }
  });
  t && a.observe(t);
}
function R() {
  return window.self !== window.top;
}
function L(t) {
  const e = C(), a = Date.now();
  window.parent.postMessage(
    {
      senderBlockId: t.senderBlockId,
      type: t.type,
      namespace: t.namespace || "",
      eventData: {
        version: 2,
        eventId: e,
        timestamp: a,
        playId: "",
        source: {
          blockId: t.senderBlockId,
          blockName: t.blockName,
          ...t.source
        },
        payload: {
          ...t.payload,
          lastUpdatedTimestamp: a
        },
        ...t.eventData
      }
    },
    "*"
  );
}
const O = (t) => new URLSearchParams(window.location.search).get(t), d = {
  isInIframe: R,
  sendMessageToHost: L,
  getUrlParams: O,
  domResizeObserver: w
}, r = class r {
  constructor(e, a) {
    l(this, "blockName");
    l(this, "blockEventCallbacks");
    l(this, "blockId", "");
    l(this, "hostData", {});
    this.blockName = e, this.blockEventCallbacks = a, this._setupDefaultParams(), this._setupWindowEvents();
  }
  _setupDefaultParams() {
    const e = d.getUrlParams(T.BLOCK_ID);
    if (!e)
      throw new Error("Not a valid block iframe");
    e && (this.blockId = e);
  }
  _onPostMessageReceived(e) {
    var a, n, c, u, E;
    ((a = e.data) == null ? void 0 : a.receivingBlockId) === this.blockId && (((n = e.data) == null ? void 0 : n.type) === o.INCOME ? this.blockEventCallbacks.onIncomingData && this.blockEventCallbacks.onIncomingData(
      e.data,
      e.data.eventData
    ) : ((c = e.data) == null ? void 0 : c.type) === o.CONTROLLER ? this.blockEventCallbacks.onControllerData && this.blockEventCallbacks.onControllerData(
      e.data,
      e.data.eventData
    ) : ((u = e.data) == null ? void 0 : u.type) === o.ALX ? this.blockEventCallbacks.onAlxData && this.blockEventCallbacks.onAlxData(e.data, e.data.eventData) : ((E = e.data) == null ? void 0 : E.type) === o.HOST_DATA && (this.hostData = {
      ...this.hostData,
      ...e.data.eventData.payload
    }, this.blockEventCallbacks.onHostDataUpdate && this.blockEventCallbacks.onHostDataUpdate(e.data, this.hostData)));
  }
  _setupWindowEvents() {
    window.addEventListener("message", this._onPostMessageReceived.bind(this));
  }
  static register(e, a) {
    const n = new r(e, a);
    return n.sendControllerMessage(null, m.READY), n;
  }
  sendOutput(e, a) {
    d.sendMessageToHost({
      senderBlockId: this.blockId,
      type: o.OUTPUT,
      namespace: `${this.blockId}-${e}`,
      blockName: this.blockName,
      source: {
        handleId: e
      },
      payload: {
        data: a
      }
    });
  }
  sendAlxMessage(e, a = g.DISPLAY_MESSAGE) {
    d.sendMessageToHost({
      senderBlockId: this.blockId,
      type: o.ALX,
      namespace: U,
      blockName: this.blockName,
      payload: {
        data: e
      },
      eventData: {
        alxEventType: a
      }
    });
  }
  resizeObserver(e) {
    d.domResizeObserver(e, this);
  }
  sendControllerMessage(e, a) {
    d.sendMessageToHost({
      senderBlockId: this.blockId,
      type: o.CONTROLLER,
      blockName: this.blockName,
      payload: {
        ...e
      },
      eventData: {
        controllerType: a
      }
    });
  }
};
l(r, "Utils", {
  ...d
});
let p = r;
(function(t) {
  t.BlockSdk = p;
})(window);
//# sourceMappingURL=block-sdk.js.map
