# Pause Menu

Plugin by Stuyk

---

## Installation

Take the contents of this `.zip` file and place them into the following directory:

```
./src/core/plugins/private-pause-menu
```

Run the framework, and you should see the plugin registered in the startup, or you can go in-game and press `ESCAPE` to see the pause menu.

**Important**

If you decide to not name this folder `private-pause-menu` you will need to rename the folder name in `./src/core/plugins/this-plugin/shared/config.ts`.

Look for the entry and rename accordingly.

```
const PLUGIN_FOLDER_NAME = 'private-pause-menu';
```


---

## What is this?

It's a pause menu that overrides the default GTA:V menu. When a player presses escape during gameplay they will see a menu with a handful of default options.

- Map
- Options
- Exit Game

This plugin allows you to also append custom options to the Pause Menu, these custom options will call an event on client-side and you can determine what to show the player after they invoke an option.

---

## Usage

### add

This will allow you to add custom options which can be added at runtime.

```ts
PrivatePauseMenu.options.add({ eventName: 'my-custom-option', text: 'Custom Option!' }, () => {
    console.log('~y~INVOKED!!!');
});
```

### remove

Removes a custom option entry.

```ts
PrivatePauseMenu.options.remove('my-custom-option');
```

### set

Replaces all custom options with an Array of options.

```ts
function doSomething() {
    console.log('hello!')
}

const options = [
    { 
        eventName: 'my-custom-option', 
        text: 'Custom Option!',
        callback: doSomething
    }
]

PrivatePauseMenu.options.set(options);
```

### reset

Empties the custom options array.

```ts
PrivatePauseMenu.options.reset();
```