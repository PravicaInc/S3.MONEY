#!/bin/sh

arch=`uname -m`

# already installed
if [ -x /usr/local/bin/sui ]; then
  exit 0
fi

# binary present
if [ -x sui-ubuntu-x86_64 ]; then
  cp -p sui-ubuntu-x86_64 /usr/local/bin/sui
  exit 0
fi

if [ "$arch" != "x86_64" ]; then
  echo "unsupported architecture: ${arch}" >&2
  echo "precompiled binaries are only available for x86_64 (amd64)" >&2
  exit 1
fi

set -x

# curl -s -C - -L -O https://github.com/MystenLabs/sui/releases/download/$RELEASE/$RELEASE_ARCHIVE
wget -q https://github.com/MystenLabs/sui/releases/download/$RELEASE/$RELEASE_ARCHIVE
mkdir tmp-sui
cd tmp-sui
tar xzf ../$RELEASE_ARCHIVE
mv `find . -type f -name sui` /bin/sui
cd ..
rm -fr tmp-sui $RELEASE_ARCHIVE

exit 0
