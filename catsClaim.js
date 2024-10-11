import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

function getToken(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        return data.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    } catch (error) {
        console.error(`Error reading token file: ${error.message}`);
        return [];
    }
}

function number(number, decimals = 0, decPoint = ',', thousandsSep = '.') {
    try {
        const n = parseFloat(number).toFixed(decimals);
        const parts = n.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
        return parts.join(decPoint);
    } catch (error) {
        console.error(`Error formatting number: ${error.message}`);
        return number; // return original number if error occurs
    }
}

async function getCURL(url, method = 'GET', headers = {}, body = null, returnJson = true) {
    const options = {
        method,
        headers,
    };

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = returnJson ? await response.json() : await response.text();
        return data;
    } catch (error) {
        console.error(`Error in fetch request to ${url}: ${error.message}`);
        return null; // return null if error occurs
    }
}

async function uploadImage(token, gambarKucingmu) {
    try {
        const data = fs.readFileSync(gambarKucingmu);
        const formBoundary = '------WebKitFormBoundaryFLgADhHmHbsStLay';
    
        const body = Buffer.concat([
            Buffer.from(`--${formBoundary}\r\n`),
            Buffer.from('Content-Disposition: form-data; name="photo"; filename="'+{gambarKucingmu}+'"\r\n'),
            Buffer.from('Content-Type: image/jpeg\r\n\r\n'),
            data,
            Buffer.from(`\r\n--${formBoundary}--\r\n`)
        ]);
    
        const options = {
            method: 'POST',
            headers: {
                'accept-language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
                'authorization': 'tma ' + token,
                'origin': 'https://cats-frontend.tgapps.store',
                'Content-Type': `multipart/form-data; boundary=${formBoundary}`
            },
            body: body
        };
    
        const response = await fetch('https://api.catshouse.club/user/avatar/upgrade', options);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(`Error uploading image: ${error.message}`);
        return null; // return null if error occurs
    }
}

(async () => {
    const dataList = getToken('dataAkun.txt'); // no await needed since getToken is not async
    
    console.log(`-------------------------------`);
    console.log(` |            MENU            | `);
    console.log(` [  CATS.BOT AUTO CLEAR TASK  ] `);
    console.log(`-------------------------------`);
    console.log();

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    console.log('[.] MENJALANKAN AUTO CLEAR TASK, DELAY 24 JAM SETELAH CEK ' + dataList.length + ' AKUN...\n');

    const batchIndex = 0;

    while (true) {
        for (let i = 0; i < dataList.length; i += 1) {
            const no = i + batchIndex + 1;
            const token = dataList[i];
            
            const params = new URLSearchParams(token);
            const user = JSON.parse(decodeURIComponent(params.get('user')));
            try {
            console.log(`====================================================`);
            console.log(`[#${no}] MENGAMBIL DATA AKUN: ${user.username}\n`);

            const headers = {
                'accept-language': 'id,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
                'authorization': `tma ${token}`,
                'origin': 'https://cats-frontend.tgapps.store'
            };
              
                    const gambarKucingmu = 'FOTOKUCINGMU.jpg';
                    const uplaodImge = await uploadImage(token, gambarKucingmu);      
                    // Menangani respons upload 
                    if(uplaodImge){ 
                            if (uplaodImge.message == 'Attempt not allowed') { 
                                console.log(`[!] GAGAL UPLOAD AVATAR!! MASIH DELAY!!\n\nMELANJUTKAN CLEAR TASK...`); 
                            } else { 
                                const rewards = uplaodImge.rewards || 'UNKNOWN'; 
                                console.log(`[#] BERHASIL UPLOAD PHOTO!! GET ${rewards} CATS!!\n\nMELANJUTKAN CLEAR TASK...`); 
                            } 
                        } 
			
            for (let taskId = 1; taskId <= 166; taskId++) {
                
                    const claimTask = await getCURL(`https://api.catshouse.club/tasks/${taskId}/complete`, 'POST', headers, {});
                    if (claimTask && claimTask.success === true) {
                        const infoAkun = await getCURL('https://api.catshouse.club/user', 'GET', headers);
                        console.log(`[#] CLAIM TASK ID ${taskId} => BERHASIL!! - GET ${infoAkun.totalRewards} CATS`);
                    } else if (claimTask && claimTask.success === false) {
                        console.log(`[#] CLAIM TASK ID ${taskId} => SKIPP!! ALREADY CLAIMED!!`);
                    }else if (claimTask && claimTask.name === 'Error') {
                        console.log(`[#] CLAIM TASK ID ${taskId} => SKIPP!! TASK ID INVALID / MANUAL!!`);

                    }
               
            }
        } catch (error) {
            console.error(`Error claiming `);
        }
            await delay(1000);
        }

        await delay(86400000);
    }
})();
