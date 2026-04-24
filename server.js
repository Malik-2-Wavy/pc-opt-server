require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://anonymousteam0909_db_user:<db_password>@phantomware.dqmqy4a.mongodb.net/?appName=Phantomware";

mongoose.connect(MONGODB_URI)
    .then(() => console.log('🚀 Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Schemas ---
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: String,
    key: String,
    hwid: String,
    discordId: String,
    avatar: String,
    subscriptions: { type: Map, of: Number, default: {} }
});
const User = mongoose.model('User', UserSchema);

const KeySchema = new mongoose.Schema({
    keyString: { type: String, unique: true, required: true },
    type: String,
    expiresAt: Date,
    usedBy: String,
    redeemedAt: Date,
    boundHWID: String
});
const Key = mongoose.model('Key', KeySchema);

const OrderSchema = new mongoose.Schema({
    id: String,
    username: String,
    product: String,
    method: String,
    proof: String,
    status: { type: String, default: 'PENDING' },
    timestamp: { type: Date, default: Date.now },
    generatedKey: String
});
const Order = mongoose.model('Order', OrderSchema);

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const ADMIN_SECRET = 'Jetstrong73$';
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1495138684738076932/6Y6UPI_IqOoH_e9YqBcehOhmt0jAXWZZNW7BtQkr3uXaMqbWuE5qly816VZlCVmAhPcm';

// --- Discord OAuth Config ---
const DISCORD_CLIENT_ID = '1487881232015425797';
const DISCORD_CLIENT_SECRET = 'XJa8MRwO_lrOHxJZzBVWiJXECwTZUJC6'; 
const DISCORD_REDIRECT_URI = 'https://pc-opt-server.onrender.com/auth/discord/callback'; 

