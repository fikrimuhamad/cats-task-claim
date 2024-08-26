# CATS.BOT AUTO CLAIM TASK

## TUTORIAL PEMAKAIAN | LINK BOT: [CATS BOT TELE](https://t.me/catsgang_bot/join?startapp=on1UXn9RF-B0_yUKqqrYC)

### Cara Penggunaan:
1. **Paste Query**: 
   - Paste `Authorization` query Anda pada file `query.txt`.
   - Format file `query.txt` dimulai dengan `user=` diikuti oleh data header otorisasi.
   - Contoh:
     ```txt
     user=your_authorization_token_1
     user=your_authorization_token_2
     ```

2. **Buka CMD**: 
   - Masuk ke direktori tempat file `cats.py` berada. Misalnya:
     ```bash
     cd path/to/your/cats_bot_folder
     ```

3. **Jalankan Script**:
   - Jalankan perintah berikut untuk memulai bot:
     ```bash
     python cats.py
     ```
   - Jika Anda menggunakan Python 3, gunakan perintah ini:
     ```bash
     python3 cats.py
     ```

4. **Install Dependency**: 
   - Jika Anda baru pertama kali menginstall Python atau library, jalankan perintah berikut untuk menginstall library `requests`:
     ```bash
     pip install requests
     ```

5. **Auto Claim & Delay**:
   - Bot akan secara otomatis menjalankan klaim task setiap 24 jam.
   - Jika Anda ingin mengubah durasi delay, silakan edit nilai pada fungsi `time.sleep(86400)` di kode.

### Notes:
- Pastikan Anda sudah memasukkan query dengan benar pada `query.txt`.
- Setiap akun akan diproses secara berurutan, dan klaim task akan dilakukan secara otomatis.
- Script ini akan berjalan terus-menerus dengan interval 24 jam, sesuai dengan delay yang diatur dalam kode.
