const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;
module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEhWbG5kQ3hUSVpJanJtdW9KZFdtUlBMN0NERWF3ay9LQzE1VkwvQmlXWT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUx5WVE0aGNib2NWYlg1aFBsVEx3dlViUUFvQnpwNnlKYnB6TURqdmZtbz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlRFozZExORms3cThFdmQ0WlZYUWFoSjNSdU1UQVFkMHRJSkxMd09GS0gwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJNHdGSEtUb21hV0k4YXVoa3BaYUhTUjEwaHQrV3ZyQ0FoRFZSUTF0NmkwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1NUE4zQVVYUHlpSWVFQXh1NTJHdGhIbXB3Q0FPR0YyWWRzN2MzRS9iMzQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im5WTEprcUYzbE9wRVh1Sk1pdHhqVDQzcEZCa2R5YVhMUUhsbWNpTVJxZ009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ0xkbi9lUVpsc2pSL3hLckNvNWdhbFF3c1dRYzVSNEE3N1I3ek5Qd2hVbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRHJDTFhhRFVNbWpJa2tiOTg2UkZQWFFlK3ZwWXU3bllCWGt1ZmgyeEtRQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImIvL3RUWFZxeFM0N0g1Uy9iSHZpWVBpYXBmM1BmYlN3TWczT3ZiWTFhb2ZDUVRDd283Y3NrcEVCYmJMem1qS01LU01sRE0rT1VpSmh6cFJjam83QWlnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTExLCJhZHZTZWNyZXRLZXkiOiI1d0JCemhNV3ZXYXpUenRCcU9xbityeEYvdjlPYTJBYVRsYmJPbU5vWFRZPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzIsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMiwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJmNnFwRldFelM3ZVdEakFhdjZqYVp3IiwicGhvbmVJZCI6IjZhZWM3ZDJhLTNlNzctNDljOC1iMjQ4LWUxMTkzNTY3MzFmZCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJPcUNrL29kWTFPZXVwZU9NN0hMMUFkNnU5bHM9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiREk1R0FZMHh2bzdwVStZcXdqdkcrUi8va29NPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjJHRzFYTVBTIiwibWUiOnsiaWQiOiIyNzY1NjMxOTg4OToyOUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTXJIMy9jRUVPYit4TGdHR0JvZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiSitRSUt4U1BmWTdZdldVck96VFRaZmRqV2RXQ2xjNHY4QWF3YVMzUDR4WT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiajBvVmdBK1F1MGtWUkZLRTh3OEtvaGdkT0FLVU95VU1OWFZPcStzOURuVWlSN0xtb3BUVzhXTDEwTkRNeHJJeUZUVzhOcVhVQzNlemY4VVNSS0c5Qnc9PSIsImRldmljZVNpZ25hdHVyZSI6Ik5VZlVobEliV1BzalBmaGxHOURsVVo3WmxVVEI2ZnRhOENTcG1DWlVSMEJSbHhKbHBDRmRtd0RPZUdocUgwRXdDSk1RQk9Cd1UxaVlKSHdrNzlMU2h3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjc2NTYzMTk4ODk6MjlAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCU2ZrQ0NzVWozMk8yTDFsS3pzMDAyWDNZMW5WZ3BYT0wvQUdzR2t0eitNVyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyOTE4MzYwNCwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFLWGMifQ==',
    PREFIXES: (process.env.PREFIX || '.').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "Tristan",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "27634624586",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "off",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'on',
    URL: process.env.BOT_MENU_LINKS || 'https://static.animecorner.me/2023/08/op2.jpg',
    MODE: process.env.BOT_MODE || "public",
    PM_PERMIT: process.env.PM_PERMIT || 'off',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || 'recording',
    ADM: process.env.ANTI_DELETE || 'off',
    TZ: process.env.TIME_ZONE || 'Africa/south africa',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech"
        : "postgresql://giftedtech_ke:9BzoUeUQO2owLEsMjz5Vhshva91bxF2X@dpg-crice468ii6s73f1nkt0-a.oregon-postgres.render.com/api_gifted_tech",
    /* new Sequelize({
        dialect: 'sqlite',
        storage: DATABASE_URL,
        logging: false,
    })
    : new Sequelize(DATABASE_URL, {
        dialect: 'postgres',
        ssl: true,
        protocol: 'postgres',
        dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
        },
        logging: false,
    }), */
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
