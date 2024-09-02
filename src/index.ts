import { v4 as uuidv4 } from "uuid";
import Utils from "./utils";
import { BlockEventCallbacks, HostData } from "./types";
import { BLOCK_URL_PARAMS, EVENT_NAMES } from "./constants";

(function (Module) {
  class BlockSdk {
    public blockName: string;
    public blockEventCallbacks: BlockEventCallbacks;
    public blockId: string = "";
    public hostData: HostData = {};
    constructor(blockName: string, blockEventCallbacks: BlockEventCallbacks) {
      this.blockName = blockName;
      this.blockEventCallbacks = blockEventCallbacks;
      this._setupDefaultParams();
      this._setupWindowEvents();
    }
    private _setupDefaultParams() {
      const blockId = Utils.getUrlParams(BLOCK_URL_PARAMS.BLOCK_ID);
      if (!blockId) {
        throw new Error("Not a valid block iframe");
      }
      if (blockId) {
        this.blockId = blockId;
      }
    }
    private _onPostMessageReceived(event: MessageEvent) {
      if (event.data?.receivingBlockId === this.blockId) {
        if (event.data?.type === EVENT_NAMES.INCOME) {
          this.blockEventCallbacks.onIncomingData(
            event.data,
            event.data.eventData
          );
        } else if (event.data?.type === EVENT_NAMES.CONTROLLER) {
          this.blockEventCallbacks.onControllerData(
            event.data,
            event.data.eventData
          );
        } else if (event.data?.type === EVENT_NAMES.ALX) {
          this.blockEventCallbacks.onAlxData(event.data, event.data.eventData);
        } else if (event.data?.type === EVENT_NAMES.HOST_DATA) {
          this.hostData = {
            ...this.hostData,
            ...event.data.eventData.payload,
          };
          this.blockEventCallbacks.onHostDataUpdate(event.data, this.hostData);
        }
      }
    }
    private _setupWindowEvents() {
      window.addEventListener(
        "message",
        this._onPostMessageReceived.bind(this)
      );
    }
    public static Utils = {
      ...Utils,
    };
    public static register(
      blockName: string,
      blockEventCallbacks: BlockEventCallbacks
    ) {
      return new BlockSdk(blockName, blockEventCallbacks);
    }
    public sendOutput(outputHandlerId: string, data: any) {
      const uid = uuidv4();
      const timestamp = Date.now();
      window.parent.postMessage(
        {
          senderBlockId: this.blockId,
          type: EVENT_NAMES.OUTPUT,
          namespace: `${this.blockId}-${outputHandlerId}`,
          eventData: {
            eventId: uid,
            timestamp: timestamp,
            playId: "",
            source: {
              blockId: this.blockId,
              blockName: this.blockName,
              handleId: outputHandlerId,
            },
            payload: {
              data,
              lastUpdatedTimestamp: timestamp,
            },
          },
        },
        "*"
      );
    }
  }
  Module.BlockSdk = BlockSdk;
})(window);
