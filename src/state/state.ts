import {
  StateFields,
  StateFieldsKeys,
  StateField,
  MsgHistoryScrollStateField,
  OpenedMsgHistoryStateField,
} from "./fields-types";

export class State {
  public readonly stateFields: StateFields;

  constructor() {
    this.stateFields = {};
  }

  public getField<T extends StateFieldsKeys>(
    fieldName: T,
  ): StateFields[T] | undefined {
    if (!this.stateFields[fieldName]) {
      return undefined;
    }
    return this.stateFields[fieldName];
  }

  public setField(field: StateField) {
    switch (field.name) {
      case StateFieldsKeys.msgHistoryScroll:
        this.setMsgHistoryScroll(field);
        break;
      case StateFieldsKeys.openedMsgHistory:
        this.setOpenedMessageHistory(field);
        break;
    }
  }

  private setMsgHistoryScroll(field: MsgHistoryScrollStateField): void {
    let scrollField = this.stateFields[StateFieldsKeys.msgHistoryScroll];
    if (!scrollField) {
      scrollField = {};
      this.stateFields[StateFieldsKeys.msgHistoryScroll] = scrollField;
    }
    Object.keys(field.value).forEach((key) => {
      scrollField[key] = field.value[key];
    });
  }

  private setOpenedMessageHistory(field: OpenedMsgHistoryStateField): void {
    this.stateFields[StateFieldsKeys.openedMsgHistory] = field.value;
  }
}