// --- Legacy Memory Cache (for seeding/migration only) ---
let userDB = {};
const keyDB = {
    // ── 21Services Optimizer 1day ─────────────────────────────
    "21Services-1day-Optimizer-83429-1745": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-51048-3267": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-29735-8490": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-62894-1753": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-74019-2638": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-91563-4072": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-28375-6901": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-40982-5376": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-17640-8295": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-56213-4780": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-80475-2913": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-32791-0644": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-69852-7134": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-14587-9206": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-45320-6179": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-97164-3823": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-53602-1947": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-82039-7654": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-21486-5093": { type: "1day", expiresAt: null },
    "21Services-1day-Optimizer-67914-2308": { type: "1day", expiresAt: null },

    // ── 21Services Optimizer 1week ────────────────────────────
    "21Services-1Week-Optimizer-49076-1825": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-73510-6942": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-26183-0754": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-95847-3261": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-60739-8425": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-18264-5907": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-47320-8169": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-39587-2401": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-62019-7358": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-87405-1692": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-50832-9471": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-76914-3208": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-34567-0812": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-91824-5736": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-15078-6429": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-46209-3751": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-83954-1207": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-27406-9583": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-58130-4796": { type: "1week", expiresAt: null },
    "21Services-1Week-Optimizer-69321-0857": { type: "1week", expiresAt: null },

    // ── 21Services Optimizer Lifetime ────────────────────────
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

    // ── Phantomware FiveM 1day ────────────────────────────────
    "Phantomware-Fivem-day-75029-1183": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-51938-4402": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-17652-8841": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-28461-5593": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-42018-3376": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-66102-7754": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-89341-2205": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-30577-6619": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-74820-1139": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-91266-5501": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-43289-7713": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-60815-3342": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-18944-9982": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-72330-4417": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-55412-8826": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-86729-1108": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-99021-6653": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-27653-4470": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-63184-7738": { type: "1day", expiresAt: null },
    "Phantomware-Fivem-day-44801-2299": { type: "1day", expiresAt: null },

    // ── Phantomware FiveM 1week ───────────────────────────────
    "Phantomware-Fivem-week-19384-6621": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-28490-7735": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-90214-6630": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-73188-1029": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-66302-9941": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-55021-3378": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-81473-6652": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-22791-8804": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-94018-7730": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-38264-5519": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-67593-1102": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-12048-8873": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-88912-4476": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-53029-6618": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-76102-3389": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-29843-9920": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-41758-7733": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-60291-5540": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-84513-2217": { type: "1week", expiresAt: null },
    "Phantomware-Fivem-week-33480-7788": { type: "1week", expiresAt: null },

    // ── Phantomware FiveM 1month ──────────────────────────────
    "Phantomware-Fivem-month-58291-7392": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-66173-2948": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-34827-1195": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-49560-7732": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-15739-4482": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-72014-8831": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-83925-6610": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-21478-5529": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-99301-7742": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-44182-9305": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-67839-1120": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-30295-6674": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-88412-5590": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-51902-3381": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-76018-9924": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-22579-4410": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-91834-7702": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-63710-1189": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-48266-5537": { type: "1month", expiresAt: null },
    "Phantomware-Fivem-month-10984-8823": { type: "1month", expiresAt: null },

    // ── Phantomware FiveM Lifetime ────────────────────────────
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

    // ── Phantomware FortnitePublic 1day ────────────────────────────────
    "Phantomware-FortnitePublic-Day-48291-7391": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-19384-6627": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-75012-4483": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-62844-9901": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-31577-2846": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-90431-5512": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-66728-1935": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-84219-7743": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-22914-6008": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-57103-9182": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-33488-7124": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-78561-4409": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-91047-2831": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-46832-9917": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-15293-6674": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-67390-5048": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-24861-8305": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-99713-2216": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-53672-1198": { type: "1day", expiresAt: null },
    "Phantomware-FortnitePublic-Day-88420-7450": { type: "1day", expiresAt: null },

    // ── Phantomware FortnitePublic 1week ───────────────────────────────
    "Phantomware-FortnitePublic-Week-71384-2291": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-54920-8834": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-10293-6618": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-87651-3307": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-39012-7782": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-66144-1920": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-24780-5531": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-91823-4066": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-50217-7349": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-66493-8172": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-73502-4418": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-18934-2205": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-42718-6693": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-85091-7741": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-31247-9855": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-79961-1042": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-26884-5327": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-93150-6679": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-44563-1180": { type: "1week", expiresAt: null },
    "Phantomware-FortnitePublic-Week-60012-9017": { type: "1week", expiresAt: null },

    // ── Phantomware FortnitePublic 1month ──────────────────────────────
    "Phantomware-FortnitePublic-Month-88123-7740": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-39218-6611": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-75049-2238": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-16483-9022": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-99501-3487": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-48372-1149": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-24098-7755": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-67219-5308": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-13844-9093": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-72190-6652": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-85734-4120": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-36017-7824": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-54129-1196": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-99283-8741": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-20461-5533": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-78315-6670": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-45920-2184": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-61783-9001": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-83410-4412": { type: "1month", expiresAt: null },
    "Phantomware-FortnitePublic-Month-27864-9935": { type: "1month", expiresAt: null },

    // ── Phantomware FortnitePublic Lifetime ────────────────────────────
    "Phantomware-FortnitePublic-Lifetime-99123-4401": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-48219-7730": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-73584-1189": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-65012-9942": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-11893-5577": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-82741-6630": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-90472-3318": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-31908-7752": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-56613-2009": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-74285-9981": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-28374-4410": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-65120-7734": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-43091-6682": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-98217-5513": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-10562-8890": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-77439-2204": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-61825-3347": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-39011-7778": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-84562-1120": { type: "lifetime", expiresAt: null },
    "Phantomware-FortnitePublic-Lifetime-27109-6604": { type: "lifetime", expiresAt: null },

    // ── Phantomware FortniteAi 1day ────────────────────────────────
    "Phantomware-FortniteAi-Day-59182-3347": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-84320-7712": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-10274-5589": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-77641-2203": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-33095-8841": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-92841-6617": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-61420-9935": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-20773-4418": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-88901-7754": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-47192-1186": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-55384-6620": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-76421-3379": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-19563-8822": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-63820-5591": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-90218-7743": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-28744-1105": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-73109-6678": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-42086-9982": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-85933-2241": { type: "1day", expiresAt: null },
    "Phantomware-FortniteAi-Day-16420-7719": { type: "1day", expiresAt: null },

    // ── Phantomware FortniteAi 1week ───────────────────────────────
    "Phantomware-FortniteAi-Week-30984-5521": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-88421-3370": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-77129-9934": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-56012-4481": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-19385-7722": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-84720-1193": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-66421-8805": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-28574-6671": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-99821-4416": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-73166-2204": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-41209-7753": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-65328-9921": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-20983-3340": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-87512-6619": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-54011-8832": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-72104-1108": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-36642-7740": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-91827-5529": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-48033-6675": { type: "1week", expiresAt: null },
    "Phantomware-FortniteAi-Week-60219-9940": { type: "1week", expiresAt: null },

    // ── Phantomware FortniteAi 1month ──────────────────────────────
    "Phantomware-FortniteAi-Month-78122-3304": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-55409-7718": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-90384-6621": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-12847-5590": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-66721-1183": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-49018-8842": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-83214-3375": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-21566-9928": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-70931-7741": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-38104-2209": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-64228-5537": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-91832-6670": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-50391-4415": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-77420-8891": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-26673-1104": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-85120-7756": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-43091-3348": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-69722-9920": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-18477-6612": { type: "1month", expiresAt: null },
    "Phantomware-FortniteAi-Month-92563-4480": { type: "1month", expiresAt: null },

    // ── Phantomware FortniteAi Lifetime ────────────────────────────
    "Phantomware-FortniteAi-Lifetime-88214-7731": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-44109-2206": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-76328-9914": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-51200-6673": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-99814-3341": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-20783-7750": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-65421-8820": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-38177-1195": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-92044-5518": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-73310-4402": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-16582-9943": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-84219-6617": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-50933-2238": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-77402-8890": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-31655-1107": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-68740-7752": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-24891-5520": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-93014-6678": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-57122-4419": { type: "lifetime", expiresAt: null },
    "Phantomware-FortniteAi-Lifetime-80431-9929": { type: "lifetime", expiresAt: null },

    // ── Phantomware R6 1day ───────────────────────────────────
    "Phantomware-R6-day-91347-5521": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-48215-7730": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-75092-1184": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-66128-9943": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-30581-6620": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-89412-3375": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-17263-8801": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-54892-4419": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-73910-2235": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-26483-5508": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-61724-7781": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-42095-3348": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-88931-1107": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-53107-6654": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-27466-9922": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-96518-7712": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-34871-4480": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-70294-6611": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-15839-8825": { type: "1day", expiresAt: null },
    "Phantomware-R6-day-62910-3372": { type: "1day", expiresAt: null },

    // ── Phantomware R6 1week ──────────────────────────────────
    "Phantomware-R6-week-90412-7733": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-66173-2294": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-34890-1188": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-49563-7721": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-15784-4489": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-72019-8830": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-83920-6601": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-21479-5532": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-99300-7741": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-44185-9302": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-67832-1118": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-30290-6671": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-88419-5587": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-51900-3380": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-76011-9920": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-22570-4409": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-91830-7700": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-63712-1187": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-48260-5533": { type: "1week", expiresAt: null },
    "Phantomware-R6-week-10980-8820": { type: "1week", expiresAt: null },

    // ── Phantomware R6 1month ─────────────────────────────────
    "Phantomware-R6-month-57391-7399": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-66273-2958": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-34927-1190": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-49660-7730": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-15839-4492": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-72114-8838": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-84025-6612": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-21578-5520": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-99401-7748": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-44282-9315": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-67939-1130": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-30395-6684": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-88512-5595": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-52002-3391": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-76118-9934": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-22679-4420": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-91934-7712": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-63810-1199": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-48366-5547": { type: "1month", expiresAt: null },
    "Phantomware-R6-month-11084-8833": { type: "1month", expiresAt: null },

    // ── Phantomware R6 Lifetime ───────────────────────────────
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

    // ── Temp Spoofer Lifetime ─────────────────────────────────
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

    // ── Temp Spoofer Onetime ──────────────────────────────────
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

    // ── Perm Spoofer Onetime ──────────────────────────────────
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

    // ── Perm Spoofer Lifetime ─────────────────────────────────
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

    // ── 21Services AR Pack ────────────────────────────────────
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

    // ── 21Services SMG Pack ───────────────────────────────────
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

    // ── 21Services Shotgun Pack ───────────────────────────────
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

    // ── 21Services Fortnite Optimizer Pack ───────────────────
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

    // ── 21Services Build Place Pack ───────────────────────────
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

    // ── 21Services Bullet Drop Pack ──────────────────────────
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

    // ── 21Services Packet Placement Pack ─────────────────────
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

    // ── PhantomWare AI Cheat ──────────────────────────────────
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

    // ── 21Services NoLagg 1day ────────────────────────────────
    "21Services-1Day-NoLagg-48392-1746": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-90517-6382": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-27184-5903": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-84620-7319": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-19375-4086": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-56204-9173": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-70418-2569": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-38951-6420": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-92864-1057": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-14670-8392": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-67093-2841": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-41528-9064": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-89230-5178": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-53819-7604": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-20486-3957": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-78195-0426": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-35972-6814": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-62408-9531": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-97041-3285": { type: "1day", expiresAt: null },
    "21Services-1Day-NoLagg-18653-7490": { type: "1day", expiresAt: null },

    // ── 21Services NoLagg 1week ───────────────────────────────
    "21Services-1Week-NoLagg-57320-9416": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-80461-2379": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-29684-7501": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-91572-4083": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-43709-8265": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-16854-3097": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-74290-6518": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-35017-9842": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-69128-5730": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-82463-1905": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-50974-3681": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-18735-6429": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-96320-7048": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-27849-5316": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-64095-8172": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-71536-2094": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-43268-9751": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-85019-4637": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-39672-1805": { type: "1week", expiresAt: null },
    "21Services-1Week-NoLagg-12487-6983": { type: "1week", expiresAt: null },

    // ── 21Services NoLagg Lifetime ────────────────────────────
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

    // ── PhantomWare Fortnite External ────────────────────────
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
    "PhantomWare-FortniteExternal-72104-6859": { type: "lifetime", expiresAt: null },
};

