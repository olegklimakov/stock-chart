import { DefaultSelectedStocks } from '../data/default-stocks';

export class MarketPriceClass {

  isSelected: boolean;

  constructor(
    public price: number,
    public name: string,
  ) {}

  toString() {
    return `${this.name}  ${this.price}`
  }
}
