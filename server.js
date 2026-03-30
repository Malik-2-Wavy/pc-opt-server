const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const ADMIN_SECRET = 'Jetstrong73$'; // ← your password
const WEBHOOK_URL  = 'https://discord.com/api/webhooks/1397243251735400459/LSRA9UL-xSA3jy1PnP6XczUKFojgz2PeyjCFdAI1JjbzBuGwxKwgrpyRJ15uEoXwywl9';

const now = Date.now();

const userDB       = {};
let bannedHWIDs    = new Set();
let bannedKeys     = new Set();
let activeSessions = new Set();
let keyUsageDB     = {}; // { key: { useCount: 0, hwids: [] } }
let userVersionDB = {}; // { hwid: { version, username, lastSeen } }

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

  // 1Day keys
  "Phantomware-Fivem-day-75029-1183": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-51938-4402": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-17652-8841": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-28461-5593": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-42018-3376": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-66102-7754": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-89341-2205": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-30577-6619": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-74820-1139": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-91266-5501": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-43289-7713": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-60815-3342": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-18944-9982": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-72330-4417": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-55412-8826": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-86729-1108": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-99021-6653": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-27653-4470": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-63184-7738": { type: "1day", expiresAt: now + 24*3600*1000 },
  "Phantomware-Fivem-day-44801-2299": { type: "1day", expiresAt: now + 24*3600*1000 },

  // 1 Week keys
  "Phantomware-Fivem-week-19384-6621": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-28490-7735": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-90214-6630": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-73188-1029": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-66302-9941": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-55021-3378": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-81473-6652": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-22791-8804": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-94018-7730": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-38264-5519": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-67593-1102": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-12048-8873": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-88912-4476": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-53029-6618": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-76102-3389": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-29843-9920": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-41758-7733": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-60291-5540": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-84513-2217": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "Phantomware-Fivem-week-33480-7788": { type: "1week", expiresAt: now + 7*24*3600*1000 },

  // 1 Month keys
  "Phantomware-Fivem-month-58291-7392": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-66173-2948": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-34827-1195": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-49560-7732": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-15739-4482": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-72014-8831": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-83925-6610": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-21478-5529": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-99301-7742": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-44182-9305": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-67839-1120": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-30295-6674": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-88412-5590": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-51902-3381": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-76018-9924": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-22579-4410": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-91834-7702": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-63710-1189": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-48266-5537": { type: "1month", expiresAt: now + 30*24*3600*1000 },
  "Phantomware-Fivem-month-10984-8823": { type: "1month", expiresAt: now + 30*24*3600*1000 },

  // Lifetime keys
  "Phantomware-Fivem-lifetime-90422-5576": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-77301-8894": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-62839-2207": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-83927-6610": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-98561-7754": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-11029-8843": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-76284-3301": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-49832-7710": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-22561-9942": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-88473-5521": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-31984-6675": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-67012-1133": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-55289-4488": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-90147-7760": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-73820-9921": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-26483-5507": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-61529-7714": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-80731-2236": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-44320-8891": { type: "lifetime", expiresAt: null },
  "Phantomware-Fivem-lifetime-12984-6670": { type: "lifetime", expiresAt: null },

  // 1Day keys
"Phantomware-R6-day-91347-5521": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-48215-7730": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-75092-1184": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-66128-9943": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-30581-6620": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-89412-3375": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-17263-8801": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-54892-4419": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-73910-2235": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-26483-5508": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-61724-7781": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-42095-3348": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-88931-1107": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-53107-6654": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-27466-9922": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-96518-7712": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-34871-4480": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-70294-6611": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-15839-8825": { type: "1day", expiresAt: now + 24*3600*1000 },
"Phantomware-R6-day-62910-3372": { type: "1day", expiresAt: now + 24*3600*1000 },

// 1Week keys
"Phantomware-R6-week-90412-7733": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-66173-2294": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-34890-1188": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-49563-7721": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-15784-4489": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-72019-8830": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-83920-6601": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-21479-5532": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-99300-7741": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-44185-9302": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-67832-1118": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-30290-6671": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-88419-5587": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-51900-3380": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-76011-9920": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-22570-4409": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-91830-7700": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-63712-1187": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-48260-5533": { type: "1week", expiresAt: now + 7*24*3600*1000 },
"Phantomware-R6-week-10980-8820": { type: "1week", expiresAt: now + 7*24*3600*1000 },

