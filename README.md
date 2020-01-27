# Simple API Proxy for D&B Direct+ Typeahead

This is just a simple API-Proxy for D&B Direct+ Typeahead to hide relay your clients request to the D&B API.
If you need full instructions, please scroll to the "Getting Started" section.

## Quick Start (TL;TR)


```
cd {{workdir}}
npm install
```

Create a .env file with the following variables for your environment:
```
KEY=YOURKEY
SECRET=YOURSECRET
DNB_API=https://plus.dnb.com
PORT=3000
```

Start the server in development environment:
```
npm run dev
```
See requirements

___

## Full Instructions

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#Deployment) for notes on how to deploy the project on a live system.

### Prerequisites

Requirenments before you can run this API:

* [Nodejs](https://nodejs.org) >= V8
* [Docker](https://www.docker.com/) If you plan to use a dockerized API

### Installing

Navigate into the working directory of this project an install the dependencies.
To run any further steps, it is recommended to use an IDE (preferably [Visual Studio Code](https://code.visualstudio.com/)) to keep things simple.
To proform any of the following tasks, open a terminal inside VSC.

```
cd {{workdir}}
npm install
```

Create a new file named ".env" inside the root directory of your working dir. Paste the following variables with your values for your environment:
```
KEY=YOURKEY
SECRET=YOURSECRET
DNB_API=https://plus.dnb.com
PORT=3000
```

You are now ready to start the API server in your development environment:
```
npm run dev
```
You should now get a console log with the information on which Port the server is running.

---

### Frontend code sample

To get a quick code example on how to integrade the typeahead functionallity on your website, please refer to the following Repo.


### Scripts available

```
npm run dev
npm start
```
___

## [Deployment](#Deployment)

If you decide to use this repo in your production environment, please concider using additional security packages/methods like the following examples:
* cors (restrict to your FQDN)
* [helmet](https://www.npmjs.com/package/helmet)
* [Rate-limit](express-rate-limit)
* [xss-clean](xss-clean) (if you use any database queries)
* [HPP](https://www.npmjs.com/package/hpp)

### Dockerize the API
To run the API inside a docker container, you firt need to create an image. Run the following command from the working directory.
```
docker build -t dnb-api:latest .
```
When the command completed successfully, you can check the new image 'dnb-api' with this docker command.
```
docker images
```
If you see the image listet, you are now ready to start the container with the following command and check the logs for any output.
> Please use your own port mapping as required for your environment
```
docker run -d -p 3000:3000 --name dnb-api dnb-api
docker logs dnb-api
```
You should see a message saying your login was successfull.
___
## [Issues](#Issues)

If you have trouble starting the API with npm start, please check the "PORT" variable in your .env file and run the following command with your port: (Linux/MAC for port 3000)

```
netstat -nlp | grep :3000
```
If the outpout shows something running on this port (example below), please change the port in your environment or kill the process.

```
tcp6       0      0 :::3000                 :::*                    LISTEN      7556/node
```

To kill the process, run the following command with the process number. (7556 from previous command)
```
kill 7556
```

## Authors

* Daniel Baumann - *Product Manager at Bisnode D&B Schweiz AG*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details