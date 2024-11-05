#!/bin/sh -x

# currently only supports testnet
if [ ! -d $HOME/.move/https___github_com_MystenLabs_sui_git_framework__testnet ]; then
  # does a shallow pull to speed things up
  git clone --depth 1 -b framework/testnet https://github.com/MystenLabs/sui.git $HOME/.move/https___github_com_MystenLabs_sui_git_framework__testnet
else
  cd $HOME/.move/https___github_com_MystenLabs_sui_git_framework__testnet
  git pull
fi

exit 0