// 1Month keys
"Phantomware-R6-month-57391-7399": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-66273-2958": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-34927-1190": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-49660-7730": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-15839-4492": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-72114-8838": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-84025-6612": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-21578-5520": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-99401-7748": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-44282-9315": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-67939-1130": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-30395-6684": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-88512-5595": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-52002-3391": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-76118-9934": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-22679-4420": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-91934-7712": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-63810-1199": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-48366-5547": { type: "1month", expiresAt: now + 30*24*3600*1000 },
"Phantomware-R6-month-11084-8833": { type: "1month", expiresAt: now + 30*24*3600*1000 },

// Lifetime keys
"Phantomware-R6-lifetime-91422-5571": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-78301-8890": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-63839-2200": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-84927-6615": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-99561-7759": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-12029-8848": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-77284-3306": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-50832-7715": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-23561-9947": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-89473-5526": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-32984-6680": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-68012-1138": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-56289-4493": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-91147-7765": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-74820-9926": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-27483-5512": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-62529-7719": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-81731-2241": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-45320-8896": { type: "lifetime", expiresAt: null },
"Phantomware-R6-lifetime-13984-6675": { type: "lifetime", expiresAt: null },

  "Phantomware-TempSpoofer-Lifetime-29483-6617": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-87015-4429": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-51672-9038": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-73904-1286": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-18295-7743": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-66531-2509": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-90347-6182": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-45719-3395": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-12863-8471": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-59240-7618": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-34178-2056": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-77456-9902": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-21904-5367": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-68327-1489": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-95061-3724": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-40782-8640": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-82659-1137": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-13590-7284": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-60814-5593": { type: "lifetime", expiresAt: null },
"Phantomware-TempSpoofer-Lifetime-79263-4470": { type: "lifetime", expiresAt: null },

  "Phantomware-TempSpoofer-Onetime-58392-1746": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-10487-6392": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-77261-5083": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-33958-8124": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-91503-2276": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-48627-9901": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-65014-3748": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-29763-5419": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-83125-6602": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-47298-1187": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-56931-8044": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-20376-4495": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-74819-9320": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-11654-2758": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-90237-6813": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-36580-1479": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-62491-5532": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-88972-3006": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-45106-7294": { type: "onetime", expiresAt: null },
"Phantomware-TempSpoofer-Onetime-77028-9651": { type: "onetime", expiresAt: null },

  "Phantomware-PermSpoofer-Onetime-91837-4402": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-57294-1836": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-34018-7795": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-86425-9913": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-12976-5584": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-70539-2461": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-48362-8709": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-25671-3348": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-99740-6215": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-61823-9074": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-37290-1456": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-84156-6620": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-20983-7781": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-56410-3327": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-73625-8849": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-45178-9906": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-68024-1139": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-92471-5568": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-31865-2470": { type: "onetime", expiresAt: null },
"Phantomware-PermSpoofer-Onetime-77209-6391": { type: "onetime", expiresAt: null },

  "Phantomware-PermSpoofer-Lifetime-68321-4479": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-90574-1186": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-24790-6632": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-81436-5590": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-39218-7704": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-76105-2348": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-52863-9917": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-17042-6845": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-94627-3321": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-63580-1094": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-28491-7752": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-70936-4481": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-41875-2639": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-83209-9905": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-56124-1478": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-97340-6822": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-12683-5547": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-65572-3310": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-89014-7763": { type: "lifetime", expiresAt: null },