let bannedHWIDs = new Set();
let bannedKeys = new Set();
let activeSessions = new Set();
let pendingOrders = [];

// ── PERSISTENCE ───────────────────────────────────────────────
const seedDatabase = async () => {
    try {
        const keyCount = await Key.countDocuments();
        if (keyCount === 0) {
            console.log('🌱 Seeding database with initial keys...');
            const keysToInsert = Object.keys(keyDB).map(k => ({
                keyString: k,
                type: keyDB[k].type,
                expiresAt: keyDB[k].expiresAt
            }));
            await Key.insertMany(keysToInsert);
            console.log(`✅ Seeded ${keysToInsert.length} keys.`);
        }
    } catch (e) { console.error('Failed to seed database:', e.message); }
};

seedDatabase();

const findUser = async (name) => {
    if (!name) return null;
    return await User.findOne({ username: new RegExp('^' + name + '$', 'i') });
};

// ── WEB ROUTES ────────────────────────────────────────────────
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'phantomware.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// ── DISCORD AUTH CALLBACK ────────────────────────────────────
app.get('/auth/discord/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) return res.send("No code provided.");
    try {
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: DISCORD_CLIENT_ID, client_secret: DISCORD_CLIENT_SECRET,
                code, grant_type: 'authorization_code',
                redirect_uri: DISCORD_REDIRECT_URI, scope: 'identify email'
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const tokenData = await tokenResponse.json();
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { authorization: `Bearer ${tokenData.access_token}` }
        });
        const discordUser = await userResponse.json();
        const username = discordUser.username;
        const discordId = discordUser.id;
        const avatar = discordUser.avatar ? `https://cdn.discordapp.com/avatars/${discordId}/${discordUser.avatar}.png` : null;

        let user = await findUser(username);
        if (!user) {
            user = new User({ username, passwordHash: `discord_${discordId}`, key: 'discord_linked', hwid: null, discordId, avatar });
        } else {
            user.discordId = discordId;
            if (avatar) user.avatar = avatar;
        }
        await user.save();
        
        res.send(`
            <script>
                localStorage.setItem('phantom_user', '${username}');
                localStorage.setItem('phantom_key', '${user.key}');
                ${avatar ? `localStorage.setItem('avatar_${username}', '${avatar}');` : ''}
                window.location.href = '/dashboard.html';
            </script>
        `);
    } catch (e) { console.error(e); res.send("Discord authentication failed."); }
});

