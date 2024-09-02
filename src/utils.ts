import { v4 as uuidv4 } from "uuid";
import { EventName, AnyObj } from "./types";
import { domResizeObserver } from "./resize-observer";

function isInIframe() {
  return window.self !== window.top;
}

type MessageToHost = {
  senderBlockId: string;
  type: EventName;
  namespace?: string;
  blockName: string;
  source?: AnyObj;
  payload?: AnyObj;
  eventData?: AnyObj;
};

function sendMessageToHost(config: MessageToHost) {
  const uuid = uuidv4();
  const timestamp = Date.now();
  window.parent.postMessage(
    {
      senderBlockId: config.senderBlockId,
      type: config.type,
      namespace: config.namespace || "",
      eventData: {
        version: 2,
        eventId: uuid,
        timestamp: timestamp,
        playId: "",
        source: {
          blockId: config.senderBlockId,
          blockName: config.blockName,
          ...config.source,
        },
        payload: {
          ...config.payload,
          lastUpdatedTimestamp: timestamp,
        },
        ...config.eventData,
      },
    },
    "*"
  );
}

const getUrlParams = (key: string) => {
  const params = new URLSearchParams(window.location.search);
  const value = params.get(key);
  return value;
};

export default {
  isInIframe,
  sendMessageToHost,
  getUrlParams,
  domResizeObserver,
};
