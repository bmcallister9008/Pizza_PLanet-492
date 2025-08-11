import express from "express";
const router = express.Router();

// Fake checkout route
router.post("/checkout", (req, res) => {
  const { items, customerEmail } = req.body;
  
  console.log("Pretending to process payment for:", customerEmail, items);

  // Simulate 2s processing delay
  setTimeout(() => {
    res.json({
      status: "success",
      message: "Payment processed (mock)",
      orderId: Math.floor(Math.random() * 100000),
    });
  }, 2000);
});

export default router;
