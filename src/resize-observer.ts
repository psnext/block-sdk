import BlockSdk from "./sdk";

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
        "resize"
      );
    }
  });

  if (el) {
    observer.observe(el);
  }
}