// ── AUTH (signup / login) ─────────────────────────────────────
app.post('/auth', async (req, res) => {
    const { username, password, key, hwid, action } = req.body;
    const isWeb = hwid && hwid.startsWith('WEB-');
    
    if (action === 'signup') {
        const existing = await findUser(username);
        if (existing) return res.json({ success: false, message: "Username already exists." });
        
        const newUser = new User({ 
            username, 
            passwordHash: password, 
            key: key || 'no_key', 
            hwid: isWeb ? null : hwid, 
            subscriptions: {} 
        });
        await newUser.save();
        return res.json({ success: true, message: "Signup successful!", key: newUser.key });
    }

    if (action === 'login') {
        const user = await findUser(username);
        if (!user) {
            return res.json({ success: false, message: "Account not found. Please register first." });
        }
        if (user.passwordHash !== password) return res.json({ success: false, message: "Incorrect password." });
        
        if (!user.subscriptions) user.subscriptions = new Map();

        if (hwid && !hwid.startsWith('WEB-')) {
            if (!user.hwid || user.hwid !== hwid) {
                user.hwid = hwid; 
                await user.save();
            }
        }
        
        return res.json({ success: true, message: "Login successful.", key: user.key, subscriptions: Object.fromEntries(user.subscriptions) });
    }
    return res.status(400).json({ success: false, message: "Invalid action." });
});

