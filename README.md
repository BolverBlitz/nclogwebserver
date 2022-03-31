nclogwebserver
=====
Command line pastebin for sharing terminal output written in JS.  
Inspired by [fiche](https://github.com/solusipse/fiche) with support for multiple data storage options.  

# Client-side usage
Post your logs:
```sh
echo "Hello world" | nc ncc.ebg.pw 10021
```

You´ll get a domain as response.  
Get your logs:
Open it in your browser or `curl https://nc.ebg.pw/fetch/13neazsxrl`in your terminal.

# Server-side setup
```sh
git clone https://github.com/BolverBlitz/nclogwebserver
cd ./nclogwebserver
npm i
mv ./.env.example ./.env
nano .env
node .
```

# Environment File
```env
WebPORT: Port the webserver should run on (Default: 5000)
WebURL: The Public/Private URL returned in the response
localIP: IP the netcatserver should use (Default: 0.0.0.0)
NCPort: Port the netcatserver shound run on (Default: 5555)

LOG_LEVEL: 1 (Errors only), 2 (Errors and Warnings), 3 (Everything)
servername: Name of this application, justused for logs

Enable_Static: Enable serving of a extra folder with static content, like a welcome message
Enable_Static_List: Enable listing all files of that static content folder.


DB_Driver: pgsql, mysql, files
Below the DB login info, if using files you can leave that empty.
```

# Databases
- PostgreSQL (pgsql): Data will be stored as TEXT (Unlimited length)
- MySQL (mysql): Data will be stored as MEDIUMTEXT  (16,777,215 characters)
- Filesystem (files): Data will be stored as files

# Static Content
If enabled, it will be served under the /static route  

# Errors
- Error on saving your Request: Something is wrong, more information might be in the logs
- Error in generating your uuid: No more unused strings for the request (By default: 3.6561584e+15)