"Phantomware-PermSpoofer-Lifetime-34768-2295": { type: "lifetime", expiresAt: null },

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
"PhantomWare-AIcheat-1072-9644": { type: "lifetime", expiresAt: null },
  
    "21Services-1Day-NoLagg-48392-1746": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-90517-6382": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-27184-5903": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-84620-7319": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-19375-4086": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-56204-9173": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-70418-2569": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-38951-6420": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-92864-1057": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-14670-8392": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-67093-2841": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-41528-9064": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-89230-5178": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-53819-7604": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-20486-3957": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-78195-0426": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-35972-6814": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-62408-9531": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-97041-3285": { type: "1day", expiresAt: now + 24*3600*1000 },
  "21Services-1Day-NoLagg-18653-7490": { type: "1day", expiresAt: now + 24*3600*1000 },

  // 1Week keys
  "21Services-1Week-NoLagg-57320-9416": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-80461-2379": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-29684-7501": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-91572-4083": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-43709-8265": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-16854-3097": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-74290-6518": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-35017-9842": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-69128-5730": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-82463-1905": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-50974-3681": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-18735-6429": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-96320-7048": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-27849-5316": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-64095-8172": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-71536-2094": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-43268-9751": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-85019-4637": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-39672-1805": { type: "1week", expiresAt: now + 7*24*3600*1000 },
  "21Services-1Week-NoLagg-12487-6983": { type: "1week", expiresAt: now + 7*24*3600*1000 },

  // Lifetime keys
  "21Services-Lifetime-NoLagg-69042-5731": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-41895-2067": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-73516-8490": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-28047-3916": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-96413-7508": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-15784-6329": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-80329-4175": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-52690-1483": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-74952-8604": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-39271-5046": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-68104-2379": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-90486-7152": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-23859-9460": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-57014-3827": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-81693-2504": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-14960-7382": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-47285-6910": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-65831-4209": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-79106-8345": { type: "lifetime", expiresAt: null },
  "21Services-Lifetime-NoLagg-30578-1674": { type: "lifetime", expiresAt: null },

  "PhantomWare-FortniteExternal-48271-5934": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-90736-1842": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-13589-7720": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-62490-3157": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-77814-9063": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-25063-4819": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-99107-2645": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-34682-7190": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-58041-8326": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-71295-4408": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-86320-1579": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-42976-6083": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-17458-3921": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-60533-8472": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-93841-2506": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-26719-7348": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-81462-5097": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-39075-1684": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-55628-9731": { type: "lifetime", expiresAt: null },
"PhantomWare-FortniteExternal-72104-6859": { type: "lifetime", expiresAt: null }

};

// ── Helper: send discord webhook ─────────────────────────────
async function sendWebhook(payload) {
    try {
        await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (e) {}
}

// ── Root ─────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.send('PhantomWare Key Server is running.');
});

// ── Validate key (MERGED - no duplicate) ─────────────────────
// ── Validate key (UPDATED) ─────────────────────
app.post('/validate-key', (req, res) => {
    // 1. Destructure the new discord fields sent from the C++ loader
    const { key, hwid, bind, discordUsername, discordId } = req.body;
    
    if (!key || typeof key !== 'string') return res.status(400).json({ valid: false, message: "Key missing or invalid." });
    if (!hwid || typeof hwid !== 'string') return res.status(400).json({ valid: false, message: "HWID missing or invalid." });
    
    const record = keyDB[key];
    if (!record) return res.json({ valid: false, message: "Key not found." });
    
    // NEW LOGIC: Start expiration exactly when the key is first activated!
    if (record.type !== 'lifetime' && !record.boundHWID && bind) {
        let duration = 0;
        if (record.type === '1day') duration = 24 * 3600 * 1000;
        else if (record.type === '1week') duration = 7 * 24 * 3600 * 1000;
        else if (record.type === '1month') duration = 30 * 24 * 3600 * 1000;
        
        // Overwrite the initial startup timer to start from precisely *now*
        record.expiresAt = Date.now() + duration; 
    }

    // Check expiration timer
    if (record.type !== 'lifetime' && Date.now() > record.expiresAt)
        return res.json({ valid: false, message: "Key expired." });
        
    // HWID Binding Check
    if (!record.boundHWID) {
        if (bind === true) record.boundHWID = hwid;
        else return res.json({ valid: true, hwidLocked: false, message: "Key valid but not yet bound." });
    } else if (record.boundHWID !== hwid) {
        return res.json({ valid: false, hwidLocked: true, message: "HWID does not match." });
    }
    
    // 2. Discord Linkage Feature: Merge this key to their Discord Account dynamically
    if (discordUsername && bind) {
        if (!userDB[discordUsername]) {
            userDB[discordUsername] = { 
                passwordHash: discordId, 
                key: key, 
                hwid: hwid 
            };
        } else {
            userDB[discordUsername].key = key;
            userDB[discordUsername].hwid = hwid;
        }
        record.discordUsername = discordUsername;
    }

    activeSessions.delete(hwid);
    activeSessions.add(hwid);
    setTimeout(() => activeSessions.delete(hwid), 5 * 60 * 1000);

    logIP(req, 'auto-login', hwid, key, `validate (${discordUsername || 'Unlinked'})`); 

    return res.json({
        valid: true,
        hwidLocked: true,
        message: "Key valid and HWID verified.",
        type: record.type,
        boundHWID: record.boundHWID,
    });
});

