import {
  getSelectedToken,
  getSendEditingTransactionId,
} from "../../../selectors";


export function getTitleParams (metamask, send) {
  const isEditing = Boolean(getSendEditingTransactionId(send));
  const isToken = Boolean(getSelectedToken(metamask));

  if (isEditing) {
    return {id: "pages.send.edit"};
  } else if (isToken) {
    return {id: "pages.send.sendTokens"};
  } else {
    return {id: "pages.send.sendETH"};
  }
}

export function getSubtitleParams (metamask, send) {
  const isEditing = Boolean(getSendEditingTransactionId(send));
  const token = getSelectedToken(metamask);

  if (isEditing) {
    return {id: "pages.send.editingTransaction"};
  } else if (token) {
    return {id: "pages.send.onlySendTokensToAccountAddress", values: token};
  } else {
    return {id: "pages.send.onlySendToEtherAddress"};
  }
}
