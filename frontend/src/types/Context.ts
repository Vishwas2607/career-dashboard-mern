export type AuthenticatedType ={
    isAuthenticated: boolean,
    setAuthenticated: (value:boolean) => void,
}

export type Theme = "light" | "dark";

export type ThemeContextType = {
    theme: Theme
    toggleTheme: () => void
}