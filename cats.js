import fetch from 'node-fetch';
import fs from 'fs';

function getToken(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}
    
function number(number, decimals = 0, decPoint = ',', thousandsSep = '.') {
    const n = parseFloat(number).toFixed(decimals);
    const parts = n.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    return parts.join(decPoint);
}

async function getCURL(url, method = 'GET', headers = {}, body = null, returnJson = true) {
    const options = {
        method,
        headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = returnJson ? await response.json() : await response.text();
    
    return data;
}

(async () => {
    const dataList = getToken('dataAkun.txt');
    
    console.log(`-------------------------------`);
    console.log(` |            MENU            | `);
    console.log(` [  CATS.BOT AUTO CLEAR TASK  ] `);
    console.log(`-------------------------------`);
    console.log();

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    console.log('[.] MENJALANKAN AUTO CLEAR TASK, DELAY 24 JAM SETELAH CEK ' + dataList.length + ' AKUN...\n');
    while (true) {
        for (let i = 0; i < dataList.length; i += 1) {
            const batch = dataList.slice(i, i + 1);
            const batchPromises = batch.map(async (token, batchIndex) => {
            const no = i + batchIndex + 1;
            // Parsing query string menggunakan URLSearchParams
            const params = new URLSearchParams(token);
            const user = JSON.parse(decodeURIComponent(params.get('user')));
            let logMessage = `====================================================
[[#${no}] MENGAMBIL DATA AKUN: ${user.username} ]\n`;
            const headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                 'authorization': `tma ${token}`,
                'origin': 'https://api.catshouse.club'
            };
                const infoAkun = await getCURL('https://api.catshouse.club/user', 'GET', headers);
                if (infoAkun.name == 'Error') {
                    logMessage += `[x] TOKEN QUERY_ID MOKAD!!\n`;

                } else {
                    logMessage += `
[ #.NAME ] : ${infoAkun.firstName ? infoAkun.firstName : ""} ${infoAkun.lastName ? infoAkun.lastName : ""} ( ${infoAkun.id} )
[ #.BALLANCE ] : ${number(infoAkun.totalRewards)} CATS
[ #.TG AGE ] : ${number(infoAkun.telegramAge)}\n
[*] INFORMASI CLAIM TASK:\n`;

                const infoClaim = await getCURL('https://api.catshouse.club/tasks/user', 'GET', headers);
                if (infoClaim) {
                    if (infoClaim.tasks && Array.isArray(infoClaim.tasks)) {
                        for (const task of infoClaim.tasks) {
                            if (task.completed === false) {
                                // Auto claim untuk setiap tugas
                                try {
                                    const claimTask = await getCURL(`https://api.catshouse.club/tasks/${task.id}/complete`, 'POST', headers, {});
                                    
                                    if (claimTask.success === true) {
                                        const infoAkun = await getCURL('https://api.catshouse.club/user', 'GET', headers);
                                        logMessage += `[#] CLAIM ${task.title.toUpperCase()} GET ${number(task.rewardPoints)} CATS => BERHASIL!! - `;
                                        logMessage += `${number(infoAkun.totalRewards)} CATS\n`;
                                    }else if (claimTask.success === false) {
                                        logMessage += `[#] CLAIM ${task.title.toUpperCase()} GET ${number(task.rewardPoints)} CATS => SKIPP!! NEED JOIN OR MANUAL!!!!\n`;
                                    }
                                } catch (error) {
                                    logMessage += `[!] ERROR CLAIMING TASK ID ${task.id}: ${error.message}\n`;
                                }
                            }
                            
                        }
                
                logMessage += `\n[#] SEMUA TASK BERHASIL DICLAIM!! MENUNGGU TASK BARU!!\n`;

                    }
                } else if (infoClaim && infoClaim.name === 'Error') {
                    logMessage += `[x] CLAIM TOKEN MOKAD!!!!\n`;
                } else {
                    logMessage += `[x] ERROR!! YGTKTS!!\n`;
                }

                }
                console.log(logMessage);
            });
            await Promise.all(batchPromises);
        }
        console.log(`[${getCurrentTime()}] SEMUA AKUN BERHASIL DIPROSESS, DELAY 24 JAM...`);
        await delay(87000);
        console.clear();
        console.log(`[${getCurrentTime()}] MEMULAI AUTO CLAIM ${dataList.length} AKUN...\n`);
    }
})();

function getCurrentTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };

    const timeFormatter = new Intl.DateTimeFormat('en-GB', options);
    const timeParts = timeFormatter.formatToParts(now);

    const hours = timeParts.find(part => part.type === 'hour').value;
    const minutes = timeParts.find(part => part.type === 'minute').value;
    const seconds = timeParts.find(part => part.type === 'second').value;

    return `${hours}:${minutes}:${seconds}`;
}
