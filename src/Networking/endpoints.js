//
// PsycryptBot
// -------------------------------------
// | Copyright © 2021. Corban Amouzou  |
// | Copyright © 2021. Jules Amalie    |
// | Copyright © 2021. Hunter Ummels   |
// -------------------------------------
// All rights reserved.
//

module.exports = {
  '0x': {
    url: 'api.0x.org',
    swap: {
      price: '/swap/v1/price',
    },
    orderbook: {
      orders: '/orderbook/v1/orders',
    },
  },
  'infura': {
    url: 'mainnet.infura.io',
    ws: `/ws/v3/${process.psyConf.infuraKey}`,
  },
};
