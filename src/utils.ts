import { v4 as uuidv4 } from "uuid";
import { EventName } from "./types";

function isInIframe() {
  return window.self !== window.top;
}

function sendMessageToHost(
  senderBlockId: string,
  blockName: string,
  type: EventName,
  payload: { [key: string]: any },
  source = {}
) {
  const uid = uuidv4();
  const timestamp = Date.now();
  window.parent.postMessage(
    {
      senderBlockId: senderBlockId,
      type: type,
      eventData: {
        eventId: uid,
        timestamp: timestamp,
        playId: "",
        source: {
          blockId: senderBlockId,
          blockName: blockName,
          ...source,
        },
        payload: {
          ...payload,
        },
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
};
