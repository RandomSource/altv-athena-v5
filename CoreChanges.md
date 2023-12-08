#CoreChanges:
//############

-   core/server/:

        -   database/collections.ts: - Changed enum to const & added CustomCollections. Collection Updates need to be converted to const List

    //############

-   core/client/:
-       -   /streamers/textlabel.ts &&
        -   /shared/interfaces/textlabel.ts: Added changeable Scale and TextLabel Color
    //#############
-   tsconfig on Root Folder added Custom Paths:
-   "@GORLServer/_": ["core/plugins/gorl/server/_"],
    "@GORLClient/_": ["core/plugins/gorl/Client/_"],
    "@GORLShared/_": ["core/plugins/gorl/shared/_"],
    "@GORLViews/_": ["core/plugins/gorl/webviews/src/components/_"]
