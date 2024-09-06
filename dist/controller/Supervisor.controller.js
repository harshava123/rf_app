sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/Device","sap/ui/model/json/JSONModel","sap/m/MessageToast","sap/ui/core/UIComponent"],function(e,t,a,s,r){"use strict";return e.extend("com.app.rfapp.controller.Supervisor",{onInit:function(){var e=new a(sap.ui.require.toUrl("com/app/rfapp/model/data1.json"));this.getView().setModel(e);var t=this.getOwnerComponent().getModel();this.getView().byId("pageContainer").setModel(t);this._fetchUniqueProcessAreas();this.byId("idEmppInput").attachLiveChange(this.onEmployeeIdLiveChange,this);this.applyStoredColors()},onAfterRendering:function(){this.applyStoredColors()},applyStoredColors:function(){var e=localStorage.getItem("themeColor");if(e){this.applyThemeColor(e)}var t=localStorage.getItem("tileColors");if(t){var a=JSON.parse(t);for(var s in a){if(a.hasOwnProperty(s)){this._applyColorToTile(s,a[s])}}}},_applyColorToTile:function(e,t){var a=this.byId(e);if(a){setTimeout(function(){var e=a.getDomRef();if(e){e.style.backgroundColor=t}},0)}},onOpenThemeDialog:function(){this.byId("themeTileDialog").open()},onPaletteIconBtnTilePress:function(e){this._currentTileId=e.getSource().getParent().getParent().getId();this.byId("themeTileDialog").open()},onApplyColor:function(){var e=this.getView();var t=e.byId("colorPicker");var a=t.getColorString();var s=[];var r=this.byId("colorOptions").getItems();r.forEach(function(e){if(e instanceof sap.m.CheckBox&&e.getSelected()){var t=e.getCustomData()[0].getValue();s.push(t)}});if(s.length>0){if(s.length>1){sap.m.MessageToast.show("You can only select one color.");return}if(t.getVisible()){sap.m.MessageToast.show("Please deselect the checkbox before using the custom color picker.");return}var o=s[0];if(this._currentTileId){this.applyColorToTile(this._currentTileId,o);sap.m.MessageToast.show("Tile color applied successfully!");this._currentTileId=null}else{this.applyThemeColor(o);sap.m.MessageToast.show("Theme color applied successfully!")}}else if(this._isValidColor(a)){if(this._currentTileId){this.applyColorToTile(this._currentTileId,a);sap.m.MessageToast.show("Tile color applied successfully!");this._currentTileId=null}else{this.applyThemeColor(a);sap.m.MessageToast.show("Theme color applied successfully!")}}else{sap.m.MessageToast.show("Invalid color format. Please use a valid color code.")}this.resetDialogBox();this.byId("themeTileDialog").close()},onColorOptionSelect:function(e){var t=e.getSource();var a=this.byId("colorOptions").getItems();a.forEach(function(e){if(e instanceof sap.m.CheckBox&&e!==t){e.setSelected(false)}});this.byId("colorPicker").setVisible(!t.getSelected())},applyThemeColor:function(e){var t=[this.byId("toolPage"),this.byId("idSideNavigation"),this.byId("idtntToolHeader"),this.byId("pageContainer")];var a="customThemeStyle";var s=document.getElementById(a);if(s){s.remove()}var r=document.createElement("style");r.id=a;r.textContent=".customTheme { background-color: "+e+" !important; }";document.head.appendChild(r);t.forEach(function(e){if(e){e.addStyleClass("customTheme")}});localStorage.setItem("themeColor",e)},applyColorToTile:function(e,t){var a=this.byId(e);if(a){var s=a.getDomRef();if(s){s.style.backgroundColor=t}var r={};try{var o=localStorage.getItem("tileColors");if(o){r=JSON.parse(o)}}catch(e){console.error("Failed to parse tile colors from localStorage:",e)}r[e]=t;localStorage.setItem("tileColors",JSON.stringify(r));this._currentTileId=null}},_isValidColor:function(e){var t=/^#([0-9A-Fa-f]{3}){1,2}$/;var a=/^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$/;return t.test(e)||a.test(e)},onCancelColorDialog:function(){this.byId("themeTileDialog").close();this.resetDialogBox()},resetDialogBox:function(){var e=this.getView();var t=e.byId("colorPicker");var a=this.byId("colorOptions").getItems();a.forEach(function(e){if(e instanceof sap.m.CheckBox){e.setSelected(false)}});t.setColorString("#FFFFFF");t.setVisible(true)},onRefreshRequestedData:function(){this.onRequestedData();this.onUserData()},onRequestedData:function(){var e=this.byId("idRequestedData");if(e){var t=e.getBinding("items");if(t){t.refresh()}}},onUserData:function(){var e=this.byId("idUserDataTable");if(e){var t=e.getBinding("items");if(t){t.refresh()}}},onItemSelect:function(e){var t=e.getParameter("item");this.byId("pageContainer").to(this.getView().createId(t.getKey()))},onSideNavButtonPress:function(){var e=this.byId("toolPage");var t=e.getSideExpanded();this._setToggleButtonTooltip(t);e.setSideExpanded(!e.getSideExpanded())},_setToggleButtonTooltip:function(e){var t=this.byId("sideNavigationToggleButton");if(e){t.setTooltip("Large Size Navigation")}else{t.setTooltip("Small Size Navigation")}},onApproveUserBtnPress:async function(){debugger;var e=this.getView();if(this.byId("idRequestedData").getSelectedItems().length<1){s.show("Please Select atleast one Resource");return}else if(this.byId("idRequestedData").getSelectedItems().length>1){s.show("Please Select only one Resource");return}var t=this.byId("idRequestedData").getSelectedItem().getBindingContext().getObject();console.log(t);this.oApproveForm??=await this.loadFragment({name:"com.app.rfapp.fragments.ApproveDetails"});this.oApproveForm.open();if(t.Email){e.byId("idEmailInputF").setText(t.Email)}else{e.byId("idEmailInputF").setVisible(false);e.byId("idEmployeeEmailLabelF").setVisible(false)}e.byId("idEmployeeIDInputF").setText(t.Resourceid);e.byId("idNameInputF").setText(t.Resourcename);e.byId("idEmailInputF").setText(t.Email);e.byId("idPhoneInputF").setText(t.Phonenumber);e.byId("idRoesurcetypeInputF").setText(t.Resourcetype);var a=this.getOwnerComponent().getModel();a.read("/ProcessAreaSet",{success:function(e){var t=e.results;var a=new Set;t.forEach(function(e){a.add(e.Processarea)});var s=Array.from(a).map(function(e){return{Processarea:e}});var r=new sap.ui.model.json.JSONModel({ProcessAreas:s});var o=this.byId("idAreaSelect");if(!o){o=sap.ui.core.Fragment.byId("fragmentId","idAreaSelect")}if(o){o.setModel(r);o.bindItems({path:"/ProcessAreas",template:new sap.ui.core.Item({key:"{Processarea}",text:"{Processarea}"})})}else{console.error("MultiComboBox with id 'idAreaSelect' not found.")}this.onRequestedData();this.onUserData()}.bind(this),error:function(e){console.error("Error reading AreaSet:",e)}})},onClose:function(){this.oApproveForm.close()},onApprove:function(){var e=this.byId("idEmployeeIDInputF").getText();var t=this.byId("idNameInputF");var a=this.byId("idEmailInputF");var s=this.byId("idPhoneInputF");var r=this.byId("idRoesurcetypeInputF");var o=this.byId("idAreaSelect");var i=this.byId("idGroupSelect");var l=this.byId("idQueueSelect");var u=t.getText();var n=a.getText();var c=s.getText();var d=r.getText();var p=o.getSelectedKeys().join(",");var h=i.getSelectedKeys().join(",");var f=l.getSelectedKeys().join(",");var g=true;if(p.length===0){o.setValueState(sap.ui.core.ValueState.Error);o.setValueStateText("At least one area must be selected.");g=false}else{o.setValueState(sap.ui.core.ValueState.None);o.setValueStateText("")}if(h.length===0){i.setValueState(sap.ui.core.ValueState.Error);i.setValueStateText("At least one group must be selected.");g=false}else{i.setValueState(sap.ui.core.ValueState.None);i.setValueStateText("")}if(f.length===0){l.setValueState(sap.ui.core.ValueState.Error);l.setValueStateText("At least one queue must be selected.");g=false}else{l.setValueState(sap.ui.core.ValueState.None);l.setValueStateText("")}if(!g){sap.m.MessageToast.show("Please correct the errors before proceeding.");return}function m(){const e=/[A-Za-z@!#$%&]/;const t=8;let a="";for(let s=0;s<t;s++){let t="";while(!t.match(e)){t=String.fromCharCode(Math.floor(Math.random()*94)+33)}a+=t}return a}var v=m();var S=new Date;if(d==="Permanent Employee"){S.setFullYear(S.getFullYear()+1)}else if(d==="Contract Employee"){S.setMonth(S.getMonth()+2)}var I=new Date;var y=this.formatDate(I);var b=this.formatDate(S);var V={Area:p,Email:n,Notification:"your request has been Approved",Phonenumber:c,Queue:f,Resourcegroup:h,Resourceid:e,Resourcename:u,Resourcetype:d,Approveddate:y,Expirydate:b,Password:v,Status:"true",Loginfirst:true};var T=this.getOwnerComponent().getModel();T.update(`/RESOURCESSet('${e}')`,V,{success:function(){sap.m.MessageToast.show("Password updated successfully!");this.resetForm();this.onRequestedData();this.onUserData();this.oApproveForm.close()}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})},_updateComboBoxItems:function(){var e=this.byId("_IDGenComboBox1");var t=this.getView().getModel();var a=t.getProperty("/ProcessAreaSet");var s=[];var r=new Set;a.forEach(function(e){if(!r.has(e.Processarea)){r.add(e.Processarea);s.push(e)}});var o=new sap.ui.model.json.JSONModel({ProcessAreaSet:s});e.setModel(o)},_fetchUniqueProcessAreas:function(){var e=this.getOwnerComponent().getModel();e.read("/ProcessAreaSet",{success:function(e){var t=e.results;var a=new Set;t.forEach(function(e){a.add(e.Processarea)});var s=Array.from(a).map(function(e){return{Processarea:e}});var r=new sap.ui.model.json.JSONModel({ProcessAreas:s});var o=this.byId("AreaSelect");if(!o){o=sap.ui.core.Fragment.byId("fragmentId","AreaSelect")}if(o){o.setModel(r);o.bindItems({path:"/ProcessAreas",template:new sap.ui.core.Item({key:"{Processarea}",text:"{Processarea}"})})}else{console.error("MultiComboBox with id 'AreaSelect' not found.")}}.bind(this),error:function(e){console.error("Error reading AreaSet:",e)}})},onCheckBoxSelect:function(){debugger;var e=this.byId("AreaSelect");var t=e.getSelectedItems();var a=[];t.forEach(function(e){var t=e.getText();a.push(new sap.ui.model.Filter("Processarea",sap.ui.model.FilterOperator.EQ,t))});var s=new sap.ui.model.Filter({filters:a,and:false});var r=this.byId("GroupSelect");var o=this.getOwnerComponent().getModel();o.read("/ProcessAreaSet",{filters:[s],success:function(e){var t=[];var a={};e.results.forEach(function(e){var s=e.Processgroup;if(!a[s]){a[s]=true;t.push({key:s,text:s})}});r.removeAllItems();t.forEach(function(e){r.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});r.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onRejectUserBtnPress:function(){var e=this.getView();var t=this.byId("idRequestedData").getSelectedItems();if(t.length!==1){s.show("Please select exactly one Resource");return}var a=t[0].getBindingContext().getObject();var r=a.Resourceid;var o=this.getOwnerComponent().getModel();o.remove("/RESOURCESSet('"+r+"')",{method:"DELETE",success:function(){s.show("Resource deleted successfully")},error:function(e){s.show("Error deleting resource");console.error("Error deleting resource:",e)}})},onPressCreateArea:function(){this.getView().byId("page1").setVisible(false);this.getView().byId("_IDGenTswfd_able1").setVisible(true)},onCheckBoxSelectGroup:function(){debugger;var e=this.byId("AreaSelect");var t=this.byId("GroupSelect");var a=this.byId("_IDGenComboBox10");var s=e.getSelectedItems();var r=t.getSelectedItems();var o=[];r.forEach(function(e){var t=e.getText();o.push(new sap.ui.model.Filter("Processgroup",sap.ui.model.FilterOperator.EQ,t))});var i=new sap.ui.model.Filter({filters:o,and:false});var l=this.getOwnerComponent().getModel();l.read("/ProcessAreaSet",{filters:[i],success:function(e){var o=[];var i={};var l={};e.results.forEach(function(e){var t=e.Queue;var a=e.Processarea;var s=e.Processgroup;if(!l[a]){l[a]={}}if(!l[a][s]){l[a][s]=[]}l[a][s].push(t);if(!i[t]){i[t]=true;o.push({key:t,text:t})}});var u=true;s.forEach(function(e){var a=e.getText();var s=r.some(function(e){var t=e.getText();return l[a]&&l[a][t]});if(!s){u=false;t.setValueState("Error");t.setValueStateText("Please select at least one group related to the selected areas.");sap.m.MessageToast.show("Please select at least one group related to the selected areas.")}});if(!u){a.removeAllItems();return}t.setValueState("None");a.removeAllItems();o.forEach(function(e){a.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});a.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onCheckBoxSelectQueue:function(){debugger;var e=this.byId("GroupSelect");var t=this.byId("_IDGenComboBox10");var a=e.getSelectedItems();var s=t.getSelectedItems();var r=[];s.forEach(function(e){var t=e.getText();r.push(new sap.ui.model.Filter("Queue",sap.ui.model.FilterOperator.EQ,t))});var o=new sap.ui.model.Filter({filters:r,and:false});var i=this.getOwnerComponent().getModel();i.read("/ProcessAreaSet",{filters:[o],success:function(e){var r={};var o=true;e.results.forEach(function(e){var t=e.Processgroup;var a=e.Queue;if(!r[t]){r[t]=[]}r[t].push(a)});a.forEach(function(e){var a=e.getText();var i=s.some(function(e){var t=e.getText();return r[a]&&r[a].includes(t)});if(!i){o=false;t.setValueState("Error");t.setValueStateText("Please select at least one queue related to the selected groups.");sap.m.MessageToast.show("Please select at least one queue related to the selected groups.")}});if(!o){return}t.setValueState("None")},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onApprovePress:function(){debugger;var e=this.byId("idEmppInput").getValue();var t=this.byId("idNameInput");var a=this.byId("idEmailInput");var s=this.byId("idPhoneInput");var r=this.byId("idRoesurcetypeInput");var o=this.byId("AreaSelect");var i=this.byId("GroupSelect");var l=this.byId("_IDGenComboBox10");var u=t.getValue();var n=a.getValue();var c=s.getValue();var d=r.getValue();var p=o.getSelectedKeys().join(",");var h=i.getSelectedKeys().join(",");var f=l.getSelectedKeys().join(",");var g=true;if(!u){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Name is required.");g=false}else{t.setValueState(sap.ui.core.ValueState.None);t.setValueStateText("")}if(n){var m=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;if(!m.test(n)){a.setValueState(sap.ui.core.ValueState.Error);a.setValueStateText("Invalid email format.");g=false}else{a.setValueState(sap.ui.core.ValueState.None);a.setValueStateText("")}}else{a.setValueState(sap.ui.core.ValueState.None);a.setValueStateText("")}if(!c){s.setValueState(sap.ui.core.ValueState.Error);s.setValueStateText("Phone number is required.");g=false}else{s.setValueState(sap.ui.core.ValueState.None);s.setValueStateText("")}if(!d){r.setValueState(sap.ui.core.ValueState.Error);r.setValueStateText("Resource type is required.");g=false}else{r.setValueState(sap.ui.core.ValueState.None);r.setValueStateText("")}if(p.length===0){o.setValueState(sap.ui.core.ValueState.Error);o.setValueStateText("At least one area must be selected.");g=false}else{o.setValueState(sap.ui.core.ValueState.None);o.setValueStateText("")}if(h.length===0){i.setValueState(sap.ui.core.ValueState.Error);i.setValueStateText("At least one group must be selected.");g=false}else{i.setValueState(sap.ui.core.ValueState.None);i.setValueStateText("")}if(f.length===0){l.setValueState(sap.ui.core.ValueState.Error);l.setValueStateText("At least one queue must be selected.");g=false}else{l.setValueState(sap.ui.core.ValueState.None);l.setValueStateText("")}if(!g){sap.m.MessageToast.show("Please correct the errors before proceeding.");return}function v(){const e=/[A-Za-z@!#$%&]/;const t=8;let a="";for(let s=0;s<t;s++){let t="";while(!t.match(e)){t=String.fromCharCode(Math.floor(Math.random()*94)+33)}a+=t}return a}var S=v();var I=new Date;if(d==="PermanentEmployee"){I.setFullYear(I.getFullYear()+1)}else if(d==="temporaryemployee"){I.setMonth(I.getMonth()+2)}var y=new Date;var b=this.formatDate(y);var V=this.formatDate(I);var T={Area:p,Email:n,Notification:"your request has been Approved",Phonenumber:c,Queue:f,Resourcegroup:h,Resourceid:e,Resourcename:u,Resourcetype:d,Approveddate:b,Expirydate:V,Password:S,Status:"true",Loginfirst:true};var E=this.getOwnerComponent().getModel();E.update(`/RESOURCESSet('${e}')`,T,{success:function(){sap.m.MessageToast.show("Password updated successfully!");this.resetForm();this.onRequestedData();this.onUserData()}.bind(this),error:function(){sap.m.MessageToast.show("Error updating user login status.")}})},formatDate:function(e){var t=e.getFullYear();var a=("0"+(e.getMonth()+1)).slice(-2);var s=("0"+e.getDate()).slice(-2);return`${t}-${a}-${s}`},resetForm:function(){this.byId("idEmppInput").setValue("");this.byId("idNameInput").setValue("");this.byId("idEmailInput").setValue("");this.byId("idPhoneInput").setValue("");this.byId("idRoesurcetypeInput").setValue("");this.byId("AreaSelect").setSelectedKeys([]);this.byId("GroupSelect").setSelectedKeys([]);this.byId("_IDGenComboBox10").setSelectedKeys([]);this.byId("idNameInput").setValueState(sap.ui.core.ValueState.None);this.byId("idEmailInput").setValueState(sap.ui.core.ValueState.None);this.byId("idPhoneInput").setValueState(sap.ui.core.ValueState.None);this.byId("idRoesurcetypeInput").setValueState(sap.ui.core.ValueState.None);this.byId("AreaSelect").setValueState(sap.ui.core.ValueState.None);this.byId("GroupSelect").setValueState(sap.ui.core.ValueState.None);this.byId("_IDGenComboBox10").setValueState(sap.ui.core.ValueState.None);this._queueSelectError=null;this._groupSelectError=null},onEmployeeIdLiveChange:function(e){debugger;var t=e.getSource();var a=t.getValue();var s=this.getOwnerComponent().getModel();if(a.length!==6){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Employee ID must be exactly 6 characters long.");this.byId("idNameInput").setEditable(true).setValue("");this.byId("idEmailInput").setEditable(true).setValue("");this.byId("idPhoneInput").setEditable(true).setValue("");this.byId("idRoesurcetypeInput").setEditable(true).setValue("");return}else{t.setValueState(sap.ui.core.ValueState.None);t.setValueStateText("")}var r=new sap.ui.model.Filter("Resourceid",sap.ui.model.FilterOperator.EQ,a);var o=this;s.read("/RESOURCESSet",{filters:[r],success:function(e){if(e.results.length>0){if(e.results[0].Area){t.setValueState(sap.ui.core.ValueState.Error);t.setValueStateText("Employee ID is already approved.")}else{t.setValueState(sap.ui.core.ValueState.Success);t.setValueStateText("Employee ID already exists.");var a=e.results[0].Email;var s=e.results[0].Resourcename;var r=e.results[0].Phonenumber;var i=e.results[0].Resourcetype;o.byId("idNameInput").setEditable(false).setValue(s);o.byId("idEmailInput").setEditable(false).setValue(a);o.byId("idPhoneInput").setEditable(false).setValue(r);o.byId("idRoesurcetypeInput").setEditable(false).setValue(i)}}else{t.setValueState(sap.ui.core.ValueState.Success);t.setValueStateText("Employee ID is available.")}},error:function(e){t.setValueState(sap.ui.core.ValueState.None);sap.m.MessageToast.show("Error fetching data.");console.error("Error: ",e)}})},onSelectProcesAarea:function(){var e=this.byId("idAreaSelect");var t=e.getSelectedItems();var a=[];t.forEach(function(e){var t=e.getText();a.push(new sap.ui.model.Filter("Processarea",sap.ui.model.FilterOperator.EQ,t))});var s=new sap.ui.model.Filter({filters:a,and:false});var r=this.byId("idGroupSelect");var o=this.getOwnerComponent().getModel();o.read("/ProcessAreaSet",{filters:[s],success:function(e){var t=[];var a={};e.results.forEach(function(e){var s=e.Processgroup;if(!a[s]){a[s]=true;t.push({key:s,text:s})}});r.removeAllItems();t.forEach(function(e){r.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});r.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectGroup:function(){var e=this.byId("idAreaSelect");var t=this.byId("idGroupSelect");var a=this.byId("idQueueSelect");var s=e.getSelectedItems();var r=t.getSelectedItems();var o=[];r.forEach(function(e){var t=e.getText();o.push(new sap.ui.model.Filter("Processgroup",sap.ui.model.FilterOperator.EQ,t))});var i=new sap.ui.model.Filter({filters:o,and:false});var l=this.getOwnerComponent().getModel();l.read("/ProcessAreaSet",{filters:[i],success:function(e){var o=[];var i={};var l={};e.results.forEach(function(e){var t=e.Queue;var a=e.Processarea;var s=e.Processgroup;if(!l[a]){l[a]={}}if(!l[a][s]){l[a][s]=[]}l[a][s].push(t);if(!i[t]){i[t]=true;o.push({key:t,text:t})}});var u=true;s.forEach(function(e){var a=e.getText();var s=r.some(function(e){var t=e.getText();return l[a]&&l[a][t]});if(!s){u=false;t.setValueState("Error");t.setValueStateText("Please select at least one group related to the selected areas.");sap.m.MessageToast.show("Please select at least one group related to the selected areas.")}});if(!u){a.removeAllItems();return}t.setValueState("None");a.removeAllItems();o.forEach(function(e){a.addItem(new sap.ui.core.Item({key:e.key,text:e.text}))});a.setVisible(true)},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},onSelectQueue:function(){var e=this.byId("idGroupSelect");var t=this.byId("idQueueSelect");var a=e.getSelectedItems();var s=t.getSelectedItems();var r=[];s.forEach(function(e){var t=e.getText();r.push(new sap.ui.model.Filter("Queue",sap.ui.model.FilterOperator.EQ,t))});var o=new sap.ui.model.Filter({filters:r,and:false});var i=this.getOwnerComponent().getModel();i.read("/ProcessAreaSet",{filters:[o],success:function(e){var r={};var o=true;e.results.forEach(function(e){var t=e.Processgroup;var a=e.Queue;if(!r[t]){r[t]=[]}r[t].push(a)});a.forEach(function(e){var a=e.getText();var i=s.some(function(e){var t=e.getText();return r[a]&&r[a].includes(t)});if(!i){o=false;t.setValueState("Error");t.setValueStateText("Please select at least one queue related to the selected groups.");sap.m.MessageToast.show("Please select at least one queue related to the selected groups.")}});if(!o){return}t.setValueState("None")},error:function(e){sap.m.MessageToast.show("Failed to fetch data.")}})},OnPressHUQuery:function(){var e=r.getRouterFor(this);e.navTo("HuQuery")},OnPressStockBinQueryByBin:function(){var e=r.getRouterFor(this);e.navTo("StockBinQueryByBin")}})});
//# sourceMappingURL=Supervisor.controller.js.map