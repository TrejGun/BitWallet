repo is here
https://github.com/BitGuildPlatform/BitWallet/
to run dev env you have to

```bash
git clone git@github.com:BitGuildPlatform/BitWallet.git
npm i
```

```bash
npm run dist
```

1 go to `builds` and unpack `BitWallet-chrome-0.0.5.zip`
2 open chrome and navigate to chrome://extensions/
3 turn on "developers mode" in top right corner
4 click "load unpacked" and select unpacked zip folder

```bash
npm run dev
```

and navigate to http://localhost:1337/

in this way dev env connects to plugin
connection params are described in 
manifest.json > externally_connectable
this config must be removed in production

also plugin id should be changed in client.js L46

props.networks is not updated properly in dev env
in fact it is coming from browser


