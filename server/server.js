const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const now = Date.now();

// Sample key database
const keyDB = {
  // 1day keys
  "21Services-1day-Optimizer-83429-1745": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-51048-3267": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-29735-8490": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-62894-1753": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-74019-2638": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-91563-4072": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-28375-6901": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-40982-5376": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-17640-8295": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-56213-4780": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-80475-2913": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-32791-0644": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-69852-7134": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-14587-9206": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-45320-6179": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-97164-3823": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-53602-1947": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-82039-7654": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-21486-5093": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1day-Optimizer-67914-2308": { type: "1day", expiresAt: now + 24*3600*1000 },

  // 1Week keys
  "21Services-1Week-Optimizer-49076-1825": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-73510-6942": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-26183-0754": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-95847-3261": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-60739-8425": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-18264-5907": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-47320-8169": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-39587-2401": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-62019-7358": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-87405-1692": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-50832-9471": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-76914-3208": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-34567-0812": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-91824-5736": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-15078-6429": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-46209-3751": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-83954-1207": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-27406-9583": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-58130-4796": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-Optimizer-69321-0857": { type: "1week", expiresAt: now + 7*24*3600*1000 },

  // Lifetime keys (no expiration)
  "21Services-Lifetime-Optimizer-15390-8675": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-68204-3197": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-59713-8046": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-38025-6719": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-16487-2053": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-95312-4860": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-82670-1394": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-47136-5082": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-29405-7631": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-53079-4186": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-71248-3059": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-60831-9724": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-13594-7860": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-47620-3195": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-89017-2543": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-36259-8401": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-74102-6953": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-21874-5609": { type: "lifetime", expiresAt: null },
};

app.get('/', (req, res) => {
  res.send('Key Validation Server is running.');
});

app.post('/validate-key', (req, res) => {
  const { key } = req.body;
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ valid: false, message: "Key missing or invalid" });
  }

  const record = keyDB[key];
  if (!record) {
    return res.json({ valid: false, message: "Key not found" });
  }

  // Check expiration unless lifetime
  if (record.type !== 'lifetime' && record.expiresAt < Date.now()) {
    return res.json({ valid: false, message: "Key expired" });
  }

  return res.json({ valid: true, message: "Key is valid", type: record.type });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Key validation server running on http://0.0.0.0:${PORT} (accessible from your public IP if port forwarded)`);
});
