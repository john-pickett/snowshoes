# Snowshoes

## For easier Service Now development
Snowshoes allows developers to access their SN code scripts from their local developer IDE. Now you can code in Atom, VSCode, Sublime, or any other editor that you prefer. Snowshoes also allows you to keep the latest version of your code on your local machine for safe-keeping (and for future generations to peruse.)

### Installation

(If you don't have Git and NodeJS installed on your machine, check the Resources section below.)

1) From the command prompt, run `git clone https://github.com/john-pickett/snowshoes.git`. This will clone the package in a folder called `snowshoes`. 

2) `cd snowshoes` and then run `npm i`. 

3) Look in the `/config` folder and edit the `snow-config.json` file with your credentials/info. Put the URl of the instance you're working in, your username and password, and the name of the application you're working on. (Global is not recommended.)

snow-config.json
```
{
	"url" : "https://<your-instance>.service-now.com",
	"username" : "",
	"password" : "",
	"app_name" : "<your-application-name>"
}
```

### Usage

There are three commands available. Type them into the same command line that you used for Git.

`npm run pull` pulls down all Script Includes, Business Rules, UI Actions, Client Scripts, and Mid-server Script Includes for your current application. Support for portal pages and widgets coming soon.

`npm run update <file>` sends the updated version of your script back to SN. Don't include the file extension in your command. Ex: `npm run update "MyFile"`

`npm run update-all` sends every script back to SN and updates them all.

### Resources

If you don't have Git or NodeJS installed, you can grab them here. Git is bundled with terminal that allows you to run the Git commands. NodeJS is bundled with NPM for installing packages.

Git - https://git-scm.com/downloads

NodeJS - https://nodejs.org/en/download/