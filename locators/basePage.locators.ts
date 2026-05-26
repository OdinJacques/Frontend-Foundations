import type { LocatorObj } from '../types';

export const basePageLocators: LocatorObj = {
    // XPath Locators

    // CSS Selector Locators
    openBurgerMenuBtn:  '[id="react-burger-menu-btn"]',
    closeBurgerMenuBtn: '[id="react-burger-cross-btn"]',
    burgerMenu:         '.bm-menu-wrap',
    logoutLink:         '[id="logout_sidebar_link"]',
    resetAppStateLink:  '[id="reset_sidebar_link"]',
};