// ── Auth (signup/login) ───────────────────────────────────────
app.post('/auth', (req, res) => {
    const { username, password, key, hwid, action } = req.body;
    if (!username || typeof username !== 'string') return res.status(400).json({ success: false, message: "Username missing or invalid." });
    if (!password || typeof password !== 'string') return res.status(400).json({ success: false, message: "Password missing or invalid." });
    if (!hwid || typeof hwid !== 'string')         return res.status(400).json({ success: false, message: "HWID missing or invalid." });

    if (action === 'signup') {
        if (!key || typeof key !== 'string') return res.status(400).json({ success: false, message: "Key missing or invalid." });
        if (userDB[username]) return res.json({ success: false, message: "Username already exists." });

        const keyRecord = keyDB[key];
        if (!keyRecord) return res.json({ success: false, message: "Invalid key." });
        if (keyRecord.type !== 'lifetime' && Date.now() > keyRecord.expiresAt) return res.json({ success: false, message: "Key expired." });
        if (keyRecord.boundHWID && keyRecord.boundHWID !== hwid) return res.json({ success: false, message: "Key is already bound to another device." });
        if (!keyRecord.boundHWID) keyRecord.boundHWID = hwid;

        userDB[username] = { passwordHash: password, key, hwid };
        return res.json({ success: true, message: "Signup successful.", key });
    }

    if (bannedHWIDs.has(hwid) || bannedKeys.has(key)) {
    // Send webhook alert
    const webhookBody = {
        embeds: [{
            title: "🚨 Banned User Login Attempt",
            color: 16711680,
            fields: [
                { name: "🖥️ HWID", value: `\`${hwid || 'N/A'}\``, inline: false },
                { name: "🔑 Key",  value: `\`${key  || 'N/A'}\``, inline: false },
                { name: "⏰ Time", value: new Date().toLocaleString(), inline: false }
            ]
        }]
    };
    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody)
    }).catch(() => {});
    return res.json({ success: false, banned: true, message: "You are banned." });
}
    else if (action === 'login') {
        const user = userDB[username];
        if (!user)                    return res.json({ success: false, message: "Username not found." });
        if (user.passwordHash !== password) return res.json({ success: false, message: "Incorrect password." });
        if (user.hwid !== hwid)       return res.json({ success: false, message: "HWID mismatch." });

        const keyRecord = keyDB[user.key];
        if (!keyRecord) return res.json({ success: false, message: "Key no longer valid." });
        if (keyRecord.type !== 'lifetime' && Date.now() > keyRecord.expiresAt) return res.json({ success: false, message: "Key expired." });

          user.lastLogin = new Date().toLocaleString();
    logIP(req, username, hwid, user.key, 'login'); // ← add this

        return res.json({ success: true, message: "Login successful.", key: user.key });
    }
    else {
        return res.status(400).json({ success: false, message: "Invalid action." });
    }
});

// ── Check HWID lock ───────────────────────────────────────────
app.post('/check-hwid-lock', (req, res) => {
    const { key } = req.body;
    if (!key || typeof key !== 'string') return res.status(400).json({ error: "Key missing or invalid." });
    const record = keyDB[key];
    if (!record) return res.json({ hwidLocked: false, message: "Key not found." });
    if (record.boundHWID) return res.json({ hwidLocked: true, boundHWID: record.boundHWID });
    return res.json({ hwidLocked: false, message: "Key is not HWID locked." });
});

// ── Heartbeat ─────────────────────────────────────────────────
app.post('/heartbeat', (req, res) => {
    const { hwid } = req.body;
    if (!hwid) return res.status(400).json({ ok: false });
    activeSessions.delete(hwid);
    activeSessions.add(hwid);
    setTimeout(() => activeSessions.delete(hwid), 5 * 60 * 1000);
    res.json({ ok: true });
});

// ── Replace your existing /admin/key-counts route with this ───

