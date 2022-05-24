/**
 * Strip Payment Integration
 * @author Shuja Naqvi
 */

const Quotes = require("../models/Quotes");
const Orders = require("../models/Orders");
const Chats = require("../models/Chats");
const Messages = require("../models/Messages");

const stripe = require("stripe")(process.env.SECRET_KEY);

exports.Checkout = async (req, res, next) => {
  try {
    let metaData = req.body.metaData;
    let lineItems = req.body.line_items; // => get the line items array from the resposne
    // => stripe api to create a checkout seesion url

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // => A list of the types of payment methods (e.g., card)
      line_items: lineItems, // => A list of items the customer is purchasing. For payment mode, there is a maximum of 100 line items
      locale: "fr", // => The IETF language tag of the locale Checkout is displayed in.
      mode: "payment", // => The mode of the Checkout Session. Possible type: payment, setup and subscription
      success_url: `${process.env.CLIENT_URL}/orders`, // => The URL the customer will be directed to if they decide to cancel payment and return to your website. example http://localhost:3001/home?success
      cancel_url: `${process.env.CLIENT_URL}/orders`, // => The URL to which Stripe should send customers when payment or setup is complete. If you’d like to use information from the successful Checkout Session on your page. example http://localhost:3001/not_home?reject
      metadata: metaData,
    });
    // => return the url of the checkout session page
    res.status(200).json({
      url: session.url,
    });
  } catch (err) {
    next(err);
  }
};

exports.Webhook = async (req, res) => {
  let sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.WEB_HOOK_KEY //////webhook scret key,
    );
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    case "checkout.session.completed":
      {
        const session = event.data.object;
        const metaData = session.metadata;
        const quote = metaData.id;
        const existingQuote = await Quotes.findById(quote);

        if (!existingQuote) return res.json({ success: false, message: "QuoteId is invalid" });
        const quotes = await Quotes.findByIdAndUpdate(existingQuote._id, {
          $set: {
            status: "accepted",
          },
        });
        if (metaData.type === "static") {
          await Orders.findByIdAndUpdate(existingQuote.order, {
            $set: {
              status: "in_progress",
              tailor: existingQuote.tailor,
            },
          });
        } else if (metaData.type === "tape") {
          const orders = await Orders.findByIdAndUpdate(existingQuote.order, {
            $set: {
              status: "in_progress",
              tailor: existingQuote.tailor,
              "measurements.value": metaData.measurements,
            },
          });
        } else if (metaData.type === "call") {
          const orders = await Orders.findByIdAndUpdate(existingQuote.order, {
            $set: {
              status: "in_progress",
              tailor: existingQuote.tailor,
            },
          });
          const _content = `
      Hey! Your call schedule has been booked 
      At: ${metaData.time}
      `;
          let chats = await Chats.findOne({
            client: orders.client,
            tailor: quotes.tailor,
          });

          if (chats) {
            const messages = await Messages.create({
              type: "text",
              chat: chats._id,
              sender: orders.client,
              receiver: quotes.tailor,
              content: _content,
            });

            await Chats.findOneAndUpdate({
              client: orders.client,
              tailor: quotes.tailor,
              last_message: messages._id,
            });
          } else {
            chats = await Chats.create({
              client: orders.client,
              tailor: quotes.tailor,
            });

            const messages = await Messages.create({
              type: "text",
              chat: chats._id,
              sender: orders.client,
              receiver: quotes.tailor,
              content: _content,
            });

            await Chats.findOneAndUpdate({
              client: orders.client,
              tailor: quotes.tailor,
              last_message: messages._id,
            });
          }
        }
      }
      break;
    default:
      console.trace(`Unhandled event type ${event.type}`);
  }
  res.send();
};
