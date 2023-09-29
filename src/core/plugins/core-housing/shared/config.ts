export const HOUSE_SETTINGS = {
    Label: {
        Enable: true,
        Range: 35.0,
        Color: 0,
    },
    EnterExit: {
        UseColShape: false, // Default your need to Interact with the House realistic
        FadeEffect: true, // FadeIn & Fadeout a Black Screen while Enter/Exit the House
        WalkEffect: true, // Play a Walk Animation if u Enter/Exit a House
        UseKeyItem: true, // You need the right Key in the Inventory/ToolBar , otherwise
    },
    Keys: {
        Interaction: 'E',
        EnterExit: 'E',
    },
    Storage: {
        Enable: true,
        MaxItems: 20,
    },
    Animation: {
        Walk: '',
        Interact: '',
    },
    // Features that avaible inside the Housing
    Features: {
        Fridge: false, // Player can use a Fridge to Store Food ...
        Sleep: false, // Player can use a Bed , just for Logout/Login - RP
        Tresor: false, // Player can Store, Weapons(No Heavy Weapons,Melee,Pistols & Limited) ,Cash, Importend Items -> Licences,Documents
        GunCapinet: false, // Player can Store ArmorVest, Weapons exp Rifles
    },
};
