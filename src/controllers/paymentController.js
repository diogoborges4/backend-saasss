const { MercadoPagoConfig, Preference } = require("mercadopago");
const Payment = require("../models/Pagamento.js");

const paymentController = {
  create: async (req, res) => {
    const client = new MercadoPagoConfig({
      accessToken:
        "APP_USR-242150625333578-080615-393e86f77b4be0f35115b02dbc2454ca-1935357390",
    });

    const preference = new Preference(client);

    const response = await preference
      .create({
        body: {
          items: [
            {
              title: req.body.title,
              quantity: req.body.quantity,
              unit_price: req.body.price,
            },
          ],
          back_urls: {
            success: "http://localhost:5173/",
            failure: "http://localhost:5173/",
            pending: "http://localhost:5173/",
          },
          auto_return: "approved",
          notification_url: "https://backend-saasss.vercel.app/api/webhook",
        },
      })
      .then(console.log)
      .catch(console.log);
    res.status(200).json({ response, msg: "produto criado" });
  },
  getReference: async (req, res) => {
    const client = new MercadoPagoConfig({
      accessToken:
        "APP_USR-242150625333578-080615-393e86f77b4be0f35115b02dbc2454ca-1935357390",
    });
    const preference = new Preference(client);

    const options = {
      offset: 0,
      limit: 3,
    };
    const searched = await preference.search({ options });

    res.status(200).json({ searched, msg: "produto encontrado" });
  },
  reqPayment: async (req, res) => {
    try {
      const pagamento = new Payment({
        id: req.body.data.id,
        status: req.body.action,
        detail: req.body,
      });
      await pagamento.save();
      res.status(200).send("OK");
    } catch (error) {
      console.log("Erro ao salvar o pagamento:", error);
      res.status(500).send("Erro interno do servidor");
    }
  },
};

module.exports = paymentController;
