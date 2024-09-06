import BlockSdk from "./sdk";
import { CONTROLLER_TYPE } from "./constants";

export function domResizeObserver(el: HTMLDivElement, blockSdk: BlockSdk) {
  const observer = new ResizeObserver(() => {
    if (el) {
      const { width, height } = el.getBoundingClientRect();
      blockSdk.sendControllerMessage(
        {
          data: {
            width,
            height,
          },
        },
        CONTROLLER_TYPE.RESIZE
      );
    }
  });

  if (el) {
    observer.observe(el);
  }
}
