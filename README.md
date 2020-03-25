# EcoCalculator
Want to reduce your carbon footprint? find out how!

[Test Server](https://sebtee.com/eco/)

## [Documentation](https://sebtee.github.io/EcoCalculator/ecocalculator/0.0.0/)

generate documentation command to run in project root file
```shell script
jsdoc -c ./jsDocConf.json *
```

## Setup

Download and install the latest version of [postgres database](https://www.postgresql.org/download/) for your platform.

Once installed log into the postgres command line interface as a super user and run the following commands:
```postgresql
CREATE DATABASE ecocalculator;
CREATE USER ecocalculator WITH PASSWORD 'ecocalculator';
```

In a terminal session run the following commands:
```shell script
git clone https://github.com/SebTee/EcoCalculator.git
cd EcoCalculator
npm install
```
This Downloads the source code and installs the dependencies.

If you are using a unix based operating system like Linux or MacOS you can run the following command to construct and populate the database:
```shell script
psql -d ecocalculator -f ./database/createDB.sql
```

Otherwise you will have to log back into the Postgres command line interface and run the following commands:
```postgresql
\c ecocalculator
\i [absolute path to createDB.sql]
```
Replace `[absolute path to createDB.sql]` with the absolute path to `createDB.sql`. The file is found relative to the project root at `./database/createDB.sql`.

Once this is done navigate to the project root in a terminal session and run this command to start the server:
```shell script
npm start
```

You should now be able to see the web app at `http://localhost:3000` in a browser on the same machine that's running the server.
If you want to access it on another device you need to know the host machine's public IP address. You can access it at `http://[IPaddress]:3000`.

## GitHub users

* [AhmadKhuzaei](https://github.com/AhmadKhuzaei) - Ahmad Al-khuzaei (up879591)

* [Nikki789](https://github.com/Nikki789) - Nikoleta Koleva (up899244)

* [Olliejb1](https://github.com/Olliejb1) - Oliver Borsberry (up896129)

* [up900822](https://github.com/up900822) - Priya Bhatti (up900822)

* [SebTee](https://github.com/SebTee) - Sebastian Tee (up886472)
