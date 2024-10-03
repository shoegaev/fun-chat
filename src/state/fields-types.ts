/* eslint-disable @typescript-eslint/indent */
export enum StateFieldsKeys {
  userListScroll = "userListScroll",
  msgHistoryScroll = "messageHistoryListScroll",
  openedMsgHistory = "openedMsgHistory",
  messageInputState = "messageInputState",
  userSelectorParams = "userSelectorParams",
}

export type UserListScrollStateField = {
  name: StateFieldsKeys.userListScroll;
  value: number;
};

export type MsgHistoryScrollStateField = {
  name: StateFieldsKeys.msgHistoryScroll;
  value: { [userLogin: string]: number };
};

export type OpenedMsgHistoryStateField = {
  name: StateFieldsKeys.openedMsgHistory;
  value: string;
};

export type MessageInputStateField = {
  name: StateFieldsKeys.messageInputState;
  value: { editMode: boolean; text: string };
};

export type UserSelectorParamsStateField = {
  name: StateFieldsKeys.userSelectorParams;
  value: {
    searchString?: string;
    online: boolean;
    unreadMessages: boolean;
  };
};

export type StateFields = {
  [StateFieldsKeys.userListScroll]?: number;
  [StateFieldsKeys.msgHistoryScroll]?: { [userLogin: string]: number };
  [StateFieldsKeys.openedMsgHistory]?: string;
  [StateFieldsKeys.messageInputState]?: { editMode: boolean; text: string };
  [StateFieldsKeys.userSelectorParams]?: {
    searchString?: string;
    online: boolean;
    unreadMessages: boolean;
  };
};
export type StateField =
  | UserListScrollStateField
  | MsgHistoryScrollStateField
  | OpenedMsgHistoryStateField
  | MessageInputStateField
  | UserSelectorParamsStateField;
