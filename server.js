const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

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
  "21Services-Lifetime-Optimizer-15390-8676": { type: "lifetime", expiresAt: null },
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
  "21Services-Lifetime-Optimizer-74102-6954": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-Optimizer-21874-5609": { type: "lifetime", expiresAt: null },

  "21Services-ARPack-58291-3746": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-91347-6283": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-74625-1802": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-49013-2958": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-83529-6174": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-67348-5029": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-21059-8437": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-15832-7604": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-92351-4827": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-30476-9510": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-73928-1046": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-68219-5734": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-51870-2491": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-87631-9045": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-29530-1837": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-19082-3749": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-48106-5297": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-65093-7812": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-50718-9427": { type: "lifetime", expiresAt: null },
  "21Services-ARPack-38206-6148": { type: "lifetime", expiresAt: null },

  "21Services-SmgPack-53829-4710": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-91384-2607": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-76410-3952": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-42037-1869": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-85912-7403": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-69530-2847": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-23175-6094": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-18750-4962": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-90264-5317": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-36487-9201": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-74105-1836": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-68192-7450": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-51963-2708": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-87241-6039": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-29385-4016": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-19064-3728": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-48025-9571": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-65081-7429": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-50837-9165": { type: "lifetime", expiresAt: null },
"21Services-SmgPack-38062-1549": { type: "lifetime", expiresAt: null },

"21Services-ShotgunPack-58921-3740": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-91736-8245": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-74902-1847": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-49583-2701": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-83259-6140": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-67842-5029": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-21609-8473": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-15482-7630": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-92035-4871": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-30274-9518": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-73498-1026": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-68912-5743": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-51078-2439": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-87463-9062": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-29751-1839": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-19806-3724": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-48307-5291": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-65329-7810": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-50718-9426": { type: "lifetime", expiresAt: null },
"21Services-ShotgunPack-38106-6155": { type: "lifetime", expiresAt: null },

"21Services-FortniteOptimizerPack-53829-4716": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-91384-2670": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-76410-3957": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-42037-1809": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-85912-7409": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-69530-2841": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-23175-6004": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-18750-4902": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-90264-5312": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-36487-9211": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-74105-1831": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-68192-7454": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-51963-2700": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-87241-6031": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-29385-4011": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-19064-3720": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-48025-9501": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-65081-7421": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-50837-9168": { type: "lifetime", expiresAt: null },
"21Services-FortniteOptimizerPack-38062-1541": { type: "lifetime", expiresAt: null },

"21Services-BuildPlacePack-58129-4710": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-91381-2607": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-76410-3951": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-42037-1861": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-85912-7401": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-69530-2840": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-23175-6091": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-18750-4961": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-90264-5311": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-36487-9200": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-74105-1830": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-68192-7451": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-51963-2701": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-87241-6030": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-29385-4010": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-19064-3721": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-48025-9570": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-65081-7420": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-50837-9160": { type: "lifetime", expiresAt: null },
"21Services-BuildPlacePack-38062-1540": { type: "lifetime", expiresAt: null },

"21Services-BulletDropPack-53829-4700": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-91384-2617": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-76410-3902": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-42037-1860": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-85912-7413": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-69530-2849": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-23175-6009": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-18750-4900": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-90264-5318": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-36487-9208": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-74105-1838": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-68192-7452": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-51963-2702": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-87241-6038": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-29385-4015": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-19064-3727": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-48025-9509": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-65081-7425": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-50837-9164": { type: "lifetime", expiresAt: null },
"21Services-BulletDropPack-38062-1544": { type: "lifetime", expiresAt: null },

"21Services-PacketPlacementPack-65886-8909": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-10985-4269": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-65494-7224": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-94409-9015": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-28130-3996": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-95970-2847": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-83606-2192": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-67628-8608": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-46463-2474": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-92221-4179": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-13776-8071": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-41207-2416": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-12107-8783": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-92709-7794": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-51703-7039": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-29390-2092": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-18179-3857": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-36346-5849": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-57932-7315": { type: "lifetime", expiresAt: null },
"21Services-PacketPlacementPack-59206-9099": { type: "lifetime", expiresAt: null },

"PhantomWare-AIcheat-3748-0921": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-6502-1187": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-5813-4609": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-9274-3310": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-1406-7852": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-8039-2564": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-2197-6405": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-4761-9032": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-3058-4716": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-9921-0347": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-6678-1503": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-4820-7591": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-1534-8206": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-7405-3189": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-8362-5940": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-2910-4673": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-0587-2236": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-6149-3875": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-4293-5068": { type: "lifetime", expiresAt: null },
"PhantomWare-AIcheat-1072-9644": { type: "lifetime", expiresAt: null }

};

app.get('/', (req, res) => {
  res.send('Key Validation Server with HWID binding is running.');
});

app.post('/validate-key', (req, res) => {
  const { key, hwid, bind } = req.body;

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ valid: false, message: "Key missing or invalid." });
  }

  if (!hwid || typeof hwid !== 'string') {
    return res.status(400).json({ valid: false, message: "HWID missing or invalid." });
  }

  const record = keyDB[key];
  if (!record) {
    return res.json({ valid: false, message: "Key not found." });
  }

  // Check if key expired (if time-limited)
  if (record.type !== 'lifetime') {
    if (!record.expiresAt || Date.now() > record.expiresAt) {
      return res.json({ valid: false, message: "Key expired." });
    }
  }

  // HWID binding logic with explicit bind flag
  if (!record.boundHWID) {
    if (bind === true) {
      // Explicit bind allowed
      record.boundHWID = hwid;
    } else {
      // Not bound and no bind flag — don't bind automatically
      return res.json({
        valid: true,
        hwidLocked: false,
        message: "Key is valid but not yet bound to any HWID."
      });
    }
  } else if (record.boundHWID !== hwid) {
    return res.json({
      valid: false,
      hwidLocked: true,
      message: "HWID does not match the bound device."
    });
  }

  // Key is valid and HWID matches or was just bound
  return res.json({
    valid: true,
    hwidLocked: true,
    message: "Key is valid and HWID verified.",
    type: record.type,
    boundHWID: record.boundHWID
  });
});

// New endpoint to check if a key is HWID locked without binding it
app.post('/check-hwid-lock', (req, res) => {
  const { key } = req.body;

  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: "Key missing or invalid." });
  }

  const record = keyDB[key];
  if (!record) {
    return res.json({ hwidLocked: false, message: "Key not found." });
  }

  if (record.boundHWID) {
    return res.json({ hwidLocked: true, boundHWID: record.boundHWID });
  } else {
    return res.json({ hwidLocked: false, message: "Key is not HWID locked." });
  }
});

app.listen(PORT, () => {
  console.log(`Key validation server with HWID binding running on port ${PORT}`);
});




