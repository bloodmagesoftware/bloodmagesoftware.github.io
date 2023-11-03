#!/bin/sh
curl 'https://avatars.githubusercontent.com/u/148340337?s=128&v=4' -o public/favicon.png
mkdir -p public/hotlink-ok
curl 'https://avatars.githubusercontent.com/u/148340337?s=512&v=4' -o public/hotlink-ok/preview.png

mkdir -p ./public/fonts/
getfont() {
    curl -L -o "./public/fonts/$2" "$1"
}
getfont 'https://fonts.gstatic.com/s/inika/v21/rnCm-x5X3QP-piTAT8YUsHXG.woff2' 'inika.woff2'

