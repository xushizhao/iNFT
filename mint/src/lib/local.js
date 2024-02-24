const keys={
    login:"ii_user",
    list:"ii_list",
    template:"ii_tpl",
}

const self={
    set:(key,value)=>{
        //console.log(key,value);
        if(keys[key]===undefined) return false;
        const name=keys[key];
        localStorage.setItem(name,value);
        return true;
    },
    get:(key)=>{
        //console.log(map);
        if(keys[key]===undefined) return false;
        const name=keys[key];
        return localStorage[name];
    },
    remove:(key)=>{
        if(keys[key]===undefined) return false;
        const name=keys[key];
        localStorage.removeItem(name);
    },
};

export default self;