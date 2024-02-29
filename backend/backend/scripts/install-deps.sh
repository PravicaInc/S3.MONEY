#!/bin/sh -x

if [ ! -d $HOME/.move/https___github_com_MystenLabs_sui_git_framework__testnet ]; then
  git clone https://github.com/MystenLabs/sui.git $HOME/.move/https___github_com_MystenLabs_sui_git_framework__testnet
fi

exit 0
