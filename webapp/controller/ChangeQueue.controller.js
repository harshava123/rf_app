sap.ui.define(
    [
        "sap/ui/core/mvc/Controller"
    ],
    function (Controller) {
        "use strict";

        return Controller.extend("com.app.rfapp.controller.ChangeQueue", {
            onInit: function () {
            },
            OnpressBackFromChangeQueue:function(){
                const oRoute =this.getOwnerComponent().getRouter()
                oRoute.navTo("Supervisor")
            }
        });
    }
);
