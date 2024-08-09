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
              title: "Meu produto",
              quantity: 1,
              unit_price: 25,
            },
          ],
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
      limit: 2,
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
