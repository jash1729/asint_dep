sap.ui.define([
    "com/asint/ais/library/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/core/Fragment",
    "com/asint/ais/library/datasource/asint/Common"
], function (Formatter, JSONModel, ResourceModel, Fragment, CommonDataSource) {

    return Formatter.extend("com.asint.ais.library.utils.Mailer", {

        _baseURI: "",
        _i18n: {},
        _appNamespace: "comasintais",
        _fnEvent: null,

        /**
         * Constructor
         * @param {String} sBaseURI 
         */
        constructor: function (sBaseURI) {
            this._baseURI = sBaseURI;
            this._i18n = new ResourceModel({
                bundleName: "com.asint.ais.library.messagebundle"
            });
            this.dataSource = new CommonDataSource(this._baseURI);

            if (this._baseURI && this._baseURI.includes(".asintais.")) {
                this._appNamespace = this._baseURI.substring(this._baseURI.indexOf(".asintais.") + 10);
            }
        },

        /**
         * Function to load users list
         * 
         * @param {Function} fnSuccess
         * @param {Function} fnError
         */
        fnLoadUsersList: function (fnSuccess, fnError) {
            this.dataSource.getUserList(function (oResponse) {
                var aUserList = [];

                for (var i = 0; i < oResponse.value.length; i++) {
                    aUserList.push({
                        "email": oResponse.value[i].userName,
                        "name": oResponse.value[i].name
                    });
                }
                fnSuccess(aUserList);
            }, function () {
                fnError([]);
            });
        },

        /**
         * Function to open compose mail dialog
         * 
         * @param {Function} _fnEvent
         * @param {Object} oPayload
         */
        open: function (_fnEvent, oPayload) {
            var that = this;

            this._fnEvent = _fnEvent;

            if (!this._oComposeMailDialog) {
                Fragment.load({
                    id: this._appNamespace,
                    name: "com.asint.ais.library.fragment.ComposeEmail",
                    controller: this
                }).then(function (oDialog) {
                    var mMailer = new JSONModel({
                        "data": {
                            "to": oPayload.to || [],
                            "cc": [],
                            "bcc": [],
                            "subject": oPayload.subject,
                            "body": oPayload.body
                        },
                        "userList": [],
                        "metadata": {}
                    });

                    mMailer.setSizeLimit(999999);
                    that._oComposeMailDialog = oDialog;
                    that._oComposeMailDialog.setModel(mMailer, "mMailer");
                    that._oComposeMailDialog.setModel(that._i18n, "i18n");
                    that._oComposeMailDialog.open();
                    that.fnLoadUsersList(function(aUserList) {
                        that._oComposeMailDialog.getModel("mMailer").setProperty("/userList", aUserList);
                    }, function(aUserList) {
                        that._oComposeMailDialog.getModel("mMailer").setProperty("/userList", aUserList);
                    });
                });
            } else {
                that._oComposeMailDialog.getModel("mMailer").setProperty("/data", {
                    "to": oPayload.to || [],
                    "subject": oPayload.subject || "",
                    "body": oPayload.body || ""
                });
                that.fnLoadUsersList(function(aUserList) {
                    that._oComposeMailDialog.getModel("mMailer").setProperty("/userList", aUserList);
                }, function(aUserList) {
                    that._oComposeMailDialog.getModel("mMailer").setProperty("/userList", aUserList);
                });
                that._oComposeMailDialog.open();
            }
        },

        /**
         * Function to send mail
         */
        onSend: function () {
            var that = this;
            var oI18n = sap.ui.getCore().getLibraryResourceBundle("com.asint.ais.library");
            var sLoggedInUserEmail = this.getLoggedInUserMail();
            var sLoggedInUser = this.getLoggedInUserFullname();
            var sSignature = "\n\nThanks,\n";
            var mMailer = this._oComposeMailDialog.getModel("mMailer");
            var oMailData = mMailer.getProperty("/data");

            if(oMailData.subject) {
                oMailData.subject = "[AsInt AIS] " + oMailData.subject.trim();
            }
            if(oMailData.body) {
                if(sLoggedInUser) {
                    sSignature += sLoggedInUser;
                    if(sLoggedInUserEmail) {
                        sSignature += " (" + sLoggedInUserEmail + ")";
                    }
                } else {
                    sSignature += sLoggedInUserEmail;
                }
                oMailData.body += sSignature;
            }
            var oPayload = {
                "to": oMailData.to,
                "cc": oMailData.cc || [],
                "bcc": [],
                "subject": oMailData.subject,
                "body": oMailData.body
            };

            this.dataSource.sendMail(oPayload, function () {
                that._oComposeMailDialog.close();
                that.fnMessageShow("S", oI18n.getText("asint.mail.message.001"));
            }, function () {
                that.fnMessageShow("E", oI18n.getText("asint.mail.message.002"));
            });
        },

        /**
         * Function to close compose mail dialog
         */
        onClose: function () {
            if(this._oComposeMailDialog) {
                this._oComposeMailDialog.close();
            }
        }

    });

});