export const saveItemToLocalStorage = (key: string, value: Record<string, string>) => {
return localStorage.setItem(key, JSON.stringify(value));
}


export const getItemFromLocalStorage = (key: string) => {
    const data: string | any = localStorage.getItem(key);
return JSON.parse(data);
}

export const clearLocalStorage = () => {
    localStorage.clear();
}