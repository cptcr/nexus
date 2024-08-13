# Handling Components

## What are components?
### ActionRow
`ActionRow` is a layout component used in Discord to organize other interactive components such as buttons, select menus, and input fields in a single horizontal row. It ensures a cleaner and more structured presentation of interactive elements within messages or modals. Each `Action.Cumhass multiple `ActionRow`s to separate interactive components visually and logically.

### Button
`Button` is an interactive component that users can click on in a Discord message or modal. Buttons can be used to trigger specific actions defined in a bot's code. They can be customized with labels, colors, and emojis, and can be styled as filled or outlined. Buttons are commonly used for submitting forms, controlling bot functions, and navigating through custom content.

### ChannelSelectMenus
`ChannelSelectMenus` allow users to select a channel from a dropdown menu within a Discord message or modal. This component is useful for commands or functions that require the user to specify a channel, such as setting a notification channel or choosing a channel to post messages to. Channel select menus help streamline workflows that involve multiple channels.

### RoleSelectMenus
`RoleSelectMenus` enable users to select one or more server roles from a dropdown menu. This component is typically used in role management features, such as allowing users to self-assign roles or for bots to manage role assignments based on user interactions. Role select menus support customization to include specific roles and can limit selections based on user permissions.

### SelectMenus
`SelectMenus` are generic dropdown menus that provide users with multiple options to choose from. Each option in a select menu can carry a value and a label, and developers can configure these menus to allow single or multiple selections. Select menus are versatile and can be used for various purposes like polls, filters, or any other feature that requires user selection from a list.

### StringSelectMenus
`StringSelectMenus` are a specific type of select menu where the options are primarily strings. This component is used when users need to choose from a list of string-based options, such as selecting a response, choosing a name from a list, or any other action that involves selecting from textual options.

### UserSelectMenus
`UserSelectMenus` allow users to select one or more users from a dropdown menu within the Discord interface. This is particularly useful for features that require targeting specific users, such as initiating a private message, assigning tasks or roles, or selecting participants for a game or event. User select menus enhance interaction by integrating user selection directly into the Discord UI.

Each of these components plays a critical role in creating interactive and engaging applications on Discord, making it easier for users to navigate and interact with bots and custom systems.

## How to handle these?
For this we made a handler to easier manage them. You need to create a file in the `src/Component_Handler/NameOfTheComponent` folder.

Example Situation:
- You have a button in your command and its custom id is test-button (The custom id of each component you'd like to handle is important!)
- The type of the component is as mentioned before a `Button`

Now since we have this information we go to `src/Component_Handler/Buttons`.

In there you create a JavaScript file with the name of the custom id (`test-button`).

Now we have `src/Component_Handler/Buttons/test-button.js`

In this file we use this code:
```js
//Exporting the run function
module.exports = {
    async run(interaction, client) { //creating a asyn run function, this is where we handle the interaction
        //replying to the interaction with "You are cool!" in a interaction.user only visible message
        return await interaction.reply({
            content: "You are cool!", //content for the reply
            ephemeral: true //tag for invisible messages
        })
    }
}
```