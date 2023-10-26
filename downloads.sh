#!/bin/sh
curl 'https://avatars.githubusercontent.com/u/148340337?s=128&v=4' -o public/favicon.png
mkdir -p public/hotlink-ok
curl 'https://avatars.githubusercontent.com/u/148340337?s=512&v=4' -o public/hotlink-ok/preview.png
