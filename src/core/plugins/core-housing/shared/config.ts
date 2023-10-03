import * as alt from 'alt-shared';
export const HOUSE_SETTINGS = {
    MaxHouses: 300, // IY
    DistanceToNextHouse: 15.0, // IY
    Label: {
        Enable: true, // IY
        Range: 10.0, // IY
        Scale: 0.3, // IY
        Color: new alt.RGBA(0, 255, 0, 255), // IY
        ShowOwner: true, // IY
    },
    Blip: {
        Enable: true, // IY
        SoldBlipColor: 1, // Red // IY
        SaleBlipColor: 2, // Green // IY
        RentableBlipColor: 47, // Orange // IY
        LockedBlipColor: 39, // Light Grey // IY
        HouseBlip: 40, // IY
    },
    EnterExit: {
        UseColShape: false, // Default your need to Interact with the House realistic - NIY
        FadeEffect: true, // FadeIn & Fadeout a Black Screen while Enter/Exit the House - NIY
        WalkEffect: true, // Play a Walk Animation if u Enter/Exit a House - NIY
        UseKeyItem: true, // You need the right Key in the Inventory/ToolBar , otherwise it compares die OwnerDBId with the PlayerDBId - NIY
    },
    Keys: {
        // - NIY
        Interaction: 'E', // - NIY
        EnterExit: 'E', // - NIY
        MaxKeysPerHouse: 10, // - NIY
        MaxKeysPerCompany: 30, // - NIY
    },
    Storage: {
        // - NIY
        Enable: true, // - NIY
        MaxItems: 20, // - NIY
    },
    Animation: {
        // - NIY
        Walk: '', // - NIY
        Interact: '', // - NIY
    },
    // Features that avaible inside the Housing
    Features: {
        // - NIY
        Fridge: false, // Player can use a Fridge to Store Food ... - NIY
        Sleep: false, // Player can use a Bed , just for Logout/Login - RP - NIY
        Tresor: false, // Player can Store, Weapons(No Heavy Weapons,Melee,Pistols & Limited) ,Cash, Importend Items -> Licences,Documents - NIY
        GunCapinet: false, // Player can Store ArmorVest, Weapons exp Rifles - NIY
    },
};
