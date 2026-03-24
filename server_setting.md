# 1. 배포 폴더 생성 및 권한 부여
sudo mkdir -p /var/www/oliverslife
sudo chown -R ubuntu:ubuntu /var/www/oliverslife

# 2. 필수 도구 설치 (NVM, Node, PM2)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
npm install -g pm2