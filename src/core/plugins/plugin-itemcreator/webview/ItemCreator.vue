<template>
    <div class="form-container">
        <h2>Athena Framework - Item Creator</h2>
        <form class="form">
            <div class="form-group">
                <label for="name">Plugin Name:</label>
                <input
                    type="text"
                    id="pluginName"
                    v-model="pluginName"
                    placeholder="Athena Framework - Item Creator"
                    @change="changeIconInput(), changeInput()"
                />
            </div>
            <div class="form-group">
                <label for="name">Item Name:</label>
                <input
                    type="text"
                    id="name"
                    v-model="name"
                    placeholder="My Super Item"
                    @change="changeIconInput(), changeInput()"
                />
            </div>
            <div class="form-group">
                <label for="dbName">DB Name:</label>
                <input type="text" id="dbName" v-model="dbName" :placeholder="dbName" disabled />
            </div>
            <div class="form-group">
                <label for="icon">Icon:</label>
                <input type="text" id="icon" v-model="icon" :placeholder="icon" disabled />
            </div>
            <div class="form-group">
                <label for="dbName">Consumable Event:</label>
                <input type="text" id="consumableEvent" v-model="eventToCall" placeholder="PLUGIN.EVENTS.DRINK" />
            </div>
            <div class="form-group">
                <label for="data">Data:</label>
                <input type="text" id="data" v-model="data" placeholder="data: { someData: 0 }" />
            </div>
            <div class="form-group">
                <label for="behavior">Behavior:</label>
                <select id="behavior" v-model="behavior">
                    <option value="" disabled>Select behavior</option>
                    <option :value="behaviors[0]">{{ behaviors[0] }}</option>
                </select>
            </div>
            <div class="form-group">
                <label for="stacksize">Stacksize:</label>
                <input type="number" id="stacksize" v-model="stackSize" :placeholder="stackSize" />
            </div>
            <button type="button" class="submit-btn" @click="generateOutput">Create Item</button>
            <button type="button" class="submit-btn" @click="clearList">Clear Array</button>
        </form>
    </div>
</template>

<script>
import WebviewEvents from '@utility/webViewEvents';
export default {
    data() {
        return {
            pluginName: '',
            name: '',
            icon: '',
            eventToCall: 'example-event',
            dbName: '',
            behavior: '',
            data: '',
            behaviors: [{ canDrop: true, canStack: true }],
            stackSize: 64,
            itemList: [],
        };
    },
    mounted() {
        (this.pluginName = 'Item-Creator'),
            (this.name = 'Beer'),
            (this.icon = `@AthenaPlugins/icons/${this.pluginName}/${this.name}`),
            (this.dbName = `${this.pluginName.toLowerCase().replace(/ /g, '-')}-${this.name
                .toLowerCase()
                .replace(/ /g, '-')}`);
        this.behavior = this.behaviors[0];
        this.data = '{ "exampleData": null }';
    },
    methods: {
        generateOutput() {
            const behaviorOutput = `const itemCreatorBehavior = ${JSON.stringify(this.behavior)}`;
            const generatedItem = {
                name: `${this.name}`,
                dbName: `${this.dbName.replace(/ /g, '-')}`,
                behavior: 'itemCreatorBehavior',
                icon: `${this.icon.replace(/ /g, '-')}`,
                data: JSON.parse(this.data),
                consumableEventToCall: `${this.eventToCall}`,
                maxStack: parseInt(this.stackSize),
            };

            this.itemList.push(generatedItem);

            const stringifiedItemList = JSON.stringify(this.itemList);
            const parsedItemList = JSON.parse(stringifiedItemList);
            const output = `import { BaseItem } from "@AthenaShared/interfaces/item"\n\n${behaviorOutput}\nconst itemCreatorArray: Array<BaseItem> = ${JSON.stringify(
                parsedItemList,
                undefined,
                4,
            )}`;

            console.log(behaviorOutput);
            console.log(output);

            WebviewEvents.emitServer('item-creator:generate-file', output);
        },

        clearList() {
            this.itemList = [];
        },

        changeIconInput() {
            this.icon = `@AthenaPlugins/icons/${this.pluginName.toLowerCase().replace(/ /g, '-')}/${this.name
                .toLowerCase()
                .replace(/ /g, '-')}`;
        },

        changeInput() {
            this.dbName = `${this.pluginName.toLowerCase().replace(/ /g, '-')}-${this.name
                .toLowerCase()
                .replace(/ /g, '-')}`;
        },

        changeBehavior(index) {
            this.behavior = this.behaviors[index];
        },
    },
};
</script>

<style>
.form-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    background-color: #161616a9;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    font-family: Arial, sans-serif;
    margin-right: 10%;
}

.form {
    display: grid;
    grid-gap: 20px;
}

.form-group {
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: center;
}

label {
    font-weight: bold;
}

input,
textarea,
select {
    padding: 10px;
    border: none;
    border-radius: 5px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    font-size: 16px;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    box-shadow: 0px 0px 5px rgba(0, 0, 255, 0.5);
}

textarea {
    height: 100px;
}

.submit-btn {
    padding: 10px 20px;
    background-color: #0077cc;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}

.submit-btn:hover {
    background-color: #005fa3;
}
</style>
