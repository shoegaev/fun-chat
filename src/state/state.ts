import { StateFields, StateFieldsKeys, StateField } from "./fields-types";

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
    const setMsgHistoryScrollResult = this.setMsgHistoryScroll(field);
    if (setMsgHistoryScrollResult) {
      return;
    }
  }

  private setMsgHistoryScroll(field: StateField): boolean {
    if (field.name !== StateFieldsKeys.msgHistoryScroll) {
      return false;
    }
    let scrollField = this.stateFields[StateFieldsKeys.msgHistoryScroll];
    if (!scrollField) {
      scrollField = {};
      this.stateFields[StateFieldsKeys.msgHistoryScroll] = scrollField;
    }
    Object.keys(field.value).forEach((key) => {
      scrollField[key] = field.value[key];
    });
    return true;
  }
}
