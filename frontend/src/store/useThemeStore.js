import {create} from "zustand";

export const useThemeStore = create((set) => ({
    theme:localStorage.getItem('StremUp-theme') ||'coffee',
    setTheme: (theme) => {
        localStorage.setItem('StremUp-theme',theme)
        set({theme})
}}));