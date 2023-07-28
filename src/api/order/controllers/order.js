"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const result = await super.create(ctx);

    console.log("result" + result);

    const midtransClient = require("midtrans-client");
    // Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: "SB-Mid-server-I5W9lzd_WIBluv6cjfqCPpM8",
      clientKey: "SB-Mid-client-qQzbv_A8g2B56-so",
    });

    let parameter = {
      transaction_details: {
        order_id: result.data.id,
        gross_amount: result.data.attributes.total_price,
      },
      credit_card: {
        secure: true,
      },
    };

    snap.createTransaction(parameter).then((transaction) => {
      // transaction token
      let transactionToken = transaction.token;
      console.log("transactionToken:", transactionToken);
    });

    let response = await snap.createTransaction(parameter);

    /**
     * Credit Card Charge
     */
    // const midtransClient = require("midtrans-client");
    // Create Core API instance
    // let core = new midtransClient.CoreApi({
    //   isProduction: false,
    //   serverKey: "SB-Mid-server-I5W9lzd_WIBluv6cjfqCPpM8",
    //   clientKey: "SB-Mid-client-qQzbv_A8g2B56-so",
    // });

    // let parameter = {
    //   payment_type: "gopay",
    //   transaction_details: {
    //     gross_amount: result.data.attributes.total_price,
    //     order_id: result.data.id,
    //   },
    //   credit_card: {
    //     token_id: "CREDIT_CARD_TOKEN", // change with your card token
    //     authentication: true,
    //   },
    // };

    // let response = await core.charge(parameter);
    return response;
  },
}));
