export type KeyPadElement = HTMLButtonElement | HTMLDivElement;
export type KeyID = number|[number, number]
export type KeyPress = (keyID: KeyID) => unknown;
export type KeyRelease = (keyID: KeyID) => unknown;
