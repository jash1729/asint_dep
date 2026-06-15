// import { browser, $ } from '@wdio/globals';

// class BtpLoginPage {

//     /* =========================
//        SELECTORS
//     ========================== */

//     private get asIntLoginLink() { return $('a.saml-login-link'); }
//     private get usernameInput() { return $('#j_username'); }
//     private get passwordInput() { return $('#j_password'); }
//     private get continueButton() { return $('#logOnFormSubmit'); }
//     private get homeTile() { return $('//a[contains(@aria-label,"Asset Inspection")]'); }
//     private get loginError() { return $('//div[contains(@class,"sapMMessage")]'); }

//     /* =========================
//        POPUP HANDLER
//     ========================== */

//     /**
//      * Internal helper to clear SAP lightboxes/popups that block the UI
//      */
//     private async closeSapPopupIfPresent(): Promise<void> {
//         const selectors = [
//             "//button[@title='Close Lightbox']",
//             "//button[@aria-label='Close']"
//         ];

//         // Brief pause to allow SAP animations to trigger the popup
//         await browser.pause(2000);

//         for (const selector of selectors) {
//             try {
//                 const element = await $(selector);
//                 if (await element.isDisplayed()) {
//                     await element.click();
//                     console.log(`[STATUS] Successfully closed SAP popup using selector: ${selector}`);
//                     // Wait for the overlay to disappear completely
//                     await element.waitForDisplayed({ reverse: true, timeout: 5000 });
//                     return;
//                 }
//             } catch {
//                 // Ignore if selector is not found
//             }
//         }
//     }


//     /* =========================
//        ACTIONS
//     ========================== */

//     /* =========================
//         ACTIONS
//     ========================== */

//     async open(appUrl: string): Promise<void> {
//         await browser.url(appUrl);
//     }

//     async login(username: string, password: string): Promise<void> {
//         // --- ADDED VALIDATION FOR RELIABILITY ---
//         if (!username || !password) {
//             throw new Error(`[ERROR] Login failed: Username or Password is undefined. 
//             Check if BTP_USERNAME and BTP_PASSWORD are correctly set in your .env file.`);
//         }

//         // Step 0: AsInt Log-On
//         await this.asIntLoginLink.waitForClickable({ timeout: 30000 });
//         await this.asIntLoginLink.click();

//         // Step 1: Username
//         await this.usernameInput.waitForDisplayed({ timeout: 15000 });
//         await this.usernameInput.setValue(username);
//         await this.continueButton.click();

//         // Step 2: Password
//         await this.passwordInput.waitForDisplayed({ timeout: 15000 });
//         await this.passwordInput.setValue(password);
//         await this.continueButton.click();
//     }

//     /* =========================
//        VERIFICATIONS
//     ========================== */

//     async isLoginSuccessful(): Promise<boolean> {
//         try {
//             // First, clear any blocking popups
//             await this.closeSapPopupIfPresent();
            
//             // Now check for the home tile
//             await this.homeTile.waitForDisplayed({ timeout: 30000 });
//             return true;
//         } catch {
//             return false;
//         }
//     }

//     async isLoginFailed(): Promise<boolean> {
//         try {
//             // Clear popups first as they might mimic a failure state
//             await this.closeSapPopupIfPresent();

//             if (await this.loginError.isDisplayed()) {
//                 return true;
//             }
//             await this.homeTile.waitForDisplayed({ timeout: 10000 });
//             return false;
//         } catch {
//             return true;
//         }
//     }
// }

// export default new BtpLoginPage();