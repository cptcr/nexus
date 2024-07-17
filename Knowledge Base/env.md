# .env File
### Benefits of Using .env Files

Using a `.env` file in the development of Discord bots offers several key advantages:

1. **Security**:
   - Keeps sensitive information like bot tokens, database passwords, and API keys out of the main codebase.
   - Reduces the risk of accidentally sharing sensitive information when publishing or sharing your code.
   - Essential for preventing unauthorized access and maintaining the integrity of your bot.

2. **Configuration Management**:
   - Allows for easy management and switching between different configurations without code changes.
   - Facilitates separate configurations for different environments (e.g., development vs. production), helping maintain a clean and manageable codebase.

Using `.env` files helps maintain a clear separation of configuration and code, which is a best practice in software development, especially in projects involving multiple environments or developers.

## The variables described:
```js
ID= //your discord bot id
SECRET= //your discord bot secret
TOKEN=M //your discord bot token
MONGOURI= //your MongoDB Database token
MAINGUILDID= //your test/main/support server
TOS= //your tos url (tos.domain.com for example)
PRIVACY= //your privacy policy url (privacy.domain.com for example)
CMDLOG= //a channel for logged interactions
OPENAI= //your openai API key
REPLICATE= //your replicate ai API key
TWITCHID= //your twitch app developer id
TWITCHSECRET= //your twitch developer secret
OLTOKEN= //your OmenList API Token
OL_VOTE_ROLE= //your role ID for voters
OLAPIKEY= //Your OmenList API Key
TOPGG= //your top.gg API key
TOPGG_VOTE_ROLE= //your top.gg voters role, can be the same as OL_VOTE_ROLE
WHSTK_API_KEY= //your weatherstack api key
INFLUX= //your influx.vision api key
VIRUS_KEY= //your virustotal API key
OWNERID=[ //an array with all owner ids from discord
    "931870926797160538", #toowake
    "998540329995227266", #.soydaddy
    "375276980028833792", #soydaddy
    "822111322548076624" #justin
]
PORT= //the port the website will run on
SITE_SECRET= //your website secret
DOMAIN= //the domain for the website (use localhost:// if you dont have one)
SITE= //if site enabled (type ON or OFF!)
```