export enum ColorType
{
  Palette, //[Palette ID, R, G, B]
  RGB //[R, G, B]
}

export class Color
{
  type?: ColorType;
  value?: number[];

  constructor(type: ColorType, value ?: number[])
  {
    this.type = type;
    this.value = value;
  }

  rgb(): [number, number, number]
  {
    var rgb: [number, number, number] = [0, 0, 0];
    if(this.type === undefined || this.value === undefined)
    {
      //Just keep r g b as 0, 0, 0
    }
    else if(this.type === ColorType.Palette)
    {
      rgb[0] = this.value[1];
      rgb[1] = this.value[2];
      rgb[2] = this.value[3];
    }
    else if(this.type === ColorType.RGB)
    {
      rgb[0] = this.value[0];
      rgb[1] = this.value[1];
      rgb[2] = this.value[2];
    }

    return rgb;
  }

  rgb_str(): string
  {
    var [r, g, b] = this.rgb();

    return `rgb(${r}, ${g}, ${b})`;
  }

  overlay(base: Color): Color
  {
    var self_rgb = this.rgb();
    var base_rgb = base.rgb();

    var rgb = [
      base_rgb[0] + (255 - base_rgb[0]) * (self_rgb[0] / 255),
      base_rgb[1] + (255 - base_rgb[1]) * (self_rgb[1] / 255),
      base_rgb[2] + (255 - base_rgb[2]) * (self_rgb[2] / 255)
    ];

    return new Color(ColorType.RGB, rgb);
  }

  index(): number|undefined
  {
    if(this.type === ColorType.Palette)
    {
      return this.value?.[0];
    }
    return undefined;
  }
}