app.post('/update-password', async (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    const user = await findUser(username);
    if (!user || user.passwordHash !== currentPassword) return res.json({ success: false, message: "Authentication failed." });
    
    user.passwordHash = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated!" });
});

app.post('/redeem', async (req, res) => {
    const { username, key, hwid } = req.body;
    const user = await findUser(username);
    if (!user) return res.json({ success: false, message: "User not found." });

    if (user.hwid && hwid && !hwid.startsWith('WEB-') && user.hwid !== hwid) {
        user.hwid = hwid;
    }

    const keyData = await Key.findOne({ keyString: key });
    if (!keyData) return res.json({ success: false, message: "Invalid license key." });
    if (keyData.usedBy) return res.json({ success: false, message: "Key already redeemed." });

    let product = "Unknown";
    const kLow = key.toLowerCase();
    if (kLow.includes("fivem")) product = "FiveM";
    else if (kLow.includes("fortnitepublic")) product = "Fortnite Public";
    else if (kLow.includes("fortniteai")) product = "Fortnite Ai";
    else if (kLow.includes("r6")) product = "Rainbow Six Siege";
    else if (kLow.includes("optimizer")) product = "Optimizer";
    else if (kLow.includes("permspoofer")) product = "Perm Spoofer";
    else if (kLow.includes("tempspoofer")) product = "Temp Spoofer";
    else if (kLow.includes("spoofer")) product = "Spoofer";
    else if (kLow.includes("aicheat")) product = "AI Cheat";

    let duration = 0;
    if (keyData.type === "1day") duration = 24 * 60 * 60 * 1000;
    else if (keyData.type === "1week") duration = 7 * 24 * 60 * 60 * 1000;
    else if (keyData.type === "1month") duration = 30 * 24 * 60 * 60 * 1000;
    else if (keyData.type === "lifetime") duration = -1;
    else if (keyData.type === "onetime") duration = -2;

    if (!user.subscriptions) user.subscriptions = new Map();
    
    let now = Date.now();
    let expiry = (duration === -1) ? -1 : (duration === -2) ? -2 : now + duration;
    
    if (user.subscriptions.has(product) && user.subscriptions.get(product) !== -1) {
        if (duration !== -1) {
            expiry = Math.max(user.subscriptions.get(product), now) + duration;
        }
    }

    user.subscriptions.set(product, expiry);
    if (!user.hwid && hwid && !hwid.startsWith('WEB-')) user.hwid = hwid;

    keyData.usedBy = username;
    keyData.redeemedAt = new Date();
    keyData.boundHWID = user.hwid;
    
    await Promise.all([user.save(), keyData.save()]);
    res.json({ success: true, message: `Successfully redeemed ${product}!`, subscriptions: Object.fromEntries(user.subscriptions) });
});

