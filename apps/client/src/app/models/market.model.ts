export interface MarketDTO {
  "MarketName": string; //"BTC-LTC",
  "High": number // 0.0135 ,
  "Low": number // 0.012 ,
  "Volume": number // 3833.97619253 ,
  "Last": number // 0.01349998 ,
  "BaseVolume": number // 47.03987026 ,
  "TimeStamp": string; // "2014-07-09T07:22:16.72",
  "Bid": number // 0.01271001 ,
  "Ask": number // 0.012911 ,
  "OpenBuyOrders": number // 45 ,
  "OpenSellOrders": number // 45 ,
  "PrevDay": number // 0.01229501,
  "Created": string; // "2014-02-13T00:00:00",
  "DisplayMarketName": string; // "string"
}

export interface MarketData {
  name: string;
  price: number;
}

export interface MarketResponse {
  message: string;
  result: MarketDTO[];
  success: boolean;
}
