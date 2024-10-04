import json
import requests

# Fungsi untuk membaca file query.txt yang berisi header authorization untuk banyak akun
def read_authorizations(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    return [line.strip() for line in lines]

# Fungsi untuk mendapatkan informasi user dan menampilkan data username dan totalRewards
def process_user_info(authorization_header, account_number):
    headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/json",
        "Authorization": f"tma {authorization_header}",
        "Origin": "https://cats-frontend.tgapps.store"
    }

    response = requests.get("https://api.catshouse.club/user", headers=headers)

    if response.status_code == 200:
        data = response.json()
        username = data.get('username')
        total_rewards = data.get('totalRewards')
        print(f"AKUN KE#{account_number} - {username} {total_rewards} CATS")
    else:
        print(f"Error fetching user info for account {account_number}: {response.status_code}")

# Fungsi untuk get daftat / list tasks yabg terdia dan klaim jika belum completed
def process_tasks(authorization_header):
    headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/json",
        "Authorization": f"tma {authorization_header}",
        "Origin": "https://cats-frontend-production.pages.dev"
    }

    response = requests.get("https://api.catshouse.club/tasks/user", headers=headers)

    if response.status_code == 200:
        tasks = response.json().get("tasks", [])
        for task in tasks:
            task_id = task.get('id')
            title = task.get('title')
            reward_points = task.get('rewardPoints')
            completed = task.get('completed')

            # Cek status completed dan klaim jika false
            status = "ALREADY CLAIM!!" if completed else "NOT CLAIMED!!"
            print(f"#ID {task_id} - {title} - GET {reward_points}CATS - {status}")

            if not completed:
                claim_task(authorization_header, task_id)
    else:
        print(f"[!] QUERY LU MOKAD BOSSKU!!")

# Fungsi untuk klaim task yang tersedia
def claim_task(authorization_header, task_id):
    headers = {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, seperti Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
        "Content-Type": "application/json",
        "Authorization": f"tma {authorization_header}",
        "Origin": "https://cats-frontend-production.pages.dev"
    }

    url = f"https://api.catshouse.club/tasks/{task_id}/complete"
    response = requests.post(url, headers=headers, json={})

    if response.status_code == 200:
        result = response.json()
        if 'success' in result and result['success']:
            print("BERHASIL CLAIM!!")
        else:
            print("GAGAL CLAIM / SUDAH DICLAIM SEBELUMNYA!!")
    else:
        # Handling manual claim errors / harus manual claim
        result = response.json()
        if 'name' in result and result['name'] == "Error":
            print("SKIP TASK - MANUAL CLAIM!!")
        else:
            print(f"[!] QUERY LU MOKAD BOSSKU!! ")


# Main function
def main():
    # Baca daftar query yang tersedia dari file query.txt
    authorization_headers = read_authorizations('query.txt')
    
    # Proses setiap akun yang tersedia pada file query.txt
    for account_number, authorization_header in enumerate(authorization_headers, start=1):
        
        # Proses get informasi user with query
        process_user_info(authorization_header, account_number)

        # Proses get task dan claim tasks
        process_tasks(authorization_header)

if __name__ == "__main__":
    main()