app.post('/consume', async (req, res) => {
    const { username, product } = req.body;
    const user = await findUser(username);
    if (!user) return res.json({ success: false, message: "User not found." });

    if (user.subscriptions && user.subscriptions.has(product)) {
        user.subscriptions.delete(product);
        user.markModified('subscriptions');
        await user.save();
    }
    res.json({ success: true, message: "Product consumed.", subscriptions: Object.fromEntries(user.subscriptions) });
});

app.post('/validate-key', async (req, res) => {
    const { key, hwid, bind } = req.body;
    const record = await Key.findOne({ keyString: key });
    if (!record) return res.json({ valid: false, message: "Key not found." });
    if (record.boundHWID && record.boundHWID !== hwid) return res.json({ valid: false, message: "HWID mismatch." });
    if (!record.boundHWID && bind) { 
        record.boundHWID = hwid; 
        await record.save(); 
    }
    return res.json({ valid: true, message: "Key verified.", type: record.type });
});

app.post('/submit-order', async (req, res) => {
    const newOrder = new Order({ id: `ORD-${Date.now()}`, ...req.body });
    await newOrder.save();
    res.json({ success: true, orderId: newOrder.id });
});

// ── ADMIN ROUTES ──────────────────────────────────────────────
app.get('/admin/orders', async (req, res) => {
    if (req.headers['admin-secret'] !== ADMIN_SECRET) return res.status(403).send("Unauthorized");
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
});

app.post('/admin/approve-order', async (req, res) => {
    if (req.headers['admin-secret'] !== ADMIN_SECRET) return res.status(403).send("Unauthorized");
    const { orderId } = req.body;
    const order = await Order.findOne({ id: orderId });
    if (!order) return res.json({ success: false, message: "Order not found." });

    const newKeyStr = `Phantomware-${order.product.replace(/ /g, '')}-Lifetime-${Math.floor(Math.random()*90000+10000)}-${Math.floor(Math.random()*9000+1000)}`;
    const newKey = new Key({ keyString: newKeyStr, type: "lifetime" });
    
    order.status = 'APPROVED';
    order.generatedKey = newKeyStr;
    
    await Promise.all([newKey.save(), order.save()]);
    res.json({ success: true, key: newKeyStr });
});

app.post('/admin/add-subscription', async (req, res) => {
    if (req.headers['admin-secret'] !== ADMIN_SECRET) return res.status(403).send("Unauthorized");
    const { username, product, durationDays } = req.body; 
    const user = await findUser(username);
    if (!user) return res.json({ success: false, message: "User not found." });
    
    if (!user.subscriptions) user.subscriptions = new Map();
    let expiry = (durationDays === -1) ? -1 : Date.now() + (durationDays * 24 * 60 * 60 * 1000);
    
    user.subscriptions.set(product, expiry);
    await user.save();
    res.json({ success: true, message: `Added ${product} to ${username}` });
});

app.listen(PORT, () => {
    console.log(`✅ PhantomWare server running on port ${PORT}`);
});
