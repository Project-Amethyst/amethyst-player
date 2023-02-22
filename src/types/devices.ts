export type KeyPadElement = HTMLButtonElement | HTMLDivElement;

export type Dimension = [number, number] 
export type Position = [number, number];
export type LayerKey = ['c', number];
export type SpecialLED = ['s', number];
export type KeyID = number|Position|LayerKey|SpecialLED;

export interface DeviceInfo{
  dimension: Dimension,
  grid_dimension: Dimension,
  grid_offset: Position,
  layer_key: KeyID[] //Relative to grid center
  special_led ?: KeyID;
}
