export type KeyPadElement = HTMLButtonElement | HTMLDivElement;
export type KeyID = number|[number, number]

export interface DeviceInfo{
  dimension: [number, number],
  grid_dimension: [number, number],
  grid_offset: [number, number],
  chain_key: KeyID[] //Relative to grid center
  special_led ?: KeyID;
}
