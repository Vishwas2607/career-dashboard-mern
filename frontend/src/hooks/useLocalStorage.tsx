import { useState } from "react"

export default function useLocalStorage<T>(key:string, initialValue:T): [T,(value:T)=> void]{

    const [savedValue, setValue] = useState<T>(()=> {
        try{
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : initialValue
        } catch (err) {
            console.error(err)
            return initialValue
        }
})

    const setSavedValue = (value: T) => {
        localStorage.setItem(key,JSON.stringify(value));
        setValue(value);
    }
    return [savedValue,setSavedValue]
};