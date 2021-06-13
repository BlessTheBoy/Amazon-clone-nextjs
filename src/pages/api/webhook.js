import { buffer } from "micro";
import * as admin from "firebase-admin";

// Secure a connection to FIREBASE from the backend
var serviceAccount = require("./../../../permisson.json");
const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })
  : admin.app();

// Extablish connection to STRIPE
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpoingsecret = process.env.STRIPE_SIGNING_SECRET;

const fulfillOrder = async (session) => {
  // console.log("fulfilling order", session);

  return app
    .firestore()
    .collection("users")
    .doc(session.metadata.email)
    .collection("orders")
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log(`SUCCESS: order ${session.id} has been added to the DB`);
    });
};

export default async (req, res) => {
  if (req.method == "POST") {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      // verify that event came from stripe
      event = stripe.webhooks.constructEvent(payload, sig, endpoingsecret);
    } catch (error) {
      console.log("ERROR", error.message);
      return res.status(400).send(`Webhook err: ${error.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type == "checkout.session.completed") {
      const session = event.data.object;

      // fufil order
      fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => {
          // Do something with the error
          res.status(400).send(`webhook error: ${err.message}`);
        });
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