app.post('/admin/key-counts', (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET)
        return res.status(403).json({ success: false, message: "Unauthorized." });

    const counts = {
        fivem:       { day: 0, week: 0, month: 0, lifetime: 0, usedDay: 0, usedWeek: 0, usedMonth: 0, usedLifetime: 0 },
        r6:          { day: 0, week: 0, month: 0, lifetime: 0, usedDay: 0, usedWeek: 0, usedMonth: 0, usedLifetime: 0 },
        tempSpoofer: { onetime: 0, lifetime: 0, usedOnetime: 0, usedLifetime: 0 },
        permSpoofer: { onetime: 0, lifetime: 0, usedOnetime: 0, usedLifetime: 0 }
    };

    for (const [key, record] of Object.entries(keyDB)) {
        const k    = key.toLowerCase();
        const t    = record.type;
        const used = !!record.boundHWID;
        const expired = t !== 'lifetime' && t !== 'onetime' && record.expiresAt && Date.now() > record.expiresAt;

        // Skip expired & unbound keys (they're just dead stock, not useful to show)
        if (expired && !used) continue;

        // ── Bucket matching ───────────────────────────────────
        if (k.includes('phantomware-fivem')) {
            if (t === '1day')        { used ? counts.fivem.usedDay++      : counts.fivem.day++;      }
            else if (t === '1week')  { used ? counts.fivem.usedWeek++     : counts.fivem.week++;     }
            else if (t === '1month') { used ? counts.fivem.usedMonth++    : counts.fivem.month++;    }
            else if (t === 'lifetime'){ used ? counts.fivem.usedLifetime++ : counts.fivem.lifetime++; }
        }
        else if (k.includes('phantomware-r6')) {
            if (t === '1day')        { used ? counts.r6.usedDay++      : counts.r6.day++;      }
            else if (t === '1week')  { used ? counts.r6.usedWeek++     : counts.r6.week++;     }
            else if (t === '1month') { used ? counts.r6.usedMonth++    : counts.r6.month++;    }
            else if (t === 'lifetime'){ used ? counts.r6.usedLifetime++ : counts.r6.lifetime++; }
        }
        else if (k.includes('tempspoofer')) {
            if (t === 'onetime')      { used ? counts.tempSpoofer.usedOnetime++  : counts.tempSpoofer.onetime++;  }
            else if (t === 'lifetime'){ used ? counts.tempSpoofer.usedLifetime++ : counts.tempSpoofer.lifetime++; }
        }
        else if (k.includes('permspoofer')) {
            if (t === 'onetime')      { used ? counts.permSpoofer.usedOnetime++  : counts.permSpoofer.onetime++;  }
            else if (t === 'lifetime'){ used ? counts.permSpoofer.usedLifetime++ : counts.permSpoofer.lifetime++; }
        }
    }

    res.json({ success: true, ...counts });
});

// ── User logout event ─────────────────────────────────────────
app.post('/user-logout', (req, res) => {
    const { username, hwid, key } = req.body;
    if (!username || !hwid) return res.status(400).json({ ok: false });

    sendWebhook({
        embeds: [{
            title: "🔴 User Offline",
            color: 15158332,
            fields: [
                { name: "👤 Username", value: username,      inline: true },
                { name: "🕐 Time",     value: new Date().toLocaleString(), inline: true },
                { name: "🔑 Key",      value: `\`${key}\``,  inline: false },
                { name: "🖥️ HWID",     value: `\`${hwid}\``, inline: false }
            ],
            footer: { text: "PhantomWare Loader" }
        }]
    });

    res.json({ ok: true });
});

// ── Track key usage ───────────────────────────────────────────
app.post('/track-key-usage', (req, res) => {
    const { key, hwid } = req.body;
    if (!key || !hwid) return res.status(400).json({ ok: false });

    if (!keyUsageDB[key])
        keyUsageDB[key] = { useCount: 0, hwids: [] };

    keyUsageDB[key].useCount++;
    if (!keyUsageDB[key].hwids.includes(hwid))
        keyUsageDB[key].hwids.push(hwid);

    res.json({ ok: true });
});

// ── Key stats (admin) ─────────────────────────────────────────
app.post('/admin/key-stats', (req, res) => {
    const { key, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });

    if (!key) {
        const stats = Object.entries(keyUsageDB).map(([k, v]) => ({
            key: k, useCount: v.useCount, uniqueHWIDs: v.hwids.length, hwids: v.hwids
        }));
        return res.json({ success: true, stats });
    }

    const stat = keyUsageDB[key];
    if (!stat) return res.json({ success: false, message: "No data for this key." });
    return res.json({ success: true, key, useCount: stat.useCount, uniqueHWIDs: stat.hwids.length, hwids: stat.hwids });
});

