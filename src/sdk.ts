import Utils from "./utils";
import { BlockEventCallbacks, HostData } from "./types";
import {
  ALX_EVENT_ID,
  BLOCK_URL_PARAMS,
  EVENT_NAMES,
  ALX_EVENT_TYPE,
} from "./constants";

export default class BlockSdk {
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
        this.blockEventCallbacks.onIncomingData &&
          this.blockEventCallbacks.onIncomingData(
            event.data,
            event.data.eventData
          );
      } else if (event.data?.type === EVENT_NAMES.CONTROLLER) {
        this.blockEventCallbacks.onControllerData &&
          this.blockEventCallbacks.onControllerData(
            event.data,
            event.data.eventData
          );
      } else if (event.data?.type === EVENT_NAMES.ALX) {
        this.blockEventCallbacks.onAlxData &&
          this.blockEventCallbacks.onAlxData(event.data, event.data.eventData);
      } else if (event.data?.type === EVENT_NAMES.HOST_DATA) {
        this.hostData = {
          ...this.hostData,
          ...event.data.eventData.payload,
        };
        this.blockEventCallbacks.onHostDataUpdate &&
          this.blockEventCallbacks.onHostDataUpdate(event.data, this.hostData);
      }
    }
  }
  private _setupWindowEvents() {
    window.addEventListener("message", this._onPostMessageReceived.bind(this));
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
    Utils.sendMessageToHost({
      senderBlockId: this.blockId,
      type: EVENT_NAMES.OUTPUT,
      namespace: `${this.blockId}-${outputHandlerId}`,
      blockName: this.blockName,
      source: {
        handleId: outputHandlerId,
      },
      payload: {
        data,
      },
    });
  }
  public sendAlxMessage(
    message: string,
    type = ALX_EVENT_TYPE.DISPLAY_MESSAGE
  ) {
    Utils.sendMessageToHost({
      senderBlockId: this.blockId,
      type: EVENT_NAMES.ALX,
      namespace: ALX_EVENT_ID,
      blockName: this.blockName,
      payload: {
        data: message,
      },
      eventData: {
        alxEventType: type,
      },
    });
  }
  public resizeObserver(el: HTMLDivElement) {
    Utils.domResizeObserver(el, this);
  }
  public sendControllerMessage(data: any, controllerType: string) {
    Utils.sendMessageToHost({
      senderBlockId: this.blockId,
      type: EVENT_NAMES.CONTROLLER,
      blockName: this.blockName,
      payload: {
        ...data,
      },
      eventData: {
        controllerType,
      },
    });
  }
}
