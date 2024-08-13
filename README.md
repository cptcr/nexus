# NEXUS

Welcome to NEXUS, a project hosted by Toowake Development.

<p align="center">
  <img src="https://cdn.discordapp.com/avatars/931870926797160538/da905c60878f6cb5cf8b013315465aeb.webp?size=512" width="300" height="300" alt="Description" style="border-radius: 380px">
</p>

<p align="center">
  <a href="#quick-links">Quick Links</a> | <a href="#getting-started">Getting Started</a> | <a href="#terms-of-service">Terms of Service</a> | <a href="#support-us">Support Us</a> | <a href="#credits">Credits</a>
</p>

## Quick Links

- **Panel**: [Nexhost Panel](https://panel.cptcr.cc)
- **Discord**: [Join Our Server](https://discord.gg/cptcr)
- **Docs**: https://docs.cptcr.cc/
- **Website**: https://page.nexus.cptcr.cc

## Built with
<p align="center">
  <a href="https://nodejs.org"><img src="https://wallpaperaccess.com/full/3909225.jpg" width="200" height="100" alt="NodeJS" style="border-radius: 15px; margin-right: 10px;"></a>
  <a href="https://ejs.co/"><img src="https://bitbeans.com/bb_corporate/wp-content/uploads/2020/02/ejs_kv-1024x569.jpg" width="200" height="100" alt="EJS" style="border-radius: 15px; margin-right: 10px;"></a>
  <a href="https://docker.com"><img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-1024.png" width="100" height="100" alt="Docker" style="border-radius: 15px;"></a>
</p>

<p align="center">
  <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/cptcr/nexus">
    <img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare Workers">
  </a>
</p>

## Getting Started

Before you begin, ensure the following:

- A Discord bot ready. Create one at the [Discord Developer Portal](https://discord.com/developers).
- Your bot listed on [top.gg](https://top.gg) and [Omen List](https://omenlist.xyz).
- `.env` file filled out. Tutorial: [.env Tutorial](https://sites.google.com/view/nexusenv/).
- Read the discord.js [Documentation](https://discord.js.org/docs).
- Read the discord.js [Guide](https://discordjs.guide/)
- Install every npm listed in [package.json](https://github.com/cptcr/nexus/blob/main/package.json)

## Nexus Website
The code for the [Wesbite](https://page.nexus.cptcr.cc) can be found at https://github.com/cptcr/nexus/website

## Docker
**Build command**: `docker build -t my-discord-bot .`
**Push to docker registry**:
- *Tag*: `docker tag my-discord-bot myusername/my-discord-bot`
- *Push*: `docker push myusername/my-discord-bot`

### Dockerfiles
**Dockerfile**
```Dockerfile
# Use the official Node.js image from the Docker Hub
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (if applicable)
# EXPOSE 8080

# Define environment variables (if needed)
# ENV NODE_ENV=production

# Run the bot
CMD ["node", "index.js"]
```
**.dockerignore**
```.dockerignore
node_modules
npm-debug.log
Dockerfile
.dockerignore
```
## Update
**Info Point:**
- Added new scripts (check package.json and the files mentioned in scripts)
- Fixed import issues

## Change Log
- Implemented the new handler (code: https://github.com/cptcr/discord-bot-handler)
- Added DevOnly Commands
- Added Custom Commands
- Added DveGuild Commands
- Added User Installed Commands Handler
- Added Blacklist Command
- Added several new commands
- Edited client events

## Terms of Service

- No unauthorized use of the Nexus Logo.
- Code is free and not for sale.
- Terms subject to change without notice.
- Do not claim this code as your own.
- Encouraged to keep bot services free.
- Do not use our Terms and Privacy Policy for your bot.

## Support Us

<p align="center">
  <a href="https://discord.gg/cptcr">
    <img src="https://img.shields.io/discord/1121353922355929129?label=Join%20Our%20Discord&logo=discord&style=flat-square" alt="Discord Server">
  </a>
  <a href="https://patreon.com/cptcr">
    <img src="https://img.shields.io/badge/Patreon-support-ff424d?style=flat-square&logo=patreon" alt="Support on Patreon">
  </a>
  <a href="https://github.com/cptcr">
    <img src="https://img.shields.io/github/followers/cptcr?label=Follow&style=social&logo=github" alt="GitHub">
  </a>
  <a href="https://buymeacoffee.com/cptcr">
    <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-donate-yellow?style=flat-square&logo=buy-me-a-coffee" alt="Buy Me a Coffee">
  </a>
</p>

## Credits

- Discord API Interaction: [discord.js](https://discord.js.org)
- JavaScript runtime environment: [NodeJS](https://nodejs.org/en)
- Code Editor: [Microsoft Visual Studio Code](https://code.visualstudio.com)
- Live Share: [Microsoft Live Share](https://visualstudio.microsoft.com/de/services/live-share/)
- Error Detection Tool: [Alexander Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
- IMDB API: [Tuhin Kanti Pal - IMDB API](https://github.com/tuhinpal/imdb-api)

# Advanced Discord.js Bot/Client Handler

This advanced Discord.js Bot/Client Handler simplifies the development of robust Discord bots through a structured and feature-rich framework. It includes easy-to-use handlers for commands, events, interactions, and more, providing a solid foundation for building sophisticated bots with both custom and developer-only commands.

## Documentation and Inspiration

- **Documentation**: Visit our [comprehensive documentation](https://docs.cptcr.cc) for detailed guidance on implementing and customizing the bot. The documentation might differ slightly but remains a reliable resource for most code implementations.
- **Inspiration**: This project is inspired by content from [MrJAwesome's YouTube channel](https://youtube.com/channel/mrJAwesomeyt), which provides valuable insights into Discord bot development.

## Requirements

| Name            | Minimum                    | Recommended                 |
|-----------------|----------------------------|-----------------------------|
| discord.js      | 14.0.0                     | 14.5.3                      |
| NodeJS          | 14.0.0                     | 16.0.0                      |
| CPU             | 1 GHz single-core          | 2 GHz dual-core             |
| RAM             | 512 MB                     | 1 GB                        |
| Internet Latency| < 200 ms                   | < 100 ms                    |
| Bandwidth       | 1 Mbps download/upload     | 5 Mbps download/upload      |
| Storage         | 1 GB free space            | 2 GB free space             |
| Operating System| Windows, macOS, Linux      | Windows, macOS, Linux       |
| Network         | 1 Mbps download/upload     | 5 Mbps download/upload      |
| Database        | Not required (basic bots)  | MongoDB, MySQL, PostgreSQL  |
| Dependencies    | Basic npm packages         | Managed npm dependencies    |
| Environment     | Local development setup    | Separate dev/prod environments |
| Backup          | Manual backups             | Automated backup solutions  |
| Security        | Basic firewall rules       | Regular updates and security patches |

## Key Features

### Command Handling
- **Easy Command Handling**: Streamline command creation using the dedicated `commands` folder.
- **Event Handling**: Efficient management of Discord.js events through the `Event Handler` folder.
- **Support for Slash Commands**: Incorporate slash commands with ease using the `@discordjs/rest` package.
- **Developer Guild Commands**: Deploy commands exclusively in the developer guild (folder: `src/dev`).
- **Custom Commands**: Facilitate server-specific custom commands and validate their existence (folder: `src/custom-commands`).
- **User Installed Commands**: Utilize Discord's newest features for user-installed commands.

### Configuration and Logging
- **Configurable Settings**: Utilize the `.env` file for essential configurations like tokens and database connections.
- **Interaction Logs**: Automatic logging of interactions within the `logs` folder, generating text files for record-keeping.
- **Error Handling**: Robust error management that logs issues to the console without halting the bot.

### Advanced Features
- **Developer Only Commands**: Restrict certain commands to bot developers for testing and debugging.
- **Token Generator**: Generate tokens for various applications; specific usage is open to developer discretion.
- **Express Handler**: Simplify the management of Express websites within the `express` folder.
- **Component Handling**: Efficient management of interactive components.
- **Multiple Databases Support**: Connect to a database of your choice (MariaDB, MongoDB, Postgres, Redis, SQLite) through `database.config.json`.
- **Sharding**: Integrate a sharding system to scale the bot across multiple servers.
- **Autocomplete**: Implement autocomplete functionality in commands.
- **TypeScript Support**: Full support for both JavaScript and TypeScript, enhancing development flexibility.

## Configuration Details (.env File)

The .env file will be generated automatically at the first start of the bot. Restart after the final setup by using CTRL + C to end the console process and then type node .

## Setup Instructions

1. **Clone the Repository**: Begin by cloning the repository to your local machine or server.
2. **Install Dependencies**: Run `npm install` to install all required dependencies.
3. **Configure the .env File**: Fill in the `.env` file with your bot's specific details like token, database URI, and others.
4. **Run the Bot**: Start your bot using `node src/index.js` or your preferred command as configured in your package.json.

## Community and Support

Join our community on Discord to get support, share ideas, and collaborate with other developers. You can also contribute to the project by submitting pull requests or reporting issues on our GitHub repository.

## Potential Use Cases

- **Gaming Communities**: Enhance engagement with features like game integrations, matchmaking, and more.
- **Educational Platforms**: Use the bot to manage virtual classrooms, distribute assignments, and facilitate learning through quizzes and interactive sessions.
- **Business Operations**: Automate tasks, handle customer inquiries, and streamline communication within teams.

## Getting Started

To get started with this bot handler, clone the repository, configure the .env file as described, and review the documentation to understand the framework structure and feature set. This handler is designed to accommodate both beginner and advanced developers with its extensive customization capabilities and built-in functionality.

## Why Use discord.js Directly Instead of the Sapphire Framework?

Discord.js is a powerful library for interacting with the Discord API, and while frameworks like Sapphire offer additional features and abstractions, there are several reasons why developers might choose to use discord.js directly:

### Direct Control and Flexibility
- **Lower Level Control**: Using discord.js directly provides finer control over bot behavior and interactions. This direct interaction with the API allows for more custom and complex features tailored to specific needs.
- **Flexibility**: Developers can design the architecture and features of their bots without the constraints or assumptions made by higher-level frameworks.

### Learning and Understanding
- **Fundamental Understanding**: Working directly with discord.js encourages a deeper understanding of the Discord API and bot mechanics. This knowledge is invaluable for debugging and extending bot functionality.
- **Community Resources**: discord.js has a vast and active community, with extensive documentation and examples. This makes it easier for new developers to learn and solve issues independently.

### Performance Considerations
- **Reduced Overhead**: Using discord.js without additional frameworks can reduce computational overhead, potentially leading to faster response times and lower resource consumption.
- **Simplicity**: For smaller or less complex bots, the additional features offered by frameworks like Sapphire might not justify the extra layer of complexity and the performance implications.

### Customization
- **Custom Implementations**: Direct use of discord.js allows developers to implement custom solutions that might not be supported or easily achievable within the confines of a framework.
- **Selective Feature Integration**: Developers can choose to integrate only the features they need, potentially leading to a more optimized and efficient bot.

### Dependency and Maintenance
- **Fewer Dependencies**: Operating directly with discord.js means fewer dependencies and potential points of failure related to external frameworks.
- **Up-to-date with Discord API**: Direct use ensures that the latest features of the Discord API are accessible as soon as they are supported by discord.js, without waiting for the framework to catch up.

## Conclusion

Choosing between discord.js and a framework like Sapphire depends on the specific needs and skills of the developer. Those seeking direct control, a deep understanding of Discord bot workings, and high customization might prefer using discord.js directly. Meanwhile, developers looking for quicker deployments and less boilerplate code might opt for frameworks like Sapphire.

## Quick Docs

- **Autocomplete Setup**: [https://docs.sxssy.xyz/commands/autocomplete](https://docs.cptcr.cc/commands/autocomplete)
- **Creating Commands**: [https://docs.sxssy.xyz/commands/creating-commands](https://docs.cptcr.cc/commands/creating-commands)
- **Creating Developer Commands**: [https://docs.sxssy.xyz/commands/creating-developer-commands](https://docs.cptcr.cc/commands/creating-developer-commands)
- **Creating Custom Bot Functions**: [https://docs.sxssy.xyz/building-the-bot/custom-bot-functions](https://docs.cptcr.cc/building-the-bot/custom-bot-functions)
- **Database Integration `MongoDB`**: [https://docs.sxssy.xyz/database/mongodb-connection](https://docs.cptcr.cc/database/mongodb-connection)
- **User Installed Commands**: [https://docs.sxssy.xyz/commands/creating-user-installed-commands](https://docs.cptcr.cc/commands/creating-user-installed-commands)