// ── Ban ───────────────────────────────────────────────────────
app.post('/admin/ban', (req, res) => {
    const { hwid, key, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (hwid) bannedHWIDs.add(hwid);
    if (key)  bannedKeys.add(key);
    return res.json({ success: true, message: "Banned successfully." });
});

// ── Unban ─────────────────────────────────────────────────────
app.post('/admin/unban', (req, res) => {
    const { hwid, key, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (hwid) bannedHWIDs.delete(hwid);
    if (key)  bannedKeys.delete(key);
    return res.json({ success: true, message: "Unbanned successfully." });
});

// ── Check ban ─────────────────────────────────────────────────
app.post('/check-ban', (req, res) => {
    const { hwid, key } = req.body;
    if (bannedHWIDs.has(hwid) || bannedKeys.has(key))
        return res.json({ banned: true, message: "You have been banned from PhantomWare." });
    return res.json({ banned: false });
});

// ── Admin add key ─────────────────────────────────────────────
app.post('/admin/add-key', (req, res) => {
    const { key, type, expiresAt } = req.body;
    if (!key || typeof key !== 'string') return res.status(400).json({ success: false, message: "Key missing or invalid." });
    keyDB[key] = { type: type || 'lifetime', boundHWID: null, expiresAt: expiresAt || null };
    return res.json({ success: true, message: "Key added successfully." });
});

// ── Announcement ──────────────────────────────────────────────
let g_announcement = { title: '', message: '' };

app.get('/announcement', (req, res) => {
    res.json(g_announcement);
});

app.post('/admin/announcement', (req, res) => {
    const { title, message, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    g_announcement = { title: title || '', message: message || '' };
    return res.json({ success: true });
});

// ── Maintenance mode ──────────────────────────────────────────
let g_maintenance = { enabled: false, message: '' };

app.get('/maintenance', (req, res) => {
    res.json(g_maintenance);
});

app.post('/admin/maintenance', (req, res) => {
    const { enabled, message, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    g_maintenance = { enabled: !!enabled, message: message || '' };
    return res.json({ success: true });
});

// ── Ban count ─────────────────────────────────────────────────
app.post('/admin/ban-count', (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    res.json({ count: bannedHWIDs.size + bannedKeys.size });
});

app.post('/report-version', (req, res) => {
    const { hwid, username, version } = req.body;
    if (!hwid || !version) return res.status(400).json({ ok: false });
    userVersionDB[hwid] = {
        version,
        username: username || 'Unknown',
        lastSeen: new Date().toLocaleString()
    };
    res.json({ ok: true });
});

app.post('/admin/user-versions', (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    const list = Object.entries(userVersionDB).map(([hwid, data]) => ({
        hwid, ...data
    }));
    res.json({ success: true, users: list });
});

// ── Direct messages ───────────────────────────────────────────
let directMessages = {}; // { hwid: { title, message } }

app.post('/admin/send-message', (req, res) => {
    const { hwid, title, message, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (!hwid || !message) return res.status(400).json({ success: false, message: "HWID and message required." });
    directMessages[hwid] = { title: title || 'PhantomWare', message };
    res.json({ success: true, message: "Message queued for user." });
});

app.post('/check-message', (req, res) => {
    const { hwid } = req.body;
    if (!hwid) return res.status(400).json({ ok: false });
    const msg = directMessages[hwid];
    if (msg) {
        delete directMessages[hwid]; // delete after delivery
        return res.json({ hasMessage: true, title: msg.title, message: msg.message });
    }
    res.json({ hasMessage: false });
});

app.post('/admin/reset-hwid', (req, res) => {
    const { key, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (!key) return res.status(400).json({ success: false, message: "Key required." });
    if (!userDB[key]) return res.json({ success: false, message: "Key not found." });
    userDB[key].hwid = null;
    res.json({ success: true, message: `HWID reset for key ${key}. User can now log in on a new PC.` });
});

// ── Revoke key ────────────────────────────────────────────────
app.post('/admin/revoke-key', (req, res) => {
    const { key, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (!key) return res.status(400).json({ success: false, message: "Key required." });
    if (!userDB[key]) return res.json({ success: false, message: "Key not found." });
    delete userDB[key];
    delete keyUsageDB[key];
    bannedKeys.delete(key);
    res.json({ success: true, message: `Key ${key} has been permanently revoked.` });
});

// ── Add new key ───────────────────────────────────────────────
app.post('/admin/add-key', (req, res) => {
    const { key, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    if (!key) return res.status(400).json({ success: false, message: "Key required." });
    if (userDB[key]) return res.json({ success: false, message: "Key already exists." });
    userDB[key] = { hwid: null, username: null, createdAt: new Date().toLocaleString() };
    res.json({ success: true, message: `Key ${key} added successfully.` });
});

// ── Full ban list ─────────────────────────────────────────────
app.post('/admin/ban-list', (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    res.json({
        success: true,
        bannedHWIDs: [...bannedHWIDs],
        bannedKeys:  [...bannedKeys]
    });
});

app.post('/key-info', (req, res) => {
    const key = (req.body.key || '').trim();
    if (!key) return res.status(400).json({ success: false });

    // Search keyDB (case insensitive)
    const actualKey = Object.keys(keyDB).find(k => k.toLowerCase() === key.toLowerCase());
    if (!actualKey) return res.json({ success: false, message: 'Key not found.' });

    const keyData = keyDB[actualKey];
    const usage   = keyUsageDB[actualKey] || { useCount: 0, hwids: [] };

    // Find username from userDB by matching key
    const userEntry = Object.entries(userDB).find(([, u]) => u.key === actualKey);
    const username  = userEntry ? userEntry[0] : 'Never logged in';

    res.json({
        success:    true,
        type:       keyData.type || 'lifetime',
        hwid:       keyData.boundHWID ? '🔒 Locked' : '🔓 Unlocked',
        uses:       usage.useCount     || 0,
        hwids:      usage.hwids.length || 0,
        playtime:   userEntry ? (userEntry[1].playtime   || 0) : 0,
        injections: userEntry ? (userEntry[1].injections || 0) : 0,
        lastLogin:  userEntry ? (userEntry[1].lastLogin  || 'Never') : 'Never',
        username:   username
    });
});

// ── Cheat status ──────────────────────────────────────────────
let g_cheatStatus = { status: 'undetected', message: 'All systems operational', updatedAt: new Date().toLocaleString() };

app.get('/cheat-status', (req, res) => {
    res.json(g_cheatStatus);
});

app.post('/admin/cheat-status', (req, res) => {
    const { status, message, adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    g_cheatStatus = {
        status:    status || 'undetected',
        message:   message || '',
        updatedAt: new Date().toLocaleString()
    };
    // Send webhook alert
    const colors  = { undetected: 3066993, updating: 16776960, detected: 16711680 };
    const emojis  = { undetected: '✅', updating: '🔧', detected: '🚨' };
    sendWebhook({
        embeds: [{
            title: `${emojis[status] || '⚡'} Cheat Status Changed`,
            color: colors[status] || 9807270,
            fields: [
                { name: 'Status',  value: status.toUpperCase(),          inline: true },
                { name: 'Message', value: message || 'No message',       inline: true },
                { name: 'Time',    value: new Date().toLocaleString(),    inline: false }
            ],
            footer: { text: 'PhantomWare Admin' }
        }]
    });
    res.json({ success: true });
});

// ── IP logging ────────────────────────────────────────────────
let ipLogDB = []; // [{ ip, username, hwid, key, time, action }]

function logIP(req, username, hwid, key, action) {
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
             || req.socket?.remoteAddress
             || 'Unknown';
    ipLogDB.unshift({ ip, username: username || 'Unknown', hwid: hwid || 'Unknown', key: key || 'Unknown', time: new Date().toLocaleString(), action });
    if (ipLogDB.length > 500) ipLogDB = ipLogDB.slice(0, 500); // keep last 500
}

app.post('/admin/ip-logs', (req, res) => {
    const { adminSecret } = req.body;
    if (adminSecret !== ADMIN_SECRET) return res.status(403).json({ success: false, message: "Unauthorized." });
    res.json({ success: true, logs: ipLogDB });
});
app.listen(PORT, () => {
    console.log(`✅ PhantomWare server running on port ${PORT}`);
});









