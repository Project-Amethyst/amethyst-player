export type KeyPadElement = HTMLButtonElement | HTMLDivElement;

export type Dimension = [number, number] 
export type Position = [number, number];
export type KeyID = number|Position;

export interface DeviceInfo{
  dimension: Dimension,
  grid_dimension: Dimension,
  grid_offset: Position,
  chain_key: KeyID[] //Relative to grid center
  special_led ?: KeyID;
}
