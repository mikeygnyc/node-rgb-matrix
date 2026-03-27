#!/bin/bash
docker build -t pibuilder --platform linux/armhf .
rm -rf ./pi_build/
mkdir -p ./pi_build/
rsync -av --info=progress2 --exclude 'pi-builder' --exclude 'node_modules' ../ ./pi_build/
rm -rf ./pi_build/node_modules
mv ../node_modules ../_node_modules
mv ../package-lock.json ../_package-lock.json
docker run  -it --platform linux/armhf -v ./pi_build:/root/pi_build pibuilder /bin/bash -c "export PATH=/root/.nvm/versions/node/v22.22.2/bin:\$PATH && cd /root/pi_build/ && npm ci --include=dev --verbose && npm rebuild canvas --build-from-source --verbose"
mv pi_build/node_modules ../node_modules
mv pi_build/package-lock.json ../package-lock.json
echo 'Changes will be pushed to Raspberry Pi' 
cd ../
node sync.mjs
echo 'Local cleanup'
rm -rf node_modules package-lock.json
mv _node_modules node_modules
mv _package-lock.json package-lock.json
echo 'Done'
