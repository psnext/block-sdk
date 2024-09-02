import { EVENT_NAMES } from "./constants";

export type Callback = (...arg: any) => void;

export type EventName = (typeof EVENT_NAMES)[keyof typeof EVENT_NAMES];

export interface BlockEventCallbacks {
  onIncomingData: Callback;
  onControllerData: Callback;
  onAlxData: Callback;
  onHostDataUpdate: Callback;
}

interface InputHandler {
  id: string;
  name: string;
  type: string;
  description: string;
}

interface OutputHandler {
  id: string;
  name: string;
  type: string;
  description: string;
}

export interface IAppConfig {
  id: string;
  agentUrl: string;
  widgetUrl: string;
  name: string;
  description: string;
  preview_url: string;
  appType: string;
  nodeType: string;
  inputHandlers: InputHandler[];
  outputHandlers: OutputHandler[];
  appSlug?: string;
  widget_url?: string;
  version?: Number;
  defaultWidth?: Number;
  defaultHeight?: Number;
}

export interface IncomingEdge {
  edgeId: string;
  sourceHandleId: string;
  targetHandleId: string;
  sourceBlockId: string;
  targetBlockId: string;
}

export interface Edge {
  edgeId: string;
  handlerId: string;
  name: string;
  type: string;
}

export interface HostData {
  workspaceId?: string;
  projectId?: string;
  parentId?: string;
  project?: {};
  client?: {};
  appConfig?: IAppConfig;
  incomingEdges?: IncomingEdge[];
}
