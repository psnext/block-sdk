var h = Object.defineProperty;
var E = (e, t, a) => t in e ? h(e, t, { enumerable: !0, configurable: !0, writable: !0, value: a }) : e[t] = a;
var d = (e, t, a) => E(e, typeof t != "symbol" ? t + "" : t, a);
var s = [];
for (var b = 0; b < 256; ++b)
  s.push((b + 256).toString(16).slice(1));
function v(e, t = 0) {
  return (s[e[t + 0]] + s[e[t + 1]] + s[e[t + 2]] + s[e[t + 3]] + "-" + s[e[t + 4]] + s[e[t + 5]] + "-" + s[e[t + 6]] + s[e[t + 7]] + "-" + s[e[t + 8]] + s[e[t + 9]] + "-" + s[e[t + 10]] + s[e[t + 11]] + s[e[t + 12]] + s[e[t + 13]] + s[e[t + 14]] + s[e[t + 15]]).toLowerCase();
}
var i, D = new Uint8Array(16);
function I() {
  if (!i && (i = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !i))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return i(D);
}
var y = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const m = {
  randomUUID: y
};
function A(e, t, a) {
  if (m.randomUUID && !t && !e)
    return m.randomUUID();
  e = e || {};
  var o = e.random || (e.rng || I)();
  return o[6] = o[6] & 15 | 64, o[8] = o[8] & 63 | 128, v(o);
}
function U(e, t) {
  const a = new ResizeObserver(() => {
    if (e) {
      const { width: o, height: c } = e.getBoundingClientRect();
      t.sendControllerMessage(
        {
          data: {
            width: o,
            height: c
          }
        },
        "resize"
      );
    }
  });
  e && a.observe(e);
}
function w() {
  return window.self !== window.top;
}
function g(e) {
  const t = A(), a = Date.now();
  window.parent.postMessage(
    {
      senderBlockId: e.senderBlockId,
      type: e.type,
      namespace: e.namespace || "",
      eventData: {
        version: 2,
        eventId: t,
        timestamp: a,
        playId: "",
        source: {
          blockId: e.senderBlockId,
          blockName: e.blockName,
          ...e.source
        },
        payload: {
          ...e.payload,
          lastUpdatedTimestamp: a
        },
        ...e.eventData
      }
    },
    "*"
  );
}
const C = (e) => new URLSearchParams(window.location.search).get(e), l = {
  isInIframe: w,
  sendMessageToHost: g,
  getUrlParams: C,
  domResizeObserver: U
}, n = {
  OUTPUT: "output-event",
  INCOME: "input-event",
  CONTROLLER: "controller-event",
  HOST_DATA: "host-data-event",
  ALX: "alx-event"
}, T = {
  BLOCK_ID: "block-id"
}, L = "ALX", N = {
  UPDATE_MESSAGE: "UPDATE_MESSAGE",
  DISPLAY_MESSAGE: "DISPLAY_MESSAGE"
}, r = class r {
  constructor(t, a) {
    d(this, "blockName");
    d(this, "blockEventCallbacks");
    d(this, "blockId", "");
    d(this, "hostData", {});
    this.blockName = t, this.blockEventCallbacks = a, this._setupDefaultParams(), this._setupWindowEvents();
  }
  _setupDefaultParams() {
    const t = l.getUrlParams(T.BLOCK_ID);
    if (!t)
      throw new Error("Not a valid block iframe");
    t && (this.blockId = t);
  }
  _onPostMessageReceived(t) {
    var a, o, c, u, k;
    ((a = t.data) == null ? void 0 : a.receivingBlockId) === this.blockId && (((o = t.data) == null ? void 0 : o.type) === n.INCOME ? this.blockEventCallbacks.onIncomingData && this.blockEventCallbacks.onIncomingData(
      t.data,
      t.data.eventData
    ) : ((c = t.data) == null ? void 0 : c.type) === n.CONTROLLER ? this.blockEventCallbacks.onControllerData && this.blockEventCallbacks.onControllerData(
      t.data,
      t.data.eventData
    ) : ((u = t.data) == null ? void 0 : u.type) === n.ALX ? this.blockEventCallbacks.onAlxData && this.blockEventCallbacks.onAlxData(t.data, t.data.eventData) : ((k = t.data) == null ? void 0 : k.type) === n.HOST_DATA && (this.hostData = {
      ...this.hostData,
      ...t.data.eventData.payload
    }, this.blockEventCallbacks.onHostDataUpdate && this.blockEventCallbacks.onHostDataUpdate(t.data, this.hostData)));
  }
  _setupWindowEvents() {
    window.addEventListener("message", this._onPostMessageReceived.bind(this));
  }
  static register(t, a) {
    return new r(t, a);
  }
  sendOutput(t, a) {
    l.sendMessageToHost({
      senderBlockId: this.blockId,
      type: n.OUTPUT,
      namespace: `${this.blockId}-${t}`,
      blockName: this.blockName,
      source: {
        handleId: t
      },
      payload: {
        data: a
      }
    });
  }
  sendAlxMessage(t, a = N.DISPLAY_MESSAGE) {
    l.sendMessageToHost({
      senderBlockId: this.blockId,
      type: n.ALX,
      namespace: L,
      blockName: this.blockName,
      payload: {
        data: t
      },
      eventData: {
        alxEventType: a
      }
    });
  }
  resizeObserver(t) {
    l.domResizeObserver(t, this);
  }
  sendControllerMessage(t, a) {
    l.sendMessageToHost({
      senderBlockId: this.blockId,
      type: n.CONTROLLER,
      blockName: this.blockName,
      payload: {
        ...t
      },
      eventData: {
        controllerType: a
      }
    });
  }
};
d(r, "Utils", {
  ...l
});
let p = r;
(function(e) {
  e.BlockSdk = p;
})(window);
//# sourceMappingURL=block-sdk.js.map
